import { useState, useEffect } from "react";
import { ethers } from "ethers";
import PropTypes from "prop-types";

const Chat = ({ contractReadOnly, contractWithSigner, account }) => {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessageForContact, setNewMessageForContact] = useState("");
  const [newAccount, setNewAccount] = useState("");
  const [newMessageForNewAccount, setNewMessageForNewAccount] = useState("");
  const [isLoadingContact, setIsLoadingContact] = useState(false);
  const [isLoadingNewAccount, setIsLoadingNewAccount] = useState(false);

  // Load contacts connected with the account

  useEffect(() => {
    const loadContacts = async () => {
      try {
        const allContacts = await contractReadOnly.getAllConnectedContacts(
          account
        );
        setContacts(allContacts);
      } catch (error) {
        console.error("Error loading contacts:", error);
      }
    };
    loadContacts();
  }, [contractReadOnly, account]);

  // Load messages for the selected contact
  useEffect(() => {
    const loadMessages = async () => {
      if (selectedContact) {
        try {
          const allMessages = await contractReadOnly.getMessages(
            account,
            selectedContact.Address
          );
          setMessages(allMessages);
          console.log(allMessages);
        } catch (error) {
          console.error("Error loading messages:", error);
        }
      }
    };

    loadMessages();
  }, [selectedContact, contractReadOnly, account]);

  // Send a message to the selected contact
  const sendMessageToContact = async () => {
    setIsLoadingContact(true);
    try {
      await contractWithSigner.send(
        account,
        selectedContact.Address,
        newMessageForContact
      );
      setMessages([
        ...messages,
        { from: account, message: newMessageForContact },
      ]);
      setNewMessageForContact("");
    } catch (error) {
      console.error("Error sending message to contact:", error);
    }
    setIsLoadingContact(false);
  };

  // Send a message to a new account
  const sendMessageToNewAccount = async () => {
    setIsLoadingNewAccount(true);
    try {
      await contractWithSigner.send(
        account,
        newAccount,
        newMessageForNewAccount
      );
      // await loadContacts(); // Reload contacts to reflect the new one
      // setNewAccount("");
      // setNewMessageForNewAccount("");
    } catch (error) {
      console.error("Error sending message to new account:", error);
    }
    setIsLoadingNewAccount(false);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Chat</h1>

      {/* Contacts List */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Contacts</h2>
        <ul>
          {contacts.map((contact, index) => (
            <li key={index} className="flex justify-between items-center mb-2">
              <span>{contact.Name}</span>
              <button
                onClick={() => setSelectedContact(contact)}
                className="bg-blue-500 text-white px-2 py-1 rounded"
              >
                Chat
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Chat Area */}
      {selectedContact && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">
            Chat with {selectedContact.Name}
          </h2>
          <div className="border p-2 h-48 overflow-y-auto mb-2">
            {messages.map((msg, index) => (
              <div key={index} className="mb-2">
                <strong>
                  {msg.from === account ? "You" : selectedContact.Name}:
                </strong>{" "}
                {msg.message}
              </div>
            ))}
          </div>
          <div className="flex items-center">
            <input
              type="text"
              value={newMessageForContact}
              onChange={(e) => setNewMessageForContact(e.target.value)}
              placeholder="Type a message"
              className="border p-2 flex-1 mr-2"
            />
            <button
              onClick={sendMessageToContact}
              className="bg-green-500 text-white px-4 py-2 rounded"
              disabled={isLoadingContact}
            >
              {isLoadingContact ? "Sending..." : "Send"}
            </button>
          </div>
        </div>
      )}

      {/* Send Message to New Account */}
      <div>
        <h2 className="text-lg font-semibold mb-2">
          Send Message to New Account
        </h2>
        <div className="flex flex-col gap-2">
          <input
            type="text"
            value={newAccount}
            onChange={(e) => setNewAccount(e.target.value)}
            placeholder="Recipient Address"
            className="border p-2"
          />
          <input
            type="text"
            value={newMessageForNewAccount}
            onChange={(e) => setNewMessageForNewAccount(e.target.value)}
            placeholder="Type your message"
            className="border p-2"
          />
          <button
            onClick={sendMessageToNewAccount}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            {isLoadingNewAccount ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
};

Chat.propTypes = {
  contractReadOnly: PropTypes.instanceOf(ethers.Contract).isRequired,
  contractWithSigner: PropTypes.instanceOf(ethers.Contract).isRequired,
  account: PropTypes.string.isRequired,
};

export default Chat;
