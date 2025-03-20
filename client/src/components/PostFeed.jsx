import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Post from "./Post";

const PostFeed = ({
  contractWithSigner,
  contractReadOnly,
  posts: initialPosts,
  loading,
  user,
}) => {
  const [posts, setPosts] = useState(initialPosts);
  const [authorDetails, setAuthorDetails] = useState({});
  const [likedPosts, setLikedPosts] = useState({});

  useEffect(() => {
    setPosts(initialPosts);
  }, [initialPosts]);

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

  const handleLike = async (author, postId) => {
    try {
      setLikedPosts((prev) => ({ ...prev, [postId]: !prev[postId] }));
      const tx = await contractWithSigner.toggleLikeonPost(author, postId);
      await tx.wait();
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const addComment = async (author, postId, comment) => {
    if (!comment.trim()) return;
    await contractWithSigner.commentOnPost(author, postId, comment);
  };

  return (
    <div className="max-w-xl mx-auto mt-8 space-y-6">
      {loading ? (
        <p>Loading...</p>
      ) : (
        posts.map((post) => (
          <Post
            key={post.id}
            post={post}
            author={authorDetails[post.authorAddress]}
            user={user}
            likedPosts={likedPosts}
            handleLike={handleLike}
            addComment={addComment}
          />
        ))
      )}
    </div>
  );
};

PostFeed.propTypes = {
  contractWithSigner: PropTypes.object.isRequired,
  contractReadOnly: PropTypes.object.isRequired,
  posts: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  user: PropTypes.object.isRequired,
};

export default PostFeed;
