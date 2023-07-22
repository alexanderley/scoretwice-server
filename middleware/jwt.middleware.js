// Import the necessary dependencies: The code imports the `expressjwt` module, which is a middleware used to work with JWTs in Express applications.
const { expressjwt: jwt } = require("express-jwt");

// Function used to extracts the JWT token from the request's 'Authorization' Headers
function getTokenFromHeaders(req) {
  // Check if the token is available in the request Headers
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    // Get the encoded token string and return it
    const token = req.headers.authorization.split(" ")[1];
    return token;
  }

  // If no token is found, return null
  return null;
}

// Instantiate the JWT token validation middleware
const isAuthenticated = jwt({
  // 'secret': The secret key used to sign and verify the JWT. It should match the secret used to generate the tokens.
  // secret: process.env.TOKEN_SECRET,
  secret: "AlexAlex",

  // 'algorithms': The list of allowed algorithms for token validation. In this case, only the "HS256" algorithm is allowed.
  algorithms: ["HS256"],

  // 'requestProperty': The name of the property where the decoded payload will be stored in the request object. In this case, it will be stored in the 'payload' property.
  requestProperty: "payload",

  // 'getToken': A custom function used to extract the JWT token from the request's headers. This function is defined above ('getTokenFromHeaders').
  getToken: getTokenFromHeaders,
});

// Export the middleware so that we can use it to create protected routes
module.exports = {
  isAuthenticated,
};
