import PropTypes from "prop-types";
import { useState } from "react";
import {
  FaHeart,
  FaRegHeart,
  FaComment,
  FaPaperPlane,
  FaEllipsisH,
} from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";

const Post = ({
  post,
  author,
  likedPosts = {},
  handleLike = {},
  addComment = {},
}) => {
  const [commentInput, setCommentInput] = useState("");
  const [isCommentExpanded, setIsCommentExpanded] = useState(false);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const postDate = new Date(parseInt(post.timestamp || Date.now()));
  const timeAgo = formatDistanceToNow(postDate, { addSuffix: true });

  // Toggle comment section
  const toggleComments = () => setIsCommentExpanded((prev) => !prev);

  // Handle comment submission
  const handleCommentSubmit = async () => {
    if (!commentInput.trim()) return;
    setIsSubmittingComment(true);
    await addComment(post.authorAddress, post.id, commentInput);
    setCommentInput("");
    setIsSubmittingComment(false);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg border border-indigo-50">
      {/* Author Details */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <img
            src={author?.profilePic || "/default-avatar.png"}
            alt={author?.name || "Unknown User"}
            className="w-12 h-12 rounded-full object-cover border-2 border-indigo-100"
          />
          <div>
            <div className="font-semibold text-gray-800">
              {author?.name || post.authorAddress}
            </div>
            <div className="text-xs text-indigo-400">{timeAgo}</div>
          </div>
        </div>
        <button className="text-indigo-400 hover:text-indigo-600 p-2 rounded-full hover:bg-indigo-50 transition-colors duration-200">
          <FaEllipsisH />
        </button>
      </div>

      {/* Post Content */}
      <p className="mb-4 text-gray-700 leading-relaxed">{post.content}</p>

      {/* Image Uploads */}
      {post.uploads && post.uploads.length > 0 && (
        <div
          className={`grid ${
            post.uploads.length === 1 ? "grid-cols-1" : "grid-cols-2"
          } gap-2 mb-4`}
        >
          {post.uploads.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Post image ${index + 1}`}
              className="rounded-lg w-full h-auto object-cover shadow-sm border border-indigo-50"
              style={{ maxHeight: "300px" }}
            />
          ))}
        </div>
      )}

      {/* Engagement Stats */}
      <div className="flex items-center justify-between py-3 border-t border-b border-indigo-50 mb-3">
        <div className="flex space-x-6">
          <button
            onClick={() => handleLike(post.authorAddress, post.id)}
            className={`flex items-center space-x-2 ${
              likedPosts[post.id] ? "text-purple-500" : "text-gray-500"
            } hover:text-purple-500 transition duration-200`}
          >
            {likedPosts[post.id] ? (
              <FaHeart className="text-lg" />
            ) : (
              <FaRegHeart className="text-lg" />
            )}
            <span className="font-medium">{post.likes}</span>
          </button>

          <button
            onClick={toggleComments}
            className="flex items-center space-x-2 text-gray-500 hover:text-indigo-500 transition duration-200"
          >
            <FaComment className="text-lg" />
            <span className="font-medium">{post.comments.length}</span>
          </button>
        </div>
      </div>

      {/* Comments Section */}
      {isCommentExpanded && (
        <div>
          {post.comments.map((comment, index) => (
            <div
              key={index}
              className="mb-2 p-2 bg-gray-50 rounded-lg text-gray-700"
            >
              <strong>{comment.commentor}:</strong> {comment.text}
            </div>
          ))}
          <div className="flex items-center space-x-2 mt-3">
            <input
              type="text"
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              placeholder="Write a comment..."
              className="w-full p-2 border rounded-lg"
            />
            <button
              onClick={handleCommentSubmit}
              disabled={isSubmittingComment}
              className="bg-indigo-500 text-white px-3 py-1 rounded-lg"
            >
              <FaPaperPlane />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

Post.propTypes = {
  post: PropTypes.object.isRequired,
  author: PropTypes.object,
  user: PropTypes.object.isRequired,
  likedPosts: PropTypes.object.isRequired,
  handleLike: PropTypes.func.isRequired,
  addComment: PropTypes.func.isRequired,
};

export default Post;
