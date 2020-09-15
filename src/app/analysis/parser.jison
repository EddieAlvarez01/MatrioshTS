%{
    const ParseNode = require('../models/ParseNode').default;
    const ErrorClass = require('../models/Error').default;
    const util = require('../utilities/util');
    let errors = [];
    exports.errors = errors;
    const her = [];
    let nodesFunctions = [];
    let MapNames = new Map();
    let flagFunction = false;

    //Stringing of an array
    function ConcatInstructions(childs){
        let cString = '';
        childs.forEach(item => {
            cString += item.traduction;
        });
        return cString;
    }


    //inherit father's name
    function FatherName(father){
        if(her.length > 0){
            let name = '';
            her.forEach((item) => {
                name += `${item}_`;
            });
            her.push(father);
            name += father;
            return name;
        }
        her.push(father);
        return father;
    }

    //add function nodes if you are in a function
    function AddFunctionNodes(node){
        if(her.length > 0){
            nodesFunctions.push(node);
        }
    }

    //replaces translation with inheritance
    function TraductionReplace(node){
        MapNames.forEach((item, key) => {
            node.traduction = node.traduction.replaceAll(`${key}(`, `${item}(`);
        });
        nodesFunctions.forEach((item) => {
            let name = MapNames.get(item.value);
            if(name != undefined){
                item.value = name;
            }
        });
        MapNames.clear();
        nodesFunctions = [];
    }

%}

/* lexical grammar */
%lex

%%
\s+                   /* skip whitespace */
"//"[^\n]*            /* SKIP COMMENT */
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
"function"            return 'FUNCTION';
("true"|"false")      return 'BOOLEAN';
([a-zA-Z]|"_")([a-zA-Z]|[0-9]|"_")*    return 'IDENTIFIER';
[0-9]+"."?[0-9]*      return 'NUMBER';
"\""(?:[^"\\]|\\.)*"\"" return 'CHAIN';
"'"(?:[^'\\]|\\.)*"'" return 'CHAIN';
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
    :   LSENTENCES SENTENCE { if($2){ $1.addChild($2); $1.traduction += `\n${$2.traduction}`; if($2.her != undefined){ $1.her += `\n${$2.her}`; } } $$ = $1; }
    |   SENTENCE { $$ = new ParseNode(null, null, 'SENTENCES', 'SENTENCES', null, null, null, '', null, ''); if($1){ $$.addChild($1); $$.traduction = $1.traduction; if($1.her != undefined){ $$.her = $1.her; } } };

SENTENCE
    :   DECLARATION { $$ = $1; }
    |   ASSIGNMENT { $$ = $1; }
    |   TYPE_DECLARATION { $$ = $1; }
    |   STATEMENT_IF { $$ = $1; }
    |   STATEMENT_SWITCH { $$ = $1; }
    |   STATEMENT_WHILE { $$ = $1; }
    |   DO_WHILE { $$ = $1; }
    |   STATEMENT_FOR { $$ = $1; }
    |   INCREMENT SEMICOLON { $1.traduction += ';'; $$ = $1; }
    |   DECREMENT SEMICOLON { $1.traduction += ';'; $$ = $1; }
    |   FOR_IN { $$ = $1; }
    |   FOR_OF { $$ = $1; }
    |   FUNCTION_CALL SEMICOLON { $$ = $1; $$.traduction += ';'; AddFunctionNodes($1); }
    |   PRINT { $$ = $1; }
    |   GRAPH_TS { $$ = $1; }
    |   STATEMENT_BREAK { $$ = $1; }
    |   STATEMENT_CONTINUE { $$ = $1; }
    |   STATEMENT_RETURN { $$ = $1; }
    |   ARRAY_FUNCTIONS SEMICOLON { $$.traduction += ';'; $$ = $1; }
    |   FUNCTIONS { if(her.length > 0){ $1.her = $1.traduction; $1.traduction = ''; }else{ TraductionReplace($1); } $$ = $1; }
    |   error { if(yytext != ';'){ errors.push(new ErrorClass(util.literal.errorType.SYNTACTIC, `Error de sintaxis '${yytext}'`, this._$.first_line, this._$.first_column)); } $$ = null; };

DECLARATION
    :   VARLET { $$ = $1; }
    |   VARCONST { $$ = $1; };

VARLET
    :   LET IDENTIFIER ENDLET { 
        if($3 != null){
            if($3.value != null){
                if(Array.isArray($3.value)){
                    $$ = new ParseNode(@2.first_line, @2.first_column, util.literal.operation.DECLARATION, $2, $3.type, false, $3.dynamic, `let ${$2}${$3.traduction}`);
                    $$.childs = $3.value;
                }else{
                    $$ = new ParseNode(@2.first_line, @2.first_column, util.literal.operation.DECLARATION, $2, $3.type, false, $3.dynamic, `let ${$2}${$3.traduction}`);
                    $$.addChild($3.value);
                }
            }else{
                $$ = new ParseNode(@2.first_line, @2.first_column, util.literal.operation.DECLARATION, $2, $3.type, false, $3.dynamic, `let ${$2}${$3.traduction}`);
            } 
        }else{
            $$ = new ParseNode(@2.first_line, @2.first_column, util.literal.operation.DECLARATION, $2, util.literal.dataTypes.ANY, false, true, `let ${$2};`);
        } 
    };

VARCONST
    :   CONST IDENTIFIER EQUAL EXPL SEMICOLON { $$ = new ParseNode(@2.first_line, @2.first_column, util.literal.operation.DECLARATION, $2, util.literal.dataTypes.ANY, true, null, `const ${$2} = ${$4.traduction};`); $$.addChild($4); }
    |   CONST IDENTIFIER COLON DATATYPE EQUAL EXPL SEMICOLON { $$ = new ParseNode(@2.first_line, @2.first_column, util.literal.operation.DECLARATION, $2, $4, true, null, `const ${$2}: ${$4} = ${$6.traduction};`, false); $$.addChild($6); }
    |   CONST IDENTIFIER COLON DATATYPE LBRACKET RBRACKET EQUAL EXPL SEMICOLON { $$ = new ParseNode(@2.first_line, @2.first_column, util.literal.operation.DECLARATION, $2, $4, true, null, `const ${$2}: ${$4}[] = ${$8.traduction};`, true); $$.addChild($8); };

ENDLET
    :   SEMICOLON { $$ = null; }
    |   EQUAL EXPL SEMICOLON { $$ = new ParseNode(null, null, null, $2, util.literal.dataTypes.ANY, false, true, ` = ${$2.traduction};`); }
    |   COLON DATATYPE ENDDECLARATION { $$ = new ParseNode(null, null, null, $3, $2, false, false); if($3){ $$.traduction = `: ${$2}${$3.traduction}`; $$.array = $3.array; }else{ $$.traduction = `: ${$2};`; $$.array = false; } };

DATATYPE
    :   TSTRING { $$ = util.literal.dataTypes.STRING; }
    |   TBOOLEAN { $$ = util.literal.dataTypes.BOOLEAN; }
    |   TNUMBER { $$ = util.literal.dataTypes.NUMBER; }
    |   TVOID { $$ = util.literal.dataTypes.VOID; }
    |   IDENTIFIER { $$ = $1; };

ENDDECLARATION
    :   SEMICOLON { $$ = null; }
    |   LBRACKET RBRACKET EQUAL EXPL SEMICOLON { $$ = $4; $$.array = true; $$.traduction = `[] = ${$4.traduction};`; }
    |   LBRACKET RBRACKET SEMICOLON { $$ = new ParseNode(null, null, null, null, null, null, null, `[];`, true); }
    |   EQUAL EXPL SEMICOLON { $$ = $2; $$.array = false; $$.traduction = ` = ${$2.traduction};`; };

ASSIGNMENT
    :   IDENTIFIER EQUAL EXPL SEMICOLON { $$ = new ParseNode(@1.first_line, @1.first_column, util.literal.operation.ASSIGNMENT, $1, null, null, null, `${$1} = ${$3.traduction};`); $$.addChild($3); }
    |   PROPERTY_ACCESS EQUAL EXPL SEMICOLON { $$ = new ParseNode(@1.first_line, @1.first_column, util.literal.operation.ASSIGNMENT, util.literal.operation.ASSIGNMENT, null, null, null, `${$1.traduction} = ${$3.traduction};`); $$.addChild($1); $$.addChild($3); };

LEXPL
    :   LEXPL COMMA EXPL { $3.traduction = `, ${$3.traduction}`; $1.push($3); $$ = $1; }
    |   EXPL { $$ = []; $$.push($1); };

EXPL
    :   EXPL OR EXPL { $$ = new ParseNode(@2.first_line, @2.first_column, util.literal.operation.OR, util.literal.operation.OR, null, null, null, `${$1.traduction} || ${$3.traduction}`); $$.addChild($1); $$.addChild($3); }
    |   EXPL AND EXPL { $$ = new ParseNode(@2.first_line, @2.first_column, util.literal.operation.AND, util.literal.operation.AND, null, null, null, `${$1.traduction} && ${$3.traduction}`); $$.addChild($1); $$.addChild($3); }
    |   NOT EXPL { $$ = new ParseNode(@1.first_line, @1.first_column, util.literal.operation.NOT, util.literal.operation.NOT, null, null, null, `!${$2.traduction}`); $$.addChild($2); }
    |   TERNARY { $$ = $1; }
    |   EXPR { $$ = $1; };

EXPR
    :   EXPR LESSTHAN EXPR { $$ = new ParseNode(@2.first_line, @2.first_column, util.literal.operation.LESS_THAN, util.literal.operation.LESS_THAN, null, null, null, `${$1.traduction} < ${$3.traduction}`); $$.addChild($1); $$.addChild($3); }
    |   EXPR GREATERTHAN EXPR { $$ = new ParseNode(@2.first_line, @2.first_column, util.literal.operation.GREATER_THAN, util.literal.operation.GREATER_THAN, null, null, null, `${$1.traduction} > ${$3.traduction}`); $$.addChild($1); $$.addChild($3); }
    |   EXPR LESSTHANOREQUALTO EXPR { $$ = new ParseNode(@2.first_line, @2.first_column, util.literal.operation.LESS_THAN_OR_EQUAL_TO, util.literal.operation.LESS_THAN_OR_EQUAL_TO, null, null, null, `${$1.traduction} <= ${$3.traduction}`); $$.addChild($1); $$.addChild($3); }
    |   EXPR GREATERTHANOREQUALTO EXPR { $$ = new ParseNode(@2.first_line, @2.first_column, util.literal.operation.GREATER_THAN_OR_EQUAL_TO, util.literal.operation.GREATER_THAN_OR_EQUAL_TO, null, null, null, `${$1.traduction} >= ${$3.traduction}`); $$.addChild($1); $$.addChild($3); }
    |   EXPR JUSTAS EXPR { $$ = new ParseNode(@2.first_line, @2.first_column, util.literal.operation.JUST_AS, util.literal.operation.JUST_AS, null, null, null, `${$1.traduction} == ${$3.traduction}`); $$.addChild($1); $$.addChild($3); }
    |   EXPR OTHERTHAN EXPR { $$ = new ParseNode(@2.first_line, @2.first_column, util.literal.operation.OTHER_THAN, util.literal.operation.OTHER_THAN, null, null, null, `${$1.traduction} != ${$3.traduction}`); $$.addChild($1); $$.addChild($3); }
    |   EXP { $$ = $1; };

EXP
    :   EXP POW EXP { $$ = new ParseNode(@2.first_line, @2.first_column, util.literal.operation.POW, util.literal.operation.POW, null, null, null, `${$1.traduction} ** ${$3.traduction}`); $$.addChild($1); $$.addChild($3); }
    |   EXP MODULUSSIGN EXP { $$ = new ParseNode(@2.first_line, @2.first_column, util.literal.operation.MODULUS, util.literal.operation.MODULUS, null, null, null, `${$1.traduction} % ${$3.traduction}`); $$.addChild($1); $$.addChild($3); }
    |   EXP DIVISIONSIGN EXP { $$ = new ParseNode(@2.first_line, @2.first_column, util.literal.operation.DIVISION, util.literal.operation.DIVISION, null, null, null, `${$1.traduction} / ${$3.traduction}`); $$.addChild($1); $$.addChild($3); }
    |   EXP PORSIGN EXP { $$ = new ParseNode(@2.first_line, @2.first_column, util.literal.operation.MULTIPLICATION, util.literal.operation.MULTIPLICATION, null, null, null, `${$1.traduction} * ${$3.traduction}`); $$.addChild($1); $$.addChild($3); }
    |   EXP MINUSSIGN EXP { $$ = new ParseNode(@2.first_line, @2.first_column, util.literal.operation.SUBTRACTION, util.literal.operation.SUBTRACTION, null, null, null, `${$1.traduction} - ${$3.traduction}`); $$.addChild($1); $$.addChild($3); }
    |   EXP PLUSSIGN EXP { $$ = new ParseNode(@2.first_line, @2.first_column, util.literal.operation.ADDITION, util.literal.operation.ADDITION, null, null, null, `${$1.traduction} + ${$3.traduction}`); $$.addChild($1); $$.addChild($3); }
    |   MINUSSIGN EXP { $$ = new ParseNode(@1.first_line, @1.first_column, util.literal.operation.UNARY_MINUS, util.literal.operation.UNARY_MINUS, null, null, null, `-${$2.traduction}`); $$.addChild($2); }
    |   LPAREN EXPL RPAREN { $$ = $2; $$.traduction = `(${$2.traduction})`; }
    |   INCREMENT { $$ = $1; }
    |   DECREMENT { $$ = $1; }
    |   ARRAY_ACCESS { $$ = $1; }
    |   FUNCTION_CALL { $$ = $1; AddFunctionNodes($1); }
    |   PROPERTY_ACCESS { $$ = $1; }
    |   ARRAY { $$ = $1; }
    |   IDENTIFIER { $$ = new ParseNode(@1.first_line, @1.first_column, util.literal.dataTypes.VARIABLE, $1, null, null, null, $1); }
    |   CHAIN { $$ = new ParseNode(@1.first_line, @1.first_column, util.literal.dataTypes.STRING, $1.slice(1, $1.length - 1), null, null, null, $1); }
    |   NUMBER  { $$ = new ParseNode(@1.first_line, @1.first_column, util.literal.dataTypes.NUMBER, Number($1), null, null, null, $1); }
    |   BOOLEAN { $$ = new ParseNode(@1.first_line, @1.first_column, util.literal.dataTypes.BOOLEAN, ($1 === 'true'), null, null, null, $1); }
    |   NULL { $$ = new ParseNode(@1.first_line, @1.first_column, util.literal.dataTypes.NULL, undefined, null, null, null, $1); }
    |   DEFINITION { $$ = $1; };

INCREMENT
    :   EXP INCREMENTSIGN { $$ = new ParseNode(@2.first_line, @2.first_column, util.literal.operation.INCREMENT, util.literal.operation.INCREMENT, null, null, null, `${$1.traduction}++`); $$.addChild($1); };

DECREMENT
    :   EXP DECREMENTSIGN { $$ = new ParseNode(@2.first_line, @2.first_column, util.literal.operation.DECREMENT, util.literal.operation.DECREMENT, null, null, null, `${$1.traduction}--`); $$.addChild($1); };

TERNARY
    :   EXPL QUESTIONINGSIGN EXPL COLON EXPL { $$ = new ParseNode(@2.first_line, @2.first_column, util.literal.operation.TERNARY_OPERATOR, util.literal.operation.TERNARY_OPERATOR, null, null, null, `${$1.traduction} ? ${$3.traduction} : ${$5.traduction}`); $$.addChild($1); $$.addChild($3); $$.addChild($5); };

TYPE_DECLARATION
    :   TYPE IDENTIFIER EQUAL LBRACE LPARAMETERS RBRACE { $$ = new ParseNode(@2.first_line, @2.first_column, util.literal.operation.TYPE_DECLARATION, $2, util.literal.dataTypes.OBJECT, null, null, `type ${$2} = {\n${ConcatInstructions($5)}\n}`); $$.childs = $5; }
    |   TYPE IDENTIFIER EQUAL LBRACE LPARAMETERS COMMA RBRACE { $$ = new ParseNode(@2.first_line, @2.first_column, util.literal.operation.TYPE_DECLARATION, $2, util.literal.dataTypes.OBJECT, null, null, `type ${$2} = {\n${ConcatInstructions($5)},\n}`); $$.childs = $5; }
    |   TYPE IDENTIFIER EQUAL LBRACE LPARAMETERS SEMICOLON RBRACE { $$ = new ParseNode(@2.first_line, @2.first_column, util.literal.operation.TYPE_DECLARATION, $2, util.literal.dataTypes.OBJECT, null, null, `type ${$2} = {\n${ConcatInstructions($5)};\n}`); $$.childs = $5; };

LPARAMETERS
    :   LPARAMETERS COMMA PARAMETERS { $3.traduction = `,\n\t${$3.traduction}`; $1.push($3); $$ = $1; }
    |   LPARAMETERS SEMICOLON PARAMETERS { $3.traduction = `;\n\t${$3.traduction}`; $1.push($3); $$ = $1; }
    |   PARAMETERS { $$ = []; $1.traduction = `\t${$1.traduction}`; $$.push($1); };

PARAMETERS
    :   IDENTIFIER COLON DATATYPE { $$ = new ParseNode(@1.first_line, @1.first_column, null, $1, $3, false, false, `${$1}: ${$3}`); }
    |   IDENTIFIER COLON DATATYPE LBRACKET RBRACKET { $$ = new ParseNode(@1.first_line, @1.first_column, null, $1, $3, false, false, `${$1}: ${$3}[]`, true); }
    |   IDENTIFIER { $$ = new ParseNode(@1.first_line, @1.first_column, null, $1, util.literal.operation.ANY, false, true, `${$1}`); };

STATEMENT_IF
    :   IF LPAREN EXPL RPAREN BODY_IF { $$ = new ParseNode(@1.first_line, @1.first_column, util.literal.operation.IF, util.literal.operation.IF, null, null, null,`if(${$3.traduction})`); $$.addChild($3); if($5 != null){ $$.traduction += $5.traduction; $$.addChild($5); }else{ $$.traduction += '{\n}'; } }
    |   IF LPAREN EXPL RPAREN BODY_IF ELSE BODY_IF { $$ = new ParseNode(@1.first_line, @1.first_column, util.literal.operation.IF, util.literal.operation.IF, null, null, null, `if(${$3.traduction})`); $$.addChild($3); if($5 != null){ $$.traduction += $5.traduction + 'else'; $$.addChild($5); }else{ $$.traduction += '{\n}else'; } let elseNode = new ParseNode(@6.first_line, @6.first_column, util.literal.operation.ELSE, util.literal.operation.ELSE); if($7 != null){ $$.traduction += $7.traduction; elseNode.addChild($7); $$.addChild(elseNode); }else{ $$.traduction += '{\n}'; } }
    |   IF LPAREN EXPL RPAREN BODY_IF ELSE STATEMENT_IF { $$ = new ParseNode(@1.first_line, @1.first_column, util.literal.operation.IF, util.literal.operation.IF, null, null, null, `if(${$3.traduction})`); $$.addChild($3); if($5 != null){ $$.traduction += $5.traduction + 'else '; $$.addChild($5); }else{ $$.traduction += '{\n}else '; } let elseNode2 = new ParseNode(@6.first_line, @6.first_column, util.literal.operation.ELSE, util.literal.operation.ELSE); $$.addChild(elseNode2); $$.traduction += $7.traduction; $$.addChild($7); };

BODY_IF
    :   LBRACE RBRACE { $$ = null; }
    |   LBRACE LSENTENCES RBRACE { $$ = $2; if($$.her != undefined){ $$.traduction += `\n${$$.her}`; } $$.traduction = `{\n\t${$2.traduction}\n}`; };

STATEMENT_SWITCH
    :   SWITCH LPAREN EXPL RPAREN LBRACE RBRACE { $$ = new ParseNode(@1.first_line, @1.first_column, util.literal.operation.SWITCH, util.literal.operation.SWITCH, null, null, null, `switch(${$3.traduction}){\n}`); $$.addChild($3); }
    |   SWITCH LPAREN EXPL RPAREN LBRACE LCASES RBRACE { $$ = new ParseNode(@1.first_line, @1.first_column, util.literal.operation.SWITCH, util.literal.operation.SWITCH, null, null, null, `switch(${$3.traduction}){\n${$6.traduction}\n}`); $$.addChild($3); $$.addChild($6); };

LCASES
    :   LCASES CASES { $1.traduction += '\n' + $2.traduction; $1.addChild($2); $$ = $1; }
    |   CASES { $$ = new ParseNode(null, null, util.literal.operation.LCASES, util.literal.operation.LCASES, null, null, null, $1.traduction); $$.addChild($1); };

CASES
    :   CASE EXPL COLON { $$ = new ParseNode(@1.first_line, @1.first_column, util.literal.operation.CASE, util.literal.operation.CASE, null, null, null, `\tcase ${$2.traduction}:`); }
    |   CASE EXPL COLON LSENTENCES { if($4.her != undefined){ $4.traduction += `\n${$4.her}`; }  $$ = new ParseNode(@1.first_line, @1.first_column, util.literal.operation.CASE, util.literal.operation.CASE, null, null, null, `\tcase ${$2.traduction}:\n\t${$4.traduction}`); $$.addChild($4); }
    |   DEFAULT COLON { $$ = new ParseNode(@1.first_line, @1.first_column, util.literal.operation.DEFAULT, util.literal.operation.DEFAULT, null, null, null, `\tdefault:`); }
    |   DEFAULT COLON LSENTENCES { if($3.her != undefined){ $3.traduction += `\n${$3.her}`; } $$ = new ParseNode(@1.first_line, @1.first_column, util.literal.operation.DEFAULT, util.literal.operation.DEFAULT, null, null, null, `\tdefault:\n\t${$3.traduction}`); $$.addChild($3); };

STATEMENT_WHILE
    :   WHILE LPAREN EXPL RPAREN LBRACE RBRACE { $$ = new ParseNode(@1.first_line, @1.first_column, util.literal.operation.WHILE, util.literal.operation.WHILE, null, null, null, `while(${$3.traduction}){\n}`); $$.addChild($3); }
    |   WHILE LPAREN EXPL RPAREN LBRACE LSENTENCES RBRACE { if($6.her != undefined){ $6.traduction += `\n${$6.her}`; } $$ = new ParseNode(@1.first_line, @1.first_column, util.literal.operation.WHILE, util.literal.operation.WHILE, null, null, null, `while(${$3.traduction}){\n\t${$6.traduction}\n}`); $$.addChild($3); $$.addChild($6); };

DO_WHILE
    :   DO LBRACE RBRACE WHILE LPAREN EXPL RPAREN SEMICOLON { $$ = new ParseNode(@1.first_line, @1.first_column, util.literal.operation.DO_WHILE, util.literal.operation.DO_WHILE, null, null, null, `do{\n}while(${$6.traduction});`); $$.addChild($6); }
    |   DO LBRACE LSENTENCES RBRACE WHILE LPAREN EXPL RPAREN SEMICOLON { if($3.her != undefined){ $3.traduction += `\n${$3.her}`; } $$ = new ParseNode(@1.first_line, @1.first_column, util.literal.operation.DO_WHILE, util.literal.operation.DO_WHILE, null, null, null, `do{\n${$3.traduction}\n}while(${$7.traduction});`); $$.addChild($3); $$.addChild($7); };

STATEMENT_FOR
    :   FOR LPAREN FOR_PARAMETER1 EXPL SEMICOLON INCREMENT RPAREN LBRACE RBRACE { $$ = new ParseNode(@1.first_line, @1.first_column, util.literal.operation.FOR, util.literal.operation.FOR, null, null, null, `for(${$3.traduction} ${$4.traduction}; ${$6.traduction}){\n}`); $$.addChild($3); $$.addChild($4); $$.addChild($6); }
    |   FOR LPAREN FOR_PARAMETER1 EXPL SEMICOLON DECREMENT RPAREN LBRACE RBRACE { $$ = new ParseNode(@1.first_line, @1.first_column, util.literal.operation.FOR, util.literal.operation.FOR, null, null, null, `for(${$3.traduction} ${$4.traduction}; ${$6.traduction}){\n}`); $$.addChild($3); $$.addChild($4); $$.addChild($6); }
    |   FOR LPAREN FOR_PARAMETER1 EXPL SEMICOLON INCREMENT RPAREN LBRACE LSENTENCES RBRACE { if($9.her != undefined){ $9.traduction += `\n${$9.her}`; } $$ = new ParseNode(@1.first_line, @1.first_column, util.literal.operation.FOR, util.literal.operation.FOR, null, null, null, `for(${$3.traduction} ${$4.traduction}; ${$6.traduction}){\n${$9.traduction}\n}`); $$.addChild($3); $$.addChild($4); $$.addChild($6); $$.addChild($9); }
    |   FOR LPAREN FOR_PARAMETER1 EXPL SEMICOLON DECREMENT RPAREN LBRACE LSENTENCES RBRACE { if($9.her != undefined){ $9.traduction += `\n${$9.her}`; } $$ = new ParseNode(@1.first_line, @1.first_column, util.literal.operation.FOR, util.literal.operation.FOR, null, null, null, `for(${$3.traduction} ${$4.traduction}; ${$6.traduction}){\n${$9.traduction}\n}`); $$.addChild($3); $$.addChild($4); $$.addChild($6); $$.addChild($9); }; 

FOR_PARAMETER1
    :   DECLARATION { $$ = $1; }
    |   ASSIGNMENT { $$ = $1; };

FOR_IN
    :   FOR LPAREN FOR_IN_P1 IN EXPL RPAREN LBRACE LSENTENCES RBRACE { if($8.her != undefined){ $8.traduction += `\n${$8.her}`; } $$ = new ParseNode(@1.first_line, @1.first_column, util.literal.operation.FOR_IN, util.literal.operation.FOR_IN, null, null, null, `for(${$3.traduction} in ${$5.traduction}){\n${$8.traduction}\n}`); $$.addChild($3); $$.addChild($5); $$.addChild($8); }
    |   FOR LPAREN IDENTIFIER IN EXPL RPAREN LBRACE LSENTENCES RBRACE { if($8.her != undefined){ $8.traduction += `\n${$8.her}`; } $$ = new ParseNode(@1.first_line, @1.first_column, util.literal.operation.FOR_IN, util.literal.operation.FOR_IN, null, null, null, `for(${$3} in ${$5.traduction}){\n${$8.traduction}\n}`); $$.addChild(new ParseNode(@3.first_line, @3.first_column, util.literal.dataTypes.VARIABLE, $3)); $$.addChild($5); $$.addChild($8); }
    |   FOR LPAREN FOR_IN_P1 IN EXPL RPAREN LBRACE RBRACE { $$ = new ParseNode(@1.first_line, @1.first_column, util.literal.operation.FOR_IN, util.literal.operation.FOR_IN, null, null, null, `for(${$3.traduction} in ${$5.traduction}){\n}`); $$.addChild($3); $$.addChild($5); }
    |   FOR LPAREN IDENTIFIER IN EXPL RPAREN LBRACE RBRACE { $$ = new ParseNode(@1.first_line, @1.first_column, util.literal.operation.FOR_IN, util.literal.operation.FOR_IN, null, null, null, `for(${$3} in ${$5.traduction}){\n}`); $$.addChild(new ParseNode(@3.first_line, @3.first_column, util.literal.dataTypes.VARIABLE, $3)); $$.addChild($5); };

FOR_IN_P1
    :   LET IDENTIFIER { $$ = new ParseNode(@1.first_line, @1.first_column, util.literal.operation.DECLARATION, $2, util.literal.dataTypes.ANY, false, true, `let ${$2}`); }
    |   LET IDENTIFIER COLON DATATYPE { $$ = new ParseNode(@1.first_line, @1.first_column, util.literal.operation.DECLARATION, $2, util.literal.dataTypes.ANY, false, true, `let ${$2}: ${$4}`); }
    |   LET IDENTIFIER COLON DATATYPE LBRACKET RBRACKET { $$ = new ParseNode(@1.first_line, @1.first_column, util.literal.operation.DECLARATION, $2, util.literal.dataTypes.ANY, false, true, `let ${$2}: ${$4}[]`); }
    |   CONST IDENTIFIER { $$ = new ParseNode(@1.first_line, @1.first_column, util.literal.operation.DECLARATION, $2, util.literal.dataTypes.ANY, false, true, `const ${$2}`); }
    |   CONST IDENTIFIER COLON DATATYPE { $$ = new ParseNode(@1.first_line, @1.first_column, util.literal.operation.DECLARATION, $2, util.literal.dataTypes.ANY, false, true, `const ${$2}: ${$4}`); }
    |   CONST IDENTIFIER COLON DATATYPE LBRACKET RBRACKET { $$ = new ParseNode(@1.first_line, @1.first_column, util.literal.operation.DECLARATION, $2, util.literal.dataTypes.ANY, false, true, `const ${$2}: ${$4}[]`); };

FOR_OF
    :   FOR LPAREN FOR_IN_P1 OF EXPL RPAREN LBRACE RBRACE { $$ = new ParseNode(@1.first_line, @1.first_column, util.literal.operation.FOR_OF, util.literal.operation.FOR_OF, null, null, null, `for(${$3.traduction} of ${$5.traduction}){\n}`); $$.addChild($3); $$.addChild($5); }
    |   FOR LPAREN IDENTIFIER OF EXPL RPAREN LBRACE RBRACE { $$ = new ParseNode(@1.first_line, @1.first_column, util.literal.operation.FOR_OF, util.literal.operation.FOR_OF, null, null, null, `for(${$3} of ${$5.traduction}){\n}`); $$.addChild(new ParseNode(@3.first_line, @3.first_column, util.literal.dataTypes.VARIABLE, $3)); $$.addChild($5); }
    |   FOR LPAREN FOR_IN_P1 OF EXPL RPAREN LBRACE LSENTENCES RBRACE { if($8.her != undefined){ $8.traduction += `\n${$8.her}`; } $$ = new ParseNode(@1.first_line, @1.first_column, util.literal.operation.FOR_OF, util.literal.operation.FOR_OF, null, null, null, `for(${$3.traduction} in ${$5.traduction}){\n${$8.traduction}\n}`); $$.addChild($3); $$.addChild($5); $$.addChild($8); }
    |   FOR LPAREN IDENTIFIER OF EXPL RPAREN LBRACE LSENTENCES RBRACE { if($8.her != undefined){ $8.traduction += `\n${$8.her}`; } $$ = new ParseNode(@1.first_line, @1.first_column, util.literal.operation.FOR_OF, util.literal.operation.FOR_OF, null, null, null, `for(${$3} in ${$5.traduction}){\n${$8.traduction}\n}`); $$.addChild(new ParseNode(@3.first_line, @3.first_column, util.literal.dataTypes.VARIABLE, $3)); $$.addChild($5); $$.addChild($8); };

ARRAY_ACCESS
    :   IDENTIFIER LBRACKET EXPL RBRACKET { $$ = new ParseNode(@1.first_line, @1.first_column, util.literal.operation.ARRAY_ACCESS, $1, null, null, null, `${$1}[${$3.traduction}]`); $$.addChild($3); };

FUNCTION_CALL
    :   IDENTIFIER LPAREN RPAREN { $$ = new ParseNode(@1.first_line, @1.first_column, util.literal.operation.FUNCTION_CALL, $1, null, null, null, `${$1}()`); }
    |   IDENTIFIER LPAREN LEXPL RPAREN { $$ = new ParseNode(@1.first_line, @1.first_column, util.literal.operation.FUNCTION_CALL, $1, null, null, null, `${$1}(${ConcatInstructions($3)})`); $$.childs = $3; };

PROPERTY_ACCESS
    :   ARRAY_FUNCTIONS { $$ = $1; }
    |   EXP POINT EXP { $$ = new ParseNode(@2.first_line, @2.first_column, util.literal.operation.PROPERTY_ACCESS, util.literal.operation.PROPERTY_ACCESS, null, null, null, `${$1.traduction}.${$3.traduction}`); $$.addChild($1); $$.addChild($3); };

PRINT
    :   CONSOLE POINT LOG LPAREN EXPL RPAREN SEMICOLON { $$ = new ParseNode(@1.first_line, @1.first_column, util.literal.operation.PRINT, util.literal.operation.PRINT, null, null, null, `console.log(${$5.traduction});`); $$.addChild($5); }
    |   CONSOLE POINT LOG LPAREN RPAREN SEMICOLON { $$ = new ParseNode(@1.first_line, @1.first_column, util.literal.operation.PRINT, util.literal.operation.PRINT, null, null, null, `console.log();`); };

GRAPH_TS
    :   GRAPH LPAREN RPAREN SEMICOLON { $$ = new ParseNode(@1.first_line, @1.first_column, util.literal.operation.GRAPH_TS, util.literal.operation.GRAPH_TS, null, null, null, `graficar_ts();`); };

STATEMENT_BREAK
    :   BREAK SEMICOLON { $$ = new ParseNode(@1.first_line, @1.first_column, util.literal.operation.BREAK, util.literal.operation.BREAK, null, null, null, `break;`); };

STATEMENT_CONTINUE
    :   CONTINUE SEMICOLON { $$ = new ParseNode(@1.first_line, @1.first_column, util.literal.operation.CONTINUE, util.literal.operation.CONTINUE, null, null, null, `continue`); };

STATEMENT_RETURN
    :   RETURN SEMICOLON { $$ = new ParseNode(@1.first_line, @1.first_column, util.literal.operation.RETURN, util.literal.operation.RETURN, null, null, null, `return;`); }
    |   RETURN EXPL SEMICOLON { $$ = new ParseNode(@1.first_line, @1.first_column, util.literal.operation.RETURN, util.literal.operation.RETURN, null, null, null, `return ${$2.traduction};`); $$.addChild($2); };

DEFINITION
    :   LBRACE LVALUES RBRACE { $$ = new ParseNode(@1.first_line, @1.first_column, util.literal.operation.DEFINITION, util.literal.operation.DEFINITION, null, null, null, `{\n${ConcatInstructions($2)}\n}`); $$.childs = $2; }
    |   LBRACE RBRACE { $$ = new ParseNode(@1.first_line, @1.first_column, util.literal.operation.DEFINITION, util.literal.operation.DEFINITION, null, null, null, `{}`); };

LVALUES
    :   LVALUES COMMA IDENTIFIER COLON EXPL { let decl2 = new ParseNode(@3.first_line, @3.first_column, util.literal.operation.PROPERTY_DECLARATION, $3, null, null, null, `,\n\t${$3}: ${$5.traduction}`); decl2.addChild($5); $1.push(decl2); $$ = $1; }
    |   IDENTIFIER COLON EXPL { $$ = []; let decl = new ParseNode(@1.first_line, @1.first_column, util.literal.operation.PROPERTY_DECLARATION, $1, null, null, null, `\t${$1}: ${$3.traduction}`); decl.addChild($3); $$.push(decl); };

ARRAY
    :   LBRACKET RBRACKET { $$ = new ParseNode(@1.first_line, @1.first_column, util.literal.operation.ARRAY, util.literal.operation.ARRAY, null, null, null, `[]`); }
    |   LBRACKET LEXPL RBRACKET { $$ = new ParseNode(@1.first_line, @1.first_column, util.literal.operation.ARRAY, util.literal.operation.ARRAY, null, null, null, `[${ConcatInstructions($2)}]`); $$.childs = $2; };

ARRAY_FUNCTIONS
    :   EXP POINT PUSH LPAREN EXPL RPAREN { $$ = new ParseNode(@1.first_line, @1.first_column, util.literal.operation.PUSH, util.literal.operation.PUSH, null, null, null, `${$1.traduction}.Push(${$5.traduction})`); $$.addChild($1); $$.addChild($5); }
    |   EXP POINT POP LPAREN RPAREN { $$ = new ParseNode(@1.first_line, @1.first_column, util.literal.operation.POP, util.literal.operation.POP, null, null, null, `${$1.traduction}.Pop()`); $$.addChild($1); }
    |   EXP POINT LENGTH { $$ = new ParseNode(@1.first_line, @1.first_column, util.literal.operation.LENGTH, util.literal.operation.LENGTH, null, null, null, `${$1.traduction}.Length`); $$.addChild($1); };

FUNCTIONS
    :   FUNCTIONS_DEFINITIONS FUNCTION_NT2 { let stack = eval('$$'); $$ = stack[stack.length - 2]; };

FUNCTIONS_DEFINITIONS
    :   FUNCTION IDENTIFIER LPAREN { let nameFunction = FatherName($2); $$ = new ParseNode(@1.first_line, @1.first_column, util.literal.operation.FUNCTION, util.literal.operation.FUNCTION, null, null, null, `function ${$2}(`); $$.addChild(new ParseNode(@2.first_line, @2.first_column, util.literal.dataTypes.VARIABLE, `${nameFunction}`)); MapNames.set($2, nameFunction); };

FUNCTION_NT2
    :   RPAREN FUNCTION_NT3
    |   LPARAMETERS_DES RPAREN FUNCTION_NT7;

FUNCTION_NT7
    :   COLON DATATYPE FUNCTION_NT10
    |   LBRACE FUNCTION_NT9;

FUNCTION_NT10
    :   LBRACKET RBRACKET LBRACE FUNCTION_NT12
    |   LBRACE FUNCTION_NT11;

FUNCTION_NT11
    :   RBRACE { let stack15 = eval('$$'); stack15[stack15.length - 7].traduction = `${stack15[stack15.length - 7].traduction}${stack15[stack15.length - 6].childs[0].traduction}): ${stack15[stack15.length - 3]}{\n}`; stack15[stack15.length - 7].type =  stack15[stack15.length - 3]; stack15[stack15.length - 7].array = false; stack15[stack15.length - 7].addChild(stack15[stack15.length - 6]); her.pop(); }
    |   LSENTENCES RBRACE { 
            let stack16 = eval('$$'); 
            stack16[stack16.length - 8].traduction = `${stack16[stack16.length - 8].traduction}${stack16[stack16.length - 7].childs[0].traduction}): ${stack16[stack16.length - 4]}{\n${$1.traduction}\n}`; 
            stack16[stack16.length - 8].type =  stack16[stack16.length - 4];
            if($1.her != undefined){
                stack16[stack16.length - 8].traduction += `\n${$1.her}`;
            }
            her.pop(); 
            stack16[stack16.length - 8].array = false; stack16[stack16.length - 8].addChild(stack16[stack16.length - 7]); 
            stack16[stack16.length - 8].addChild($1); 
        };

FUNCTION_NT12
    :   RBRACE { let stack18 = eval('$$'); stack18[stack18.length - 9].traduction = `${stack18[stack18.length - 9].traduction}${stack18[stack18.length - 8].childs[0].traduction}): ${stack18[stack18.length - 5]}[]{\n}`; stack18[stack18.length - 9].type = stack18[stack18.length - 5]; stack18[stack18.length - 9].array = true; stack18[stack18.length - 9].addChild(stack18[stack18.length - 8]); her.pop(); }
    |   LSENTENCES RBRACE { 
            let stack19 = eval('$$');
            stack19[stack19.length - 10].traduction = `${stack19[stack19.length - 10].traduction}${stack19[stack19.length - 9].childs[0].traduction}): ${stack19[stack19.length - 6]}[]{\n${$1.traduction}\n}`; 
            stack19[stack19.length - 10].type = stack19[stack19.length - 6];
            if($1.her != undefined){
                stack19[stack19.length - 10].traduction += `\n${$1.her}`;
            }
            her.pop(); 
            stack19[stack19.length - 10].array = true; stack19[stack19.length - 10].addChild(stack19[stack19.length - 9]); 
            stack19[stack19.length - 10].addChild($1); 
        };

FUNCTION_NT9
    :   RBRACE { let stack11 = eval('$$'); stack11[stack11.length - 5].traduction = `${stack11[stack11.length - 5].traduction}${stack11[stack11.length - 4].childs[0].traduction}){\n}`; stack11[stack11.length - 5].type = util.literal.dataTypes.ANY; stack11[stack11.length - 5].addChild(stack11[stack11.length - 4]); her.pop(); }
    |   LSENTENCES RBRACE { 
            let stack17 = eval('$$');
            stack17[stack17.length - 6].traduction = `${stack17[stack17.length - 6].traduction}${stack17[stack17.length - 5].childs[0].traduction}){\n${$1.traduction}\n}`;
            stack17[stack17.length - 6].type = util.literal.dataTypes.ANY;
            if($1.her != undefined){
                stack17[stack17.length - 6].traduction += `\n${$1.her}`;
            }
            her.pop();
            stack17[stack17.length - 6].addChild(stack17[stack17.length - 5]);
            stack17[stack17.length - 6].addChild($1); 
        };

FUNCTION_NT3
    :   LBRACE FUNCTION_NT4
    |   COLON DATATYPE FUNCTION_NT5;

FUNCTION_NT4
    :   RBRACE { let stack2 = eval('$$'); stack2[stack2.length - 4].traduction = `${stack2[stack2.length - 4].traduction}){\n}`; stack2[stack2.length - 4].type = util.literal.dataTypes.ANY; her.pop(); }
    |   LSENTENCES RBRACE { 
            let stack3 = eval('$$');
            stack3[stack3.length - 5].traduction = `${stack3[stack3.length - 5].traduction}){\n${$1.traduction}\n}`;
            if($1.her != undefined){
                stack3[stack3.length - 5].traduction += `\n${$1.her}`;
            }
            her.pop();
            stack3[stack3.length - 5].addChild($1);
            stack3[stack3.length - 5].type = util.literal.dataTypes.ANY; 
        };

FUNCTION_NT5
    :   LBRACE FUNCTION_NT6
    |   LBRACKET RBRACKET LBRACE FUNCTION_NT8;

FUNCTION_NT6
    :   RBRACE { let stack6 = eval('$$'); stack6[stack6.length - 6].traduction = `${stack6[stack6.length - 6].traduction}): ${stack6[stack6.length - 3]}{\n}`; stack6[stack6.length - 6].type = stack6[stack6.length - 3]; stack6[stack6.length - 6].array = false; her.pop(); }
    |   LSENTENCES RBRACE { 
            let stack7 = eval('$$'); 
            stack7[stack7.length - 7].traduction = `${stack7[stack7.length - 7].traduction}): ${stack7[stack7.length - 4]}{\n${$1.traduction}\n}`; 
            if($1.her != undefined){
                stack7[stack7.length - 7].traduction += `\n${$1.her}`;
            }
            her.pop();
            stack7[stack7.length - 7].type = stack7[stack7.length - 4]; 
            stack7[stack7.length - 7].array = false; 
            stack7[stack7.length - 7].addChild($1); 
        };

FUNCTION_NT8
    :   RBRACE { let stack8 = eval('$$'); stack8[stack8.length - 8].traduction = `${stack8[stack8.length - 8].traduction}): ${stack8[stack8.length - 5]}[]{\n}`; stack8[stack8.length - 8].type = stack8[stack8.length - 5]; stack8[stack8.length - 8].array = true; her.pop(); }
    |   LSENTENCES RBRACE { 
            let stack9 = eval('$$'); 
            stack9[stack9.length - 9].traduction = `${stack9[stack9.length - 9].traduction}): ${stack9[stack9.length - 6]}[]{\n${$1.traduction}\n}`;
            if($1.her != undefined){
                stack9[stack9.length - 9].traduction += `\n${$1.her}`;
            }
            her.pop(); 
            stack9[stack9.length - 9].type = stack9[stack9.length - 6]; 
            stack9[stack9.length - 9].array = true; 
            stack9[stack9.length - 9].addChild($1); 
        };

LPARAMETERS_DES
    : PARAMETER_DES LPARAMETERS_DES_R { $$ = new ParseNode(0, 0, 'LPARAMETERS', 'LPARAMETERS'); $1.traduction = `${$1.traduction}${$2.childs[0].traduction}`; $$.addChild($1); $$.addChild($2); };

LPARAMETERS_DES_R
    :   COMMA PARAMETER_DES LPARAMETERS_DES_R { $$  = new ParseNode(0, 0, 'LPARAMETERS', 'LPARAMETERS'); $2.traduction = `, ${$2.traduction}${$3.childs[0].traduction}`; $$.addChild($2); $$.addChild($3); }
    |   /* empty */ { $$ = new ParseNode(0, 0, 'LPARAMETERS', 'LPARAMETERS'); $$.addChild(new ParseNode(0, 0, null, util.literal.dataTypes.EPSILON, null, null, null, '')); };

PARAMETER_DES
    :   IDENTIFIER PARAMETER_DES_N1 { $$ = $2; };

PARAMETER_DES_N1
    :   COLON DATATYPE PARAMETER_DES_N2 { $$ = $3; }
    |   /* empty */ { let stack10 = eval('$$'); $$ = new ParseNode(@1.first_line, @1.first_column, null, `${stack10[stack10.length - 1]}`, util.literal.dataTypes.ANY, false, true, `${stack10[stack10.length - 1]}`); };

PARAMETER_DES_N2
    :   LBRACKET RBRACKET { let stack14 =  eval('$$'); $$ = new ParseNode(@1.first_line, @1.first_column, null, `${stack14[stack14.length - 5]}`, `${stack14[stack14.length - 3]}`, false, false, `${stack14[stack14.length - 5]}: ${stack14[stack14.length - 3]}[]`, true); }
    |   /* empty */ { let stack13 =  eval('$$'); $$ = new ParseNode(@1.first_line, @1.first_column, null, `${stack13[stack13.length - 3]}`, `${stack13[stack13.length - 1]}`, false, false, `${stack13[stack13.length - 3]}: ${stack13[stack13.length - 1]}`, false); };