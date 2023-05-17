const fileInput = document.getElementById('file-input');
const fileInputName = document.getElementById('file-input-name');
const convertCode = document.getElementById('convert-code');
const inputBox = document.getElementById('input-box');
const outputBox = document.getElementById('output-box');
const downloadBtn = document.getElementById('download-btn');
let theCode;
let outputCode;
let fileNameSave;
/****************************************************************************/
/* Name : handle input file */
/* Desc : take the input file and get ad string */
/****************************************************************************/
function handleFile(event) {
  const file = event.target.files[0];
  fileInputName.innerHTML = file.name;
  fileNameSave = file.name.replace('.cpp', '');
  const reader = new FileReader();
  reader.onload = function (e) {
    const fileContent = e.target.result;
    theCode = fileContent;
    inputEditor.setValue(theCode);
  };

  reader.readAsText(file);
}
/****************************************************************************/
/* Name : Download */
/* Desc : download the file */
/****************************************************************************/
const downloadHandler = () => {
  const content = outputCode;
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const currentDate = new Date().getTime();
  const fileName = `${fileNameSave}-python-${currentDate / 10000}.py`;
  link.download = fileName;
  link.href = url;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
/****************************************************************************/
/* Name : Download */
/* Desc : download the file */
/****************************************************************************/
downloadBtn.addEventListener('click', downloadHandler);
/****************************************************************************/
/* Name : handle input text */
/* Desc : take the input text and get ad string */
/****************************************************************************/
fileInput.addEventListener('change', handleFile);

/****************************************************************************/
/* Name : convert code */
/* Desc : convert the code to ad code */
/****************************************************************************/
const translateHandler = () => {
  // you have the cpp code in the global variable theCode
  // you can use it to convert it to python code
  theCode = inputEditor.getValue();
  /* logic implementation */
  tokens = [];
  lookAheadIndex = 0;
  indentCount = 0;
  parseTree = null;
  tokenize();
  try {
    main_stmt();
    outputCode = translate();
  } catch (e) {
    console.log(e);
    outputCode = e;
  }
  outputEditor.setValue(outputCode);
};

/****************************************************************************/
/* Name : convert code */
/* Desc : convert the code to ad code */
/****************************************************************************/
convertCode.addEventListener('click', translateHandler);
/****************************************************************************/
/* Name : Tokenize */
/* Desc : Tokenize the input string
 * take input string from variable TheCode
 * tokenize the constants and varibles in list tokens
 */
/****************************************************************************/
