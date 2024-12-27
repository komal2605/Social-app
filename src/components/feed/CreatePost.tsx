import { useEffect, useState } from "react";
import { Avatar } from "../shared/Avatar";
import { Button } from "../shared/Button";
import { Image, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { fetchUserProfile } from "@/integrations/supabase/helper_functions/user/getUserProfile";

export const CreatePost = ({
  currentUser,
  setReloadPost,
}: {
  currentUser: { name: string; id: string };
  setReloadPost: () => void;
}) => {
  const { toast } = useToast();
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userAvatar, setUserAvatar] = useState("");

  const uploadImage = async () => {
    if (!image) return null;

    const fileName = `${Date.now()}-${image.name}`;
    const { data, error } = await supabase.storage
      .from("social")
      .upload(`posts/${fileName}`, image);

    if (error) throw error;

    return data?.path;
  };

  const createPost = async () => {
    try {
      setIsLoading(true);
      const { data: authData, error: authError } =
        await supabase.auth.getUser();
      if (authError) throw authError;

      const imageUrl = await uploadImage();

      const { data, error } = await supabase
        .from("posts")
        .insert([
          { content: content, user_id: authData.user.id, image_url: imageUrl },
        ])
        .select();

      if (error) throw error;

      toast({
        title: "Post created",
        description: "Your post has been created successfully",
      });

      setReloadPost();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim().length === 0) return;
    createPost();
    setContent("");
    setImage(null); // Reset the image
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImage(file);
  };
  useEffect(() => {
    const fetchUserPRofile = async () => {
      const _userProfile = await fetchUserProfile(currentUser.id);
      setUserAvatar(_userProfile.avatar);
    };
    fetchUserPRofile();
  }, []);
  
  return (
    <div className="bg-card rounded-lg p-4 shadow-sm">
      <h3 className="text-xl font-semibold mb-3 text-center">
        Hi {currentUser?.name}, Share your thoughts?
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-start flex-col gap-2 w-full">
          <div className="flex items-start space-x-3 h-max w-full">
            <Avatar src={userAvatar || ""} alt={currentUser?.name} />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind?"
              className={`flex-1 bg-transparent resize-none outline-none placeholder:text-muted-foreground  ${
                image ? "" : "min-h-[100px]"
              }`}
            />
          </div>
          {image && (
            <div className="flex items-center space-x-2 mt-2">
              <img
                src={URL.createObjectURL(image)}
                alt="Preview"
                className="h-20 w-20 rounded object-cover"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setImage(null)}
              >
                Remove
              </Button>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between pt-2 border-t">
          {!image && (
            <label htmlFor="image-upload" className="cursor-pointer">
              <Image className="w-4 h-4" />
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          )}
          <Button
            type="submit"
            disabled={!content.trim()}
            size="sm"
            className="gap-2"
          >
            <Send className="w-4 h-4" />
            <span>{isLoading ? "Posting..." : "Post"}</span>
          </Button>
        </div>
      </form>
    </div>
  );
};
