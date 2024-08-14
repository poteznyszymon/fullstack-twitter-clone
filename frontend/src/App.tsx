import { Navigate, Route, Routes } from "react-router-dom";
import AuthLayout from "./pages/auth/AuthLayout";
import LoginPage from "./pages/auth/login/LoginPage";
import RegisterPage from "./pages/auth/register/RegisterPage";
import RootLayout from "./pages/root/RootLayout";
import HomePage from "./pages/root/pages/home/HomePage";
import NotificationsPage from "./pages/root/pages/notifications/NotificationsPage";
import ProfilePage from "./pages/root/pages/profile/ProfilePage";
import { ThemeProvider } from "./components/ThemeProvider";
import { useQuery } from "@tanstack/react-query";
import { User } from "./models/interfaces";
import BookmarksPage from "./pages/root/pages/bookmarks/BookmarksPage";

function App() {
  const { data: authUser, isLoading } = useQuery<User>({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.error) return null;
        if (!res.ok) throw new Error(data.error || "something went wrong");
        console.log("auth user: ", authUser);
        return data;
      } catch (error) {
        console.log(error);
      }
    },
  });

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <img src="/loading-icon-white.svg" alt="loader" className="h-12" />
      </div>
    );
  }

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Routes>
        <Route
          path="/auth"
          element={!authUser ? <AuthLayout /> : <Navigate to="/" />}
        >
          <Route index element={<Navigate to="/auth/login" />} />
          <Route
            path="login"
            element={!authUser ? <LoginPage /> : <Navigate to="/" />}
          />
          <Route path="register" element={<RegisterPage />} />
        </Route>
        <Route
          path="/"
          element={authUser ? <RootLayout /> : <Navigate to="/auth" />}
        >
          <Route
            index
            element={authUser ? <HomePage /> : <Navigate to="/auth" />}
          />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="profile/:username" element={<ProfilePage />} />
          <Route path="bookmarks" element={<BookmarksPage />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}

export default App;
