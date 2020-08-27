import parserTraduction from './analysis/parser';

export function traduction(txt) {
    try {
        
    } catch (error) {
        console.log(error);
    }
    const result = parserTraduction.parse(txt);
    const errors = parserTraduction.errors;
    console.log(result);
    return result;
}