const fs = require('fs');
const path = require('path');

const Storage = require('./Storage');

const Uploader = {
  uploadFiles: async (videoDir) => {
    // 특정 디렉토리의 파일 목록 불러오기
    const files = fs.readdirSync(videoDir);
    const regExp = new RegExp("(mp4|avi|mkv|flv$)", 'i');

    // Upload 작업의 Promise 배열 만들기
    const uploads = files.reduce((acc, fileName) => {
      const isVideo = regExp.test(fileName)
    
      if (isVideo === false) {
        console.log("There is non-video file!");
        return acc;
      }
    
      const localFilePath = path.resolve(videoDir, fileName);
      acc.push(Storage.uploadVideo(fileName, localFilePath));
      return acc;
    }, []);

    // Upload 작업 병렬 처리
    await Promise.all(uploads);

    // 파일 목록 반환
    return files;
  },
}

module.exports = Uploader;
