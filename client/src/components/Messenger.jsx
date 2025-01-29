import { useState } from "react";
import PropTypes from "prop-types";

const Messenger = ({ contractWithSigner, account }) => {
  const [receiver, setReceiver] = useState("");
  const [message, setMessage] = useState("");

  const sendMessage = async () => {
    try {
      const tx = await contractWithSigner.sendMessage(receiver, message);
      await tx.wait();
      alert("Message sent!");
    } catch (error) {
      alert("Error sending message: " + error.message);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-bold">Messenger</h2>
      <input
        type="text"
        placeholder="Receiver Address"
        value={receiver}
        onChange={(e) => setReceiver(e.target.value)}
      />
      <textarea
        placeholder="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button className="btn-primary" onClick={sendMessage}>
        Send
      </button>
    </div>
  );
};
Messenger.propTypes = {
  contractWithSigner: PropTypes.instanceOf(Object).isRequired,
  account: PropTypes.string,
};

export default Messenger;
