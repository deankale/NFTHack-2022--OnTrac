//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {SuperAccountabilityX} from "./SuperAccountabilityX.sol";

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "hardhat/console.sol";

contract SuperAccountabilityNFT is ERC721URIStorage {
    SuperAccountabilityX public superAccountabilityX;
    string constant ape1 =
        "ipfs://Qme5CsX2XstGbN2ziqziKt8BdyqSYcZCJwHescLxmSDzyg";
    string constant ape2 =
        "ipfs://QmPh8szfUV6XkiueMFe9gYCF3WMj5hHwaiCobpMuxXPA3d";
    string constant ape3 =
        "ipfs://QmWk4h4tHVU94ZrZuKGnQdPr7sydh7sT7hgkcmrrUhyNYR";
    string constant ape4 =
        "ipfs://QmU4X3FFN2qsKBXr8L2nhdt1ZUoDo7m5QDHbd6rYpmTEja";
    string constant ape5 =
        "ipfs://QmPKDSGxdGaKEE2xF9MvQUkGeYqNJH6S8kXfu5fDBtVWW9";
    string[6] tokenURIs = [ape1, ape2, ape3, ape4, ape5];
    event NFTMinted(uint256 _taskId);
    mapping(uint256 => bool) private isMinted;
    mapping(address => uint256) private tasksCompleted;

    constructor(
        string memory _name,
        string memory _symbol,
        SuperAccountabilityX _superAccountabilityX
    ) ERC721(_name, _symbol) {
        superAccountabilityX = _superAccountabilityX;
    }

    /**************************************************************************
     * NFT Minting/Updating Logic
     *************************************************************************/
    function mintNFT(uint256 _taskId) external {
        (
            ,
            ,
            ,
            address sender,
            ,
            ,
            SuperAccountabilityX.TaskStatus status,
            ,
            ,

        ) = superAccountabilityX.tasks(_taskId);
        require(sender == msg.sender, "only sender to _taskId cant mint");
        require(
            status == SuperAccountabilityX.TaskStatus.FINISHED,
            "Task not finished or NFT already minted"
        );
        require(!isMinted[_taskId], "already minted");
        uint256 apeId = tasksCompleted[msg.sender] % 5;
        tasksCompleted[msg.sender]++;
        isMinted[_taskId] = true;
        string memory tokenURI = tokenURIs[apeId];
        emit NFTMinted(_taskId);
        // mint NFT
        _safeMint(msg.sender, _taskId);
        _setTokenURI(_taskId, tokenURI);
    }
}
