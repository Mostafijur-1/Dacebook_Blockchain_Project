import { useState } from "react";

const Profile = () => {
  // Sample user data
  const [user, setUser] = useState({
    name: "John Doe",
    bio: "Web Developer | Tech Enthusiast | Avid Learner",
    profilePicUrl:
      "https://res.cloudinary.com/dj0grvabc/image/upload/v1721036212/avatars/dbwtywmwej3wbtl6uazs.png",
    posts: [
      {
        id: 1,
        content: "Had an amazing day learning React and Tailwind!",
        timestamp: "2025-01-30 10:00 AM",
      },
      {
        id: 2,
        content: "Started a new project today, excited to share it soon!",
        timestamp: "2025-01-29 8:30 PM",
      },
    ],
  });

  const [isEditing, setIsEditing] = useState(false);
  const [newProfilePic, setNewProfilePic] = useState(null);
  const [updatedName, setUpdatedName] = useState(user.name);
  const [updatedBio, setUpdatedBio] = useState(user.bio);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setNewProfilePic(URL.createObjectURL(file));
    }
  };

  const handleSave = () => {
    setUser({
      ...user,
      name: updatedName,
      bio: updatedBio,
      profilePicUrl: newProfilePic || user.profilePicUrl,
    });
    setIsEditing(false);
  };

  return (
    <div className="container mx-auto p-4">
      {/* Profile Header */}
      <div className="flex items-center space-x-4 mb-6">
        <img
          src={newProfilePic || user.profilePicUrl}
          alt="Profile Picture"
          className="w-20 h-20 rounded-full object-cover"
        />
        <div>
          {isEditing ? (
            <div>
              <input type="file" onChange={handleFileChange} className="mb-2" />
              <input
                type="text"
                value={updatedName}
                onChange={(e) => setUpdatedName(e.target.value)}
                className="text-3xl font-semibold border p-2 mb-2 w-full"
              />
              <textarea
                value={updatedBio}
                onChange={(e) => setUpdatedBio(e.target.value)}
                className="text-gray-600 border p-2 w-full mb-2"
                rows="4"
              />
              <button
                onClick={handleSave}
                className="bg-blue-500 text-white p-2 rounded"
              >
                Save Changes
              </button>
            </div>
          ) : (
            <div>
              <h1 className="text-3xl font-semibold">{user.name}</h1>
              <p className="text-gray-600">{user.bio}</p>
              <button
                onClick={() => setIsEditing(true)}
                className="mt-2 text-blue-500"
              >
                Edit Profile
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Posts Section */}
      <div className="space-y-6">
        {user.posts.map((post) => (
          <div key={post.id} className="bg-white p-4 rounded-lg shadow-md">
            <div className="text-gray-500 text-sm">{post.timestamp}</div>
            <p className="mt-2 text-lg">{post.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
