import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const registerSchema = z.object({
  email: z.string().email("请输入有效的邮箱地址"),
  password: z
    .string()
    .min(8, "密码至少 8 个字符")
    .regex(/[A-Z]/, "密码需包含至少一个大写字母")
    .regex(/[a-z]/, "密码需包含至少一个小写字母")
    .regex(/[0-9]/, "密码需包含至少一个数字"),
  name: z.string().min(1, "请输入昵称").max(50, "昵称不超过 50 个字符"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "请求参数校验失败",
            details: parsed.error.flatten().fieldErrors,
          },
        },
        { status: 400 }
      );
    }

    const { email, password, name } = parsed.data;

    const existing = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "CONFLICT",
            message: "该邮箱已被注册",
          },
        },
        { status: 409 }
      );
    }

    const passwordHash = await hash(password, 12);

    const [newUser] = await db
      .insert(users)
      .values({
        email,
        passwordHash,
        name,
        provider: "email",
      })
      .returning({
        id: users.id,
        email: users.email,
        name: users.name,
        createdAt: users.createdAt,
      });

    return NextResponse.json(
      {
        success: true,
        data: {
          user: newUser,
          message: "注册成功",
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "服务器内部错误",
        },
      },
      { status: 500 }
    );
  }
}
