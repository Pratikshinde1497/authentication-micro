const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");

const packageDef = protoLoader.loadSync("proto-services/services/authenticate/service.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const authenticationPackage = grpcObject.authenticationPackage;

const client = new authenticationPackage.AuthenticateAPI("localhost:4001", grpc.credentials.createInsecure());

client.authenticateUser({ tokenId: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJnb29nbGVJZCI6IjExNTk3MzA4MDg1MzM3OTc0OTI5MyIsImlhdCI6MTYxMDQzMjU1NywiZXhwIjoxNjExNjQyMTU3fQ.myh9dG53eLLVyuh5cHd4l8AFVOa7Cmm7u4YnBTq_7Go" }, (err, res)=> {
  if (!err) {
    console.log(res);
  }
})

// client.authenticateUserWithOAuth({email: "this is email", password: "123456"}, (err, res)=> {
//   if (!err) {
//     console.log(res);
//     process.exit(1)
//   }
// });

// client.returnToken({tokenId: "12345"}, (err, res) => {
//   if (!err) {
//     console.log(res);
//   }
// })