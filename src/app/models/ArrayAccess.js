import Error from './Error';
import { literal } from '../utilities/util';

export class ArrayAccess{

    constructor(id, value, row, column){
        this.id = id;
        this.value = value;
        this.row = row;
        this.column = column;
    }

    execute(st, output, errors){
        const symbol = st.GetArrayValue(this);
        if(symbol instanceof Error) return symbol;
        const exp = this.value.execute(st, output, errors);
        if(exp instanceof Error) return exp;
        if(symbol.array){
            if(!(exp.type == literal.dataTypes.STRING || exp.type == literal.dataTypes.NUMBER)) return new Error(literal.errorType.SEMANTIC, `No se puede acceder a un array con un tipo '${exp.type}'`, this,row, this.column);
            const value = symbol.value[exp.value];
            if(value === undefined) return new Error(literal.errorType.SEMANTIC, `El indice '${exp.value}' de el array no es correcto`, this.row, this.column);
            return value;
        }
        return new Error(literal.errorType.SEMANTIC, `No se puede acceder de esta forma a una variable que no es un array o un objeto`, this.row, this.column);
    }

}