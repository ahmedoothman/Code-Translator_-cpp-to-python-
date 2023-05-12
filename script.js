const fileInput = document.getElementById('file-input');
const convertCode = document.getElementById('convert-code');
const inputBox = document.getElementById('input-box');
const outputBox = document.getElementById('output-box');

let theCode;
let outputCode;

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

  // save the output in the global variable outputCode
  outputCode = 'your output code';
  // show the output
  outputBox.value = outputCode;
  // download the output in file
  downloadHandler();
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
  const fileName = `output-python-${currentDate}.txt`;
  link.download = fileName;
  link.href = url;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
