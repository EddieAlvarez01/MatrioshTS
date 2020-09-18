import Error from './Error';
import { SymbolTable } from './SymbolTable';
import { Continue } from './Continue';
import { Break } from './Break';

export class DoWhile{

    constructor(instructionsList, expression, row, column){
        this.instructionsList = instructionsList;
        this.expression = expression;
        this.row = row;
        this.column = column;
    }

    traduction(st, scope){
        this.instructionsList.forEach((instruction) => {
            instruction.traduction(st, 'Do-While');
        });
    }

    execute(st, output, errors){
        let condition;
        do{
            const newSt = new SymbolTable('Do-While');
            newSt.next = st;
            newSt.SearchTypes(this.instructionsList, output, errors);
            for(let instruction of this.instructionsList){
                const executeResult = instruction.execute(newSt, output, errors);
                if(executeResult instanceof Error){
                    errors.push(executeResult);
                }else if(executeResult instanceof Break){
                    return null;
                }else if(executeResult instanceof Continue){
                    break;
                }
            }
            condition = this.expression.execute(st, output, errors);
            if(condition instanceof Error) return condition; 
        }while(condition.value);
        return null;
    }

}