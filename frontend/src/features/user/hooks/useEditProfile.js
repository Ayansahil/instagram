import { useState } from "react";
import { useAuth } from "../../auth/hooks/useAuth";

export const useEditProfile = () => {
  const { user, handleUpdateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateProfile = async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const res = await handleUpdateUser(payload);
      return res;
    } catch (err) {
      setError(err.message || "Failed to update profile");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { user, updateProfile, loading, error };
};
