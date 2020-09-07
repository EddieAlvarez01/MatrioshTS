import parserTraduction from './analysis/parser';
import { Declaration } from './models/Declaration';
import { Assignment } from './models/Assignment';
import { TypeDeclaration } from './models/TypeDeclaration';
import { If } from './models/If';
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

export function traduction(txt) {
    try {
        
    } catch (error) {
        console.log(error);
    }
    const result = parserTraduction.parse(txt);
    result.errors = parserTraduction.errors;
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
                    return new If(RecognizeOperation(node.childs[0]), trueList, falseList);
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
                    return new If(RecognizeOperation(node.childs[0]), trueList, falseList);
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
                    return new If(RecognizeOperation(node.childs[0]), trueList, falseList);
                default:
                    node.childs[1].childs.forEach((node) => {
                        trueList.push(RecognizeInstruction(node));
                    });
                    falseList.push(RecognizeInstruction(node.childs[3]));
                    return new If(RecognizeOperation(node.childs[0]), trueList, falseList);
            }
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



