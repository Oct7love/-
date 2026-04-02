import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getUserUsage, getUserPlanLimits } from "@/lib/usage";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "请先登录" } },
      { status: 401 }
    );
  }

  try {
    const [usage, limits] = await Promise.all([
      getUserUsage(session.user.id),
      getUserPlanLimits(session.user.id),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        usage,
        limits,
      },
    });
  } catch (error) {
    console.error("Usage query error:", error);
    return NextResponse.json(
      {
        success: false,
        error: { code: "INTERNAL_ERROR", message: "查询用量失败" },
      },
      { status: 500 }
    );
  }
}
