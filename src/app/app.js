import parserTraduction from './analysis/parser';

export function traduction(txt) {
    try {
        const result = parserTraduction.parse(txt);
        return result;
    } catch (error) {
        console.log(error);
    }
}