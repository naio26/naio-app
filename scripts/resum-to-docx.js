// Turns RESUM-FASES.md into RESUM-FASES.docx (same content, Word format).
// Usage: node scripts/resum-to-docx.js
// Needs the "docx" npm library. It is not an app dependency: install it anywhere and point NODE_PATH to it,
// e.g. `npm i --prefix /tmp/docx-tool docx && NODE_PATH=/tmp/docx-tool/node_modules node scripts/resum-to-docx.js`.
// It understands the simple Markdown used in that file: #, ##, ###, "- " bullets, "1. " lists, **bold** and `code`.
const fs = require('fs');
const path = require('path');
const {
  AlignmentType,
  BorderStyle,
  Document,
  HeadingLevel,
  LevelFormat,
  Packer,
  Paragraph,
  TextRun,
} = require('docx');

const root = path.join(__dirname, '..');
const md = fs.readFileSync(path.join(root, 'RESUM-FASES.md'), 'utf8');

const TERRACOTTA = 'BA5836';
const DARK = '29241F';
const MUTED = '7A6A60';

/** "Some **bold** and `code`" → TextRuns. */
function runs(text, base = {}) {
  const out = [];
  const re = /(\*\*[^*]+\*\*|`[^`]+`)/g;
  let last = 0;
  let m;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(new TextRun({ text: text.slice(last, m.index), ...base }));
    const token = m[0];
    if (token.startsWith('**')) out.push(new TextRun({ text: token.slice(2, -2), bold: true, ...base }));
    else out.push(new TextRun({ text: token.slice(1, -1), font: 'Consolas', color: TERRACOTTA, ...base }));
    last = m.index + token.length;
  }
  if (last < text.length) out.push(new TextRun({ text: text.slice(last), ...base }));
  return out;
}

const children = [];
let listInstance = 0;
let inNumbered = false;

for (const raw of md.split('\n')) {
  const line = raw.trimEnd();
  const numbered = /^\d+\.\s+(.*)$/.exec(line);
  if (!numbered) inNumbered = false;

  if (!line.trim()) continue;
  if (line.startsWith('# ')) {
    children.push(new Paragraph({ heading: HeadingLevel.TITLE, children: runs(line.slice(2)) }));
  } else if (line.startsWith('## ')) {
    children.push(new Paragraph({ heading: HeadingLevel.HEADING_1, children: runs(line.slice(3)) }));
  } else if (line.startsWith('### ')) {
    children.push(new Paragraph({ heading: HeadingLevel.HEADING_2, children: runs(line.slice(4)) }));
  } else if (/^\*\*[^*]+\*\*$/.test(line)) {
    // A line that is only bold text works as a small subheading ("Què he construït").
    children.push(
      new Paragraph({
        spacing: { before: 200, after: 80 },
        keepNext: true,
        children: [new TextRun({ text: line.slice(2, -2), bold: true, color: TERRACOTTA })],
      }),
    );
  } else if (line.startsWith('- ')) {
    children.push(new Paragraph({ numbering: { reference: 'bullets', level: 0 }, children: runs(line.slice(2)) }));
  } else if (numbered) {
    if (!inNumbered) {
      listInstance += 1;
      inNumbered = true;
    }
    children.push(
      new Paragraph({ numbering: { reference: 'numbers', level: 0, instance: listInstance }, children: runs(numbered[1]) }),
    );
  } else if (line.startsWith('Última actualització')) {
    children.push(new Paragraph({ spacing: { after: 200 }, children: runs(line, { italics: true, color: MUTED }) }));
  } else {
    children.push(new Paragraph({ children: runs(line) }));
  }
}

const doc = new Document({
  creator: 'naio.',
  title: 'Resum de fases — naio.',
  styles: {
    default: { document: { run: { font: 'Arial', size: 22, color: DARK }, paragraph: { spacing: { after: 100, line: 300 } } } },
    paragraphStyles: [
      {
        id: 'Title',
        name: 'Title',
        basedOn: 'Normal',
        run: { font: 'Georgia', size: 52, color: DARK },
        paragraph: { spacing: { before: 0, after: 120 }, keepNext: true },
      },
      {
        id: 'Heading1',
        name: 'Heading 1',
        basedOn: 'Normal',
        next: 'Normal',
        quickFormat: true,
        run: { font: 'Georgia', size: 36, bold: false, color: TERRACOTTA },
        paragraph: {
          spacing: { before: 400, after: 160 },
          keepNext: true,
          outlineLevel: 0,
          border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: 'EAD6CC', space: 4 } },
        },
      },
      {
        id: 'Heading2',
        name: 'Heading 2',
        basedOn: 'Normal',
        next: 'Normal',
        quickFormat: true,
        run: { font: 'Georgia', size: 28, bold: true, color: DARK },
        paragraph: { spacing: { before: 320, after: 120 }, keepNext: true, outlineLevel: 1 },
      },
    ],
  },
  numbering: {
    config: [
      {
        reference: 'bullets',
        levels: [
          {
            level: 0,
            format: LevelFormat.BULLET,
            text: '•',
            alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 540, hanging: 270 } } },
          },
        ],
      },
      {
        reference: 'numbers',
        levels: [
          {
            level: 0,
            format: LevelFormat.DECIMAL,
            text: '%1.',
            alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 540, hanging: 300 } } },
          },
        ],
      },
    ],
  },
  sections: [
    {
      properties: { page: { margin: { top: 1300, bottom: 1300, left: 1300, right: 1300 } } },
      children,
    },
  ],
});

Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync(path.join(root, 'RESUM-FASES.docx'), buf);
  console.log(`RESUM-FASES.docx written (${children.length} paragraphs)`);
});
