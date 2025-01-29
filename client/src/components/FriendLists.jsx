import PropTypes from "prop-types";

const FriendsList = ({ friends }) => {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-xl font-bold">Friends</h2>
      {friends.map((friend, index) => (
        <p key={index} className="text-blue-500">
          {friend}
        </p>
      ))}
    </div>
  );
};

FriendsList.propTypes = {
  friends: PropTypes.array,
};

export default FriendsList;
