export class Symbol{

    constructor(id, type, constant, dynamic, array, value, scope, row, column, isType){
        this.id = id;
        this.type = type;
        this.constant = constant;
        this.dynamic = dynamic;
        this.array = array;
        this.value = value;
        this.scope = scope;
        this.row = row;
        this.column = column;
        this.isType = isType;
    }

    static NewSymbolTranslate(id, type, scope, row, colum){
        return new Symbol(id, type, null, null, null, null, scope, row, colum);
    }

}