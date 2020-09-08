import { Declaration } from './Declaration';

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

}