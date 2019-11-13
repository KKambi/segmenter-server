const { makeSignature } = require('./Signature');
require('dotenv').config();

const URL = "https://vodtranscoder.apigw.ntruss.com/api/v2";
const timestamp = Date.now();
console.log(String(timestamp));
const signature = makeSignature(
  process.env.SECRET_KEY,
  'GET',
  '/api/v2/jobs?limit=10',
  String(timestamp),
  process.env.ACCESS_KEY
)
console.log(signature);

// fetch(URL, {
//   method: 'GET',
//   body: JSON.stringify(data),
//   headers:{
//     'Content-Type': 'application/json',
//     'x-ncp-iam-access-key': process.env.ACCESS_KEY,
//     'x-ncp-apigw-api-key': process.env.API_KEY,
//     'x-ncp-apigw-signature-v2': signature,
//     'x-ncp-apigw-timestamp': timestamp,
//   }
// })
