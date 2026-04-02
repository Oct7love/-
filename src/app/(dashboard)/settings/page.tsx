"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import {
  User,
  CreditCard,
  Shield,
  Bell,
  Check,
  Sparkles,
  AlertTriangle,
  Loader2,
} from "lucide-react";

export default function SettingsPage() {
  const { data: session } = useSession();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profileLoading, setProfileLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch("/api/user/profile");
        if (!res.ok) throw new Error();
        const data = await res.json();
        setName(data.data.name ?? "");
        setEmail(data.data.email ?? "");
      } catch {
        if (session?.user) {
          setName(session.user.name ?? "");
          setEmail(session.user.email ?? "");
        }
      } finally {
        setProfileLoading(false);
      }
    }
    loadProfile();
  }, [session]);

  async function handleSaveProfile() {
    setSaving(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error?.message);
      }
      toast.success("已保存");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "保存失败");
    } finally {
      setSaving(false);
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("两次输入的密码不一致");
      return;
    }
    setChangingPassword(true);
    try {
      const res = await fetch("/api/user/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message);
      }
      toast.success("密码已更新");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "修改失败");
    } finally {
      setChangingPassword(false);
    }
  }

  const displayName = name || session?.user?.name || "用户";

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">设置</h1>
        <p className="text-gray-500 mt-1">管理你的账户和偏好</p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">
            <User className="h-4 w-4 mr-1" />
            个人信息
          </TabsTrigger>
          <TabsTrigger value="subscription">
            <CreditCard className="h-4 w-4 mr-1" />
            订阅管理
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="h-4 w-4 mr-1" />
            安全
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>个人信息</CardTitle>
              <CardDescription>更新你的个人资料</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="text-xl bg-emerald-100 text-emerald-600">
                    {displayName[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
              {profileLoading ? (
                <div className="flex items-center gap-2 text-gray-400">
                  <Loader2 className="h-4 w-4 animate-spin" />加载中...
                </div>
              ) : (
                <>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>昵称</Label>
                      <Input value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>邮箱</Label>
                      <Input value={email} disabled />
                      <p className="text-xs text-gray-400">邮箱暂不支持修改</p>
                    </div>
                  </div>
                  <Button onClick={handleSaveProfile} disabled={saving}>
                    {saving && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}
                    保存更改
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Bell className="h-4 w-4" />
                通知设置
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">邮件通知</p>
                  <p className="text-xs text-gray-500">接收产品更新和使用提醒</p>
                </div>
                <Button variant="outline" size="sm">已开启</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscription" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>当前套餐</span>
                <Badge variant="secondary">免费版</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <p className="text-sm text-gray-500">AI 诊断</p>
                  <p className="text-lg font-semibold">— / 3 次</p>
                  <Progress value={0} className="h-1.5 mt-1" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">AI 改写</p>
                  <p className="text-lg font-semibold">— / 3 次</p>
                  <Progress value={0} className="h-1.5 mt-1" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">简历数量</p>
                  <p className="text-lg font-semibold">— / 3 份</p>
                  <Progress value={0} className="h-1.5 mt-1" />
                </div>
              </div>
              <p className="text-xs text-gray-400">额度每月 1 日重置</p>
            </CardContent>
          </Card>

          <Card className="border-emerald-200 bg-emerald-50/50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
                  <Sparkles className="h-5 w-5 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">升级到专业版</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    解锁无限 AI 诊断与改写、全部模板、JD 匹配分析等功能
                  </p>
                  <ul className="mt-3 space-y-1">
                    {[
                      "无限 AI 诊断与改写",
                      "全部简历模板",
                      "JD 匹配分析",
                      "Word 导出",
                      "无限简历数量",
                    ].map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 flex items-center gap-3">
                    <Button>升级 — ¥29/月</Button>
                    <span className="text-sm text-gray-400">年付 ¥249，省 ¥99</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>修改密码</CardTitle>
              <CardDescription>建议定期更换密码以保障账户安全</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="space-y-2">
                  <Label>当前密码</Label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>新密码</Label>
                  <Input
                    type="password"
                    placeholder="至少 8 位，包含大小写和数字"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={8}
                  />
                </div>
                <div className="space-y-2">
                  <Label>确认新密码</Label>
                  <Input
                    type="password"
                    placeholder="再次输入新密码"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" disabled={changingPassword}>
                  {changingPassword && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}
                  更新密码
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>数据管理</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">导出所有数据</p>
                  <p className="text-xs text-gray-500">下载你的所有简历和个人数据</p>
                </div>
                <Button variant="outline" size="sm">导出</Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-600">注销账户</p>
                  <p className="text-xs text-gray-500">永久删除你的账户和所有数据</p>
                </div>
                <Button variant="destructive" size="sm">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  注销
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
