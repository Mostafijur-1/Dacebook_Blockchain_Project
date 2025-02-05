import { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const RegisterUser = ({ contractWithSigner }) => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!name || !password) {
      alert("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const tx = await contractWithSigner.register(name, password);
      await tx.wait();
      alert("User registered successfully!");
      navigate("/profile");
      setTimeout(() => window.location.reload(), 500); // Reload after 500ms delay
    } catch (error) {
      alert("Error registering user: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 max-w-md mx-auto p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold text-center">Register</h2>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="p-2 border rounded"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="p-2 border rounded"
      />
      <button
        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
        onClick={handleRegister}
        disabled={loading}
      >
        {loading ? "Registering..." : "Register"}
      </button>
    </div>
  );
};

RegisterUser.propTypes = {
  contractWithSigner: PropTypes.object.isRequired,
};

export default RegisterUser;
