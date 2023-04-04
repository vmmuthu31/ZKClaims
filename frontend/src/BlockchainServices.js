import Web3 from "web3";
import Claims from "../src/components/claims.json";
import { ethers } from "ethers";

const isBrowser = () => typeof window !== "undefined"; //The approach recommended by Next.js
const { ethereum } = isBrowser();
if (ethereum) {
  isBrowser().web3 = new Web3(ethereum);
  isBrowser().web3 = new Web3(isBrowser().web3.currentProvider);
}

// Define Contracts address
const MINT_CLAIMS = "0xdD45947C42bF2dccb65A9cf5514d9158AEE9C2A7";

const MintNFT = async ({ metadataURI }) => {
  const provider =
    window.ethereum != null
      ? new ethers.providers.Web3Provider(window.ethereum)
      : ethers.providers.getDefaultProvider();
  const signer = provider.getSigner();
  const Role = new ethers.Contract(MINT_CLAIMS, Claims, signer);
  const tokenId = await Role.mintSoulboundNFT(metadataURI);
  localStorage.setItem("mintdata", metadataURI);
  console.log(tokenId);
  return tokenId;
};

const GETNFT = async () => {
  const provider =
    window.ethereum != null
      ? new ethers.providers.Web3Provider(window.ethereum)
      : ethers.providers.getDefaultProvider();
  const signer = provider.getSigner();
  const Role = new ethers.Contract(MINT_CLAIMS, Claims, signer);
  const tokenId = await Role.viewMintedNFTs();
  return tokenId;
};
export { MintNFT, GETNFT };
