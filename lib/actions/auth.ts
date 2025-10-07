"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

/**
 * 将用户名转换为邮箱格式（用于 Supabase Auth）
 * 因为 Supabase Auth 使用邮箱作为唯一标识
 */
function usernameToEmail(username: string): string {
  return `${username.toLowerCase()}@app.local`;
}

/**
 * 从邮箱格式中提取用户名
 */
function emailToUsername(email: string): string {
  return email.replace("@app.local", "");
}

/**
 * 验证用户名格式
 */
function validateUsername(username: string): boolean {
  // 用户名规则：3-20位，只能包含字母、数字、下划线
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
}

/**
 * 用户登录
 */
export async function login(formData: FormData) {
  const supabase = await createClient();

  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (!username || !password) {
    return {
      error: "请输入用户名和密码",
    };
  }

  // 验证用户名格式
  if (!validateUsername(username)) {
    return {
      error: "用户名格式错误",
    };
  }

  // 将用户名转换为邮箱格式
  const email = usernameToEmail(username);

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      error:
        error.message === "Invalid login credentials"
          ? "用户名或密码错误"
          : "登录失败，请稍后重试",
    };
  }

  revalidatePath("/", "layout");
  redirect("/");
}

/**
 * 用户注册
 */
export async function signup(formData: FormData) {
  const supabase = await createClient();

  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!username || !password || !confirmPassword) {
    return {
      error: "请填写所有字段",
    };
  }

  // 验证用户名格式
  if (!validateUsername(username)) {
    return {
      error: "用户名格式错误（3-20位，仅字母数字下划线）",
    };
  }

  if (password !== confirmPassword) {
    return {
      error: "两次输入的密码不一致",
    };
  }

  if (password.length < 6) {
    return {
      error: "密码长度至少为 6 位",
    };
  }

  // 将用户名转换为邮箱格式
  const email = usernameToEmail(username);

  const { error, data } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${
        process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
      }/auth/callback`,
      data: {
        username: username, // 将用户名存储在用户元数据中
      },
    },
  });

  if (error) {
    return {
      error:
        error.message === "User already registered"
          ? "该用户名已被注册"
          : "注册失败，请稍后重试",
    };
  }

  // 在 profiles 表中存储用户名
  if (data.user) {
    await supabase.from("profiles").upsert({
      id: data.user.id,
      username: username,
      updated_at: new Date().toISOString(),
    });
  }

  revalidatePath("/", "layout");
  redirect("/login?message=注册成功，请登录");
}

/**
 * 用户登出
 */
export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}

/**
 * 发送密码重置邮件（暂不可用）
 */
export async function resetPassword(formData: FormData) {
  return {
    error: "如需重置密码请联系客服",
  };
}

/**
 * 更新密码
 */
export async function updatePassword(formData: FormData) {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    return {
      error: "请填写所有字段",
    };
  }

  if (password !== confirmPassword) {
    return {
      error: "两次输入的密码不一致",
    };
  }

  if (password.length < 6) {
    return {
      error: "密码长度至少为 6 位",
    };
  }

  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    return {
      error: "更新密码失败，请稍后重试",
    };
  }

  revalidatePath("/", "layout");
  redirect("/login?message=密码已更新，请使用新密码登录");
}
