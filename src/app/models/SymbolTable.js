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

    //SEARCH SCOPE --- OP = 1 --- SEARCH A VARIABLE, OP = 2, SEARCH A TYPE --- OP = 3, SEARCH A FUNCTION 
    SearchId(id, row, column, op){
        for(let symbol of this.symbols){
            if(symbol.id == id){
                switch(op){
                    case 1:
                        if(!symbol.isType) return symbol;
                    case 2:
                        break;
                }
                return symbol;
            }
        }
        if(this.next != null){
            return this.next.SearchId(id, row, column, op);
        }
        switch(op){
            case 1:
                return new Error(literal.errorType.SEMANTIC, `La variable '${id}' no se ha declarado`, row, column);
        }
    }
    
}