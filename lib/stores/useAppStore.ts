import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

/**
 * 应用全局状态管理
 */
interface AppState {
  // 搜索历史
  searchHistory: string[];
  addSearchHistory: (keyword: string) => void;
  clearSearchHistory: () => void;

  // 用户偏好
  theme: "light" | "dark" | "auto";
  setTheme: (theme: "light" | "dark" | "auto") => void;

  // 浏览历史（妆容 ID）
  browsingHistory: string[];
  addToBrowsingHistory: (postId: string) => void;
  clearBrowsingHistory: () => void;

  // 产品浏览历史
  productHistory: string[];
  addToProductHistory: (productId: string) => void;
  clearProductHistory: () => void;

  // 当前选择的筛选条件
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedFaceShape: string;
  setSelectedFaceShape: (faceShape: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // 搜索历史
      searchHistory: [],
      addSearchHistory: (keyword) =>
        set((state) => {
          // 去重并限制最多 10 条
          const newHistory = [
            keyword,
            ...state.searchHistory.filter((k) => k !== keyword),
          ].slice(0, 10);
          return { searchHistory: newHistory };
        }),
      clearSearchHistory: () => set({ searchHistory: [] }),

      // 用户偏好
      theme: "auto",
      setTheme: (theme) => set({ theme }),

      // 浏览历史
      browsingHistory: [],
      addToBrowsingHistory: (postId) =>
        set((state) => {
          // 去重并限制最多 50 条
          const newHistory = [
            postId,
            ...state.browsingHistory.filter((id) => id !== postId),
          ].slice(0, 50);
          return { browsingHistory: newHistory };
        }),
      clearBrowsingHistory: () => set({ browsingHistory: [] }),

      // 产品浏览历史
      productHistory: [],
      addToProductHistory: (productId) =>
        set((state) => {
          // 去重并限制最多 50 条
          const newHistory = [
            productId,
            ...state.productHistory.filter((id) => id !== productId),
          ].slice(0, 50);
          return { productHistory: newHistory };
        }),
      clearProductHistory: () => set({ productHistory: [] }),

      // 筛选条件
      selectedCategory: "",
      setSelectedCategory: (category) => set({ selectedCategory: category }),
      selectedFaceShape: "",
      setSelectedFaceShape: (faceShape) => set({ selectedFaceShape: faceShape }),
    }),
    {
      name: "makeup-artist-storage", // localStorage key
      storage: createJSONStorage(() => localStorage),
      // 只持久化部分状态
      partialize: (state) => ({
        searchHistory: state.searchHistory,
        theme: state.theme,
        browsingHistory: state.browsingHistory,
        productHistory: state.productHistory,
      }),
    }
  )
);
