import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { useCallback, useEffect, useState } from "react";
import RegisterUser from "./components/RegisterUser";
import Profile from "./components/Profile";
import Messenger from "./components/Messenger";
import SocialFeed from "./components/SocialFeed";
import Header from "./components/Header";
import Navigation from "./components/Navigation";

const HomePage = ({ contractReadOnly, contractWithSigner, account }) => {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const location = useLocation();

  /** Fetch user profile */
  const fetchUser = useCallback(async () => {
    if (!contractReadOnly || !account) return;
    try {
      setLoading(true);
      const fetchedUser = await contractReadOnly.getUserProfile(account);
      setUser(fetchedUser);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [contractReadOnly, account]);

  /** Fetch posts dynamically */
  const fetchPosts = useCallback(async () => {
    if (!contractReadOnly || !account) return;
    try {
      const fetchedPosts = await contractReadOnly.getPosts(account);
      setPosts(fetchedPosts);
    } catch (err) {
      console.error("Error fetching posts:", err);
    }
  }, [contractReadOnly, account]);

  useEffect(() => {
    fetchUser();
    fetchPosts();
    const interval = setInterval(fetchPosts, 10000); // Fetch new posts every 10 seconds
    return () => clearInterval(interval);
  }, [fetchUser, fetchPosts]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-indigo-600 font-medium">
            Loading your experience...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-5xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <Header account={account} user={user} />
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <Navigation user={user} currentPath={location.pathname} />
          </div>
          <div className="md:col-span-3">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
              <Routes>
                <Route
                  path="/register"
                  element={
                    !user?.name ? (
                      <RegisterUser contractWithSigner={contractWithSigner} />
                    ) : (
                      <Navigate to="/" replace />
                    )
                  }
                />
                <Route
                  path="/"
                  element={
                    user?.name ? (
                      <SocialFeed
                        contractWithSigner={contractWithSigner}
                        contractReadOnly={contractReadOnly}
                        posts={posts}
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
                    user?.name ? (
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
                    user?.name ? (
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
                <Route
                  path="*"
                  element={
                    <Navigate to={user?.name ? "/" : "/register"} replace />
                  }
                />
              </Routes>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/** Prop Validation */
HomePage.propTypes = {
  contractReadOnly: PropTypes.instanceOf(Object),
  contractWithSigner: PropTypes.instanceOf(Object),
  account: PropTypes.string,
};

export default HomePage;
