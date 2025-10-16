import { useEffect, useCallback, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";

export function useWebSocket() {
  const queryClient = useQueryClient();
  const reconnectTimerRef = useRef<number | null>(null);
  const shouldReconnectRef = useRef(true);

  const connectWebSocket = useCallback(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      console.log("WebSocket connected");
    };

    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        
        if (message.type === "new_block") {
          // Invalidate relevant queries to trigger refetch
          queryClient.invalidateQueries({ queryKey: ["/api/blocks/latest"] });
          queryClient.invalidateQueries({ queryKey: ["/api/transactions/latest"] });
          queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
          
          console.log("New block received:", message.data.number);
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.onclose = () => {
      console.log("WebSocket disconnected");
      
      // Only reconnect if component is still mounted
      if (shouldReconnectRef.current) {
        console.log("Reconnecting in 3 seconds...");
        reconnectTimerRef.current = window.setTimeout(connectWebSocket, 3000);
      }
    };

    return socket;
  }, [queryClient]);

  useEffect(() => {
    shouldReconnectRef.current = true;
    const socket = connectWebSocket();

    return () => {
      // Prevent reconnection on cleanup
      shouldReconnectRef.current = false;
      
      // Clear any pending reconnect timers
      if (reconnectTimerRef.current !== null) {
        clearTimeout(reconnectTimerRef.current);
        reconnectTimerRef.current = null;
      }
      
      // Close the socket
      socket.close();
    };
  }, [connectWebSocket]);
}
