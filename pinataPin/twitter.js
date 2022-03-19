const axios = require("axios");

const twitterBearerToken = process.env.TWITTER_BEARER_TOKEN;

module.exports.profilePic = async (event) => {
  const userName = event.pathParameters.userName;
  const twitterEndpoint = `https://api.twitter.com/2/users/by/username/${userName}?user.fields=profile_image_url,description`;

  return axios
    .get(twitterEndpoint, {
      headers: {
        Authorization: `Bearer ${twitterBearerToken}`,
      },
    })
    .then(function (res) {
      const response = {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify(res.data),
      };

      return response;
    })
    .catch(function (error) {
      console.log(error);
      return "an error occured";
    });
};
