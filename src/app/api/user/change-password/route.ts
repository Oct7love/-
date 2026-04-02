import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { compare, hash } from "bcryptjs";
import { z } from "zod";

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "请输入当前密码"),
  newPassword: z
    .string()
    .min(8, "密码至少 8 个字符")
    .regex(/[A-Z]/, "密码需包含至少一个大写字母")
    .regex(/[a-z]/, "密码需包含至少一个小写字母")
    .regex(/[0-9]/, "密码需包含至少一个数字"),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "请先登录" } },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const parsed = changePasswordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: parsed.error.errors[0]?.message ?? "请求参数校验失败",
          },
        },
        { status: 400 }
      );
    }

    const { currentPassword, newPassword } = parsed.data;

    const [user] = await db
      .select({ passwordHash: users.passwordHash })
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1);

    if (!user?.passwordHash) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "FORBIDDEN", message: "该账户不支持密码修改" },
        },
        { status: 403 }
      );
    }

    const isValid = await compare(currentPassword, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "VALIDATION_ERROR", message: "当前密码错误" },
        },
        { status: 400 }
      );
    }

    const newHash = await hash(newPassword, 12);
    await db
      .update(users)
      .set({ passwordHash: newHash, updatedAt: new Date() })
      .where(eq(users.id, session.user.id));

    return NextResponse.json({
      success: true,
      data: { message: "密码已更新" },
    });
  } catch (error) {
    console.error("Change password error:", error);
    return NextResponse.json(
      {
        success: false,
        error: { code: "INTERNAL_ERROR", message: "服务器内部错误" },
      },
      { status: 500 }
    );
  }
}
