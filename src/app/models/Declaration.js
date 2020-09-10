import { Symbol } from './Symbol';
import { literal } from '../utilities/util';
import Error from './Error';

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

    execute(st, output){
        if(this.value != undefined){
            const val = this.value.execute(st, output);
            if(val instanceof Error) return val;
            if(val.type == this.type){
                return st.Set( new Symbol(this.id, this.type, this.constant, this.dynamic, this.array, val.value, st.scope, this.row, this.column), 1);
            }else if(this.type == literal.dataTypes.ANY){
                return st.Set(new Symbol(this.id, val.type, this.constant, this.dynamic, this.array, val.value, st.scope, this.row, this.column), 1);
            }
        }
        return st.Set(new Symbol(this.id, this.type, this.constant, this.dynamic, this.array, undefined, st.scope, this.row, this.column), 1);
    }

}