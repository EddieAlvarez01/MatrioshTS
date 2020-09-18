import Error from './Error';

export class Break{

    constructor(row, column){
        this.row = row;
        this.column = column;
    }

    traduction(st, scope){}

    execute(st, output, errors){
        const check = st.CheckCicleFunction(1, this.row, this.column);
        if(check instanceof Error) return check;
        return this;
    }

}