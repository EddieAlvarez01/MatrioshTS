import parserTraduction from './analysis/parser';

export function traduction(txt) {
    try {
        
    } catch (error) {
        console.log(error);
    }
    const result = parserTraduction.parse(txt);
    result.errors = parserTraduction.errors;
    return result;
}