import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductById, getProductReviews } from "@/lib/actions/products";
import { ProductReviews } from "./product-reviews";

interface ProductDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { id } = await params;

  // 获取产品详情
  const result = await getProductById(id);

  if (!result.success || !result.data) {
    notFound();
  }

  const product = result.data;

  // 获取产品评价
  const reviewsResult = await getProductReviews(id, 50);
  const reviews = reviewsResult.data || [];

  // 计算折扣
  const discount =
    product.original_price && product.original_price > product.price
      ? Math.round(
          ((product.original_price - product.price) / product.original_price) *
            100
        )
      : null;

  // 分类标签
  const categoryLabels: Record<string, string> = {
    foundation: "底妆",
    eyeshadow: "眼影",
    lipstick: "口红",
    blush: "腮红",
    concealer: "遮瑕",
    powder: "散粉",
    tools: "工具",
  };

  // 平台标签
  const platformLabels: Record<string, string> = {
    taobao: "淘宝",
    tmall: "天猫",
    jd: "京东",
    douyin: "抖音",
    xiaohongshu: "小红书",
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark pb-20">
      {/* 顶部导航栏 */}
      <header className="sticky top-0 z-20 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <Link
            href="/shop"
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-light dark:hover:bg-surface-dark transition-colors"
          >
            <span className="material-symbols-outlined text-content-light dark:text-content-dark">
              arrow_back
            </span>
          </Link>
          <h1 className="text-lg font-bold text-content-light dark:text-content-dark">
            产品详情
          </h1>
          <button className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-light dark:hover:bg-surface-dark transition-colors">
            <span className="material-symbols-outlined text-content-light dark:text-content-dark">
              share
            </span>
          </button>
        </div>
      </header>

      {/* 产品图片轮播 */}
      <section className="bg-surface-light dark:bg-surface-dark">
        <div
          className="w-full aspect-square bg-center bg-cover"
          style={{ backgroundImage: `url('${product.cover_image}')` }}
        />
        {product.images && product.images.length > 0 && (
          <div className="flex gap-2 px-4 py-3 overflow-x-auto">
            {product.images.map((image, index) => (
              <div
                key={index}
                className="w-16 h-16 flex-shrink-0 bg-center bg-cover rounded border-2 border-gray-200 dark:border-gray-700"
                style={{ backgroundImage: `url('${image}')` }}
              />
            ))}
          </div>
        )}
      </section>

      {/* 产品基本信息 */}
      <section className="px-4 py-4 bg-surface-light dark:bg-surface-dark mt-2">
        {/* 价格 */}
        <div className="mb-3">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-primary">
              ¥{product.price}
            </span>
            {product.original_price && product.original_price > product.price && (
              <>
                <span className="text-sm text-subtle-light dark:text-subtle-dark line-through">
                  ¥{product.original_price}
                </span>
                {discount && (
                  <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded">
                    省{discount}%
                  </span>
                )}
              </>
            )}
          </div>
          <div className="flex items-center gap-2 mt-2">
            {product.rating > 0 && (
              <div className="flex items-center gap-1">
                <span className="text-amber-500 text-sm">★</span>
                <span className="text-sm text-content-light dark:text-content-dark font-medium">
                  {product.rating}
                </span>
              </div>
            )}
            {product.reviews_count > 0 && (
              <span className="text-xs text-subtle-light dark:text-subtle-dark">
                {product.reviews_count} 评价
              </span>
            )}
            {product.sales_count > 0 && (
              <span className="text-xs text-subtle-light dark:text-subtle-dark">
                已售 {product.sales_count}
              </span>
            )}
          </div>
        </div>

        {/* 品牌和名称 */}
        <div className="mb-3">
          <p className="text-sm text-subtle-light dark:text-subtle-dark mb-1">
            {product.brand}
          </p>
          <h2 className="text-lg font-bold text-content-light dark:text-content-dark">
            {product.name}
          </h2>
        </div>

        {/* 标签 */}
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
            {categoryLabels[product.category] || product.category}
          </span>
          {product.features &&
            product.features.map((feature, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-surface-light dark:bg-background-dark border border-gray-200 dark:border-gray-700 text-content-light dark:text-content-dark rounded-full text-xs"
              >
                {feature}
              </span>
            ))}
        </div>
      </section>

      {/* 规格信息 */}
      {product.specifications && (
        <section className="px-4 py-4 bg-surface-light dark:bg-surface-dark mt-2">
          <h3 className="text-lg font-bold text-content-light dark:text-content-dark mb-3">
            规格参数
          </h3>
          <div className="space-y-2">
            {Object.entries(product.specifications).map(([key, value]) => (
              <div
                key={key}
                className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700 last:border-0"
              >
                <span className="text-sm text-subtle-light dark:text-subtle-dark">
                  {key}
                </span>
                <span className="text-sm text-content-light dark:text-content-dark font-medium">
                  {value}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 产品描述 */}
      {product.description && (
        <section className="px-4 py-4 bg-surface-light dark:bg-surface-dark mt-2">
          <h3 className="text-lg font-bold text-content-light dark:text-content-dark mb-3">
            产品介绍
          </h3>
          <p className="text-sm text-content-light dark:text-content-dark leading-relaxed whitespace-pre-line">
            {product.description}
          </p>
        </section>
      )}

      {/* 适用信息 */}
      {(product.suitable_skin_types || product.suitable_face_shapes) && (
        <section className="px-4 py-4 bg-surface-light dark:bg-surface-dark mt-2">
          <h3 className="text-lg font-bold text-content-light dark:text-content-dark mb-3">
            适用信息
          </h3>
          <div className="space-y-3">
            {product.suitable_skin_types && (
              <div>
                <p className="text-sm text-subtle-light dark:text-subtle-dark mb-2">
                  适合肤质
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.suitable_skin_types.map((type, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-xs"
                    >
                      {type === "dry" && "干性"}
                      {type === "oily" && "油性"}
                      {type === "combination" && "混合性"}
                      {type === "normal" && "中性"}
                      {type === "sensitive" && "敏感性"}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {product.suitable_face_shapes && (
              <div>
                <p className="text-sm text-subtle-light dark:text-subtle-dark mb-2">
                  适合脸型
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.suitable_face_shapes.map((shape, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full text-xs"
                    >
                      {shape === "round" && "圆形脸"}
                      {shape === "square" && "方形脸"}
                      {shape === "oval" && "鹅蛋脸"}
                      {shape === "long" && "长形脸"}
                      {shape === "heart" && "心形脸"}
                      {shape === "diamond" && "菱形脸"}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* 成分信息 */}
      {product.ingredients && (
        <section className="px-4 py-4 bg-surface-light dark:bg-surface-dark mt-2">
          <h3 className="text-lg font-bold text-content-light dark:text-content-dark mb-3">
            成分信息
          </h3>
          <p className="text-xs text-content-light dark:text-content-dark leading-relaxed">
            {product.ingredients}
          </p>
        </section>
      )}

      {/* 用户评价 */}
      <ProductReviews
        reviews={reviews}
        productId={id}
        averageRating={product.rating}
        totalReviews={product.reviews_count}
      />

      {/* 底部购买栏 */}
      <div className="fixed bottom-0 left-0 right-0 bg-surface-light dark:bg-surface-dark border-t border-gray-200 dark:border-gray-700 px-4 py-3 z-10">
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <div className="flex-1">
            <p className="text-xs text-subtle-light dark:text-subtle-dark mb-1">
              到手价
            </p>
            <p className="text-xl font-bold text-primary">¥{product.price}</p>
          </div>
          {product.affiliate_link ? (
            <a
              href={product.affiliate_link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-full font-medium hover:bg-primary/90 transition-colors"
            >
              <span>
                前往
                {product.platform
                  ? platformLabels[product.platform] || product.platform
                  : "购买"}
              </span>
              <span className="material-symbols-outlined text-sm">
                open_in_new
              </span>
            </a>
          ) : (
            <button
              disabled
              className="flex-1 bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 py-3 rounded-full font-medium cursor-not-allowed"
            >
              暂无购买链接
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

