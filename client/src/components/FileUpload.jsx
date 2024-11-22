import { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { ethers } from "ethers";

const FileUpload = ({ contract, account }) => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (file) {
      setIsUploading(true);
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

        const ImgHash = `${resFile.data.IpfsHash}`;
        await contract.add(account, ImgHash);

        alert("File successfully uploaded!");
        setFile(null);
      } catch (e) {
        console.log("Unable to upload file:", e);
        alert("Failed to upload the file. Please try again.");
      } finally {
        setIsUploading(false);
      }
    }
  };

  const retrieveFile = (e) => {
    const data = e.target.files[0];
    setFile(data);
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
          disabled={!file || isUploading}
          className={`upload mt-4 px-4 py-2 rounded-lg text-white transition-all ${
            isUploading
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isUploading ? (
            <span className="flex items-center gap-2">
              <svg
                className="w-5 h-5 animate-spin"
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
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
              Uploading...
            </span>
          ) : (
            "Upload"
          )}
        </button>
      </form>
    </div>
  );
};

FileUpload.propTypes = {
  contract: PropTypes.instanceOf(ethers.Contract),
  account: PropTypes.string.isRequired,
};

export default FileUpload;
