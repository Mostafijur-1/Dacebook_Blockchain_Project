import { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { toast } from "react-toastify";

const PostCreator = ({ contractWithSigner }) => {
  const [showForm, setShowForm] = useState(false);
  const [content, setContent] = useState("");
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrls, setImageUrls] = useState([]);

  // Handle file selection
  const handleFileChange = (e) => {
    setFiles([...files, ...Array.from(e.target.files)]);
  };

  // Remove a selected file
  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  // Upload all selected files to IPFS
  const handleFileUpload = async () => {
    if (files.length === 0) {
      toast.warning("Please select a file to upload.");
      return;
    }

    setIsUploading(true);
    try {
      const uploadedUrls = [];

      for (let file of files) {
        const formData = new FormData();
        formData.append("file", file);

        const resFile = await axios.post(
          "https://api.pinata.cloud/pinning/pinFileToIPFS",
          formData,
          {
            headers: {
              pinata_api_key: import.meta.env.VITE__APP_PINATA_API_KEY,
              pinata_secret_api_key: import.meta.env
                .VITE__APP_PINATA_SECRET_API_KEY,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        const ImgHash = `https://chocolate-managing-piranha-401.mypinata.cloud/ipfs/${resFile.data.IpfsHash}`;
        uploadedUrls.push(ImgHash);
      }

      setImageUrls(uploadedUrls);
      toast.success("All files uploaded successfully!");
    } catch (error) {
      console.error("Error uploading files:", error);
      toast.error("Failed to upload files. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  // Create a new post
  const handleCreatePost = async () => {
    if (!content.trim()) {
      toast.warning("Please write something before posting.");
      return;
    }

    try {
      const tx = await contractWithSigner.createPost(content, imageUrls);
      await tx.wait();
      toast.success("Post created successfully!");
      location.reload();

      // Reset state
      setContent("");
      setFiles([]);
      setImageUrls([]);
      setShowForm(false);
    } catch (error) {
      toast.error("Error creating post: " + error.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mb-8">
      {/* Create Post Button */}
      {!showForm ? (
        <button
          className="bg-indigo-600 text-white px-6 py-3 rounded-xl w-52 mx-auto hover:bg-indigo-700 transition duration-200 ease-in-out flex items-center justify-center font-medium shadow-md"
          onClick={() => setShowForm(true)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Create New Post
        </button>
      ) : (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-indigo-100 transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-indigo-900">
              Create a Post
            </h2>
            <button
              onClick={() => setShowForm(false)}
              className="text-gray-500 hover:text-gray-700 transition duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="mb-6">
            <label
              htmlFor="post-content"
              className="block text-sm font-medium text-indigo-800 mb-2"
            >
              What&apos;s on your mind?
            </label>
            <textarea
              id="post-content"
              placeholder="Share your thoughts..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-4 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 resize-none"
              rows="4"
            />
          </div>

          {/* File Upload Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-indigo-800 mb-2">
              Add Images
            </label>
            <div className="bg-indigo-50 p-4 rounded-lg">
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="w-full text-sm text-indigo-800 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-100 file:text-indigo-700 hover:file:bg-indigo-200"
              />

              {files.length > 0 && (
                <div className="mt-4 space-y-2">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm border border-indigo-100"
                    >
                      <div className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-indigo-500 mr-2"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="truncate max-w-xs">{file.name}</span>
                      </div>
                      <button
                        onClick={() => removeFile(index)}
                        className="ml-2 p-1 text-red-500 hover:text-red-700 transition duration-200 rounded-full hover:bg-red-50"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={handleFileUpload}
                className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition duration-200 ease-in-out disabled:bg-indigo-300 disabled:cursor-not-allowed w-full flex items-center justify-center"
              >
                {isUploading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
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
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Uploading...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Upload
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Preview Uploaded Images */}
          {imageUrls.length > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-indigo-800 mb-2">
                Image Preview
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-indigo-50 p-4 rounded-lg">
                {imageUrls.map((url, index) => (
                  <div key={index} className="relative aspect-square">
                    <img
                      src={url}
                      alt={`Uploaded ${index}`}
                      className="rounded-lg w-full h-full object-cover border-2 border-indigo-100"
                    />
                    <div className="absolute top-0 right-0 bg-indigo-600 text-white rounded-full h-6 w-6 flex items-center justify-center m-1">
                      {index + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleCreatePost}
              disabled={isUploading ? true : false}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition duration-200 ease-in-out flex-1 flex items-center justify-center font-medium"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Publish Post
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition duration-200 ease-in-out flex-1 flex items-center justify-center font-medium"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

PostCreator.propTypes = {
  contractWithSigner: PropTypes.object.isRequired,
};

export default PostCreator;
