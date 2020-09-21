import { Symbol } from './Symbol';
import { literal } from '../utilities/util';
import Error from './Error';

export class Function{

    constructor(id, parametersList, type, array, instructionsList, row, column){
        this.id = id;
        this.parametersList = parametersList;
        this.type = type;
        this.array = array;
        this.instructionsList = instructionsList;
        this.row = row;
        this.column = column;
    }

    traduction(st, scope){
        this.parametersList.forEach((parameter) => {
            st.Set(Symbol.NewSymbolTranslate(parameter.value, parameter.type, `function (${this.id})`, parameter.row, parameter.column), 0);
        });
        this.instructionsList.forEach((instruction) => {
            instruction.traduction(st, `function (${this.id})`);
        });
    }

    execute(st, output, errors){
        if(st.CheckType(this)){
            const type = st.GetType(this.type, this.row, this.column);
            if(type instanceof Error) return type;
        }
        if(!this.ParseType(this)) return new Error(literal.errorType.SEMANTIC, `No se puede declarar una funcion tipo '${this.type}[]'`, this.row, this.column);
        const newSymbol = new Symbol(this.id, this.type, false, false, this.array, this.instructionsList, st.scope, this.row, this.column, false, true);
        for(let node of this.parametersList){
            if(node.array){
                switch(node.type){
                    case literal.dataTypes.STRING:
                        node.type = literal.dataTypes.ARRAY_STRING;
                    break;
                    case literal.dataTypes.NUMBER:
                        node.type = literal.dataTypes.ARRAY_NUMBER;
                    break;
                    case literal.dataTypes.BOOLEAN:
                        node.type = literal.dataTypes.ARRAY_BOOLEAN;
                    break;
                    default:
                        if(!st.CheckType(node)) return new Error(literal.errorType.SEMANTIC, `No se puede declarar un tipo 'void[]'`, this.row, this.column);
                }
            }else{
                if(st.CheckType(node)){
                    const checkType = st.GetType(node.type, node.row, node.column);
                    if(checkType instanceof Error) return checkType;
                }
            }
            const result = newSymbol.SetProperty(new Symbol(node.value, node.type, node.constant, node.dynamic, node.array, null, st.scope, node.row, node.column, false, false), 2);
            if(result instanceof Error) return result;
        }
        return st.Set(newSymbol, 1, 2);
    }

    //PARSING TYPES
    ParseType(node){
        if(node.array){
            switch(node.type){
                case literal.dataTypes.STRING:
                    node.type = literal.dataTypes.ARRAY_STRING;
                break;
                case literal.dataTypes.NUMBER:
                    node.type = literal.dataTypes.ARRAY_NUMBER;
                break;
                case literal.dataTypes.BOOLEAN:
                    node.type = literal.dataTypes.ARRAY_BOOLEAN;
                break;
                default:
                    if(!st.CheckType(this)) return false;
            }
        }
        return true;
    }

}