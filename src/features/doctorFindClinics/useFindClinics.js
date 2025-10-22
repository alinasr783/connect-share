import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getFindClinics } from "../../services/apiClinics";
// استيراد Supabase client إذا لم يكن موجودًا في apiClinics
import  supabase  from "../../services/supabase"; // افترضنا أن لديك ملف لإعداد Supabase

// دالة لجلب جميع الحجوزات من Supabase
async function getAllRentals() {
  const { data, error } = await supabase.from("rentals").select("*");
  if (error) {
    throw new Error(error.message);
  }
  return data;
}

function useFindClinics() {
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");

  // pagination
  const page = Number(searchParams.get("page")) || 1;

  // filters
  const priceFilter = searchParams.get("price");
  const specialtyFilter = searchParams.get("specialty");

  // Build filters array
  const filters = [];
  if (priceFilter && priceFilter !== "All") {
    filters.push({ field: "pricingModel", value: priceFilter });
  }
  if (specialtyFilter && specialtyFilter !== "All") {
    filters.push({ field: "specialty", value: specialtyFilter });
  }

  // جلب جميع العيادات مع التصفية والترتيب
  const {
    data: { data: clinics, count } = {},
    isPending: isLoadingClinics,
  } = useQuery({
    queryKey: ["find-clinics", page, filters],
    queryFn: () => getFindClinics({ page, filters }),
  });

  // جلب جميع الحجوزات
  const { data: rentals, isPending: isLoadingRentals } = useQuery({
    queryKey: ["rentals"],
    queryFn: getAllRentals,
  });

  // دمج البيانات لتحديد العيادات النشطة
  const activeClinics = clinics?.filter((clinic) => {
    // إذا لم يكن هناك حجوزات، فإن العيادة نشطة
    if (!rentals || rentals.length === 0) {
      return true;
    }

    // الحصول على حجوزات هذه العيادة
    const clinicRentals = rentals.filter((rental) => rental.clinic_id === clinic.id);

    // إذا لم يكن هناك حجوزات للعيادة، فإنها نشطة
    if (clinicRentals.length === 0) {
      return true;
    }

    // الحصول على التواريخ المتاحة من العيادة
    const availableDates = clinic.availableDate?.days || [];

    // الحصول على التواريخ المحجوزة لهذه العيادة
    const bookedDates = clinicRentals.map((rental) => rental.selected_date);

    // التحقق من وجود تواريخ متاحة غير محجوزة
    const hasAvailableDates = availableDates.some((date) => !bookedDates.includes(date));

    return hasAvailableDates;
  });

  const isLoading = isLoadingClinics || isLoadingRentals;

  return {
    clinics: activeClinics || [],
    count: activeClinics ? activeClinics.length : 0,
    isLoadingClinics: isLoading,
    searchTerm,
    setSearchTerm,
  };
}

export default useFindClinics;