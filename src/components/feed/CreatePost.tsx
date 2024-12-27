import { useEffect, useRef, useState } from "react";
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
  const [allUsers, setAllUsers] = useState([]);
  const [mentionSuggestions, setMentionSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

  const fetchAllUsers = async () => {
    const { data, error } = await supabase.from("Users").select("*");
    if (error) {
      console.error(error);
      return;
    }
    const allFilteredUsers = data.filter(
      (user: { id: string }) => user.id !== currentUser.id
    );
    setAllUsers(allFilteredUsers || []);
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setContent(value);

    const lastWord = value.split(" ").pop();
    if (lastWord?.startsWith("@")) {
      const query = lastWord.slice(1).toLowerCase();
      const suggestions = allUsers.filter((user: { name: string }) =>
        user.name.toLowerCase().includes(query)
      );
      setMentionSuggestions(suggestions);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (user: { name: string }) => {
    if (!textareaRef.current) return;

    const cursorPosition = textareaRef.current.selectionStart;
    const textBeforeCursor = content.slice(0, cursorPosition);
    const textAfterCursor = content.slice(cursorPosition);

    const lastWordStart = textBeforeCursor.lastIndexOf("@");
    const updatedContent =
      textBeforeCursor.slice(0, lastWordStart) +
      `@${user.name} ` +
      textAfterCursor;

    setContent(updatedContent);
    setShowSuggestions(false);
    textareaRef.current.focus();
  };

  useEffect(() => {
    const fetch_user_profile = async () => {
      const _userProfile = await fetchUserProfile(currentUser.id);
      setUserAvatar(_userProfile.avatar);
    };
    fetch_user_profile();
    fetchAllUsers();
  }, []);

  return (
    <div className="bg-card rounded-lg p-4 shadow-sm">
      <h3 className="text-xl font-semibold mb-5 text-center">
        Hi {currentUser?.name}👋🏻, Share your thoughts?
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-start flex-col gap-2 w-full">
          <div className="flex items-start space-x-3 h-max w-full">
            <Avatar src={userAvatar || ""} alt={currentUser?.name} />
            <textarea
              ref={textareaRef}
              value={content}
              onChange={handleTextareaChange}
              placeholder="What's on your mind?"
              className={`flex-1 bg-transparent resize-none outline-none placeholder:text-muted-foreground  ${
                image ? "" : "min-h-[100px]"
              }`}
            />
            {showSuggestions && (
              <ul className="absolute z-10 bg-white border rounded shadow-md max-h-40 top-52 max-w-[30%] overflow-y-auto w-full">
                {mentionSuggestions.map(
                  (user: { name: string; id: string }) => (
                    <li
                      key={user.id}
                      className="p-2 cursor-pointer hover:bg-gray-200"
                      onClick={() => handleSuggestionClick(user)}
                    >
                      {user.name}
                    </li>
                  )
                )}
              </ul>
            )}
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
