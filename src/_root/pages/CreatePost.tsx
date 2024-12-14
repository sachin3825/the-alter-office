import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, CameraType } from "react-camera-pro";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

const CreatePost = () => {
  const camera = useRef<CameraType | null>(null);
  const [caption, setCaption] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);

  const [video, setVideo] = useState<File | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const navigate = useNavigate();

  // Handle photo upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (video) {
      toast({
        title: "Error",
        description: "Cannot upload photos when a video is selected.",
        variant: "destructive",
      });
      return;
    }

    if (e.target.files) {
      setPhotos(Array.from(e.target.files));
      toast({
        title: "Success",
        description: "Photos uploaded successfully!",
      });
    }
  };

  // Handle video upload
  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (photos.length > 0 || capturedImage) {
      toast({
        title: "Error",
        description:
          "Cannot upload a video when photos or a captured image are already added.",
        variant: "destructive",
      });
      return;
    }

    if (e.target.files && e.target.files[0]) {
      setVideo(e.target.files[0]);
      toast({
        title: "Success",
        description: "Video uploaded successfully!",
      });
    }
  };

  // Handle camera capture

  const handleCameraCapture = () => {
    if (video) {
      toast({
        title: "Error",
        description: "Cannot use the camera when a video is selected.",
        variant: "destructive",
      });
      return;
    }

    const image: any = camera.current?.takePhoto();
    if (image) {
      if (typeof image === "string") {
        setCapturedImage(image); // base64 string directly
      } else {
        // If it's an ImageData object, convert it to base64
        const canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(image, 0, 0);
          setCapturedImage(canvas.toDataURL("image/jpeg"));
        }
      }

      // Convert base64 to File object and add to photos array
      fetch(image)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], `capture-${Date.now()}.jpg`, {
            type: "image/jpeg",
          });
          setPhotos((prev) => [...prev, file]);
        });

      toast({
        title: "Success",
        description: "Photo captured successfully!",
      });

      setShowCamera(false);
    }
  };

  // Preview post and validate content
  const handlePreview = () => {
    if (!caption && photos.length === 0 && !video && !capturedImage) {
      toast({
        title: "Error",
        description: "Please add content before previewing the post.",
        variant: "destructive",
      });
      return;
    }

    navigate("/preview-post", {
      state: { caption, photos, video, capturedImage },
    });
  };

  return (
    <div className="max-w-screen-lg flex flex-col justify-between h-screen p-2 mx-auto">
      <div className="p-5 space-y-4">
        <h1 className="text-2xl font-semibold">Create Post</h1>

        {/* Caption input */}
        <Textarea
          placeholder="Write your caption here..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />

        {/* Photo upload */}
        <div>
          <Input
            type="file"
            multiple
            accept="image/*"
            onChange={handlePhotoUpload}
            disabled={!!video}
          />
          <p className="text-sm text-gray-500">
            You can upload multiple photos.
          </p>
        </div>

        {/* Video upload */}
        <div>
          <Input
            type="file"
            accept="video/*"
            onChange={handleVideoUpload}
            disabled={photos.length > 0 || !!capturedImage}
          />
          <p className="text-sm text-gray-500">Only one video allowed.</p>
        </div>

        {/* Open camera button */}
        <Button onClick={() => setShowCamera(true)} disabled={!!video}>
          Open Camera
        </Button>

        {/* Camera view */}
        {showCamera && (
          <div className="relative">
            <Camera
              ref={camera}
              aspectRatio={16 / 9}
              errorMessages={{
                noCameraAccessible: "No camera device accessible.",
                permissionDenied: "Permission denied.",
                switchCamera: "Unable to switch cameras.",
                canvas: "Canvas is not supported.",
              }}
            />
            <Button
              onClick={handleCameraCapture}
              className="absolute bottom-5 left-[50%]"
            >
              Capture
            </Button>
          </div>
        )}

        {/* Captured image preview */}
        {capturedImage && (
          <div>
            <img src={capturedImage} alt="Captured" className="w-32 h-32" />
          </div>
        )}
      </div>

      {/* Preview button */}
      <Button
        onClick={handlePreview}
        className="w-max self-center rounded-full px-20"
      >
        Preview Post
      </Button>
    </div>
  );
};

export default CreatePost;
