const fileInput = document.getElementById('file-input');
const convertCode = document.getElementById('convert-code');
const inputBox = document.getElementById('input-box');
const outputBox = document.getElementById('output-box');
const downloadBtn = document.getElementById('download-btn');
let theCode;
let outputCode;

const constants = [ "main" ,"int", "void", "char", "\\}", "if" , "\\(", "\\)", "\\{", "return" , "\\==", "\\=", "\\>=", "\\<=","<", ">", "\\+", "\\-", "\\/", "\\*", ";", "\\w+"];
var tokens = [] ;
/****************************************************************************/
/* Name : handle input file */
/* Desc : take the input file and get ad string */
/****************************************************************************/
function handleFile(event) {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.onload = function (e) {
    const fileContent = e.target.result;
    theCode = fileContent;
    inputBox.value = fileContent;
  };

  reader.readAsText(file);
}

/****************************************************************************/
/* Name : handle input text */
/* Desc : take the input text and get ad string */
/****************************************************************************/
fileInput.addEventListener('change', handleFile);

/****************************************************************************/
/* Name : listen to input */
/* Desc : listen to input from user and save it to global variable theCode */
/****************************************************************************/
inputBox.addEventListener('input', (e) => {
  theCode = e.target.value;
});

/****************************************************************************/
/* Name : convert code */
/* Desc : convert the code to ad code */
/****************************************************************************/
const translateHandler = () => {
  // you have the cpp code in the global variable theCode
  // you can use it to convert it to python code

  /* logic implementation */
  tokenize();

  outputCode =words; 
  //Tokenize()
  //Parse()
  //Translate()

  // save the output in the global variable outputCode
  //outputCode = 'your output code';
  // show the output
  outputBox.value = outputCode;
};

/****************************************************************************/
/* Name : convert code */
/* Desc : convert the code to ad code */
/****************************************************************************/
convertCode.addEventListener('click', translateHandler);

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
  const fileName = `output-python-${currentDate}.py`;
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
/* Name : Tokenize */
/* Desc : Tokenize the input string 
          * take input string from variable TheCode
          * tokenize the constants and varibles in list tokens
*/
function tokenize(){
  var regExpPatternString = "";
  for (var i = 0 ; i < constants.length ; i++){
    regExpPatternString += constants[i] + "|";
  }
  regExpPatternString = regExpPatternString.slice(0, -1);
  const regExpPattern = new RegExp(regExpPatternString, "g");

  theCode = theCode.replace("\n", "");
  theCode = theCode.replace(/\s+/g, "");
  const words = theCode.match(regExpPattern);
  
  words.forEach(lexem => {
    console.log(lexem);
    if (constants.includes(lexem)){
      tokens.push(new Token(lexem, "const"));
    }else{ //id
      tokens.push(new Token(lexem, "var"));
    }
  });
};
/****************************************************************************/


class Token {
  constructor(token, type) {
    this.name = token;
    this.year = type;
  }
}