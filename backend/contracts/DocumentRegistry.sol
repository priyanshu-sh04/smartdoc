// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract DocumentRegistry {
    mapping(bytes32 => bool) private documents;
    mapping(bytes32 => string) private ipfsHashes;
    
    event DocumentRegistered(bytes32 indexed documentHash, string ipfsHash);
    
    function registerDocument(bytes32 documentHash, string memory ipfsHash) public {
        require(!documents[documentHash], "Document already registered");
        documents[documentHash] = true;
        ipfsHashes[documentHash] = ipfsHash;
        emit DocumentRegistered(documentHash, ipfsHash);
    }
    
    function verifyDocument(bytes32 documentHash) public view returns (bool) {
        return documents[documentHash];
    }
}