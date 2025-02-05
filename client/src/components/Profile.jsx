import { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";

const Profile = ({ contractReadOnly, contractWithSigner, user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newProfilePic, setNewProfilePic] = useState(null);
  const [updatedBio, setUpdatedBio] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [posts, setPosts] = useState([]);

  const fetchPosts = useCallback(async () => {
    if (!contractReadOnly || !user) return;
    setLoadingPosts(true);
    try {
      const fetchedPosts = await contractReadOnly.getPosts(user.userAddress);

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
        setNewProfilePic(
          `https://chocolate-managing-piranha-401.mypinata.cloud/ipfs/${ImgHash}`
        );

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

  // Save profile changes
  const handleSave = async () => {
    if (!updatedBio) {
      alert("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const tx = await contractWithSigner.updateProfile(
        newProfilePic || user.profilePic,
        updatedBio
      );
      await tx.wait();
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      alert("Error updating profile: " + error.message);
    } finally {
      setLoading(false);
      setTimeout(() => window.location.reload(), 500);
    }
  };

  return (
    <div className="container mx-auto p-4">
      {/* Profile Header */}
      <div className="flex items-center space-x-4 mb-6 mx-auto max-w-xl">
        <img
          src={user.profilePic}
          alt="Profile Picture"
          className="w-20 h-20 rounded-full object-cover"
        />
        <div>
          {isEditing ? (
            <div>
              <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                className="mb-2"
              />
              <button
                onClick={handleFileChange}
                className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
                disabled={isUploading}
              >
                {isUploading ? "Uploading..." : "Upload Profile Picture"}
              </button>

              <textarea
                value={updatedBio}
                onChange={(e) => setUpdatedBio(e.target.value)}
                className="text-gray-600 border p-2 w-full mb-2"
                rows="4"
                placeholder={user.bio ? user.bio : "Update Your Bio"}
              />
              <button
                onClick={handleSave}
                className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600 px-8 ml-2"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div>
              <h1 className="text-3xl font-semibold">{user.name}</h1>
              <p className="text-gray-600">{user.bio}</p>

              {/* Display post count */}
              <button
                onClick={() => setIsEditing(true)}
                className="mt-2 text-blue-500 hover:text-blue-600"
              >
                Edit Profile
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Posts Section */}
      <div className="max-w-xl mx-auto mt-8 space-y-6">
        {loadingPosts ? (
          <p className="text-center">Loading posts...</p>
        ) : posts.length > 0 ? (
          posts.map((post) => (
            <div key={post.id} className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex items-center space-x-3 mb-2">
                <img
                  src={user.profilePic}
                  alt={post.author}
                  className="w-10 h-10 rounded-full"
                />
                <span className="font-semibold">{post.author}</span>
              </div>
              <p className="mb-2">{post.content}</p>

              {post.uploads.length > 0 && (
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {post.uploads.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`Post image ${index + 1}`}
                      className="rounded-lg w-full h-auto"
                    />
                  ))}
                </div>
              )}

              <div className="flex items-center space-x-4 mt-2">
                <button className="text-blue-500 font-semibold">
                  👍 {post.likes.toString()}
                </button>
              </div>

              <div className="mt-2">
                <h4 className="font-semibold">Comments:</h4>
                {post.comments.map((comment, index) => (
                  <p key={index} className="text-sm">
                    {comment.userAddress}: {comment.text}
                  </p>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center">No posts to display.</p>
        )}
      </div>
    </div>
  );
};

Profile.propTypes = {
  contractWithSigner: PropTypes.object.isRequired,
  contractReadOnly: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
};

export default Profile;
