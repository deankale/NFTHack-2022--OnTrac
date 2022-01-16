# NFTHack-2022--OnTrac
this is the official ETHGlobal NFTHackathon 2022 submission for our project "OnTrac"



# TL;DR How it Works:
1. User initiates a task to complete, connects their wallet address + the address of a trusted partner
2. User picks a deadline and a max price (in crypto-tokens) they are willing to lose if they fail
3. With the help of [SuperFluid](https://www.superfluid.finance/home)'s SDK will stream money using SuperFluid from User's wallet into a vault at a steady rate until the deadline hits
4. If they pass, they get their money back and a minted NFT, if they give up early or fail to complete, the money moves from the vault into their trusted partner's wallet and they get no NFT.
5. OnTrac has potential to restructure independent learning online, freelance work agreements, and promote a culture of self-improvement backed by science and code.


# OnTrac's Vision
Why do most New Year's Resolutions fail? 
Why is it easier to go to the gym with a friend than it is by yourself? 
Why do we fantasize of doing things that we KNOW will improve our lives, but simply never get started on them? 

Behavioural science shows us that it's NOT because we are lazy or don't care about our futures, it's because we lack a system of accountability, consequences, and rewards.

NFTs, tokenomics and web3 Dapps have revolutionized value systems in our increasingly digital-focused world. The team at OnTrac embraces the expanding culture around NFT-sharing and community driven art collecting, however, we also wanted to explore how NFTs could be not just digital art, but digital accolades.

It all begins with a fulfilling task. 

For example: 
Arjun dislikes his job, but he hates updating his resume even more. Arjun has been putting off doing that for weeks now, however he won't get a new job unless he updates his resume. Arjun needs a plan and someone to hold him accountable to the task. 

Arjun logs onto OnTrac and gives the Dapp his wallet address plus the address of his trustworthy friend Bara. Andy specifies what his task is, what it takes to complete the task, his deadline, and the amount of cryptocurrency he is willing to lose if he doesn't complete the task in time. Behind the scenes, a smart contract will stream money out of Arjun's wallet and into a vault at a set flow rate until the deadline is reached. 

Now Arjun feels a sense of urgency to get this task done quickly! If Arjun doesn't complete the task by the deadline, or if he chooses to give up, the money will move from the vault into Bara's wallet address.

If Arjun completes the task, it is reviewed by his partner Bara. If Bara agrees that the task is finished, the vault money moves back into Arjun's wallet. As a reward for finishing the task, the Dapp will mint him his own exclusive NFT. These NFT rewards will be crucial to the OnTrac culture, as OnTrac users can show off their "Trophy rooms" of NFTs!

We have also implemented a 3rd party "Judge" that is optional. The Judge is an extra layer of verification; it can be a real person or it can be a contract writing it's own custom logic. This opens up a wealth of possibilities for creating a more trustless system, as online organizations that provide certifications (Coursera, Udemy) can integrate their API's into the Judge contract and set their own rules and their own NFT rewards.

# The Future of OnTrac
Not only is this app a novel way for people to collect NFT's, it promotes a culture of well-being and accountability for users of all ages and lifestyles. 

Additionally, this can become a new form of payment system adopted by online educational tools such as Coursera and Udemy, who currently use subscription-based or one-time-payment models. New "Web 3 tools" allow developers to get far more granular and sophisticated with the logic behind digital agreements than subscription-based models can. OnTrac is the first of it's kind to prove this.

# How it's made

Frontend:

The frontend was built with React, TailwindCSS, and Ethers.js. The ability to connect your wallet to the DApp was made possible with the Web3Modal library. There are three main components to the frontend, the Doer Dashboard, the Viewer Dashboard, and the NFTs dashboard. The Doer Dashboard allows users to create new tasks or view the most recent task they've created. If they decide to create a task, they are brought to a multi-page form where they can input all the details about the task. This is also where smart contract interactions are made so the user can spend their USDC and create a stream using the Superfluid SDK. Once a task is created, it is shown on the Doer Dashboard along with information such as the title, partner address, the amount flowed so far, the reward status, and an option to abandon the task. All of this data is retrieved directly from our smart contract with the use of the Ethers.js library. The viewer dashboard displays a list of task details for receivers/judges. It also allows them to either approve a task once it is complete or expire a task if it expires. The NFTs dashboard is for users to view all of the NFTs they've earned from the protocol. The NFTs are retrieved using the Moralis API and filtered to only show the ones that belong to our smart contract. The more tasks a user completes, the more NFTs they earn.

Front end is deployed on Fleek : https://proud-bar-7328.on.fleek.co/

Backend:

Our protocol relies on Superfluid for money streaming, the smart contract inherits from Superfluid libraries and our contract is a SuperApp. a Task is a struct consisting of different parameters : name, description, user, partner, judge, status, flow rate, expiration date. To initiate a task user call the function createTask that creates a task inside the smart contract with different parameters, then the user need to start a money stream to the contract ( this has to be done separately due to how Superfluid money streaming works) , once the contract receives the money stream it reacts and update the state of the task. Then the user has to finish his task and be approved by the judge. Once approved, user A receives his money back and can mint an accomplishment NFT from the NFT contract. This architecture leaves the door open to anyone wanting to build on our Dapp by deploying a contract where they can be the judge, this can be for example an educational platform like Coursera or Udemy, that let users start a stream of money to the contract and only award certification among completion of the task. Note that the judge can be a custom smart contract with its own logic as long as it can call the approve function in our contract, this way the concept can be taken further ahead and be fully automated, you can also have your partner be your judge which we used for demo.

In the case the user A stops stream or abandon task or the deadline is expired, the money received from the stream is sent back to the accountability partner.

The NFT contract is linked to the Accountability contract, and let user mint the NFT only if his task is finished. For the purpose of the hackathon we already created a sample collection of NFTs and uploaded them on IPFS in a static way, but the idea is to take this further and create a custom NFT for user and Task : taking a base image + adding user and task data creating the image on the backend then uploading to ipfs, then sending tokenURI to contract for the NFT mint, each platform building on us can customise the NFT contract and NFT minting process to suit its needs as the Accountability and NFT contract are separate and you only need the NFT contract pointing to the Accountability contract for knowing whether user finished task or not. We separated the two contracts for 2 reasons : importing all the superfluid libraries is heavy and we reach contract max size quickly when combining it with NFT minting logic, and also we found it more convenient to have separate contracts and a modular architecture.

The objectif is to gamify and make task completions fun, the minimum flowrate required is only 1$ per month to start a task and we assume users are only gonna stream low amounts, e.g maybe you lose 10$ if you dont make your CV but even if the amount is low it will motivate you to complete your task and complete it quickly especially when you see the money going out of your wallet continuously. We want to leverage the psychological factor and motivate people to finish tasks and have fun in the same time.




