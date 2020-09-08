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

}