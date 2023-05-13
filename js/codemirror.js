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
  mode: 'text/x-python',
  lineNumbers: true,
  indentUnit: 4,
  theme: 'material-darker',
  matchBrackets: true,
  autoCloseBrackets: true,
});
outputEditor.setOption('readOnly', true);
