import Upload from "./artifacts/contracts/Upload.sol/Upload.json";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import FileUpload from "./components/FileUpload";
import Display from "./components/Display";
import AccessFile from "./components/AccessFile";
import AccessList from "./components/AccessList";

function App() {
  const [readOnlyContract, setReadOnlyContract] = useState(null); // Read-only contract
  const [contract, setContract] = useState(null); // Contract with signer
  const [account, setAccount] = useState(""); // User's account

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

          const contractAddress = import.meta.env.VITE_APP_CONTRACT_ADDRESS;

          // Read-only contract for calls (like display and shareAccess)
          const readOnlyContract = new ethers.Contract(
            contractAddress,
            Upload.abi,
            provider
          );
          setReadOnlyContract(readOnlyContract);

          // Contract with signer for state-modifying functions (like add, allow, disallow)
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
        {contract && <AccessFile contract={contract} account={account} />}
        {readOnlyContract && (
          <AccessList contract={readOnlyContract} account={account} />
        )}
      </main>
    </div>
  );
}

export default App;
