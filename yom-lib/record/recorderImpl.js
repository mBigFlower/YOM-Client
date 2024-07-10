
import { getSeekableBlob } from './recorderUtil.js';

// please use h264 to enable hardware encode accelerate and decrease cpu usage
const mimeType = 'video/webm\;codecs=vp8';
// 录音实例
let mediaRecorder;
let blobSlice = [];

export const startRecordClick = (stream) => {
  console.log('startRecordClick')
  return new Promise((resolve, reject) => {
    if (!stream) {
      console.error('startRecord stream is null');
      reject('startRecord stream is null');
    }
    blobSlice = [];

    mediaRecorder = new MediaRecorder(stream, {
      mimeType,
      videoBitsPerSecond: 1e6
    });

    mediaRecorder.ondataavailable = (event) => {
      blobSlice.push(event.data);
    }

    const startTime = new Date().toLocaleString().replace(/\//g, '-');
    mediaRecorder.onstop = async () => {
      console.log('onstop')
      const endTime = new Date().toLocaleString().replace(/\//g, '-');
      resolve({ startTime, endTime });
    };

    // using timeslice to avoid memory consumption in renderer process, and generate a blob object each second
    mediaRecorder.start(1000);
  })
}

export const downloadRecord = async (startTime, endTime) => {
  const newBlob = new Blob([...blobSlice], { type: mimeType });
  console.log('onstop newBlob', newBlob)
  const aimBlob = await getSeekableBlob(newBlob);
  console.log('onstop aimBlob', aimBlob)

  var videoURL = URL.createObjectURL(aimBlob);
  console.log('videoURL', videoURL);
  var a = document.createElement("a");    //模拟链接，进行点击下载
  a.href = videoURL;
  a.style.display = "none";    //不显示
  a.download = getRecorderFileName(startTime, endTime);
  a.click();

  blobSlice = [];
}

export const stopRecordClick = () => {
  console.log('stopRecordClick')
  mediaRecorder.stop()
}


function getRecorderFileName(startTime, endTime) {
  return `recorder,${startTime},${endTime}.mp4`
}
