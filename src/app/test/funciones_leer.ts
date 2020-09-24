const numero: number = 45;
let huy = 'aaa';

fibonacci(2);

function fibonacci(n: number): number{
    if(n > 1){
        return fibonacci(n-1) + fibonacci(n - 2);
    }else if(n == 1){
        return 1;
    }else if(n == 0){
        return 0;
    }else{
        console.log('Debes ingresar un tamaño mayor o igual a 1');
        return -1;
    }
}