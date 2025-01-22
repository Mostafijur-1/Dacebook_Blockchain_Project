import { Routes, Route, Link } from "react-router-dom";
import { ethers } from "ethers";
import PropTypes from "prop-types";

import Display from "./components/Display";
import FileUpload from "./components/FileUpload";
import Test from "./components/Test";
import Chat from "./components/Chat";
const HomePage = ({ contractWithSigner, account }) => {
  return (
    <div className="justify-center items-center flex flex-col gap-10">
      <div className="">
        <header className="p-6 text-center">
          <h1 className="text-3xl font-bold">Decent DriveChat</h1>
          <p className="text-sm mt-2">
            Decentralized File Sharing and chatting Application
          </p>
        </header>
        <p>Account: {account ? account : "Not connected"}</p>
      </div>
      <div>
        {/* Navigation Links */}
        <nav className="mb-6">
          <ul className="flex space-x-4">
            <li>
              <Link to="/" className="text-blue-500 hover:underline">
                Home
              </Link>
            </li>
            <li>
              <Link to="/test" className="text-blue-500 hover:underline">
                Test
              </Link>
            </li>
            <li>
              <Link to="/chat" className="text-blue-500 hover:underline">
                Chat
              </Link>
            </li>
            <li>
              <Link to="/display" className="text-blue-500 hover:underline">
                See Files
              </Link>
            </li>
            <li>
              <Link to="/upload" className="text-blue-500 hover:underline">
                UploadFile
              </Link>
            </li>
          </ul>
        </nav>

        {/* Route Definitions */}
        <Routes>
          <Route path="/" element={<h1>Welcome to the Home Page!</h1>} />
          <Route path="/test" element={<Test />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/display" element={<Display />} />
          <Route
            path="/upload"
            element={
              <FileUpload contract={contractWithSigner} account={account} />
            }
          />
        </Routes>
      </div>
    </div>
  );
};

export default HomePage;

HomePage.propTypes = {
  readOnlyContract: PropTypes.instanceOf(ethers.Contract),
  contractWithSigner: PropTypes.instanceOf(ethers.Contract),
  account: PropTypes.string.isRequired,
};
