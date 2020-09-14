import { Symbol } from './Symbol';
import Error from './Error';
import { literal } from '../utilities/util';

export class PropertyDeclaration{

    constructor(id, value, row, column){
        this.id = id;
        this.value = value;
        this.row = row;
        this.column = column;
    }

    execute(st, output, errors){
        const symbol = this.value.execute(st, output, errors);
        if(symbol instanceof Error) return symbol;
        switch(symbol.type){
            case literal.dataTypes.STRING:
            case literal.dataTypes.NUMBER:
            case literal.dataTypes.BOOLEAN:
            case literal.dataTypes.NULL:
                return new Symbol(this.id, symbol.type, null, null, false, symbol.value, st.scope, symbol.row, symbol.column, false, false);
            default:
                symbol.id = this.id;
                return symbol;
        }
    }

}