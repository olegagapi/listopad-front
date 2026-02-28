"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { useAuth } from "@/app/context/AuthContext";
import { CabinetTopBar } from "@/components/Cabinet/CabinetTopBar";
import { ProductsTable } from "@/components/Cabinet/Products/ProductsTable";
import { DeleteProductModal } from "@/components/Cabinet/Products/DeleteProductModal";

type Product = {
  id: number;
  name: string;
  price: number;
  discountedPrice?: number | null;
  categoryName?: string;
  previewImage?: string | null;
  isActive: boolean;
};

export default function ProductsPage() {
  const t = useTranslations("Cabinet.products");
  const { isLoading: authLoading } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [isTogglingActive, setIsTogglingActive] = useState<number | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      const response = await fetch("/api/cabinet/products");
      const result = await response.json();
      if (result.data?.products) {
        setProducts(result.data.products);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleToggleActive = async (id: number) => {
    setIsTogglingActive(id);
    try {
      const response = await fetch(`/api/cabinet/products/${id}/toggle-active`, {
        method: "PATCH",
      });
      const result = await response.json();
      if (result.data) {
        setProducts((prev) =>
          prev.map((p) =>
            p.id === id ? { ...p, isActive: result.data.isActive as boolean } : p
          )
        );
      }
    } catch (error) {
      console.error("Failed to toggle product status:", error);
    } finally {
      setIsTogglingActive(null);
    }
  };

  const handleDeleteClick = (id: number) => {
    const product = products.find((p) => p.id === id);
    if (product) {
      setProductToDelete(product);
      setDeleteModalOpen(true);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;

    setIsDeleting(productToDelete.id);
    try {
      const response = await fetch(`/api/cabinet/products/${productToDelete.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== productToDelete.id));
        setDeleteModalOpen(false);
        setProductToDelete(null);
      }
    } catch (error) {
      console.error("Failed to delete product:", error);
    } finally {
      setIsDeleting(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setProductToDelete(null);
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-malachite" />
      </div>
    );
  }

  return (
    <div>
      <CabinetTopBar
        title={t("title")}
        actions={
          <Link
            href="/cabinet/products/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-malachite text-white rounded-lg hover:bg-malachite/90 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            {t("addProduct")}
          </Link>
        }
      />

      <div className="p-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <ProductsTable
            products={products}
            onDelete={handleDeleteClick}
            isDeleting={isDeleting}
            onToggleActive={handleToggleActive}
            isTogglingActive={isTogglingActive}
          />
        </div>
      </div>

      <DeleteProductModal
        isOpen={deleteModalOpen}
        productName={productToDelete?.name ?? ""}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        isDeleting={isDeleting !== null}
      />
    </div>
  );
}
