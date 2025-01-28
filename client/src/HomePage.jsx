import { Routes, Route, Link } from "react-router-dom";
import PropTypes from "prop-types";
import RegisterUser from "./components/RegisterUser";
import { Profile } from "./components/Profile";
import PostFeed from "./components/PostFeed";
import Messenger from "./components/Messenger";

const HomePage = ({ contractReadOnly, contractWithSigner, account }) => {
  return (
    <div className="justify-center items-center flex flex-col gap-10 p-6">
      {/* Header */}
      <header className="text-center">
        <h1 className="text-3xl font-bold">Dacebook</h1>
        <p className="text-sm mt-2">A Decentralized Private Social App</p>
        <p className="text-gray-600 mt-2">
          Account:{" "}
          <span className="font-mono">
            {account ? account : "Not connected"}
          </span>
        </p>
      </header>

      {/* Navigation Links */}
      <nav className="mb-6">
        <ul className="flex space-x-6">
          <li>
            <Link to="/" className="text-blue-500 hover:underline">
              Home
            </Link>
          </li>
          <li>
            <Link to="/register" className="text-blue-500 hover:underline">
              Register/Login
            </Link>
          </li>
          <li>
            <Link to="/profile" className="text-blue-500 hover:underline">
              Profile
            </Link>
          </li>
          <li>
            <Link to="/feed" className="text-blue-500 hover:underline">
              Feed
            </Link>
          </li>
          <li>
            <Link to="/chat" className="text-blue-500 hover:underline">
              Chat
            </Link>
          </li>
        </ul>
      </nav>

      {/* Routes */}
      <div className="w-full max-w-4xl">
        <Routes>
          <Route
            path="/"
            element={
              <h1 className="text-xl text-center">
                Welcome to Decent DriveChat!
              </h1>
            }
          />
          <Route
            path="/register"
            element={<RegisterUser contractWithSigner={contractWithSigner} />}
          />
          <Route
            path="/profile"
            element={
              <Profile contractReadOnly={contractReadOnly} account={account} />
            }
          />
          <Route
            path="/feed"
            element={
              <PostFeed contractReadOnly={contractReadOnly} account={account} />
            }
          />
          <Route
            path="/chat"
            element={
              <Messenger
                contractWithSigner={contractWithSigner}
                account={account}
              />
            }
          />
        </Routes>
      </div>
    </div>
  );
};

HomePage.propTypes = {
  contractReadOnly: PropTypes.instanceOf(Object).isRequired,
  contractWithSigner: PropTypes.instanceOf(Object).isRequired,
  account: PropTypes.string,
};

export default HomePage;
