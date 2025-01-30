// import { useState } from "react";
// import PropTypes from "prop-types";

import { useState } from "react";

// const Messenger = ({ contractWithSigner, account }) => {
//   const [receiver, setReceiver] = useState("");
//   const [message, setMessage] = useState("");

//   const sendMessage = async () => {
//     try {
//       const tx = await contractWithSigner.sendMessage(receiver, message);
//       await tx.wait();
//       alert("Message sent!");
//     } catch (error) {
//       alert("Error sending message: " + error.message);
//     }
//   };

//   return (
//     <div className="flex flex-col gap-4">
//       <h2 className="text-xl font-bold">Messenger</h2>
//       <input
//         type="text"
//         placeholder="Receiver Address"
//         value={receiver}
//         onChange={(e) => setReceiver(e.target.value)}
//       />
//       <textarea
//         placeholder="Message"
//         value={message}
//         onChange={(e) => setMessage(e.target.value)}
//       />
//       <button className="btn-primary" onClick={sendMessage}>
//         Send
//       </button>
//     </div>
//   );
// };
// Messenger.propTypes = {
//   contractWithSigner: PropTypes.instanceOf(Object).isRequired,
//   account: PropTypes.string,
// };

// export default Messenger;

const Messenger = () => {
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [newMessage, setNewMessage] = useState("");

  // Sample data for friends and their messages
  const friends = [
    {
      id: 1,
      name: "John Doe",
      profilePicUrl:
        "https://res.cloudinary.com/dj0grvabc/image/upload/v1721036212/avatars/dbwtywmwej3wbtl6uazs.png",
      messages: [
        {
          id: 1,
          sender: "John",
          content: "Hey, how are you?",
          timestamp: "2025-01-30 10:00 AM",
        },
        {
          id: 2,
          sender: "You",
          content: "I am good, thanks for asking!",
          timestamp: "2025-01-30 10:05 AM",
        },
      ],
    },
    {
      id: 2,
      name: "Jane Smith",
      profilePicUrl:
        "https://res.cloudinary.com/dj0grvabc/image/upload/v1721036212/avatars/dbwtywmwej3wbtl6uazs.png",
      messages: [
        {
          id: 1,
          sender: "Jane",
          content: "What’s up?",
          timestamp: "2025-01-29 5:00 PM",
        },
        {
          id: 2,
          sender: "You",
          content: "Not much, just chilling.",
          timestamp: "2025-01-29 5:10 PM",
        },
      ],
    },
  ];

  const handleFriendClick = (friend) => {
    setSelectedFriend(friend);
  };

  const handleSendMessage = () => {
    if (newMessage.trim() !== "") {
      if (selectedFriend) {
        const newMsg = {
          id: selectedFriend.messages.length + 1,
          sender: "You",
          content: newMessage,
          timestamp: new Date().toLocaleString(),
        };
        setSelectedFriend({
          ...selectedFriend,
          messages: [...selectedFriend.messages, newMsg],
        });
      }
      setNewMessage("");
    }
  };

  return (
    <div className="flex">
      {/* Friends List */}
      <div className="w-1/3 bg-gray-100 p-4">
        <h2 className="text-xl font-semibold mb-4">Friends</h2>
        <div className="space-y-4">
          {friends.map((friend) => (
            <div
              key={friend.id}
              className="flex items-center cursor-pointer"
              onClick={() => handleFriendClick(friend)}
            >
              <img
                src={friend.profilePicUrl}
                alt={friend.name}
                className="w-12 h-12 rounded-full object-cover mr-4"
              />
              <span className="text-lg">{friend.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className="w-2/3 bg-white p-4">
        {selectedFriend ? (
          <>
            <h2 className="text-2xl font-semibold mb-4">
              {selectedFriend.name}
            </h2>
            <div className="h-96 overflow-y-auto mb-4">
              {selectedFriend.messages.map((message) => (
                <div
                  key={message.id}
                  className={`p-2 mb-2 rounded-lg ${
                    message.sender === "You"
                      ? "bg-blue-200 ml-auto"
                      : "bg-gray-200"
                  }`}
                >
                  <div className="text-sm text-gray-500">
                    {message.timestamp}
                  </div>
                  <p>{message.content}</p>
                </div>
              ))}
            </div>
            {/* Message Input */}
            <div className="flex">
              <input
                type="text"
                className="w-full p-2 border rounded-l-lg"
                placeholder="Type a message"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button
                className="bg-blue-500 text-white p-2 rounded-r-lg"
                onClick={handleSendMessage}
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="text-center text-gray-500">
            Select a friend to start chatting.
          </div>
        )}
      </div>
    </div>
  );
};

export default Messenger;
