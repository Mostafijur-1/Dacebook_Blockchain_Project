import { Routes, Route, Link } from "react-router-dom";
import PropTypes from "prop-types";
import RegisterUser from "./components/RegisterUser";
import Profile from "./components/Profile";
import Messenger from "./components/Messenger";
import SocialFeed from "./components/SocialFeed";
import { useCallback, useEffect, useState } from "react";

const HomePage = ({ contractReadOnly, contractWithSigner, account }) => {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);

  // Fetch posts from the smart contract
  const fetchPosts = useCallback(async () => {
    if (!contractReadOnly || !account) return;
    setLoading(true);
    try {
      console.log(account);
      const fetchedPosts = await contractReadOnly.getPosts(account);

      setPosts(fetchedPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
      console.log("Failed to fetch posts. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [contractReadOnly, account]);

  // Fetch user from the smart contract
  const fetchUser = useCallback(async () => {
    if (!contractReadOnly || !account) return;
    setLoading(true);
    try {
      console.log(account);
      const fetchedUser = await contractReadOnly.getUserProfile(account);

      setUser(fetchedUser);
    } catch (error) {
      console.error("Error fetching user:", error);
      console.log("Failed to fetch user. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [contractReadOnly, account]);

  useEffect(() => {
    fetchPosts();
    fetchUser();
  }, [fetchPosts, fetchUser]);

  console.log(user.profilePic);

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
          <Route
            path="/"
            element={
              <SocialFeed
                contractWithSigner={contractWithSigner}
                contractReadOnly={contractReadOnly}
                account={account}
                posts={posts}
                loading={loading}
              />
            }
          />
          <Route
            path="/register"
            element={<RegisterUser contractWithSigner={contractWithSigner} />}
          />
          <Route
            path="/profile"
            element={
              <Profile
                contractReadOnly={contractReadOnly}
                contractWithSigner={contractWithSigner}
                user={user}
              />
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
