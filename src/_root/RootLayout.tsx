import { useEffect } from "react";
import { getUser, checkUserInDB } from "@/lib/appwrite/api";
import { toast } from "@/hooks/use-toast";
import { useCreateUserAccountMutation } from "@/lib/react-query/queriesAndMutation";
import { useUserContext } from "@/context/AuthContext";
import { Outlet } from "react-router-dom";

const RootLayout = () => {
  const { user } = useUserContext();
  const { mutateAsync: createUserAccount, isPending } =
    useCreateUserAccountMutation();

  useEffect(() => {
    const initializeUser = async () => {
      try {
        const loggedInUser = await getUser();

        if (loggedInUser) {
          const userExists = await checkUserInDB(loggedInUser.email);

          if (userExists === 0) {
            await createUserAccount(loggedInUser);
          }
        }
      } catch (err) {
        console.error("Error initializing user:", err);

        toast({ title: "signup failed please try again" });
      }
    };

    initializeUser();
  }, [user]);

  if (isPending) {
    return <p>Loading...</p>;
  }

  return <Outlet />;
};

export default RootLayout;
