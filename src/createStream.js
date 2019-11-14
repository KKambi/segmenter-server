const Uploader = require('./modules/Uploader');

(async () => {
  // video directory는 서버의 최상위에 존재하는 디렉토리여야 한다.
  await Uploader.uploadFiles('videos');

  console.log("업로드완료!");
})();



