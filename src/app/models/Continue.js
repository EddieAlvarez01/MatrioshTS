import Error from './Error';

export class Continue{

    constructor(row, column){
        this.row = row;
        this.column = column;
    }

    traduction(st, scope){}

    execute(st, output, errors){
        const check = st.CheckCicleFunction(2, this.row, this.column);
        if(check instanceof Error) return check;
        return this;
    }

}