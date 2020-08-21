class ParseNode{

    constructor(row, column, operation, value, type, constant, dynamic){
        this.row = row;
        this.column = column;
        this.operation = operation;
        this.value = value;
        this.type = type;
        this.childs = [];
        this.constant = constant;
        this.dynamic = dynamic;
    }

    //ADD CHILDS
    addChild(node) {
        this.childs.push(node);    
    }

}

export default ParseNode;