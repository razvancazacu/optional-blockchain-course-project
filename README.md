[Digital Identity](https://www.blockchain-council.org/blockchain/top-10-promising-blockchain-use-cases/)

Today, digital identity is becoming problematic as centralized entities are becoming increasingly susceptible to identity thefts and data breaches. Ownership is concentrated in the hands of applications and services to which we provide consent to use our data. Digital identity can be described as an online record of information pertaining to individuals and organizations.

In a blockchain, users can have control over their information. Instead of providing consent to many service providers, users can store their digital identity data in an encrypted digital hub. Individuals can control access to the hub and can also revoke access, if necessary. Using blockchain technology, the user can be in control of their digital data and the way in which it is utilized.

Smart Contracts 
- are written in solidity
- the code is deployed on blockchain
- it behaves like a microservices

DAps are Decentralized applications
- peer to peer
- data and code are shared


Resources:
- Node.js (for node packet manager - npm)
- Truffle (creating daps, testing, deploying to blockchain, dev client side applications)
- Ganache (local blockchain)
- MetaMask (extension for google chrome)
- React.js
- web3.js
- truffle-contract

Console Debugging
- Getting an contract instance in "truffle console"
MyContract.deployed().then((instance) => { app = instance } ) 
- Getting a claim member of the map
app.claim(1).then((instance) => { claim = instance} )
claim[0] // topic of the claim
- Access to current accounts address
web3.eth.getAccounts()

Deploying contracts costs GAS ( Write to the blockchain costs gas, Reading from the blockchain is free)
This is why test are important for no losing ether
# optional-blockchain-course-project
