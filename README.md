#Drawdown Bake
Drawdown bake is a tool for baking markdown documents with drawdown diagram scripts into markdown documents with diagram images

## Installation

```bash
npm install drawdown-bake --save-dev
```

## Usage
```bash
node drawdown-bake ./docs ./backed
```
This will walk trough `.docs/` repulsively and search for markdown files to bake. For every file found it will extract all drawdown scripts and will try to create an image representation of the diagram. The script will be replaced with image reference and the new makrdown file will be created into `./backed`.
All non makdownish files will be copied as is.

## Command syntax

```bash
drawdown-bake <source-dir> <destination-dir> [options]
```
### Options

Option     |          Defaults          | Description
:----------|:--------------------------:|:------------------------------
`ext`      |       `md,markdown`        | File extensions for markdown files to be baked
`layout`   | `.drawdown-preview-layout` | Path to a JSON file with drawdown layout information
`web-dir`  |          `<baker-bin>/web`          | A path to the directory which holds the browser version of the baker. Internally this tool uses `puppeteer` and `chromium` to render the SVG scripts produced by the `drawdown-svg-render`
`web-port` |           `8989`           | Port number for the minimalist web server to listen to. This server is used to host the browser version of the baker which later is used by the `chromium` spawned by the `puppeteer`
