%{
    const ParseNode = require('../models/ParseNode').default;
    const util = require('../utilities/util');
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
"for"                 return 'FOR';
"log"                 return 'LOG';
"string"              return 'TSTRING';
"number"              return 'TNUMBER';
"boolean"             return 'TBOOLEAN';
"void"                return 'TVOID';
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

%start expressions

%% /* language grammar */

expressions
    :   LSENTENCES EOF { return $1 };

LSENTENCES
    :   LSENTENCES SENTENCE { $1.addChild($2); $$ = $1; }
    |   SENTENCE { $$ = new ParseNode(null, null, 'SENTENCES', 'SENTENCES', null); $$.addChild($1); };

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
    |   DECREMENT SEMICOLON { $$ = $1; };

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
    };

VARCONST
    :   CONST IDENTIFIER EQUAL EXPL SEMICOLON { $$ = new ParseNode(@2.first_line, @2.first_column, util.literal.operation.DECLARATION, $2, util.literal.dataTypes.ANY, true); $$.addChild($4); }
    |   CONST IDENTIFIER EQUAL LBRACKET RBRACKET SEMICOLON { $$ = new ParseNode(@2.first_line, @2.first_column, util.literal.operation.DECLARATION, $2, util.literal.dataTypes.ANY, true); $$.childs = [null]; }
    |   CONST IDENTIFIER EQUAL LBRACKET LEXPL RBRACKET SEMICOLON { $$ = new ParseNode(@2.first_line, @2.first_column, util.literal.operation.DECLARATION, $2, util.literal.dataTypes.ANY, true); $$.childs = $9; }
    |   CONST IDENTIFIER COLON DATATYPE EQUAL EXPL SEMICOLON { $$ = new ParseNode(@2.first_line, @2.first_column, util.literal.operation.DECLARATION, $2, $4, true); $$.addChild($6); }
    |   CONST IDENTIFIER COLON DATATYPE LBRACKET RBRACKET EQUAL LBRACKET LEXPL RBRACKET SEMICOLON { $$ = new ParseNode(@2.first_line, @2.first_column, util.literal.operation.DECLARATION, $2, $4, true); $$.childs = $9; }
    |   CONST IDENTIFIER COLON DATATYPE LBRACKET RBRACKET EQUAL LBRACKET RBRACKET SEMICOLON { $$ = new ParseNode(@2.first_line, @2.first_column, util.literal.operation.DECLARATION, $2, $4, true); $$.childs = [null]; };

ENDLET
    :   SEMICOLON { $$ = null; }
    |   EQUAL EXPL SEMICOLON { $$ = new ParseNode(null, null, null, $2, util.literal.dataTypes.ANY, false, true); }
    |   EQUAL LBRACKET LEXPL RBRACKET SEMICOLON { $$ = new ParseNode(null, null, null, $3, util.literal.dataTypes.ANY, false, true); }
    |   EQUAL LBRACKET RBRACKET SEMICOLON { $$ = new ParseNode(null, null, null, [null], util.literal.dataTypes.ANY, false, true); }
    |   COLON DATATYPE ENDDECLARATION { $$ = new ParseNode(null, null, null, $3, $2, false, false); };

DATATYPE
    :   TSTRING { $$ = util.literal.dataTypes.STRING; }
    |   TBOOLEAN { $$ = util.literal.dataTypes.BOOLEAN; }
    |   TNUMBER { $$ = util.literal.dataTypes.NUMBER; }
    |   TVOID { $$ = util.literal.dataTypes.VOID; }
    |   IDENTIFIER { $$ = $1; };

ENDDECLARATION
    :   SEMICOLON { $$ = null; }
    |   LBRACKET RBRACKET EQUAL LBRACKET LEXPL RBRACKET SEMICOLON { $$ = $5; }
    |   LBRACKET RBRACKET EQUAL LBRACKET RBRACKET SEMICOLON { $$ = [null]; }
    |   EQUAL EXPL SEMICOLON { $$ = $2; };

ASSIGNMENT
    :   IDENTIFIER EQUAL EXPL SEMICOLON { $$ = new ParseNode(@1.first_line, @1.first_column, util.literal.operation.ASSIGNMENT, $1); $$.addChild($3); }
    |   IDENTIFIER EQUAL LBRACKET LEXPL RBRACKET SEMICOLON { $$ = new ParseNode(@1.first_line, @1.first_column, util.literal.operation.ASSIGNMENT, $1); $$.childs = $4; }
    |   IDENTIFIER EQUAL LBRACKET RBRACKET SEMICOLON { $$ = new ParseNode(@1.first_line, @1.first_column, util.literal.operation.ASSIGNMENT, $1); $$.childs = [null]; };

LEXPL
    :   LEXPL COMMA EXPL { $1.push($3); $$ = $1; }
    |   EXPL { $$ = []; $$.push($1); };

EXPL
    :   EXPL OR EXPL { $$ = new ParseNode(@2.first_line, @2.first_column, util.literal.operation.OR, util.literal.operation.OR, null); $$.addChild($1); $$.addChild($3); }
    |   EXPL AND EXPL { $$ = new ParseNode(@2.first_line, @2.first_column, util.literal.operation.AND, util.literal.operation.AND, null); $$.addChild($1); $$.addChild($3); }
    |   NOT EXPL { $$ = new ParseNode(@1.first_line, @1.first_column, util.literal.operation.NOT, util.literal.operation.NOT, null); $$.addChild($2); }
    |   TERNARY { $$ = $1; }
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
    |   IDENTIFIER { $$ = new ParseNode(@1.first_line, @1.first_column, util.literal.dataTypes.VARIABLE, $1, null); }
    |   CHAIN { $$ = new ParseNode(@1.first_line, @1.first_column, util.literal.dataTypes.STRING, $1, null); }
    |   NUMBER  { $$ = new ParseNode(@1.first_line, @1.first_column, util.literal.dataTypes.NUMBER, Number($1), null); }
    |   BOOLEAN { $$ = new ParseNode(@1.first_line, @1.first_column, util.literal.dataTypes.BOOLEAN, ($1 === 'true'), null); };

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