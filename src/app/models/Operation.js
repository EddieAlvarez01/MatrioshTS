import { literal } from '../utilities/util';
import Error from './Error';
import { ArrayAccess } from './ArrayAccess';

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

    execute(st, output, errors){
        let leftOperator;
        let rightOperator;
        switch(this.type){
            case literal.operation.OR:
                leftOperator = this.firstOperator.execute(st, output, errors);
                rightOperator = this.secondOperator.execute(st, output, errors);
                if (leftOperator instanceof Error) return leftOperator;
                if (rightOperator instanceof Error) return rightOperator;
                return Operation.NewOperationValue(literal.dataTypes.BOOLEAN, leftOperator.value || rightOperator.value, this.row, this.column);
            case literal.operation.AND:
                leftOperator = this.firstOperator.execute(st, output, errors);
                rightOperator = this.secondOperator.execute(st, output, errors);
                if (leftOperator instanceof Error) return leftOperator;
                if (rightOperator instanceof Error) return rightOperator;
                return Operation.NewOperationValue(literal.dataTypes.BOOLEAN, leftOperator.value && rightOperator.value, this.row, this.column);
            case literal.operation.NOT:
                rightOperator = this.secondOperator.execute(st, output, errors);
                if (rightOperator instanceof Error) return leftOperator;
                return Operation.NewOperationValue(literal.dataTypes.BOOLEAN, !rightOperator.value, this.row, this.column);
            case literal.operation.LESS_THAN:
                leftOperator = this.firstOperator.execute(st, output, errors);
                rightOperator = this.secondOperator.execute(st, output, errors);
                if (leftOperator instanceof Error) return leftOperator;
                if (rightOperator instanceof Error) return rightOperator;
                switch(leftOperator.type){
                    case literal.dataTypes.STRING:
                        switch(rightOperator.type){
                            case literal.dataTypes.STRING:
                                return Operation.NewOperationValue(literal.dataTypes.BOOLEAN, leftOperator.value < rightOperator.value, this.row, this.column);
                            case literal.dataTypes.NULL:
                                return Operation.NewOperationValue(literal.dataTypes.BOOLEAN, leftOperator.value < rightOperator.value, this.row, this.column);
                            default:
                                return new Error(literal.errorType.SEMANTIC, `No se puede usar el operador '<' con un tipo '${leftOperator.type}' y '${rightOperator.type}'`, this.row, this.column);
                        }
                    case literal.dataTypes.NUMBER:
                        switch(rightOperator.type){
                            case literal.dataTypes.NUMBER:
                                return Operation.NewOperationValue(literal.dataTypes.BOOLEAN, leftOperator.value < rightOperator.value, this.row, this.column);
                            case literal.dataTypes.NULL:
                                return Operation.NewOperationValue(literal.dataTypes.BOOLEAN, leftOperator.value < rightOperator.value, this.row, this.column);
                            default:
                                return new Error(literal.errorType.SEMANTIC, `No se puede usar el operador '<' con un tipo '${leftOperator.type}' y '${rightOperator.type}'`, this.row, this.column);
                        }
                    case literal.dataTypes.BOOLEAN:
                        switch(rightOperator.type){
                            case literal.dataTypes.BOOLEAN:
                                return Operation.NewOperationValue(literal.dataTypes.BOOLEAN, leftOperator.value < rightOperator.value, this.row, this.column);
                            case literal.dataTypes.NULL:
                                return Operation.NewOperationValue(literal.dataTypes.BOOLEAN, leftOperator.value < rightOperator.value, this.row, this.column);
                            default:
                                return new Error(literal.errorType.SEMANTIC, `No se puede usar el operador '<' con un tipo '${leftOperator.type}' y '${rightOperator.type}'`, this.row, this.column);
                        }
                    case literal.dataTypes.NULL:
                        return Operation.NewOperationValue(literal.dataTypes.BOOLEAN, leftOperator.value < rightOperator.value, this.row, this.column);
                    case literal.dataTypes.OBJECT:
                        switch(rightOperator.type){
                            case literal.dataTypes.OBJECT:
                                return Operation.NewOperationValue(literal.dataTypes.BOOLEAN, leftOperator.value < rightOperator.value, this.row, this.column);
                            case literal.dataTypes.NULL:
                                return Operation.NewOperationValue(literal.dataTypes.BOOLEAN, leftOperator.value < rightOperator.value, this.row, this.column);
                            default:
                                return new Error(literal.errorType.SEMANTIC, `No se puede usar el operador '<' con un tipo '${leftOperator.type}' y '${rightOperator.type}'`, this.row, this.column);
                        }
                    default:
                        return Operation.NewOperationValue(literal.dataTypes.BOOLEAN, leftOperator.value < rightOperator.value, this.row, this.column);
                }
            case literal.operation.GREATER_THAN:
                leftOperator = this.firstOperator.execute(st, output, errors);
                rightOperator = this.secondOperator.execute(st, output, errors);
                if (leftOperator instanceof Error) return leftOperator;
                if (rightOperator instanceof Error) return rightOperator;
                switch(leftOperator.type){
                    case literal.dataTypes.STRING:
                        switch(rightOperator.type){
                            case literal.dataTypes.STRING:
                                return Operation.NewOperationValue(literal.dataTypes.BOOLEAN, leftOperator.value > rightOperator.value, this.row, this.column);
                            case literal.dataTypes.NULL:
                                return Operation.NewOperationValue(literal.dataTypes.BOOLEAN, leftOperator.value > rightOperator.value, this.row, this.column);
                            default:
                                return new Error(literal.errorType.SEMANTIC, `No se puede usar el operador '>' con un tipo '${leftOperator.type}' y '${rightOperator.type}'`, this.row, this.column);
                        }
                    case literal.dataTypes.NUMBER:
                        switch(rightOperator.type){
                            case literal.dataTypes.NUMBER:
                                return Operation.NewOperationValue(literal.dataTypes.BOOLEAN, leftOperator.value > rightOperator.value, this.row, this.column);
                            case literal.dataTypes.NULL:
                                return Operation.NewOperationValue(literal.dataTypes.BOOLEAN, leftOperator.value > rightOperator.value, this.row, this.column);
                            default:
                                return new Error(literal.errorType.SEMANTIC, `No se puede usar el operador '>' con un tipo '${leftOperator.type}' y '${rightOperator.type}'`, this.row, this.column);
                        }
                    case literal.dataTypes.BOOLEAN:
                        switch(rightOperator.type){
                            case literal.dataTypes.BOOLEAN:
                                return Operation.NewOperationValue(literal.dataTypes.BOOLEAN, leftOperator.value > rightOperator.value, this.row, this.column);
                            case literal.dataTypes.NULL:
                                return Operation.NewOperationValue(literal.dataTypes.BOOLEAN, leftOperator.value > rightOperator.value, this.row, this.column);
                            default:
                                return new Error(literal.errorType.SEMANTIC, `No se puede usar el operador '>' con un tipo '${leftOperator.type}' y '${rightOperator.type}'`, this.row, this.column);
                        }
                    case literal.dataTypes.NULL:
                        return Operation.NewOperationValue(literal.dataTypes.BOOLEAN, leftOperator.value > rightOperator.value, this.row, this.column);
                    case literal.dataTypes.OBJECT:
                        switch(rightOperator.type){
                            case literal.dataTypes.OBJECT:
                                return Operation.NewOperationValue(literal.dataTypes.BOOLEAN, leftOperator.value > rightOperator.value, this.row, this.column);
                            case literal.dataTypes.NULL:
                                return Operation.NewOperationValue(literal.dataTypes.BOOLEAN, leftOperator.value > rightOperator.value, this.row, this.column);
                            default:
                                return new Error(literal.errorType.SEMANTIC, `No se puede usar el operador '>' con un tipo '${leftOperator.type}' y '${rightOperator.type}'`, this.row, this.column);
                        }
                    default:
                        return Operation.NewOperationValue(literal.dataTypes.BOOLEAN, leftOperator.value > rightOperator.value, this.row, this.column);
                }
            case literal.operation.LESS_THAN_OR_EQUAL_TO:
                leftOperator = this.firstOperator.execute(st, output, errors);
                rightOperator = this.secondOperator.execute(st, output, errors);
                if (leftOperator instanceof Error) return leftOperator;
                if (rightOperator instanceof Error) return rightOperator;
                switch(leftOperator.type){
                    case literal.dataTypes.STRING:
                        switch(rightOperator.type){
                            case literal.dataTypes.STRING:
                                return Operation.NewOperationValue(literal.dataTypes.BOOLEAN, leftOperator.value <= rightOperator.value, this.row, this.column);
                            case literal.dataTypes.NULL:
                                return Operation.NewOperationValue(literal.dataTypes.BOOLEAN, leftOperator.value <= rightOperator.value, this.row, this.column);
                            default:
                                return new Error(literal.errorType.SEMANTIC, `No se puede usar el operador '<=' con un tipo '${leftOperator.type}' y '${rightOperator.type}'`, this.row, this.column);
                        }
                    case literal.dataTypes.NUMBER:
                        switch(rightOperator.type){
                            case literal.dataTypes.NUMBER:
                                return Operation.NewOperationValue(literal.dataTypes.BOOLEAN, leftOperator.value <= rightOperator.value, this.row, this.column);
                            case literal.dataTypes.NULL:
                                return Operation.NewOperationValue(literal.dataTypes.BOOLEAN, leftOperator.value <= rightOperator.value, this.row, this.column);
                            default:
                                return new Error(literal.errorType.SEMANTIC, `No se puede usar el operador '<=' con un tipo '${leftOperator.type}' y '${rightOperator.type}'`, this.row, this.column);
                        }
                    case literal.dataTypes.BOOLEAN:
                        switch(rightOperator.type){
                            case literal.dataTypes.BOOLEAN:
                                return Operation.NewOperationValue(literal.dataTypes.BOOLEAN, leftOperator.value <= rightOperator.value, this.row, this.column);
                            case literal.dataTypes.NULL:
                                return Operation.NewOperationValue(literal.dataTypes.BOOLEAN, leftOperator.value <= rightOperator.value, this.row, this.column);
                            default:
                                return new Error(literal.errorType.SEMANTIC, `No se puede usar el operador '<=' con un tipo '${leftOperator.type}' y '${rightOperator.type}'`, this.row, this.column);
                        }
                    case literal.dataTypes.NULL:
                        return Operation.NewOperationValue(literal.dataTypes.BOOLEAN, leftOperator.value <= rightOperator.value, this.row, this.column);
                    case literal.dataTypes.OBJECT:
                        switch(rightOperator.type){
                            case literal.dataTypes.OBJECT:
                                return Operation.NewOperationValue(literal.dataTypes.BOOLEAN, leftOperator.value <= rightOperator.value, this.row, this.column);
                            case literal.dataTypes.NULL:
                                return Operation.NewOperationValue(literal.dataTypes.BOOLEAN, leftOperator.value <= rightOperator.value, this.row, this.column);
                            default:
                                return new Error(literal.errorType.SEMANTIC, `No se puede usar el operador '<=' con un tipo '${leftOperator.type}' y '${rightOperator.type}'`, this.row, this.column);
                        }
                    default:
                        return Operation.NewOperationValue(literal.dataTypes.BOOLEAN, leftOperator.value <= rightOperator.value, this.row, this.column);
                }
            case literal.operation.GREATER_THAN_OR_EQUAL_TO:
                leftOperator = this.firstOperator.execute(st, output, errors);
                rightOperator = this.secondOperator.execute(st, output, errors);
                if (leftOperator instanceof Error) return leftOperator;
                if (rightOperator instanceof Error) return rightOperator;
                switch(leftOperator.type){
                    case literal.dataTypes.STRING:
                        switch(rightOperator.type){
                            case literal.dataTypes.STRING:
                                return Operation.NewOperationValue(literal.dataTypes.BOOLEAN, leftOperator.value >= rightOperator.value, this.row, this.column);
                            case literal.dataTypes.NULL:
                                return Operation.NewOperationValue(literal.dataTypes.BOOLEAN, leftOperator.value >= rightOperator.value, this.row, this.column);
                            default:
                                return new Error(literal.errorType.SEMANTIC, `No se puede usar el operador '>=' con un tipo '${leftOperator.type}' y '${rightOperator.type}'`, this.row, this.column);
                        }
                    case literal.dataTypes.NUMBER:
                        switch(rightOperator.type){
                            case literal.dataTypes.NUMBER:
                                return Operation.NewOperationValue(literal.dataTypes.BOOLEAN, leftOperator.value >= rightOperator.value, this.row, this.column);
                            case literal.dataTypes.NULL:
                                return Operation.NewOperationValue(literal.dataTypes.BOOLEAN, leftOperator.value >= rightOperator.value, this.row, this.column);
                            default:
                                return new Error(literal.errorType.SEMANTIC, `No se puede usar el operador '>=' con un tipo '${leftOperator.type}' y '${rightOperator.type}'`, this.row, this.column);
                        }
                    case literal.dataTypes.BOOLEAN:
                        switch(rightOperator.type){
                            case literal.dataTypes.BOOLEAN:
                                return Operation.NewOperationValue(literal.dataTypes.BOOLEAN, leftOperator.value >= rightOperator.value, this.row, this.column);
                            case literal.dataTypes.NULL:
                                return Operation.NewOperationValue(literal.dataTypes.BOOLEAN, leftOperator.value >= rightOperator.value, this.row, this.column);
                            default:
                                return new Error(literal.errorType.SEMANTIC, `No se puede usar el operador '>=' con un tipo '${leftOperator.type}' y '${rightOperator.type}'`, this.row, this.column);
                        }
                    case literal.dataTypes.NULL:
                        return Operation.NewOperationValue(literal.dataTypes.BOOLEAN, leftOperator.value >= rightOperator.value, this.row, this.column);
                    case literal.dataTypes.OBJECT:
                        switch(rightOperator.type){
                            case literal.dataTypes.OBJECT:
                                return Operation.NewOperationValue(literal.dataTypes.BOOLEAN, leftOperator.value >= rightOperator.value, this.row, this.column);
                            case literal.dataTypes.NULL:
                                return Operation.NewOperationValue(literal.dataTypes.BOOLEAN, leftOperator.value >= rightOperator.value, this.row, this.column);
                            default:
                                return new Error(literal.errorType.SEMANTIC, `No se puede usar el operador '>=' con un tipo '${leftOperator.type}' y '${rightOperator.type}'`, this.row, this.column);
                        }
                    default:
                        return Operation.NewOperationValue(literal.dataTypes.BOOLEAN, leftOperator.value >= rightOperator.value, this.row, this.column);
                }
            case literal.operation.JUST_AS:
                leftOperator = this.firstOperator.execute(st, output, errors);
                rightOperator = this.secondOperator.execute(st, output, errors);
                if (leftOperator instanceof Error) return leftOperator;
                if (rightOperator instanceof Error) return rightOperator;
                return Operation.NewOperationValue(literal.dataTypes.BOOLEAN, leftOperator.value == rightOperator.value, this.row, this.column);
            case literal.operation.OTHER_THAN:
                leftOperator = this.firstOperator.execute(st, output, errors);
                rightOperator = this.secondOperator.execute(st, output, errors);
                if (leftOperator instanceof Error) return leftOperator;
                if (rightOperator instanceof Error) return rightOperator;
                return Operation.NewOperationValue(literal.dataTypes.BOOLEAN, leftOperator.value != rightOperator.value, this.row, this.column);
            case literal.operation.ADDITION:
                leftOperator = this.firstOperator.execute(st, output, errors);
                rightOperator = this.secondOperator.execute(st, output, errors);
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
                leftOperator = this.firstOperator.execute(st, output, errors);
                rightOperator = this.secondOperator.execute(st, output, errors);
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
                leftOperator = this.firstOperator.execute(st, output, errors);
                rightOperator = this.secondOperator.execute(st, output, errors);
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
                leftOperator = this.firstOperator.execute(st, output, errors);
                rightOperator = this.secondOperator.execute(st, output, errors);
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
                leftOperator = this.firstOperator.execute(st, output, errors);
                rightOperator = this.secondOperator.execute(st, output, errors);
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
            case literal.operation.MODULUS:
                leftOperator = this.firstOperator.execute(st, output, errors);
                rightOperator = this.secondOperator.execute(st, output, errors);
                if (leftOperator instanceof Error) return leftOperator;
                if (rightOperator instanceof Error) return rightOperator;
                switch(leftOperator.type){
                    case literal.dataTypes.NUMBER:
                        switch(rightOperator.type){
                            case literal.dataTypes.NUMBER:
                                if(rightOperator.value){
                                    return Operation.NewOperationValue(literal.dataTypes.NUMBER, leftOperator.value % rightOperator.value, this.row, this.column);
                                }
                                return new Error(literal.errorType.SEMANTIC, `No se puede sacar el resto de un 0`, this.row, this.column);
                            case literal.dataTypes.BOOLEAN:
                                if(rightOperator.value){
                                    return Operation.NewOperationValue(literal.dataTypes.NUMBER, leftOperator.value % rightOperator.value, this.row, this.column);
                                }
                                return new Error(literal.errorType.SEMANTIC, `No se puede sacar el resto de un 0`, this.row, this.column);
                            case literal.dataTypes.NULL:
                                return new Error(literal.errorType.SEMANTIC, `No se puede sacar el resto de un 0`, this.row, this.column);
                            default:
                                return new Error(literal.errorType.SEMANTIC, `No se puede hacer resto un tipo '${leftOperator.type}' con un tipo '${rightOperator.type}'`, this.row, this.column);
                        }
                    case literal.dataTypes.BOOLEAN:
                        switch(rightOperator.type){
                            case literal.dataTypes.NUMBER:
                                if(rightOperator.value){
                                    return Operation.NewOperationValue(literal.dataTypes.NUMBER, leftOperator.value % rightOperator.value, this.row, this.column);
                                }
                                return new Error(literal.errorType.SEMANTIC, `No se puede sacar el resto de un 0`, this.row, this.column);
                            case literal.dataTypes.BOOLEAN:
                                if(rightOperator.value){
                                    return Operation.NewOperationValue(literal.dataTypes.NUMBER, leftOperator.value % rightOperator.value, this.row, this.column);
                                }
                                return new Error(literal.errorType.SEMANTIC, `No se puede sacar el resto de un 0`, this.row, this.column);
                            case literal.dataTypes.NULL:
                                return new Error(literal.errorType.SEMANTIC, `No se puede sacar el resto de un 0`, this.row, this.column);
                            default:
                                new Error(literal.errorType.SEMANTIC, `No se puede hacer resto un tipo '${leftOperator.type}' con un tipo '${rightOperator.type}'`, this.row, this.column);
                
                        }
                    case literal.dataTypes.NULL:
                        switch(rightOperator.type){
                            case literal.dataTypes.NUMBER:
                                if(rightOperator.value){
                                    return Operation.NewOperationValue(literal.dataTypes.NUMBER, leftOperator.value % rightOperator.value, this.row, this.column);
                                }
                                return new Error(literal.errorType.SEMANTIC, `No se puede sacar el resto de un 0`, this.row, this.column);
                            case literal.dataTypes.BOOLEAN:
                                if(rightOperator.value){
                                    return Operation.NewOperationValue(literal.dataTypes.NUMBER, leftOperator.value % rightOperator.value, this.row, this.column);
                                }
                                return new Error(literal.errorType.SEMANTIC, `No se puede sacar el resto de un 0`, this.row, this.column);
                            case literal.dataTypes.NULL:
                                return new Error(literal.errorType.SEMANTIC, `No se puede sacar el resto de un 0`, this.row, this.column);
                            default:
                                new Error(literal.errorType.SEMANTIC, `No se puede hacer resto un tipo '${leftOperator.type}' con un tipo '${rightOperator.type}'`, this.row, this.column);
                        }
                    default:
                        new Error(literal.errorType.SEMANTIC, `No se puede hacer resto un tipo '${leftOperator.type}' con un tipo '${rightOperator.type}'`, this.row, this.column);
                }
            case literal.operation.UNARY_MINUS:
                rightOperator = this.secondOperator.execute(st, output, errors);
                if (rightOperator instanceof Error) return rightOperator;
                switch(rightOperator.type){
                    case literal.dataTypes.NUMBER:
                        return Operation.NewOperationValue(literal.dataTypes.NUMBER, rightOperator.value * -1, this.row, this.column);
                    case literal.dataTypes.BOOLEAN:
                        return Operation.NewOperationValue(literal.dataTypes.NUMBER, rightOperator.value * -1, this.row, this.column);
                    case literal.dataTypes.NULL:
                        return Operation.NewOperationValue(literal.dataTypes.NUMBER, rightOperator.value * -1, this.row, this.column);
                    default:
                        return new Error(literal.errorType.SEMANTIC, `No se puede negar un tipo '${rightOperator.type}'`, this.row, this.column);
                }
            case literal.operation.PROPERTY_ACCESS:
                leftOperator = this.firstOperator.execute(st, output, errors);
                if(leftOperator instanceof Error) return leftOperator;
                if(!st.CheckType(leftOperator) && leftOperator.type != literal.dataTypes.OBJECT) return new Error(literal.errorType.SEMANTIC, `No se puede acceder a un tipo '${leftOperator.type}'`, this.row, this.column);
                if(leftOperator.value == null) return new Error(literal.errorType.SEMANTIC, `No se puede acceder a un objeto con valor nulo`, this.row, this.column);
                if(this.secondOperator.type != literal.dataTypes.VARIABLE && !(this.secondOperator instanceof ArrayAccess)) return new Error(literal.errorType.SEMANTIC, `No se puede acceder a una propiedad con un tipo '${this.secondOperator.type}'`, this.row, this.column);
                let value;
                if(this.secondOperator.type == literal.dataTypes.VARIABLE){
                    value = leftOperator.value[this.secondOperator.value];
                }else{
                    value = leftOperator.value[this.secondOperator.id];
                    if(value){
                        const exp = this.secondOperator.value.execute(st, output, errors);
                        if(exp instanceof Error) return exp;
                        if(value.array){
                            if(value.value == null) return new Error(literal.errorType.SEMANTIC, `No se puede acceder a un valor nulo`, this.row, this.column);
                            if(!(exp.type == literal.dataTypes.STRING || exp.type == literal.dataTypes.NUMBER)) return new Error(literal.errorType.SEMANTIC, `No se puede acceder a un array con un tipo '${exp.type}'`, this.row, this.column);
                            const value2 = value.value[exp.value];
                            if(value2 === undefined) return new Error(literal.errorType.SEMANTIC, `El indice '${exp.value}' de el array no es correcto`, this.row, this.column);
                            return value2;
                        }else if(st.CheckType(value)){
                            if(exp.type == literal.dataTypes.STRING){
                                if(value.value == null) return new Error(literal.errorType.SEMANTIC, `No se puede acceder a un valor nulo`, this.row, this.column);
                                const value2 = value.value[exp.value];
                                if(value2 === undefined) return new Error(literal.errorType.SEMANTIC, `El indice '${exp.value}' de el array no es correcto`, this.row, this.column);
                                return value2;
                            }
                            return new Error(literal.errorType.SEMANTIC, `No se puede acceder a un array con un tipo '${exp.type}'`, this.row, this.column);
                        }
                        return new Error(literal.errorType.SEMANTIC, `No se puede acceder de esta forma a una variable que no es un array o un objeto`, this.row, this.column);
                    }
                }
                if(value === undefined) return new Error(literal.errorType.SEMANTIC, `La propiedad '${this.secondOperator.value}' no existe en el objeto`, this.row, this.column);
                return value; 
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