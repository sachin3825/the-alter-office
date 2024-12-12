import { Navigate, Outlet } from "react-router-dom";

const AuthLayout = () => {
  const isAuthenticated = false;

  return (
    <>
      {isAuthenticated ? (
        <Navigate to="/" />
      ) : (
        <>
          <section className="max-w-11/12 mx-auto  h-screen flex justify-center items-end relative">
            <img
              src="/assets/images/signupImage.svg"
              alt="Background"
              className="absolute inset-0 w-full h-full object-cover p-1 md:p-0 md:object-fill z-0"
            />
            <div className="relative z-10 w-full flex justify-center items-end">
              <Outlet />
            </div>
          </section>
        </>
      )}
    </>
  );
};

export default AuthLayout;
