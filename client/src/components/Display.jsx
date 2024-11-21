import { useState } from "react";
import PropTypes from "prop-types"; // Import PropTypes
import { ethers } from "ethers";

const Display = ({ contract, account }) => {
  const [data, setData] = useState([]); // Data to store the images
  const [loading, setLoading] = useState(false); // Loading state
  const [addressToCheck, setAddressToCheck] = useState(""); // Address input

  const getData = async () => {
    setLoading(true); // Set loading to true when fetching data
    setData([]); // Reset the data state before fetching

    try {
      const userAddress = addressToCheck || account; // Use the input address if provided
      console.log(userAddress);

      const dataArray = await contract.display(userAddress, account); // Call the display function

      console.log(dataArray);

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
              alt={`Image ${i + 1}`}
              className="w-96 h-52 rounded-lg border border-gray-700"
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
      setLoading(false); // Set loading to false after the fetch attempt
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
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-600"
        onClick={getData}
        disabled={loading} // Disable button when loading
      >
        {loading ? "Loading..." : "Get Data"}
      </button>

      <div className="mt-4">
        {data.length > 0 ? (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
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
  contract: PropTypes.instanceOf(ethers.Contract), // Contract instance
  account: PropTypes.string.isRequired, // Account address
};

export default Display;
