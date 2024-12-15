import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useUserContext } from "@/context/AuthContext";
import { useGetUserById } from "@/lib/react-query/queriesAndMutation"; // Custom hook
import Loader from "@/components/shared/Loader";

const Profile = () => {
  const { accountId: id } = useParams();
  const { user } = useUserContext(); // Logged-in user from context

  const { data: profile, isLoading } = useGetUserById(id as string); // Fetch user profile

  const [editing, setEditing] = useState(false);

  // Local State for Editable Fields
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  // Set form state when data is loaded
  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      setBio(profile.bio || "");
      setCoverImageUrl(profile.coverImageUrl || "");
      setImageUrl(profile.imageUrl || "");
    }
  }, [profile]);

  if (isLoading) return <Loader />;
  if (!profile) return <div>User not found.</div>;

  return (
    <div className=" h-screen bg-gray-100 flex flex-col items-center max-w-screen-lg mx-auto">
      {/* Cover Image */}
      <div
        className="w-full h-48 bg-gray-300"
        style={{
          backgroundImage: `url(${coverImageUrl})`,
          backgroundSize: "cover",
        }}
      ></div>

      {/* Profile Image */}
      <div className="relative -mt-16 w-32 h-32">
        <img
          src={imageUrl}
          alt="Profile"
          className="w-full h-full rounded-full object-cover border-4 bg-white border-white"
        />
      </div>

      {/* User Info */}
      <div className="text-center mt-4">
        {editing ? (
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="text-2xl font-bold border border-gray-300 p-1"
          />
        ) : (
          <h1 className="text-2xl font-bold">{profile.name}</h1>
        )}
        {editing ? (
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="mt-2 border border-gray-300 p-1"
          />
        ) : (
          <p className="mt-2 text-gray-600">{profile.bio}</p>
        )}
      </div>

      {/* Edit Options */}
      {user?.id === profile.$id && (
        <div className="mt-4">
          <button
            onClick={() => setEditing((prev) => !prev)}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            {editing ? "Cancel" : "Edit Profile"}
          </button>
        </div>
      )}
    </div>
  );
};

export default Profile;
