import { Navigate, Outlet } from "react-router-dom";

const AuthLayout = () => {
  const isAuthenticate = false;

  return (
    <>
      {isAuthenticate ? (
        <Navigate to="/" />
      ) : (
        <section className=" max-w-11/12 w-full h-screen flex justify-center items-center">
          <img
            src="/assets/images/signupImage.svg"
            alt="Background"
            className="absolute inset-0 w-full h-full object-fill sm:top-[200px] z-0"
          />
          <div className="relative z-10 flex justify-center items-center h-full">
            <Outlet />
          </div>
        </section>
      )}
    </>
  );
};

export default AuthLayout;
