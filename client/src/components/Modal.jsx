import PropTypes from "prop-types";
import { useState } from "react";

const Modal = ({ setModalOpen, contract, account }) => {
  const [recipientAddress, setRecipientAddress] = useState(""); // For storing recipient's blockchain address

  const handleClose = () => {
    setModalOpen(false);
  };

  const handleShare = async () => {
    try {
      if (!recipientAddress) {
        alert("Please enter a valid blockchain address.");
        return;
      }

      // Assuming your contract has a method to share access with another account
      await contract.shareFileWith(recipientAddress, account); // Replace with your contract's actual function
      alert("File access shared successfully!");

      setModalOpen(false); // Close the modal after sharing
    } catch (error) {
      console.error("Error sharing the file:", error);
      alert("Failed to share the file.");
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-75">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
        <h2 className="text-xl font-bold text-gray-900">Share File</h2>
        <p className="mt-4">
          Enter the recipient's blockchain address to share the file.
        </p>

        <input
          type="text"
          placeholder="Recipient's Blockchain Address"
          value={recipientAddress}
          onChange={(e) => setRecipientAddress(e.target.value)}
          className="mt-4 p-2 border border-gray-300 rounded-lg w-full text-black bg-white"
        />

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleShare}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 mr-2"
          >
            Share
          </button>
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Add prop validation
Modal.propTypes = {
  setModalOpen: PropTypes.func.isRequired, // Validate that setModalOpen is a function and required
  contract: PropTypes.object.isRequired, // Smart contract instance
  account: PropTypes.string.isRequired, // Sender's account address
};

export default Modal;
