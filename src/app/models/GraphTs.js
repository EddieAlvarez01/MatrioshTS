import { literal } from '../utilities/util';

export class GraphTs{

    constructor(row, column){
        this.row = row;
        this.column = column;
    }

    traduction(st, scope){}

    execute(st, output, errors){
        literal.graphTable(this.UnitFields(st, []), 0, '#divStExecute', 0, st.scope);
        return null;
    }

    //uniting fields
    UnitFields(st, outSymbols){
        outSymbols = outSymbols.concat(st.symbols);
        if(st.next != null){
            outSymbols = this.UnitFields(st.next, outSymbols);
        }
        return outSymbols;
    }
}