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
    } else {
      return 'end';
    }
  } else {
    throw 'expected token ' + token;
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
      lookAheadIndex++;
      return tokens[lookAheadIndex].name;
    }
  } else {
    throw 'expected token ' + token;
  }
}
/****************************************************************************/
/* Name: maib_stmt */
/****************************************************************************/
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
      parseTree = new Stament('_', 'main_stmt', [child]);
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
  console.log(tokens[lookAheadIndex].name);
  console.log(
    tokens[lookAheadIndex].name == 'if' || tokens[lookAheadIndex].type == 'var'
  );

  if (
    tokens[lookAheadIndex].name == 'if' ||
    tokens[lookAheadIndex].type == 'var'
  ) {
    let child = stmt();
    let children = stmts();
    return new Stament('_', 'stmts', [child, children]);
  }
  return null;
}
/****************************************************************************/
/* Name: stmt */
/****************************************************************************/
function stmt() {
  if (tokens[lookAheadIndex].name == 'if') {
    match('if');
    match('(');
    //let condChild = cond();
    match(')');
    match('{');
    let children = stmts();
    condChild = children;
    match('}');
    return new Stament(new Stament(['x', '>', '3'], 'cond', []), 'if_cond', [
      children,
    ]);
  } else if (tokens[lookAheadIndex].type == 'var') {
    asgmt();
  } else {
    throw 'expected statment';
  }
}
/****************************************************************************/
/* Name: asgmt */
/****************************************************************************/
function asgmt() {
  if (tokens[lookAheadIndex].type == 'var') {
    dataType();
    match(tokens[lookAheadIndex].name);
    match('=');
    let digit = matchDigit();
    match(';');
    return new Stament(tokens[lookAheadIndex].type, 'asmgt', [
      tokens[lookAheadIndex].name,
      digit,
    ]);
    //expr();
  } else {
    throw 'expected identifier';
  }
}
/****************************************************************************/
/* Name: dataType */
/****************************************************************************/
function dataType() {
  if (
    tokens[lookAheadIndex].name == 'int' ||
    tokens[lookAheadIndex].name == 'char' ||
    tokens[lookAheadIndex].name == 'bool'
  ) {
    match(tokens[lookAheadIndex].name);
  }
}
/****************************************************************************/
/* Name: pre_order */
/****************************************************************************/
function pre_order() {
  let code = '';
  parseTree.children.forEach((element) => {
    code = traverse(element);
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
  node.children.forEach((element) => {
    block += traverse(element) + '\n';
  });
  block += translateStmt(node, block) + '\n';
  return block;
}
/****************************************************************************/
/* Name: translateStmt */
/* input: stmt , block */
/****************************************************************************/
function translateStmt(stmt, block) {
  console.log(stmt.stmt_type);
  switch (stmt.stmt_type) {
    case 'if_cond':
      let result = 'if ';
      stmt.tokens.tokens.forEach((element) => {
        result += element + ' ';
      });
      result += ' :';
      block.replace('\n', '\n   ');
      return result + '\n' + block;
    default:
      return '';
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
  constructor(tokens, stmt_type, children) {
    this.tokens = tokens;
    this.stmt_type = stmt_type;
    this.children = children;
  }
}
