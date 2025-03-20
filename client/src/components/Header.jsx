import PropTypes from "prop-types";

const Header = ({ account, user }) => (
  <header className="bg-white rounded-xl shadow-md overflow-hidden sticky top-0 z-10">
    <div className="px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Dacebook
          </h1>
          <p className="text-slate-500 text-sm">
            A Decentralized Private Social App
          </p>
        </div>
        <div className="bg-slate-50 rounded-lg px-4 py-2 border border-slate-100">
          <div className="text-xs text-slate-500 mb-1">CONNECTED AS</div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-green-400"></div>
            <span className="font-medium text-slate-700 truncate max-w-[200px]">
              {account ? user?.name || "Anonymous" : "Not connected"}
            </span>
          </div>
        </div>
      </div>
    </div>
  </header>
);

Header.propTypes = {
  account: PropTypes.string,
  user: PropTypes.instanceOf(Object),
};

export default Header;
