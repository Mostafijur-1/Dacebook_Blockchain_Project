import { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";

const PostCreator = ({ contractWithSigner }) => {
  const [showForm, setShowForm] = useState(false);
  const [content, setContent] = useState("");
  const [files, setFiles] = useState([]); // Multiple files
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrls, setImageUrls] = useState([]); // Multiple image URLs

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
    if (files.length === 0) return;

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
      alert("All files uploaded successfully!");
    } catch (error) {
      console.error("Error uploading files:", error);
      alert("Failed to upload files. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  // Create a new post
  const handleCreatePost = async () => {
    if (!content.trim()) {
      alert("Please write something before posting.");
      return;
    }

    try {
      const tx = await contractWithSigner.createPost(content, imageUrls);
      await tx.wait();
      alert("Post created successfully!");
      location.reload();

      // Reset state
      setContent("");
      setFiles([]);
      setImageUrls([]);
      setShowForm(false); // Hide form after posting
    } catch (error) {
      alert("Error creating post: " + error.message);
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      {/* Create Post Button */}
      {!showForm ? (
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg w-full hover:bg-blue-600"
          onClick={() => setShowForm(true)}
        >
          Create Post
        </button>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Create a Post</h2>
          <textarea
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-3 border rounded-lg mb-4"
            rows="4"
          />

          {/* File Upload Section */}
          <div className="mb-4">
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="p-2 border rounded-lg w-full"
            />
            {files.length > 0 && (
              <div className="mt-2">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 border rounded-lg mt-2"
                  >
                    <span className="truncate">{file.name}</span>
                    <button
                      onClick={() => removeFile(index)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={handleFileUpload}
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-blue-300 w-full"
              disabled={isUploading || files.length === 0}
            >
              {isUploading ? "Uploading..." : "Upload Images"}
            </button>
          </div>

          {/* Preview Uploaded Images */}
          {imageUrls.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mb-4">
              {imageUrls.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`Uploaded ${index}`}
                  className="rounded-lg w-full h-auto"
                />
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={handleCreatePost}
              className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 flex-1"
            >
              Post
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 flex-1"
            >
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
