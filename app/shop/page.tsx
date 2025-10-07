import Link from "next/link";
import { BottomNav } from "@/components/bottom-nav";

// 模拟产品数据
const categories = [
  { id: 1, name: "彩妆", active: true },
  { id: 2, name: "护肤", active: false },
  { id: 3, name: "工具", active: false },
  { id: 4, name: "香水", active: false },
  { id: 5, name: "男士", active: false },
];

const subCategories = [
  { id: 1, name: "底妆", active: true },
  { id: 2, name: "眼妆", active: false },
  { id: 3, name: "唇妆", active: false },
  { id: 4, name: "面部", active: false },
  { id: 5, name: "套装", active: false },
];

const products = [
  {
    id: 1,
    name: "清透无瑕底妆液",
    image:
      "https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?w=600&q=80",
    price: 299,
  },
  {
    id: 2,
    name: "眼影调色盘",
    image:
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&q=80",
    price: 199,
  },
  {
    id: 3,
    name: "水润唇膏",
    image:
      "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&q=80",
    price: 159,
  },
  {
    id: 4,
    name: "多效隔离霜",
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80",
    price: 189,
  },
];

export default function ShopPage() {
  return (
    <div className="flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark text-stone-900 dark:text-stone-100">
      {/* 头部 */}
      <header className="sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm">
        <div className="flex items-center p-4">
          <h1 className="flex-1 text-center text-lg font-bold">商城</h1>
          <button className="flex h-10 w-10 items-center justify-center rounded-full text-stone-900 dark:text-stone-100">
            <span className="material-symbols-outlined">search</span>
          </button>
        </div>

        {/* 搜索框 */}
        <div className="px-4 pb-3">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="material-symbols-outlined text-stone-500 dark:text-stone-400 text-xl">
                search
              </span>
            </div>
            <input
              className="w-full rounded-lg border-none bg-stone-200/50 dark:bg-stone-800/50 py-3 pl-10 pr-4 text-stone-900 dark:text-stone-100 placeholder:text-stone-500 dark:placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="搜索商品"
              type="search"
            />
          </div>
        </div>

        {/* 主分类 */}
        <div className="border-b border-stone-200/80 dark:border-stone-800/80 px-4">
          <nav className="-mb-px flex space-x-6 overflow-x-auto">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/shop?category=${category.id}`}
                className={`shrink-0 border-b-2 px-1 py-3 text-sm font-bold ${
                  category.active
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
        {/* 子分类 */}
        <div className="p-4">
          <div className="flex space-x-3 overflow-x-auto pb-2">
            {subCategories.map((subCategory) => (
              <button
                key={subCategory.id}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium ${
                  subCategory.active
                    ? "bg-primary/10 dark:bg-primary/20 text-primary font-semibold"
                    : "bg-stone-200/50 dark:bg-stone-800/50 text-stone-700 dark:text-stone-300"
                }`}
              >
                {subCategory.name}
              </button>
            ))}
          </div>
        </div>

        {/* 产品列表 */}
        <div className="grid grid-cols-2 gap-4 px-4 pb-20">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/shop/product/${product.id}`}
              className="space-y-2"
            >
              <div
                className="w-full aspect-square rounded-lg bg-cover bg-center"
                style={{ backgroundImage: `url('${product.image}')` }}
              />
              <p className="font-semibold text-stone-800 dark:text-stone-200">
                {product.name}
              </p>
              <p className="text-primary font-bold">¥{product.price}</p>
            </Link>
          ))}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
