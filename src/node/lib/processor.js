const fs = require('fs');
const fsExtra = require('fs-extra')
const path = require('path');

const extractDiagramsInfo = require('./markdown.js');

const readAndParseFile = function(file) {
  let text = fs.readFileSync(file, 'utf8');

  let diagramsInfo = extractDiagramsInfo(text);
  return [text, diagramsInfo];

}

const saveFile = function(file, text) {
  let dirname = path.dirname(file);
  fsExtra.ensureDirSync(dirname);
  fs.writeFileSync(file, text);
}

const copyFile = function(src, target) {
  let dirname = path.dirname(target);
  fsExtra.ensureDirSync(dirname);
  fs.copyFileSync(src, target);
}

const fileAssembler = (browser, destDir) => {
  return (file, text, diagramsInfo, layouts) => {

    const fileFullPath = path.join(destDir, file);
    const fileFullDir = path.dirname(fileFullPath);
    const lines = text.split('\n');
    let sliceStart = 0;
    let assembled = [];

    let promises = diagramsInfo.map(async info => {

      const browserPage = await browser.newPage();
      await browserPage.goto('http://localhost:8989/index.html');

      let size = await browserPage.evaluate(async (layouts,  info) => {
        let result = drawdown.renderTo(document.body, {
          script: info.content,
          diagramType: info.type,
          layout: layouts,
          diagramHash: info.hash
        })
        return Promise.resolve(result);
      }, layouts, info);


      await browserPage.setViewport({
        width: Math.round(size.w+1),
        height: Math.round(size.h+1)
      })

      console.log('Imprinting new hologram...');

      let imagePath = path.join(destDir, `./assets/${info.type}-${info.hash}.png`)
      let imageRelPath = path.relative(fileFullDir, imagePath);

      await browserPage.screenshot({
        path: imagePath,
        omitBackground: true,
        fullPage: true
      });
      const imageTag = `![Diagram](${imageRelPath})`;


      await browserPage.close();
      return Promise.resolve({
        imageTag,
        sourceMap: info.sourceMap
      });
    });

    return new Promise ((resolve, reject) => {
      Promise.all(promises).then((results) => {
        let sliceStart = 0;
        assembled = results.reduce((acc, info) => {

          acc = acc.concat(lines.slice(sliceStart, info.sourceMap[0]));
          acc.push(info.imageTag);
          acc.push('');

          sliceStart = info.sourceMap[1];
          return acc;
        }, []);

        saveFile(fileFullPath, assembled.join('\n'));
        resolve();
      })
    })
  }
}



module.exports = (srcDir, destDir) => {
  return (browser, files, extensions, layouts) => {
    const assembler = fileAssembler(browser, destDir);
    const regex = new RegExp(`^.*\.${extensions}`);
    let promises = files.map(async f => {
      if (regex.test(f)) {
        let [text, info] = readAndParseFile(path.join(srcDir, f));
        await assembler(f, text, info, layouts);
      } else {
        copyFile(path.join(srcDir, f), path.join(destDir, f))
      }
      return Promise.resolve();
    });

    return new Promise((resolve, reject) => {
      Promise.all(promises).then(() => {
        resolve();
        console.log('All files done');
      });
    })
  }
}
