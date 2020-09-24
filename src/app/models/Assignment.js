import Error from './Error';
import { literal } from '../utilities/util';
import { Operation } from './Operation';

export class Assignment{

    constructor(id, value, row, column){
        this.id = id;
        this.value = value;
        this.row = row;
        this.column = column;
    }

    traduction(st, scope){}

    execute(st, output, errors){
        let symbol;
        if(!(typeof this.id == 'string')){
            symbol = this.id.execute(st, output, errors);
        }else{
            symbol = st.GetValue(Operation.NewOperationValue('variable', this.id, this.row, this.column), true);
        }
        if(symbol instanceof Error) return symbol;
        if(symbol.constant) return new Error(literal.errorType.SEMANTIC, `Una constante no puede ser asignada`, this.row, this.column);
        const expl = this.value.execute(st, output, errors);
        if(expl instanceof Error) return expl;
        if(symbol.array){
            switch(symbol.type){
                case literal.dataTypes.ARRAY_STRING:
                    switch(expl.type){
                        case literal.dataTypes.ARRAY_STRING:
                        case literal.dataTypes.ARRAY_EMPTY:
                            symbol.value = expl.value;
                            break;
                        case literal.dataTypes.NULL:
                            symbol.value = expl.value;
                            if(symbol.dynamic) symbol.type = literal.dataTypes.ANY;
                            symbol.array = false;
                            break;
                        default:
                            return this.ReportErrorTypes(symbol.type, expl.type);
                    }
                    break;
                case literal.dataTypes.ARRAY_NUMBER:
                    switch(expl.type){
                        case literal.dataTypes.ARRAY_NUMBER:
                        case literal.dataTypes.ARRAY_EMPTY:
                            symbol.value = expl.value;
                            break;
                        case literal.dataTypes.NULL:
                            symbol.value = expl.value;
                            if(symbol.dynamic) symbol.type = literal.dataTypes.ANY;
                            symbol.array = false;
                            break;
                        default:
                            return this.ReportErrorTypes(symbol.type, expl.type);
                    }
                    break;
                case literal.dataTypes.ARRAY_BOOLEAN:
                    switch(expl.type){
                        case literal.dataTypes.ARRAY_BOOLEAN:
                        case literal.dataTypes.ARRAY_EMPTY:
                            symbol.value = expl.value;
                            break;
                        case literal.dataTypes.NULL:
                            symbol.value = expl.value;
                            if(symbol.dynamic) symbol.type = literal.dataTypes.ANY;
                            symbol.array = false;
                            break;
                        default:
                            return this.ReportErrorTypes(symbol.type, expl.type);
                    }
                    break;
                case literal.dataTypes.ARRAY_ANY:
                    switch(expl.type){
                        case literal.dataTypes.ARRAY_ANY:
                        case literal.dataTypes.ARRAY_EMPTY:
                        case literal.dataTypes.ARRAY_NUMBER:
                        case literal.dataTypes.ARRAY_BOOLEAN:
                        case literal.dataTypes.ARRAY_STRING:
                            symbol.value = expl.value;
                            symbol.type = expl.type;
                            break;
                        case literal.dataTypes.NULL:
                            symbol.value = expl.value;
                            if(symbol.dynamic) symbol.type = literal.dataTypes.ANY;
                            symbol.array = false;
                            break;
                        default:
                            return this.ReportErrorTypes(symbol.type, expl.type);
                    }
                    break;
                default:
                    if(!st.CheckType(symbol)) return this.ReportErrorTypes(symbol.type, expl.type);
                    switch(expl.type){
                        case literal.dataTypes.NULL:
                            symbol.value = expl.value;
                            break;
                        case literal.dataTypes.ARRAY_OBJECT:
                            const typeSearch = st.GetType(symbol.type, this.row, this.column);
                            if(typeSearch instanceof Error) return typeSearch;
                            for(let val of expl.value){
                                if(val.type != symbol.type){
                                    const validate = st.CheckDataType(typeSearch, val);
                                    if(validate instanceof Error) return validate;
                                    val.type = symbol.type;
                                }
                            }
                            symbol.value = expl.value;
                            break;
                        default:
                            return this.ReportErrorTypes(symbol.type, expl.type);
                    }
            }
        }else{
            switch(symbol.type){
                case literal.dataTypes.STRING:
                    switch(expl.type){
                        case literal.dataTypes.STRING:
                            symbol.value = expl.value;
                            break;
                        case literal.dataTypes.NULL:
                            symbol.value = expl.value;
                            if(symbol.dynamic) symbol.type = literal.dataTypes.ANY;
                            break;
                        default:
                            return this.ReportErrorTypes(symbol.type, expl.type);
                    }
                    break;
                case literal.dataTypes.NUMBER:
                    switch(expl.type){
                        case literal.dataTypes.NUMBER:
                            symbol.value = expl.value;
                            break;
                        case literal.dataTypes.NULL:
                            symbol.value = expl.value;
                            if(symbol.dynamic) symbol.type = literal.dataTypes.ANY;
                            break;
                        default:
                            return this.ReportErrorTypes(symbol.type, expl.type);
                    }
                    break;
                case literal.dataTypes.BOOLEAN:
                    switch(expl.type){
                        case literal.dataTypes.BOOLEAN:
                            symbol.value = expl.value;
                            break;
                        case literal.dataTypes.NULL:
                            symbol.value = expl.value;
                            if(symbol.dynamic) symbol.type = literal.dataTypes.ANY;
                            break;
                        default:
                            return this.ReportErrorTypes(symbol.type, expl.type);
                    }
                    break;
                case literal.dataTypes.ANY:
                    switch(expl.type){
                        case literal.dataTypes.ARRAY_OBJECT || literal.dataTypes.OBJECT:
                            return this.ReportErrorTypes(symbol.type, expl.type);
                        case literal.dataTypes.NULL:
                            symbol.value = expl.value;
                            break;
                        case literal.dataTypes.ARRAY_EMPTY:
                            symbol.value = expl.value;
                            symbol.type = literal.dataTypes.ARRAY_ANY;
                            symbol.array = true;
                            break;
                        case literal.dataTypes.ARRAY_STRING:
                        case literal.dataTypes.ARRAY_NUMBER:
                        case literal.dataTypes.ARRAY_BOOLEAN:
                        case literal.dataTypes.ARRAY_ANY:
                            symbol.value = expl.value;
                            symbol.type = expl.type;
                            symbol.array = true;
                            break;
                        default:
                            symbol.value = expl.value;
                            symbol.type = expl.type;
                            symbol.array = (expl.hasOwnProperty('array')) ? expl.array : false;
                    }
                    break;
                default:
                    if(!st.CheckType(symbol)) return this.ReportErrorTypes(symbol.type, expl.type);
                    switch(expl.type){
                        case literal.dataTypes.NULL:
                            symbol.value = expl.value;
                            break;
                        case literal.dataTypes.OBJECT:
                            const typeSearch = st.GetType(symbol.type, this.row, this.column);
                            if(typeSearch instanceof Error) return typeSearch;
                            const validate = st.CheckDataType(typeSearch, expl);
                            if(validate instanceof Error) return validate;
                            symbol.value = expl.value;
                            break;
                        default:
                            if(symbol.type == expl.type){
                                symbol.value = expl.value;
                            }else{
                                return this.ReportErrorTypes(symbol.type, expl.type);
                            }
                    }
            }
        }
        return null;
    }

    ReportErrorTypes(symbolType, valueType){
        return new Error(literal.errorType.SEMANTIC, `No se puede asignar a un tipo '${symbolType}' un '${valueType}'`, this.row, this.column);
    }

}