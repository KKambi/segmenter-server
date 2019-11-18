const express = require('express');
const router = express.Router();

const StreamController = require('../src/controllers/StreamController');

// 원본영상을 업로드하고, Job생성을 요청
router.post('/videos', (req, res, next) => {
  StreamController.uploadVideos();
})

// Job 상태변경에 대한 알림을 받은 뒤, 스트림 데이터를 생성
router.post('/segments', (req, res, next) => {
  StreamController.createStreams();
});

module.exports = router;
