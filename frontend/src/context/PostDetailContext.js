import { createContext, useContext } from "react";

export const PostDetailContext = createContext(null);

export function usePostDetail() {
  const context = useContext(PostDetailContext);
  if (!context) {
    throw new Error("usePostDetail must be used within PostDetailProvider");
  }
  return context;
}
