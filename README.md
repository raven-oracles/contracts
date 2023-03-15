### The Raven oracles contracts

The Raven is a platform for creating and distributing oracles. The Raven enables oracle creators to promoute and monitise their oracle.

The repostiory is an implementation of contracts for The Raven oracles.

Standard setup for the oracle is inspired by current jetton model and is following:
**1. Oracle Master**
This is the main contract that is an initial point of contact for the oracle user. It processes `op:signup` command and deploys an Oracle Client contract.
**2. Oracle Client**
All the major interaction of oracle user with the oracle are going through the Oracle Client contract. This contract holds the most recent values.

Main components of Raven ecosystem:

Easy to use js library for your Nodejs server to send updates on your oracle master smart contract Network of shared smart contracts on FunC Front-end application for easy deployment of new oracle master smart contract & easy communication with deployed contracts Our backend application that connects the library and front-end Everything is opendorsed, so you can review each component of the ecosystem on potential security issues

Remember, this is a pre-alpha product

How does it work?

Everyone can deploy his own oracle master smart contract via our front-end application. After that, the “owner” of the new contract needs to set up “worker” on his server with our js library. The worker will push new updated prices (or other web2 info) to the master smart contract. Now “owner” will have a smart contract inside TON with actual and updated data in the storage. At this point, every other 3rd party smart contract will be able to “signup” for updates from a master smart contract. Signup will deploy a middleware smart contract with whom the client will interact. This part is really important because with such approach we reach paradigm of sharded smartonctracts (one contract will be deployed for each user, the same way as jetton wallets work).

Fees and payments:

There is two option of paying fees to the “owner” from the “client” for new data updates on the client`s smart contract: the first one - is ondemant (fees needed to be paid for each data fetch / your smart contract need to trigger data fetching process); second one - subscription model (new updates will be received on “client smart contract” automatically but “client” will be charged for fees each period of time).

Also, id like to notice that our main product - is smart contracts, you can interact with them without using our js lib / our fe app and etc

(subscription)[https://github.com/raven-oracles/contracts/blob/master/pics/1.png?raw=true]
(ondemant)[https://github.com/raven-oracle/contracts/blob/main/pics/1.png?raw=true]
