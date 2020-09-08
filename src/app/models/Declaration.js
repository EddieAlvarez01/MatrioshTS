import { Symbol } from './Symbol';

export class Declaration{

    constructor(id, type, constant, dynamic, array, value, row, column){
        this.id = id;
        this.type = type;
        this.constant = constant;
        this.dynamic = dynamic;
        this.array = array;
        this.value = value;
        this.row = row;
        this.column = column;
    }

    traduction(st, scope){
        st.Set(Symbol.NewSymbolTranslate(this.id, this.type, scope, this.row, this.column), 0);
    }

    execute(st){

    }

}