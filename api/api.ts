import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/AuthProvider";
import { useQuery } from "@tanstack/react-query";

export const GetProductsAndCategories = () => {
  return useQuery({
    queryKey: ["products", "category"],
    queryFn: async () => {
      const [products, category] = await Promise.all([
        supabase.from("products").select("*"),
        supabase.from("category").select("*"),
      ]);

      if (products.error || category.error) {
        throw new Error("Failed to fetch products and categories");
      }
      return { products: products.data, category: category.data };
    },
  });
};

export const GetProductBySlug = (slug: string) => {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const products = await supabase
        .from("products")
        .select("*")
        .eq("slug", slug)
        .single();

      if (products.error) {
        throw new Error("Failed to fetch products" + products?.error?.message);
      }
      return products;
    },
  });
};

export const GetCategoriesWithProducts = (categorySlug: string) => {
  return useQuery({
    queryKey: ["categoryandProducts", categorySlug],
    queryFn: async () => {
      const { data: category, error: categoryError } = await supabase
        .from("category")
        .select("*")
        .eq("slug", categorySlug)
        .single();

      if (categoryError || !category) {
        throw new Error("Failed to fetch categories" + categoryError.message);
      }

      const { data: products, error: productError } = await supabase
        .from("products")
        .select("*")
        .eq("category", category.id);

      if (productError) {
        throw new Error("Failed to fetch products" + productError?.message);
      }

      return { category, products };
    },
  });
};

export const GetMyorders = () => {
  const {
    user: { id },
  } = useAuth();

  return useQuery({
    queryKey: ["myorders", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("order")
        .select("*")
        .order("created_at", { ascending: false })
        .eq("user", id);

        if(error) {
          throw new Error(error.message);
        }

        return data;
    },
  });
};
