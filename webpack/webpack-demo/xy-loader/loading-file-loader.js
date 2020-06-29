const path = require('path');
const fs = require('fs');
const http = require('http');
const https = require('https');

const loadedFileNameMapPath = path.resolve("./loadedFileName.json")
 
function httpGet(path) {
  let HTTP = /^https:/.test(path) ? https : http
  return new Promise((reslove, reject) => {
    try {
      if (!path) throw '路径错误';
      HTTP.get(path, function(_res) {
        var chunks = [];
        var size = 0;
        _res.on('data', function(chunk) {
          chunks.push(chunk);
          size += chunk.length;
        });
        _res.on('end', function(err) {
          if (err) throw err;
          var data = Buffer.concat(chunks, size);
          reslove(data);
        });
      });
    } catch (err) {
      console.error(`image ${path} can not download`)
      reject(err);
    }
  });
}

function httpGetAll(urlList = []) {
  return Promise.all(urlList.map(i => httpGet(i)))
}

function getWantLodedFileName(urlList) {
  let urlMaps = urlList.reduce((acc, uri) => {
    let name = path.basename(uri)
    return {...acc, [uri]: name }
  }, {})

  return urlMaps
}

function wirteLoadedFileName(map) {
  fs.writeFileSync(loadedFileNameMapPath, JSON.stringify(map, null, 4))
}

function removeLoadeFileUrl(loadedFileNameMapPath) {
  return new Promise((resolve, reject) => {
    fs.readFile(loadedFileNameMapPath, 'utf8',  (err, data) => {
      if (err) {
        resolve({});
      } else {
        try  {
          resolve(JSON.parse(data));
        } catch (err) {
          resolve({});
        }
      }
    });
  })
  
}

function replaceUrls(source, outLinkUrl, localurl) {
  let name = localurl
  let orginalUrl = outLinkUrl
  let pattern1 = new RegExp(orginalUrl, "g")
  
  return  source.replace(pattern1, name)
}

function createFilePath(fileName) {
  return `./${fileName}`
}
 
module.exports = function(source) {
  let pattern = new RegExp("https?:\/\/.+?\.((jpg)|(jpeg)|(png))", "g")
  let urlList = source.match(pattern)
  if (urlList && urlList.length) {
    const callback = this.async();
    const wantedUrlMaps = getWantLodedFileName(urlList)
    removeLoadeFileUrl(loadedFileNameMapPath).then(loadedFileMap => {
      let copyUrlMaps = {...wantedUrlMaps}
      let loadedWantedUrlMaps = {}
      let urls = Object.keys(copyUrlMaps)

      if (Object.keys(loadedFileMap).length) {
        // 1 loadedFileName.json 文件存在
        urls.forEach(url => {
          console.log(copyUrlMaps[url])
          if (loadedFileMap[url]) {
            loadedWantedUrlMaps[url] = copyUrlMaps[url]
            delete copyUrlMaps[url]
          } 
        })
        // 1-1 筛选已经现在的文件路径
        for (let key in loadedWantedUrlMaps) {
          source = replaceUrls(source, key, createFilePath(loadedWantedUrlMaps[key]))
        }
      } else {
        // 2 loadedFileName.json 文件不存在
        
      }

      urls = Object.keys(copyUrlMaps)
      // 1-2 下载加载的文件
      if (urls.length) {
        let fileNames =  Object.values(copyUrlMaps)
  
        httpGetAll(urls).then((resList) => {
          resList.forEach((data, index) => {
            let name = createFilePath(fileNames[index])
            source = replaceUrls(source, urls[index], name)

            this.emitFile(name, data)
          });
          wirteLoadedFileName({...wantedUrlMaps, ...copyUrlMaps})
          callback(null, source);
        }).catch(() => {
          callback(null, source);
        })
      } else {
        callback(null, source);
      }
    })
  } else {
    return source
    
  }
};