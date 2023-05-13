const fileInput = document.getElementById('file-input');
const fileInputName = document.getElementById('file-input-name');
const convertCode = document.getElementById('convert-code');
const inputBox = document.getElementById('input-box');
const outputBox = document.getElementById('output-box');
const downloadBtn = document.getElementById('download-btn');
let theCode;
let outputCode;
let lookAheadIndex = 0;
let parseTree;
let tokens = [];
/****************************************************************************/
/* Name : handle input file */
/* Desc : take the input file and get ad string */
/****************************************************************************/
function handleFile(event) {
  const file = event.target.files[0];
  fileInputName.innerHTML = file.name;
  const reader = new FileReader();
  reader.onload = function (e) {
    const fileContent = e.target.result;
    theCode = fileContent;
    inputEditor.setValue(theCode);
  };

  reader.readAsText(file);
}

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
  tokenize();
  try {
    main_stmt();

    outputCode = pre_order();
  } catch (e) {
    console.log(e);
    outputCode = e;
  }

  //Tokenize()
  //Parse()
  //Translate()

  // save the output in the global variable outputCode
  //outputCode = 'your output code';

  // set the output code in the output editor
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
function tokenize() {
  var regExpPatternString = '';
  for (var i = 0; i < constants.length; i++) {
    regExpPatternString += constants[i] + '|';
  }
  regExpPatternString = regExpPatternString.slice(0, -1);
  const regExpPattern = new RegExp(regExpPatternString, 'g');

  theCode = theCode.replace('\n', '');
  theCode = theCode.replace(/\s+/g, '');
  const words = theCode.match(regExpPattern);
  words.forEach((lexem) => {
    //console.log(lexem);
    if (constants.includes(lexem) || brackets.includes(lexem)) {
      tokens.push(new Token(lexem, 'const'));
    } else {
      //id
      tokens.push(new Token(lexem, 'var'));
    }
  });
}
