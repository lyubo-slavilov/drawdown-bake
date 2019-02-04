import 'typeface-roboto';
import './styles.scss';
import { factory as parserFactory} from 'drawdown-parser';
import { factory as rendererFactory } from 'drawdown-svg-render';

export function renderTo(domElement, {
  script = null,
  diagramType = null,
  layout = {},
  diagramHash = '',
} = {}) {

  if (diagramType === null) {
    throw new Error(`Invalid diagram type "${diagramType}"`);
  }

  if (script === null) {
    throw new Error(`Script was not provided.`);
  }

  let parser = parserFactory(diagramType);

  const diagramToRendererMap = {
    flow: 'GENERAL',
    graph: 'GENERAL',
    sequence: 'TIMELINE'
  }
  let renderer = rendererFactory(diagramToRendererMap[diagramType], {
    diagramLayout: layout
  });
  let data =  parser.parseText(script);
  data.hash = diagramHash;

  //clear up the dom element
  let fc = domElement.firstChild;
  while( fc ) {
      domElement.removeChild( fc );
      fc = domElement.firstChild;
  }

  renderer.render(domElement,data);

  let svg = document.querySelector('svg');
  let scene = document.querySelector('.scene');
  let bbox = scene.getBBox();
  let ctm = scene.getScreenCTM();

  const w = Math.max(bbox.width*ctm.a + 80, 400);
  const h = Math.max(bbox.height*ctm.d + 40, 200);
  svg.setAttribute('width', w);
  svg.setAttribute('height', h);
  document.querySelector('.workarea').setAttribute('transform', null);
  return {w, h}

}
