import { PageTransition } from "@/components/layout/PageTransition";
import { CreatePost } from "@/components/feed/CreatePost";
import { FeedPost } from "@/components/feed/FeedPost";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/components/context/UserContext";

const Feed = () => {
  const [reloadPost, setReloadPost] = useState(false);
  const [posts, setPosts] = useState([]);
  const { currentUser } = useUser();
  const [allUser, setAllUsers] = useState([]);

  const handleReloadPosts = () => {
    setReloadPost(!reloadPost);
  };

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const { data, error } = await supabase
          .from("Users")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setAllUsers(data);
      } catch (error) {
        console.error("Error fetching posts:", error.message);
      }
    };
    fetchAllUsers();
  }, []);
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase
          .from("posts")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error.message);
      }
    };
    fetchPosts();
  }, [reloadPost]);

  return (
    <PageTransition>
      <div className="container max-w-2xl mx-auto px-4 py-6 space-y-6">
        <CreatePost
          currentUser={currentUser}
          setReloadPost={handleReloadPosts}
        />
        {posts?.map((post) => (
          <FeedPost
            key={post.id}
            {...post}
            author={allUser?.find((user) => user.id === post.user_id)}
          />
        ))}
      </div>
    </PageTransition>
  );
};

export default Feed;
