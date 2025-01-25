import { Routes, Route, Link } from "react-router-dom";
import { ethers } from "ethers";
import PropTypes from "prop-types";

import Display from "./components/Display";
import FileUpload from "./components/FileUpload";
import Chat from "./components/Chat";
import Register from "./components/Register";
const HomePage = ({
  contractUploadReadOnly,
  contractUploadWithSigner,
  contractMessageReadOnly,
  contractMessageWithSigner,
  account,
}) => {
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
              <Link to="/register" className="text-blue-500 hover:underline">
                Register
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
          <Route
            path="/register"
            element={
              <Register
                contractWithSigner={contractMessageWithSigner}
                account={account}
              />
            }
          />
          <Route
            path="/chat"
            element={
              <Chat
                contractReadOnly={contractMessageReadOnly}
                contractWithSigner={contractMessageWithSigner}
                account={account}
              />
            }
          />
          <Route
            path="/display"
            element={
              <Display contract={contractUploadReadOnly} account={account} />
            }
          />
          <Route
            path="/upload"
            element={
              <FileUpload
                contract={contractUploadWithSigner}
                account={account}
              />
            }
          />
        </Routes>
      </div>
    </div>
  );
};

export default HomePage;

HomePage.propTypes = {
  contractUploadReadOnly: PropTypes.instanceOf(ethers.Contract),
  contractUploadWithSigner: PropTypes.instanceOf(ethers.Contract),
  contractMessageReadOnly: PropTypes.instanceOf(ethers.Contract),
  contractMessageWithSigner: PropTypes.instanceOf(ethers.Contract),
  account: PropTypes.string.isRequired,
};
