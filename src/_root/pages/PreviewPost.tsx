import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useCreatePost } from "@/lib/react-query/queriesAndMutation";
import ImageSlider from "@/components/shared/ImageSlider";
import { useUserContext } from "@/context/AuthContext";
import { SliderType } from "@/types";
const PreviewPost = () => {
  const { user } = useUserContext();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { caption, photos, video, cameraCapture } = state || {};
  const [images, setImages] = useState<string[]>(photos || []);

  const { mutateAsync: createPost, isPending: isLoadingCreate } =
    useCreatePost();

  const handleDeleteImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
  };

  useEffect(() => {
    if (photos && photos.length > 0) {
      const imageUrls = photos.map((file: File) => URL.createObjectURL(file));
      setImages(imageUrls);
    }
  }, [photos]);

  useEffect(() => {
    if (!caption && images.length === 0 && !video && !cameraCapture) {
      toast({ title: "Please add content before creating the post." });
      navigate("/create-post");
    }
  }, [images, caption, video, cameraCapture, navigate]);

  const handleCreatePost = async () => {
    if (!caption && images.length === 0 && !video && !cameraCapture) {
      toast({ title: "Please add content before creating the post." });
      navigate("/create-post");
      return;
    }

    try {
      const files: File[] = [];

      if (images.length > 0) {
        const imageFiles = await Promise.all(
          images.map(async (image) => {
            const blob = await fetch(image).then((res) => res.blob());
            return new File([blob], `image-${Date.now()}.jpeg`, {
              type: "image/jpeg",
            });
          })
        );
        files.push(...imageFiles);
      }

      if (video) {
        const videoBlob = await fetch(video).then((res) => res.blob());
        const videoFile = new File([videoBlob], `video-${Date.now()}.mp4`, {
          type: "video/mp4",
        });
        files.push(videoFile);
      }

      if (cameraCapture) {
        const captureFile = new File(
          [cameraCapture],
          `capture-${Date.now()}.jpeg`,
          { type: "image/jpeg" }
        );
        files.push(captureFile);
      }

      const postData: any = {
        userId: user.id,
        caption,
        file: files,
        type: video ? "video" : "image",
        tags: "tag1, tag2",
      };

      const newPost = await createPost(postData);

      console.log("Post created successfully:", newPost);

      navigate(`/`);
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const isCreatePostDisabled =
    !caption && images.length === 0 && !video && !cameraCapture;

  return (
    <div className="p-5 space-y-4">
      <h1 className="text-2xl font-semibold">Preview Post</h1>

      <p className="text-lg font-medium">{caption}</p>

      {/* Image slider */}
      {images.length > 0 && (
        <ImageSlider
          images={images}
          onDelete={handleDeleteImage}
          type={SliderType.Preview}
        />
      )}

      {/* Video */}
      {video && (
        <video
          controls
          src={URL.createObjectURL(video)}
          className="w-full rounded-md"
        />
      )}

      {/* Captured Image */}
      {cameraCapture && (
        <img src={cameraCapture} alt="Captured" className="w-full rounded-md" />
      )}

      <Button
        onClick={handleCreatePost}
        className="w-full"
        disabled={isCreatePostDisabled}
      >
        {isLoadingCreate ? "loading ..." : "Create Post"}
      </Button>
    </div>
  );
};

export default PreviewPost;
