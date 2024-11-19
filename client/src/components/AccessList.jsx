import { useState } from "react";
import PropTypes from "prop-types";
import { ethers } from "ethers";

const AccessList = ({ contract, account }) => {
  const [accessList, setAccessList] = useState([]); // State to store the access list
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error message
  const [showList, setShowList] = useState(false); // State to control visibility of the list

  const fetchAccessList = async () => {
    setLoading(true);
    setError(null);
    setAccessList([]); // Reset the list when re-fetching

    try {
      if (contract && account) {
        // Call the `shareAccess` function to fetch the access list
        const list = await contract.shareAccess();
        setAccessList(list);
      } else {
        setError("Contract or account not available.");
      }
    } catch (err) {
      console.error("Error fetching access list:", err);
      setError("An error occurred while fetching the access list.");
    } finally {
      setLoading(false);
      setShowList(true); // Show the list after fetching
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md mt-6">
      <h2 className="text-xl font-bold">Access List</h2>
      <p className="mt-2 text-gray-400">
        Click the button below to view the list of addresses with access:
      </p>

      <button
        className="bg-blue-600 px-4 py-2 mt-4 rounded-lg hover:bg-blue-700"
        onClick={fetchAccessList}
        disabled={loading} // Disable button while loading
      >
        {loading ? "Fetching List..." : "Show Access List"}
      </button>

      {showList && (
        <>
          {loading ? (
            <p className="mt-4 text-blue-400">Loading access list...</p>
          ) : error ? (
            <p className="mt-4 text-red-400">{error}</p>
          ) : accessList.length > 0 ? (
            <ul className="mt-4">
              {accessList.map((access, index) => (
                <li key={index} className="text-gray-300 mt-2">
                  Address: {access.userAddress} <br />
                  Access Type: {access.accessType}{" "}
                  {/* Adjust based on your contract's Access structure */}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-gray-400">
              No addresses have been granted access yet.
            </p>
          )}
        </>
      )}
    </div>
  );
};

AccessList.propTypes = {
  contract: PropTypes.instanceOf(ethers.Contract).isRequired,
  account: PropTypes.string.isRequired,
};

export default AccessList;
