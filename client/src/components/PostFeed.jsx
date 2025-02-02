import { useEffect, useState } from "react";
import PropTypes from "prop-types";

const PostFeed = ({ contractReadOnly, contractWithSigner, account }) => {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    const fetchPosts = async () => {
      if (!contractReadOnly) return;
      const postCount = await contractReadOnly.getPostCount();
      const posts = await Promise.all(
        Array(postCount)
          .fill()
          .map((_, index) => contractReadOnly.posts(index))
      );
      setPosts(posts.reverse());
    };
    fetchPosts();
  }, [contractReadOnly]);

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

PostFeed.propTypes = {
  contractReadOnly: PropTypes.instanceOf(Object).isRequired,
  contractWithSigner: PropTypes.instanceOf(Object).isRequired,
  account: PropTypes.string,
};

export default PostFeed;
