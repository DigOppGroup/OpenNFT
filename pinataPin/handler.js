"use strict";
const Multipart = require("lambda-multipart");
const axios = require("axios");
const FormData = require("form-data");

const pinataApiKey = process.env.PINATA_API_KEY;
const pinataSecretApiKey = process.env.PINATA_SECRET_API_KEY;

const acceptedMIME = ["image/png", "image/jpg", "image/jpeg"];

const pinJSONToIPFS = (metadata) => {
  const JSONBody = {
    pinataMetadata: {
      name: "metadata",
      keyvalues: {
        name: metadata.name,
        description: metadata.description,
      },
    },
    pinataContent: metadata,
  };
  const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
  return axios
    .post(url, JSONBody, {
      headers: {
        pinata_api_key: pinataApiKey,
        pinata_secret_api_key: pinataSecretApiKey,
      },
    })
    .then(function (response) {
      return response.data;
      //handle response here
    })
    .catch(function (error) {
      console.log(error);
      return "an error occured";
      //handle error here
    });
};

const pinFileToIPFS = (file, name, description) => {
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

  //we gather a local file for this example, but any valid readStream source will work here.
  let data = new FormData();
  data.append("file", file);

  //You'll need to make sure that the metadata is in the form of a JSON object that's been convered to a string
  //metadata is optional
  const metadata = JSON.stringify({
    name: name,
    keyvalues: {
      description: description,
    },
  });
  data.append("pinataMetadata", metadata);

  //pinataOptions are optional
  const pinataOptions = JSON.stringify({
    cidVersion: 0,
    customPinPolicy: {
      regions: [
        {
          id: "FRA1",
          desiredReplicationCount: 1,
        },
        {
          id: "NYC1",
          desiredReplicationCount: 2,
        },
      ],
    },
  });
  data.append("pinataOptions", pinataOptions);

  return axios
    .post(url, data, {
      maxBodyLength: "Infinity", //this is needed to prevent axios from erroring out with large files
      headers: {
        "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
        pinata_api_key: pinataApiKey,
        pinata_secret_api_key: pinataSecretApiKey,
      },
    })
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      console.log(error);
      return "an error occured";
      //handle error here
    });
};

const parseMultipartFormData = async (event) => {
  return new Promise((resolve, reject) => {
    const parser = new Multipart(event);

    parser.on("finish", (result) => {
      resolve({
        fields: result.fields,
        files: result.files,
      });
    });

    parser.on("error", (error) => {
      return reject(error);
    });
  });
};

module.exports.pinFile = async (event) => {
  //const body = JSON.parse(event.body || "{}");
  const { files, fields } = await parseMultipartFormData(event);

  const name = fields.name || "";
  const description = fields.description || "";
  const file = files[0];

  if (!acceptedMIME.includes(file.headers["content-type"])) {
    return {
      statusCode: 500,
      body: "Needs to be png or jpg.",
    };
  }

  const imageResults = await pinFileToIPFS(file, name, description);
  const imageURI = `ipfs://${imageResults.IpfsHash}`;

  const nftMetaData = {
    attributes: [],
    description: description,
    image: imageURI,
    name: name,
  };

  const results = await pinJSONToIPFS(nftMetaData);

  return {
    statusCode: 200,
    body: JSON.stringify(results),
  };
};
