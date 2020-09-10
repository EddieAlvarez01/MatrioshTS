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
        NULL: 'null',
        EPSILON: 'epsilon'
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
        FUNCTION: 'function',
        SENTENCES: 'SENTENCES',
        UNARY_MINUS: 'unary_minus'
    },

    errorType: {
        SYNTACTIC: 'Sintáctico',
        SEMANTIC: 'Semántico',
        LEXICAL: 'Léxico',
        FATAL: 'fatal'
    },

    //GRAPH ERROR TABLE AND SYMBOLS   TYPE == 0 GRAPH SYMBOL TABLE      TYPE == 1 GRAPH ERRORS TABLE
    graphTable: (list, type, element, traduction) => {
        if(type){
            graphErrors(list);
            return;
        }
        graphSymbolTable(list, element, traduction);

        //GRAPH THE ERROR TABLE
        function graphErrors(list){
            document.querySelector(element).innerHTML = '';
            if(list.length > 0){
                const table = constructTableError(element);
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
        function constructTableError(element){
            const table = document.createElement('table');
            const div = document.querySelector(element);
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

        //GRAPH THE SYMBOL TABLE
        function graphSymbolTable(list, element, traduction){
            if(traduction){
                document.querySelector(element).innerHTML = '';
            }
            if(list.length > 0){
                const table = constructSymbolTable(element, traduction);
                const tbody = document.createElement('tbody');
                list.forEach((symbol) => {
                    let tr = document.createElement('tr');
                    let td1 = document.createElement('td');
                    let td2 = document.createElement('td');
                    let td3 = document.createElement('td');
                    let td4 = document.createElement('td');
                    let td5 = document.createElement('td');
                    td1.innerHTML = symbol.id;
                    tr.appendChild(td1);
                    td2.innerHTML = symbol.type;
                    tr.appendChild(td2);
                    td3.innerHTML = symbol.scope;
                    tr.appendChild(td3);
                    td4.innerHTML = symbol.row;
                    tr.appendChild(td4);
                    td5.innerHTML = symbol.column;
                    tr.appendChild(td5);
                    if(!traduction){
                        let td6 = document.createElement('td');
                        td6.innerHTML = (symbol.value === null) ? 'null' : symbol.value;
                        tr.appendChild(td6);
                    }
                    tbody.appendChild(tr);
                });
                table.appendChild(tbody);
            }
        }

        function constructSymbolTable(element, traduction){
            const table = document.createElement('table');
            const div = document.querySelector(element);
            table.classList.add('table');
            const thead = document.createElement('thead');
            thead.classList.add('thead-dark');
            let th1 = document.createElement('th');
            let th2 = document.createElement('th');
            let th3 = document.createElement('th');
            let th4 = document.createElement('th');
            let th5 = document.createElement('th');
            th1.setAttribute('scope', 'col');
            th2.setAttribute('scope', 'col');
            th3.setAttribute('scope', 'col');
            th4.setAttribute('scope', 'col');
            th5.setAttribute('scope', 'col');
            th1.innerHTML = 'Nombre';
            thead.appendChild(th1);
            th2.innerHTML = 'Tipo';
            thead.appendChild(th2);
            th3.innerHTML = 'Ámbito';
            thead.appendChild(th3);
            th4.innerHTML = 'Fila';
            thead.appendChild(th4);
            th5.innerHTML = 'Columna';
            thead.appendChild(th5);
            if(!traduction){
                let th6 = document.createElement('th');
                th6.setAttribute('scope', 'col');
                th6.innerHTML = 'Valor';
                thead.appendChild(th6);
            }
            table.appendChild(thead);
            div.appendChild(table);
            return table;
        }
    }

};