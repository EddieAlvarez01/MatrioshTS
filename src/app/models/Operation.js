export class Operation{

    firstOperator;
    secondOperator;
    type;
    value;

    constructor(firstOperator, secondOperator, type, value){
        this.firstOperator = firstOperator;
        this.secondOperator = secondOperator;
        this.type = type;
        this.value = value;
    }

    static NewOperation(firstOperator, secondOperator, type){
        return new Operation(firstOperator, secondOperator, type, '');
    }

    static NewOperationValue(type, value){
        return new Operation(null, null, type, value);
    }

    traduction(){

    }

    execute(){
        
    }

}