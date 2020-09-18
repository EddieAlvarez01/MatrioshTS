/* NIVEL BASICO */
//
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

const saveInformation2: saveResult = {
    title: 'Operaciones : ' + number1 + ' ' + number2,
    addition: number1 + number2,
    substract: number1 - number2,
    multiplication: number1 * number2,
    division: number1 / number2
};

let difResults: saveResult[] = [saveInformation, saveInformation2];

difResults.push({title: '', addition: 5, substract: 51, multiplication: -9, division: 0});

do{
    console.log(number2);
    number2++;
    continue;
    console.log('Saltar');
}while(number2 < 20);