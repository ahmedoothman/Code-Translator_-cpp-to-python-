
/****************************************************************************/
/* Name: main_stmt */
/****************************************************************************/
let indentCount = 0;

function main_stmt() {
  try {
    if (tokens[lookAheadIndex].name == 'int') {
      match('int');
      match('main');
      match('(');
      match(')');
      match('{');
      child = stmts();
      match('return');
      matchDigit();
      match(';');
      match('}');
      parseTree = new Stament('main_stmt', [child], false, []);
      return
    } else {
      throw "Can't find main function at the beginning of the program";
    }
  } catch (e) {
    throw e;
  }
}
/****************************************************************************/
/* Name: stmts */
/****************************************************************************/
function stmts() {
 
  if (
    tokens[lookAheadIndex].name == 'if' ||
    tokens[lookAheadIndex].type == 'var' ||
    tokens[lookAheadIndex].name == 'int' ||
    tokens[lookAheadIndex].name == 'char' ||
    tokens[lookAheadIndex].name == 'bool' 
    ) {
    let child = stmt();
    let children = stmts();
    return new Stament('stmts', [child, children], false, []);
  }
  //return null;
}
/****************************************************************************/
/* Name: stmt */
/****************************************************************************/
function stmt() {
  if (tokens[lookAheadIndex].name == 'if') {
    return if_stmt();
   // return new Stament("if_stmt", [children], false, [condChild]);

  } else if (tokens[lookAheadIndex].type == 'var' || 
      tokens[lookAheadIndex].name == 'int' || tokens[lookAheadIndex].name == 'char'
      || tokens[lookAheadIndex].name == 'bool') {
    let result = asgmt();
    return new Stament("stmt", [result], false, []);
  } else {
    throw 'expected statment';
  }
}

function if_stmt(){
  if (tokens[lookAheadIndex].name == 'if') {
    match('if');
    match('(');
    let condChild = conds();
    console.log(tokens[lookAheadIndex]);
    match(')');
    match('{');
    let children = stmts();
    match('}');
    let elseIfChildren =elseif();
    let elseChildren = else_stmt();

    return new Stament("if_stmt", [children,endBlock, elseIfChildren, elseChildren ,], false, [condChild]);
  }else{
    throw 'expected if';
  }
}

function elseif(){
  if (tokens[lookAheadIndex].name == 'else if') {
    match('else if');
    match('(');
    let condChild = conds();
    match(')');
    match('{');
    let children = stmts();
    match('}');
    let elseIfChildren =elseif();
    return new Stament("else_if_stmt", [children, endBlock , elseIfChildren ], false, [condChild]);
  }
}

function else_stmt(){
  if (tokens[lookAheadIndex].name == 'else') {
    match('else');
    match('{');
    let children = stmts();
    match('}');
    return new Stament("else_stmt", [children, endBlock], false, []);
  }
}

/****************************************************************************/
/* Name: asgmt */
/****************************************************************************/
function asgmt() {
  if (tokens[lookAheadIndex].name == 'int' || tokens[lookAheadIndex].name == 'char'
     || tokens[lookAheadIndex].name == 'bool') {
    dataType();
    let varaibleName = match(tokens[lookAheadIndex].name);
    match('=');
    let digit = matchDigit();
    match(';');
    return new Stament("asgmt", [], true, [varaibleName, "=", digit]);
    //expr();

  }else if (tokens[lookAheadIndex].type == 'var' ) {
    //dataType();
    let varaibleName = match(tokens[lookAheadIndex].name);
    match('=');
    let digit = matchDigit();
    match(';');
    return new Stament("asgmt", [], true, [varaibleName, "=", digit]);
    //expr();

}
   else {
    throw 'expected identifier';
  }
}

function dataType() {
  if (
    tokens[lookAheadIndex].name == 'int' ||
    tokens[lookAheadIndex].name == 'char' ||
    tokens[lookAheadIndex].name == 'bool'
  ) {
    let token =tokens[lookAheadIndex].name;
    match(tokens[lookAheadIndex].name);
    return token;
  }
  return null ;
}


/****************************************************************************/
/* Name: Match */
/* Desc: Match the token with the next token in the list
 * take token from the list tokens
 * match it with the next token in the list
 * if it match then increment the index
 * else throw error
 * if the index is equal to the length of the list then return end
 * else return the next token
 * */
/****************************************************************************/
function match(token) {
  //console.log(token);
  if (token == tokens[lookAheadIndex].name) {
    if (lookAheadIndex < tokens.length) {
      lookAheadIndex++;
      return token;
    } else {
      return 'end';
    }
  } else {
    throw 'expected token ' + token;
  }
}

function matchRelop(token) {
  //console.log(token);
  if (token == '==' || token == '>=' || token == '<='
      || token == '!=' || token == '<' || token == '>') {
      lookAheadIndex++;
      return token;
  } else {
    throw 'expected relop ' ;
  }
}
/****************************************************************************/
/* Name: Match Digit */
/* Desc: Match the token with the next token in the list
 * take token from the list tokens
 * match it with the next token in the list
 * if it match then increment the index
 * else throw error
 * if the index is equal to the length of the list then return end
 * else return the next token
 * */
/****************************************************************************/
function matchDigit() {
  if (isNumeric(tokens[lookAheadIndex].name)) {
    if (lookAheadIndex < tokens.length) {
      let digit = tokens[lookAheadIndex].name;
      lookAheadIndex++;
    
      return digit;
    }
  } else {
    throw 'expected token ' + token;
  }
}

function conds(){
  if (tokens[lookAheadIndex].type == 'var'
         || tokens[lookAheadIndex].name == "true" 
         || tokens[lookAheadIndex].name == "false") {
    let condNode = cond();
    let condsNode= null ;
    if (tokens[lookAheadIndex].name == "&&"){
      match("&&");
      condsNode = conds();
      return new Stament("conds", [condNode, condsNode], false ,["and"] );

    }else if (tokens[lookAheadIndex].name == "||"){
      match("||");
      condsNode = conds();
      return new Stament("conds", [condNode, condsNode], false ,["or"] );

    }else{
      return new Stament("conds", [condNode,], false ,[""] );
    }

  }   
}


function cond(){
  console.log(tokens[lookAheadIndex]);

  if (tokens[lookAheadIndex].type == 'var') {
    let id = match(tokens[lookAheadIndex].name);
    let relop =matchRelop(tokens[lookAheadIndex].name);
    let digit = matchDigit();
    return new Stament("cond", [], true ,[id, relop, digit] );
  }else if (tokens[lookAheadIndex].name == "true"){
    match("true");

    return new Stament("cond", [], true ,["True", "", ""] );
  } else if (tokens[lookAheadIndex].name == "false"){
    match("false");
    return new Stament("cond", [], true ,["False", "", ""]);
  }
}



/****************************************************************************/
/* Name: pre_order */
/****************************************************************************/
function translate() {
  let code = translateStmt(parseTree, '');
  console.log(indentCount);
  code +="\n";
  parseTree.children.forEach((element) => {
    code += traverse(element);
  });
  return code;
}
/****************************************************************************/
/* Name: traverse */
/* input: node */
/****************************************************************************/
function traverse(node) {
  if (node == null) {
    return '';
  }
  let block = '';
  let indentation = "";
    for(var i=0 ; i <indentCount ; i++){
      indentation += "   ";
  }
  block = translateStmt(node, block)
  
  if (block != ""){
    //console.log(block);
    
    //block = indentation + block  + '\n';
    block += '\n';
    block = indentation + block ;
   }

  node.children.forEach((element) => {
    parsedStmt = traverse(element) ;
    block += parsedStmt ;
    //console.log(j);
    
  });

  return block;
}

function traverseConds(node,  opreator){
  if (node == null) {
    return '';
  }
  if (node.stmt_type == "conds"){
    let conditonStatment = "";
    node.children.forEach((element) => {
      conditonStatment += traverseConds(element, node.extra[0]) ;      
    });
    return conditonStatment;
  }else{
    let parsedStatment = " ";
    node.extra.forEach(element => {
      parsedStatment += element + " ";
    });
    parsedStatment += " "+ opreator + " ";
    return parsedStatment ;
  }
}


/****************************************************************************/
/* Name: translateStmt */
/* input: stmt , block */
/****************************************************************************/
function translateStmt(stmt, block) {
  let result = "";
  switch (stmt.stmt_type) {
    case 'if_stmt':
      result = 'if ';
      result += traverseConds(stmt.extra[0], "");      
      /*console.log(stmt.extra[0]);
      stmt.extra[0].children.forEach(condNode => {
        condNode.children.forEach((element) => {
          result += element + ' ';
          result += condNode.extra[0]??"";
        });
        
      });*/
       
      result += ' :';
      //block= '\t' + block;
      
      //result = result + '\n' ;
      //result = result.replaceAll('\n', '\n\t');
      indentCount ++ ;
      return  result ;

      case 'else_if_stmt':
        result = 'elif ';
        /*stmt.extra[0].children.forEach((element) => {
          result += element + ' ';
        });*/
        result += traverseConds(stmt.extra[0], "");      
        result += ' :';
        //block= '\t' + block;
        //result = result + '\n';
        //console.log(block);
        //result = result.replaceAll('\n', '\n\t');
        indentCount++;
        return  result;
    
      case 'else_stmt':
          result = 'else :';
        
          block= '\t' + block;
          //result = result + '\t\n' + block;
          //console.log(block);
          result = result.replaceAll('\n', '\n\t');
          indentCount ++ ;
          return  result;
    
    case 'main_stmt':
        result = 'if __name__ == "__main__":';
        //result = result + '\n' + block ;
        //result = result.replaceAll('\n', '\n\t');
        indentCount ++;
        return  result; //+ "\n";
    case 'asgmt':
        stmt.extra.forEach((element) => {
          result += element + ' ' ;
        });
        //result = result+ '\n' + block;
        //result = result.replaceAll('\n', '\n\t');
        return result ;//+ "\n";
     case 'end_block':
         indentCount -- ;
        // console.log(indentCount);
         return "";
    default:
      return "";
      break;
  }
}
/****************************************************************************/
/* Name: isNumeric */
/* input: value */
/****************************************************************************/
function isNumeric(value) {
  return /^-?\d+$/.test(value);
}
/****************************************************************************/
/* Name: Token */
/****************************************************************************/
class Token {
  constructor(token, type) {
    this.name = token;
    this.type = type;
  }
}
/****************************************************************************/
/* Name: Stament */
/****************************************************************************/
class Stament {
  constructor(stmt_type, children, isLeaf, extra) {
    this.stmt_type = stmt_type;
    this.children = children;
    this.isLeaf = isLeaf;
    this.extra = extra;

  }
}
const endBlock = new Stament('end_block', [], false, []);

