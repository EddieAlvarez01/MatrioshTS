import { Declaration } from './Declaration';
import { Operation } from './Operation';
import { Break } from './Break';
import { Continue } from './Continue';
import { literal } from '../utilities/util';
import { SymbolTable } from './SymbolTable';
import { Symbol } from './Symbol';
import { Return } from './Return';
import Error from './Error';


export class ForIn{

    constructor(variable, iterator, listInstructions, row, column){
        this.variable = variable;
        this.iterator = iterator;
        this.listInstructions = listInstructions;
        this.row = row;
        this.column = column;
    }

    traduction(st, scope){
        if(this.variable instanceof Declaration){
            this.variable.traduction(st, 'ForIn');
        }
        this.listInstructions.forEach((instruction) => {
            instruction.traduction(st, 'ForIn');
        });
    }

    execute(st, output, errors){
        let symbol;
        const newSt = new SymbolTable('ForIn');
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
        if(symbol.type != literal.dataTypes.ANY && symbol.type != literal.dataTypes.STRING) return new Error(literal.errorType.SEMANTIC, `El asignable solo puede ser de tipo '${literal.dataTypes.ANY}' o '${literal.dataTypes.STRING}'`, this.row, this.column);
        const iterable = this.iterator.execute(newSt, output, errors);
        if(iterable instanceof Error) return iterable;
        if(!iterable.array && !newSt.CheckType(iterable) && !(iterable.type == literal.dataTypes.OBJECT)) return new Error(literal.errorType.SEMANTIC, `No se puede iterar un tipo '${iterable.type}'`, this.row, this.column);
        if(iterable.value == null) return new Error(literal.errorType.SEMANTIC, `No se puede iterar un null`, this.row, this.column);
        for(let itSymbol in iterable.value){
            newSt.symbols = [symbol];
            if(symbol.type == literal.dataTypes.ANY) symbol.type = literal.dataTypes.STRING;
            symbol.value = itSymbol;
            newSt.SearchTypes(this.listInstructions, output, errors);
            for(let instruction of this.listInstructions){
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

}