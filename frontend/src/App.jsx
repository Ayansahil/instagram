import { RouterProvider } from "react-router-dom";
import AppRoutes from "./AppRoutes";
import { AuthProvider } from "./features/auth/auth.Context.jsx";

const App = () => {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
};

export default App;
