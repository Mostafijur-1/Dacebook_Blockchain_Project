import { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import Post from "./Post";
import { toast } from "react-toastify";

const Profile = ({ contractReadOnly, contractWithSigner, user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newProfilePic, setNewProfilePic] = useState(null);
  const [updatedBio, setUpdatedBio] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [authorDetails, setAuthorDetails] = useState({});

  // Fetch user details for each author
  useEffect(() => {
    const fetchAuthorProfiles = async () => {
      if (!contractReadOnly || posts.length === 0) return;

      const uniqueAuthors = [
        ...new Set(posts.map((post) => post.authorAddress)),
      ];

      const authorPromises = uniqueAuthors.map(async (authorAddress) => {
        try {
          const author = await contractReadOnly.getUserProfile(authorAddress);
          return { address: authorAddress, author };
        } catch (error) {
          console.error("Error fetching author details:", error);
          return { address: authorAddress, author: null };
        }
      });

      const resolvedAuthors = await Promise.all(authorPromises);
      const authorMap = Object.fromEntries(
        resolvedAuthors.map(({ address, author }) => [address, author])
      );

      setAuthorDetails(authorMap);
    };

    fetchAuthorProfiles();
  }, [posts, contractReadOnly]);

  const fetchPosts = useCallback(async () => {
    if (!contractReadOnly || !user) return;
    setLoadingPosts(true);
    try {
      const fetchedPosts = await contractReadOnly.getUserPosts(
        user.userAddress
      );
      setPosts(fetchedPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
      console.log("Failed to fetch posts. Please try again.");
    } finally {
      setLoadingPosts(false);
    }
  }, [contractReadOnly, user]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Upload file to IPFS
  const handleFileChange = async (e) => {
    e.preventDefault();

    if (!file) {
      toast.warning("Please select a file to upload.");
      return;
    }

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
      setNewProfilePic(
        `https://chocolate-managing-piranha-401.mypinata.cloud/ipfs/${ImgHash}`
      );

      toast.success("File successfully uploaded!");
      setFile(null);
    } catch (e) {
      console.log("Unable to upload file:", e);
      toast.error("Failed to upload the file. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  // Save profile changes
  const handleSave = async () => {
    setLoading(true);
    try {
      const tx = await contractWithSigner.updateProfile(
        newProfilePic || user.profilePic,
        updatedBio || user.bio
      );
      await tx.wait();
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Error updating profile: " + error.message);
    } finally {
      setLoading(false);
      setTimeout(() => window.location.reload(), 500);
    }
  };

  return (
    <div className="bg-gradient-to-b from-indigo-50 to-white min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 mx-auto max-w-2xl">
          <div className="flex flex-col md:flex-row items-center md:space-x-6">
            <div className="relative mb-4 md:mb-0">
              <img
                src={user.profilePic}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-indigo-100 shadow"
              />
              {!isEditing && (
                <div className="absolute bottom-0 right-0 bg-indigo-600 rounded-full p-2 shadow-md">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-white"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                </div>
              )}
            </div>

            <div className="flex-1 text-center md:text-left">
              {isEditing ? (
                <div className="space-y-4">
                  <div className="bg-indigo-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-indigo-800 mb-2">
                      Profile Picture
                    </label>
                    <input
                      type="file"
                      onChange={(e) => setFile(e.target.files[0])}
                      className="w-full text-sm text-indigo-800 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-100 file:text-indigo-700 hover:file:bg-indigo-200"
                    />
                    <button
                      onClick={handleFileChange}
                      className="mt-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition duration-200 ease-in-out disabled:bg-indigo-300 disabled:cursor-not-allowed"
                    >
                      {isUploading ? (
                        <span className="flex items-center justify-center">
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                        "Upload Profile Picture"
                      )}
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-indigo-800 mb-2">
                      Bio
                    </label>
                    <textarea
                      value={updatedBio}
                      onChange={(e) => setUpdatedBio(e.target.value)}
                      className="w-full px-4 py-2 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 ease-in-out resize-none"
                      rows="4"
                      placeholder={
                        user.bio ? user.bio : "Tell us about yourself..."
                      }
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                    <button
                      onClick={handleSave}
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded-lg transition duration-200 ease-in-out disabled:bg-indigo-300 disabled:cursor-not-allowed"
                      disabled={isUploading ? true : false}
                    >
                      {loading ? (
                        <span className="flex items-center justify-center">
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                          Saving...
                        </span>
                      ) : (
                        "Save Changes"
                      )}
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-6 rounded-lg transition duration-200 ease-in-out"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <h2 className="text-xl font-semibold text-indigo-800">
                    {user.name}
                  </h2>
                  <p className="text-sm text-indigo-600">{user.bio}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Posts */}
        <div className=" mx-auto mt-8 space-y-6 px-1">
          {loadingPosts ? (
            <div className="col-span-full text-center">
              <p>Loading posts...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="col-span-full text-center">
              <p>No posts yet.</p>
            </div>
          ) : (
            posts.map((post) => (
              <Post
                key={post.id}
                post={post}
                author={authorDetails[post.authorAddress]}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

Profile.propTypes = {
  contractReadOnly: PropTypes.object,
  contractWithSigner: PropTypes.object,
  user: PropTypes.object.isRequired,
};

export default Profile;
