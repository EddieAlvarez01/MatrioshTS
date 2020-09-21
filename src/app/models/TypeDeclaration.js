import { literal } from '../utilities/util';
import { Symbol } from './Symbol';
import Error from './Error';

export class TypeDeclaration{

    constructor(id, type, listPropertys, row, column){
        this.id = id;
        this.type = type;
        this.listPropertys = listPropertys;
        this.row = row;
        this.column = column;
    }

    traduction(st, scope){
        st.Set(Symbol.NewSymbolTranslate(this.id, 'Type', scope, this.row, this.column), 0);
    }

    execute(st, output, errors){
        const symbol = new Symbol(this.id, this.id, false, false, false, null, st.scope, this.row, this.column, true);
        for(let node of this.listPropertys){
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
                        if(node.type != this.id){
                            const resultType = st.GetType(node.type, node.row, node.column);
                            if(resultType instanceof Error) return resultType; 
                        }
                } 
            }else{
                if(st.CheckType(node) && node.type != this.id){
                    const resultType = st.GetType(node.type, node.row, node.column);
                    if(resultType instanceof Error) return resultType; 
                }
            }
            const result = symbol.SetProperty(new Symbol(node.value, node.type, node.constant, node.dynamic, node.array, null, st.scope, node.row, node.column, false), 1);
            if(result instanceof Error) return result;
        }
        return st.Set(symbol, 1, 1);
    }

}