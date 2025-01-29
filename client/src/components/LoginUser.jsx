import { useState } from "react";
import PropTypes from "prop-types";

const LoginUser = ({ account }) => {
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // Use `account` and compare with a stored hash to "login."
    alert("Logged in with account: " + account);
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-bold">Login</h2>
      <p>Account: {account}</p>
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="btn-primary" onClick={handleLogin}>
        Login
      </button>
    </div>
  );
};

LoginUser.propTypes = {
  account: PropTypes.string,
};

export default LoginUser;
