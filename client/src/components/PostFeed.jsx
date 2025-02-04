import { useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";

const PostFeed = ({ contractReadOnly, contractWithSigner, account }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const avatar =
    "https://res.cloudinary.com/dj0grvabc/image/upload/v1721036212/avatars/dbwtywmwej3wbtl6uazs.png";

  // Fetch posts from the smart contract
  const fetchPosts = useCallback(async () => {
    if (!contractReadOnly || !account) return;
    setLoading(true);
    try {
      console.log(account);
      const fetchedPosts = await contractReadOnly.getPosts(account);

      setPosts(fetchedPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
      alert("Failed to fetch posts. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [contractReadOnly, account]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Handle like action
  const handleLike = async (postId) => {
    try {
      const tx = await contractWithSigner.toggleLikeonPost(account, postId);
      await tx.wait();
      updatePostLikes(postId);
    } catch (error) {
      alert("Error liking post: " + error.message);
    }
  };

  // Update only the liked post instead of refetching all
  const updatePostLikes = (postId) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId ? { ...post, likes: post.likes + 1 } : post
      )
    );
  };

  const addComment = useCallback(
    async (author, postId, comment) => {
      if (!comment.trim()) return;
      try {
        const tx = await contractWithSigner.commentOnPost(
          author,
          postId,
          comment
        );
        await tx.wait();

        fetchPosts();
        setPosts(fetchPosts);
      } catch (error) {
        alert("Error adding comment: " + error.message);
      }
    },
    [contractWithSigner, fetchPosts]
  );

  return (
    <div className="max-w-xl mx-auto mt-8 space-y-6">
      {loading ? (
        <p className="text-center">Loading posts...</p>
      ) : posts.length > 0 ? (
        posts.map((post) => (
          <div key={post.id} className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex items-center space-x-3 mb-2">
              <img
                src={avatar}
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
                  {comment.userAddress}: {comment.text}
                </p>
              ))}
              <input
                type="text"
                placeholder="Write a comment..."
                className="mt-2 p-2 w-full border rounded"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    addComment(post.author, post.id, e.target.value);
                    e.target.value = "";
                  }
                }}
              />
            </div>
          </div>
        ))
      ) : (
        <p className="text-center">No posts to display.</p>
      )}
    </div>
  );
};

PostFeed.propTypes = {
  contractReadOnly: PropTypes.object.isRequired,
  contractWithSigner: PropTypes.object.isRequired,
  account: PropTypes.string,
};

export default PostFeed;
