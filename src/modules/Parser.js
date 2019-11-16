const path = require('path');

const Parser = {
  removeExtension: (fileName) => {
    return fileName.slice(0, fileName.length-4)
  },

  createStoragePath: (fileName) => {
    return "/videos/" + fileName;
  },

  createLocalDirPath: (name) => {
    const videoNames = ['360p.mp4', '480p.mp4', '720p.mp4'];
    const list = videoNames.reduce((acc, val) => {
      acc.push(path.join(__dirname, "/", name, "/", val));
      return acc;
    }, []);
    
    return list;
  }
}

module.exports = Parser;
