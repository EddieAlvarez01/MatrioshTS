import Error from './Error';
import { literal } from '../utilities/util';

export class Pop{

    constructor(id, row, column){
        this.id = id;
        this.row = row;
        this.column = column;
    }

    traduction(st, scope){}

    execute(st, output, errors){
        const symbol = this.id.execute(st, output, errors);
        if(symbol instanceof Error) return symbol;
        if(!symbol.array) return new Error(literal.errorType.SEMANTIC, `La función pop solo puede ser utilizada en arrays`, this.row, this.column);
        if(symbol.value == null) return new Error(literal.errorType.SEMANTIC, `No se puede usar 'pop' en un 'null'`, this.row, this.column);
        const value = symbol.value.pop();
        if(value === undefined) return new Error(literal.errorType.SEMANTIC, `No hay elementos para devolver en el array`, this.row, this.column);
        return value;
    }

}