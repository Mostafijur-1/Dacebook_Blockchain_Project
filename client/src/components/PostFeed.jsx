import { useEffect, useState } from "react";
import PropTypes from "prop-types";

const PostFeed = ({
  contractWithSigner,
  contractReadOnly,
  posts,
  loading,
  user,
}) => {
  const [authorDetails, setAuthorDetails] = useState({}); // Store author details

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

  // Handle like action
  const handleLike = async (author, postId) => {
    try {
      const tx = await contractWithSigner.toggleLikeonPost(author, postId);
      await tx.wait();
      location.reload();
    } catch (error) {
      alert("Error liking post: " + error.message);
    }
  };

  // Handle comment action
  const addComment = async (author, postId, comment) => {
    if (!comment.trim()) return;
    try {
      const tx = await contractWithSigner.commentOnPost(
        author,
        postId,
        comment
      );
      await tx.wait();
      location.reload();
    } catch (error) {
      alert("Error adding comment: " + error.message);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-8 space-y-6">
      {loading ? (
        <p className="text-center">Loading posts...</p>
      ) : posts.length > 0 ? (
        posts.map((post) => {
          const author = authorDetails[post.authorAddress];

          return (
            <div key={post.id} className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex items-center space-x-3 mb-2">
                <img
                  src={author?.profilePic || "/default-avatar.png"} // Fallback image
                  alt={author?.name || "Unknown User"}
                  className="w-10 h-10 rounded-full"
                />
                <span className="font-semibold">
                  {author?.name || "Unknown User"}
                </span>
              </div>
              <p className="mb-2">{post.content}</p>

              {post.uploads.length > 0 && (
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {post.uploads.map((img, index) => (
                    <img
                      key={img}
                      src={img}
                      alt={`Post image ${index + 1}`}
                      className="rounded-lg w-full h-auto"
                    />
                  ))}
                </div>
              )}

              <div className="flex items-center space-x-4 mt-2">
                <button
                  onClick={() => handleLike(post.authorAddress, post.id)}
                  className="text-blue-500 font-semibold"
                >
                  👍 {post.likes.toString()}
                </button>
              </div>

              <div className="mt-2">
                <h4 className="font-semibold">Comments:</h4>
                {post.comments.map((comment, index) => (
                  <p key={comment + index} className="text-sm">
                    {comment.commentor}: {comment.text}
                  </p>
                ))}
                <input
                  type="text"
                  placeholder="Write a comment..."
                  className="mt-2 p-2 w-full border rounded"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      addComment(
                        post.authorAddress,
                        post.id,
                        e.target.value,
                        user.name
                      );
                      e.target.value = "";
                    }
                  }}
                />
              </div>
            </div>
          );
        })
      ) : (
        <p className="text-center">No posts to display.</p>
      )}
    </div>
  );
};

PostFeed.propTypes = {
  contractReadOnly: PropTypes.object.isRequired,
  contractWithSigner: PropTypes.object.isRequired,
  posts: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  user: PropTypes.object.isRequired,
};

export default PostFeed;
