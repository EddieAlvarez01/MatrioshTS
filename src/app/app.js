import parserTraduction from './analysis/parser';
import { Declaration } from './models/Declaration';
import { Operation } from './models/Operation';
import { Increment } from './models/Increment';
import { Decrement } from './models/Decrement';
import { literal } from './utilities/util';

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
                return new Declaration(node.value, node.type, node.constant, node.dynamic, node.array, RecognizeOperation(node.childs[0]));
            }else{
                return new Declaration(node.value, node.type, node.constant, node.dynamic, node.array, undefined);
            }
        default:
            return null;
    }
}

//RECOGNIZES THE TYPE OF OPERATION
function RecognizeOperation(node){
    switch(node.operation){
        case literal.operation.ADDITION:
            return Operation.NewOperation(RecognizeOperation(node.childs[0]), RecognizeOperation(node.childs[1]), literal.operation.ADDITION);
        case literal.operation.SUBTRACTION:
            return Operation.NewOperation(RecognizeOperation(node.childs[0]), RecognizeOperation(node.childs[1]), literal.operation.SUBTRACTION);
        case literal.operation.MULTIPLICATION:
            return Operation.NewOperation(RecognizeOperation(node.childs[0]), RecognizeOperation(node.childs[1]), literal.operation.MULTIPLICATION);
        case literal.operation.DIVISION:
            return Operation.NewOperation(RecognizeOperation(node.childs[0]), RecognizeOperation(node.childs[1]), literal.operation.DIVISION);
        case literal.operation.POW:
            return Operation.NewOperation(RecognizeOperation(node.childs[0]), RecognizeOperation(node.childs[1]), literal.operation.POW);
        case literal.operation.INCREMENT:
            return new Increment(RecognizeOperation(node.childs[0]));
        case literal.operation.DECREMENT:
            return new Decrement(RecognizeOperation(node.childs[0]));
        case literal.dataTypes.STRING:
            return Operation.NewOperationValue(literal.dataTypes.STRING, node.value);
        case literal.dataTypes.NUMBER:
            return Operation.NewOperationValue(literal.dataTypes.NUMBER, node.value);
        case literal.dataTypes.BOOLEAN:
            return Operation.NewOperationValue(literal.dataTypes.BOOLEAN, node.value);
        case literal.dataTypes.VARIABLE:
            return Operation.NewOperationValue(literal.dataTypes.VARIABLE, node.value);
        default:
            return Operation.NewOperationValue(literal.dataTypes.NULL, null);
    }
}



