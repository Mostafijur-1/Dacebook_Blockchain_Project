const hre = require("hardhat");

async function main() {
  // Deploy Upload contract
  const Upload = await hre.ethers.getContractFactory("Upload");
  const upload = await Upload.deploy();
  await upload.waitForDeployment();
  console.log("Upload contract deployed to:", upload.target);

  // Deploy Messenger contract
  const Messenger = await hre.ethers.getContractFactory("Messenger");
  const messenger = await Messenger.deploy();
  await messenger.waitForDeployment();
  console.log("Messenger contract deployed to:", messenger.target);

  // Optional: Save the deployed contract addresses to a file
  const fs = require("fs");
  const deployedContracts = {
    Upload: upload.target,
    Messenger: messenger.target,
  };

  fs.writeFileSync(
    "deployedContracts.json",
    JSON.stringify(deployedContracts, null, 2)
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
