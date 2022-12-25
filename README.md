### The Raven oracles contracts

The Raven is a platform for creating and distributing oracles. The Raven enables oracle creators to promoute and monitise their oracle.

The repostiory is an implementation of contracts for The Raven oracles.

Standard setup for the oracle is inspired by current jetton model and is following:
**1. Oracle Master**
This is the main contract that is an initial point of contact for the oracle user. It processes `op:signup` command and deploys an Oracle Client contract.
**2. Oracle Client**
All the major interaction of oracle user with the oracle are going through the Oracle Client contract. This contract holds the most recent values.

**Ideas:**

- Enable users to create own custom oracles with combined sources of data (in order ot optimise the costs in case multiple sources of data are required).
