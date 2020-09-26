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
        if(condition.value){
            return this.exp1.execute(st, output, errors);
        }else{
            return this.exp2.execute(st, output, errors);
        }
    }

}