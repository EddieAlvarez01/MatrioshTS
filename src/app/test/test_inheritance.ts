function fun1(): void{
    function fun2(): number{
        return x * 10;
    }
    let x = 100;
    let y = fun2();
    console.log(y);
}

fun1();