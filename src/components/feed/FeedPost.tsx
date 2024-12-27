import { Avatar } from "../shared/Avatar";
import ReactTimeAgo from "react-time-ago";
import TimeAgo from "javascript-time-ago";

import en from "javascript-time-ago/locale/en";
import { getImageUrl } from "@/integrations/supabase/helper_functions/uploadFiles";

TimeAgo.addDefaultLocale(en);

interface FeedPostProps {
  author: {
    name: string;
    avatar?: string;
    username: string;
    email: string;
  };
  content: string;
  created_at: string;
  image_url?: string;
}

export const FeedPost = ({
  content,
  created_at,
  author,
  image_url,
}: FeedPostProps) => {
  return (
    <article className="bg-card rounded-lg p-4 shadow-sm card-hover animate-fade-up">
      <div className="flex items-start space-x-3">
        <Avatar src={author?.avatar} alt={author?.name} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 flex-wrap">
            <div className="flex flex-col items-start  mr-auto">
              <h3 className="font-medium text-card-foreground">
                {author?.name}
              </h3>
              <span className="text-muted-foreground text-sm">
                @{author?.email}
              </span>
            </div>
            {/* <span className="text-muted-foreground text-sm">·</span> */}
            <time className="text-muted-foreground text-sm">
              <ReactTimeAgo date={new Date(created_at)} locale="en-US" />
            </time>
          </div>
          {image_url && (
            <img
              src={getImageUrl(image_url)}
              alt=""
              className="mt-2 aspect-video w-full object-cover"
            />
          )}

          <p className="mt-2 text-card-foreground">{content}</p>
          {/* <div className="mt-4 flex items-center space-x-6">
            <Button variant="ghost" size="sm" className="gap-2">
              <Heart className="w-4 h-4" />
              <span>{likes}</span>
            </Button>
            <Button variant="ghost" size="sm" className="gap-2">
              <MessageCircle className="w-4 h-4" />
              <span>{comments}</span>
            </Button>
            <Button variant="ghost" size="sm">
              <Share2 className="w-4 h-4" />
            </Button>
          </div> */}
        </div>
      </div>
    </article>
  );
};
