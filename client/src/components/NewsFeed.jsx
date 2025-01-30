import { useState } from "react";

const dummyPosts = [
  {
    id: 1,
    user: "John Doe",
    avatar:
      "https://res.cloudinary.com/dj0grvabc/image/upload/v1721036212/avatars/dbwtywmwej3wbtl6uazs.png",
    content: "Had a great day at the beach! ☀️",
    image:
      "https://res.cloudinary.com/dj0grvabc/image/upload/v1720050307/products/wolmidib5qrnx20hlz6g.jpg",
    likes: 12,
    comments: [
      { user: "Jane Smith", text: "Looks amazing! 🌊" },
      { user: "Mark Lee", text: "Wish I was there!" },
    ],
  },
  {
    id: 2,
    user: "Sarah Connor",
    avatar:
      "https://res.cloudinary.com/dj0grvabc/image/upload/v1721036212/avatars/dbwtywmwej3wbtl6uazs.png",
    content: "Enjoying a fresh cup of coffee ☕",
    image:
      "https://res.cloudinary.com/dj0grvabc/image/upload/v1720341020/products/i7zqk7qrtaqvehirywto.jpg",
    likes: 8,
    comments: [{ user: "John Doe", text: "Nothing beats a good coffee!" }],
  },
];

const NewsFeed = () => {
  const [posts, setPosts] = useState(dummyPosts);

  const handleLike = (postId) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId ? { ...post, likes: post.likes + 1 } : post
      )
    );
  };

  const addComment = (postId, comment) => {
    if (!comment.trim()) return;
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: [...post.comments, { user: "You", text: comment }],
            }
          : post
      )
    );
  };

  return (
    <div className="max-w-xl mx-auto mt-8 space-y-6">
      {posts.map((post) => (
        <div key={post.id} className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center space-x-3 mb-2">
            <img
              src={post.avatar}
              alt={post.user}
              className="w-10 h-10 rounded-full"
            />
            <span className="font-semibold">{post.user}</span>
          </div>
          <p className="mb-2">{post.content}</p>
          {post.image && (
            <img src={post.image} alt="Post" className="rounded-lg mb-2" />
          )}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => handleLike(post.id)}
              className="text-blue-500 font-semibold"
            >
              👍 {post.likes}
            </button>
          </div>
          <div className="mt-2">
            <h4 className="font-semibold">Comments:</h4>
            {post.comments.map((comment, index) => (
              <p key={index} className="text-sm">
                <strong>{comment.user}</strong>: {comment.text}
              </p>
            ))}
            <input
              type="text"
              placeholder="Write a comment..."
              className="mt-2 p-2 w-full border rounded"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  addComment(post.id, e.target.value);
                  e.target.value = "";
                }
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default NewsFeed;
