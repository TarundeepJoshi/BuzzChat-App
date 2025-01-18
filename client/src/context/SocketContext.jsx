import { useAppStore } from "@/store";
import { HOST } from "@/utils/constants";
import { createContext, useContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const socket = useRef();
  const { userInfo } = useAppStore();

  useEffect(() => {
    if (userInfo?._id) {
      try {
        socket.current = io(HOST, {
          withCredentials: true,
          query: { userId: userInfo._id },
          transports: ["polling", "websocket"],
          path: "/socket.io/",
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
          autoConnect: true,
        });

        socket.current.on("connect", () => {
          console.log("Connected to socket server");
        });

        const handleRecieveMessage = (message) => {
          const { selectedChatData, selectedChatType, addMessage } =
            useAppStore.getState();

          if (
            selectedChatType !== undefined &&
            (selectedChatData._id === message.sender._id ||
              selectedChatData._id === message.recipient._id)
          ) {
            // console.log("message received", message);

            addMessage(message);
          }
        };

        socket.current.on("recieveMessage", handleRecieveMessage);

        return () => {
          socket.current.disconnect();
        };
      } catch (error) {
        console.error("Socket initialization error:", error);
      }
    }
  }, [userInfo]);

  return (
    <SocketContext.Provider value={socket.current}>
      {children}
    </SocketContext.Provider>
  );
};
