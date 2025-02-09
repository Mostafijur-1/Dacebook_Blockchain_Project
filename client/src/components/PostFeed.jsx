import PropTypes from "prop-types";

const PostFeed = ({ contractWithSigner, user, posts, loading }) => {
  // Handle like action
  const handleLike = async (postId) => {
    try {
      const tx = await contractWithSigner.toggleLikeonPost(
        user.userAddress,
        postId
      );
      await tx.wait();
      location.reload();
      // updatePostLikes(postId);
    } catch (error) {
      alert("Error liking post: " + error.message);
    }
  };

  // Update only the liked post instead of refetching all
  // const updatePostLikes = (postId) => {
  //   setPosts((prevPosts) =>
  //     prevPosts.map((post) =>
  //       post.id === postId ? { ...post, likes: post.likes + 1 } : post
  //     )
  //   );
  // };

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
        posts.map((post) => (
          <div key={post.id} className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex items-center space-x-3 mb-2">
              <img
                src={post.author.profilePic}
                alt={post.author}
                className="w-10 h-10 rounded-full"
              />
              <span className="font-semibold">{post.author.userAddress}</span>
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
  user: PropTypes.object.isRequired,
  posts: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default PostFeed;
