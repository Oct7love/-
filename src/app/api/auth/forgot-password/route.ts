import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const forgotPasswordSchema = z.object({
  email: z.string().email("请输入有效的邮箱地址"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = forgotPasswordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "VALIDATION_ERROR", message: "请输入有效的邮箱地址" },
        },
        { status: 400 }
      );
    }

    const { email } = parsed.data;

    const [user] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json({
        success: true,
        data: { message: "如果该邮箱已注册，重置链接已发送" },
      });
    }

    // TODO: Generate reset token + send email via Resend
    // For now, just log and return success
    console.log(`Password reset requested for user ${user.id} (${email})`);

    return NextResponse.json({
      success: true,
      data: { message: "如果该邮箱已注册，重置链接已发送" },
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      {
        success: false,
        error: { code: "INTERNAL_ERROR", message: "服务器内部错误" },
      },
      { status: 500 }
    );
  }
}
