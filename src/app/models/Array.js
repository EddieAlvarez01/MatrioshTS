import { Symbol } from './Symbol';
import { literal } from '../utilities/util';

export class Array{

    constructor(expresionsList, row, column){
        this.expresionsList = expresionsList;
        this.row = row;
        this.column = column;
    }

    execute(st, output, errors){
        if(this.expresionsList.length){
            const symbol = new Symbol('', null, false, false, true, [], st.scope, this.row, this.column, false);
            for(let exp of this.expresionsList){
                const value = exp.execute(st, output, errors);
                if(value instanceof Error) return value;
                if(!(symbol.type == literal.dataTypes.ARRAY_ANY)){
                    if(symbol.type == null){
                        
                        switch(value.type){
                            case literal.dataTypes.STRING:
                                symbol.type = literal.dataTypes.ARRAY_STRING;
                                break;
                            case literal.dataTypes.NUMBER:
                                symbol.type = literal.dataTypes.ARRAY_NUMBER;
                                break;
                            case literal.dataTypes.BOOLEAN:
                                symbol.type = literal.dataTypes.ARRAY_BOOLEAN;
                                break;
                            case literal.dataTypes.NULL:
                                symbol.type = literal.dataTypes.ARRAY_ANY;
                                break;
                            default:
                                symbol.type = literal.dataTypes.ARRAY_OBJECT;
                        }
            
                    }else{
                        switch(value.type){
                            case literal.dataTypes.STRING:
                                if(!(symbol.type == literal.dataTypes.ARRAY_STRING)){
                                    symbol.type = literal.dataTypes.ARRAY_ANY;
                                }
                                break;
                            case literal.dataTypes.NUMBER:
                                if(!(symbol.type == literal.dataTypes.ARRAY_NUMBER)){
                                    symbol.type = literal.dataTypes.ARRAY_ANY;
                                }
                                break;
                            case literal.dataTypes.BOOLEAN:
                                if(!(symbol.type == literal.dataTypes.ARRAY_BOOLEAN)){
                                    symbol.type = literal.dataTypes.ARRAY_ANY;
                                }
                                break;
                            default:
                                if(!(symbol.type == literal.dataTypes.ARRAY_OBJECT)){
                                    symbol.type = literal.dataTypes.ARRAY_ANY;
                                }
                        }
                    }
                }
                symbol.value.push(value);
            }
            return symbol;
        }
        return new Symbol('', literal.dataTypes.ARRAY_EMPTY, false, false, true, [], st.scope, this.row, this.column, false);   
    }

}