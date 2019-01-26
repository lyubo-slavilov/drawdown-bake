const createServer = require('http-server').createServer;
const puppeteer = require('puppeteer');
const walkdir = require('./lib/walkdir.js');
const path = require('path');
const fs = require('fs');
const fsExtra = require('fs-extra');


/* ============= Deal with arguments =============*/
/*================================================*/
const argv = require('minimist')(process.argv.slice(2), {
  default: {
    'ext': 'md,markdown',
    'src': '.',
    'layout': '.drawdown-preview-layout',
    'web-dir':  path.resolve(__dirname, '../web/'),
    'web-port': '8989'
  }
});

if ( ! argv._[0]) {
  console.error('Please specify source dir.');
  process.exit(1);
}

if ( ! argv._[1]) {
  console.error('Please specify destination dir.');
  process.exit(1);
}

/* ============= Initialize =============*/
/*=======================================*/
let layouts;
try {
  layouts = JSON.parse(fs.readFileSync(path.join(process.cwd(),argv['layout'])));
} catch (e) {
  console.error(e);
  throw new Error(`Can't load layout file "${path.join(process.cwd(),argv['layout'])}"`);
}

const extentions = argv['ext'].split(',').map(e => e.trim()).join('|');
const srcDir = path.join(process.cwd(), argv._[0]);
const destDir = path.join(process.cwd(), argv._[1]);

const files =  walkdir(srcDir).map(f => path.relative(srcDir, f));
const processor = require('./lib/processor.js')(srcDir, destDir);


fsExtra.ensureDirSync(path.join(destDir, 'assets')); //TODO must be configurable from argv

/* ============= Do the job =============*/
/*=======================================*/
const server = createServer({
  root: argv['web-dir']
});

console.log('Spawning new universe...');
server.listen(argv['web-port'], function() {

  ;(async () => {

    console.log('Launching new Higgs phasechanger...');
    const browser = await puppeteer.launch({headless: true});


    console.log('Entangling black holes...');
    await processor(browser, files, extentions, layouts, destDir);

    await browser.close();
    server.close();
    console.log('Bang!');
  })();

});
