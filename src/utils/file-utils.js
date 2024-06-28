
export async function readFile2Object(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const jsonData = JSON.parse(e.target.result);
      console.log(jsonData);
      resolve(jsonData)
    };
    reader.readAsText(file);
    return false; // 阻止文件自动上传
  });
}