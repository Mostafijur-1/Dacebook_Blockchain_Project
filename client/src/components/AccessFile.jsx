import { useState } from "react";
import PropTypes from "prop-types";

const AccessFile = ({ contract, account }) => {
  const [fileIdentifier, setFileIdentifier] = useState(""); // For entering file identifier (could be IPFS hash or other)
  const [fileUrl, setFileUrl] = useState(null); // URL to the file if access is granted
  const [accessError, setAccessError] = useState(null);

  const requestAccess = async () => {
    try {
      if (contract && account && fileIdentifier) {
        // Example function to check access and return file URL (modify as needed for your contract)
        const hasAccess = await contract.checkAccess(account, fileIdentifier);

        if (hasAccess) {
          const url = await contract.getFileUrl(fileIdentifier);
          setFileUrl(url); // Store the URL for access
          setAccessError(null); // Clear any previous errors
        } else {
          setAccessError("You do not have permission to access this file.");
          setFileUrl(null);
        }
      }
    } catch (error) {
      console.error("Error requesting access:", error);
      setAccessError("An error occurred while trying to access the file.");
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold">Access a Shared File</h2>
      <p className="mt-2 text-gray-400">
        Enter the file identifier (e.g., IPFS hash) below:
      </p>

      <input
        type="text"
        placeholder="Enter File Identifier (e.g., IPFS hash)"
        value={fileIdentifier}
        onChange={(e) => setFileIdentifier(e.target.value)}
        className="mt-4 p-2 w-full rounded-lg bg-gray-700 text-white"
      />

      <button
        className="bg-blue-600 mt-4 px-4 py-2 rounded-lg hover:bg-blue-700"
        onClick={requestAccess}
      >
        Request Access
      </button>

      {accessError && <p className="mt-4 text-red-500">{accessError}</p>}

      {fileUrl && (
        <div className="mt-4">
          <p className="text-green-500">Access granted! Here is your file:</p>
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline"
          >
            {fileUrl}
          </a>
        </div>
      )}
    </div>
  );
};

AccessFile.propTypes = {
  contract: PropTypes.object.isRequired,
  account: PropTypes.string.isRequired,
};

export default AccessFile;
