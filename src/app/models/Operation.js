export class Operation{

    firstOperator;
    secondOperator;
    type;
    value;

    constructor(firstOperator, secondOperator, type, value, row, column){
        this.firstOperator = firstOperator;
        this.secondOperator = secondOperator;
        this.type = type;
        this.value = value;
        this.row = row;
        this.column = column;
    }

    static NewOperation(firstOperator, secondOperator, type, row, column){
        return new Operation(firstOperator, secondOperator, type, '', row, column);
    }

    static NewOperationValue(type, value, row, column){
        return new Operation(null, null, type, value, row, column);
    }

    traduction(){

    }

    execute(){
        
    }

}