import { useState, useEffect } from "react";
import { ethers } from "ethers";

import Dacebook from "./artifacts/contracts/Dacebook.sol/Dacebook.json";
import { ToastContainer } from "react-toastify";
import HomePage from "./HomePage";

function App() {
  const [contractReadOnly, setContractReadOnly] = useState(null);
  const [contractWithSigner, setContractWithSigner] = useState(null);
  const [account, setAccount] = useState(null);

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
          const acc = await provider.send("eth_requestAccounts", []);
          setAccount(acc[0]);
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
        } catch (error) {
          console.error("Failed to connect to wallet:", error);
        }
      } else {
        console.error("MetaMask is not available");
      }
    };

    loadProvider();
  }, [account]);

  return (
    <>
      <HomePage
        contractReadOnly={contractReadOnly}
        contractWithSigner={contractWithSigner}
        account={account}
      />
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
