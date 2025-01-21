import { useState, useEffect } from "react";
import { ethers } from "ethers";
import MessengerABI from "../artifacts/contracts/Messenger.sol/Messenger.json";
import PropTypes from "prop-types";

const Contacts = ({ user, setSelectedContact }) => {
  const [contacts, setContacts] = useState([]);

  const contractAddress = import.meta.env.VITE_APP_CONTRACT_ADDRESS;

  useEffect(() => {
    const loadContacts = async () => {
      let provider;
      if (window.ethereum == null) {
        console.log("MetaMask not installed; using read-only defaults");
        provider = ethers.getDefaultProvider();
      } else {
        provider = new ethers.BrowserProvider(window.ethereum);
      }
      const contract = new ethers.Contract(
        contractAddress,
        MessengerABI,
        provider
      );
      const allContacts = await contract.getAllConnectedContacts();
      setContacts(allContacts);
    };

    loadContacts();
  }, [contractAddress]);

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

Contacts.propTypes = {
  user: PropTypes.object,
  setSelectedContact: PropTypes.func,
};

export default Contacts;
