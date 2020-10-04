function tail(strs:string[]):string[]{
    let result = [];
    for(let i = 1; i < strs.length; i++){
        result.push(strs[i]);
    }
    return result;
}

function head(strs:string[]):string{
    return strs[0];
}

function ml_list_constructor(head:string, tail:string[]):string[]{
    let result = [head];
    for(let i = 0; i < tail.length; i++){
        result.push(tail[i]);
    }
    return result;
}

console.log(ml_list_constructor("head", ["tail", "tail2"]));

function contains(str:string, strs:string[]):boolean{
    function imp(strs:string[]):boolean{
        if(strs.length == 0){
            return false;
        }
        else{
            let head_strs = head(strs);
            let tail_strs = tail(strs);
            if(head_strs == str){
                return true;
            }
            else{
                return imp(tail_strs);
            }
        }
    }
    return imp(strs);
}

function replace(target:string, replacement:string, strs:string[]):string[]{
    function imp(strs:string[]):string[]{
        if(strs.length == 0){
            return [];
        }
        else{
            let head_strs = head(strs);
            let tail_strs = tail(strs);
            if(head_strs == target){
                return ml_list_constructor(replacement, tail_strs);
            }
            else{
                return ml_list_constructor(head_strs, imp(tail_strs));
            }
        }
    }
    return imp(strs);
}

function replaceAll(target:string, replacement:string, strs:string[]):string[]{
    function imp(strs:string[]):string[]{
        if(strs.length == 0){
            return [];
        }
        else{
            let head_strs = head(strs);
            let tail_strs = tail(strs);
            if(head_strs == target){
                return ml_list_constructor(replacement, imp(tail_strs));
            }
            else{
                return ml_list_constructor(head_strs, imp(tail_strs));
            }
        }
    }
    return imp(strs);
}

console.log(contains("Pararrayos", ["Pasta", "Ceremonia", "Ganancias", "Disciplina", "Bicho", "Bicho", "Mercado", "Pararrayos", "Agua", "Bicho"]));
console.log(contains("Alvarez", ["Pasta", "Ceremonia", "Ganancias", "Disciplina", "Bicho", "Bicho", "Mercado", "Pararrayos", "Agua", "Bicho"]));
console.log(replace("Bicho", ":)", ["Pasta", "Ceremonia", "Ganancias", "Disciplina", "Bicho", "Bicho", "Mercado", "Pararrayos", "Agua", "Bicho"]));
console.log(replaceAll("Bicho", ":D", ["Pasta", "Ceremonia", "Ganancias", "Disciplina", "Bicho", "Bicho", "Mercado", "Pararrayos", "Agua", "Bicho"]));
console.log(replace("nan", "FAIL", ["Pasta", "Ceremonia", "Ganancias", "Disciplina", "Bicho", "Bicho", "Mercado", "Pararrayos", "Agua", "Bicho"]));
console.log(replaceAll("nan", "FAIL", ["Pasta", "Ceremonia", "Ganancias", "Disciplina", "Bicho", "Bicho", "Mercado", "Pararrayos", "Agua", "Bicho"]));

graficar_ts();