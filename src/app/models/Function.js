import { Symbol } from './Symbol';

export class Function{

    constructor(id, parametersList, type, array, instructionsList, row, column){
        this.id = id;
        this.parametersList = parametersList;
        this.type = type;
        this.array = array;
        this.instructionsList = instructionsList;
        this.row = row;
        this.column = column;
    }

    traduction(st, scope){
        this.parametersList.forEach((parameter) => {
            st.Set(Symbol.NewSymbolTranslate(parameter.value, parameter.type, `function (${this.id})`, parameter.row, parameter.column), 0);
        });
        this.instructionsList.forEach((instruction) => {
            instruction.traduction(st, `function (${this.id})`);
        });
    }

}