import PostCreator from "./PostCreator";
import PostFeed from "./PostFeed";
import PropTypes from "prop-types";

const SocialFeed = ({
  contractReadOnly,
  contractWithSigner,
  posts,
  loading,
  user,
}) => {
  return (
    <div className="container mx-auto p-4 bg-indigo-50">
      <PostCreator contractWithSigner={contractWithSigner} />
      <PostFeed
        contractReadOnly={contractReadOnly}
        contractWithSigner={contractWithSigner}
        posts={posts}
        loading={loading}
        user={user}
      />
    </div>
  );
};

SocialFeed.propTypes = {
  contractReadOnly: PropTypes.instanceOf(Object).isRequired,
  contractWithSigner: PropTypes.instanceOf(Object).isRequired,
  posts: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  user: PropTypes.object.isRequired,
};

export default SocialFeed;
