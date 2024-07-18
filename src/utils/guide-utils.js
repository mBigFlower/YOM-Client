import { driver } from "driver.js";
import "driver.js/dist/driver.css";

export async function initFileSelectGuide() {
  console.log("initFileSelectGuide", localStorage.getItem('guide-fileSelect'));
  if (localStorage.getItem('guide-fileSelect')) return;
  const driverObj = driver({
    showProgress: true,
    allowClose: false,
    showButtons: [
      'next',
      'previous',
      'close'
    ],
    onDeselected: (el) => {
      if (el.id === 'startBtn') {
        console.log('guide over');
        localStorage.setItem('guide-fileSelect', "1");
      }
    },
    steps: [{
      element: "#consoleUpload .arco-upload",
      popover: {
        // title: "Step 1",
        description: "Select console log files",
      },
    },
    {
      element: "#networkUpload .arco-upload",
      popover: {
        description: "Or select network log files at the same time",
      },
    },
    {
      element: "#startBtn",
      popover: {
        description: "Start to view the logs",
      },
    }],
  });
  driverObj.drive();
}