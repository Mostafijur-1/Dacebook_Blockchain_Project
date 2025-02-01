import { useState } from "react";
import PropTypes from "prop-types";

const RegisterUser = ({ contractWithSigner }) => {
  const [name, setName] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [bio, setBio] = useState("");
  const [password, setPassword] = useState("");
  // console.log(contractWithSigner);
  
  const handleRegister = async () => {
    try {
      console.log(name, password);
      
      const tx = await contractWithSigner.register(
        name,
        profilePic,
        bio,
        password
      );
      await tx.wait();
      alert("User registered successfully!");
    } catch (error) {
      alert("Error registering user: " + error.message);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-bold">Register</h2>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Profile Pic URL"
        value={profilePic}
        onChange={(e) => setProfilePic(e.target.value)}
      />
      <textarea
        placeholder="Bio"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="bg-slate-300 p-2" onClick={handleRegister}>
        Register
      </button>
    </div>
  );
};

RegisterUser.propTypes = {
  contractWithSigner: PropTypes.object,
};

export default RegisterUser;
