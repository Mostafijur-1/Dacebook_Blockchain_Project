import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import MessengerABI from "../artifacts/contracts/Messenger.sol/Messenger.json"


const Contacts = ({ user, setSelectedContact }) => {
  const [contacts, setContacts] = useState([]);

  const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

  useEffect(() => {
    const loadContacts = async () => {
      let provider;
      if (window.ethereum == null) {
          console.log("MetaMask not installed; using read-only defaults")
          provider = ethers.getDefaultProvider()
      
      } else {
          provider = new ethers.BrowserProvider(window.ethereum);
      }
      const contract = new ethers.Contract(contractAddress, MessengerABI, provider);
      const allContacts = await contract.getAllConnectedContacts();
      setContacts(allContacts);
    };

    loadContacts();
  }, []);

  return (
    <div>
      <h1>Your Contacts</h1>
      <ul>
        {contacts.map((contact, index) => (
          <li key={index} onClick={() => setSelectedContact(contact)}>
            {contact.Name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Contacts;
