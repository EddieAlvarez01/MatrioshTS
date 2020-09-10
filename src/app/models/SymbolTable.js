import Error from './Error';
import { literal } from '../utilities/util';

export class SymbolTable{

    constructor(scope){
        this.symbols = [];
        this.next = null;
        this.scope = scope;
    }

    //SAVE A VARIABLE IN THE SCOPE  -->BEHAVIOR 1 = EXECUTE, 0 = TRADUCTION
    Set(symbol, behavior){
        if(behavior){
            if(this.SearchDuplicate(symbol.id)){
                this.symbols.push(symbol);
                return null;    //was successfully executed
            }
            return new Error(literal.errorType.SEMANTIC, `La variable '${symbol.id}' esta duplicada`, symbol.row, symbol.column);
        }
        this.symbols.push(symbol);
    }

    //search for duplicate variables
    SearchDuplicate(id){
        for(let symbol of this.symbols){
            if(symbol.id == id){
                return false;
            }
        }
        return true;
    }

    //bring value of a variable
    GetValue(operation){
        for(let symbol of this.symbols){
            if(symbol.id == operation.value){
                return symbol;
            }
        }
        if(this.next != null){
            return this.next.GetValue(operation);
        }
        return new Error(literal.errorType.SEMANTIC, `No se ha declarado la variable '${operation.value}'`, operation.row, operation.column);
    }

}