import { Symbol } from './Symbol';
import { literal } from '../utilities/util';
import Error from './Error';

export class Declaration{

    constructor(id, type, constant, dynamic, array, value, row, column){
        this.id = id;
        this.type = type;
        this.constant = constant;
        this.dynamic = dynamic;
        this.array = array;
        this.value = value;
        this.row = row;
        this.column = column;
    }

    traduction(st, scope){
        st.Set(Symbol.NewSymbolTranslate(this.id, this.type, scope, this.row, this.column), 0);
    }

    execute(st, output){
        if(this.value != undefined){
            const val = this.value.execute(st, output);
            if(val instanceof Error) return val;
            if(val.type == this.type){
                return st.Set( new Symbol(this.id, this.type, this.constant, this.dynamic, this.array, val.value, st.scope, this.row, this.column), 1);
            }else if(this.type == literal.dataTypes.ANY){
                if(val.type == literal.dataTypes.ARRAY_ANY || val.type == literal.dataTypes.ARRAY_STRING, val.type == literal.dataTypes.ARRAY_NUMBER || val.type == literal.dataTypes.ARRAY_BOOLEAN || val.type == literal.dataTypes.ARRAY_EMPTY){
                    if(val.type == literal.dataTypes.ARRAY_EMPTY) return st.Set(new Symbol(this.id, literal.dataTypes.ARRAY_ANY, this.constant, this.dynamic, true, val.value, st.scope, this.row, this.column, false), 1);
                    return st.Set(new Symbol(this.id, val.type, this.constant, this.dynamic, true, val.value, st.scope, this.row, this.column, false), 1);
                }else if(val.type != literal.dataTypes.ARRAY_OBJECT){
                    if(val.value === null) return st.Set(new Symbol(this.id, literal.dataTypes.ANY, this.constant, this.dynamic, this.array, val.value, st.scope, this.row, this.column), 1);
                    return st.Set(new Symbol(this.id, val.type, this.constant, this.dynamic, this.array, val.value, st.scope, this.row, this.column), 1);
                }
            }else if(val.type == literal.dataTypes.NULL){
                return st.Set(new Symbol(this.id, this.type, this.constant, this.dynamic, this.array, val.value, st.scope, this.row, this.column), 1);
            }else if(this.array){
                switch(this.type){
                    case literal.dataTypes.STRING:
                        if(val.type == literal.dataTypes.ARRAY_STRING || val.type == literal.dataTypes.ARRAY_EMPTY) return st.Set(new Symbol(this.id, literal.dataTypes.ARRAY_STRING, this.constant, this.dynamic, this.array, val.value, st.scope, this.row, this.column), 1);
                        break;
                    case literal.dataTypes.NUMBER:
                        if(val.type == literal.dataTypes.ARRAY_NUMBER || val.type == literal.dataTypes.ARRAY_EMPTY) return st.Set(new Symbol(this.id, literal.dataTypes.ARRAY_NUMBER, this.constant, this.dynamic, this.array, val.value, st.scope, this.row, this.column), 1);
                        break;
                    case literal.dataTypes.BOOLEAN:
                        if(val.type == literal.dataTypes.ARRAY_BOOLEAN || val.type == literal.dataTypes.ARRAY_EMPTY) return st.Set(new Symbol(this.id, literal.dataTypes.ARRAY_BOOLEAN, this.constant, this.dynamic, this.array, val.value, st.scope, this.row, this.column), 1);
                        break;
                    default:
                        /* TYPES VALIDATION */
                }
            }
            return new Error(literal.errorType.SEMANTIC, `No se puede asignar a un tipo '${this.type}' un '${val.type}'`, this.row, this.column);
        }
        return st.Set(new Symbol(this.id, this.type, this.constant, this.dynamic, this.array, undefined, st.scope, this.row, this.column), 1);
    }

}