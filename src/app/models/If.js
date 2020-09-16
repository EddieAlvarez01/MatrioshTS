import Error from './Error';
import { SymbolTable } from './SymbolTable';

export class If{

    constructor(expression, trueList, falseList, row, column){
        this.expression = expression;
        this.trueList = trueList;
        this.falseList = falseList;
        this.row = row;
        this.column = column;
    }

    traduction(st, scope){
        this.trueList.forEach((instruction) => {
            instruction.traduction(st, 'If-then');
        });
        this.falseList.forEach((instruction) => {
            instruction.traduction(st, 'If-else');
        });
    }

    execute(st, output, errors){
        const condition = this.expression.execute(st, output, errors);
        if(condition instanceof Error) return Error;
        const newSt = new SymbolTable('If');
        newSt.next = st;
        if(condition.value){
            newSt.SearchTypes(this.trueList, output, errors);
            /* SEARCH FUNCTIONS */
            for(let instruction of this.trueList){
                const executeResult = instruction.execute(newSt, output, errors);
                if(executeResult instanceof Error){
                    errors.push(executeResult);
                }
            } 
        }else{
            newSt.SearchTypes(this.falseList, output, errors);
            /* SEARCH FUNCTIONS */
            for(let instruction of this.falseList){
                const executeResult = instruction.execute(newSt, output, errors);
                if(executeResult instanceof Error){
                    errors.push(executeResult);
                }
            } 
        }
        return null;
    }

}