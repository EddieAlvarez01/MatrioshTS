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
        const 
    }

}