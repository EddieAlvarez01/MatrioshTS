import Error from './Error';
import { literal } from '../utilities/util';
import { Symbol } from './Symbol';

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
            if(symbol.value == null) return new Error(literal.errorType.SEMANTIC, `No se puede acceder a un valor nulo`, this.row, this.column);
            if(!(exp.type == literal.dataTypes.STRING || exp.type == literal.dataTypes.NUMBER)) return new Error(literal.errorType.SEMANTIC, `No se puede acceder a un array con un tipo '${exp.type}'`, this.row, this.column);
            let value;
            if(exp.type == literal.dataTypes.NUMBER){
                value = symbol.value[Math.round(exp.value)];
            }else{
                value = symbol.value[exp.value];
            }
            if(value === undefined){
                if(st.assignment){
                    let newSymbol;
                    switch(symbol.type){
                        case literal.dataTypes.ARRAY_STRING:
                            newSymbol = new Symbol('', literal.dataTypes.STRING, false, false, false, null, st.scope, 0, 0, false, false);
                            break;
                        case literal.dataTypes.ARRAY_NUMBER:
                            newSymbol = new Symbol('', literal.dataTypes.NUMBER, false, false, false, null, st.scope, 0, 0, false, false);
                            break;
                        case literal.dataTypes.ARRAY_BOOLEAN:
                            newSymbol = new Symbol('', literal.dataTypes.BOOLEAN, false, false, false, null, st.scope, 0, 0, false, false);
                            break;
                        case literal.dataTypes.ARRAY_ANY:
                            newSymbol = new Symbol('', literal.dataTypes.ANY, false, false, false, null, st.scope, 0, 0, false, false);
                            break;
                        default:
                            newSymbol = new Symbol('', symbol.type, false, false, false, null, st.scope, 0, 0, false, false);
                    }
                    symbol.value[exp.value] = newSymbol;
                    return newSymbol;
                }
                return new Error(literal.errorType.SEMANTIC, `El indice '${exp.value}' de el array no es correcto`, this.row, this.column);
            }
            return value;
        }else if(st.CheckType(symbol)){
            if(exp.type == literal.dataTypes.STRING){
                if(symbol.value == null) return new Error(literal.errorType.SEMANTIC, `No se puede acceder a un valor nulo`, this.row, this.column);
                const value = symbol.value[exp.value];
                if(value === undefined) return new Error(literal.errorType.SEMANTIC, `El indice '${exp.value}' de el array no es correcto`, this.row, this.column);
                return value;
            }
            return new Error(literal.errorType.SEMANTIC, `No se puede acceder a un array con un tipo '${exp.type}'`, this.row, this.column);
        }
        return new Error(literal.errorType.SEMANTIC, `No se puede acceder de esta forma a una variable que no es un array o un objeto`, this.row, this.column);
    }

}