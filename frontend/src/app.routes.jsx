import { createBrowserRouter } from "react-router-dom";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import Feed from "./features/post/pages/Feed";
import MainLayout from "./features/post/components/MainLayout";
import ProtectedRoute from "./features/auth/components/ProtectedRoute";
import CreatePostRoute from "./features/post/pages/CreatePostRoute";
import Profile from "./features/user/pages/Profile";

export const router = createBrowserRouter([
  // ─── Public routes (no sidebar) ─────────────────────────────────────────────
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },

  // ─── Protected routes (sidebar + content side by side) ──────────────────────
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      // Feed is always mounted as the base — modal overlays it
      {
        index: true,
        element: <Feed />,
      },
      // /create-post renders Feed underneath + modal on top
      {
        path: "create-post",
        element: <CreatePostRoute />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
    ],
  },
]);
