# Credit Fund

This is a simulation of what a Private Credit firm would look like using the Ethereum blockchain. At this moment it is missing some features but I will upgrade it in the future once I go into Aave protocols and DeFi.

The Smart Contract allows different functions depending on the user (lender or borrower). Currently, there is not liquidation or default implementation that returns funds to lender if borrower is unable to pay back.

## Implementation
How to run the program:
```
yarn init -y
yarn hardhat compile
yarn hardhat deploy
yarn hardhat test
```

If you want to test it use the `localhost` if you don't want to spend any testnet ETH.
