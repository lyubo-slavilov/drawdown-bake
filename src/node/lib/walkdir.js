

const walkdir = (dir, filelist=[], isInitialDir = true) => {
  var path = path || require('path');
  var fs = fs || require('fs'),
  files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function(file) {
    if (fs.statSync(path.join(dir, file)).isDirectory()) {
      filelist = walkdir(path.join(dir, file), filelist, false);
    }
    else {
      filelist.push(path.join(dir, file));
    }
  });
  return filelist;
};

module.exports = walkdir;
