export const literal = {

    dataTypes: {
        STRING: 'string',
        NUMBER: 'number',
        BOOLEAN: 'boolean',
        VOID: 'void',
        ANY: 'any',
        ARRAY_STRING: 'array_string',
        ARRAY_NUMBER: 'array_number',
        ARRAY_BOOLEAN: 'array_boolean',
        ARRAY_ANY: 'array_any',
        OBJECT: 'object',
        VARIABLE: 'variable',
        NULL: 'null'
    },

    operation: {
        ADDITION: 'addition',
        SUBTRACTION: 'subtraction',
        MULTIPLICATION: 'multiplication',
        DIVISION: 'division',
        MODULUS: 'modulus',
        POW: 'pow',
        DECLARATION: 'declaration',
        ASSIGNMENT: 'assignment',
        TERNARY_OPERATOR: 'ternary_operator',
        TYPE_DECLARATION: 'type_declaration',
        IF: 'if',
        ELSE: 'else',
        DEFAULT: 'default',
        CASE: 'case',
        SWITCH: 'switch',
        LCASES: 'lcases',
        LEXPL: 'lexpl',
        OTHER_THAN: 'other_than',
        WHILE: 'while',
        DO_WHILE: 'do_while',
        INCREMENT: 'increment',
        DECREMENT: 'decrement',
        FOR: 'for',
        FOR_IN: 'for_in',
        FOR_OF: 'for_of',
        ARRAY_ACCESS: 'array_access',
        FUNCTION_CALL: 'function_call',
        PROPERTY_ACCESS: 'property_acess',
        JUST_AS: 'just_as',
        PRINT: 'print',
        GRAPH_TS: 'graph_ts',
        BREAK: 'break',
        CONTINUE: 'continue',
        RETURN: 'return',
        PROPERTY_DECLARATION: 'property_declaration',
        ARRAY: 'array',
        DEFINITION: 'definition',
        LENGTH: 'length',
        POP: 'pop',
        PUSH: 'push',
        GREATER_THAN_OR_EQUAL_TO: 'greater_than_or_equal_to',
        LESS_THAN_OR_EQUAL_TO: 'less_than_or_equal_to',
        GREATER_THAN: 'greater_than',
        LESS_THAN: 'less_than',
        NOT: 'not',
        AND: 'and',
        OR: 'or',
        FUNCTION: 'function'
    },

    errorType: {
        SYNTACTIC: 'Sintáctico',
        SEMANTIC: 'Semántico',
        LEXICAL: 'Léxico'
    },

    //GRAPH ERROR TABLE AND SYMBOLS   TYPE == 0 GRAPH SYMBOL TABLE      TYPE == 1 GRAPH ERRORS TABLE
    graphTable: (list, type) => {
        console.log(list);
        if(type){
            graphErrors(list);
            return;
        }

        //GRAPH THE ERROR TABLE
        function graphErrors(list){
            document.querySelector('#divError').innerHTML = '';
            if(list.length > 0){
                const table = constructTableError();
                const tbody = document.createElement('tbody');
                list.forEach((error) => {
                    let tr = document.createElement('tr');
                    let td1 = document.createElement('td');
                    let td2 = document.createElement('td');
                    let td3 = document.createElement('td');
                    let td4 = document.createElement('td');
                    td1.innerHTML = error.type;
                    tr.appendChild(td1);
                    td2.innerHTML = error.description;
                    tr.appendChild(td2);
                    td3.innerHTML = error.row;
                    tr.appendChild(td3);
                    td4.innerHTML = error.column;
                    tr.appendChild(td4);
                    tbody.appendChild(tr);
                });
                table.appendChild(tbody);
            }   
        }

        //CONSTRUCT ERROR TABLE
        function constructTableError(){
            const table = document.createElement('table');
            const div = document.querySelector('#divError');
            table.classList.add('table');
            const thead = document.createElement('thead');
            thead.classList.add('thead-dark');
            let th1 = document.createElement('th');
            let th2 = document.createElement('th');
            let th3 = document.createElement('th');
            let th4 = document.createElement('th');
            th1.setAttribute('scope', 'col');
            th2.setAttribute('scope', 'col');
            th3.setAttribute('scope', 'col');
            th4.setAttribute('scope', 'col');
            th1.innerHTML = 'Tipo';
            thead.appendChild(th1);
            th2.innerHTML = 'Descripción';
            thead.appendChild(th2);
            th3.innerHTML = 'Línea';
            thead.appendChild(th3);
            th4.innerHTML = 'Columna';
            thead.appendChild(th4);
            table.appendChild(thead);
            div.appendChild(table);
            return table;
        }
    }

};