const inputEditor = CodeMirror.fromTextArea(inputBox, {
  mode: 'text/x-c++src',
  lineNumbers: true,
  indentUnit: 4,
  theme: 'material-darker',
  matchBrackets: true,
  autoCloseBrackets: true,
  style: 'border-radius: 10px;',
});
const outputEditor = CodeMirror.fromTextArea(outputBox, {
  mode: {
    name: 'python',
    version: 3,
    singleLineStringErrors: false,
    highlightFormatting: false,
  },
  lineNumbers: true,
  indentUnit: 1,
  theme: 'material-darker',
  matchBrackets: true,
  autoCloseBrackets: true,
});
outputEditor.setOption('readOnly', true);
