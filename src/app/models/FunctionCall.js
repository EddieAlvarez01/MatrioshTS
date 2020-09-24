import { literal } from '../utilities/util';
import { Symbol } from './Symbol';
import { SymbolTable } from './SymbolTable';
import { Return } from './Return';
import Error from './Error';

export class FunctionCall{

    constructor(id, parametersList, row, column){
        this.id = id;
        this.parametersList = parametersList;
        this.row = row;
        this.column = column;
    }

    traduction(st, scope){}

    execute(st, output, errors){
        const functionFound = st.GetFunction(this.id, this.row, this.column);
        if(functionFound instanceof Error) return functionFound;

        //check for inherited function
        let stForFunction;
        if(this.CheckFunction(st)){
            stForFunction = st;
        }else{
            stForFunction = st.SearchScope(this.id);
        }
        
        if(this.parametersList.length != functionFound.parameters.length) return new Error(literal.errorType.SEMANTIC, `La funcion '${this.id}' espera ${functionFound.parameters.length} parametros pero solo le estan mandando ${this.parametersList.length}`, this.row, this.column);
        const parametersValues = [];
        for(let parameter of this.parametersList){
            const result = parameter.execute(st, output, errors);
            if(result instanceof Error) return result;
            parametersValues.push(result);
        }
        const newSt = new SymbolTable(`Function (${this.id})`);
        newSt.next = stForFunction;
        for(let i = 0; i < functionFound.parameters.length; i++){
            switch(functionFound.parameters[i].type){
                case literal.dataTypes.ANY:
                    switch(parametersValues[i].type){
                        case literal.dataTypes.NULL:
                            newSt.Set(new Symbol(functionFound.parameters[i].id, literal.dataTypes.ANY, false, true, false, parametersValues[i].value, newSt.scope, parametersValues[i].row, parametersValues[i].column, false, false), 1, 2);
                            break;
                        case literal.dataTypes.OBJECT:
                            return new Error(literal.errorType.SEMANTIC, `No se puede asignar a un 'any' un 'object'`, parametersValues[i].row, parametersValues[i].column);
                        case literal.dataTypes.ARRAY_EMPTY:
                            newSt.Set(new Symbol(functionFound.parameter[i].id, literal.dataTypes.ARRAY_ANY, false, true, true, [], newSt.scope, parametersValues[i].row, parametersValues[i].column, false, false), 1, 2);    
                        break;
                        default:
                            newSt.Set(new Symbol(functionFound.parameters[i].id, parametersValues[i].type, false, true, parametersValues[i].array, parametersValues[i].value, newSt.scope, parametersValues[i].row, parametersValues[i].column, false, false), 1, 2);
                            break;
                    }
                break;
                default:
                    if(functionFound.parameters[i].type == parametersValues[i].type){
                        newSt.Set(new Symbol(functionFound.parameters[i].id, parametersValues[i].type, false, false, parametersValues[i].array, parametersValues[i].value, newSt.scope, parametersValues[i].row, parametersValues[i].column, false, false), 1, 2);
                    }else if(newSt.CheckType(functionFound.parameters[i]) && parametersValues[i].type == literal.dataTypes.OBJECT && !functionFound.parameters[i].array){
                        const searchType = newSt.GetType(functionFound.parameters[i].id, functionFound.parameters[i].row, functionFound.parameters[i].column);
                        if(searchType instanceof Error) return searchType;
                        const validate = newSt.CheckDataType(searchType, parametersValues[i].value);
                        if(validate instanceof Error) return validate;
                        newSt.Set(new Symbol(functionFound.parameters[i].id, functionFound.parameters[i].type, false, false, functionFound.parameters[i].array, parametersValues[i].value, newSt.scope, parametersValues[i].row, parametersValues[i].column, false, false), 1, 2);
                    }else if(newSt.CheckType(functionFound.parameters[i]) && parametersValues[i].type == literal.dataTypes.ARRAY_OBJECT && functionFound.parameters[i].array){
                        const typeSearch = newSt.GetType(functionFound.parameters[i].type, functionFound.parameters[i].row, functionFound.parameters[i].column);
                        if(typeSearch instanceof Error) return typeSearch;
                        for(let val of parametersValues[i].value){
                            if(val.type != functionFound.parameters[i].type){
                                const validate = st.CheckDataType(typeSearch, val);
                                if(validate instanceof Error) return validate;
                                val.type = functionFound.parameters[i].type;
                            }
                        }
                        newSt.Set(new Symbol(functionFound.parameters[i].id, functionFound.parameters[i].type, false, false, true, parametersValues[i].value, newSt.scope, parametersValues[i].row, parametersValues[i].column, false, false), 1, 2);
                    }else if(functionFound.parameters[i].array && parametersValues[i].type == literal.dataTypes.ARRAY_EMPTY){
                        newSt.Set(new Symbol(functionFound.parameters[i].id, functionFound.parameters[i].type, false, false, functionFound.parameters[i].array, parametersValues[i].value, newSt.scope, parametersValues[i].row, parametersValues[i].column, false, false), 1, 2);
                    }else{
                        return new Error(literal.errorType.SEMANTIC, `No se puede asignar a un tipo '${functionFound.parameters[i].type}' un tipo '${parametersValues[i].type}'`, parametersValues[i].row, parametersValues[i].column);
                    }
            }
        }
        for(let instruction of functionFound.value){
            const resultInstruction = instruction.execute(newSt, output, errors);
            if(resultInstruction instanceof Error){
                errors.push(resultInstruction);
            }else if(resultInstruction instanceof Return){
                const resultType = this.CheckTypes(newSt, functionFound, resultInstruction.expression, resultInstruction.row, resultInstruction.column);
                if(resultType instanceof Error) return resultType;
                return resultInstruction.expression;
            }
        }
        if(functionFound.type != literal.dataTypes.ANY && functionFound.type != literal.dataTypes.VOID){
            return new Error(literal.errorType.SEMANTIC, `La funcion debe retornar un tipo '${functionFound.type}'`, functionFound.row, functionFound.column);
        }
        return new Symbol('', literal.dataTypes.NULL, false, false, false, null, st.scope, this.row, this.column, false, false);
    }

    CheckTypes(st, runningFunction, symbol, row, column){
        if(runningFunction.array){
            switch(symbol.type){
                case literal.dataTypes.NULL:
                    symbol.type = runningFunction.type;
                    symbol.array = true;
                break;
                case literal.dataTypes.ARRAY_EMPTY:
                    symbol.type = runningFunction.type;
                break;
                case literal.dataTypes.ARRAY_OBJECT:
                    if(st.CheckType(runningFunction)){
                        const searchType = st.GetType(runningFunction.type, runningFunction.row, runningFunction.column);
                        for(let obj of symbol.value){
                            if(obj.type != runningFunction.type){
                                const validate = st.CheckDataType(searchType, obj);
                                if(validate instanceof Error) return validate;
                                obj.type = runningFunction.type;
                            }
                        }
                    }
                break;
                default:
                    if(runningFunction.type != symbol.type){
                        return new Error(literal.errorType.SEMANTIC, `No se puede retornar un tipo '${symbol.type}' en una funcion tipo '${runningFunction.type}'`, row, column);
                    }
            }
        }else{
            switch(runningFunction.type){
                case literal.dataTypes.ANY:
                    break;
                case literal.dataTypes.VOID:
                    if(symbol.type != literal.dataTypes.NULL) return new Error(literal.errorType.SEMANTIC, `No se puede retornar algo en una funcion tipo 'void'`, row, column);
                    break;
                default:
                    if(runningFunction.type != symbol.type){
                        if(st.CheckType(runningFunction) && symbol.type == literal.dataTypes.OBJECT){
                            const searchType = st.GetType(runningFunction.type, runningFunction.row, runningFunction.column);
                            const validate = st.CheckDataType(searchType, symbol);
                            if(validate instanceof Error) return validate;
                            symbol.type = runningFunction.type;
                        }else if(symbol.type != literal.dataTypes.NULL){
                            return new Error(literal.errorType.SEMANTIC, `No se puede retornar un tipo '${symbol.type}' en una funcion tipo '${runningFunction.type}'`, row, column);
                        }
                    }
            } 
        }
        return true;
    }

    CheckFunction(st){
        if(st.scope.includes('Function')){
            const name = st.scope.substring(10, st.scope.length - 2);
            return this.id.includes(name);
        }
        return false;
    }
}