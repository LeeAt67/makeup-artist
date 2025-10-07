"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

const skinTypes = [
  { value: "oily", label: "油性" },
  { value: "combination", label: "混合性" },
  { value: "dry", label: "干性" },
  { value: "sensitive", label: "敏感性" },
];

const skinTones = [
  "#FDEFE2",
  "#F6E1D1",
  "#E8C8B3",
  "#D1A88B",
  "#A47C60",
  "#805C44",
  "#5A3E2B",
  "#3C2819",
];

interface ProfileData {
  username: string;
  bio: string;
  avatar_url: string;
  skin_type: string;
  skin_tone: string;
}

export default function EditProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const [formData, setFormData] = useState<ProfileData>({
    username: "",
    bio: "",
    avatar_url: "",
    skin_type: "combination",
    skin_tone: "#FDEFE2",
  });

  const supabase = createClient();

  // 加载用户资料
  useEffect(() => {
    async function loadProfile() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.push("/login");
          return;
        }

        setUserId(user.id);

        const { data: profile, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single<Profile>();

        if (error && error.code !== "PGRST116") {
          console.error("加载资料失败:", error);
        }

        if (profile) {
          setFormData({
            username: profile.username || "",
            bio: profile.bio || "",
            avatar_url:
              profile.avatar_url ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                user.email || "User"
              )}&background=f04299&color=fff`,
            skin_type: profile.skin_type || "combination",
            skin_tone: profile.skin_tone || "#FDEFE2",
          });
        } else {
          // 如果没有资料，使用默认头像
          setFormData((prev) => ({
            ...prev,
            avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(
              user.email || "User"
            )}&background=f04299&color=fff`,
          }));
        }
      } catch (error) {
        console.error("加载用户信息失败:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [router, supabase]);

  // 处理头像上传
  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !userId) return;

    try {
      setUploading(true);

      // 检查文件类型
      if (!file.type.startsWith("image/")) {
        alert("请上传图片文件");
        return;
      }

      // 检查文件大小（限制 5MB）
      if (file.size > 5 * 1024 * 1024) {
        alert("图片大小不能超过 5MB");
        return;
      }

      const fileExt = file.name.split(".").pop();
      const fileName = `${userId}/avatar-${Date.now()}.${fileExt}`;

      // 上传到 Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) {
        console.error("上传失败:", uploadError);
        alert("上传头像失败，请重试");
        return;
      }

      // 获取公开 URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(fileName);

      setFormData((prev) => ({
        ...prev,
        avatar_url: publicUrl,
      }));
    } catch (error) {
      console.error("上传头像失败:", error);
      alert("上传头像失败，请重试");
    } finally {
      setUploading(false);
    }
  }

  // 保存资料
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!userId) {
      alert("请先登录");
      return;
    }

    if (!formData.username.trim()) {
      alert("请输入昵称");
      return;
    }

    try {
      setSaving(true);

      const { error } = await (supabase.from("profiles") as any).upsert({
        id: userId,
        username: formData.username.trim(),
        bio: formData.bio.trim(),
        avatar_url: formData.avatar_url,
        skin_type: formData.skin_type,
        skin_tone: formData.skin_tone,
        updated_at: new Date().toISOString(),
      });

      if (error) {
        console.error("保存失败:", error);
        alert("保存失败，请重试");
        return;
      }

      // 保存成功，返回个人中心
      router.push("/profile");
    } catch (error) {
      console.error("保存资料失败:", error);
      alert("保存失败，请重试");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500 dark:text-gray-400">加载中...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background-light dark:bg-background-dark">
      {/* 头部 */}
      <header className="sticky top-0 z-10 flex items-center justify-between bg-background-light/80 p-4 backdrop-blur-sm dark:bg-background-dark/80">
        <button
          onClick={() => router.back()}
          className="flex h-10 w-10 items-center justify-center text-gray-800 dark:text-gray-200"
          type="button"
        >
          <span className="material-symbols-outlined">arrow_back_ios_new</span>
        </button>
        <h1 className="flex-1 text-center text-lg font-bold text-gray-900 dark:text-white">
          编辑资料
        </h1>
        <div className="w-10"></div>
      </header>

      {/* 表单内容 */}
      <form onSubmit={handleSubmit} className="flex flex-col flex-1">
        <main className="flex-grow overflow-y-auto p-4">
          {/* 头像 */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <div
                className="h-24 w-24 rounded-full bg-cover bg-center"
                style={{
                  backgroundImage: `url('${formData.avatar_url}')`,
                }}
              />
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white cursor-pointer hover:bg-pink-600 transition-colors"
              >
                {uploading ? (
                  <span className="text-xs">...</span>
                ) : (
                  <span className="material-symbols-outlined text-xl">
                    edit
                  </span>
                )}
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            </div>
          </div>

          {/* 表单字段 */}
          <div className="mt-8 space-y-4">
            {/* 昵称 */}
            <div>
              <label
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                htmlFor="nickname"
              >
                昵称
              </label>
              <input
                className="mt-1 block w-full rounded-lg border-gray-300 bg-gray-100 p-3 text-gray-900 focus:border-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-800/50 dark:text-white dark:placeholder-gray-400"
                id="nickname"
                type="text"
                value={formData.username}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, username: e.target.value }))
                }
                placeholder="请输入昵称"
                maxLength={20}
                required
              />
            </div>

            {/* 个性签名 */}
            <div>
              <label
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                htmlFor="bio"
              >
                个性签名
              </label>
              <textarea
                className="mt-1 block w-full rounded-lg border-gray-300 bg-gray-100 p-3 text-gray-900 focus:border-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-800/50 dark:text-white dark:placeholder-gray-400"
                id="bio"
                rows={3}
                value={formData.bio}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, bio: e.target.value }))
                }
                placeholder="一句话介绍自己..."
                maxLength={100}
              />
            </div>

            {/* 肤质 */}
            <div>
              <label
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                htmlFor="skin-type"
              >
                肤质
              </label>
              <select
                className="mt-1 block w-full rounded-lg border-gray-300 bg-gray-100 p-3 text-gray-900 focus:border-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-800/50 dark:text-white"
                id="skin-type"
                value={formData.skin_type}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    skin_type: e.target.value,
                  }))
                }
              >
                {skinTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 肤色 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                肤色
              </label>
              <div className="mt-2 grid grid-cols-4 gap-3">
                {skinTones.map((tone) => (
                  <button
                    key={tone}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, skin_tone: tone }))
                    }
                    className={`aspect-square rounded-lg border-2 transition-all ${
                      formData.skin_tone === tone
                        ? "border-primary scale-95"
                        : "border-transparent hover:border-gray-300 dark:hover:border-gray-600"
                    }`}
                    style={{ backgroundColor: tone }}
                    aria-label={`选择肤色 ${tone}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </main>

        {/* 底部保存按钮 */}
        <div className="p-4">
          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-full bg-primary py-3.5 text-base font-bold text-white shadow-lg shadow-primary/30 transition-colors hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "保存中..." : "保存"}
          </button>
        </div>
      </form>
    </div>
  );
}
