import Upload from "./artifacts/contracts/Upload.sol/Upload.json";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import FileUpload from "./components/FileUpload";
import Display from "./components/Display";
import Modal from "./components/Modal";
import AccessFile from "./components/AccessFile";
import "./App.css";

function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [contract, setContract] = useState(null); // Assuming we're dealing with a contract
  const [account, setAccount] = useState(""); // Store user's account info
  const [provider, setProvider] = useState(null);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="p-6 text-center">
        <h1 className="text-3xl font-bold">DecentDrive</h1>
        <p className="text-sm mt-2">Decentralized File Sharing</p>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
        <FileUpload />
        <Display />
        <AccessFile contract={contract} account={account} />
      </main>

      {modalOpen && <Modal setModalOpen={setModalOpen} />}

      <footer className="p-6 text-center">
        <button
          className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700"
          onClick={() => setModalOpen(true)}
        >
          Share
        </button>
      </footer>
    </div>
  );
}

export default App;
