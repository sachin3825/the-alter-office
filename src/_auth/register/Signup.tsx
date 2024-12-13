import { Button } from "@/components/ui/button";
import { FaGoogle } from "react-icons/fa";
import { loginWithGoogle, logoutUser } from "@/lib/appwrite/api";

const Signup = () => {
  return (
    <div className="bg-white w-full gap-5  md:w-6/12 lg:w-8/12 px-5 pt-10 pb-20 flex justify-center items-center flex-col rounded-t-[50px] ">
      <div className="flex gap-2">
        <img src="/assets/images/logo.svg" alt="logo" width={50} height={50} />
        <h1 className="text-2xl">Vibesnap</h1>
      </div>
      <p>Moments That Matter, Shared Forever.</p>
      <Button onClick={loginWithGoogle}>
        <FaGoogle />
        Continue with Google
      </Button>
      <Button onClick={logoutUser}>Logout</Button>
    </div>
  );
};

export default Signup;
