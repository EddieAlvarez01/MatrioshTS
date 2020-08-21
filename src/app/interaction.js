//CSS PROJECT
import '../css/style.css';

//CODE IMPOIRTS
import {editor} from './codemirror';
import { traduction } from './app';

const btnTraduction = document.querySelector('#btnTraduction');

//LISTENER
btnTraduction.addEventListener('click', traductionTxt);

//TRANSLATE LANGUAGE
function traductionTxt(){
    if(editor.getValue() != ''){
        traduction(editor.getValue());
    }else{
        console.log('NO TEXT PROVIDED');
    }
}