class ParseNode{

    constructor(row, column, operation, value, type, constant, dynamic, traduction, array, her){
        this.row = row;
        this.column = column;
        this.operation = operation;
        this.value = value;
        this.type = type;
        this.childs = [];
        this.errors = [];
        this.constant = constant;
        this.dynamic = dynamic;
        this.traduction = traduction;
        this.array = array;
        this.her = her;
    }

    //ADD CHILDS
    addChild(node) {
        this.childs.push(node);    
    }

}

export default ParseNode;