import { useEffect, useRef } from "react";
import { Models } from "appwrite";
import { Card } from "../ui/card";
import { Link } from "react-router-dom";
import { multiFormatDateString } from "@/lib/utils";
import { SliderType } from "@/types";
import ImageSlider from "./ImageSlider";
import PostStats from "./PostStats";
import { useUserContext } from "@/context/AuthContext";
type PostCardProp = {
  post: Models.Document;
};

const PostCard = ({ post }: PostCardProp) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { user } = useUserContext();
  useEffect(() => {
    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          videoRef.current?.play();
        } else {
          videoRef.current?.pause();
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.5,
    });

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, []);

  return (
    <Card className="p-4 flex flex-col flex-between gap-2">
      <div>
        <div className="flex items-center gap-3">
          <Link to={`/profile/${post.creator.$id}`}>
            <img
              src={
                post?.creator?.imageUrl ||
                `assets/icons/profile-placeholder.svg`
              }
              alt="profile"
              className="rounded-full w-10 lg:h-12"
            />
          </Link>
          <div>
            <p className="font-bold">{post.creator.name}</p>
            <div>
              <p className="text-gray-500 text-xs">
                {multiFormatDateString(post.$createdAt)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <Link to={`/posts/${post.$id}`} className="flex flex-col gap-2">
        <p>{post.caption}</p>
        {post.Type === "image" ? (
          <ImageSlider images={post?.imageUrl} type={SliderType.Post} />
        ) : (
          <video
            ref={videoRef}
            src={post.VideoUrl}
            className="rounded-md w-full"
            muted
            loop
            controls
            onError={(e) => console.error("Video failed to load:", e)}
          >
            Your browser does not support the video tag.
          </video>
        )}
      </Link>
      <PostStats post={post} userId={user.id} />
    </Card>
  );
};

export default PostCard;
