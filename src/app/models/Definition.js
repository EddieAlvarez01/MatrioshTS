import { Symbol } from './Symbol';
import Error from './Error';
import { literal } from '../utilities/util';

export class Definition{

    constructor(propertysList, row, column){
        this.propertysList = propertysList;
        this.row = row;
        this.column = column;
    }

    execute(st, output, errors){
        const symbol = new Symbol('', literal.dataTypes.OBJECT, null, null, false, {}, st.scope, this.row, this.column, false, false);
        for(let property of this.propertysList){
            const definition = property.execute(st, output, errors);
            if(definition instanceof Error) return definition;
            if(!this.VerifyDuplicate(definition, symbol.value)) return new Error(literal.errorType.SEMANTIC, `Hay propiedades duplicadas`, this.row, this.column);
            symbol.value[definition.id] = definition;
        }
        return symbol;
    }

    /*verify that there is no equal property on the object */
    VerifyDuplicate(propertyDeclaration, obj){
        for(let key in obj){
            if(propertyDeclaration.id == key) return false;
        }
        return true;
    }

}