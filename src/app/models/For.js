import { Declaration } from './Declaration';

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

}