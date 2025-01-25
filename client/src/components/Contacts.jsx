import { useState, useEffect } from "react";
import { ethers } from "ethers";

const Contacts = ({ user, setSelectedContact }) => {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const loadContacts = async () => {
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
