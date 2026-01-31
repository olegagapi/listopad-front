"use client";

import { useWishlistPersistence } from "@/hooks/useWishlistPersistence";

interface WishlistPersistenceProviderProps {
  children: React.ReactNode;
}

export default function WishlistPersistenceProvider({
  children,
}: WishlistPersistenceProviderProps): React.ReactNode {
  useWishlistPersistence();
  return children;
}
