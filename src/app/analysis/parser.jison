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
"const"               return 'CONST';
"console"             return 'CONSOLE';
"log"                 return 'LOG';
"string"              return 'TSTRING';
"number"              return 'TNUMBER';
"boolean"             return 'TBOOLEAN';
"void"                return 'TVOID';
("true"|"false")      return 'BOOLEAN';
([a-zA-Z]|"_")([a-zA-Z]|[0-9]|"_")*    return 'IDENTIFIER';
[0-9]+"."?[0-9]*      return 'NUMBER';
"="                   return 'EQUAL';
"("                   return 'LPAREN';
")"                   return 'RPAREN';
"["                   return 'LBRACKET';
"]"                   return 'RBRACKET';
":"                   return 'COLON';
","                   return 'COMMA';
";"                   return 'SEMICOLON';
"."                   return 'POINT';
"*"                   return 'PORSIGN';
"/"                   return 'DIVISIONSIGN';
"-"                   return 'MINUSSIGN';
"+"                   return 'PLUSSIGN';
"++"                  return 'INCREMENTSIGN';
"--"                  return 'DECREMENTSIGN';
"%"                   return 'MODULUSSIGN';
"<"                   return 'LESSTHAN';
">"                   return 'GREATERTHAN';
"<="                  return 'LESSTHANOREQUALTO';
">="                  return 'GREATERTHANOREQUALTO';
"=="                  return 'JUSTAS';
"!="                  return 'OTHERTHAN';
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

%left 'OR'
%left 'AND'
%left 'JUSTAS' 'OTHERTHAN'
%left 'LESSTHAN' 'GREATERTHAN' 'GREATERTHANOREQUALTO' 'LESSTHANOREQUALTO'
%left 'PLUSSIGN' 'MINUSSIGN'
%left 'PORSIGN' 'DIVISIONSIGN' 'MODULUSSIGN'
%right 'NOT'

%start expressions

%% /* language grammar */

expressions
    :   LSENTENCES EOF { return $1 };

LSENTENCES
    :   LSENTENCES SENTENCE { $1.addChild($2); $$ = $1; }
    |   SENTENCE { $$ = new ParseNode(null, null, 'SENTENCES', 'SENTENCES', null); $$.addChild($1); };

SENTENCE
    :   DECLARATION { $$ = $1; };

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
    |   CONST IDENTIFIER EQUAL LBRACKET LEXPL RBRACKET SEMICOLON { $$ = new ParseNode(@2.first_line, @2.first_column, util.literal.operation.DECLARATION, $2, util.literal.dataTypes.ANY, true); $$.childs = $9; }
    |   CONST IDENTIFIER COLON DATATYPE EQUAL EXPL SEMICOLON { $$ = new ParseNode(@2.first_line, @2.first_column, util.literal.operation.DECLARATION, $2, $4, true); $$.addChild($6); }
    |   CONST IDENTIFIER COLON DATATYPE LBRACKET RBRACKET EQUAL LBRACKET LEXPL RBRACKET SEMICOLON { $$ = new ParseNode(@2.first_line, @2.first_column, util.literal.operation.DECLARATION, $2, $4, true); $$.childs = $9; };

ENDLET
    :   SEMICOLON { $$ = null; }
    |   EQUAL EXPL SEMICOLON { $$ = new ParseNode(null, null, null, $2, util.literal.dataTypes.ANY, false, true); }
    |   EQUAL LBRACKET LEXPL RBRACKET SEMICOLON { $$ = new ParseNode(null, null, null, $3, util.literal.dataTypes.ANY, false, true); }
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
    |   EQUAL EXPL SEMICOLON { $$ = $2; };

LEXPL
    :   LEXPL COMMA EXPL { $1.push($3); $$ = $1; }
    |   EXPL { $$ = []; $$.push($1); };

EXPL
    :   EXPL OR EXPL { $$ = new ParseNode(@2.first_line, @2.first_column, util.literal.operation.OR, util.literal.operation.OR, null); $$.addChild($1); $$.addChild($3); }
    |   EXPL AND EXPL { $$ = new ParseNode(@2.first_line, @2.first_column, util.literal.operation.AND, util.literal.operation.AND, null); $$.addChild($1); $$.addChild($3); }
    |   NOT EXPL { $$ = new ParseNode(@1.first_line, @1.first_column, util.literal.operation.NOT, util.literal.operation.NOT, null); $$.addChild($2); }
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
    :   EXP MODULUSSIGN EXP { $$ = new ParseNode(@2.first_line, @2.first_column, util.literal.operation.MODULUS, util.literal.operation.MODULUS, null); $$.addChild($1); $$.addChild($3); }
    |   EXP DIVISIONSIGN EXP { $$ = new ParseNode(@2.first_line, @2.first_column, util.literal.operation.DIVISION, util.literal.operation.DIVISION, null); $$.addChild($1); $$.addChild($3); }
    |   EXP PORSIGN EXP { $$ = new ParseNode(@2.first_line, @2.first_column, util.literal.operation.MULTIPLICATION, util.literal.operation.MULTIPLICATION, null); $$.addChild($1); $$.addChild($3); }
    |   EXP MINUSSIGN EXP { $$ = new ParseNode(@2.first_line, @2.first_column, util.literal.operation.SUBTRACTION, util.literal.operation.SUBTRACTION, null); $$.addChild($1); $$.addChild($3); }
    |   EXP PLUSSIGN EXP { $$ = new ParseNode(@2.first_line, @2.first_column, util.literal.operation.ADDITION, util.literal.operation.ADDITION, null); $$.addChild($1); $$.addChild($3); }
    |   LPAREN EXPL RPAREN { $$ = $2; }
    |   CHAIN { $$ = new ParseNode(@1.first_line, @1.first_column, util.literal.dataTypes.STRING, $1, null); }
    |   NUMBER  { $$ = new ParseNode(@1.first_line, @1.first_column, util.literal.dataTypes.NUMBER, Number($1), null); }
    |   BOOLEAN { $$ = new ParseNode(@1.first_line, @1.first_column, util.literal.dataTypes.BOOLEAN, ($1 === 'true'), null); };