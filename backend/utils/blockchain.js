import { ethers } from 'ethers';
import 'dotenv/config';

const provider = new ethers.JsonRpcProvider(process.env.ETHEREUM_RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const documentRegistryABI = [
  "function registerDocument(bytes32 documentHash, string memory ipfsHash) public",
  "function verifyDocument(bytes32 documentHash) public view returns (bool)",
];

const contractAddress = process.env.REGISTRY_CONTRACT_ADDRESS;
const contract = new ethers.Contract(contractAddress, documentRegistryABI, wallet);

export const registerDocumentOnChain = async (documentHash, ipfsHash) => {
  try {
    const tx = await contract.registerDocument(documentHash, ipfsHash);
    await tx.wait();
    return tx.hash;
  } catch (error) {
    throw new Error(`Blockchain registration failed: ${error.message}`);
  }
};

export const verifyDocumentOnChain = async (documentHash) => {
  try {
    return await contract.verifyDocument(documentHash);
  } catch (error) {
    throw new Error(`Blockchain verification failed: ${error.message}`);
  }
};