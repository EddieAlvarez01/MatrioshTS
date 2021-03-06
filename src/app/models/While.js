import Error from './Error';
import { SymbolTable } from './SymbolTable';
import { Break } from './Break';
import { Continue } from './Continue';
import { Return } from './Return';

export class While{

    constructor(expression, instructionsList, row, column){
        this.expression = expression;
        this.instructionsList = instructionsList;
        this.row = row;
        this.column = column;
    }

    traduction(st, scope){
        this.instructionsList.forEach((instruction) => {
            instruction.traduction(st, 'While');
        });
    }

    execute(st, output, errors){
        do{
            let condition = this.expression.execute(st, output, errors);
            if(condition instanceof Error) return condition;
            if(!condition.value) break;
            const newSt = new SymbolTable('While');
            newSt.next = st;
            newSt.SearchTypes(this.instructionsList, output, errors);
            /* SEARCH FUNCTIONS */
            for(let instruction of this.instructionsList){
                const resultInstruction = instruction.execute(newSt, output, errors);
                if(resultInstruction instanceof Error){
                    errors.push(resultInstruction);
                }else if(resultInstruction instanceof Break){
                    return null;
                }else if(resultInstruction instanceof Continue){
                    break;
                }else if(resultInstruction instanceof Return){
                    return resultInstruction;
                }
            }
        }while(true);
        return null;
    }

}