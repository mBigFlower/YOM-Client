
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

export function formatFileSize(size) {
  if (!size) return '0KB'
  if (size < 1024) return '1KB'
  if (size < 1024 * 1024) return `${Math.ceil(size / 1024)}KB`
  else return `${Math.ceil(size / 1024 / 1024)}MB`
}