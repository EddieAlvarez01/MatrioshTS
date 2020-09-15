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

    execute(st, output, errors){
        this.ParseType();
        if(this.value != undefined){
            const val = this.value.execute(st, output, errors);
            if(val instanceof Error) return val;
            if(val.type == this.type){
                return st.Set( new Symbol(this.id, this.type, this.constant, this.dynamic, this.array, val.value, st.scope, this.row, this.column), 1, 0);
            }else if(this.type == literal.dataTypes.ANY){
                if(val.type == literal.dataTypes.ARRAY_ANY || val.type == literal.dataTypes.ARRAY_STRING || val.type == literal.dataTypes.ARRAY_NUMBER || val.type == literal.dataTypes.ARRAY_BOOLEAN || val.type == literal.dataTypes.ARRAY_EMPTY){
                    if(val.type == literal.dataTypes.ARRAY_EMPTY) return st.Set(new Symbol(this.id, literal.dataTypes.ARRAY_ANY, this.constant, this.dynamic, true, val.value, st.scope, this.row, this.column, false), 1, 0);
                    return st.Set(new Symbol(this.id, val.type, this.constant, this.dynamic, true, val.value, st.scope, this.row, this.column, false), 1, 0);
                }else if(val.type != literal.dataTypes.OBJECT && val.type != literal.dataTypes.ARRAY_OBJECT){
                    if(val.value === null) return st.Set(new Symbol(this.id, literal.dataTypes.ANY, this.constant, this.dynamic, this.array, val.value, st.scope, this.row, this.column), 1, 0);
                    return st.Set(new Symbol(this.id, val.type, this.constant, this.dynamic, this.array, val.value, st.scope, this.row, this.column), 1, 0);
                }
            }else if(val.type == literal.dataTypes.NULL){
                if(st.CheckType(this)){
                    const searchType = st.GetType(this.type, this.row, this.column);
                    if(searchType instanceof Error) return searchType;
                    return st.Set(new Symbol(this.id, this.type, this.constant, this.dynamic, this.array, val.value, st.scope, this.row, this.column), 1, 0);
                }
                return st.Set(new Symbol(this.id, this.type, this.constant, this.dynamic, this.array, val.value, st.scope, this.row, this.column), 1, 0);
            }else if(this.array && val.type == literal.dataTypes.ARRAY_EMPTY){
                return st.Set(new Symbol(this.id, this.type, this.constant, this.dynamic, this.array, val.value, st.scope, this.row, this.column), 1, 0);
            }else if(st.CheckType(this)){
                if(val.type == literal.dataTypes.OBJECT && !this.array){
                    const searchType = st.GetType(this.type, this.row, this.column);
                    if(searchType instanceof Error) return searchType;
                    const validate = st.CheckDataType(searchType, val);
                    if(validate instanceof Error) return validate;
                    return st.Set(new Symbol(this.id, this.type, this.constant, this.dynamic, this.array, val.value, st.scope, this.row, this.column, false, false), 1, 0);
                }else if(this.array && val.type == literal.dataTypes.ARRAY_OBJECT){
                    const searchType = st.GetType(this.type, this.row, this.column);
                    if(searchType instanceof Error) return searchType;
                    for(let obj of val.value){
                        const validate = st.CheckDataType(searchType, obj);
                        if(validate instanceof Error) return validate;
                        obj.type = this.type;
                    }
                    return st.Set(new Symbol(this.id, this.type, this.constant, this.dynamic, this.array, val.value, st.scope, this.row, this.column, false, false), 1, 0);
                }
            }
            return new Error(literal.errorType.SEMANTIC, `No se puede asignar a un tipo '${this.type}' un '${val.type}'`, this.row, this.column);
        }
        if(st.CheckType(this)){
            const searchType = st.GetType(this.type, this.row, this.column);
            if(searchType instanceof Error) return searchType;
            return st.Set(new Symbol(this.id, this.type, this.constant, this.dynamic, this.array, undefined, st.scope, this.row, this.column, false), 1, 0);
        }
        return st.Set(new Symbol(this.id, this.type, this.constant, this.dynamic, this.array, undefined, st.scope, this.row, this.column), 1, 0);
    }

    //PARSE ARRAY TYPE
    ParseType(){
        if(this.array){
            switch(this.type){
                case literal.dataTypes.STRING:
                    this.type = literal.dataTypes.ARRAY_STRING;
                    break;
                case literal.dataTypes.NUMBER:
                    this.type = literal.dataTypes.ARRAY_NUMBER;
                    break;
                case literal.dataTypes.BOOLEAN:
                    this.type = literal.dataTypes.ARRAY_BOOLEAN;
                    break;
            }
        }
    }

}