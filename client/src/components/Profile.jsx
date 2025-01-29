import { useEffect, useState } from "react";
import PropTypes from "prop-types";

export const Profile = ({ contractReadOnly, account }) => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (account) {
        const data = await contractReadOnly.getUserProfile(account);
        setProfile(data);
      }
    };
    fetchProfile();
  }, [account, contractReadOnly]);

  if (!profile) return <p>Loading profile...</p>;

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-bold">{profile.name}</h2>
      <img
        src={profile.profilePic}
        alt="Profile Pic"
        className="rounded w-20 h-20"
      />
      <p>{profile.bio}</p>
      <h3 className="font-bold">Friends: {profile.friends.length}</h3>
    </div>
  );
};

Profile.propTypes = {
  contractReadOnly: PropTypes.instanceOf(Object).isRequired,
  account: PropTypes.string,
};
