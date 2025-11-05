import React, { useState, useContext, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useWebSocket } from "../Context/WebSocketContext";
import { ThemeContext } from "../Context/ThemeContext";
import {
  Send,
  Users,
  User,
  MessageSquarePlus,
  ArrowLeft,
  Sun,
  Moon,
  Edit2,
  Check,
} from "lucide-react";
import ReturnButton from "./Buttons/ReturnButton";
import ReturnHome from "./Buttons/ReturnHome";

// Theme toggle button
const ThemeToggleButton = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  return (
    <button
      onClick={toggleTheme}
      style={{ cursor: "pointer" }}
      className={`p-2 rounded-full ${
        theme === "light"
          ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
          : "bg-gray-700 text-white hover:bg-gray-600"
      }`}
    >
      {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
    </button>
  );
};

const ChatPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    isConnected,
    globalMessages,
    privateMessages,
    currentUser,
    sendGlobalMessage,
    sendPrivateMessage,
  } = useWebSocket();

  const { theme } = useContext(ThemeContext);

  const [globalInput, setGlobalInput] = useState("");
  const [privateInput, setPrivateInput] = useState("");
  const [recipient, setRecipient] = useState("");
  const [activeChatUser, setActiveChatUser] = useState(null);
  const [showNewPrivateForm, setShowNewPrivateForm] = useState(false);

  // --- NEW: Temporary display name (alias) ---
  const [displayName, setDisplayName] = useState(currentUser?.username || "");
  const [isEditingName, setIsEditingName] = useState(false);

  // Update displayName when currentUser changes
  useEffect(() => {
    if (currentUser?.username) {
      setDisplayName(currentUser.username);
    }
  }, [currentUser?.username]);

  // Check for user parameter in URL to auto-start private chat
  useEffect(() => {
    const userParam = searchParams.get("user");
    if (userParam && userParam !== activeChatUser) {
      setActiveChatUser(userParam);
      // Clear the URL parameter after setting it
      setSearchParams({});
    }
  }, [searchParams, activeChatUser, setSearchParams]);

  // --- NEW: Flair system ---
  const flairs = {
    lost: { label: "🟡 ASK Lost Item", color: "bg-yellow-200 text-yellow-800" },
    found: { label: "🟢 ASK Found Item", color: "bg-green-200 text-green-800" },
    regular: { label: "🔵 Regular User", color: "bg-blue-200 text-blue-800" },
  };
  const [selectedFlair, setSelectedFlair] = useState("regular");

  // Theme classes
  const themeClasses = {
    bgPrimary: theme === "light" ? "bg-white" : "bg-gray-800",
    bgSecondary: theme === "light" ? "bg-gray-50" : "bg-gray-900",
    bgTertiary: theme === "light" ? "bg-gray-100" : "bg-gray-700",
    textPrimary: theme === "light" ? "text-gray-900" : "text-white",
    textSecondary: theme === "light" ? "text-gray-500" : "text-gray-400",
    borderPrimary: theme === "light" ? "border-gray-200" : "border-gray-700",
    msgMeBg: "bg-yellow-600",
    msgMeText: "text-black",
    msgOtherBg: theme === "light" ? "bg-gray-200" : "bg-gray-700",
    msgOtherText: theme === "light" ? "text-gray-900" : "text-white",
    activeChatBg: "bg-yellow-600",
    activeChatText: "text-black",
  };

  const handleSendGlobal = (e) => {
    e.preventDefault();
    if (globalInput.trim()) {
      // --- MODIFIED: Send alias and flair key in message content ---
      sendGlobalMessage(`[${displayName}][${selectedFlair}] ${globalInput}`);
      setGlobalInput("");
    }
  };

  const handleSendPrivate = (e) => {
    e.preventDefault();
    const targetUser = recipient || activeChatUser;
    if (privateInput.trim() && targetUser) {
      // --- MODIFIED: Send alias and flair key in message content ---
      sendPrivateMessage(
        targetUser,
        `[${displayName}][${selectedFlair}] ${privateInput}`
      );
      setPrivateInput("");
      if (recipient) setRecipient("");
      if (!activeChatUser) {
        setActiveChatUser(targetUser);
        setShowNewPrivateForm(false);
      }
    }
  };

  // --- NEW: Helper function to parse message content ---
  const parseMessage = (content, sender) => {
    // Check for new format: [alias][flair] message
    const flairMatch = content.match(/^\[(.*?)\]\[(.*?)\]\s(.*)/s);
    if (flairMatch && flairMatch[1] && flairMatch[2] && flairMatch[3]) {
      const flairKey = flairMatch[2];
      const flair = flairs[flairKey] || flairs["regular"]; // Get flair object
      return {
        alias: flairMatch[1],
        text: flairMatch[3],
        flair: flair, // Pass the whole flair object
      };
    }

    // Fallback for old format: [alias] message
    const aliasMatch = content.match(/^\[(.*?)\]\s(.*)/s);
    if (aliasMatch && aliasMatch[1] && aliasMatch[2]) {
      return {
        alias: aliasMatch[1],
        text: aliasMatch[2],
        flair: flairs["regular"], // Default flair
      };
    }

    // Fallback for messages not in the expected format (e.g., system messages)
    return {
      alias: sender, // Use original sender username
      text: content,
      flair: flairs["regular"], // Default flair
    };
  };

  const privateChatUsers = Object.keys(privateMessages);
  const activeChatMessages = activeChatUser
    ? privateMessages[activeChatUser] || []
    : [];

  if (!isConnected || !currentUser) {
    return (
      <div
        className={`flex items-center justify-center h-full ${themeClasses.bgSecondary} ${themeClasses.textPrimary}`}
      >
        <div className="text-center">
          <p>Connecting to chat...</p>
          <p className={`text-sm ${themeClasses.textSecondary} mt-2`}>
            Messages are session-only and clear on disconnect.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex h-full ${themeClasses.bgPrimary} ${themeClasses.textPrimary}`}
    >
      {/* Sidebar */}
      <div
        className={`w-1/4 ${themeClasses.bgSecondary} p-4 border-r ${themeClasses.borderPrimary} flex flex-col overflow-y-auto`}
      >
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <User size={20} /> My Profile
        </h2>

        {/* Editable Username Section */}
        <div className={`p-3 ${themeClasses.bgTertiary} rounded-lg mb-6`}>
          {isEditingName ? (
            <div className="flex items-center gap-2">
              <input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="flex-1 bg-transparent border-b border-gray-400 outline-none"
              />
              <button
                onClick={() => setIsEditingName(false)}
                className="text-green-500 hover:text-green-700"
              >
                <Check size={18} />
              </button>
            </div>
          ) : (
            <div className="flex justify-between items-center">
              <p className="font-semibold">{displayName}</p>
              <button
                onClick={() => setIsEditingName(true)}
                className="text-gray-500 hover:text-yellow-600"
              >
                <Edit2 size={16} />
              </button>
            </div>
          )}

          <p className={`text-sm ${themeClasses.textSecondary}`}>
            {currentUser.role}
          </p>

          {/* Flair Selection */}
          <div className="mt-3">
            <p className="text-sm mb-1">Choose your flair:</p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(flairs).map(([key, { label, color }]) => (
                <span
                  key={key}
                  onClick={() => setSelectedFlair(key)}
                  className={`cursor-pointer px-2 py-1 text-xs font-medium rounded-full ${color} ${
                    selectedFlair === key ? "ring-2 ring-yellow-500" : ""
                  }`}
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Chat List */}
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Users size={20} /> Chats
        </h2>

        <button
          onClick={() => setActiveChatUser(null)}
          className={`w-full text-left p-3 rounded-lg mb-2 ${
            !activeChatUser
              ? `${themeClasses.activeChatBg} ${themeClasses.activeChatText}`
              : `${themeClasses.bgTertiary}`
          }`}
        >
          🌐 Global Chat
        </button>

        {privateChatUsers.map((user) => (
          <button
            key={user}
            onClick={() => setActiveChatUser(user)}
            className={`w-full text-left p-3 rounded-lg mb-2 ${
              activeChatUser === user
                ? `${themeClasses.activeChatBg} ${themeClasses.activeChatText}`
                : `${themeClasses.bgTertiary}`
            }`}
          >
            👤 {user}
          </button>
        ))}

        {!activeChatUser && (
          <button
            onClick={() => setShowNewPrivateForm(!showNewPrivateForm)}
            className={`w-full flex items-center gap-2 p-3 rounded-lg mt-auto ${themeClasses.bgTertiary}`}
          >
            <MessageSquarePlus size={16} />
            {showNewPrivateForm ? "Cancel New Chat" : "Start New Private Chat"}
          </button>
        )}
      </div>

      {/* Main Chat */}
      <div className="w-3/4 flex flex-col">
        {/* Header */}
        <div
          className={`${themeClasses.bgSecondary} p-4 border-b ${themeClasses.borderPrimary} flex justify-between`}
        >
          <div className="flex gap-4">
            {/* <ReturnButton /> */}
            <ReturnHome />
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold">
                {activeChatUser ? `Chat with ${activeChatUser}` : "Global Chat"}
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                isConnected
                  ? "bg-green-600 text-white"
                  : "bg-red-600 text-white"
              }`}
            >
              {isConnected ? "Connected" : "Disconnected"}
            </span>
            <ThemeToggleButton />
          </div>
        </div>

        {/* Messages */}
        <div
          className={`flex-1 p-4 overflow-y-auto space-y-4 ${themeClasses.bgPrimary}`}
        >
          {(activeChatUser ? activeChatMessages : globalMessages).map(
            (msg, index) => {
              // --- NEW: Parse message to get alias, text, and flair ---
              const { alias, text, flair } = parseMessage(
                msg.content,
                msg.sender
              );

              return (
                <div
                  key={index}
                  className={`flex ${
                    msg.sender === currentUser.username
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`p-3 rounded-lg max-w-lg ${
                      msg.sender === currentUser.username
                        ? `${themeClasses.msgMeBg} ${themeClasses.msgMeText}`
                        : `${themeClasses.msgOtherBg} ${themeClasses.msgOtherText}`
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1 gap-4">
                      <p className="font-bold text-sm flex items-center gap-2">
                        {/* --- MODIFIED: Show parsed alias --- */}
                        {alias}{" "}
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            // --- MODIFIED: Use parsed flair color ---
                            flair.color
                          }`}
                        >
                          {/* --- MODIFIED: Use parsed flair label --- */}
                          {flair.label}
                        </span>
                      </p>
                      <p className="text-xs text-white">
                        {new Date().toLocaleTimeString()}
                      </p>
                    </div>
                    {/* --- MODIFIED: Show parsed text --- */}
                    <p className="text-base break-words">{text}</p>
                  </div>
                </div>
              );
            }
          )}
        </div>

        {/* Input */}
        <form
          onSubmit={activeChatUser ? handleSendPrivate : handleSendGlobal}
          className={`${themeClasses.bgSecondary} p-4 border-t ${themeClasses.borderPrimary}`}
        >
          <div className="flex gap-2">
            <input
              type="text"
              value={activeChatUser ? privateInput : globalInput}
              onChange={(e) =>
                activeChatUser
                  ? setPrivateInput(e.target.value)
                  : setGlobalInput(e.target.value)
              }
              placeholder={`Type a message...`}
              className={`flex-1 p-3 ${themeClasses.bgTertiary} rounded-lg outline-none`}
              disabled={!isConnected}
            />
            <button
              type="submit"
              disabled={
                !isConnected ||
                !(activeChatUser ? privateInput.trim() : globalInput.trim())
              }
              className="p-3 bg-yellow-600 text-black rounded-lg disabled:opacity-50"
            >
              <Send size={20} />
            </button>
          </div>
        </form>

        {/* New Private Chat */}
        {!activeChatUser && showNewPrivateForm && (
          <form
            onSubmit={handleSendPrivate}
            className={`${themeClasses.bgSecondary} p-4 border-t border-dashed ${themeClasses.borderPrimary}`}
          >
            <p className="text-sm text-center text-gray-500 mb-2">
              Start private chat (session-only)
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="Username..."
                className={`w-1/3 p-3 ${themeClasses.bgTertiary} rounded-lg outline-none`}
              />
              <input
                type="text"
                value={privateInput}
                onChange={(e) => setPrivateInput(e.target.value)}
                placeholder="Message..."
                className={`flex-1 p-3 ${themeClasses.bgTertiary} rounded-lg outline-none`}
              />
              <button
                type="submit"
                disabled={!recipient.trim() || !privateInput.trim()}
                className="p-3 bg-yellow-600 text-black rounded-lg disabled:opacity-5Body"
              >
                <Send size={20} />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
