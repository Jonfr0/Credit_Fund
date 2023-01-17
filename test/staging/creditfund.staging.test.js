const { expect, assert } = require("chai")
const { ethers } = require("hardhat")
const {
  networkConfig,
  developmentChains,
} = require("../../helper-hardhat-config")

const chainId = network.config.chainId

developmentChains.includes(network.name)
  ? describe.skip
  : describe("CreditFund Staging Tests", function () {
      let myContract, lender

      lender = networkConfig[chainId]["lenderAddress"]

      before(async () => {
        await deployments.fixture(["creditfund"])
        myContract = await ethers.getContract("CreditFund")
      })
      describe("Constructor", function () {
        it("Initializes the creditfund correctly", async () => {
          const initialLender = await myContract.getLender()
          assert.equal(initialLender, lender)
        })
        it("Set Minimum Payment", async () => {
          try {
            let minimum = ethers.utils.parseEther("0.5")
            await myContract.setMinimumPayment(minimum)
            let mp = await myContract.getMinimumPayment()
            setInterval(() => {
              assert.equal(mp.toBigInt(), minimum.toBigInt())
            }, 1000)
          } catch (error) {
            expect(error.message).to.include("Only the lender can modify")
          }
        })
      })
    })
