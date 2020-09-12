import parserTraduction from './analysis/parser';
import parserExecute from './analysis/parseExecute';
import { Declaration } from './models/Declaration';
import { Assignment } from './models/Assignment';
import { TypeDeclaration } from './models/TypeDeclaration';
import { If } from './models/If';
import { Switch } from './models/Switch';
import { Case } from './models/Case';
import { While } from './models/While';
import { DoWhile } from './models/DoWhile';
import { For } from './models/For';
import { ForIn } from './models/ForIn';
import { ForOf } from './models/ForOf';
import { Print } from './models/Print';
import { GraphTs } from './models/GraphTs';
import { Break } from './models/Break';
import { Continue } from './models/Continue';
import { Return } from './models/Return';
import { Function } from './models/Function';
import { SymbolTable } from './models/SymbolTable';
import { Operation } from './models/Operation';
import { Increment } from './models/Increment';
import { Decrement } from './models/Decrement';
import { ArrayAccess } from './models/ArrayAccess';
import { FunctionCall } from './models/FunctionCall';
import { Array } from './models/Array';
import { Definition } from './models/Definition';
import { PropertyDeclaration } from './models/PropertyDeclaration';
import { Ternary } from './models/Ternary';
import { Push } from './models/Push';
import { Pop } from './models/Pop';
import { literal } from './utilities/util';
import { Length } from './models/Length';
import Error from './models/Error';

//TRANSLATE ENTRY
export function traduction(txt) {
    const result = parserTraduction.parse(txt);
    result.errors = parserTraduction.errors.slice();
    CleanErrorsArray(parserTraduction.errors);
    return result;
}

//EXECUTE ENTRY
export function execute(txt){
    const result = parserExecute.parse(txt);
    result.errors = parserExecute.errors.slice();
    CleanErrorsArray(parserExecute.errors);
    return result;
}

//deposit pre-mapped instructions
export function MappingInstructions(root){
    const instructions = [];
    root.childs.forEach((node)=> {
        instructions.push(RecognizeInstruction(node));
    });
    return instructions;
}

//TRANSLATION SYMBOL TABLE
export function TranslationSymbolTable(instructionList){
    const globalSt = new SymbolTable();
    instructionList.forEach((instruction) => {
        instruction.traduction(globalSt, 'Global');
    });
    return globalSt;
}

//EXCUTE CODE
export function ExecuteCode(instuctionList, errors){
    const globalSt = new SymbolTable('Global');
    for(let instruction of instuctionList){
        const executeResult = instruction.execute(globalSt, []);
        if(executeResult instanceof Error){
           errors.push(executeResult);
           return globalSt; 
        }
    }
    return globalSt;
}

//recognizes the type of instruction
function RecognizeInstruction(node){
    switch(node.operation){
        case literal.operation.DECLARATION:
            if(node.childs.length > 0){
                return new Declaration(node.value, node.type, node.constant, node.dynamic, node.array, RecognizeOperation(node.childs[0]), node.row, node.column);
            }
            return new Declaration(node.value, node.type, node.constant, node.dynamic, node.array, undefined, node.row, node.column);
        case literal.operation.ASSIGNMENT:
            if(node.childs.length == 1){
                return new Assignment(node.value, RecognizeOperation(node.childs[0]), node.row, node.column);
            }
            return new Assignment(RecognizeOperation(node.childs[0]), RecognizeOperation(node.childs[1]), node.row, node.column);
        case literal.operation.TYPE_DECLARATION:
            return new TypeDeclaration(node.value, node.value, node.childs, node.row, node.column);
        case literal.operation.IF:
            const trueList = [];
            const falseList = [];
            switch(node.childs.length){
                case 1:
                    return new If(RecognizeOperation(node.childs[0]), trueList, falseList, node.row, node.column);
                case 2:
                    if(node.childs[1].operation == literal.operation.SENTENCES){
                        node.childs[1].childs.forEach((node) => {
                            trueList.push(RecognizeInstruction(node));
                        });
                    }else{
                        node.childs[1].childs[0].childs.forEach((node) => {
                            falseList.push(RecognizeInstruction(node));
                        });
                    }
                    return new If(RecognizeOperation(node.childs[0]), trueList, falseList, node.row, node.column);
                case 3:
                    if(node.childs[1].operation == literal.operation.SENTENCES){
                        node.childs[1].childs.forEach((node) => {
                            trueList.push(RecognizeInstruction(node));
                        });
                        node.childs[2].childs[0].childs.forEach((node) => {
                            falseList.push(RecognizeInstruction(node));
                        });
                    }else{
                        falseList.push(RecognizeInstruction(node.childs[2]));
                    }
                    return new If(RecognizeOperation(node.childs[0]), trueList, falseList, node.row, node.column);
                default:
                    node.childs[1].childs.forEach((node) => {
                        trueList.push(RecognizeInstruction(node));
                    });
                    falseList.push(RecognizeInstruction(node.childs[3]));
                    return new If(RecognizeOperation(node.childs[0]), trueList, falseList, node.row, node.column);
            }
        case literal.operation.SWITCH:
            const casesList = [];
            if(node.childs.length > 1){
                node.childs[1].childs.forEach((node) => {
                    casesList.push(RecognizeInstruction(node));
                });
            }
            return new Switch(RecognizeOperation(node.childs[0]), casesList, node.row, node.column);
        case literal.operation.CASE || literal.operation.DEFAULT:
            const instructionsList = [];
            if(node.childs.length > 1){
                node.childs[1].childs.forEach((node) => {
                    instructionsList.push(RecognizeInstruction(node));
                });
            }
            if(node.childs[0].operation == literal.operation.SENTENCES){
                node.childs[0].childs.forEach((node) => {
                    instructionsList.push(RecognizeInstruction(node));
                });
                return new Case(null, instructionsList, node.row, node.column);
            }
            return new Case(RecognizeOperation(node.childs[0]), instructionsList, node.row, node.column);
        case literal.operation.WHILE:
            let instructions = [];
            if(node.childs.length > 1){
                node.childs[1].childs.forEach((node) => {
                    instructions.push(RecognizeInstruction(node));
                });
            }
            return new While(RecognizeOperation(node.childs[0]), instructions, node.row, node.column);
        case literal.operation.DO_WHILE:
            const instructionsDoWhile = [];
            if(node.childs.length > 1){
                node.childs[0].childs.forEach((node) => {
                    instructionsDoWhile.push(RecognizeInstruction(node));
                });
                return new DoWhile(instructionsDoWhile, RecognizeOperation(node.childs[1]), node.row, node.column);
            }
            return new DoWhile(instructionsDoWhile, RecognizeOperation(node.childs[0]), node.row, node.column);
        case literal.operation.FOR:
            const listInstructionsFor = [];
            if(node.childs.length > 3){
                node.childs[3].childs.forEach((node) => {
                    listInstructionsFor.push(RecognizeInstruction(node));
                });
            }
            return new For(RecognizeInstruction(node.childs[0]), RecognizeOperation(node.childs[1]), RecognizeInstruction(node.childs[2]), listInstructionsFor, node.row, node.column);
        case literal.operation.INCREMENT:
            return RecognizeOperation(node);
        case literal.operation.DECREMENT:
            return RecognizeOperation(node);
        case literal.operation.FOR_IN:
            const listInstructionsForIn = [];
            if(node.childs.length > 2){
                node.childs[2].childs.forEach((node) => {
                    listInstructionsForIn.push(RecognizeInstruction(node));
                });
            }
            if(node.childs[0].operation == literal.dataTypes.VARIABLE){
                return new ForIn(RecognizeOperation(node.childs[0]), RecognizeOperation(node.childs[1]), listInstructionsForIn, node.row, node.column);
            }
            return new ForIn(RecognizeInstruction(node.childs[0]), RecognizeOperation(node.childs[1]), listInstructionsForIn, node.row, node.column);
        case literal.operation.FOR_OF:
            const listInstructionsForOf = [];
            if(node.childs.length > 2){
                node.childs[2].childs.forEach((node) => {
                    listInstructionsForOf.push(RecognizeInstruction(node));
                });
            }
            if(node.childs[0].operation == literal.dataTypes.VARIABLE){
                return new ForOf(RecognizeOperation(node.childs[0]), RecognizeOperation(node.childs[1]), listInstructionsForOf, node.row, node.column);
            }
            return new ForOf(RecognizeInstruction(node.childs[0]), RecognizeOperation(node.childs[1]), listInstructionsForOf, node.row, node.column);
        case literal.operation.FUNCTION_CALL:
            return RecognizeOperation(node);
        case literal.operation.PRINT:
            if(node.childs.length){
                return new Print(RecognizeOperation(node.childs[0]), node.row, node.column);
            }
            return new Print(null, node.row, node.column);
        case literal.operation.GRAPH_TS:
            return new GraphTs(node.row, node.column);
        case literal.operation.BREAK:
            return new Break(node.row, node.colum);
        case literal.operation.CONTINUE:
            return new Continue(node.row, node.column);
        case literal.operation.RETURN:
            if(node.childs.length){
                return new Return(RecognizeOperation(node.childs[0]), node.row, node.column);
            }
            return new Return(null, node.row, node.column);
        case literal.operation.PUSH:
            return RecognizeOperation(node);
        case literal.operation.POP:
            return RecognizeOperation(node);
        case literal.operation.LENGTH:
            return RecognizeOperation(node);
        case literal.operation.FUNCTION:
            let parametersListFunction = [];
            const instructionsListFunction = [];
            if(node.childs.length == 2){
                if(node.childs[1].operation == 'LPARAMETERS'){
                    parametersListFunction = ExtractParameterList(node.childs[1], []); 
                }else{
                    node.childs[1].childs.forEach((node) => {
                        instructionsListFunction.push(RecognizeInstruction(node));
                    });
                }
            }else if(node.childs.length == 3){
                parametersListFunction = ExtractParameterList(node.childs[1], []);
                node.childs[2].childs.forEach((node) => {
                    instructionsListFunction.push(RecognizeInstruction(node));
                });
            }
            return new Function(node.childs[0].value, parametersListFunction, node.type, node.array, instructionsListFunction, node.row, node.column);
        default:
            return null;
    }
}

//RECOGNIZES THE TYPE OF OPERATION
function RecognizeOperation(node){
    switch(node.operation){
        case literal.operation.ADDITION:
            return Operation.NewOperation(RecognizeOperation(node.childs[0]), RecognizeOperation(node.childs[1]), literal.operation.ADDITION, node.row, node.column);
        case literal.operation.SUBTRACTION:
            return Operation.NewOperation(RecognizeOperation(node.childs[0]), RecognizeOperation(node.childs[1]), literal.operation.SUBTRACTION, node.row, node.column);
        case literal.operation.MULTIPLICATION:
            return Operation.NewOperation(RecognizeOperation(node.childs[0]), RecognizeOperation(node.childs[1]), literal.operation.MULTIPLICATION, node.row, node.column);
        case literal.operation.DIVISION:
            return Operation.NewOperation(RecognizeOperation(node.childs[0]), RecognizeOperation(node.childs[1]), literal.operation.DIVISION, node.row, node.column);
        case literal.operation.MODULUS:
            return Operation.NewOperation(RecognizeOperation(node.childs[0]), RecognizeOperation(node.childs[1]), literal.operation.MODULUS, node.row, node.column);
        case literal.operation.UNARY_MINUS:
            return Operation.NewOperation(null, RecognizeOperation(node.childs[0]), literal.operation.UNARY_MINUS, node.row, node.column);
        case literal.operation.POW:
            return Operation.NewOperation(RecognizeOperation(node.childs[0]), RecognizeOperation(node.childs[1]), literal.operation.POW, node.row, node.column);
        case literal.operation.OTHER_THAN:
            return Operation.NewOperation(RecognizeOperation(node.childs[0]), RecognizeOperation(node.childs[1]), literal.operation.OTHER_THAN, node.row, node.column);
        case literal.operation.JUST_AS:
            return Operation.NewOperation(RecognizeOperation(node.childs[0]), RecognizeOperation(node.childs[1]), literal.operation.JUST_AS, node.row, node.column);
        case literal.operation.GREATER_THAN_OR_EQUAL_TO:
            return Operation.NewOperation(RecognizeOperation(node.childs[0]), RecognizeOperation(node.childs[1]), literal.operation.GREATER_THAN_OR_EQUAL_TO, node.row, node.column);
        case literal.operation.LESS_THAN_OR_EQUAL_TO:
            return Operation.NewOperation(RecognizeOperation(node.childs[0]), RecognizeOperation(node.childs[1]), literal.operation.LESS_THAN_OR_EQUAL_TO, node.row, node.column);
        case literal.operation.GREATER_THAN:
            return Operation.NewOperation(RecognizeOperation(node.childs[0]), RecognizeOperation(node.childs[1]), literal.operation.GREATER_THAN, node.row, node.column);
        case literal.operation.LESS_THAN:
            return Operation.NewOperation(RecognizeOperation(node.childs[0]), RecognizeOperation(node.childs[1]), literal.operation.LESS_THAN, node.row, node.column);
        case literal.operation.OR:
            return Operation.NewOperation(RecognizeOperation(node.childs[0]), RecognizeOperation(node.childs[1]), literal.operation.OR, node.row, node.column);
        case literal.operation.AND:
            return Operation.NewOperation(RecognizeOperation(node.childs[0]), RecognizeOperation(node.childs[1]), literal.operation.AND, node.row, node.column);
        case literal.operation.NOT:
            return Operation.NewOperation(null, RecognizeOperation(node.childs[0]), literal.operation.NOT, node.row, node.column);
        case literal.operation.TERNARY_OPERATOR:
            return new Ternary(RecognizeOperation(node.childs[0]), RecognizeOperation(node.childs[1]), RecognizeOperation(node.childs[2]), node.row, node.column);
        case literal.operation.PROPERTY_ACCESS:
            return Operation.NewOperation(RecognizeOperation(node.childs[0]), RecognizeOperation(node.childs[1]), literal.operation.PROPERTY_ACCESS, node.row, node.column);
        case literal.operation.PUSH:
            return new Push(RecognizeOperation(node.childs[0]), RecognizeOperation(node.childs[1]), node.row, node.column);
        case literal.operation.POP:
            return new Pop(RecognizeOperation(node.childs[0]), node.row, node.column);
        case literal.operation.LENGTH:
            return new Length(RecognizeOperation(node.childs[0]), node.row, node.column);
        case literal.operation.INCREMENT:
            return new Increment(RecognizeOperation(node.childs[0]), node.row, node.column);
        case literal.operation.DECREMENT:
            return new Decrement(RecognizeOperation(node.childs[0]), node.row, node.column);
        case literal.operation.ARRAY_ACCESS:
            return new ArrayAccess(node.value, RecognizeOperation(node.childs[0]), node.row, node.column);
        case literal.operation.FUNCTION_CALL:
            const parametersList = [];
            if(node.childs.length > 0){
                node.childs.forEach((node) => {
                    parametersList.push(RecognizeOperation(node));
                });
            }
            return new FunctionCall(node.value, parametersList, node.row, node.column);
        case literal.operation.ARRAY:
            const expresionsList = [];
            node.childs.forEach((node) => {
                expresionsList.push(RecognizeOperation(node));
            });
            return new Array(expresionsList, node.row, node.column);
        case literal.operation.DEFINITION:
            const propertysList = [];
            node.childs.forEach((node) => {
                propertysList.push(RecognizeOperation(node));
            });
            return new Definition(propertysList, node.row, node.column);
        case literal.operation.PROPERTY_DECLARATION:
            return new PropertyDeclaration(node.value, RecognizeOperation(node.childs[0]), node.row, node.column);
        case literal.dataTypes.STRING:
            return Operation.NewOperationValue(literal.dataTypes.STRING, node.value, node.row, node.column);
        case literal.dataTypes.NUMBER:
            return Operation.NewOperationValue(literal.dataTypes.NUMBER, node.value, node.row, node.column);
        case literal.dataTypes.BOOLEAN:
            return Operation.NewOperationValue(literal.dataTypes.BOOLEAN, node.value, node.row, node.column);
        case literal.dataTypes.VARIABLE:
            return Operation.NewOperationValue(literal.dataTypes.VARIABLE, node.value, node.row, node.column);
        default:
            return Operation.NewOperationValue(literal.dataTypes.NULL, null, node.row, node.column);
    }
}

//extract parameter list
function ExtractParameterList(node, list){
    if(node.childs.length == 2){
        list.push(node.childs[0]);
        return ExtractParameterList(node.childs[1], list);
    }
    return list;
}

//CLEAN ERRORS ARRAY
function CleanErrorsArray(errors){
    while(errors.length){
        errors.pop();
    }
}
