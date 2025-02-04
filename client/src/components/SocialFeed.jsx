import PostCreator from "./PostCreator";
import PostFeed from "./PostFeed";
import PropTypes from "prop-types";

const SocialFeed = ({ contractWithSigner, contractReadOnly, account }) => {
  return (
    <div className="container mx-auto p-4">
      <PostCreator contractWithSigner={contractWithSigner} />
      <PostFeed
        contractWithSigner={contractWithSigner}
        contractReadOnly={contractReadOnly}
        account={account}
      />
    </div>
  );
};

SocialFeed.propTypes = {
  contractReadOnly: PropTypes.instanceOf(Object).isRequired,
  contractWithSigner: PropTypes.instanceOf(Object).isRequired,
  account: PropTypes.string,
};

export default SocialFeed;
