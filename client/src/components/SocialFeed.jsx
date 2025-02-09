import PostCreator from "./PostCreator";
import PostFeed from "./PostFeed";
import PropTypes from "prop-types";

const SocialFeed = ({ contractWithSigner, user, posts, loading }) => {
  return (
    <div className="container mx-auto p-4">
      <PostCreator contractWithSigner={contractWithSigner} />
      <PostFeed
        contractWithSigner={contractWithSigner}
        user={user}
        posts={posts}
        loading={loading}
      />
    </div>
  );
};

SocialFeed.propTypes = {
  contractReadOnly: PropTypes.instanceOf(Object).isRequired,
  contractWithSigner: PropTypes.instanceOf(Object).isRequired,
  user: PropTypes.object.isRequired,
  posts: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default SocialFeed;
