import code from 'codemirror';

const editor = code(document.querySelector('#txt'), {
    lineNumbers: true
});

const consoleOutput = code(document.querySelector('#console'), {
    readOnly: true,
    theme: 'tomorrow-night-eighties'
});

editor.setSize('100%', '29rem');
consoleOutput.setSize('100%', '24rem');
export {editor, consoleOutput};