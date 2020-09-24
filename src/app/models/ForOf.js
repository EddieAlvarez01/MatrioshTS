import { Declaration } from './Declaration';
import { Operation } from './Operation';
import { Break } from './Break';
import { Continue } from './Continue';
import { literal } from '../utilities/util';
import { SymbolTable } from './SymbolTable';
import { Symbol } from './Symbol';
import { Return } from './Return';
import Error from './Error';

export class ForOf{

    constructor(variable, iterator, instructionsList, row, column){
        this.variable = variable;
        this.iterator = iterator;
        this.instructionsList = instructionsList;
        this.row = row;
        this.column = column;
    }

    traduction(st, scope){
        if(this.variable instanceof Declaration){
            this.variable.traduction(st, 'ForOf');
        }
        this.instructionsList.forEach((instruction) => {
            instruction.traduction(st, 'ForOf');
        });
    }

    execute(st, output, errors){
        let symbol;
        const newSt = new SymbolTable('ForOf');
        newSt.next = st;
        if(this.variable instanceof Operation && this.variable.type == literal.dataTypes.VARIABLE){
            symbol = st.GetValue(this.variable, true);
            if(symbol.constant) return new Error(literal.errorType.SEMANTIC, `No se puede asignar a una constante`, this.row, this.column);
        }else if(!(this.variable instanceof Declaration)){
            symbol = this.variable.execute(newSt, output, errors);
            if(symbol.constant) return new Error(literal.errorType.SEMANTIC, `No se puede asignar a una constante`, this.row, this.column);
        }else{
            const result = this.variable.execute(newSt, output, errors);
            if(result instanceof Error) return result;
            symbol = newSt.symbols[0];
        }
        if(symbol instanceof Error) return symbol;
        if(!(symbol instanceof Symbol)) return new Error(literal.errorType.SEMANTIC, `No se puede asignar en un '${symbol.type}' para iterar`, this.row, this.column);
        const iterable = this.iterator.execute(newSt, output, errors);
        if(iterable instanceof Error) return iterable;
        if(!iterable.array) return new Error(literal.errorType.SEMANTIC, `No se puede iterar un tipo '${iterable.type}'`, this.row, this.column);
        const check = this.CheckTypes(symbol, iterable);
        if(check instanceof Error) return check;
        if(iterable.value == null) return new Error(literal.errorType.SEMANTIC, `No se puede iterar un null`, this.row, this.column);
        for(let itSymbol of iterable.value){
            newSt.symbols = [symbol];
            if(iterable.type == literal.dataTypes.ARRAY_ANY){
                symbol.type = itSymbol.type;
            }else if(symbol.type == literal.dataTypes.ANY){
                symbol.type = itSymbol.type;
            }
            symbol.value = itSymbol.value;
            newSt.SearchTypes(this.instructionsList, output, errors);
            for(let instruction of this.instructionsList){
                const executeResult = instruction.execute(newSt, output, errors);
                if(executeResult instanceof Error){
                    errors.push(executeResult);
                }else if(executeResult instanceof Break){
                    return null;
                }else if(executeResult instanceof Continue){
                    break;
                }else if(executeResult instanceof Return){
                    return executeResult;
                }
            }
        }
        return null;  
    }

    //CheckTypes
    CheckTypes(variable, iterable){
        switch(iterable.type){
            case literal.dataTypes.ARRAY_STRING:
                switch(variable.type){
                    case literal.dataTypes.STRING:
                    case literal.dataTypes.ANY:
                        break;
                    default:
                        return new Error(literal.errorType.SEMANTIC, `No se puede asignar a un tipo '${variable.type}' un tipo '${literal.dataTypes.STRING}'`, this.row, this.column);
                }
                break;
            case literal.dataTypes.ARRAY_NUMBER:
                switch(variable.type){
                    case literal.dataTypes.NUMBER:
                    case literal.dataTypes.ANY:
                        break;
                    default:
                        return new Error(literal.errorType.SEMANTIC, `No se puede asignar a un tipo '${variable.type}' un tipo '${literal.dataTypes.NUMBER}'`, this.row, this.column);
                }
                break;
            case literal.dataTypes.ARRAY_BOOLEAN:
                switch(variable.type){
                    case literal.dataTypes.BOOLEAN:
                    case literal.dataTypes.ANY:
                        break;
                    default:
                        return new Error(literal.errorType.SEMANTIC, `No se puede asignar a un tipo '${variable.type}' un tipo '${literal.dataTypes.BOOLEAN}'`, this.row, this.column);
                }
                break;
            case literal.dataTypes.ARRAY_ANY:
                switch(variable.type){
                    case literal.dataTypes.ANY:
                        break;
                    default:
                        return new Error(literal.errorType.SEMANTIC, `No se puede asignar a un tipo '${variable.type}' una iteración ANY`, this.row, this.column);
                }
                break;
            default:
                if(variable.type == iterable.type){
                    break;
                }else if(variable.type == literal.dataTypes.ANY){
                    break;
                }else{
                    return new Error(literal.errorType.SEMANTIC, `No se puede asignar a un tipo '${variable.type}' un tipo '${iterable.type}'`, this.row, this.column);
                }
        }
        return true;
    }

}