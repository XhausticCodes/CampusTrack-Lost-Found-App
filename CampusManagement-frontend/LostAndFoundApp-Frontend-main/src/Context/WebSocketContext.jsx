import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { getUserDetails } from "../Services/LoginService"; // Adjust path if needed

const WebSocketContext = createContext(null);

export const useWebSocket = () => useContext(WebSocketContext);

export const WebSocketProvider = ({ children }) => {
  const [stompClient, setStompClient] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [globalMessages, setGlobalMessages] = useState([]);
  const [privateMessages, setPrivateMessages] = useState({});
  const [currentUser, setCurrentUser] = useState(null);

  // 1. Initial User Load (from localStorage or API)
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
        console.log("Loaded user from localStorage");
      } catch (error) {
        console.error("Failed to parse stored user data:", error);
        localStorage.removeItem("currentUser");
      }
    } else {
      getUserDetails()
        .then((res) => {
          const userData = res.data;
          if (userData) {
            localStorage.setItem("currentUser", JSON.stringify(userData));
            setCurrentUser(userData);
          }
        })
        .catch(() => console.log("No user on initial load"));
    }
  }, []);

  // 2. Connect/Disconnect Logic
  const disconnect = useCallback(() => {
    if (stompClient) {
      console.log("Disconnecting WebSocket...");
      stompClient.deactivate();
      setStompClient(null);
      setIsConnected(false);
      setGlobalMessages([]);
      setPrivateMessages({});
    }
  }, [stompClient]);

  const connect = useCallback(() => {
    if (!currentUser || isConnected || stompClient) return;

    console.log("Attempting to connect WebSocket...");
    const username = currentUser.username;

    // Connect with username in query parameter
    const wsUrl = `http://localhost:9999/ws?username=${encodeURIComponent(
      username
    )}`;

    const client = new Client({
      webSocketFactory: () => new SockJS(wsUrl),
      connectHeaders: {
        username: username, // Also send in headers as fallback
      },
      debug: (str) => console.log(new Date(), "STOMP:", str),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,

      onConnect: (frame) => {
        console.log("WS Connected:", frame);
        setIsConnected(true);
        setGlobalMessages([]);
        setPrivateMessages({});

        // Global Subscription
        client.subscribe("/topic/global", (msg) => {
          const chatMsg = JSON.parse(msg.body);
          setGlobalMessages((prev) => [...prev, chatMsg]);
        });

        // Private Subscription - subscribe to user-specific topic
        const privateTopic = `/topic/private.${username}`;
        console.log("Subscribing to private topic:", privateTopic);
        client.subscribe(privateTopic, (msg) => {
          const chatMsg = JSON.parse(msg.body);
          console.log("Received private message:", chatMsg);

          // Determine the other user in the conversation
          // If I'm the sender, the other user is the recipient
          // If I'm the recipient, the other user is the sender
          const otherUser =
            chatMsg.sender === username ? chatMsg.recipient : chatMsg.sender;

          if (otherUser) {
            setPrivateMessages((prev) => {
              const existingMessages = prev[otherUser] || [];

              // Check for duplicates: same content, sender, and recipient
              // If the last message matches exactly, it's likely a duplicate
              const lastMessage = existingMessages[existingMessages.length - 1];
              const isDuplicate =
                lastMessage &&
                lastMessage.content === chatMsg.content &&
                lastMessage.sender === chatMsg.sender &&
                lastMessage.recipient === chatMsg.recipient;

              if (isDuplicate) {
                console.log("Duplicate message detected, skipping:", chatMsg);
                return prev; // Return unchanged state
              }

              return {
                ...prev,
                [otherUser]: [...existingMessages, chatMsg],
              };
            });
          }
        });
      },

      onStompError: (frame) => {
        console.error("STOMP Error:", frame.headers["message"], frame.body);
        setIsConnected(false);
      },

      onWebSocketError: (error) => {
        console.error("WS Error:", error);
        setIsConnected(false);
      },

      onDisconnect: () => {
        console.log("WS Disconnected");
        setIsConnected(false);
      },
    });

    client.activate();
    setStompClient(client);
  }, [currentUser, isConnected, stompClient]);

  // 3. Auto-Connect/Disconnect based on user state
  useEffect(() => {
    if (currentUser && !stompClient && !isConnected) {
      connect();
    }
    if (!currentUser && (stompClient || isConnected)) {
      disconnect();
    }
  }, [currentUser, stompClient, isConnected, connect, disconnect]);

  // 4. Listen for browser events (Login/Logout)
  useEffect(() => {
    const handleLogin = () => {
      const storedUser = localStorage.getItem("currentUser");
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          console.log("Login event detected, setting user:", userData);
          setCurrentUser(userData);
          // Disconnect existing connection if any, to reconnect with new user
          if (stompClient) {
            disconnect();
          }
        } catch (e) {
          console.error("Failed to parse user data on login:", e);
          localStorage.removeItem("currentUser");
        }
      } else {
        // If no stored user, try to fetch from API
        getUserDetails()
          .then((res) => {
            const userData = res.data;
            if (userData) {
              localStorage.setItem("currentUser", JSON.stringify(userData));
              setCurrentUser(userData);
            }
          })
          .catch(() => console.log("No user available after login event"));
      }
    };
    window.addEventListener("userLogin", handleLogin);
    return () => window.removeEventListener("userLogin", handleLogin);
  }, [stompClient, disconnect]);

  useEffect(() => {
    const handleLogout = () => {
      console.log("Logout event detected, clearing session.");
      localStorage.removeItem("currentUser");
      setCurrentUser(null);
    };
    window.addEventListener("userLogout", handleLogout);
    return () => window.removeEventListener("userLogout", handleLogout);
  }, []);

  // 5. Send Message Functions
  const sendGlobalMessage = useCallback(
    (content) => {
      if (stompClient && isConnected && content.trim() && currentUser) {
        stompClient.publish({
          destination: "/app/chat.sendMessage",
          body: JSON.stringify({
            content,
            type: "CHAT",
            sender: currentUser.username,
          }),
        });
      }
    },
    [stompClient, isConnected, currentUser]
  );

  const sendPrivateMessage = useCallback(
    (recipient, content) => {
      if (
        stompClient &&
        isConnected &&
        recipient &&
        content.trim() &&
        currentUser
      ) {
        const msg = {
          content,
          recipient,
          type: "CHAT",
          sender: currentUser.username,
        };

        console.log("Sending private message:", msg);

        // Add timestamp to the message for deduplication
        const msgWithTimestamp = {
          ...msg,
          timestamp: new Date().toISOString(),
        };

        stompClient.publish({
          destination: "/app/chat.sendPrivateMessage",
          body: JSON.stringify(msg),
        });

        // Optimistic UI - add message immediately for better UX
        // The server will also send it back via the topic, but deduplication will prevent duplicates
        setPrivateMessages((prev) => ({
          ...prev,
          [recipient]: [...(prev[recipient] || []), msgWithTimestamp],
        }));
      }
    },
    [stompClient, isConnected, currentUser]
  );

  return (
    <WebSocketContext.Provider
      value={{
        isConnected,
        globalMessages,
        privateMessages,
        currentUser,
        sendGlobalMessage,
        sendPrivateMessage,
        connect,
        disconnect,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};
