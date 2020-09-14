import Error from './Error';
import { literal } from '../utilities/util';

export class Print{

    constructor(expression, row, column){
        this.expression = expression;
        this.row = row;
        this.column = column;
    }
    
    traduction(st, scope){}

    execute(st, output, errors){
        if(this.expression != null){
            const value = this.expression.execute(st, output, errors);
            if(value instanceof Error) return value;
            if(Array.isArray(value.value)){
                output.push(this.ParseArray(value.value));
            }else if(value.type == literal.dataTypes.OBJECT || st.CheckType(value)){
                output.push(this.ParseType(value.value));
            }else{
                output.push(value.value);
            }
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
            }else if(symbol.type == literal.dataTypes.OBJECT){
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
            }else if(symbol.type == literal.dataTypes.OBJECT){
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
            }else if(obj[key].type == literal.dataTypes.OBJECT){
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
            }else if(obj[key].type == literal.dataTypes.OBJECT){
                chain += `, ${key}: ${this.ParseType(obj[key].value)}`;
            }else{
                chain += `, ${key}: ${obj[key].value}`;
            }
        });
        return chain += '}';
    }

}