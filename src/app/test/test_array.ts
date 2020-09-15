const num = [1, 2, 3];

type testing = {
    numero: number
}

let result: testing = null;

let suppResult: testing[] = [{numero: num[1] * 4}];

console.log(suppResult[0]);