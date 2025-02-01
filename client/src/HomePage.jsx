import { Routes, Route, Link } from "react-router-dom";
import PropTypes from "prop-types";
import RegisterUser from "./components/RegisterUser";
import Profile from "./components/Profile";
import PostFeed from "./components/PostFeed";
import Messenger from "./components/Messenger";
import NewsFeed from "./components/NewsFeed";

const HomePage = ({ contractReadOnly, contractWithSigner, account }) => {
  return (
    <div className="flex flex-col items-center gap-10 p-6">
      {/* Header */}
      <header className="text-center">
        <h1 className="text-3xl font-bold text-green-600">Dacebook</h1>
        <p className="text-sm mt-2 text-gray-500">
          A Decentralized Private Social App
        </p>
        <p className="mt-2 text-gray-700">
          Account:{" "}
          <span className="font-mono text-blue-600">
            {account ? account : "Not connected"}
          </span>
        </p>
      </header>

      {/* Navigation */}
      <nav className="mb-6 bg-gray-100 p-3 rounded-lg shadow">
        <ul className="flex space-x-6">
          {[
            { to: "/", label: "Home" },
            { to: "/register", label: "Register" },
            { to: "/profile", label: "Profile" },

            { to: "/chat", label: "Chat" },
          ].map(({ to, label }) => (
            <li key={to}>
              <Link
                to={to}
                className="text-blue-600 hover:text-blue-800 font-semibold transition"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Routes */}
      <div className="w-full max-w-4xl">
        <Routes>
          <Route path="/" element={<NewsFeed />} />
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
