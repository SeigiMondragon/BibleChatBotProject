import { useState, useEffect } from "react";
import { authServices } from "../../services/AuthServices";

export const useAuth = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await authServices.getUser();
        setUserData(user);
        console.log("This is the user", user);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  return { userData, loading, error };
};
