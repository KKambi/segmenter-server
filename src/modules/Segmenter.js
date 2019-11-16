const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
ffmpeg.setFfmpegPath(ffmpegPath);

const Parser = require('./Parser');

const Segmenter = {
  createSegment: async (fileName) => {
    // 비디오 정보
    const name = Parser.removeExtension(fileName);
    const filePathList = Parser.createLocalDirPath(name);

    const listSize = filePathList.length;
    for (let i=0; i<listSize; i++){
      const filePath = filePathList[i];
      console.log(`${filePath} ffmpeg encoding 시작!`);
      
      const segmenter = ffmpeg(filePath, { timeout: 432000 })
        .addOptions([
          "-profile:v baseline", // baseline profile (level 3.0) for H264 video codec
          "-level 3.0",
          "-hls_time 10", // 10 second segment duration
          "-hls_list_size 0", // Maxmimum number of playlist entries (0 means all entries/infinite)
          "-f hls" // HLS format
        ])
        .output(filePath + "test.m3u8");
        
      await new Promise((resolve, reject) => {
        segmenter.run();
        
        segmenter.on("end", function() {
          console.log("성공!")
          resolve();
        })
        
        segmenter.on("error", function(err) {
          console.error("Error while ffmpeg processing:", err);
          reject();
        })
      });
    }
  }
}

module.exports = Segmenter;
