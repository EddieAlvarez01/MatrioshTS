const num = [1, 2, 3];

type testing = {
    numero: number
}

const sama = [1, 'sss', true];

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

type response = {
    message: string,
    code: number 
}

let res: response = {
    message: 'Successful',
    code: 102
};

//FOR IN
for(let index in suppResult[0]){
    const salve = suppResult[0];
    console.log(salve[index]);
}

let index;

//FOR IN ASIGNATE
for(index in suppResult){
    console.log(index);
}


for(let index in res){
    const salve = res[index];
    console.log(index);
    console.log(salve);
}

for(let obj of sama){
    console.log(obj);
}

//SWITCH
switch(num[1]){
    case 100:
        console.log('soy 100');
    case 200:
        console.log("Soy 200");
        break;
    case 300:
        console.log('soy 300');
    default:
        const samas = res.code;
        graficar_ts();
        console.log(samas);
}

type rocko = {
    gg: number;
    de: surfeut
}
