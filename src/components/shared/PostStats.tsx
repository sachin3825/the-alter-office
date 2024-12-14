import { useLikePost } from "@/lib/react-query/queriesAndMutation";
import { checkIsLiked } from "@/lib/utils";
import { Models } from "appwrite";
import { useState } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

type PostStatsProps = {
  post: Models.Document;
  userId: string;
};

const PostStats = ({ post, userId }: PostStatsProps) => {
  const likesList = post.likes.map((user: Models.Document) => user.$id);
  const [likes, setLikes] = useState(likesList);
  const { mutate: likePost } = useLikePost();

  const handleLikePost = (e: React.MouseEvent) => {
    e.stopPropagation();
    let newLikes = [...likes];
    if (newLikes.includes(userId)) {
      newLikes = newLikes.filter((id) => id !== userId);
    } else {
      newLikes.push(userId);
    }
    setLikes(newLikes);
    likePost({ postId: post.$id, likesArray: newLikes });
  };

  const isLiked = checkIsLiked(likes, userId);

  return (
    <div>
      <div className="flex gap-2 items-center">
        <button onClick={handleLikePost} className="cursor-pointer">
          {isLiked ? (
            <AiFillHeart size={24} color="red" />
          ) : (
            <AiOutlineHeart size={24} color="gray" />
          )}
        </button>
        <p className="text-sm">{likes.length}</p>
      </div>
    </div>
  );
};

export default PostStats;
