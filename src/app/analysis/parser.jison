%{
    const ParseNode = require('../models/ParseNode').default;
    const ErrorClass = require('../models/Error').default;
    const util = require('../utilities/util');
    const errors = [];
    exports.errors = errors;
%}

/* lexical grammar */
%lex
%x chain
%x chain_simp

%%
\s+                   /* skip whitespace */
"//"[^\n]+            /* SKIP COMMENT */
"/*"("*"(?!\/)|[^*])*"*/"   /* SKIP COMMENT */
"let"                 return 'LET';
"type"                return 'TYPE';
"const"               return 'CONST';
"console"             return 'CONSOLE';
"if"                  return 'IF';
"else"                return 'ELSE';
"switch"              return 'SWITCH';
"case"                return 'CASE';
"default"             return 'DEFAULT';
"while"               return 'WHILE';
"do"                  return 'DO';
"graficar_ts"         return 'GRAPH';
"for"                 return 'FOR';
"log"                 return 'LOG';
"in"                  return 'IN';
"of"                  return 'OF';
"break"               return 'BREAK';
"continue"            return 'CONTINUE';
"return"              return 'RETURN';
"string"              return 'TSTRING';
"number"              return 'TNUMBER';
"Push"                return 'PUSH';
"Pop"                 return 'POP';
"Length"              return 'LENGTH';
"boolean"             return 'TBOOLEAN';
"void"                return 'TVOID';
"null"                return 'NULL';
("true"|"false")      return 'BOOLEAN';
([a-zA-Z]|"_")([a-zA-Z]|[0-9]|"_")*    return 'IDENTIFIER';
[0-9]+"."?[0-9]*      return 'NUMBER';
"=="                  return 'JUSTAS';
"!="                  return 'OTHERTHAN';
"<="                  return 'LESSTHANOREQUALTO';
">="                  return 'GREATERTHANOREQUALTO';
"++"                  return 'INCREMENTSIGN';
"--"                  return 'DECREMENTSIGN';
"="                   return 'EQUAL';
"("                   return 'LPAREN';
")"                   return 'RPAREN';
"{"                   return 'LBRACE';
"}"                   return 'RBRACE';
"["                   return 'LBRACKET';
"]"                   return 'RBRACKET';
":"                   return 'COLON';
","                   return 'COMMA';
";"                   return 'SEMICOLON';
"."                   return 'POINT';
"**"                  return 'POW';
"*"                   return 'PORSIGN';
"/"                   return 'DIVISIONSIGN';
"-"                   return 'MINUSSIGN';
"+"                   return 'PLUSSIGN';
"%"                   return 'MODULUSSIGN';
"?"                   return 'QUESTIONINGSIGN';
"<"                   return 'LESSTHAN';
">"                   return 'GREATERTHAN';
"&&"                  return 'AND';
"||"                  return 'OR';
"!"                   return 'NOT';
["]                   this.begin("chain");
<chain>[^"\n]+        return 'CHAIN';
<chain>["]            this.popState();
[']                   this.begin("chain_simp");
<chain_simp>[^'\n]+   return 'CHAIN';
<chain_simp>[']       this.popState();
<<EOF>>               return 'EOF';

.                     {
                        errors.push(new ErrorClass(util.literal.errorType.LEXICAL, `No se reconoce el token: "${yytext}"`, yylloc.first_line, yylloc.first_column));
                    }
/lex

/* operator associations and precedence */

%right 'QUESTIONINGSIGN'
%left 'OR'
%left 'AND'
%left 'JUSTAS' 'OTHERTHAN'
%left 'LESSTHAN' 'GREATERTHAN' 'GREATERTHANOREQUALTO' 'LESSTHANOREQUALTO'
%left 'PLUSSIGN' 'MINUSSIGN'
%left 'PORSIGN' 'DIVISIONSIGN' 'MODULUSSIGN'
%right 'NOT'
%right 'POW'
%nonassoc 'INCREMENTSIGN' 'DECREMENTSIGN'
%left 'POINT'

%start expressions

%% /* language grammar */

expressions
    :   LSENTENCES EOF { return $1 };

LSENTENCES
    :   LSENTENCES SENTENCE { if($2){ $1.addChild($2); } $$ = $1; }
    |   SENTENCE { $$ = new ParseNode(null, null, 'SENTENCES', 'SENTENCES', null); if($1){ $$.addChild($1); } };

SENTENCE
    :   DECLARATION { $$ = $1; }
    |   ASSIGNMENT { $$ = $1; }
    |   TYPE_DECLARATION { $$ = $1; }
    |   STATEMENT_IF { $$ = $1; }
    |   STATEMENT_SWITCH { $$ = $1; }
    |   STATEMENT_WHILE { $$ = $1; }
    |   DO_WHILE { $$ = $1; }
    |   STATEMENT_FOR { $$ = $1; }
    |   INCREMENT SEMICOLON { $$ = $1; }
    |   DECREMENT SEMICOLON { $$ = $1; }
    |   FOR_IN { $$ = $1; }
    |   FOR_OF { $$ = $1; }
    |   FUNCTION_CALL SEMICOLON { $$ = $1; }
    |   PRINT { $$ = $1; }
    |   GRAPH_TS { $$ = $1; }
    |   STATEMENT_BREAK { $$ = $1; }
    |   STATEMENT_CONTINUE { $$ = $1; }
    |   STATEMENT_RETURN { $$ = $1; }
    |   ARRAY_FUNCTIONS SEMICOLON { $$ = $1; };

DECLARATION
    :   VARLET { $$ = $1; }
    |   VARCONST { $$ = $1; };

VARLET
    :   LET IDENTIFIER ENDLET { 
        if($3 != null){
            if($3.value != null){
                if(Array.isArray($3.value)){
                    $$ = new ParseNode(@2.first_line, @2.first_column, util.literal.operation.DECLARATION, $2, $3.type, false, $3.dynamic);
                    $$.childs = $3.value;
                }else{
                    $$ = new ParseNode(@2.first_line, @2.first_column, util.literal.operation.DECLARATION, $2, $3.type, false, $3.dynamic);
                    $$.addChild($3.value);
                }
            }else{
                $$ = new ParseNode(@2.first_line, @2.first_column, util.literal.operation.DECLARATION, $2, $3.type, false, $3.dynamic);
            } 
        }else{
            $$ = new ParseNode(@2.first_line, @2.first_column, util.literal.operation.DECLARATION, $2, util.literal.dataTypes.ANY, false, true);
        } 
    }
    |   error { console.log(`Error ${yytext}`); $$ = null; };

VARCONST
    :   CONST IDENTIFIER EQUAL EXPL SEMICOLON { $$ = new ParseNode(@2.first_line, @2.first_column, util.literal.operation.DECLARATION, $2, util.literal.dataTypes.ANY, true); $$.addChild($4); }
    |   CONST IDENTIFIER COLON DATATYPE EQUAL EXPL SEMICOLON { $$ = new ParseNode(@2.first_line, @2.first_column, util.literal.operation.DECLARATION, $2, $4, true); $$.addChild($6); }
    |   CONST IDENTIFIER COLON DATATYPE LBRACKET RBRACKET EQUAL EXPL SEMICOLON { $$ = new ParseNode(@2.first_line, @2.first_column, util.literal.operation.DECLARATION, $2, $4, true); $$.addChild($8); };

ENDLET
    :   SEMICOLON { $$ = null; }
    |   EQUAL EXPL SEMICOLON { $$ = new ParseNode(null, null, null, $2, util.literal.dataTypes.ANY, false, true); }
    |   COLON DATATYPE ENDDECLARATION { $$ = new ParseNode(null, null, null, $3, $2, false, false); };

DATATYPE
    :   TSTRING { $$ = util.literal.dataTypes.STRING; }
    |   TBOOLEAN { $$ = util.literal.dataTypes.BOOLEAN; }
    |   TNUMBER { $$ = util.literal.dataTypes.NUMBER; }
    |   TVOID { $$ = util.literal.dataTypes.VOID; }
    |   IDENTIFIER { $$ = $1; };

ENDDECLARATION
    :   SEMICOLON { $$ = null; }
    |   LBRACKET RBRACKET EQUAL EXPL SEMICOLON { $$ = $4; }
    |   EQUAL EXPL SEMICOLON { $$ = $2; };

ASSIGNMENT
    :   IDENTIFIER EQUAL EXPL SEMICOLON { $$ = new ParseNode(@1.first_line, @1.first_column, util.literal.operation.ASSIGNMENT, $1); $$.addChild($3); }
    |   PROPERTY_ACCESS EQUAL EXPL SEMICOLON { $$ = new ParseNode(@1.first_line, @1.first_column, util.literal.operation.ASSIGNMENT, util.literal.operation.ASSIGNMENT); $$.addChild($1); $$.addChild($3); };

LEXPL
    :   LEXPL COMMA EXPL { $1.push($3); $$ = $1; }
    |   EXPL { $$ = []; $$.push($1); };

EXPL
    :   EXPL OR EXPL { $$ = new ParseNode(@2.first_line, @2.first_column, util.literal.operation.OR, util.literal.operation.OR, null); $$.addChild($1); $$.addChild($3); }
    |   EXPL AND EXPL { $$ = new ParseNode(@2.first_line, @2.first_column, util.literal.operation.AND, util.literal.operation.AND, null); $$.addChild($1); $$.addChild($3); }
    |   NOT EXPL { $$ = new ParseNode(@1.first_line, @1.first_column, util.literal.operation.NOT, util.literal.operation.NOT, null); $$.addChild($2); }
    |   TERNARY { $$ = $1; }
    |   PROPERTY_ACCESS { $$ = $1; }
    |   EXPR { $$ = $1; };

EXPR
    :   EXPR LESSTHAN EXPR { $$ = new ParseNode(@2.first_line, @2.first_column, util.literal.operation.LESS_THAN, util.literal.operation.LESS_THAN, null); $$.addChild($1); $$.addChild($3); }
    |   EXPR GREATERTHAN EXPR { $$ = new ParseNode(@2.first_line, @2.first_column, util.literal.operation.GREATER_THAN, util.literal.operation.GREATER_THAN, null); $$.addChild($1); $$.addChild($3); }
    |   EXPR LESSTHANOREQUALTO EXPR { $$ = new ParseNode(@2.first_line, @2.first_column, util.literal.operation.LESS_THAN_OR_EQUAL_TO, util.literal.operation.LESS_THAN_OR_EQUAL_TO, null); $$.addChild($1); $$.addChild($3); }
    |   EXPR GREATERTHANOREQUALTO EXPR { $$ = new ParseNode(@2.first_line, @2.first_column, util.literal.operation.GREATER_THAN_OR_EQUAL_TO, util.literal.operation.GREATER_THAN_OR_EQUAL_TO, null); $$.addChild($1); $$.addChild($3); }
    |   EXPR JUSTAS EXPR { $$ = new ParseNode(@2.first_line, @2.first_column, util.literal.operation.JUST_AS, util.literal.operation.JUST_AS, null); $$.addChild($1); $$.addChild($3); }
    |   EXPR OTHERTHAN EXPR { $$ = new ParseNode(@2.first_line, @2.first_column, util.literal.operation.OTHER_THAN, util.literal.operation.OTHER_THAN, null); $$.addChild($1); $$.addChild($3); }
    |   EXP { $$ = $1; };

EXP
    :   EXP POW EXP { $$ = new ParseNode(@2.first_line, @2.first_column, util.literal.operation.POW, util.literal.operation.POW, null); $$.addChild($1); $$.addChild($3); }
    |   EXP MODULUSSIGN EXP { $$ = new ParseNode(@2.first_line, @2.first_column, util.literal.operation.MODULUS, util.literal.operation.MODULUS, null); $$.addChild($1); $$.addChild($3); }
    |   EXP DIVISIONSIGN EXP { $$ = new ParseNode(@2.first_line, @2.first_column, util.literal.operation.DIVISION, util.literal.operation.DIVISION, null); $$.addChild($1); $$.addChild($3); }
    |   EXP PORSIGN EXP { $$ = new ParseNode(@2.first_line, @2.first_column, util.literal.operation.MULTIPLICATION, util.literal.operation.MULTIPLICATION, null); $$.addChild($1); $$.addChild($3); }
    |   EXP MINUSSIGN EXP { $$ = new ParseNode(@2.first_line, @2.first_column, util.literal.operation.SUBTRACTION, util.literal.operation.SUBTRACTION, null); $$.addChild($1); $$.addChild($3); }
    |   EXP PLUSSIGN EXP { $$ = new ParseNode(@2.first_line, @2.first_column, util.literal.operation.ADDITION, util.literal.operation.ADDITION, null); $$.addChild($1); $$.addChild($3); }
    |   LPAREN EXPL RPAREN { $$ = $2; }
    |   INCREMENT { $$ = $1; }
    |   DECREMENT { $$ = $1; }
    |   ARRAY_ACCESS { $$ = $1; }
    |   FUNCTION_CALL { $$ = $1; }
    |   ARRAY { $$ = $1; }
    |   IDENTIFIER { $$ = new ParseNode(@1.first_line, @1.first_column, util.literal.dataTypes.VARIABLE, $1, null); }
    |   CHAIN { $$ = new ParseNode(@1.first_line, @1.first_column, util.literal.dataTypes.STRING, $1, null); }
    |   NUMBER  { $$ = new ParseNode(@1.first_line, @1.first_column, util.literal.dataTypes.NUMBER, Number($1), null); }
    |   BOOLEAN { $$ = new ParseNode(@1.first_line, @1.first_column, util.literal.dataTypes.BOOLEAN, ($1 === 'true'), null); }
    |   NULL { $$ = new ParseNode(@1.first_line, @1.first_column, util.literal.dataTypes.NULL, undefined, null); }
    |   DEFINITION { $$ = $1; };

INCREMENT
    :   EXP INCREMENTSIGN { $$ = new ParseNode(@2.first_line, @2.first_column, util.literal.operation.INCREMENT, util.literal.operation.INCREMENT); $$.addChild($1); };

DECREMENT
    :   EXP DECREMENTSIGN { $$ = new ParseNode(@2.first_line, @2.first_column, util.literal.operation.DECREMENT, util.literal.operation.DECREMENT); $$.addChild($1); };

TERNARY
    :   EXPL QUESTIONINGSIGN EXPL COLON EXPL { $$ = new ParseNode(@2.first_line, @2.first_column, util.literal.operation.TERNARY_OPERATOR, util.literal.operation.TERNARY_OPERATOR); $$.addChild($1); $$.addChild($3); $$.addChild($5); };

TYPE_DECLARATION
    :   TYPE IDENTIFIER EQUAL LBRACE LPARAMETERS RBRACE { $$ = new ParseNode(@2.first_line, @2.first_column, util.literal.operation.TYPE_DECLARATION, $2, util.literal.dataTypes.OBJECT); $$.childs = $5; };

LPARAMETERS
    :   LPARAMETERS COMMA PARAMETERS { $1.push($3); $$ = $1; }
    |   PARAMETERS { $$ = []; $$.push($1); };

PARAMETERS
    :   IDENTIFIER COLON DATATYPE { $$ = new ParseNode(@1.first_line, @1.first_column, null, $1, $3, false, false); }
    |   IDENTIFIER COLON DATATYPE LBRACKET RBRACKET { $$ = new ParseNode(@1.first_line, @1.first_column, null, $1, $3, false, false); }
    |   IDENTIFIER { $$ = new ParseNode(@1.first_line, @1.first_column, null, $1, util.literal.operation.ANY, false, true); };

STATEMENT_IF
    :   IF LPAREN EXPL RPAREN BODY_IF { $$ = new ParseNode(@1.first_line, @1.first_column, util.literal.operation.IF, util.literal.operation.IF); $$.addChild($3); if($5 != null){ $$.addChild($5); } }
    |   IF LPAREN EXPL RPAREN BODY_IF ELSE BODY_IF { $$ = new ParseNode(@1.first_line, @1.first_column, util.literal.operation.IF, util.literal.operation.IF); $$.addChild($3); if($5 != null){ $$.addChild($5); } let elseNode = new ParseNode(@6.first_line, @6.first_column, util.literal.operation.ELSE, util.literal.operation.ELSE); if($7 != null){ elseNode.addChild($7); $$.addChild(elseNode); } }
    |   IF LPAREN EXPL RPAREN BODY_IF ELSE STATEMENT_IF { $$ = new ParseNode(@1.first_line, @1.first_column, util.literal.operation.IF, util.literal.operation.IF); $$.addChild($3); if($5 != null){ $$.addChild($5); } let elseNode2 = new ParseNode(@6.first_line, @6.first_column, util.literal.operation.ELSE, util.literal.operation.ELSE); $$.addChild(elseNode2); $$.addChild($7); };

BODY_IF
    :   LBRACE RBRACE { $$ = null; }
    |   LBRACE LSENTENCES RBRACE { $$ = $2; };

STATEMENT_SWITCH
    :   SWITCH LPAREN EXPL RPAREN LBRACE RBRACE { $$ = new ParseNode(@1.first_line, @1.first_column, util.literal.operation.SWITCH, util.literal.operation.SWITCH); $$.addChild($3); }
    |   SWITCH LPAREN EXPL RPAREN LBRACE LCASES RBRACE { $$ = new ParseNode(@1.first_line, @1.first_column, util.literal.operation.SWITCH, util.literal.operation.SWITCH); $$.addChild($3); $$.addChild($6); };

LCASES
    :   LCASES CASES { $1.addChild($2); $$ = $1; }
    |   CASES { $$ = new ParseNode(null, null, util.literal.operation.LCASES, util.literal.operation.LCASES); $$.addChild($1); };

CASES
    :   CASE EXPL COLON { $$ = new ParseNode(@1.first_line, @1.first_column, util.literal.operation.CASE, util.literal.operation.CASE); }
    |   CASE EXPL COLON LSENTENCES { $$ = new ParseNode(@1.first_line, @1.first_column, util.literal.operation.CASE, util.literal.operation.CASE); $$.addChild($4); }
    |   DEFAULT COLON { $$ = new ParseNode(@1.first_line, @1.first_column, util.literal.operation.DEFAULT, util.literal.operation.DEFAULT); }
    |   DEFAULT COLON LSENTENCES { $$ = new ParseNode(@1.first_line, @1.first_column, util.literal.operation.DEFAULT, util.literal.operation.DEFAULT); $$.addChild($3); };

STATEMENT_WHILE
    :   WHILE LPAREN EXPL RPAREN LBRACE RBRACE { $$ = new ParseNode(@1.first_line, @1.first_column, util.literal.operation.WHILE, util.literal.operation.WHILE); $$.addChild($3); }
    |   WHILE LPAREN EXPL RPAREN LBRACE LSENTENCES RBRACE { $$ = new ParseNode(@1.first_line, @1.first_column, util.literal.operation.WHILE, util.literal.operation.WHILE); $$.addChild($3); $$.addChild($6); };

DO_WHILE
    :   DO LBRACE RBRACE WHILE LPAREN EXPL RPAREN SEMICOLON { $$ = new ParseNode(@1.first_line, @1.first_column, util.literal.operation.DO_WHILE, util.literal.operation.DO_WHILE); $$.addChild($6); }
    |   DO LBRACE LSENTENCES RBRACE WHILE LPAREN EXPL RPAREN SEMICOLON { $$ = new ParseNode(@1.first_line, @1.first_column, util.literal.operation.DO_WHILE, util.literal.operation.DO_WHILE); $$.addChild($3); $$.addChild($7); };

STATEMENT_FOR
    :   FOR LPAREN FOR_PARAMETER1 EXPL SEMICOLON INCREMENT RPAREN LBRACE RBRACE { $$ = new ParseNode(@1.first_line, @1.first_column, util.literal.operation.FOR, util.literal.operation.FOR); $$.addChild($3); $$.addChild($4); $$.addChild($6); }
    |   FOR LPAREN FOR_PARAMETER1 EXPL SEMICOLON DECREMENT RPAREN LBRACE RBRACE { $$ = new ParseNode(@1.first_line, @1.first_column, util.literal.operation.FOR, util.literal.operation.FOR); $$.addChild($3); $$.addChild($4); $$.addChild($6); }
    |   FOR LPAREN FOR_PARAMETER1 EXPL SEMICOLON INCREMENT RPAREN LBRACE LSENTENCES RBRACE { $$ = new ParseNode(@1.first_line, @1.first_column, util.literal.operation.FOR, util.literal.operation.FOR); $$.addChild($3); $$.addChild($4); $$.addChild($6); $$.addChild($9); }
    |   FOR LPAREN FOR_PARAMETER1 EXPL SEMICOLON DECREMENT RPAREN LBRACE LSENTENCES RBRACE { $$ = new ParseNode(@1.first_line, @1.first_column, util.literal.operation.FOR, util.literal.operation.FOR); $$.addChild($3); $$.addChild($4); $$.addChild($6); $$.addChild($9); }; 

FOR_PARAMETER1
    :   DECLARATION { $$ = $1; }
    |   ASSIGNMENT { $$ = $1; };

FOR_IN
    :   FOR LPAREN LET IDENTIFIER IN EXPL RPAREN LBRACE LSENTENCES RBRACE { $$ = new ParseNode(@1.first_line, @1.first_column, util.literal.operation.FOR_IN, util.literal.operation.FOR_IN); $$.addChild(new ParseNode(@4.first_line, @4.first_column, util.literal.operation.DECLARATION, $4)); $$.addChild($6); $$.addChild($9); }
    |   FOR LPAREN LET IDENTIFIER IN EXPL RPAREN LBRACE RBRACE { $$ = new ParseNode(@1.first_line, @1.first_column, util.literal.operation.FOR_IN, util.literal.operation.FOR_IN); $$.addChild(new ParseNode(@4.first_line, @4.first_column, util.literal.operation.DECLARATION, $4)); $$.addChild($6); };

FOR_OF
    :   FOR LPAREN LET IDENTIFIER OF EXPL RPAREN LBRACE RBRACE { $$ = new ParseNode(@1.first_line, @1.first_column, util.literal.operation.FOR_OF, util.literal.operation.FOR_OF); $$.addChild(new ParseNode(@4.first_line, @4.first_column, util.literal.operation.DECLARATION, $4)); $$.addChild($6); }
    |   FOR LPAREN LET IDENTIFIER OF EXPL RPAREN LBRACE LSENTENCES RBRACE { $$ = new ParseNode(@1.first_line, @1.first_column, util.literal.operation.FOR_OF, util.literal.operation.FOR_OF); $$.addChild(new ParseNode(@4.first_line, @4.first_column, util.literal.operation.DECLARATION, $4)); $$.addChild($6); $$.addChild($9); };

ARRAY_ACCESS
    :   IDENTIFIER LBRACKET EXP RBRACKET { $$ = new ParseNode(@1.first_line, @1.first_column, util.literal.operation.ARRAY_ACCESS, $1); $$.addChild($3); };

FUNCTION_CALL
    :   IDENTIFIER LPAREN RPAREN { $$ = new ParseNode(@1.first_line, @1.first_column, util.literal.operation.FUNCTION_CALL, $1); }
    |   IDENTIFIER LPAREN LEXPL RPAREN { $$ = new ParseNode(@1.first_line, @1.first_column, util.literal.operation.FUNCTION_CALL, $1); $$.childs = $3; };

PROPERTY_ACCESS
    :   ARRAY_FUNCTIONS { $$ = $1; }
    |   EXPL POINT EXPL { $$ = new ParseNode(@2.first_line, @2.first_column, util.literal.operation.PROPERTY_ACCESS, util.literal.operation.PROPERTY_ACCESS); $$.addChild($1); $$.addChild($3); };

PRINT
    :   CONSOLE POINT LOG LPAREN EXPL RPAREN SEMICOLON { $$ = new ParseNode(@1.first_line, @1.first_column, util.literal.operation.PRINT, util.literal.operation.PRINT); $$.addChild($5); };

GRAPH_TS
    :   GRAPH LPAREN RPAREN SEMICOLON { $$ = new ParseNode(@1.first_line, @1.first_column, util.literal.operation.GRAPH_TS, util.literal.operation.GRAPH_TS); };

STATEMENT_BREAK
    :   BREAK SEMICOLON { $$ = new ParseNode(@1.first_line, @1.first_column, util.literal.operation.BREAK, util.literal.operation.BREAK); };

STATEMENT_CONTINUE
    :   CONTINUE SEMICOLON { $$ = new ParseNode(@1.first_line, @1.first_column, util.literal.operation.CONTINUE, util.literal.operation.CONTINUE); };

STATEMENT_RETURN
    :   RETURN SEMICOLON { $$ = new ParseNode(@1.first_line, @1.first_column, util.literal.operation.RETURN, util.literal.operation.RETURN); }
    |   RETURN EXPL SEMICOLON { $$ = new ParseNode(@1.first_line, @1.first_column, util.literal.operation.RETURN, util.literal.operation.RETURN); $$.addChild($2); };

DEFINITION
    :   LBRACE LVALUES RBRACE { $$ = new ParseNode(@1.first_line, @1.first_column, util.literal.operation.DEFINITION, util.literal.operation.DEFINITION); $$.childs = $2; };

LVALUES
    :   LVALUES COMMA IDENTIFIER COLON EXPL { let decl2 = new ParseNode(@3.first_line, @3.first_column, util.literal.operation.PROPERTY_DECLARATION, $3); decl2.addChild($5); $1.push(decl2); $$ = $1; }
    |   IDENTIFIER COLON EXPL { $$ = []; let decl = new ParseNode(@1.first_line, @1.first_column, util.literal.operation.PROPERTY_DECLARATION, $1); decl.addChild($3); $$.push(decl); };

ARRAY
    :   LBRACKET RBRACKET { $$ = new ParseNode(@1.first_line, @1.first_column, util.literal.operation.ARRAY, util.literal.operation.ARRAY); }
    |   LBRACKET LEXPL RBRACKET { $$ = new ParseNode(@1.first_line, @1.first_column, util.literal.operation.ARRAY, util.literal.operation.ARRAY); $$.childs = $2; };

ARRAY_FUNCTIONS
    :   EXPL POINT PUSH LPAREN EXPL RPAREN { $$ = new ParseNode(@1.first_line, @1.first_column, util.literal.operation.PUSH, util.literal.operation.PUSH); $$.addChild($1); $$.addChild($5); }
    |   EXPL POINT POP LPAREN RPAREN { $$ = new ParseNode(@1.first_line, @1.first_column, util.literal.operation.POP, util.literal.operation.POP); $$.addChild($1); }
    |   EXPL POINT LENGTH { $$ = new ParseNode(@1.first_line, @1.first_column, util.literal.operation.LENGTH, util.literal.operation.LENGTH); $$.addChild($1); }; 