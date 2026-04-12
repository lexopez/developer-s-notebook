// import { useUser } from "../features/authentication/useUser";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import SpinnerPage from "./SpinnerPage";
import { useUser } from "../hooks/user/useAuth";

function ProtectedApp({ children }) {
  const navigate = useNavigate();

  // 1. Load the authenticated user
  const { isLoading, isAuthenticated } = useUser();

  // 2. If there is NO authenticated user, redirect to the /login
  useEffect(
    function () {
      if (!isAuthenticated && !isLoading) navigate("/AuthPage");
    },
    [isAuthenticated, isLoading, navigate],
  );

  // 3. While loading, show a spinner
  if (isLoading) return <SpinnerPage />;

  // 4. If there IS a user, render the app
  if (isAuthenticated) return children;
}

export default ProtectedApp;
