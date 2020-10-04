import Error from './Error';
import { literal } from '../utilities/util';
import { TypeDeclaration } from './TypeDeclaration';
import { Function } from './Function';

export class SymbolTable{

    constructor(scope){
        this.symbols = [];
        this.next = null;
        this.scope = scope;
        this.assignment = false;
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

    //bring value of a variable --- flag = true -> for assignment
    GetValue(operation, flag){
        const symbol = this.SearchId(operation.value, operation.row, operation.column, 1);
        if(symbol instanceof Error) return symbol;
        if(symbol.value === undefined && !flag) return new Error(literal.errorType.SEMANTIC, `La variable '${symbol.id}' aun no ha sido declarada con ningún valor`, operation.row, operation.column);
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

    //GET FUNCTION
    GetFunction(id, row, column){
        return this.SearchId(id, row, column, 3);
    }

    SearchScope(id){
        for(let symbol of this.symbols){
            if(symbol.id == id){
                if(!symbol.isType) return this;
            }
        }
        if(this.next != null){
            return this.next.SearchScope(id);
        }
        return null;
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
            case 3:
                return new Error(literal.errorType.SEMANTIC, `La funcion '${id}' no se ha declarado`, row, column);
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
            case literal.dataTypes.VOID:
                return false;
        }
        return true;
    }

    //SEARCH TYPES
    SearchTypes(instructionList, output, errors){
        let noTypes = 0;
        for(let instruction of instructionList){
            if(instruction instanceof TypeDeclaration){
                const result = instruction.execute(this, output, errors);
                if(result instanceof Error){
                    errors.push(result);
                }
                noTypes++;
            }
        }
        this.RemoveFound(instructionList, noTypes, 1);
    }

    //SEARCH FUNCTIONS
    SearchFunctions(instructionList, output, errors){
        let noFunctions = 0;
        for(let instruction of instructionList){
            if(instruction instanceof Function){
                const result = instruction.execute(this, output, errors);
                if(result instanceof Error){
                    errors.push(result);
                }
                noFunctions++;
            }
        }
        this.RemoveFound(instructionList, noFunctions, 2);
    }

    //DELETE EXECUTE TYPES AND FUNCTIONS
    //option = 1, TYPES
    //option = 2, Functions
    RemoveFound(instructionList, count, option){
        for(let i = 0; i < count; i++){
            let index;
            if(option == 1){
                index = instructionList.findIndex((element) => element instanceof TypeDeclaration);
            }else{
                index = instructionList.findIndex((element) => element instanceof Function);
            }
            instructionList.splice(index, 1);
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
                        }else if(sProperty.type == literal.dataTypes.ARRAY_ANY){
                            const validate = EvaluateArrays(symbol.type, sProperty, this, sProperty.row, sProperty.column);
                            if(validate instanceof Error) return validate
                            if(!validate) return new Error(literal.errorType.SEMANTIC, `No se puede asignar a un tipo '${symbol.type}' un '${sProperty.type}'`, sProperty.row, sProperty.column);
                            sProperty.type = symbol.type;
                            sProperty.array = true;
                        }else{
                            return new Error(literal.errorType.SEMANTIC, `No se puede asignar a un tipo '${symbol.type}' un '${sProperty.type}'`, sProperty.row, sProperty.column);
                        }
                    }else{
                        if(sProperty.type == literal.dataTypes.OBJECT){
                            const searchType = this.GetType(symbol.type, symbol.row, symbol.column);
                            if(searchType instanceof Error) return searchType;
                            const validate = this.CheckDataType(searchType, sProperty);
                            if(validate instanceof Error) return validate;
                            sProperty.type = searchType.id; 
                        }else if(sProperty.type == literal.dataTypes.NULL){
                            const searchType = this.GetType(symbol.type, symbol.row, symbol.column);
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

    //corroborate that I am in a cycle or function
    //option = 1, for break statement
    //option = 2, for continue statement
    CheckCicleFunction(option, row, column){
        if(this.CheckCycleType(option)) return true;
        if(this.next != null){
            return this.next.CheckCicleFunction(option, row, column);
        }
        switch(option){
            case 1:
                return new Error(literal.errorType.SEMANTIC, `No se puede utilizar 'break' en un ámbito que no es un ciclo o switch`, row, column);
            case 2:
                return new Error(literal.errorType.SEMANTIC, `No se puede utilizar 'continue' en un ámbito que no es un ciclo`, row, column);
            default:
        }
    }

    //see the type of cycle
    CheckCycleType(option){
        switch(this.scope){
            case 'Do-While':
                return true;
            case 'For':
                return true;
            case 'ForIn':
                return true;
            case 'ForOf':
                return true;
            case 'While':
                return true;
            case 'Switch':
                if(option == 2) break;  //FOR CONTINUE STATEMENT
                return true;
        }
        return false;
    }

    CheckFunctionScope(row, column){
        if(this.scope.includes('Function')) return true;
        if(this.next != null){
            return this.next.CheckFunctionScope(row, column);
        }
        return new Error(literal.errorType.SEMANTIC, `No se puede utilizar un return en este ámbito`, row, column);
    }
    
}

