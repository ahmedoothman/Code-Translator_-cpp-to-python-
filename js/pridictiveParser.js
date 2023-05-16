
/****************************************************************************/
/* Name: main_stmt */
/****************************************************************************/
let indentCount = 0;
let lookAheadIndex = 0;
let parseTree;

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
      parseTree = new Stament('main_stmt', [child], []);
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
    tokens[lookAheadIndex].name == 'while' ||
    tokens[lookAheadIndex].name == 'for' ||
    tokens[lookAheadIndex].name == 'switch' ||
    tokens[lookAheadIndex].name == 'do' ||

    tokens[lookAheadIndex].type == 'var' ||
    tokens[lookAheadIndex].name == 'int' ||
    tokens[lookAheadIndex].name == 'char' ||
    tokens[lookAheadIndex].name == 'bool' 
    ) {
    let child = stmt();
    let children = stmts(); 
    return new Stament('stmts', [child, children], []);
  }
}

function stmt() {
  if (tokens[lookAheadIndex].name == 'if') {
    return if_stmt();
  } else if (tokens[lookAheadIndex].name == 'while'){
    return while_stmt();
  }
  else if(tokens[lookAheadIndex].name == 'for'){
    return for_stmt();
  }
  else if(tokens[lookAheadIndex].name == 'do'){
    return do_while_stmt();
  }
  else if(tokens[lookAheadIndex].name == 'switch'){
    return switch_case_stmt();
  }
  else if (tokens[lookAheadIndex].type == 'var' || 
      tokens[lookAheadIndex].name == 'int' || tokens[lookAheadIndex].name == 'char'
      || tokens[lookAheadIndex].name == 'bool') {
    let result = asgmt();
    return new Stament("stmt", [result], []);
  } else {
    throw 'expected statment';
  }
}

function if_stmt(){
  if (tokens[lookAheadIndex].name == 'if') {
    match('if');
    match('(');
    let condChild = conds();
    if (condChild == null){
      throw "expected condition inside if";
    }
    match(')');         
    match('{');
    let children = stmts();
    match('}');
    let elseIfChildren =elseif();
    let elseChildren = else_stmt();

    return new Stament("if_stmt", [children??emptyBloc,endBlock, elseIfChildren, elseChildren ,], [condChild]);
  }else{
    throw 'expected if';
  }
}

function elseif(){
  if (tokens[lookAheadIndex].name == 'else if') {
    match('else if');
    match('(');
    let condChild = conds();
    if (condChild == null){
      throw "expected condition inside else if";
    }
    match(')');
    match('{');
    let children = stmts();
    match('}');
    let elseIfChildren =elseif();
    return new Stament("else_if_stmt", [children??emptyBloc, endBlock , elseIfChildren ], [condChild]);
  }
}

function else_stmt(){
  if (tokens[lookAheadIndex].name == 'else') {
    match('else');
    match('{');
    let children = stmts();
    match('}');
    return new Stament("else_stmt", [children??emptyBloc, endBlock], []);
  }
}


function while_stmt(){
  if (tokens[lookAheadIndex].name == 'while') {
    match('while');
    match('(');
    let condChild = conds();
    if (condChild == null){
      throw "expected condition inside while";
    }
    match(')');         
    match('{');
    let children = stmts();
    match('}');

    return new Stament("while_stmt", [children??emptyBloc,endBlock], [condChild]);
  }else{
    throw 'expected while';
  }
}


function for_stmt(){
  if (tokens[lookAheadIndex].name == 'for') {
    match('for');
    match('(');
    let asgmtChild = asgmt();
    let condChild = conds();
    match(';');
    let stepChild = asgmt(true);
    match(')');         
    match('{');
    let children = stmts();
    match('}');

    return new Stament("for_stmt", [children??emptyBloc,endBlock], [condChild,asgmtChild]);
  }else{
    throw 'expected while';
  }
}



function do_while_stmt(){
  if (tokens[lookAheadIndex].name == 'do') {
    match('do');
    match('{');
    let children = stmts();
    match('}');
    match('while');
    match('(');
    let condChild = conds();
    if (condChild == null){
      throw "expected condition inside do while";
    }
    match(')');         
    match(';');
    return new Stament("do_while_stmt", [children, _generate_trailing_if(condChild),endBlock], []);
  }else{
    throw 'expected while';
  }
}

function _generate_trailing_if(condChild){
  return new Stament("if_stmt", [new Stament('asgmt', [], ["break;"]),
      endBlock], [condChild, true]);
}

// switch_stmt-> switch headnig { switch_stmts}
// switch_stmts -> switch_stmt switch_stmts | e

// switch_stmt -> case num : stmtm
function switch_case_stmt(){
  if (tokens[lookAheadIndex].name == 'switch') {
    match('switch');
    match('(');
    let varName  = '';
    if (tokens[lookAheadIndex].type == 'var'){
      varName = tokens[lookAheadIndex].name;
      match(tokens[lookAheadIndex].name);
    }else{
      throw "expected Variable after switch keyword";
    }
    match(')');
    match('{');
    let switchChildren = swtich_stmts(varName, false);    
    match('}');
    return new Stament("stmts", [switchChildren,], []);
  }else{
    throw 'expected switch';
  }
}

function swtich_stmts(varName , isElifChain){
  if (
    tokens[lookAheadIndex].name == 'case' ||
    tokens[lookAheadIndex].name == 'default' 
   
    ) {
    let child = swtich_stmt(varName, isElifChain);
    let children = swtich_stmts(varName, true); 
    
    return new Stament('stmts', [child, children], []);
  }
}

function swtich_stmt(varName ,isElifChain){
  if (tokens[lookAheadIndex].name == 'case') {
    match('case');
    let digit = matchDigit();
    match(':');
    let children = stmts();
    match("break");
    match(';');
    if (isElifChain){
        return new Stament("else_if_stmt", [children??emptyBloc, endBlock], [_generate_cond_switch(varName, digit)] );
    }else{
        return new Stament("if_stmt", [children??emptyBloc,endBlock], [_generate_cond_switch(varName, digit)]   );
    }
  }else if (tokens[lookAheadIndex].name == 'default'){
    match('default');
   
    match(':');
    let children = stmts();
    match('break');
    match(';');
    return new Stament("else_stmt", [children??emptyBloc, endBlock], []);
  } else {
    throw 'expected statment inside switch case';
  }
}

function _generate_cond_switch(varName, varValue){
  return  new Stament("conds", [ new Stament("cond", [] ,[varName, "==", varValue ] ,)], [""]) ;
}


/****************************************************************************/
/* Name: asgmt */
/****************************************************************************/
function asgmt(passSemiColumn = false) {
  if (tokens[lookAheadIndex].name == 'int' || tokens[lookAheadIndex].name == 'char'
     || tokens[lookAheadIndex].name == 'bool') {
    dataType();
    //let varaibleName = match(tokens[lookAheadIndex].name);
    let varaibleName = matchID();
    match('=');
    //let exprResult = matchDigit();
    let exprResult = expr() ;
   
   passSemiColumn? null :match(';');
    return new Stament("asgmt", [], [varaibleName, "=", exprResult]);

  }else if (tokens[lookAheadIndex].type == 'var' ) {
    let varaibleName = match(tokens[lookAheadIndex].name);
    if (tokens[lookAheadIndex].name == "+"){
      match("+");
      if(tokens[lookAheadIndex].name == "="){
        match("=");
        //let exprResult = matchDigit();
        let exprResult = expr();
        
        passSemiColumn? null :match(';');
        return new Stament("asgmt", [], [varaibleName, "+=", exprResult]);
      }else if(tokens[lookAheadIndex].name == "+"){
        match("+");
        passSemiColumn? null :match(';');
        return new Stament("asgmt", [], [varaibleName, "++"]);
      }
      
      

    }else if(tokens[lookAheadIndex].name == "-"){
      match("-");
      if(tokens[lookAheadIndex].name == "="){
        match("=");
        //let exprResult = matchDigit();
        let exprResult = expr();
        passSemiColumn? null :match(';');
        return new Stament("asgmt", [], [varaibleName, "-=", exprResult]);
      }else if(tokens[lookAheadIndex].name == "-"){
          match("-");
          passSemiColumn? null :match(';');
          return new Stament("asgmt", [], [varaibleName, "--"]);
      }
      

    }else if(tokens[lookAheadIndex].name == "*"){
      match("*");
      match("=");
        //let exprResult = matchDigit();
        let exprResult = expr();
      passSemiColumn? null :match(';');
      return new Stament("asgmt", [], [varaibleName, "*=", exprResult]);

    }else{ //to do add += -= *= ....
      match('=');
        //let exprResult = matchDigit();
        let exprResult = expr();
      passSemiColumn? null :match(';');
      return new Stament("asgmt", [], [varaibleName, "=", exprResult]);

    }

    //  let exprResult = expr();
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


function conds(){
  if (tokens[lookAheadIndex].type == 'var'
         || tokens[lookAheadIndex].name == "true" 
         || tokens[lookAheadIndex].name == "false") {
    let condNode = cond();
    let condsNode= null ;
    if (tokens[lookAheadIndex].name == "&&"){
      match("&&");
      condsNode = conds();
      return new Stament("conds", [condNode, condsNode] ,["and"] );

    }else if (tokens[lookAheadIndex].name == "||"){
      match("||");
      condsNode = conds();
      return new Stament("conds", [condNode, condsNode] ,["or"] );

    }else{
      return new Stament("conds", [condNode,] ,[""] );
    }

  }   
}


function cond(){
  if (tokens[lookAheadIndex].type == 'var') {
    let id = match(tokens[lookAheadIndex].name);
    let relop =matchRelop(tokens[lookAheadIndex].name);
    //let exprResult = matchDigit();
    let digit = expr();
    return new Stament("cond", [] ,[id, relop, digit] );
  }else if (tokens[lookAheadIndex].name == "true"){
    match("true");

    return new Stament("cond", [] ,["True", "", ""] );
  } else if (tokens[lookAheadIndex].name == "false"){
    match("false");
    return new Stament("cond", [] ,["False", "", ""]);
  }
}




function expr (){
  if (isNumeric(tokens[lookAheadIndex].name) ||
     tokens[lookAheadIndex].type == "var" ||  tokens[lookAheadIndex].name == '(') {
      
    let termResult = term();
    let restResult = rest();
  
  return  termResult + " " +  restResult ;
}else{
  throw "expected identifier digit or a bracket in assignment";
}
}


function term (){
  
  let factorResult = factor();
 
  let result1Result = rest1();
  return factorResult + " " +  result1Result ;

}


function rest (){
  if (tokens[lookAheadIndex].name == '+') {
    match('+'); 
    let termResult = term(); 
    let restResult = rest();
    return "+ "+ termResult + restResult;

  } else if (tokens[lookAheadIndex].name == '-') {
    match('-'); 
    let termResult = term(); 
    let restResult = rest();
    return "-" + termResult + " " +restResult ;

  }
  return "" ;
 
}


function rest1(){
  if (tokens[lookAheadIndex].name == '*') {
    match('*'); 
    let factorResult = factor(); 
    let rest1Result = rest1();
    return  "* "+ factorResult + " " + rest1Result;
  } else if (tokens[lookAheadIndex].name == '/') {
    match('/'); 
    let factorResult = factor(); 
    let rest1Result = rest1();
    return  "/" + factorResult + " " +  rest1Result;

  } 
  return "" ;
}


function factor(){
  if (isNumeric(tokens[lookAheadIndex].name)) {
    return matchDigit();

  }else if ( tokens[lookAheadIndex].type == "var") {
    let id = matchID();
    return  id;
  }else if (lookahead = '(') {
    match('(');
    let exprResult = expr();
    match(')');
    return "( " + exprResult + " )";
  }
  else{
    throw "expected number, digit or an expression in factor";
  }
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


function matchID() {
  if (tokens[lookAheadIndex].type == "var") {
    if (lookAheadIndex < tokens.length) {
      let id = tokens[lookAheadIndex].name;
      lookAheadIndex ++ ;
      return id;
    }
  } else {
    throw 'expected token ' + token;
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
  constructor(stmt_type, children, extra) {
    this.stmt_type = stmt_type;
    this.children = children;
    this.extra = extra;

  }
}
const endBlock = new Stament('end_block', [], []);

const emptyBloc = new Stament('asgmt', [], ["pass"]);











