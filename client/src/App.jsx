import { useState, useEffect } from "react";
import { ethers } from "ethers";

import Upload from "./artifacts/contracts/Upload.sol/Upload.json";
import HomePage from "./HomePage";

function App() {
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
          console.log(signer);
          console.log(provider);
          const address = await signer.getAddress();
          console.log("Connected account:", address);
          setAccount(address);

          const contractAddress = import.meta.env.VITE_APP_CONTRACT_ADDRESS;

          // Read-only contract for calls
          const readOnlyContract = new ethers.Contract(
            contractAddress,
            Upload.abi,
            provider
          );
          setReadOnlyContract(readOnlyContract);
          console.log(readOnlyContract);

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
    <>
      <HomePage
        readOnlyContract={readOnlyContract}
        contractWithSigner={contract}
        account={account}
      />
    </>
  );
}

export default App;
