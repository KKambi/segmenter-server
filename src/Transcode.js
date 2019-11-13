const fetch = require("node-fetch");
require("dotenv").config();

const { createSignature } = require("./Signature");
const { createJob } = require("./TranscodeJob");

// 시그네처의 payload에 필요한 정보
const URL = "https://vodtranscoder.apigw.ntruss.com/api/v2/jobs";
const timestamp = Date.now();

// API 요청을 위한 시그네처 생성
const signature = createSignature(
  process.env.SECRET_KEY,
  "POST",
  "/api/v2/jobs",
  String(timestamp),
  process.env.ACCESS_KEY
);

// Transcoder Job 정보 설정
const job = createJob(
  "#2 4 Protection with PropTypes",
  "/videos/#2 4 Protection with PropTypes.mp4",
  process.env.BUCKET_NAME
);

// Transcoder Job 생성 요청
(async () => {
  const data = await fetch(URL, {
    method: "POST",
    body: JSON.stringify(job),
    headers: {
      "Content-Type": "application/json",
      "x-ncp-iam-access-key": process.env.ACCESS_KEY,
      "x-ncp-apigw-api-key": process.env.API_KEY,
      "x-ncp-apigw-signature-v2": signature,
      "x-ncp-apigw-timestamp": timestamp
    }
  });
  const result = await data.json();
  console.log(result);
})();
