import { useState } from "react";
import PropTypes from "prop-types";
import { ethers } from "ethers";

const AccessFile = ({ contract, account }) => {
  const [addressToAllow, setAddressToAllow] = useState(""); // Address to give or revoke access
  const [accessMessage, setAccessMessage] = useState(null); // Success or error message
  const [loading, setLoading] = useState(false); // Loading state

  const grantAccess = async () => {
    setLoading(true);
    setAccessMessage(null);

    try {
      if (contract && account && addressToAllow) {
        // Call the `allow` function to grant access
        const transaction = await contract.allow(addressToAllow, {
          gasLimit: ethers.toQuantity(100000), // Set an appropriate gas limit here
        });

        await transaction.wait(); // Wait for transaction to be mined
        setAccessMessage(`Access granted to ${addressToAllow}`);
      } else {
        setAccessMessage("Please provide a valid address to grant access.");
      }
    } catch (error) {
      console.error("Error granting access:", error);
      setAccessMessage("An error occurred while granting access.");
    } finally {
      setLoading(false);
    }
  };

  const disallowAccess = async () => {
    setLoading(true);
    setAccessMessage(null);

    try {
      if (contract && account && addressToAllow) {
        // Call the `disallow` function to revoke access
        const transaction = await contract.disallow(addressToAllow, {
          gasLimit: ethers.toQuantity(100000), // Set an appropriate gas limit here
        });

        await transaction.wait(); // Wait for transaction to be mined
        setAccessMessage(`Access revoked from ${addressToAllow}`);
      } else {
        setAccessMessage("Please provide a valid address to revoke access.");
      }
    } catch (error) {
      console.error("Error revoking access:", error);
      setAccessMessage("An error occurred while revoking access.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold">Manage Access</h2>
      <p className="mt-2 text-gray-400">
        Enter the address you want to grant or revoke access to:
      </p>

      <input
        type="text"
        placeholder="Enter recipient's address"
        value={addressToAllow}
        onChange={(e) => setAddressToAllow(e.target.value)}
        className="mt-4 p-2 w-full rounded-lg bg-gray-700 text-white"
      />

      <div className="flex justify-between mt-4">
        <button
          className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700"
          onClick={grantAccess}
          disabled={loading} // Disable button while loading
        >
          {loading ? "Granting Access..." : "Grant Access"}
        </button>

        <button
          className="bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700"
          onClick={disallowAccess}
          disabled={loading} // Disable button while loading
        >
          {loading ? "Revoking Access..." : "Revoke Access"}
        </button>
      </div>

      {accessMessage && <p className="mt-4 text-green-500">{accessMessage}</p>}
    </div>
  );
};

AccessFile.propTypes = {
  contract: PropTypes.instanceOf(ethers.Contract).isRequired,
  account: PropTypes.string.isRequired,
};

export default AccessFile;
