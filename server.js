const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");
const jwt = require("jsonwebtoken");
require("dotenv").config({path: "./config/config.env"});

const packageDef = protoLoader.loadSync("proto-services/services/authenticate/service.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const authenticationPackage = grpcObject.authenticationPackage;

const db = require("./models");
const Users = db.gUsers;

const server = new grpc.Server();
server.bind("127.0.0.1:4001", grpc.ServerCredentials.createInsecure());

server.addService(authenticationPackage.AuthenticateAPI.service, {
  "authenticateUser": authenticateUser,
  "authenticateUserWithGoogle": authenticateUserWithGoogle,
})

server.start()


//  suthenticate user with id
async function authenticateUser(call, callback) {
  const { tokenId } = call.request;
  
  //  extract  token and get googleId
  const googleId = extractToken(tokenId);

  //  get  user by id
  const user = await Users.findOne({ where: { googleId } });

  if (!user) {
    callback(null, {error: "no  user found"});
  }
  else {
    // console.log(user);
    callback(null, user);
  }
}

//  authenticate user with google: check exists in db or not, return jwt token
async function authenticateUserWithGoogle(call, callback) {
  const newUser = call.request;
  newUser.role = "user";

  //  check if user exist in db or not
  //  if not exist, then add

  const isUserExists = await isUserExistsFun(newUser);

  if (isUserExists==null) {
    try {
      await saveUserInDb(newUser);
    } catch (error) {
      console.log(error);
    }
  }
  //  create a signed token with google Id
  const tokenId = getSignedToken(newUser.googleId);
  const token = { tokenId }

  //  return token
  callback(null, token );
}


  //  HELPER FUNCTIONS

const extractToken = (token) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET)
  // console.log(decoded);
  if (!decoded) {
    return {code: 401, message: "Invalid Token"}
  }
  return decoded.googleId;
}


//  function for creating jwt token
const getSignedToken = (googleId) => {
  return jwt.sign({
      googleId
    }, 
      process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE,
    })
} 


//  functionn  to check if user exists in db
const isUserExistsFun = async(user) => {
  return await Users.findOne({where: {googleId: user.googleId}});
}


//  save user in db
const saveUserInDb = async (user) => {
  const isCreated = await Users.create(user);
  if (isCreated) {
    return;
  }
  else {
    console.log("failed to save user in db -- authenticate service");
  }
}