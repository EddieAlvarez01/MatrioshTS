import { Symbol } from './Symbol';
import { literal } from '../utilities/util';
import Error from './Error';

export class Return{

    constructor(expression, row, column){
        this.expression = expression;
        this.row = row;
        this.column = column;
    }

    traduction(st, scope){}

    execute(st, output, errors){
        let exp = new Symbol('', literal.dataTypes.NULL, false, false, false, null, st.scope, this.row, this.column, false, false);
        if(this.expression != null){
            exp = this.expression.execute(st, output, errors);
            if(exp instanceof Error) return exp;
        }
        const scope = st.CheckFunctionScope(this.row, this.column);
        if(scope instanceof Error) return scope;
        return new Return(exp, this.row, this.column);
    }

}