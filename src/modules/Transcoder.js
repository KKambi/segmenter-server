const fetch = require("node-fetch");
require("dotenv").config();

const Signature = require('./Signature');
const Job = require('./Job');

const Transcoder = {
  // API 요청 URL
  URL: "https://vodtranscoder.apigw.ntruss.com/api/v2/jobs",
  
  // API 요청을 위한 시그네처
  signature: Signature.createSignature(
    process.env.SECRET_KEY,
    "POST",
    "/api/v2/jobs",
    String(timestamp),
    process.env.ACCESS_KEY
  ),

  requestJob: async (fileName, filePath) => {
    // 요청 시의 타임스탬프
    const timestamp = Date.now();

    // Job 정보설정
    // name: "#2 4 Protection with PropTypes"
    // path: "/videos/#2 4 Protection with PropTypes.mp4"
    const job = Job.createJob(
      fileName,
      filePath,
      process.env.BUCKET_NAME
    );

    // Transcoder에 Job생성을 요청
    const data = await fetch(this.URL, {
      method: "POST",
      body: JSON.stringify(job),
      headers: {
        "Content-Type": "application/json",
        "x-ncp-iam-access-key": process.env.ACCESS_KEY,
        "x-ncp-apigw-api-key": process.env.API_KEY,
        "x-ncp-apigw-signature-v2": this.signature,
        "x-ncp-apigw-timestamp": timestamp
      }
    });
    const result = await data.json();
    console.log(result);
  }
}

module.exports = Transcoder;
