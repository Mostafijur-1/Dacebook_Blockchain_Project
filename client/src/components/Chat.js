import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import MessengerABI from "../artifacts/contracts/Messenger.sol/Messenger.json"

const Chat = ({ user, selectedContact }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

  useEffect(() => {
    const loadMessages = async () => {
     let provider;
     if (window.ethereum == null) {
         console.log("MetaMask not installed; using read-only defaults")
         provider = ethers.getDefaultProvider()
     
     } else {
         provider = new ethers.BrowserProvider(window.ethereum);
     }
      const contract = new ethers.Contract(contractAddress, MessengerABI, provider);
      const allMessages = await contract.getMessages(selectedContact.Address);
      setMessages(allMessages);
    };

    loadMessages();
  }, [selectedContact]);

  const sendMessage = async () => {
    let provider;
    if (window.ethereum == null) {
        console.log("MetaMask not installed; using read-only defaults")
        provider = ethers.getDefaultProvider()
    
    } else {
        provider = new ethers.BrowserProvider(window.ethereum);
    }
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, MessengerABI, signer);
    await contract.send(selectedContact.Address, newMessage);
    setMessages([...messages, { from: user.address, message: newMessage }]);
    setNewMessage("");
  };

  return (
    <div>
      <h1>Chat with {selectedContact.Name}</h1>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.from === user.address ? "You" : selectedContact.Name}:</strong> {msg.message}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Type a message"
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chat;
