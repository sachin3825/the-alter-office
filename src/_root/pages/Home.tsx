import { useUserContext } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { IoMdAdd } from "react-icons/io";
import { useNavigate } from "react-router-dom";
const Home = () => {
  const navigate = useNavigate();
  const { user } = useUserContext();

  return (
    <section className="flex flex-col max-w-screen-lg mx-auto p-5 relative h-screen">
      <div className="flex gap-2">
        <img
          src={user.imageUrl}
          alt="userImage"
          width={50}
          height={50}
          className="rounded-full cursor-pointer"
          onClick={() => navigate("/profile")}
        />
        <div>
          <small className="text-gray-500">Welcome Back</small>
          <p>
            {" "}
            <b>{user.name}</b>
          </p>
        </div>
      </div>
      <h2 className="text-2xl font-bold mt-8">Feeds</h2>
      <Button
        className="absolute bottom-5 right-5 rounded-full h-10 w-10"
        onClick={() => navigate("/create-post")}
      >
        <IoMdAdd color="white" size={35} />
      </Button>
    </section>
  );
};

export default Home;
