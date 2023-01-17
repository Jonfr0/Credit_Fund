const { ethers, hardhatArguments } = require("hardhat")

const networkConfig = {
  5: {
    name: "goerli",
    lenderAddress: process.env.LENDER_ADDRESS.toString(),
  },
  31337: {
    name: "hardhat",
    lenderAddress: process.env.LENDER_ADDRESS.toString(),
  },
}

const developmentChains = ["hardhat", "localhost"]

module.exports = {
  networkConfig,
  developmentChains,
}
