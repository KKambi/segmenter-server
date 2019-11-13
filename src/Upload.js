const fs = require('fs');
const path = require('path');
const os = require('os');
const AWS = require('aws-sdk');
require('dotenv').config();

// AWS S3 정보
const endpoint = new AWS.Endpoint('https://kr.object.ncloudstorage.com');
const region = 'kr-standard';

// AWS S3 설정
AWS.config.update({
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_KEY,
})

const S3 = new AWS.S3({
  endpoint,
  region,
})

// 업로드 함수
const uploadVideo = async (name, path) => {
  let dirName = 'videos';
  videoName = name;

  // 파일 업로드
  await S3.putObject({
      Bucket: process.env.BUCKET_NAME + "/" + dirName,
      Key: videoName,
      Body: fs.createReadStream(path)
  }).promise();  

  console.log(`${name} 업로드 완료!`);
}

// 특정 디렉토리의 파일 목록 불러오기
const videoDir = 'videos';
const files = fs.readdirSync(videoDir);
const regExp = new RegExp("(mp4|avi|mkv|flv$)", 'i');
for (const fileName of files){
  const isVideo = regExp.test(fileName)

  if (isVideo === false) {
    console.log("There is non-video file!");
    continue;
  }

  const localFilePath = path.resolve(videoDir, fileName);
  uploadVideo(fileName, localFilePath)
}