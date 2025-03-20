// import { useState } from "react";
// import PropTypes from "prop-types";

// const PostComments = ({ contractWithSigner, postId, author }) => {
//   const [comment, setComment] = useState("");

//   const addComment = async () => {
//     try {
//       const tx = await contractWithSigner.commentOnPost(
//         author,
//         postId,
//         comment
//       );
//       await tx.wait();
//       alert("Comment added!");
//     } catch (error) {
//       alert("Error adding comment: " + error.message);
//     }
//   };

//   return (
//     <div>
//       <textarea
//         placeholder="Write a comment..."
//         value={comment}
//         onChange={(e) => setComment(e.target.value)}
//       />
//       <button className="btn-primary" onClick={addComment}>
//         Comment
//       </button>
//     </div>
//   );
// };

// PostComments.propTypes = {
//   contractWithSigner: PropTypes.instanceOf(Object).isRequired,
//   postId: PropTypes.string,
//   author: PropTypes.string,
// };

// export default PostComments;
