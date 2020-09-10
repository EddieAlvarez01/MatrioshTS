import { literal } from '../utilities/util';
import Error from './Error';

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

    execute(st, output){
        let leftOperator;
        let rightOperator;
        switch(this.type){
            case literal.operation.ADDITION:
                leftOperator = this.firstOperator.execute(st, output);
                rightOperator = this.secondOperator.execute(st, output);
                if (leftOperator instanceof Error) return leftOperator;
                if (rightOperator instanceof Error) return rightOperator; 
                switch(leftOperator.type){
                    case literal.dataTypes.STRING:
                        switch(rightOperator.type){
                            case literal.dataTypes.STRING:
                                return Operation.NewOperationValue(literal.dataTypes.STRING, leftOperator.value + rightOperator.value, this.row, this.column);
                            case literal.dataTypes.NUMBER:
                                return Operation.NewOperationValue(literal.dataTypes.STRING, leftOperator.value + rightOperator.value, this.row, this.column);
                            case literal.dataTypes.BOOLEAN:
                                return Operation.NewOperationValue(literal.dataTypes.STRING, leftOperator.value + rightOperator.value, this.row, this.column);
                            case literal.dataTypes.NULL:
                                return Operation.NewOperationValue(literal.dataTypes.STRING, leftOperator.value + rightOperator.value, this.row, this.column);
                            default:
                                /* ERROR */
                        }
                    case literal.dataTypes.NUMBER:
                        switch(rightOperator.type){
                            case literal.dataTypes.STRING:
                                return Operation.NewOperationValue(literal.dataTypes.STRING, leftOperator.value + rightOperator.value, this.row, this.column);
                            case literal.dataTypes.NUMBER:
                                return Operation.NewOperationValue(literal.dataTypes.NUMBER, leftOperator.value + rightOperator.value, this.row, this.column);
                            case literal.dataTypes.BOOLEAN:
                                return Operation.NewOperationValue(literal.dataTypes.NUMBER, leftOperator.value + rightOperator.value, this.row, this.column);
                            case literal.dataTypes.NULL:
                                return Operation.NewOperationValue(literal.dataTypes.NUMBER, leftOperator.value + rightOperator.value, this.row, this.column);
                            default:
                                /* ERROR */
                        }
                    case literal.dataTypes.BOOLEAN:
                        switch(rightOperator.type){
                            case literal.dataTypes.STRING:
                                return Operation.NewOperationValue(literal.dataTypes.STRING, leftOperator.value + rightOperator.value, this.row, this.column);
                            case literal.dataTypes.NUMBER:
                                return Operation.NewOperationValue(literal.dataTypes.NUMBER, leftOperator.value + rightOperator.value, this.row, this.column);
                            case literal.dataTypes.BOOLEAN:
                                return Operation.NewOperationValue(literal.dataTypes.BOOLEAN, leftOperator.value + rightOperator.value, this.row, this.column);
                            case literal.dataTypes.NULL:
                                return Operation.NewOperationValue(literal.dataTypes.NUMBER, leftOperator.value + rightOperator.value, this.row, this.column);
                            default:
                                /* ERROR */
                        }
                    case literal.dataTypes.NULL:
                        switch(rightOperator.type){
                            case literal.dataTypes.STRING:
                                return Operation.NewOperationValue(literal.dataTypes.STRING, leftOperator.value + rightOperator.value, this.row, this.column);
                            case literal.dataTypes.NUMBER:
                                return Operation.NewOperationValue(literal.dataTypes.NUMBER, leftOperator.value + rightOperator.value, this.row, this.column);
                            case literal.dataTypes.BOOLEAN:
                                return Operation.NewOperationValue(literal.dataTypes.NUMBER, leftOperator.value + rightOperator.value, this.row, this.column);
                            case literal.dataTypes.NULL:
                                return Operation.NewOperationValue(literal.dataTypes.NUMBER, leftOperator.value + rightOperator.value, this.row, this.column);
                            default:
                                /* ERROR */
                        }
                    default:
                        /* ERROR */
                }
            case literal.operation.SUBTRACTION:
                leftOperator = this.firstOperator.execute(st, output);
                rightOperator = this.secondOperator.execute(st, output);
                if (leftOperator instanceof Error) return leftOperator;
                if (rightOperator instanceof Error) return rightOperator; 
                switch(leftOperator.type){
                    case literal.dataTypes.NUMBER:
                        switch(rightOperator.type){
                            case literal.dataTypes.NUMBER:
                                return Operation.NewOperationValue(literal.dataTypes.NUMBER, leftOperator.value - rightOperator.value, this.row, this.column);
                            case literal.dataTypes.BOOLEAN:
                                return Operation.NewOperationValue(literal.dataTypes.NUMBER, leftOperator.value - rightOperator.value, this.row, this.column);
                            case literal.dataTypes.NULL:
                                return Operation.NewOperationValue(literal.dataTypes.NUMBER, leftOperator.value - rightOperator.value, this.row, this.column);
                            default:
                                return new Error(literal.errorType.SEMANTIC, `No se puede restar un tipo '${leftOperator.type}' con un tipo '${rightOperator.type}'`, this.row, this.column);
                        }
                    case literal.dataTypes.BOOLEAN:
                        switch(rightOperator.type){
                            case literal.dataTypes.NUMBER:
                                return Operation.NewOperationValue(literal.dataTypes.NUMBER, leftOperator.value - rightOperator.value, this.row, this.column);
                            case literal.dataTypes.BOOLEAN:
                                return Operation.NewOperationValue(literal.dataTypes.NUMBER, leftOperator.value - rightOperator.value, this.row, this.column);
                            case literal.dataTypes.NULL:
                                return Operation.NewOperationValue(literal.dataTypes.NUMBER, leftOperator.value - rightOperator.value, this.row, this.column);
                            default:
                                return new Error(literal.errorType.SEMANTIC, `No se puede restar un tipo '${leftOperator.type}' con un tipo '${rightOperator.type}'`, this.row, this.column);
                        }
                    case literal.dataTypes.NULL:
                        switch(rightOperator.type){
                            case literal.dataTypes.NUMBER:
                                return Operation.NewOperationValue(literal.dataTypes.NUMBER, leftOperator.value - rightOperator.value, this.row, this.column);
                            case literal.dataTypes.BOOLEAN:
                                return Operation.NewOperationValue(literal.dataTypes.NUMBER, leftOperator.value - rightOperator.value, this.row, this.column);
                            case literal.dataTypes.NULL:
                                return Operation.NewOperationValue(literal.dataTypes.NUMBER, leftOperator.value - rightOperator.value, this.row, this.column);
                            default:
                                return new Error(literal.errorType.SEMANTIC, `No se puede restar un tipo '${leftOperator.type}' con un tipo '${rightOperator.type}'`, this.row, this.column);
                        }
                    default:
                        return new Error(literal.errorType.SEMANTIC, `No se puede restar un tipo '${leftOperator.type}' con un tipo '${rightOperator.type}'`, this.row, this.column);
                }
            case literal.operation.MULTIPLICATION:
                leftOperator = this.firstOperator.execute(st, output);
                rightOperator = this.secondOperator.execute(st, output);
                if (leftOperator instanceof Error) return leftOperator;
                if (rightOperator instanceof Error) return rightOperator; 
                switch(leftOperator.type){
                    case literal.dataTypes.NUMBER:
                        switch(rightOperator.type){
                            case literal.dataTypes.NUMBER:
                                return Operation.NewOperationValue(literal.dataTypes.NUMBER, leftOperator.value * rightOperator.value, this.row, this.column);
                            case literal.dataTypes.BOOLEAN:
                                return Operation.NewOperationValue(literal.dataTypes.NUMBER, leftOperator.value * rightOperator.value, this.row, this.column);
                            case literal.dataTypes.NULL:
                                return Operation.NewOperationValue(literal.dataTypes.NUMBER, leftOperator.value * rightOperator.value, this.row, this.column);
                            default:
                                return new Error(literal.errorType.SEMANTIC, `No se puede multiplicar un tipo '${leftOperator.type}' con un tipo '${rightOperator.type}'`, this.row, this.column);
                        }
                    case literal.dataTypes.BOOLEAN:
                        switch(rightOperator.type){
                            case literal.dataTypes.NUMBER:
                                return Operation.NewOperationValue(literal.dataTypes.NUMBER, leftOperator.value * rightOperator.value, this.row, this.column);
                            case literal.dataTypes.BOOLEAN:
                                return Operation.NewOperationValue(literal.dataTypes.NUMBER, leftOperator.value * rightOperator.value, this.row, this.column);
                            case literal.dataTypes.NULL:
                                return Operation.NewOperationValue(literal.dataTypes.NUMBER, leftOperator.value * rightOperator.value, this.row, this.column);
                            default:
                                return new Error(literal.errorType.SEMANTIC, `No se puede multiplicar un tipo '${leftOperator.type}' con un tipo '${rightOperator.type}'`, this.row, this.column);
                        }
                    case literal.dataTypes.NULL:
                        switch(rightOperator.type){
                            case literal.dataTypes.NUMBER:
                                return Operation.NewOperationValue(literal.dataTypes.NUMBER, leftOperator.value * rightOperator.value, this.row, this.column);
                            case literal.dataTypes.BOOLEAN:
                                return Operation.NewOperationValue(literal.dataTypes.NUMBER, leftOperator.value * rightOperator.value, this.row, this.column);
                            case literal.dataTypes.NULL:
                                return Operation.NewOperationValue(literal.dataTypes.NUMBER, leftOperator.value * rightOperator.value, this.row, this.column);
                            default:
                                return new Error(literal.errorType.SEMANTIC, `No se puede multiplicar un tipo '${leftOperator.type}' con un tipo '${rightOperator.type}'`, this.row, this.column);
                        }
                    default:
                        return new Error(literal.errorType.SEMANTIC, `No se puede multiplicar un tipo '${leftOperator.type}' con un tipo '${rightOperator.type}'`, this.row, this.column);
                }
            case literal.operation.DIVISION:
                leftOperator = this.firstOperator.execute(st, output);
                rightOperator = this.secondOperator.execute(st, output);
                if (leftOperator instanceof Error) return leftOperator;
                if (rightOperator instanceof Error) return rightOperator; 
                switch(leftOperator.type){
                    case literal.dataTypes.NUMBER:
                        switch(rightOperator.type){
                            case literal.dataTypes.NUMBER:
                                if(rightOperator.value){
                                    return Operation.NewOperationValue(literal.dataTypes.NUMBER, leftOperator.value / rightOperator.value, this.row, this.column);
                                }
                                return new Error(literal.errorType.SEMANTIC, `No se puede dividir dentro de 0`, this.row, this.column);
                            case literal.dataTypes.BOOLEAN:
                                if(rightOperator.value){
                                    return Operation.NewOperationValue(literal.dataTypes.NUMBER, leftOperator.value / rightOperator.value, this.row, this.column);
                                }
                                return new Error(literal.errorType.SEMANTIC, `No se puede dividir dentro de 0`, this.row, this.column);
                            case literal.dataTypes.NULL:
                                return new Error(literal.errorType.SEMANTIC, `No se puede dividir dentro de 0`, this.row, this.column);
                            default:
                                return new Error(literal.errorType.SEMANTIC, `No se puede dividir un tipo '${leftOperator.type}' con un tipo '${rightOperator.type}'`, this.row, this.column);
                        }
                    case literal.dataTypes.BOOLEAN:
                        switch(rightOperator.type){
                            case literal.dataTypes.NUMBER:
                                if(rightOperator.value){
                                    return Operation.NewOperationValue(literal.dataTypes.NUMBER, leftOperator.value / rightOperator.value, this.row, this.column);
                                }
                                return new Error(literal.errorType.SEMANTIC, `No se puede dividir dentro de 0`, this.row, this.column);
                            case literal.dataTypes.BOOLEAN:
                                if(rightOperator.value){
                                    return Operation.NewOperationValue(literal.dataTypes.NUMBER, leftOperator.value / rightOperator.value, this.row, this.column);
                                }
                                return new Error(literal.errorType.SEMANTIC, `No se puede dividir dentro de 0`, this.row, this.column);
                            case literal.dataTypes.NULL:
                                return new Error(literal.errorType.SEMANTIC, `No se puede dividir dentro de 0`, this.row, this.column);
                            default:
                                return new Error(literal.errorType.SEMANTIC, `No se puede dividir un tipo '${leftOperator.type}' con un tipo '${rightOperator.type}'`, this.row, this.column);
                        }
                    case literal.dataTypes.NULL:
                        switch(rightOperator.type){
                            case literal.dataTypes.NUMBER:
                                if(rightOperator.value){
                                    return Operation.NewOperationValue(literal.dataTypes.NUMBER, leftOperator.value / rightOperator.value, this.row, this.column);
                                }
                                return new Error(literal.errorType.SEMANTIC, `No se puede dividir dentro de 0`, this.row, this.column);
                            case literal.dataTypes.BOOLEAN:
                                if(rightOperator.value){
                                    return Operation.NewOperationValue(literal.dataTypes.NUMBER, leftOperator.value / rightOperator.value, this.row, this.column);
                                }
                                return new Error(literal.errorType.SEMANTIC, `No se puede dividir dentro de 0`, this.row, this.column);
                            case literal.dataTypes.NULL:
                                return new Error(literal.errorType.SEMANTIC, `No se puede dividir dentro de 0`, this.row, this.column);
                            default:
                                return new Error(literal.errorType.SEMANTIC, `No se puede dividir un tipo '${leftOperator.type}' con un tipo '${rightOperator.type}'`, this.row, this.column);
                        }
                    default:
                        return new Error(literal.errorType.SEMANTIC, `No se puede dividir un tipo '${leftOperator.type}' con un tipo '${rightOperator.type}'`, this.row, this.column); 
                }
            case literal.operation.POW:
                leftOperator = this.firstOperator.execute(st, output);
                rightOperator = this.secondOperator.execute(st, output);
                if (leftOperator instanceof Error) return leftOperator;
                if (rightOperator instanceof Error) return rightOperator; 
                switch(leftOperator.type){
                    case literal.dataTypes.NUMBER:
                        switch(rightOperator.type){
                            case literal.dataTypes.NUMBER:
                                return Operation.NewOperationValue(literal.dataTypes.NUMBER, leftOperator.value ** rightOperator.value, this.row, this.column);
                            case literal.dataTypes.BOOLEAN:
                                return Operation.NewOperationValue(literal.dataTypes.NUMBER, leftOperator.value ** rightOperator.value, this.row, this.column);
                            case literal.dataTypes.NULL:
                                return Operation.NewOperationValue(literal.dataTypes.NUMBER, leftOperator.value ** rightOperator.value, this.row, this.column);
                            default:
                                return new Error(literal.errorType.SEMANTIC, `No se puede exponer un tipo '${leftOperator.type}' con un tipo '${rightOperator.type}'`, this.row, this.column);
                        }
                    case literal.dataTypes.BOOLEAN:
                        switch(rightOperator.type){
                            case literal.dataTypes.NUMBER:
                                return Operation.NewOperationValue(literal.dataTypes.NUMBER, leftOperator.value ** rightOperator.value, this.row, this.column);
                            case literal.dataTypes.BOOLEAN:
                                return Operation.NewOperationValue(literal.dataTypes.NUMBER, leftOperator.value ** rightOperator.value, this.row, this.column);
                            case literal.dataTypes.NULL:
                                return Operation.NewOperationValue(literal.dataTypes.NUMBER, leftOperator.value ** rightOperator.value, this.row, this.column);
                            default:
                                return new Error(literal.errorType.SEMANTIC, `No se puede exponer un tipo '${leftOperator.type}' con un tipo '${rightOperator.type}'`, this.row, this.column);
                        }
                    case literal.dataTypes.NULL:
                        switch(rightOperator.type){
                            case literal.dataTypes.NUMBER:
                                return Operation.NewOperationValue(literal.dataTypes.NUMBER, leftOperator.value ** rightOperator.value, this.row, this.column);
                            case literal.dataTypes.BOOLEAN:
                                return Operation.NewOperationValue(literal.dataTypes.NUMBER, leftOperator.value ** rightOperator.value, this.row, this.column);
                            case literal.dataTypes.NULL:
                                return Operation.NewOperationValue(literal.dataTypes.NUMBER, leftOperator.value ** rightOperator.value, this.row, this.column);
                            default:
                                return new Error(literal.errorType.SEMANTIC, `No se puede exponer un tipo '${leftOperator.type}' con un tipo '${rightOperator.type}'`, this.row, this.column);
                        }
                    default:
                        return new Error(literal.errorType.SEMANTIC, `No se puede exponer un tipo '${leftOperator.type}' con un tipo '${rightOperator.type}'`, this.row, this.column);
                }
            case literal.dataTypes.STRING:
                return this;
            case literal.dataTypes.NUMBER:
                return this;
            case literal.dataTypes.BOOLEAN:
                return this;
            case literal.dataTypes.NULL:
                return this;
            case literal.dataTypes.VARIABLE:
                return st.GetValue(this);
        }
    }

}