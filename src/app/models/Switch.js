import { literal } from "../utilities/util";
import { SymbolTable } from './SymbolTable';
import { Break } from './Break';
import { Continue } from './Continue';
import { Return } from './Return';
import Error from './Error';

export class Switch{
    
    constructor(expression, casesList, row, column){
        this.expression = expression;
        this.casesList = casesList;
        this.row = row;
        this.column = column;
    }

    traduction(st, scope){
        this.casesList.forEach((cs) => {
            cs.traduction(st, 'Switch');
        });
    }

    execute(st, output, errors){
        const evaluate = this.expression.execute(st, output, errors);
        if(evaluate instanceof Error) return evaluate;
        const resultVerify = this.VerifyType(evaluate);
        if(resultVerify instanceof Error) return resultVerify;
        const mappedCases = [];
        const newSt = new SymbolTable('Switch');
        newSt.next = st;
        for(let inCase of this.casesList){
            const resultMapping = inCase.Mapping(newSt, output, errors, evaluate.type);
            if(resultMapping instanceof Error) return resultMapping;
            if(!this.CheckCases(mappedCases, resultMapping)) return new Error(literal.errorType.SEMANTIC, `No se puede tener dos 'default' en una sentencia switch`, this.row, this.column);
            mappedCases.push(resultMapping);
        }
        const index = this.SearchMatch(mappedCases, evaluate);
        if(index === null) return null;
        mappedCases.forEach((obj) => {
            newSt.SearchTypes(obj.instructions, output, errors);
        });
        for(let i = index; i < mappedCases.length; i++){
            for(let instruction of mappedCases[i].instructions){
                const resultExecute = instruction.execute(newSt, output, errors);
                if(resultExecute instanceof Error){
                    errors.push(resultExecute);
                }else if(resultExecute instanceof Break){
                    return null;
                }else if(resultExecute instanceof Continue){
                    return resultExecute;
                }else if(resultExecute instanceof Return){
                    return resultExecute;
                }
            }
        }
        return null;
    }

    //VERIFY TYPE
    VerifyType(evaluate){
        switch(evaluate.type){
            case literal.dataTypes.NULL:
                return new Error(literal.errorType.SEMANTIC, `No se puede evaluar un tipo 'null'`, this.row, this.column);
        }
        return true;
    }

    //check the sense of the cases
    CheckCases(list, inCase){
        if(inCase.value == null){
            if(list.find(obj => obj.value == null) != undefined) return false;
        }
        return true;
    }

    //SEARCH FOR MATCHES
    SearchMatch(list, exp){
        let index = list.findIndex((obj) => {
            if(obj.value != null){
                return obj.value.value === exp.value;
            }
        });
        if(index != -1) return index;
        index = list.findIndex((obj) => obj.value == null);
        if(index != -1) return index;
        return null;
    }

}