const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const { network, ethers } = require("hardhat")
const { verify } = require("../utils/verify")

module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()
  const chainId = network.config.chainId
  log(network.name, chainId)
  const lender = networkConfig[chainId]["lenderAddress"]
  const args = [lender]

  if (chainId == 5) {
    console.log("Goerli netowork detected! Deploying contract")
  }

  const creditfund = await deploy("CreditFund", {
    from: deployer,
    log: true,
    args: args,
    waitConfirmations: network.config.blockConfirmations,
  })

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    log("Verifying...")
    await verify(creditfund.address, args)
  }

  log("--------------------------------------------------")
}

module.exports.tags = ["all", "creditfund"]
