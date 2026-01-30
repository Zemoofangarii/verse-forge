import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ChatMessage } from "@/types/game";
import { useAuth } from "./useAuth";

const MAX_MESSAGES = 50;

export function useChat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch existing messages
  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("chat_messages")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(MAX_MESSAGES);

      if (error) {
        console.error("Error fetching messages:", error);
        setIsLoading(false);
        return;
      }

      if (data) {
        setMessages(data.reverse());
      }
      setIsLoading(false);
    };

    fetchMessages();
  }, []);

  // Subscribe to new messages
  useEffect(() => {
    const channel = supabase
      .channel("chat-realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
        },
        (payload) => {
          const newMessage = payload.new as ChatMessage;
          setMessages((prev) => {
            const updated = [...prev, newMessage];
            // Keep only last MAX_MESSAGES
            return updated.slice(-MAX_MESSAGES);
          });
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  // Send a message
  const sendMessage = useCallback(
    async (message: string) => {
      if (!user || !message.trim()) return { error: "Invalid message" };

      // Get username from profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("username")
        .eq("user_id", user.id)
        .single();

      if (!profile) {
        return { error: "Profile not found" };
      }

      const { error } = await supabase.from("chat_messages").insert({
        user_id: user.id,
        username: profile.username,
        message: message.trim(),
      });

      if (error) {
        console.error("Error sending message:", error);
        return { error: error.message };
      }

      return { error: null };
    },
    [user]
  );

  return {
    messages,
    isLoading,
    sendMessage,
  };
}
