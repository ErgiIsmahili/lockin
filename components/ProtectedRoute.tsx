import { RootState } from "@/app/(redux)/store";
import { useRouter } from "expo-router";
import { useEffect, ReactNode } from "react";
import { ActivityIndicator } from "react-native";
import { useSelector } from "react-redux";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const router = useRouter();
  const { user, isLoading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!user && !isLoading) {
      router.replace("/auth/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (!user) return null;

  return <>{children}</>;
};

export default ProtectedRoute;
