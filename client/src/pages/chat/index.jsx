import { useAppStore } from "@/store";
import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useEffect } from "react";
import ContactContainer from "./components/contactsContainer";
import EmptyChatContainer from "./components/emptyChatContainer";
import ChatContainer from "./components/chatContainer";

const Chat = () => {
  const { userInfo, selectedChatType } = useAppStore();
  const navigate = useNavigate();
  useEffect(() => {
    if (!userInfo.profileSetup) {
      toast("Please Set up your Profile to continue");
      navigate("/profile");
    }
  }, [userInfo, navigate]);

  return (
    <div className="flex h-[100vh] text-white overflow-hidden">
      <ContactContainer />
      {selectedChatType === undefined ? (
        <EmptyChatContainer />
      ) : (
        <ChatContainer />
      )}
    </div>
  );
};

export default Chat;
