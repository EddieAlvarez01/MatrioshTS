import Error from './Error';
import { literal } from '../utilities/util';
import { Operation } from './Operation';

export class Length{

    constructor(id, row, column){
        this.id = id;
        this.row = row;
        this.column = column;
    }

    traduction(st, scope){}

    execute(st, output, errors){
        const symbol = this.id.execute(st, output, errors);
        if(symbol instanceof Error) return symbol;
        if(!symbol.array) return new Error(literal.errorType.SEMANTIC, `La función Length solo se puede usar con un array`, this.row, this.column);
        if(symbol.value == null) return new Error(literal.errorType.SEMANTIC, `No se puede usar 'length' en un 'null'`, this.row, this.column);
        return Operation.NewOperationValue(literal.dataTypes.NUMBER, symbol.value.length, this.row, this.column);
    }

}