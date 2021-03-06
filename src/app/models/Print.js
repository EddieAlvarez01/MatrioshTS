import Error from './Error';
import { literal } from '../utilities/util';

export class Print{

    constructor(listExpressions, row, column){
        this.listExpressions = listExpressions;
        this.row = row;
        this.column = column;
    }
    
    traduction(st, scope){}

    execute(st, output, errors){
        if(this.listExpressions != null){
            let exit = '';
            for(let expression of this.listExpressions){
                const value = expression.execute(st, output, errors);
                if(value instanceof Error) return value;
                if(Array.isArray(value.value)){
                    exit += ` ${this.ParseArray(value.value.slice())}`;
                }else if((value.type == literal.dataTypes.OBJECT || st.CheckType(value)) && value.value != null){
                    exit += ` ${this.ParseType(value.value)}`;
                }else{
                    exit += ` ${value.value}`;
                }
            }
            output.push(exit);
        }else{
            output.push('');
        }
        return null;
    }

    //returns a string from the array
    ParseArray(array){
        let chain = '';
        if(array.length){
            const symbol = array.shift();
            if(Array.isArray(symbol.value)){
                chain = `[${this.ParseArray(symbol.value.slice())}`;
            }else if(symbol.type == literal.dataTypes.OBJECT || (typeof symbol.value == 'object' && symbol.value != null)){
                chain = `[${this.ParseType(symbol.value)}`;
            }else{
                chain = `[${symbol.value}`;
            }
        }else{
            chain = '[';
        }
        array.forEach((symbol) => {
            if(Array.isArray(symbol.value)){
                chain += `, ${this.ParseArray(symbol.value.slice())}`;
            }else if(symbol.type == literal.dataTypes.OBJECT || (typeof symbol.value == 'object' && symbol.value != null)){
                chain += `, ${this.ParseType(symbol.value)}`;
            }else{
                chain += `, ${symbol.value}`;
            }
        });
        return chain += ']';
    }

    //returns a string from the object
    ParseType(obj){
        const keys = [];
        for(let key in obj){
            keys.push(key);
        }
        let chain = '';
        if(keys.length){
            const key = keys.shift();
            if(Array.isArray(obj[key].value)){
                chain = `{${key}: ${this.ParseArray(obj[key].value.slice())}`;
            }else if(obj[key].type == literal.dataTypes.OBJECT || (typeof obj[key].value == 'object' && obj[key].value != null)){
                chain = `{${key}: ${this.ParseType(obj[key].value)}`;
            }else{
                chain = `{${key}: ${obj[key].value}`;
            }
        }else{
            chain = '{';
        }
        keys.forEach((key) => {
            if(Array.isArray(obj[key].value)){
                chain += `, ${key}: ${this.ParseArray(obj[key].value.slice())}`;
            }else if(obj[key].type == literal.dataTypes.OBJECT || (typeof obj[key].value == 'object' && obj[key].value != null)){
                chain += `, ${key}: ${this.ParseType(obj[key].value)}`;
            }else{
                chain += `, ${key}: ${obj[key].value}`;
            }
        });
        return chain += '}';
    }

}