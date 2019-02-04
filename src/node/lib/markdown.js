const MarkdownIt = require('markdown-it');
const md5 =  require('md5');

module.exports = (text) => {
  let md = new MarkdownIt();

  let drawdownScripts = [];
  //Init Markdown parser
  md.renderer.rules.fence =  function (tokens, idx, options, env, self) {
    const token = tokens[idx];
    const regex = /drawdown\.(flow|graph|tree|sequence)\.([a-zA-Z][0-9a-zA-Z\-\_]*)/g;

    try {
      const [fullMatch, diagramType, diagramName] = regex.exec(token.info);
      const hash = md5(diagramName);
      drawdownScripts.push({
        hash,
        sourceMap: [...token.map],
        type: diagramType,
        content: token.content.trim()
      });
      return ``;
    } catch (e) {
      return ``;
    }
  }

  md.render(text); //TODO see if there are tokenstream only and not actual renderer
  return drawdownScripts;

}
