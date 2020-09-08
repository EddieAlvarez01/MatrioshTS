export class SymbolTable{

    constructor(){
        this.symbols = [];
    }

    //SAVE A VARIABLE IN THE SCOPE  -->BEHAVIOR 1 = EXECUTE, 0 = TRADUCTION
    Set(symbol, behavior){
        if(behavior){

        }
        this.symbols.push(symbol);
    }

}