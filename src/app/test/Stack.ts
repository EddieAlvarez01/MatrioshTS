type stack = {
    top: node
}

type node = {
    next: node,
    data: number
}

const stackValues: stack = {
    top: null
};

function Push(newValue: node): void{
    if(stackValues.top == null){
        stackValues.top = newValue;
    }else{
        newValue.next =  stackValues.top;
        stackValues.top = newValue;
    }
}

function Pop(): node{
    if(stackValues.top == null){
        return null;
    }
    const temp: node = stackValues.top;
    stackValues.top = temp.next;
    return temp;
}

function PrintStack(): void{
    let tmp: node = stackValues.top;
    while(tmp != null){
        console.log(tmp.data);
        tmp = tmp.next;
    }
}

const newNode: node = {data: 20, next: null};
const newNode2: node = {data: 78, next: null};
const newNode3: node = {data: 10, next: null};
const newNode4: node = {data: 36, next: null};
const newNode5: node = {data: 50, next: null};
const newNode6: node = {data: 1, next: null};
const newNode7: node = {data: 200, next: null};

Push(newNode);
Push(newNode2);
Push(newNode3);
Push(newNode4);
Push(newNode5);
Push(newNode6);
Push(newNode7);

PrintStack();

Pop();
Pop();

console.log('POPS');

PrintStack();