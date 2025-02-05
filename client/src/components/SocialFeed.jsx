import PostCreator from "./PostCreator";
import PostFeed from "./PostFeed";
import PropTypes from "prop-types";

const SocialFeed = ({ contractWithSigner, account, posts, loading }) => {
  return (
    <div className="container mx-auto p-4">
      <PostCreator contractWithSigner={contractWithSigner} />
      <PostFeed
        contractWithSigner={contractWithSigner}
        account={account}
        posts={posts}
        loading={loading}
      />
    </div>
  );
};

SocialFeed.propTypes = {
  contractReadOnly: PropTypes.instanceOf(Object).isRequired,
  contractWithSigner: PropTypes.instanceOf(Object).isRequired,
  account: PropTypes.string,
  posts: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default SocialFeed;
