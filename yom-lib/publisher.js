/*
 * @Author: bigflower
 * @Date: 2022-04-13 13:50:01
 * @LastEditors: csh
 * @LastEditTime: 2022-08-19
 * @Description: file content
 * @FilePath: /melon-npm/melon_publisher.js
 */

// 依赖库
const child = require('child_process');

// npm publish
function publish() {
	return new Promise((resolve, reject) => {
    console.log('publish ready')
		child.exec('npm publish --registry http://192.168.240.32:9999/', function (err, sto) {
			if (err) {
				reject(err);
				return;
			}
			resolve(sto);
		})
	})
}

publish();
