import { Operation } from './Operation';
import { literal } from '../utilities/util';
import { Symbol } from './Symbol';

export class Decrement{

    constructor(exp, row, column){
        this.exp = exp;
        this.row = row;
        this.column = column;
    }

    tradution(st, scope){}

    execute(st, output, errors){
        if(this.exp instanceof Operation && (this.exp.type == literal.dataTypes.VARIABLE || this.exp.type == literal.operation.PROPERTY_ACCESS || this.exp.type == literal.operation.ARRAY_ACCESS)){
            const val = this.exp.execute(st, output, errors);
            if(val instanceof Error) return val;
            const returnSymbol = new Symbol(val.id, val.type, val.constant, val.dynamic, val.array, val.value, val.scope, val.row, val.column);
            if(val.constant){
                return new Error(literal.errorType.SEMANTIC, `No se puede asignar a una constante`, this.row, this.column);
            }
            switch(val.type){
                case literal.dataTypes.NUMBER:
                    val.value--;
                    break;
                case literal.dataTypes.ANY:
                    val.value--;
                    val.type = literal.dataTypes.NUMBER;
                    break;
                default:
                    return new Error(literal.errorType.SEMANTIC, `No se puede decrementar un tipo '${val.type}'`, this.row, this.column);
            }
            return returnSymbol;
        }
        return new Error(literal.errorType.SEMANTIC, `No se puede decrementar algo que no sea propiedad, elemento de array o variable`, this.row, this.column);
    }

}