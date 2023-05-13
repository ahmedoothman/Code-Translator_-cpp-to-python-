const fileInput = document.getElementById('file-input');
const convertCode = document.getElementById('convert-code');
const inputBox = document.getElementById('input-box');
const outputBox = document.getElementById('output-box');
const downloadBtn = document.getElementById('download-btn');
let theCode;
let outputCode;
let lookAheadIndex = 0 ;
let parseTree ;
const constants = [ "main" ,"int", "void", "char", "\\}", "if" , "\\(", "\\)", "\\{", "return" , "\\==", "\\=", "\\>=", "\\<=","<", ">", "\\+", "\\-", "\\/", "\\*", ";", "\\w+"];
const brackets = ["(" , ")" , "{", "}", "[", "]"];
let tokens = [] ;
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
  tokens = [];
  lookAheadIndex = 0;
  tokenize();
  try{
    main_stmt();
    
    outputCode = pre_order(); 
  }catch(e){
    console.log(e);
    outputCode =e; 
  }
 
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
    //console.log(lexem);
    if (constants.includes(lexem) || brackets.includes(lexem)){
      tokens.push(new Token(lexem, "const"));
    }else{ //id
      tokens.push(new Token(lexem, "var"));
    }
  });
};
/****************************************************************************/

function match(token){
  //console.log(token);
    if (token == tokens[lookAheadIndex].name){
        if (lookAheadIndex < tokens.length){
          lookAheadIndex ++ ;
        }else{
          return "end";
        }
    }else{
      throw "expected token " +token ; 
    }
}

function matchDigit(){
  if (  isNumeric(tokens[lookAheadIndex].name)){
      if (lookAheadIndex < tokens.length){
        lookAheadIndex ++ ;
        return tokens[lookAheadIndex].name ;
      }
  }else{
    throw "expected token " +token ; 
  }
}


function main_stmt(){
 try{
  if (tokens[lookAheadIndex].name == "int"){
    match("int");
    match("main");
    match("(");
    match(")");
    match("{");
    child =stmts();
    match("return");
    matchDigit();
    match(";")
    match("}");
    parseTree = new Stament("_", "main_stmt", [child]);
  }else{
    throw "Can't find main function at the beginning of the program";
  }
 }catch(e){
    throw e ;
 } 
}

function stmts(){
  console.log(tokens[lookAheadIndex].name);
  console.log(tokens[lookAheadIndex].name == "if" || tokens[lookAheadIndex].type == "var");

  if (tokens[lookAheadIndex].name == "if" || tokens[lookAheadIndex].type == "var"){
    let child =stmt();
    let children = stmts();
    return new Stament("_", "stmts", [child, children] );
  }
  return null;
}

function stmt(){
  if (tokens[lookAheadIndex].name == "if"){
    match("if");
    match("(");
    //let condChild = cond();
    match(")");
    match("{");
    let children =stmts();
    condChild = children ;
    match("}");
    return new Stament( new Stament(["x", ">", "3"], "cond" , []), "if_cond", [children] );
  }else if (tokens[lookAheadIndex].type == "var"){
    asgmt();
  }else{
    throw "expected statment"
  }
}

function asgmt(){
  if (tokens[lookAheadIndex].type == "var"){
    dataType();
    match(tokens[lookAheadIndex].name);
    match("=");
    let digit = matchDigit();
    match(";");
    return new Stament(tokens[lookAheadIndex].type, "asmgt", [tokens[lookAheadIndex].name, digit] );
    //expr();
  }else{
    throw "expected identifier";
  }

}

function dataType(){
  if (tokens[lookAheadIndex].name == "int" || tokens[lookAheadIndex].name == "char" || tokens[lookAheadIndex].name == "bool"){
    match(tokens[lookAheadIndex].name);
  }
}

function pre_order(){
  let code = "" ;
  parseTree.children.forEach(element => {
    code = traverse(element);
  });
  return code ;
}

function traverse(node){
  if (node == null){
    return "";
  }
  let block = "";
  node.children.forEach(element => {
    block += traverse(element) + "\n";
  });
  block += translateStmt(node, block) + "\n";
  return block ;
}

function translateStmt(stmt, block){
  console.log(stmt.stmt_type);
  switch (stmt.stmt_type) {
    case "if_cond":
      let result = "if " ;
      stmt.tokens.tokens.forEach(element => {
        result += element + " "
      });
      result += " :";
      block.replace("\n", "\n   ");
      return result + "\n" + block;  
    default:
      return "";  
      break;
  }
}

function isNumeric(value) {
  return /^-?\d+$/.test(value);
}

class Token {
  constructor(token, type) {
    this.name = token;
    this.type = type;
  }
}

class Stament{
  constructor(tokens, stmt_type, children) {
    this.tokens = tokens;
    this.stmt_type = stmt_type;
    this.children = children
  }
}
