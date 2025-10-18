// features/doctorFindClinics/useUploadPaymentScreenshot.js
import { useState } from 'react';
import supabase from '../../services/supabase'; // تأكد من مسار ال supabase client

export function useUploadPaymentScreenshot() {
  const [isUploading, setIsUploading] = useState(false);

  const uploadScreenshot = async (file) => {
    setIsUploading(true);
    
    try {
      // إنشاء اسم فريد للملف
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`; // إزالة المسار المكرر

      // رفع الملف إلى Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('payment-screenshots') // اسم ال bucket
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // الحصول على الرابط العام للصورة
      const { data: { publicUrl } } = supabase.storage
        .from('payment-screenshots')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading screenshot:', error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadScreenshot,
    isUploading,
  };
}