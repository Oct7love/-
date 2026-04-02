import { db } from "@/lib/db";
import { usageRecords, subscriptions, users, resumes } from "@/lib/db/schema";
import { eq, and, gte, isNull, count } from "drizzle-orm";
import { siteConfig } from "@/config/site";

const TRIAL_DAYS = 7;

type Action = "diagnose" | "rewrite" | "jd_match" | "chat";

interface UsageSummary {
  diagnoses: number;
  rewrites: number;
  resumeCount: number;
}

interface QuotaCheck {
  allowed: boolean;
  remaining: number;
  limit: number;
  message?: string;
}

function getMonthStart(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
}

export async function getUserUsage(userId: string): Promise<UsageSummary> {
  const monthStart = getMonthStart();

  const records = await db
    .select({ action: usageRecords.action })
    .from(usageRecords)
    .where(
      and(
        eq(usageRecords.userId, userId),
        gte(usageRecords.createdAt, monthStart)
      )
    );

  const diagnoses = records.filter(
    (r) => r.action === "diagnose" || r.action === "jd_match"
  ).length;
  const rewrites = records.filter(
    (r) => r.action === "rewrite" || r.action === "chat"
  ).length;

  const resumeCountResult = await db
    .select({ count: count() })
    .from(resumes)
    .where(
      and(
        eq(resumes.userId, userId),
        isNull(resumes.deletedAt)
      )
    );

  return {
    diagnoses,
    rewrites,
    resumeCount: resumeCountResult[0]?.count ?? 0,
  };
}

export async function getUserPlanLimits(userId: string) {
  const [sub] = await db
    .select({ planId: subscriptions.planId, status: subscriptions.status })
    .from(subscriptions)
    .where(
      and(
        eq(subscriptions.userId, userId),
        eq(subscriptions.status, "active")
      )
    )
    .limit(1);

  if (sub) {
    return { ...siteConfig.limits.pro, isTrial: false, isPro: true };
  }

  // Check if user is within 7-day trial period
  const [user] = await db
    .select({ createdAt: users.createdAt })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (user?.createdAt) {
    const trialEnd = new Date(user.createdAt);
    trialEnd.setDate(trialEnd.getDate() + TRIAL_DAYS);
    if (new Date() < trialEnd) {
      return { ...siteConfig.limits.pro, isTrial: true, isPro: true, trialEndsAt: trialEnd };
    }
  }

  return { ...siteConfig.limits.free, isTrial: false, isPro: false };
}

export async function checkQuota(
  userId: string,
  action: Action
): Promise<QuotaCheck> {
  const limits = await getUserPlanLimits(userId);
  const usage = await getUserUsage(userId);

  switch (action) {
    case "diagnose": {
      const limit = limits.aiDiagnosesPerMonth;
      if (limit === -1) return { allowed: true, remaining: -1, limit: -1 };
      const remaining = limit - usage.diagnoses;
      return {
        allowed: remaining > 0,
        remaining: Math.max(0, remaining),
        limit,
        message: remaining <= 0 ? "本月 AI 诊断次数已用完，请升级专业版" : undefined,
      };
    }
    case "rewrite":
    case "chat": {
      const limit = limits.aiRewritesPerMonth;
      if (limit === -1) return { allowed: true, remaining: -1, limit: -1 };
      const remaining = limit - usage.rewrites;
      return {
        allowed: remaining > 0,
        remaining: Math.max(0, remaining),
        limit,
        message: remaining <= 0 ? "本月 AI 改写次数已用完，请升级专业版" : undefined,
      };
    }
    case "jd_match": {
      const limit = limits.aiDiagnosesPerMonth;
      if (limit === -1) return { allowed: true, remaining: -1, limit: -1 };
      const remaining = limit - usage.diagnoses;
      return {
        allowed: remaining > 0,
        remaining: Math.max(0, remaining),
        limit,
        message: remaining <= 0 ? "本月 AI 分析次数已用完，请升级专业版" : undefined,
      };
    }
    default:
      return { allowed: true, remaining: -1, limit: -1 };
  }
}

export async function checkResumeLimit(userId: string): Promise<QuotaCheck> {
  const limits = await getUserPlanLimits(userId);
  const usage = await getUserUsage(userId);

  const limit = limits.maxResumes;
  if (limit === -1) return { allowed: true, remaining: -1, limit: -1 };
  const remaining = limit - usage.resumeCount;
  return {
    allowed: remaining > 0,
    remaining: Math.max(0, remaining),
    limit,
    message: remaining <= 0 ? "简历数量已达上限，请升级专业版" : undefined,
  };
}

export async function recordUsage(
  userId: string,
  action: string,
  metadata: {
    resumeId?: string;
    tokensUsed?: number;
    costCents?: number;
  } = {}
) {
  await db.insert(usageRecords).values({
    userId,
    action,
    resumeId: metadata.resumeId,
    tokensUsed: metadata.tokensUsed ?? 0,
    costCents: metadata.costCents ?? 0,
    metadata: metadata,
  });
}
