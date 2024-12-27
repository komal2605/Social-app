import { supabase } from "@/integrations/supabase/client";

type UserProfile = {
  id: string;
  name: string;
  avatar: string;
  email: string;
  created_at: string;
};

export const fetchUserProfile = async (
  userID: string
): Promise<UserProfile | null> => {
  try {
    const { data, error } = await supabase
      .from("Users")
      .select("*")
      .eq("id", userID)
      .single();

    if (error) throw error;
    return data as UserProfile;
  } catch (error) {
    console.error("Error fetching posts:", error.message);
  }
};
