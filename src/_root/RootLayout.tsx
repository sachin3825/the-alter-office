import { useEffect, useState } from "react";
import { getUser, checkUserInDB, createUserAccount } from "@/lib/appwrite/api";
import { toast } from "@/hooks/use-toast";

const RootLayout = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeUser = async () => {
      try {
        const loggedInUser = await getUser();

        if (loggedInUser) {
          setUser(loggedInUser);

          const userExists = await checkUserInDB(loggedInUser.email);

          if (userExists === 0) {
            await createUserAccount(loggedInUser);
          }
        }
      } catch (err) {
        console.error("Error initializing user:", err);
        setError("Failed to initialize user.");
        toast({ title: "signup failed please try again" });
      } finally {
        setLoading(false);
      }
    };

    initializeUser();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div>
      <h1>Welcome, {user?.name || user?.email}!</h1>
      <p>Root Layout Content Goes Here</p>
    </div>
  );
};

export default RootLayout;
