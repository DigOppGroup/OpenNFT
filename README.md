# OpenNFT
Tool for quick minting NFTs. Contracts are already deployed and front end coming soon. All you need to do is upload an image and pay some gas to mint. 

# IPFS Uploader

Backend is serverless node app leveraging the Pinata for pinning to IPFS.

The image and a metadata file are pinned to IPFS. The uploader will return an object like this:

```
{"IpfsHash":"blAHBlahBLAhblaH","PinSize":136,"Timestamp":"2022-03-18T04:52:39.003Z"}
```

The IPFS hash is the CID for locating the metadata object on IPFS. You can use the IPFS public gateway to locate it. For example: `https://ipfs.io/ipfs/blAHBlahBLAhblaH`

The will locate the NFT metadata, which would looks something like this: 

```
{
  "attributes": [],
  "description": "Dalton's Avatar.",
  "image": "ipfs://pIcPIcPICPIc",
  "name": "0xjellyBeard"
}
```

The `image` key is where the actual image is located on IPFS.

# Smart contract

Mainnet: [0x4a4f4a202c840f7247cfcb429e1b41a5509176d8](https://etherscan.io/address/0x4a4f4a202c840f7247cfcb429e1b41a5509176d8)

Ropsten: [0x766eeb009d8f97acd285026d039783b985feac8e](https://ropsten.etherscan.io/address/0x766eeb009d8f97acd285026d039783b985feac8e)

To mint the NFT, you just need to call the `mintNFT()` function and pass in the destination address and the URI of the NFT metadata file.