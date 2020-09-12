import { Symbol } from './Symbol';

export class TypeDeclaration{

    constructor(id, type, listPropertys, row, column){
        this.id = id;
        this.type = type;
        this.listPropertys = listPropertys;
        this.row = row;
        this.column = column;
    }

    traduction(st, scope){
        st.Set(Symbol.NewSymbolTranslate(this.id, 'Type', scope, this.row, this.column), 0);
    }

}