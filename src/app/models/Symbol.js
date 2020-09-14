import Error from './Error';
import { literal } from "../utilities/util";

export class Symbol{

    constructor(id, type, constant, dynamic, array, value, scope, row, column, isType, isFunction){
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
        this.isFunction = isFunction;
        this.propertys = new Map();
    }

    static NewSymbolTranslate(id, type, scope, row, colum){
        return new Symbol(id, type, null, null, null, null, scope, row, colum);
    }

    //SET TYPE PROPERTY
    SetProperty(node) {
        if(!this.SearchProperty(node.id)) return new Error(literal.errorType.SEMANTIC, `EL id '${node.id}' esta duplicado en el type`, node.row, node.column);
        this.propertys.set(node.id, node);
        return null;
    }

    //SEARCH DUPLICATES
    SearchProperty(id){
        return this.propertys.get(id) === undefined;
    } 

}