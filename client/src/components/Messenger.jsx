import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";

const Messenger = ({ contractReadOnly, contractWithSigner, account }) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Fetch all registered users (excluding current user)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const usersList = await contractReadOnly.getAllUsers(account);
        const users = usersList.filter((user) => user.name !== "");
        setUsers(users);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [contractReadOnly, account]);

  // Fetch messages for the selected user
  useEffect(() => {
    if (!selectedUser) return;

    const fetchMessages = async () => {
      try {
        setLoading(true);
        const [sent, received] = await contractReadOnly.getConversation(
          account,
          selectedUser.userAddress
        );

        // Merge and sort messages by timestamp
        // Convert BigInt to Number before comparison to avoid mixing types
        const allMessages = [...sent, ...received].sort(
          (a, b) => Number(String(a.timestamp)) - Number(String(b.timestamp))
        );
        setMessages(allMessages);
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
    // Focus the input field when a user is selected
    inputRef.current?.focus();
  }, [selectedUser, contractReadOnly, account]);

  // Auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send a new message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedUser) return;

    try {
      const tx = await contractWithSigner.sendMessage(
        selectedUser.userAddress,
        newMessage,
        false
      );
      await tx.wait();
      setNewMessage("");

      // Fetch updated messages after sending
      const [sent, received] = await contractReadOnly.getConversation(
        account,
        selectedUser.userAddress
      );
      setMessages(
        [...sent, ...received].sort(
          (a, b) => Number(String(a.timestamp)) - Number(String(b.timestamp))
        )
      );
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Handle Enter key press to send message
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Format timestamp - safely convert BigInt to Number
  const formatTime = (timestamp) => {
    try {
      // Convert BigInt to string first, then to number to avoid precision issues
      const timestampNumber = Number(String(timestamp));
      const date = new Date(timestampNumber * 1000);
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      console.error("Error formatting timestamp:", error);
      return "Unknown time";
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <h2 className="text-2xl font-bold text-indigo-800 mb-4 p-4">Messages</h2>

      <div className="flex flex-1 bg-white rounded-xl overflow-hidden shadow-lg">
        {/* Users List */}
        <div className="w-1/3 md:w-1/4 bg-slate-50 border-r border-slate-200">
          <div className="p-4 bg-gradient-to-r from-indigo-600 to-purple-600">
            <h3 className="text-white font-medium">Contacts</h3>
          </div>

          {loading && users.length === 0 ? (
            <div className="flex items-center justify-center h-32">
              <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : users.length === 0 ? (
            <div className="p-6 text-center text-slate-500">
              <p>No other users available</p>
            </div>
          ) : (
            <div className="overflow-y-auto max-h-96">
              {users.map((user) => (
                <div
                  key={user.userAddress}
                  className={`flex items-center p-3 cursor-pointer transition-all duration-200 hover:bg-indigo-50 ${
                    selectedUser?.userAddress === user.userAddress
                      ? "bg-indigo-100 border-l-4 border-indigo-600"
                      : "border-l-4 border-transparent"
                  }`}
                  onClick={() => setSelectedUser(user)}
                >
                  <div className="relative">
                    <img
                      src={user.profilePic || "https://via.placeholder.com/40"}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover border-2 border-white shadow"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/40";
                      }}
                    />
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></span>
                  </div>
                  <div className="ml-3">
                    <p className="font-medium text-slate-800 truncate max-w-[120px]">
                      {user.name}
                    </p>
                    <p className="text-xs text-slate-500">Click to chat</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Chat Window */}
        <div className="flex-1 flex flex-col">
          {selectedUser ? (
            <>
              {/* Chat Header */}
              <div className="flex items-center justify-between p-4 border-b bg-white shadow-sm">
                <div className="flex items-center">
                  <img
                    src={
                      selectedUser.profilePic ||
                      "https://via.placeholder.com/40"
                    }
                    alt={selectedUser.name}
                    className="w-10 h-10 rounded-full mr-3 border-2 border-indigo-100"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/40";
                    }}
                  />
                  <div>
                    <h3 className="font-semibold text-slate-800">
                      {selectedUser.name}
                    </h3>
                    <p className="text-xs text-green-500">Online</p>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <div
                className="flex-1 overflow-y-auto p-4 space-y-3"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at center, #f1f5f9 1px, transparent 1px)",
                  backgroundSize: "24px 24px",
                }}
              >
                {loading ? (
                  <div className="flex justify-center items-center h-full">
                    <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-slate-500">
                    <svg
                      className="w-16 h-16 text-slate-300 mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      ></path>
                    </svg>
                    <p>No messages yet</p>
                    <p className="text-sm mt-1">
                      Start the conversation with {selectedUser.name}
                    </p>
                  </div>
                ) : (
                  messages.map((message, index) => {
                    const isSender =
                      message.sender.toLowerCase() === account.toLowerCase();
                    return (
                      <div
                        key={`${index}-${String(message.timestamp)}`}
                        className={`flex ${
                          isSender ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`p-3 rounded-2xl max-w-xs lg:max-w-md shadow-sm ${
                            isSender
                              ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-br-none"
                              : "bg-white border border-slate-200 rounded-bl-none"
                          }`}
                        >
                          <p
                            className={`text-sm ${
                              isSender ? "text-white" : "text-slate-800"
                            }`}
                          >
                            {message.content}
                          </p>
                          <p
                            className={`text-xs mt-1 text-right ${
                              isSender ? "text-indigo-100" : "text-slate-400"
                            }`}
                          >
                            {formatTime(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 bg-white border-t border-slate-200">
                <div className="flex items-center rounded-full bg-slate-100 pl-4 pr-2 py-1 focus-within:ring-2 focus-within:ring-indigo-300">
                  <input
                    ref={inputRef}
                    type="text"
                    className="w-full bg-transparent border-none focus:outline-none text-slate-800 placeholder-slate-400"
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                  />
                  <button
                    className={`ml-2 rounded-full p-2 ${
                      newMessage.trim()
                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-md transition-all"
                        : "bg-slate-200 text-slate-400 cursor-not-allowed"
                    }`}
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      ></path>
                    </svg>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-start h-full text-slate-500 p-8">
              <svg
                className="w-20 h-20 text-slate-300 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                ></path>
              </svg>
              <h3 className="text-xl font-medium text-slate-700 mb-2">
                No conversation selected
              </h3>
              <p className="text-center max-w-xs">
                Select a user from the list to start chatting
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

Messenger.propTypes = {
  contractReadOnly: PropTypes.object.isRequired,
  contractWithSigner: PropTypes.object.isRequired,
  account: PropTypes.string.isRequired,
};

export default Messenger;
