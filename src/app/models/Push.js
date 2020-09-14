import Error from './Error';
import { Operation } from './Operation';
import { literal } from '../utilities/util';

export class Push{

    constructor(id, value, row, column){
        this.id = id;
        this.value = value;
        this.row = row;
        this.column = column;
    }

    traduction(st, scope){}

    execute(st, output, errors){
        const symbol = this.id.execute(st, output, errors);
        if(symbol instanceof Error) return symbol;
        if(!symbol.array){
            return new Error(literal.errorType.SEMANTIC, `Solo se puede usar el push con un array`, this.row, this.column);
        }
        const value = this.value.execute(st, output, errors);
        if(value instanceof Error) return value;
        switch(value.type){
            case literal.dataTypes.STRING:
                if(symbol.type == literal.dataTypes.ARRAY_STRING || symbol.type == literal.dataTypes.ARRAY_ANY){
                    symbol.value.push(value);
                    return Operation.NewOperationValue(literal.dataTypes.NULL, null, this.row, this.column);
                }
                break;
            case literal.dataTypes.NUMBER:
                if(symbol.type == literal.dataTypes.ARRAY_NUMBER || symbol.type == literal.dataTypes.ARRAY_ANY){
                    symbol.value.push(value);
                    return Operation.NewOperationValue(literal.dataTypes.NULL, null, this.row, this.column);
                }
                break;
            case literal.dataTypes.BOOLEAN:
                if(symbol.type == literal.dataTypes.ARRAY_BOOLEAN || symbol.type == literal.dataTypes.ARRAY_BOOLEAN){
                    symbol.value.push(value);
                    return Operation.NewOperationValue(literal.dataTypes.NULL, null, this.row, this.column);
                }
                break;
            case literal.dataTypes.NULL:
                if(symbol.type == literal.dataTypes.ARRAY_ANY){
                    symbol.value.push(value);
                    return Operation.NewOperationValue(literal.dataTypes.NULL, null, this.row, this.column);
                }
            case literal.dataTypes.OBJECT:
                /* TYPES ARRAY LOGICAL */
                break;
        }
        return new Error(literal.errorType.SEMANTIC, `No se puede agregar a un array tipo '${symbol.type}' un tipo '${value.type}'`, this.row, this.column);
    }

}