import { useState } from "react";

const FileUpload = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    // Upload logic goes here
    console.log("Uploading file:", file);
  };

  return (
    <div className="p-6 bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-xl font-bold">Upload Your File</h2>
      <input
        type="file"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-300 bg-gray-700 border border-gray-600 rounded-lg mt-4"
      />
      <button
        onClick={handleUpload}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Upload
      </button>
    </div>
  );
};

export default FileUpload;
