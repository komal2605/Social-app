import { PageTransition } from "@/components/layout/PageTransition";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { FeedPost } from "@/components/feed/FeedPost";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/components/context/UserContext";

const Profile = () => {
  const [posts, setPosts] = useState([]);
  const { currentUser } = useUser();

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("user_id", currentUser.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error.message);
    }
  };
  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <PageTransition>
      <div className="container max-w-2xl mx-auto px-4 py-6 space-y-6">
        {currentUser && <ProfileHeader user={currentUser} />}
        {posts.length > 0 && (
          <h4 className="text-xl font-semibold">Posts ({posts.length})</h4>
        )}
        {posts.length > 0 ? (
          posts.map((post) => (
            <FeedPost key={post.id} {...post} author={currentUser} />
          ))
        ) : (
          <p>No posts available.</p>
        )}
      </div>
    </PageTransition>
  );
};

export default Profile;
