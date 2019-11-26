const fs = require("fs");
const path = require("path");
const moment = require("moment");
require("dotenv").config();

const Storage = require("../modules/Storage");
const Transcoder = require("../modules/Transcoder");
const Parser = require("../modules/Parser");
const Segmenter = require("../modules/Segmenter");
const Video = require("../models/Video");

const VideoModel = new Video();

const RESOLUTIONS = ["360p.mp4", "480p.mp4", "720p.mp4"];

const StreamScript = {
  // Object storage에 영상들 업로드하는 함수
  uploadVideos: async (videosDir, files) => {
    // Upload 작업의 Promise 배열 만들기
    const uploads = files.reduce((acc, fileName) => {
      if (Parser.isVideo(fileName) === false) {
        console.log("There is non-video file!");
        return acc;
      }

      const localFilePath = path.resolve(videosDir, fileName);
      acc.push(Storage.uploadVideo(localFilePath, fileName));
      return acc;
    }, []);

    // Upload 작업 병렬 처리
    await Promise.all(uploads);

    // 파일 목록 반환
    return files;
  },

  // Object Storage에서 분할할 비디오를 다운로드하는 함수
  downloadVideos: async (videosDir, files) => {
    const totalDownloads = files.reduce((acc, fileName) => {
      const fileNameWithoutExt = Parser.removeExtension(fileName);
      const localDirPath = path.resolve(videosDir, fileNameWithoutExt);
      const bucketPath = `${process.env.BUCKET_NAME}/transcoded/${fileNameWithoutExt}`;

      // downloadVideo 작업들을 push
      RESOLUTIONS.forEach(RESOLUTION => {
        acc.push(Storage.downloadVideo(localDirPath, RESOLUTION, bucketPath));
      });
      return acc;
    }, []);

    // downloadVideo 작업 병렬 처리
    await Promise.all(totalDownloads);
  },

  // Transcoder API에 다수의 Job 생성 요청 보내는 함수
  requestJobs: async files => {
    // requestJob 작업의 Promise 배열 만들기
    const requests = files.map(fileName => {
      return Transcoder.requestJob(fileName);
    });

    // requestJob 작업 병렬 처리
    await Promise.all(requests);
  },

  // 다운로드받은 360/480/720p 영상들을 분할하는 함수
  createSegments: async (videosDir, files) => {
    const segments = [];
    files.forEach(fileName => {
      segments.push(Segmenter.createSegment(videosDir, fileName));
    });

    await Promise.all(segments);
  },

  // 분할한 스트리밍 데이터를 업로드하는 함수
  uploadSegments: async (videosDir, files) => {
    const uploads = [];

    files.forEach(fileName => {
      const fileNameWithoutExt = Parser.removeExtension(fileName);
      const productsDir = `${videosDir}/${fileNameWithoutExt}`;
      const products = fs.readdirSync(productsDir);

      // Upload 작업의 Promise 배열 만들기
      products.some(productName => {
        if (Parser.isVideo(productName)) {
          return false;
        }

        const localFilePath = path.resolve(productsDir, productName);
        uploads.push(
          Storage.uploadVideo(localFilePath, productName, productsDir, {
            ACL: "public-read"
          })
        );
        return false;
      });
    });

    // Upload 작업 병렬 처리
    await Promise.all(uploads);
  },

  insertURLtoDB: async files => {
    const inserts = [];
    try {
      files.forEach(fileName => {
        // TODO: adaptive bit streaming 어떻게?
        const nameWithoutExt = Parser.removeExtension(fileName);
        const streamingURL = `${process.env.CDN_URL}/videos/${nameWithoutExt}/720p.m3u8`; // FIXME: abs를 위해 수정할 것!
        const thumbnailImgURL = `${process.env.CDN_URL}/videos/${nameWithoutExt}_000005.png`;
        const datetime = moment().format("YYYY-MM-DD HH:mm:ss");
        inserts.push(
          VideoModel.create({
            name: nameWithoutExt,
            category: "테스트", // TODO: 카테고리 변경
            likes: 0,
            reg_date: datetime,
            thumbnail_img_url: thumbnailImgURL, // TODO: 썸네일 이미지
            thumbnai_video_url: null,
            streaming_url: streamingURL
          })
        );
      });
      await Promise.all(inserts);
    } catch (err) {
      console.log(`DB insert 에러:${err}`);
    }
  }
};

module.exports = StreamScript;
