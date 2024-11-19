import { useState } from "react";
import PropTypes from "prop-types"; // Import PropTypes
import axios from "axios";
import { ethers } from "ethers";

const FileUpload = ({ contract, account }) => {
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (file) {
      try {
        const formData = new FormData();
        formData.append("file", file);

        const resFile = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: formData,
          headers: {
            pinata_api_key: import.meta.env.VITE__APP_PINATA_API_KEY,
            pinata_secret_api_key: import.meta.env
              .VITE__APP_PINATA_SECRET_API_KEY,
            "Content-Type": "multipart/form-data",
          },
        });

        // const ImgHash = `https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`;
        const ImgHash = `${resFile.data.IpfsHash}`;

        await contract.add(account, ImgHash);
        // console.log(ImgHash);
        alert("Successfully Image Uploaded");

        setFile(null);
      } catch (e) {
        console.log("Unable to upload image to Pinata:", e);
      }
    }
  };

  const retrieveFile = (e) => {
    const data = e.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(data);
    reader.onloadend = () => {
      setFile(e.target.files[0]);
    };

    e.preventDefault();
  };

  return (
    <div className="p-6 bg-gray-800 rounded-lg shadow-md">
      <form onSubmit={handleSubmit}>
        <label htmlFor="file-upload" className="text-xl font-bold">
          Upload Your File
        </label>
        <input
          disabled={!account}
          type="file"
          id="file-upload"
          name="data"
          onChange={retrieveFile}
          className="block w-full text-sm text-gray-300 bg-gray-700 border border-gray-600 rounded-lg mt-4"
        />

        <button
          type="submit"
          disabled={!file}
          className="upload mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Upload
        </button>
      </form>
    </div>
  );
};

// Add PropTypes validation
FileUpload.propTypes = {
  contract: PropTypes.instanceOf(ethers.Contract),
  account: PropTypes.string.isRequired,
};

export default FileUpload;
