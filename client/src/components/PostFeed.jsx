import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import PostCreator from "./PostCreator";

const PostFeed = ({ contractReadOnly, contractWithSigner, account }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      if (account) {
        const data = await contractReadOnly.getUserPosts(account);
        console.log(data);
        
        setPosts(data);
      }
    };
    fetchPosts();
  }, [account, contractReadOnly]);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <PostCreator contractWithSigner={contractWithSigner} />
      </div>
      <h2 className="text-xl font-bold">Your Posts</h2>
      {posts.map((post) => (
        <div key={post.id} className="p-4 border rounded">
          <p>{post.content}</p>
          {/* <small>{new Date(post.timestamp * 1000).toLocaleString()}</small> */}
          <p>{post.timestamp}</p>
          <p>Likes: {post.likes}</p>
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
