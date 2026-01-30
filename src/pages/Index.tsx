import { useAuth } from "@/hooks/useAuth";
import { AuthScreen } from "@/components/auth/AuthScreen";
import { GameScene } from "@/components/game/GameScene";
import { LoadingScreen } from "@/components/game/LoadingScreen";

const Index = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen message="Connecting to Metaverse..." />;
  }

  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  return <GameScene />;
};

export default Index;
