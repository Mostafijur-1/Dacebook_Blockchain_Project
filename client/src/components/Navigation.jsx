import PropTypes from "prop-types";
import { useMemo } from "react";
import { Link } from "react-router-dom";

const Navigation = ({ user, currentPath }) => {
  const links = useMemo(
    () => [
      { to: "/", label: "Home", icon: "🏠" },
      ...(!user?.name
        ? [{ to: "/register", label: "Register", icon: "✏️" }]
        : []),
      { to: "/profile", label: "Profile", icon: "👤" },
      { to: "/chat", label: "Chat", icon: "💬" },
    ],
    [user]
  );

  return (
    <nav className="bg-white rounded-xl shadow-md overflow-hidden sticky top-28 z-10">
      <div className="p-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <h3 className="font-medium">Main Navigation</h3>
      </div>
      <ul className="p-2">
        {links.map(({ to, label, icon }) => (
          <li key={to} className="mb-1 last:mb-0">
            <Link
              to={to}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                currentPath === to
                  ? "bg-indigo-50 text-indigo-600 font-medium"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              <span className="text-lg">{icon}</span>
              <span>{label}</span>
              {currentPath === to && (
                <span className="ml-auto w-1.5 h-5 bg-indigo-600 rounded-full"></span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

Navigation.propTypes = {
  user: PropTypes.instanceOf(Object),
  currentPath: PropTypes.string,
};

export default Navigation;
