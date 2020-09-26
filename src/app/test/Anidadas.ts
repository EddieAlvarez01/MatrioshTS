function Abuelo(){
    const x = 10;
    function Padre(){
        const y = x * 10;

        function Hijo(){
            const z = x ** 2;
            return z;
        }
        console.log("El hijo tiene: ", Hijo());
        return y;
    }
    console.log("El abuelo tiene: ", x);
    console.log("EL padre tiene: ", Padre());
}

Abuelo();


//ARRAYS
let paises_europeos:string[] = [
    "España", 
    "Francia", 
    "Italia", 
    "Alemania", 
    "Rumanía", 
    "Reino Unido", 
    "Polonia"
];
 
console.log ("Matriz inicial:");
console.log (paises_europeos);
 
paises_europeos.push("Holanda");
let quedan:number = paises_europeos.length;
 
console.log ("Hemos agregado:", paises_europeos[paises_europeos.length - 1]);
console.log ("Nos quedan", quedan, "paises");
console.log ("Matriz final:");
console.log (paises_europeos);
 
// Iteramos con la construcción for...in, accediendo a cada elemento a través de su índice.
// Observa que al índice i no lo declaramos como number 
// ya que, al ser el índice de for...in se asume implícitamente.
for (let i in paises_europeos)
{
    console.log ("El país con el indice", i, "es", paises_europeos[i]);
}
 
// iteramos con la construcción for...of, que accede al valor
// de cada elemento directamente, sin usar el índice.
for (let pais of paises_europeos)
{
    console.log ("Estamos iterando sobre el pais", pais);
}