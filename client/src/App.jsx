import { useState, useEffect } from "react";
import { ethers } from "ethers";

import Upload from "./artifacts/contracts/Upload.sol/Upload.json";
import Messenger from "./artifacts/contracts/Messenger.sol/Messenger.json";
import HomePage from "./HomePage";

function App() {
  const [contractUploadReadOnly, setContractUploadReadOnly] = useState(null); // Read-only Upload contract
  const [contractUploadWithSigner, setContractUploadWithSigner] =
    useState(null); //Upload Contract with signer
  const [contractMessageReadOnly, setContractMessageReadOnly] = useState(null); // Contract message
  const [contractMessageWithSigner, setContractMessageWithSigner] =
    useState(null); // Contract message with signer

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
          // console.log(signer);
          // console.log(provider);
          const address = await signer.getAddress();
          // console.log("Connected account:", address);
          setAccount(address);

          const contractAddressUpload = import.meta.env
            .VITE_APP_CONTRACT_ADDRESS_UPLOAD;
          const contractAddressMessage = import.meta.env
            .VITE_APP_CONTRACT_ADDRESS_MESSENGER;

          // Read-only contract for calls
          const readOnlyContract = new ethers.Contract(
            contractAddressUpload,
            Upload.abi,
            provider
          );
          setContractUploadReadOnly(readOnlyContract);
          // console.log("readOnlyContractUpload", readOnlyContract);

          // Contract with signer for state-modifying functions
          const contractWithSigner = new ethers.Contract(
            contractAddressUpload,
            Upload.abi,
            signer
          );
          setContractUploadWithSigner(contractWithSigner);
          // console.log("contractWithSignerUpload", contractWithSigner);

          //contract for message Read only
          const contractMessageReadOnly = new ethers.Contract(
            contractAddressMessage,
            Messenger.abi,
            provider
          );
          setContractMessageReadOnly(contractMessageReadOnly);
          // console.log("contractMessageReadOnly", contractMessageReadOnly);
          //contract for message with signer
          const contractMessageWithSigner = new ethers.Contract(
            contractAddressMessage,
            Messenger.abi,
            signer
          );
          setContractMessageWithSigner(contractMessageWithSigner);
          // console.log("contractMessageWithSigner", contractMessageWithSigner);
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
        contractUploadReadOnly={contractUploadReadOnly}
        contractUploadWithSigner={contractUploadWithSigner}
        contractMessageReadOnly={contractMessageReadOnly}
        contractMessageWithSigner={contractMessageWithSigner}
        account={account}
      />
    </>
  );
}

export default App;
