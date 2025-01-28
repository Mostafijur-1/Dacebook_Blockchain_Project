require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.9",
  networks: {
    hardhat: {
      chainId: 1337,
    },
  },

  paths: {
    sources: "./contracts", // Make sure this is pointing to the correct contracts folder
    artifacts: "./client/src/artifacts", // Path for compiled artifacts
  },
};
