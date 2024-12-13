import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const CreatePost = () => {
  const [caption, setCaption] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [video, setVideo] = useState<File | null>(null);
  const [cameraCapture, setCameraCapture] = useState<string | null>(null);

  const navigate = useNavigate();

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPhotos(Array.from(e.target.files));
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideo(e.target.files[0]);
    }
  };

  const handleCameraCapture = async () => {
    // This will trigger device camera and capture a photo
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const videoElement = document.createElement("video");
      videoElement.srcObject = stream;
      videoElement.play();

      const canvas = document.createElement("canvas");
      canvas.width = 640; // Set resolution
      canvas.height = 480;

      const context = canvas.getContext("2d");
      if (context) {
        context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
        setCameraCapture(canvas.toDataURL("image/jpeg"));
      }

      stream.getTracks().forEach((track) => track.stop());
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const handlePreview = () => {
    navigate("/preview-post", {
      state: { caption, photos, video, cameraCapture },
    });
  };

  return (
    <div className="p-5 space-y-4">
      <h1 className="text-2xl font-semibold">Create Post</h1>

      <Textarea
        placeholder="Write your caption here..."
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
      />

      <div>
        <Input
          type="file"
          multiple
          accept="image/*"
          onChange={handlePhotoUpload}
        />
        <p className="text-sm text-gray-500">You can upload multiple photos.</p>
      </div>

      <div>
        <Input type="file" accept="video/*" onChange={handleVideoUpload} />
        <p className="text-sm text-gray-500">Only one video allowed.</p>
      </div>

      <Button onClick={handleCameraCapture}>Capture from Camera</Button>

      {cameraCapture && (
        <div>
          <img src={cameraCapture} alt="Captured" className="w-32 h-32" />
        </div>
      )}

      <Button onClick={handlePreview} className="w-full">
        Preview Post
      </Button>
    </div>
  );
};

export default CreatePost;
