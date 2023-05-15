/****************************************************************************/
/****************************************************************************/
function translate() {
    let code = translateStmt(parseTree, '');
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
      block += '\n';
      block = indentation + block ;
     }
  
    node.children.forEach((element) => {
      parsedStmt = traverse(element) ;
      block += parsedStmt ;
      
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
        if (stmt.extra[1] ?? false){
            result += "!( ";
        }
        result += traverseConds(stmt.extra[0], "");   
        if (stmt.extra[1] ?? false){
            result += " )";
        }   
        result += ' :';
        indentCount ++ ;
        return  result ;
  
      case 'else_if_stmt':
          result = 'elif ';
          result += traverseConds(stmt.extra[0], "");      
          result += ' :';
          indentCount++;
          return  result;
      
      case 'else_stmt':
            result = 'else :';
            block= '\t' + block;
            result = result.replaceAll('\n', '\n\t');
            indentCount ++ ;
            return  result;
      
      case 'main_stmt':
          result = 'if __name__ == "__main__":';
          indentCount ++;
          return  result; 
      case 'asgmt':
          stmt.extra.forEach((element) => {
            result += element + ' ' ;
          });
          return result ;
       
      case 'while_stmt':
          result = 'while ';
          result += traverseConds(stmt.extra[0], "");      
          result += ' :';
          indentCount ++ ;
          return  result ;
  
      case 'do_while_stmt':
        result = 'while True :';
        indentCount ++ ;
        return  result ;

      case 'for_stmt':
            result = 'for ';
            result += stmt.extra[1].extra[0];  
            result+= ' in range(';
            result+=stmt.extra[0].children[0].extra[2];
            result +=')'   
            result += ' :';
            indentCount ++ ;
            return  result ;  
  
      case 'end_block':
           indentCount -- ;
           return "";
      default:
        return "";
    }
  }