import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

const PreviewPost = () => {
  const { state } = useLocation();
  const { caption, photos, video, cameraCapture } = state || {};

  const handleCreatePost = async () => {
    try {
      // Logic to upload images and video to Appwrite storage
      // Save metadata (caption, file IDs) to Appwrite database
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <div className="p-5 space-y-4">
      <h1 className="text-2xl font-semibold">Preview Post</h1>

      <p className="text-lg font-medium">{caption}</p>

      <div className="space-y-2">
        {photos &&
          photos.map((photo: any, index: number) => (
            <img
              key={index}
              src={URL.createObjectURL(photo)}
              alt={`Photo ${index + 1}`}
              className="w-full rounded-md"
            />
          ))}
      </div>

      {video && (
        <video
          controls
          src={URL.createObjectURL(video)}
          className="w-full rounded-md"
        />
      )}

      {cameraCapture && (
        <img src={cameraCapture} alt="Captured" className="w-full rounded-md" />
      )}

      <Button onClick={handleCreatePost} className="w-full">
        Create Post
      </Button>
    </div>
  );
};

export default PreviewPost;
