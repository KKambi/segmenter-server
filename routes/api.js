const express = require("express");

const router = express.Router();

const StreamController = require("../src/controllers/StreamController");

// 원본영상을 업로드하고, Job생성을 요청
router.post("/videos", async (req, res, next) => {
  const result = await StreamController.uploadVideos();
  res.json({ result });
});

// Job 상태변경에 대한 알림을 받은 뒤, 개별항목에 대해 스트림 데이터 생성
router.post("/segment", async (req, res, next) => {
  const { jobId, status } = req.body;

  switch (status) {
    case "FAILED":
      console.log("FAILED callback");
      res.json({ result: false });
      break;
    case "PROGRESSING":
      console.log("FAILED callback");
      res.json({ result: false });
      break;
    default:
  }

  const result = await StreamController.createStream(jobId);
  res.json({ result });
});

module.exports = router;
