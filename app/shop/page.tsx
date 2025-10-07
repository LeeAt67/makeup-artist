import Link from "next/link";
import { BottomNav } from "@/components/bottom-nav";
import { getProducts } from "@/lib/actions/products";

interface ShopPageProps {
  searchParams: Promise<{
    category?: string;
  }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const selectedCategory = params.category;

  // 从数据库获取产品数据，根据分类筛选
  const productsResult = await getProducts(
    selectedCategory,
    undefined,
    50
  );
  const products = productsResult.data || [];

  // 分类选项
  const categories = [
    { id: "foundation", name: "底妆" },
    { id: "eyeshadow", name: "眼影" },
    { id: "lipstick", name: "口红" },
    { id: "blush", name: "腮红" },
    { id: "tools", name: "工具" },
  ];
  return (
    <div className="flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark text-stone-900 dark:text-stone-100">
      {/* 头部 */}
      <header className="sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm">
        <div className="flex items-center p-4">
          <h1 className="flex-1 text-center text-lg font-bold">商城</h1>
          <Link
            href="/search"
            className="flex h-10 w-10 items-center justify-center rounded-full text-stone-900 dark:text-stone-100 hover:bg-surface-light dark:hover:bg-surface-dark"
          >
            <span className="material-symbols-outlined">search</span>
          </Link>
        </div>

        {/* 搜索框 */}
        <div className="px-4 pb-3">
          <Link
            href="/search"
            className="relative block w-full rounded-lg border-none bg-stone-200/50 dark:bg-stone-800/50 py-3 pl-10 pr-4"
          >
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="material-symbols-outlined text-stone-500 dark:text-stone-400 text-xl">
                search
              </span>
            </div>
            <span className="text-stone-500 dark:text-stone-400">搜索商品</span>
          </Link>
        </div>

        {/* 分类导航 */}
        <div className="border-b border-stone-200/80 dark:border-stone-800/80 px-4">
          <nav className="-mb-px flex space-x-6 overflow-x-auto">
            <Link
              href="/shop"
              className={`shrink-0 border-b-2 px-1 py-3 text-sm font-bold ${
                !selectedCategory
                  ? "border-primary text-primary"
                  : "border-transparent text-stone-500 dark:text-stone-400 hover:text-primary dark:hover:text-primary hover:border-primary/50"
              }`}
            >
              全部
            </Link>
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/shop?category=${category.id}`}
                className={`shrink-0 border-b-2 px-1 py-3 text-sm font-bold ${
                  selectedCategory === category.id
                    ? "border-primary text-primary"
                    : "border-transparent text-stone-500 dark:text-stone-400 hover:text-primary dark:hover:text-primary hover:border-primary/50"
                }`}
              >
                {category.name}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* 主体内容 */}
      <main className="flex-1">
        {/* 产品列表 */}
        {products.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 px-4 py-4 pb-20">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/shop/product/${product.id}`}
                className="space-y-2"
              >
                <div
                  className="w-full aspect-square rounded-lg bg-cover bg-center bg-gray-200 dark:bg-gray-800"
                  style={{ backgroundImage: `url('${product.cover_image}')` }}
                />
                <div className="space-y-1">
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    {product.brand}
                  </p>
                  <p className="font-semibold text-stone-800 dark:text-stone-200 line-clamp-2 text-sm">
                    {product.name}
                  </p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-primary font-bold text-lg">
                      ¥{product.price}
                    </p>
                    {product.original_price &&
                      product.original_price > product.price && (
                        <p className="text-xs text-stone-400 dark:text-stone-500 line-through">
                          ¥{product.original_price}
                        </p>
                      )}
                  </div>
                  {product.rating > 0 && (
                    <div className="flex items-center gap-1 text-xs">
                      <span className="text-amber-500">★</span>
                      <span className="text-stone-600 dark:text-stone-400">
                        {product.rating}
                      </span>
                      {product.sales_count > 0 && (
                        <span className="text-stone-400 dark:text-stone-500">
                          · 已售{product.sales_count}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="material-symbols-outlined text-6xl text-subtle-light dark:text-subtle-dark mb-4">
              shopping_bag
            </span>
            <p className="text-content-light dark:text-content-dark text-lg font-medium mb-2">
              暂无产品
            </p>
            <p className="text-subtle-light dark:text-subtle-dark text-sm">
              请先在数据库中添加产品数据
            </p>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
