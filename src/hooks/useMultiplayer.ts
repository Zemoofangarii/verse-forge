import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Player, PlayerPosition } from "@/types/game";
import { useAuth } from "./useAuth";

const POSITION_UPDATE_INTERVAL = 50; // 20 updates per second

export function useMultiplayer() {
  const { user } = useAuth();
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [otherPlayers, setOtherPlayers] = useState<Player[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const lastUpdateRef = useRef<number>(0);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  // Fetch current player profile
  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        return;
      }

      if (data) {
        setCurrentPlayer({
          id: data.id,
          user_id: data.user_id,
          username: data.username,
          avatar_color: data.avatar_color,
          avatar_shape: data.avatar_shape || "capsule",
          position: {
            x: data.position_x,
            y: data.position_y,
            z: data.position_z,
          },
          rotation: { y: data.rotation_y },
          is_online: true,
        });

        // Mark as online
        await supabase
          .from("profiles")
          .update({ is_online: true, last_seen: new Date().toISOString() })
          .eq("user_id", user.id);
      }
    };

    fetchProfile();
  }, [user]);

  // Fetch other players
  useEffect(() => {
    if (!user) return;

    const fetchOtherPlayers = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .neq("user_id", user.id)
        .eq("is_online", true);

      if (error) {
        console.error("Error fetching players:", error);
        return;
      }

      if (data) {
        setOtherPlayers(
          data.map((p) => ({
            id: p.id,
            user_id: p.user_id,
            username: p.username,
            avatar_color: p.avatar_color,
            avatar_shape: p.avatar_shape || "capsule",
            position: {
              x: p.position_x,
              y: p.position_y,
              z: p.position_z,
            },
            rotation: { y: p.rotation_y },
            is_online: p.is_online,
          }))
        );
      }
    };

    fetchOtherPlayers();
  }, [user]);

  // Subscribe to realtime updates
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("profiles-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "profiles",
        },
        (payload) => {
          const data = payload.new as {
            id: string;
            user_id: string;
            username: string;
            avatar_color: string;
            avatar_shape: string;
            position_x: number;
            position_y: number;
            position_z: number;
            rotation_y: number;
            is_online: boolean;
          };

          // Skip own updates
          if (data.user_id === user.id) return;

          const player: Player = {
            id: data.id,
            user_id: data.user_id,
            username: data.username,
            avatar_color: data.avatar_color,
            avatar_shape: data.avatar_shape || "capsule",
            position: {
              x: data.position_x,
              y: data.position_y,
              z: data.position_z,
            },
            rotation: { y: data.rotation_y },
            is_online: data.is_online,
          };

          if (payload.eventType === "DELETE" || !data.is_online) {
            setOtherPlayers((prev) =>
              prev.filter((p) => p.user_id !== data.user_id)
            );
          } else {
            setOtherPlayers((prev) => {
              const existing = prev.find((p) => p.user_id === data.user_id);
              if (existing) {
                return prev.map((p) =>
                  p.user_id === data.user_id ? player : p
                );
              }
              return [...prev, player];
            });
          }
        }
      )
      .subscribe((status) => {
        setIsConnected(status === "SUBSCRIBED");
      });

    channelRef.current = channel;

    return () => {
      // Mark as offline when leaving
      if (user) {
        supabase
          .from("profiles")
          .update({ is_online: false })
          .eq("user_id", user.id)
          .then(() => {});
      }
      channel.unsubscribe();
    };
  }, [user]);

  // Update position with throttling
  const updatePosition = useCallback(
    async (position: PlayerPosition, rotationY: number) => {
      if (!user) return;

      const now = Date.now();
      if (now - lastUpdateRef.current < POSITION_UPDATE_INTERVAL) return;
      lastUpdateRef.current = now;

      // Update local state immediately
      setCurrentPlayer((prev) =>
        prev
          ? {
              ...prev,
              position,
              rotation: { y: rotationY },
            }
          : null
      );

      // Sync to database
      await supabase
        .from("profiles")
        .update({
          position_x: position.x,
          position_y: position.y,
          position_z: position.z,
          rotation_y: rotationY,
          last_seen: new Date().toISOString(),
        })
        .eq("user_id", user.id);
    },
    [user]
  );

  // Update avatar
  const updateAvatar = useCallback((color: string, shape: string) => {
    setCurrentPlayer((prev) =>
      prev
        ? {
            ...prev,
            avatar_color: color,
            avatar_shape: shape,
          }
        : null
    );
  }, []);

  return {
    currentPlayer,
    otherPlayers,
    isConnected,
    updatePosition,
    updateAvatar,
  };
}
