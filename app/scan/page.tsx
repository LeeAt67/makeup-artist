"use client";

import Link from "next/link";
import { BottomNav } from "@/components/bottom-nav";
import { useState, useRef, useEffect } from "react";
import {
  uploadAndRecognizeFace,
  getFaceScanHistory,
  updateFaceShape,
  deleteFaceScan,
} from "@/lib/actions/face-scan";
import {
  faceShapeNames,
  faceShapeDescriptions,
  faceShapeTips,
  type FaceScanResult,
  type FaceShape,
} from "@/lib/constants/face-shapes";
import Image from "next/image";

export default function ScanPage() {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [scanResult, setScanResult] = useState<FaceScanResult | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [history, setHistory] = useState<FaceScanResult[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // 加载历史记录
  useEffect(() => {
    loadHistory();
  }, []);

  async function loadHistory() {
    const result = await getFaceScanHistory(5);
    if (result.success) {
      setHistory(result.data);
    }
  }

  function handleFileSelect(file: File) {
    if (!file.type.startsWith("image/")) {
      setError("请选择图片文件");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("图片大小不能超过 5MB");
      return;
    }

    setSelectedFile(file);
    setError(null);

    // 创建预览 URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  function handleCameraClick() {
    cameraInputRef.current?.click();
  }

  function handleGalleryClick() {
    fileInputRef.current?.click();
  }

  function handleReset() {
    setPreviewUrl(null);
    setSelectedFile(null);
    setScanResult(null);
    setShowResult(false);
    setError(null);
  }

  async function handleAnalyze() {
    if (!selectedFile) {
      setError("请先选择图片");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const result = await uploadAndRecognizeFace(formData);

      if (result.success && result.data) {
        setScanResult(result.data);
        setShowResult(true);
        // 重新加载历史记录
        await loadHistory();
      } else {
        setError(result.error || "识别失败，请重试");
      }
    } catch (err) {
      setError("识别过程出错，请重试");
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  }

  async function handleManualAdjust(newShape: FaceShape) {
    if (!scanResult) return;

    const result = await updateFaceShape(scanResult.id, newShape);
    if (result.success) {
      setScanResult({
        ...scanResult,
        face_shape: newShape,
        is_manually_adjusted: true,
      });
      await loadHistory();
    }
  }

  async function handleDeleteHistory(scanId: string) {
    const result = await deleteFaceScan(scanId);
    if (result.success) {
      await loadHistory();
    }
  }

  // 识别结果展示
  if (showResult && scanResult) {
    return (
      <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
        <main className="flex-grow pb-24">
          {/* 头部 */}
          <header className="flex items-center p-4 bg-white dark:bg-surface-dark">
            <button
              onClick={handleReset}
              className="flex h-12 w-12 items-center justify-center rounded-full text-gray-700 dark:text-gray-300"
            >
              <span className="material-symbols-outlined text-2xl">
                arrow_back
              </span>
            </button>
            <h1 className="flex-1 text-center text-lg font-bold text-gray-800 dark:text-gray-200">
              识别结果
            </h1>
            <div className="w-12"></div>
          </header>

          <div className="px-6 py-6 space-y-6">
            {/* 识别结果卡片 */}
            <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  你的脸型是
                </h2>
                <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 dark:bg-primary/20 rounded-full">
                  <span className="material-symbols-outlined text-primary text-sm">
                    verified
                  </span>
                  <span className="text-sm font-medium text-primary">
                    {(scanResult.confidence * 100).toFixed(0)}% 置信度
                  </span>
                </div>
              </div>

              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-primary/10 dark:bg-primary/20 rounded-full mb-4">
                  <span className="material-symbols-outlined text-6xl text-primary">
                    face
                  </span>
                </div>
                <h3 className="text-3xl font-bold text-primary mb-2">
                  {faceShapeNames[scanResult.face_shape]}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {faceShapeDescriptions[scanResult.face_shape]}
                </p>
              </div>

              {/* 妆容建议 */}
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <h4 className="font-medium text-gray-900 dark:text-gray-200 mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-blue-500">
                    tips_and_updates
                  </span>
                  妆容建议
                </h4>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  {faceShapeTips[scanResult.face_shape].map((tip, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-blue-500 mt-0.5">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 手动调整 */}
            <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">
                  tune
                </span>
                结果不准确？手动调整
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {(
                  [
                    "round",
                    "square",
                    "oval",
                    "long",
                    "heart",
                    "diamond",
                  ] as FaceShape[]
                ).map((shape) => (
                  <button
                    key={shape}
                    onClick={() => handleManualAdjust(shape)}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      scanResult.face_shape === shape
                        ? "border-primary bg-primary/10 dark:bg-primary/20"
                        : "border-gray-200 dark:border-gray-700 hover:border-primary/50"
                    }`}
                  >
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {faceShapeNames[shape]}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 查看推荐妆容 */}
            <Link
              href={`/?face_shape=${scanResult.face_shape}`}
              className="flex h-14 w-full items-center justify-center rounded-xl bg-primary text-base font-bold text-white shadow-lg shadow-primary/30 hover:bg-primary/90 active:scale-98 transition-all"
            >
              <span className="material-symbols-outlined mr-2">search</span>
              查看推荐妆容
            </Link>
          </div>
        </main>

        <BottomNav />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
      <main className="flex-grow pb-24">
        {/* 头部 */}
        <header className="flex items-center p-4 bg-white dark:bg-surface-dark">
          <div className="w-12"></div>
          <h1 className="flex-1 text-center text-lg font-bold text-gray-800 dark:text-gray-200">
            脸型识别
          </h1>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex h-12 w-12 items-center justify-center rounded-full text-gray-700 dark:text-gray-300"
          >
            <span className="material-symbols-outlined text-2xl">
              {showHistory ? "close" : "history"}
            </span>
          </button>
        </header>

        {/* 历史记录 */}
        {showHistory && (
          <div className="px-6 py-4 bg-white dark:bg-surface-dark border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">
              识别历史
            </h3>
            {history.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                暂无识别记录
              </p>
            ) : (
              <div className="space-y-3">
                {history.map((scan) => (
                  <div
                    key={scan.id}
                    className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl"
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary">
                        face
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {faceShapeNames[scan.face_shape]}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(scan.created_at).toLocaleDateString("zh-CN")}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteHistory(scan.id)}
                      className="flex-shrink-0 p-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <span className="material-symbols-outlined text-xl">
                        delete
                      </span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 主体内容 */}
        <div className="flex flex-col items-center justify-center px-6 py-8 text-center">
          {/* 隐藏的文件输入 */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileSelect(file);
            }}
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileSelect(file);
            }}
          />

          {/* 上传区域 */}
          <div className="relative w-72 h-96 rounded-xl border-4 border-dashed border-primary/50 bg-white dark:bg-surface-dark overflow-hidden">
            {previewUrl ? (
              <>
                <Image
                  src={previewUrl}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
                <button
                  onClick={handleReset}
                  className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-full flex flex-col items-center justify-center p-6">
                  <span className="material-symbols-outlined text-8xl text-primary opacity-30">
                    face
                  </span>
                  <p className="mt-4 text-gray-500 dark:text-gray-400">
                    请上传清晰的正面人脸照片
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* 错误提示 */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg max-w-sm">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* 标题和描述 */}
          {!previewUrl && (
            <>
              <p className="mt-8 text-2xl font-bold text-gray-900 dark:text-white">
                开启你的专属妆容之旅
              </p>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                AI为你精准分析脸型，推荐最适合你的妆容
              </p>
            </>
          )}

          {/* 操作按钮 */}
          <div className="mx-auto mt-8 flex w-full max-w-sm flex-col gap-4">
            {previewUrl ? (
              <>
                <button
                  onClick={handleAnalyze}
                  disabled={isUploading}
                  className="flex h-14 w-full items-center justify-center rounded-xl bg-primary text-base font-bold text-white shadow-lg shadow-primary/30 hover:bg-primary/90 active:scale-98 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploading ? (
                    <>
                      <span className="material-symbols-outlined mr-2 animate-spin">
                        progress_activity
                      </span>
                      识别中...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined mr-2">
                        psychology
                      </span>
                      开始识别
                    </>
                  )}
                </button>
                <button
                  onClick={handleReset}
                  disabled={isUploading}
                  className="flex h-14 w-full items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-base font-bold hover:bg-gray-200 dark:hover:bg-gray-700 active:scale-98 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined mr-2">
                    refresh
                  </span>
                  重新选择
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleCameraClick}
                  disabled={isUploading}
                  className="flex h-14 w-full items-center justify-center rounded-xl bg-primary text-base font-bold text-white shadow-lg shadow-primary/30 hover:bg-primary/90 active:scale-98 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined mr-2">
                    photo_camera
                  </span>
                  拍照上传
                </button>
                <button
                  onClick={handleGalleryClick}
                  disabled={isUploading}
                  className="flex h-14 w-full items-center justify-center rounded-xl bg-primary/10 text-primary dark:bg-primary/20 text-base font-bold hover:bg-primary/20 dark:hover:bg-primary/30 active:scale-98 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined mr-2">
                    photo_library
                  </span>
                  从相册选择
                </button>
              </>
            )}
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
