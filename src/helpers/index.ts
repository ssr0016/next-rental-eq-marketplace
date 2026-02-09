"use server";

import supabaseConfig from "@/config/supabase-config";

export const uploadFileAndGetUrl = async (file: File) => {
  try {
    const filePath = `uploads/${file.name}-${Date.now()}`;
    const { data, error } = await supabaseConfig.storage
      .from("default")
      .upload(filePath, file);

    if (error) {
      throw new Error(error.message);
    }

    const urlResponse: any = await supabaseConfig.storage
      .from("default")
      .getPublicUrl(filePath);
    if (urlResponse.error) {
      throw new Error(urlResponse.error.message);
    }

    return {
      success: true,
      data: urlResponse.data.publicUrl,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};
