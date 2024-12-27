import { supabase } from "@/integrations/supabase/client";

export const uploadImage = async (file: File, userId: string) => {
  const filePath = `${userId}-${file.name}`;
  try {
    const { data, error } = await supabase.storage
      .from("social") // Replace with your bucket name
      .upload(filePath, file, { upsert: true });

    if (error) throw error;

    return filePath; // Return the file path
  } catch (error) {
    console.error("Error uploading image:", error.message);
    throw error;
  }
};

// Function to get a public URL for the uploaded image
export const getImageUrl = (path: string) => {
  const { data } = supabase.storage.from("social").getPublicUrl(path);
  return data?.publicUrl || "";
};

// Function to update the user profile
export const updateUserProfile = async (
  userId: string,
  updates: Partial<any>
) => {
  try {
    const { data, error } = await supabase
      .from("Users") // Replace with your table name
      .update(updates)
      .eq("id", userId);

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Error updating user:", error.message);
    throw error;
  }
};
