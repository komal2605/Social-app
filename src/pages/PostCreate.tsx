import { useUser } from "@/components/context/UserContext";
import { CreatePost } from "@/components/feed/CreatePost";
import { PageTransition } from "@/components/layout/PageTransition";

const PostCreate = () => {
  const currentUser = useUser();
  return (
    <PageTransition>
      <div className="container max-w-2xl mx-auto px-4 py-6 space-y-6">
        <CreatePost
          currentUser={currentUser.currentUser}
          setReloadPost={() => {}}
        />
      </div>
    </PageTransition>
  );
};

export default PostCreate;
