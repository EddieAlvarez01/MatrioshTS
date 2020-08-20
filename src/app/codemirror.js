import code from 'codemirror';

const editor = code(document.querySelector('#txt'), {
    lineNumbers: true
});

const console = code(document.querySelector('#console'), {
    readOnly: true,
    theme: 'tomorrow-night-eighties'
});

editor.setSize('100%', '29rem');
console.setSize(null, '16rem');