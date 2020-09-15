import Error from './Error';

export class Ternary{

    constructor(evaluate, exp1, exp2, row, column){
        this.evaluate = evaluate;
        this.exp1 = exp1;
        this.exp2 = exp2;
        this.row = row;
        this.column = column;
    }

    execute(st, output, errors){
        const condition = this.evaluate.execute(st, output, errors);
        if(condition instanceof Error) return eval;
        const valueTrue = this.exp1.execute(st, output, errors);
        if(valueTrue instanceof Error) return valueTrue;
        const valueFalse = this.exp2.execute(st, output, errors);
        if(valueFalse instanceof Error) return valueFalse;
        return (condition) ? valueTrue : valueFalse;
    }

}