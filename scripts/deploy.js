const hre = require("hardhat");

async function main() {
  // Deploy Upload contract
  const Dacebook = await hre.ethers.getContractFactory("Dacebook");
  const dacebook = await Dacebook.deploy();
  await dacebook.waitForDeployment();
  console.log("Dacebook contract deployed to:", dacebook.target);

  // Optional: Save the deployed contract addresses to a file
  const fs = require("fs");
  const deployedContracts = {
    Dacebook: dacebook.target,
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
