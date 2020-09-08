export class FunctionCall{

    constructor(id, parametersList, row, column){
        this.id = id;
        this.parametersList = parametersList;
        this.row = row;
        this.column = column;
    }

    traduction(st, scope){}

}