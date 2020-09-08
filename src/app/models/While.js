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

}