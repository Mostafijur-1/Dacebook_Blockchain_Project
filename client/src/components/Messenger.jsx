import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";

const Messenger = ({ contractReadOnly, contractWithSigner, account }) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  // Fetch all registered users (excluding current user)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersList = await contractReadOnly.getAllUsers(account);
        console.log(usersList);
        const users = usersList.filter((user) => user.name !== "");
        setUsers(users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, [contractReadOnly, account]);

  // Fetch messages for the selected user
  useEffect(() => {
    if (!selectedUser) return;
    const fetchMessages = async () => {
      try {
        console.log("Fetching messages for:", selectedUser.userAddress);
        const [sent, received] = await contractReadOnly.getConversation(
          account,
          selectedUser.userAddress
        );

        // Merge and sort messages by timestamp
        const allMessages = [...sent, ...received].sort(
          (a, b) => Number(a.timestamp) - Number(b.timestamp)
        );
        setMessages(allMessages);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
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
          (a, b) => Number(a.timestamp) - Number(b.timestamp)
        )
      );
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Users List */}
      <div className="w-1/4 bg-white p-4 overflow-y-auto shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-center">Users</h2>
        {users.length === 0 ? (
          <p className="text-center text-gray-500">No other users available</p>
        ) : (
          <div className="space-y-2">
            {users.map((user) => (
              <div
                key={user.userAddress}
                className={`flex items-center p-3 rounded-lg cursor-pointer transition hover:bg-gray-200 ${
                  selectedUser?.userAddress === user.userAddress
                    ? "bg-gray-300"
                    : ""
                }`}
                onClick={() => setSelectedUser(user)}
              >
                <img
                  src={user.profilePic}
                  alt={user.name}
                  className="w-10 h-10 rounded-full mr-4"
                />
                <p className="font-medium text-lg">{user.name}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Chat Window */}
      <div className="w-3/4 flex flex-col bg-white shadow-md rounded-lg">
        {selectedUser ? (
          <>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-gray-100">
              <h2 className="text-xl font-semibold">{selectedUser.name}</h2>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
              {messages.length === 0 ? (
                <p className="text-center text-gray-500">No messages yet</p>
              ) : (
                messages.map((message, index) => (
                  <div
                    key={message + index}
                    className={`p-3 max-w-xs rounded-lg ${
                      message.sender.toLowerCase() === account.toLowerCase()
                        ? "bg-blue-500 text-white ml-auto"
                        : "bg-gray-200"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs text-gray-800 mt-1 text-right">
                      {new Date(
                        Number(message.timestamp) * 1000
                      ).toLocaleTimeString()}
                    </p>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Box */}
            <div className="p-4 border-t flex">
              <input
                type="text"
                className="w-full p-2 border rounded-lg focus:outline-none"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button
                className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-lg"
                onClick={handleSendMessage}
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500 text-lg">
            Select a user to start chatting.
          </div>
        )}
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
