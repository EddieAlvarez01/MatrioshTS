/* NIVEL BASICO */

const number1 = 12;
let number2: number = 15;

type saveResult = {
    title: string,
    addition: number,
    substract,
    multiplication: number;
    division
}

/* WITHOUT ERROR */
const saveInformation: saveResult = {
    title: 'Operaciones de los numeros :' + number1 + ' ' + number2,
    addition: number1 + number2,
    substract: number1 - number2,
    multiplication: number1 * number2,
    division: number1 / number2
};


const root: node = {
    next: {
        next: null,
        value: 2
    },
    value: 13
};

type node = {
    next: node,
    value: number
}