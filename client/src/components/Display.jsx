import { useState } from "react";
import PropTypes from "prop-types";
import { ethers } from "ethers";

const Display = ({ contract, account }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addressToCheck, setAddressToCheck] = useState("");

  const getData = async () => {
    setLoading(true);
    setData([]); // Reset the data state before fetching
    // console.log("contract", contract);

    try {
      const userAddress = addressToCheck || account; // Use the input address if provided
      const dataArray = await contract.display(userAddress, account);

      if (dataArray.length > 0) {
        const images = dataArray.map((item, i) => (
          <a
            href={`https://chocolate-managing-piranha-401.mypinata.cloud/ipfs/${item}`}
            key={i}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={`https://chocolate-managing-piranha-401.mypinata.cloud/ipfs/${item}`}
              alt={`Click to open file ${i + 1}`}
              className="w-50 h-40 rounded-lg border border-gray-700 object-contain"
            />
          </a>
        ));
        setData(images);
      } else {
        alert("No images found or access denied.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      alert(
        error.reason ||
          "An error occurred while fetching the data. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-xl font-bold">Display Files</h2>
      <p className="text-sm text-gray-400">
        Enter an address to view shared files. Leave blank to view your own.
      </p>

      <input
        type="text"
        placeholder="Enter Address"
        value={addressToCheck}
        onChange={(e) => setAddressToCheck(e.target.value)}
        className="mt-4 p-2 w-full rounded-lg bg-gray-700 text-white"
        disabled={loading} // Disable input when loading
      />

      <button
        className={`mt-4 px-4 py-2 rounded-lg text-white ${
          loading
            ? "bg-gray-600 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
        onClick={getData}
        disabled={loading}
        title={loading ? "Fetching data..." : "Click to retrieve files"}
      >
        {loading ? (
          <span className="flex items-center gap-2">
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
            Loading...
          </span>
        ) : (
          "Get Data"
        )}
      </button>

      <div className="mt-4">
        {data.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {data}
          </div>
        ) : (
          !loading && (
            <p className="text-gray-400 text-center mt-4">
              No images to display. Upload or check another address.
            </p>
          )
        )}
      </div>
    </div>
  );
};

Display.propTypes = {
  contract: PropTypes.instanceOf(ethers.Contract).isRequired,
  account: PropTypes.string.isRequired,
};

export default Display;
