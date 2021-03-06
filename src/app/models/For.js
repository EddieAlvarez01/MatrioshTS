import { Declaration } from './Declaration';
import { Break } from './Break';
import { Continue } from './Continue';
import { SymbolTable } from './SymbolTable';
import { Return } from './Return';
import Error from './Error';

export class For{

    constructor(declaration, condition, operator, listInstructions, row, column){
        this.declaration = declaration;
        this.condition = condition;
        this.operator = operator;
        this.listInstructions = listInstructions;
        this.row = row;
        this.column = column;
    }

    traduction(st, scope){
        if(this.declaration instanceof Declaration){
            this.declaration.traduction(st, 'For');
        }
        this.listInstructions.forEach((instruction) => {
            instruction.traduction(st, 'For');
        });
    }

    execute(st, output, errors){
        const newSt = new SymbolTable('For');
        newSt.next = st;
        let bckup = [];
        const firstFor = this.declaration.execute(newSt, output, errors);
        if(firstFor instanceof Error) return firstFor;
        if(this.declaration instanceof Declaration){
            bckup.push(newSt.symbols[0]);
        }
        do{
            /*the statement should only be made once or it will cycle through
             so there should be a place to keep this statement
              throughout the cycle */
            newSt.symbols = bckup.slice();

            const condition = this.condition.execute(newSt, output, errors);
            if(condition instanceof Error) return condition;
            if(!condition.value) break;
            newSt.SearchTypes(this.listInstructions, output, errors);
            for(let instruction of this.listInstructions){
                const executeInstruction = instruction.execute(newSt, output, errors);
                if(executeInstruction instanceof Error){
                    errors.push(executeInstruction);
                }else if(executeInstruction instanceof Break){
                    return null;
                }else if(executeInstruction instanceof Continue){
                    break;
                }else if(executeInstruction instanceof Return){
                    return executeInstruction;
                }
            }
            const iteration = this.operator.execute(newSt, output, errors);
            if(iteration instanceof Error) return iteration;
        }while(true);
        return null;
    }

}