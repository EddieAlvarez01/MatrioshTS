export class Switch{
    
    constructor(expression, casesList, row, column){
        this.expression = expression;
        this.casesList = casesList;
        this.row = row;
        this.column = column;
    }

    traduction(st, scope){
        this.casesList.forEach((cs) => {
            cs.traduction(st, 'Switch');
        });
    }

}