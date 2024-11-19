import PropTypes from "prop-types";
import { ethers } from "ethers";
import { useEffect } from "react";

const Modal = ({ setModalOpen, contract }) => {
  const handleClose = () => {
    setModalOpen(false);
  };

  const handleShare = async () => {
    try {
      const address = document.querySelector(".address").value;
      if (!ethers.isAddress(address)) {
        alert("Please enter a valid Ethereum address.");
        return;
      }
      console.log("Sharing access with address:", address);

      const tx = await contract.write.allow(address); // Send transaction
      await tx.wait(); // Wait for transaction confirmation
      console.log("Access shared successfully");

      setModalOpen(false); // Close modal on success
    } catch (error) {
      console.error("Failed to share access:", error);
    }
  };

  useEffect(() => {
    const accessList = async () => {
      if (!contract.readOnly) return;

      try {
        const addressList = await contract.readOnly.shareAccess();
        let select = document.querySelector("#selectNumber");
        select.innerHTML = ""; // Clear previous options

        if (addressList.length === 0) {
          let placeholder = document.createElement("option");
          placeholder.textContent = "No addresses with access";
          select.appendChild(placeholder);
        } else {
          addressList.forEach((opt) => {
            let e1 = document.createElement("option");
            e1.textContent = opt;
            e1.value = opt;
            select.appendChild(e1);
          });
        }
      } catch (error) {
        console.error("Failed to load access list:", error);
      }
    };

    accessList();
  }, [contract.readOnly]);

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-75">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
        <h2 className="text-xl font-bold text-gray-900">Share File</h2>
        <p className="mt-4">
          Enter the recipient blockchain address to share the file.
        </p>

        <input
          type="text"
          placeholder="Recipient's Blockchain Address"
          className="address mt-4 p-2 border border-gray-300 rounded-lg w-full text-black bg-white"
        />

        <form id="myForm">
          <select id="selectNumber">
            <option disabled>People With Access</option>
          </select>
        </form>

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
  setModalOpen: PropTypes.func.isRequired, // Validates setModalOpen as a function and required
  contract: PropTypes.shape({
    readOnly: PropTypes.instanceOf(ethers.Contract).isRequired, // Contract instance for read-only operations
    write: PropTypes.instanceOf(ethers.Contract).isRequired, // Contract instance for state-modifying operations
  }).isRequired,
};

export default Modal;
