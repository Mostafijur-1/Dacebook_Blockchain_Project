import { useState } from "react";
import PropTypes from "prop-types";

const PostCreator = ({ contractWithSigner }) => {
  const [content, setContent] = useState("");
  const [uploads, setUploads] = useState([]);

  const handleCreatePost = async () => {
    try {
      const tx = await contractWithSigner.createPost(content, uploads);
      await tx.wait();
      alert("Post created!");
    } catch (error) {
      alert("Error creating post: " + error.message);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <textarea
        placeholder="What's on your mind?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button className="btn-primary" onClick={handleCreatePost}>
        Post
      </button>
    </div>
  );
};

PostCreator.propTypes = {
  contractWithSigner: PropTypes.instanceOf(Object).isRequired,
};

export default PostCreator;
