import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";

const Profile = ({ contractReadOnly, contractWithSigner, account }) => {
  const [user, setUser] = useState({
    name: "",
    bio: "",
    profilePicUrl: "",
    posts: [],
  });
  const [isEditing, setIsEditing] = useState(false);
  const [newProfilePic, setNewProfilePic] = useState(null);
  const [updatedName, setUpdatedName] = useState("");
  const [updatedBio, setUpdatedBio] = useState("");
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [image, setImage] = useState(
    "https://res.cloudinary.com/dj0grvabc/image/upload/v1725610147/avatars/jcaejrqtl1qzn2mwawlf.png"
  ); // Default profile picture

  // Fetch user data from the smart contract
  useEffect(() => {
    const fetchUserData = async () => {
      if (contractWithSigner && account) {
        try {
          const userData = await contractReadOnly.getUserProfile(account);
          setUser({
            name: userData.name,
            bio: userData.bio,
            profilePicUrl: userData.profilePic,
            posts: [], // Fetch posts from another contract or API if needed
          });
          setUpdatedName(userData.name);
          setUpdatedBio(userData.bio);

          // Set profile picture URL
          if (userData.profilePic) {
            setImage(
              `https://chocolate-managing-piranha-401.mypinata.cloud/ipfs/${userData.profilePic}`
            );
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, [contractReadOnly, account, contractWithSigner]);

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
        setNewProfilePic(ImgHash);
        setImage(
          `https://chocolate-managing-piranha-401.mypinata.cloud/ipfs/${ImgHash}`
        ); // Update image preview
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
    if (!updatedName || !updatedBio) {
      alert("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const tx = await contractWithSigner.updateProfile(
        newProfilePic || user.profilePicUrl,
        updatedBio
      );
      await tx.wait();
      setUser({
        ...user,
        name: updatedName,
        bio: updatedBio,
        profilePicUrl: newProfilePic || user.profilePicUrl,
      });
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      alert("Error updating profile: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      {/* Profile Header */}
      <div className="flex items-center space-x-4 mb-6">
        <img
          src={image}
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
              />
              <button
                onClick={handleSave}
                className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          ) : (
            <div>
              <h1 className="text-3xl font-semibold">{user.name}</h1>
              <p className="text-gray-600">{user.bio}</p>
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
    </div>
  );
};

Profile.propTypes = {
  contractWithSigner: PropTypes.object.isRequired,
  contractReadOnly: PropTypes.object.isRequired,
  account: PropTypes.string.isRequired,
};

export default Profile;
