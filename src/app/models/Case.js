import { literal } from '../utilities/util';
import { Operation } from './Operation';
import Error from './Error';

export class Case{

    constructor(expression, instructionsList, row, column){
        this.expression = expression;
        this.instructionsList = instructionsList;
        this.row = row;
        this.column = column;
    }

    traduction(st, scope){
        this.instructionsList.forEach((instruction) => {
            instruction.traduction(st, scope);
        });
    }

    Mapping(st, output, errors, type){
        if(this.expression != null){
            const resultExpression = this.expression.execute(st, output, errors);
            if(resultExpression instanceof Error) return resultExpression;
            const resultVerifyType = this.VerifiyType(resultExpression.type, type, st);
            if(resultVerifyType instanceof Error) return resultVerifyType;
            return {value: resultExpression, instructions: this.instructionsList};
        }
        return {value: null, instructions: this.instructionsList};
    }

    //VERIFY TYPE
    VerifiyType(expType, type, st){
        switch(type){
            case literal.dataTypes.ANY:
                break;
            case literal.dataTypes.OBJECT:
                
                //I create a new symbol but I just need to send you the type to check
                if(expType == literal.dataTypes.OBJECT || st.CheckType(Operation.NewOperationValue(expType, '', '', ''))){
                    break;
                }
                return new Error(literal.errorType.SEMANTIC, `No se puede comparar un tipo '${expType}', con un tipo '${type}'`, this.row, this.column);
            default:
                if(st.CheckType(Operation.NewOperationValue(type, '', '', ''))){
                    if(expType == literal.dataTypes.OBJECT || st.CheckType(Operation.NewOperationValue(expType, '', '', ''))){
                        break;
                    }
                    return new Error(literal.errorType.SEMANTIC, `No se puede comparar un tipo '${expType}', con un tipo '${type}'`, this.row, this.column);
                }else if(type != expType){
                    return new Error(literal.errorType.SEMANTIC, `No se puede comparar un tipo '${expType}', con un tipo '${type}'`, this.row, this.column);
                }
        }
        return true;
    }

}