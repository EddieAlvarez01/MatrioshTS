import parserTraduction from './analysis/parser';

export function traduction(txt) {
    try {
        const result = parserTraduction.parse(txt);
        console.log(result);
    } catch (error) {
        console.log(error);
    }
}