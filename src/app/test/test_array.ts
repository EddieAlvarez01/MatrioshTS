const num = [1, 2, 3];

type testing = {
    numero: number
}

let result: testing = null;

let suppResult: testing[] = [{numero: num[1] * 4}];

console.log(suppResult[0]);

num[1] = 200;

console.log(num);

if(num[1] > 4){
    const num: number = 45;
    result = {numero: num};
    console.log(result);
}else if(num[1] == suppResult[0].numero){
    const liu: number = num[2];
    suppResult[0].numero = liu;
    console.log(suppResult);
}

while(suppResult[0].numero < num[1]){
    console.log(suppResult[0].numero);
    suppResult[0].numero = suppResult[0].numero * 2;
}