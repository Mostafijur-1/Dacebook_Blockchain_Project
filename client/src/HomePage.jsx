import { Routes, Route, Link } from "react-router-dom";
import PropTypes from "prop-types";
import RegisterUser from "./components/RegisterUser";
import Profile from "./components/Profile";
import Messenger from "./components/Messenger";
import SocialFeed from "./components/SocialFeed";
import { useCallback, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const HomePage = ({ contractReadOnly, contractWithSigner, account }) => {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  const [showContent, setShowContent] = useState(false); // State for delayed loading

  // Fetch posts from the smart contract
  const fetchPosts = useCallback(async () => {
    if (!contractReadOnly || !account) return;
    setLoading(true);
    try {
      const fetchedPosts = await contractReadOnly.getPosts(account);
      setPosts(fetchedPosts);
      console.log("Fetched posts:", fetchedPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  }, [contractReadOnly, account]);

  // Fetch user from the smart contract
  const fetchUser = useCallback(async () => {
    if (!contractReadOnly || !account) return;
    setLoading(true);
    try {
      const fetchedUser = await contractReadOnly.getUserProfile(account);
      setUser(fetchedUser);
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      setLoading(false);
    }
  }, [contractReadOnly, account]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  useEffect(() => {
    // Delay rendering by 500ms
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 500);

    return () => clearTimeout(timer); // Cleanup function
  }, []);

  if (!showContent) {
    return <p className="text-center mt-10 text-gray-600">Loading...</p>; // Placeholder before loading content
  }

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
            {account ? user.name : "Not connected"}
          </span>
        </p>
      </header>

      {/* Navigation */}
      <nav className="mb-6 bg-gray-100 p-3 rounded-lg shadow">
        <ul className="flex space-x-6">
          {[
            { to: "/", label: "Home" },
            ...(!user.name ? [{ to: "/register", label: "Register" }] : []),
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
          {/* Only allow access to Register if user is not registered */}
          <Route
            path="/register"
            element={
              !user.name ? (
                <RegisterUser contractWithSigner={contractWithSigner} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />

          {/* Restrict all other routes unless the user is registered */}
          <Route
            path="/"
            element={
              user.name ? (
                <SocialFeed
                  contractWithSigner={contractWithSigner}
                  contractReadOnly={contractReadOnly}
                  posts={posts}
                  loading={loading}
                  user={user}
                />
              ) : (
                <Navigate to="/register" replace />
              )
            }
          />

          <Route
            path="/profile"
            element={
              user.name ? (
                <Profile
                  contractReadOnly={contractReadOnly}
                  contractWithSigner={contractWithSigner}
                  user={user}
                />
              ) : (
                <Navigate to="/register" replace />
              )
            }
          />

          <Route
            path="/chat"
            element={
              user.name ? (
                <Messenger
                  contractReadOnly={contractReadOnly}
                  contractWithSigner={contractWithSigner}
                  account={account}
                />
              ) : (
                <Navigate to="/register" replace />
              )
            }
          />

          {/* Catch-all route to redirect unregistered users to /register */}
          <Route
            path="*"
            element={<Navigate to={user.name ? "/" : "/register"} replace />}
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
