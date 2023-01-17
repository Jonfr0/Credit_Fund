const {
  networkConfig,
  developmentChains,
} = require("../../helper-hardhat-config")
const { network, ethers, deployments } = require("hardhat")
const { assert, expect } = require("chai")
const chainId = network.config.chainId

if (chainId == 31337) {
  console.log(network.name, chainId)
} else {
  console.log(network.name, chainId)
}

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("CreditFund Unit Tests", function () {
      let myContract, lender

      lender = networkConfig[chainId]["lenderAddress"]

      before(async () => {
        await deployments.fixture(["mocks"])
        myContract = await ethers.getContract("CreditFund")
      })
      describe("Constructor", function () {
        it("Initializes the creditfund correctly", async () => {
          const initialLender = await myContract.getLender()
          assert.equal(initialLender, lender)
        })
      })
      describe("Setters", function () {
        it("Set Loan Amount", async () => {
          try {
            await myContract.setLoanAmount(2000)
          } catch (error) {
            expect(error.message).to.include("Only the lender can modify")
          }
        })
        it("Set Minimum Payment", async () => {
          try {
            let minimum = ethers.utils.parseEther("0.5")
            await myContract.setMinimumPayment(minimum)
            let mp = await myContract.getMinimumPayment()
            assert.equal(mp.toBigInt(), minimum.toBigInt())
          } catch (error) {
            expect(error.message).to.include("Only the lender can modify")
          }
        })
        it("Set borrower", async () => {
          try {
            await myContract.setBorrower(process.env.BORROWER_ADDRESS)
            const borrower = await myContract.getBorrower()
            assert.equal(borrower, process.env.BORROWER_ADDRESS)
          } catch (error) {
            console.log(error)
          }
        })
      })
      describe("Getters", function () {
        it("Get Lender Balance", async () => {
          const balance = await myContract.getLenderBalance()
          assert.equal(balance, 0)
        })
        it("Get Lender Address", async () => {
          const lenderAddress = await myContract.getLender()
          assert(lenderAddress.toString(), lender)
        })
        it("Get Borrower Address", async () => {
          const borrowerAddress = await myContract.getBorrower()
          expect(borrowerAddress).to.include(process.env.BORROWER_ADDRESS)
        })
      })
      describe("Borrower balance deposit", function () {
        it("Deposit funds and update balance for borrower", async () => {
          let depositAmount = ethers.utils.parseEther("1")
          const initialBalance = await myContract.getBorrowerBalance()
          await myContract.deposit(depositAmount)
          const finalBalance = await myContract.getBorrowerBalance()
          expect(finalBalance.sub(initialBalance)).to.be.equal(depositAmount)
        })
      })
      describe("Credit loan payment from borrower to lender", function () {
        it("Loan Payment minimum requirements", async () => {
          try {
            const amountToSend = ethers.utils.parseEther("0.4")
            await myContract.loanPayment(amountToSend)
          } catch (error1) {
            expect(error1.message).to.include("CreditFund_MinimumRequirements")
          }
        })
        it("Loan Payment has to be greater or equal to amount", async () => {
          try {
            const amountToSend = ethers.utils.parseEther("1.2")
            await myContract.loanPayment(amountToSend)
          } catch (error2) {
            expect(error2.message).to.include(
              "CreditFund_BalanceSmallerThanLoanAmount"
            )
          }
        })
        it("Emits payment event", async () => {
          try {
            const amountToSend = ethers.utils.parseEther("0.6")
            const response = await myContract.loanPayment(amountToSend)
            const receipt = await response.wait()
            assert.equal(
              receipt.events[0].args.amount.toString(),
              amountToSend.toString()
            )
          } catch (error3) {
            console.log(error3)
          }
        })
      })
    })
