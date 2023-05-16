
## Project strengths :

-   Translate statements in C++ that don’t exist in Python (e.g. do-while statements and switch case statements)
    
-   Detect syntax errors in source code
    
-   Detect relations between complex statements (e.g. for statement inside while statement inside if statement,.etc )
    
-   Detect relations between compound conditions (e.g. A&&B || C)
    
-   Responsive and user-friendly UI
    
-   Portable
    

## Project limitations:

-   The translator can’t detect semantic errors in the source code
    
-   Translate for-statement with a single step and single increment variable

## CFG:

main_stmt -> int main ( ) { stmts }

stmts-> stmt stmts | e

Stmt -> asgmt_stmt| if_stmt | while_stmt |switch_case | do_while | for_stmt

Asgmt_stmt -> id = expr ;

if_stmt -> if (cond) { stmts } elifs els

elifs -> elif elifs | e

elif -> elif {stmts}

els -> else {stmts}

while_stmt -> while(conds){stmts}

do_while -> do{stmts}while(conds)

For_stmt -> for(asmgt conds ;id ++){stmts}

Switch_case -> switch(id){ switch_body}

Switch_body -> switch_line Switch_body | default_line | e

switch_line -> case digit : stmts break ;

Conds -> cond logicOpr conds | e

logicOpr -> && | || | e

Cond -> id relop digit

Digit -> 0|...|9

Id -> a|...|z|A|....|Z