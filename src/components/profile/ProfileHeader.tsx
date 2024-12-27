import { useEffect, useState } from "react";
import { Avatar } from "../shared/Avatar";
import {
  getImageUrl,
  updateUserProfile,
  uploadImage,
} from "@/integrations/supabase/helper_functions/uploadFiles";
import { fetchUserProfile } from "@/integrations/supabase/helper_functions/user/getUserProfile";

interface ProfileHeaderProps {
  user: {
    id: string;
    name: string;
    email: string;
    username: string;
    avatar?: string;
    bio?: string;
    // followers?: number;
    // following?: number;
  };
}

export const ProfileHeader = ({ user }: ProfileHeaderProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar || "");

  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const fetchUserPRofile = async () => {
      const _userProfile = await fetchUserProfile(user.id);
      setUserProfile(_userProfile);
      setAvatarUrl(_userProfile.avatar);
    };
    fetchUserPRofile();
  }, []);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);

      try {
        // Upload the image
        const filePath = await uploadImage(selectedFile, user.id);

        // Get the public URL
        const publicUrl = getImageUrl(filePath);
        setAvatarUrl(publicUrl);

        // Update user profile in the database
        await updateUserProfile(user.id, { avatar: publicUrl });

        alert("Profile updated successfully!");
      } catch (error) {
        console.error("Error updating profile:", error.message);
      }
    }
  };
  return (
    <div className="bg-card rounded-lg p-6 shadow-sm">
      <div className="flex flex-col items-center text-center space-y-4">
        <input
          type="file"
          className="hidden"
          id="avatar"
          onChange={handleFileChange}
          accept="image/*"
        />
        <label htmlFor="avatar" className="cursor-pointer">
          <Avatar size="lg" alt={user?.name} src={avatarUrl} />
        </label>
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-card-foreground">
            {user?.name}
          </h1>
          <p className="text-muted-foreground">{user?.email}</p>
        </div>
        {user?.bio && (
          <p className="text-card-foreground max-w-md">{user?.bio}</p>
        )}
        <div className="flex items-center space-x-6">
          <div className="text-center">
            <p className="font-semibold">{user?.followers || 0}</p>
            <p className="text-muted-foreground text-sm">Followers</p>
          </div>
          <div className="text-center">
            <p className="font-semibold">{user?.following || 0}</p>
            <p className="text-muted-foreground text-sm">Following</p>
          </div>
        </div>
        {/* <Button className="w-full sm:w-auto">Follow</Button> */}
      </div>
    </div>
  );
};
