import { useState } from "react";
import PropTypes from "prop-types";
import { ethers } from "ethers";

const AccessFile = ({ contract, account }) => {
  const [addressToAllow, setAddressToAllow] = useState(""); // Address to give or revoke access
  const [accessMessage, setAccessMessage] = useState(null); // Success or error message
  const [loading, setLoading] = useState(false); // Loading state
  const [currentAction, setCurrentAction] = useState(""); // Tracks current action (grant or revoke)

  const grantAccess = async () => {
    setLoading(true);
    setAccessMessage(null);
    setCurrentAction("granting");

    try {
      if (contract && account && addressToAllow) {
        await contract.allow(addressToAllow, account);

        setAccessMessage(`Access granted to ${addressToAllow}`);
      } else {
        setAccessMessage("Please provide a valid address to grant access.");
      }
    } catch (error) {
      console.error("Error granting access:", error);
      setAccessMessage("An error occurred while granting access.");
    } finally {
      setLoading(false);
      setCurrentAction("");
    }
  };

  const disallowAccess = async () => {
    setLoading(true);
    setAccessMessage(null);
    setCurrentAction("revoking");

    try {
      if (contract && account && addressToAllow) {
        await contract.disallow(addressToAllow, account);

        setAccessMessage(`Access revoked from ${addressToAllow}`);
      } else {
        setAccessMessage("Please provide a valid address to revoke access.");
      }
    } catch (error) {
      console.error("Error revoking access:", error);
      setAccessMessage("An error occurred while revoking access.");
    } finally {
      setLoading(false);
      setCurrentAction("");
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
        disabled={loading} // Disable input when loading
      />

      <div className="flex justify-between mt-4">
        <button
          className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
            loading && currentAction === "granting"
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
          onClick={grantAccess}
          disabled={loading}
          title="Grant access to this address"
        >
          {loading && currentAction === "granting" ? (
            <>
              <svg
                className="w-4 h-4 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
              Granting...
            </>
          ) : (
            "Grant Access"
          )}
        </button>

        <button
          className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
            loading && currentAction === "revoking"
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-red-600 hover:bg-red-700"
          }`}
          onClick={disallowAccess}
          disabled={loading}
          title="Revoke access for this address"
        >
          {loading && currentAction === "revoking" ? (
            <>
              <svg
                className="w-4 h-4 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
              Revoking...
            </>
          ) : (
            "Revoke Access"
          )}
        </button>
      </div>

      {accessMessage && (
        <p
          className={`mt-4 ${
            accessMessage.includes("granted")
              ? "text-green-500"
              : "text-red-500"
          }`}
        >
          {accessMessage}
        </p>
      )}
    </div>
  );
};

AccessFile.propTypes = {
  contract: PropTypes.instanceOf(ethers.Contract).isRequired,
  account: PropTypes.string.isRequired,
};

export default AccessFile;
