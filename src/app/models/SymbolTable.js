import Error from './Error';
import { literal } from '../utilities/util';
import { TypeDeclaration } from './TypeDeclaration';

export class SymbolTable{

    constructor(scope){
        this.symbols = [];
        this.next = null;
        this.scope = scope;
    }

    //SAVE A VARIABLE IN THE SCOPE  -->BEHAVIOR 1 = EXECUTE, 0 = TRADUCTION --- type = 0 -> variable, type = 1 -> type, type = 2 -> function
    Set(symbol, behavior, type){
        if(behavior){
            if(this.SearchDuplicate(symbol.id, type)){
                this.symbols.push(symbol);
                return null;    //was successfully executed
            }
            switch(type){
                case 0:
                    return new Error(literal.errorType.SEMANTIC, `La variable '${symbol.id}' esta duplicada`, symbol.row, symbol.column);
                case 1:
                    return new Error(literal.errorType.SEMANTIC, `El type '${symbol.id}' esta duplicado`, symbol.row, symbol.column);
                default:
                    return new Error(literal.errorType.SEMANTIC, `La función '${symbol.id}' esta duplicada`, symbol.row, symbol.column);
            }
        }
        this.symbols.push(symbol);
    }

    //search for duplicate variables
    SearchDuplicate(id, type){
        for(let symbol of this.symbols){
            if(symbol.id == id){
                switch(type){
                    case 1:
                        if(symbol.isType) return false;
                        break;
                    default:
                        if(!symbol.isType) return false;
                }
            }
        }
        return true;
    }

    //bring value of a variable
    GetValue(operation){
        const symbol = this.SearchId(operation.value, operation.row, operation.column, 1);
        if(symbol instanceof Error) return symbol;
        if(symbol.value === undefined) return new Error(literal.errorType.SEMANTIC, `La variable aun no ha sido declarada con ningún valor`, operation.row, operation.column);
        return symbol;
    }

    //bring value from an array -- obj IS ARRAY_ACCESS TYPE
    GetArrayValue(obj){
        const symbol = this.SearchId(obj.id, obj.row, obj.column, 1);
        if(symbol instanceof Error) return symbol;
        if(symbol.value === undefined) return new Error(literal.errorType.SEMANTIC, `La variable aun no ha sido declarada con ningún valor`, operation.row, operation.column);
        return symbol;
    }

    //GET TYPE
    GetType(id, row, column){
        return this.SearchId(id, row, column, 2);
    }

    //SEARCH SCOPE --- OP = 1 --- SEARCH A VARIABLE, OP = 2, SEARCH A TYPE --- OP = 3, SEARCH A FUNCTION 
    SearchId(id, row, column, op){
        for(let symbol of this.symbols){
            if(symbol.id == id){
                switch(op){                        
                    case 2:
                        if(symbol.isType) return symbol;
                        break;
                    default:
                        if(!symbol.isType) return symbol;
                }
            }
        }
        if(this.next != null){
            return this.next.SearchId(id, row, column, op);
        }
        switch(op){
            case 1:
                return new Error(literal.errorType.SEMANTIC, `La variable '${id}' no se ha declarado`, row, column);
            case 2:
                return new Error(literal.errorType.SEMANTIC, `El type '${id}' no se ha declarado`, row, column);
        }
    }

    //CHECK IF IT IS A TYPE
    CheckType(symbol){
        switch(symbol.type){
            case literal.dataTypes.ANY:
            case literal.dataTypes.STRING:
            case literal.dataTypes.NUMBER:
            case literal.dataTypes.BOOLEAN:
            case literal.dataTypes.ARRAY_ANY:
            case literal.dataTypes.ARRAY_STRING:
            case literal.dataTypes.ARRAY_NUMBER:
            case literal.dataTypes.ARRAY_BOOLEAN:
                return false;
        }
        return true;
    }

    //SEARCH TYPES
    SearchTypes(instructionList, output, errors){
        for(let index in instructionList){
            if(instructionList[index] instanceof TypeDeclaration){
                const result = instructionList[index].execute(this, output, errors);
                if(result instanceof Error){
                    errors.push(result);
                }
                instructionList.splice(index, 1);
            }
        }
    }

    //check data consistency with type
    CheckDataType(type, obj){
        for(let [key, symbol] of type.propertys){
            const sProperty = obj.value[key];
            if(sProperty === undefined) return new Error(literal.errorType.SEMANTIC, `La propiedad '${key}' no esta definida`, obj.row, obj.column);
            switch(symbol.type){
                case literal.dataTypes.ANY:
                    switch(sProperty.type){
                        case literal.dataTypes.OBJECT:
                            return new Error(literal.errorType.SEMANTIC, `No se puede asignar a un tipo '${symbol.type}' un '${sProperty.type}'`, sProperty.row, sProperty.column);
                        case literal.dataTypes.ARRAY_EMPTY:
                            sProperty.type = literal.dataTypes.ARRAY_ANY;
                            break;
                        case literal.dataTypes.NULL:
                            sProperty.type = literal.dataTypes.ANY;
                    }
                    sProperty.dynamic = true;
                    break;
                case literal.dataTypes.STRING:
                    switch(sProperty.type){
                        case literal.dataTypes.STRING:
                        case literal.dataTypes.NULL:
                            sProperty.type = literal.dataTypes.STRING;
                            break;
                        default:
                            return new Error(literal.errorType.SEMANTIC, `No se puede asignar a un tipo '${symbol.type}' un '${sProperty.type}'`, sProperty.row, sProperty.column);
                    }
                    sProperty.dynamic = false;
                    break;
                case literal.dataTypes.NUMBER:
                    switch(sProperty.type){
                        case literal.dataTypes.NUMBER:
                        case literal.dataTypes.NULL:
                            sProperty.type = literal.dataTypes.NUMBER;
                            break;
                        default:
                            return new Error(literal.errorType.SEMANTIC, `No se puede asignar a un tipo '${symbol.type}' un '${sProperty.type}'`, sProperty.row, sProperty.column);
                    }
                    sProperty.dynamic = false;
                    break;
                case literal.dataTypes.BOOLEAN:
                    switch(sProperty.type){
                        case literal.dataTypes.BOOLEAN:
                        case literal.dataTypes.NULL:
                            sProperty.type = literal.dataTypes.BOOLEAN;
                            break;
                        default:
                            return new Error(literal.errorType.SEMANTIC, `No se puede asignar a un tipo '${symbol.type}' un '${sProperty.type}'`, sProperty.row, sProperty.column);
                    }
                    sProperty.dynamic = false;
                    break;
                default:
                    if(symbol.array){
                        if(symbol.type == sProperty.type){
                            sProperty.dynamic = false;
                        }else if(sProperty.type == literal.dataTypes.ARRAY_EMPTY || sProperty.type == literal.dataTypes.NULL){
                            sProperty.dynamic = false;
                            sProperty.array = true;
                            sProperty.type = symbol.type;
                        }else{
                            return new Error(literal.errorType.SEMANTIC, `No se puede asignar a un tipo '${symbol.type}' un '${sProperty.type}'`, sProperty.row, sProperty.column);
                        }
                    }else{
                        if(sProperty.type == literal.dataTypes.OBJECT){
                            const searchType = this.GetType(symbol.type, this.row, this.column);
                            if(searchType instanceof Error) return searchType;
                            const validate = this.CheckDataType(searchType, sProperty);
                            if(validate instanceof Error) return validate;
                            sProperty.type = searchType.id; 
                        }else if(sProperty.type == literal.dataTypes.NULL){
                            const searchType = this.GetType(symbol.type, this.row, this.column);
                            if(searchType instanceof Error) return searchType;
                            sProperty.type = symbol.type;
                            sProperty.dynamic = false;
                        }else if(!(sProperty.type == symbol.type)){
                            return new Error(literal.errorType.SEMANTIC, `No se puede asignar a un tipo '${symbol.type}' un '${sProperty.type}'`, sProperty.row, sProperty.column);
                        }
                    }
            }
        }
        return this.CheckExtraElements(type, obj);
    }

    //check extra elements in the type
    CheckExtraElements(type, obj){
        for(let key in obj.value){
            if(type.propertys.get(key) === undefined) return new Error(literal.errorType.SEMANTIC, `La propiedad '${key}' no existe en el type`, obj.value[key].row, obj.value[key].column);
        }
        return null;
    }
    
}

