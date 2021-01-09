const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");

const packageDef = protoLoader.loadSync("authentication.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const authenticationPackage = grpcObject.authenticationPackage;

const db = require("./models");
const Users = db.gUsers;

const server = new grpc.Server();
server.bind("127.0.0.1:4001", grpc.ServerCredentials.createInsecure());

server.addService(authenticationPackage.Authenticate.service, {
  "authenticateUser": authenticateUser,
  "authenticateUserWithGoogle": authenticateUserWithGoogle
})

server.start()

async function authenticateUser(call, callback) {
  const {id} = call.request;
  //  get  user by id
  const user = await Users.findByPk(id)
  if (!user) {
    callback(null, {error: "no  user found"});
  }
  else {
    callback(null, user);
  }
}

async function authenticateUserWithGoogle(call, callback) {
  // console.log(call.request);
  // callback(null, call.request);
  const newUser = call.request;
  const isUserExists = await isUserExistsFun(newUser);
  if (isUserExists==null) {
    saveUserInDb(newUser);
  }
  callback(null, newUser)
}

const isUserExistsFun = async(user) => {
  // const userfromdb = await Users.create(user)
  return await Users.findOne({where: {googleId: user.googleId}});
}

const saveUserInDb = async (user) => {
  const isCreated = await Users.create(user);
  if (isCreated) {
    // console.log("new use added into db");
    return;
  }
  else {
    console.log("failed to save user in db -- authenticate service");
  }
}