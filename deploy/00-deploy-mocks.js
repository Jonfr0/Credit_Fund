const { network } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()

  const chainId = network.config.chainId
  const lender = process.env.LENDER_ADDRESS
  const args = [lender]

  if (developmentChains.includes(network.name)) {
    log("Local network detected! Deploying mocks...")
  }

  const creditfund = await deploy("CreditFund", {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: 1,
  })

  log("--------------------------------------------------")
}

module.exports.tags = ["mocks"]
