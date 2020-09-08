import { Declaration } from './Declaration';

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

}