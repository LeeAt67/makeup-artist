"use client";

import Link from "next/link";
import { BottomNav } from "@/components/bottom-nav";
import { useState } from "react";

export default function ScanPage() {
  const [isUploading, setIsUploading] = useState(false);

  function handleCameraClick() {
    setIsUploading(true);
    // 模拟上传过程
    setTimeout(() => {
      setIsUploading(false);
      // 实际项目中这里会调用相机 API
      alert("相机功能开发中...");
    }, 500);
  }

  function handleGalleryClick() {
    setIsUploading(true);
    // 模拟上传过程
    setTimeout(() => {
      setIsUploading(false);
      // 实际项目中这里会调用相册 API
      alert("相册功能开发中...");
    }, 500);
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        {/* 头部 */}
        <header className="flex items-center p-4">
          <div className="w-12"></div>
          <h1 className="flex-1 text-center text-lg font-bold text-gray-800 dark:text-gray-200">
            脸型识别
          </h1>
          <div className="flex w-12 items-center justify-end">
            <Link
              href="/help"
              className="flex h-12 w-12 items-center justify-center rounded-full text-gray-700 dark:text-gray-300"
            >
              <span className="material-symbols-outlined text-2xl">
                help_outline
              </span>
            </Link>
          </div>
        </header>

        {/* 主体内容 */}
        <div className="flex flex-col items-center justify-center px-6 pb-4 text-center min-h-[calc(100vh-16rem)]">
          {/* 上传区域 */}
          <div className="relative w-72 h-96 rounded-xl border-4 border-dashed border-primary/50 bg-primary/5 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-full flex flex-col items-center justify-center">
                <span className="material-symbols-outlined text-8xl text-primary opacity-30">
                  face
                </span>
                <p className="mt-4 text-gray-500 dark:text-gray-400">
                  请上传清晰的正面人脸照片
                </p>
              </div>
            </div>
          </div>

          {/* 标题和描述 */}
          <p className="mt-8 text-2xl font-bold text-gray-900 dark:text-white">
            开启你的专属妆容之旅
          </p>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            AI为你精准分析脸型，推荐最适合你的妆容
          </p>

          {/* 操作按钮 */}
          <div className="mx-auto mt-12 flex w-full max-w-sm flex-col gap-4">
            <button
              onClick={handleCameraClick}
              disabled={isUploading}
              className="flex h-14 w-full items-center justify-center rounded-xl bg-primary text-base font-bold text-white shadow-lg shadow-primary/30 hover:bg-primary/90 active:scale-98 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined mr-2">
                photo_camera
              </span>
              {isUploading ? "处理中..." : "拍照上传"}
            </button>
            <button
              onClick={handleGalleryClick}
              disabled={isUploading}
              className="flex h-14 w-full items-center justify-center rounded-xl bg-primary/10 text-primary dark:bg-primary/20 text-base font-bold hover:bg-primary/20 dark:hover:bg-primary/30 active:scale-98 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined mr-2">
                photo_library
              </span>
              {isUploading ? "处理中..." : "从相册选择"}
            </button>
          </div>

          {/* 提示信息 */}
          <div className="mt-8 max-w-sm">
            <div className="flex items-start gap-3 text-left p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <span className="material-symbols-outlined text-blue-500 flex-shrink-0">
                info
              </span>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <p className="font-medium text-gray-900 dark:text-gray-200 mb-1">
                  拍摄建议：
                </p>
                <ul className="space-y-1 text-xs">
                  <li>• 保持正面角度</li>
                  <li>• 露出额头和下颌线</li>
                  <li>• 避免佩戴帽子或口罩</li>
                  <li>• 确保光线充足均匀</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
