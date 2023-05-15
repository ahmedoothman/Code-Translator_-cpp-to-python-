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
       
      case 'while_stmt':
          result = 'while ';
          result += traverseConds(stmt.extra[0], "");      
          result += ' :';
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
          // console.log(indentCount);
           return "";
      default:
        return "";
        break;
    }
  }