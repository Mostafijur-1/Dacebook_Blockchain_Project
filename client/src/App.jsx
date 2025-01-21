import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ethers } from "ethers";

// import MessengerABI from "./artifacts/contracts/Messenger.sol/Messenger.json";
import Upload from "./artifacts/contracts/Upload.sol/Upload.json";
import Contacts from "./components/Contacts";
import Chat from "./components/Chat";
import FileUpload from "./components/FileUpload";
import Display from "./components/Display";
import AccessFile from "./components/AccessFile";
import AccessList from "./components/AccessList";

function App() {
  // States for messenger app
  const [user, setUser] = useState(null);
  const [selectedContact, setSelectedContact] = useState(null);

  // States for decentralized file sharing
  const [readOnlyContract, setReadOnlyContract] = useState(null); // Read-only contract
  const [contract, setContract] = useState(null); // Contract with signer
  const [account, setAccount] = useState(""); // User's account

  // Load Ethereum provider and contract details
  useEffect(() => {
    const loadProvider = async () => {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);

        window.ethereum.on("chainChanged", () => {
          console.log("Chain changed");
          window.location.reload();
        });

        window.ethereum.on("accountsChanged", () => {
          console.log("Account changed");
          window.location.reload();
        });

        try {
          await provider.send("eth_requestAccounts", []);
          const signer = await provider.getSigner();
          const address = await signer.getAddress();
          console.log("Connected account:", address);
          setAccount(address);
          setUser({ address });

          const contractAddress = import.meta.env.VITE_APP_CONTRACT_ADDRESS;

          // Read-only contract for calls
          const readOnlyContract = new ethers.Contract(
            contractAddress,
            Upload.abi,
            provider
          );
          setReadOnlyContract(readOnlyContract);

          // Contract with signer for state-modifying functions
          const contractWithSigner = new ethers.Contract(
            contractAddress,
            Upload.abi,
            signer
          );
          setContract(contractWithSigner);
        } catch (error) {
          console.error("Failed to connect to wallet:", error);
        }
      } else {
        console.error("MetaMask is not available");
      }
    };

    loadProvider();
  }, []);

  return (
    <Router>
      <Routes>
        {
          <Route
            path="/"
            element={
              <Contacts user={user} setSelectedContact={setSelectedContact} />
            }
          />
        }
        {
          <Route
            path="/chat"
            element={<Chat user={user} selectedContact={selectedContact} />}
          />
        }

        {/* Decentralized file-sharing components */}
        <Route
          path="/decentdrive"
          element={
            <div className="min-h-screen bg-gray-900 text-white">
              <header className="p-6 text-center">
                <h1 className="text-3xl font-bold">DecentDrive</h1>
                <p className="text-sm mt-2">Decentralized File Sharing</p>
              </header>

              <main className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
                <p style={{ color: "white" }}>
                  Account: {account ? account : "Not connected"}
                </p>
                <br />
                <FileUpload account={account} contract={contract} />
                {readOnlyContract && (
                  <Display contract={readOnlyContract} account={account} />
                )}
                {contract && (
                  <AccessFile contract={contract} account={account} />
                )}
                {readOnlyContract && (
                  <AccessList contract={readOnlyContract} account={account} />
                )}
              </main>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
