import { useState, useEffect } from "react";
import { ethers } from "ethers";

import Dacebook from "./artifacts/contracts/Dacebook.sol/Dacebook.json";
import HomePage from "./HomePage";

function App() {
  const [contractReadOnly, setContractReadOnly] = useState(null);
  const [contractWithSigner, setContractWithSigner] = useState(null);
  const [account, setAccount] = useState(null);

  useEffect(() => {
    const loadProvider = async () => {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        if (accounts.length > 0) {
          setAccount(accounts[0]); // Set the account immediately
        }
        // Handle account change
        window.ethereum.on("accountsChanged", (accounts) => {
          setAccount(accounts[0]);
        });

        // Handle network change
        window.ethereum.on("chainChanged", (chainId) => {
          console.log(`Chain changed to ${chainId}`);
        });

        try {
          const network = await provider.getNetwork();
          console.log("Connected to network:", network);
        } catch (error) {
          console.error("Failed to get network:", error);
        }

        try {
          await provider.send("eth_requestAccounts", []);

          const signer = await provider.getSigner();
          const contractAddress = import.meta.env.VITE_APP_CONTRACT_ADDRESS;

          const readOnlyContract = new ethers.Contract(
            contractAddress,
            Dacebook.abi,
            provider
          );

          setContractReadOnly(readOnlyContract);

          const contractWithSigner = new ethers.Contract(
            contractAddress,
            Dacebook.abi,
            signer
          );
          setContractWithSigner(contractWithSigner);
          // console.log(readOnlyContract);
          // console.log(contractWithSigner);
          
        } catch (error) {
          console.error("Failed to connect to wallet:", error);
        }
      } else {
        console.error("MetaMask is not available");
      }
    };

    loadProvider();
  }, []);
  if (!contractReadOnly || !contractWithSigner || !account) {
    return <div>Loading...</div>;
  }
  // console.log(contractReadOnly, contractWithSigner);
  
  return (
    <HomePage
      contractReadOnly={contractReadOnly}
      contractWithSigner={contractWithSigner}
      account={account}
    />
  );
}

export default App;
