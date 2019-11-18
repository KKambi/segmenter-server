const StreamScript = require('./StreamScript');

const StreamController = {
  uploadVideos: async () => {
    // video directory는 서버의 최상위에 존재하는 디렉토리여야 한다.
    // console.log("업로드 시작!");
    // const files = await StreamScript.uploadVideos('videos');
    // console.log("업로드 완료!\n");

    // FIXME: 원본 영상 삭제하기
    console.log("원본영상 삭제 시작!");
    await StreamScript.removeVideos('videos');
    console.log("원본영상 삭제 완료!\n");

    // nCloud Transcoder API에 Job 생성을 요청한다.
    // console.log("Transcode Job생성 요청!");
    // await StreamScript.requestJobs(files);
    // console.log("Transcoder Job생성 요청완료!\n");
  },

  createStreams: async () => {
    // FIXME: 임시 목업 파일
    const files = [
      "Beef - 11704.mp4",
      "Food - 24999.mp4"
    ]

    // 현재 Job이 완성되었다는 응답값을 받으면 해당 영상들을 다운로드한다.
    // console.log("Segmenter 서버에 해당 영상 다운로드!");
    // await StreamScript.downloadVideos(files);
    // console.log("Segmenter 서버에 영상 다운로드 완료!");

    console.log("Segmeneter 서버에서 분할 작업 시작!");
    await StreamScript.createSegments(files);
    console.log("Segmeneter 서버에서 분할 작업 완료!");

    //FIXME: 원본 영상 삭제하기
    //console.log("Segmenter 서버에서 원본영상 삭제 시작!")
    //console.log("Segmenter 서버에서 원본영상 삭제 완료!")

    //TODO: console.log("Segmenter 서버에서 분할 파일 업로드 시작!");
    //await StreamScript.uploadSegement(files);
    //console.log("Segmenter 서버에서 분할 파일 업로드 완료!");
  },
};

module.exports = StreamController;
