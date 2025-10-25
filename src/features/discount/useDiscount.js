// features/discount/useDiscount.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import supabase from '../../services/supabase';
export function useDiscount() {
  const queryClient = useQueryClient();

  const { mutate: validateDiscount, isLoading: isValidating } = useMutation({
    mutationFn: async (discountCode) => {
      if (!discountCode.trim()) {
        throw new Error("Please enter a discount code");
      }

      const { data, error } = await supabase
        .from("discount")
        .select("*")
        .eq("code", discountCode.trim().toUpperCase())
        .single();

      if (error) {
        throw new Error("Invalid discount code");
      }

      if (!data) {
        throw new Error("Discount code not found");
      }

      return data;
    },
  });

  return {
    validateDiscount,
    isValidating,
  };
}