const fs = require('fs');
const path = require('path');
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

const Storage = {
  uploadVideo: async (name, localFilePath) => {
    let dirName = 'videos';

    // 파일 업로드
    await S3.putObject({
        Bucket: process.env.BUCKET_NAME + "/" + dirName,
        Key: name,
        Body: fs.createReadStream(localFilePath)
    }).promise();  

    console.log(`${name} 업로드 완료!`);
  },

  downloadVideo: async (name) => {
    const localFilePath = path.join(__dirname, '/tmp.mp4')
    let outStream = fs.createWriteStream(localFilePath);
    let inStream = S3.getObject({
        Bucket: process.env.BUCKET_NAME + "/thumbnails",
        Key: name
    }).createReadStream(); 

    inStream.pipe(outStream);
    inStream.on('end', () => {
      console.log(`${name} 다운로드 완료!`);
    })
  },
}

module.exports = Storage;
