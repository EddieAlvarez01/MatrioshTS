const numero1 = 4;
const numero2: number = 45;

const resultadoSuma = numero1 + numero2;
const resultadoResta = numero1 - numero2;
const resultadoMultiplicacion = numero1 * numero2;
const resultadoDivision: number = numero1 / numero2;

if(resultadoDivision >= resultadoMultiplicacion){
    console.log('Es mayor el resultado de ' + resultadoDivision);
}else{
    console.log('Es mayor el resultado ' + resultadoMultiplicacion);
}

type response = {
    message: string,
    code: number 
}

let res: response = {
    message: 'Successful',
    code: 102
};

console.log(res.message);

