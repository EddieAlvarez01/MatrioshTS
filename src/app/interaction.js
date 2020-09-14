//CSS PROJECT
import '../css/style.css';

//CODE IMPOIRTS
import { editor } from './codemirror';
import * as d3 from 'd3';
import { traduction, execute, MappingInstructions, TranslationSymbolTable, ExecuteCode } from './app';
import { literal } from './utilities/util';
import { ErrorAlert } from './utilities/alert';

const btnTraduction = document.querySelector('#btnTraduction');
const btnExecute = document.querySelector('#btnExecute');

//LISTENER
btnTraduction.addEventListener('click', traductionTxt);
btnExecute.addEventListener('click', ExecuteTxt);

//TRANSLATE LANGUAGE
function traductionTxt(){
    if(editor.getValue() != ''){
        const root = traduction(editor.getValue());
        const data = establishHierarchy(root, {});
        graphTree(data, '#imgTreeTraduction');
        literal.graphTable(root.errors, 1, '#divError', 0);
        const symbolTable = TranslationSymbolTable(MappingInstructions(root));
        literal.graphTable(symbolTable.symbols, 0, '#divSt', 1);
        editor.setValue(root.traduction);
    }else{
        ErrorAlert('No hay texto para traducir');
    }
}

//EXECUTE LANGUAGE
function ExecuteTxt(){
    if(editor.getValue() != ''){
        document.querySelector('#divStExecute').innerHTML = '';
        const root = execute(editor.getValue());
        if((root.errors.find(Error => Error.type == literal.errorType.FATAL)) == undefined){
            const data = establishHierarchy(root, {});
            graphTree(data, '#imgTreeExecute');
            const symbolTable = ExecuteCode(MappingInstructions(root), root.errors);
            literal.graphTable(symbolTable.symbols, 0, '#divStExecute', 0);
            literal.graphTable(root.errors, 1, '#divErrorExecute', 0);
        }else{
            literal.graphTable(root.errors, 1, '#divErrorExecute', 0);
            ErrorAlert('No se puede ejecutar el código porque existen funciones anidadas, verificar en la tabla de errores');
        }
    }else{
        ErrorAlert('No hay texto para ejecutar');
    }
}

//BUILD A HIERARCHY FOR CHARTING
function establishHierarchy(root, data){
    data.name = String(root.value);
    if(root.childs.length > 0){
        data.children = [];
        root.childs.forEach(element => {
            data.children.push(establishHierarchy(element, {}));
        });
    }
    return data;
}

//GRAPH TREE
function graphTree(data, element){
    clearTreeDiv(element);
    const margin = {
        top: 40,
        right: 90,
        bottom: 50,
        left: 90
    };
    const width = 960 - margin.right - margin.left;
    const height = 500 - margin.top - margin.bottom;
    var nodeWidth = 80;
    var nodeHeight = 75;
    var horizontalSeparationBetweenNodes = 50;
    var verticalSeparationBetweenNodes = 5;
    const tree = d3.tree().size([width, height]).nodeSize([nodeWidth + horizontalSeparationBetweenNodes, nodeHeight + verticalSeparationBetweenNodes])
                    .separation(function(a, b) {
                        return a.parent == b.parent ? 1 : 1.25;});
    let zoom = d3.zoom().scaleExtent([0.3,2]).on("zoom", zoomed);

    let nodes = d3.hierarchy(data);
    nodes = tree(nodes);

    const svg = d3.select(element).append("svg")
                                                .attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom);
    
    let zoomer = svg.append("rect")
                .attr("width", width)
                .attr("height", height)
                .style("fill", "none")
                .style("pointer-events", "all")
                .call(zoom);

                                                
    const g = svg.append("g");
    zoomer.call(zoom.transform, d3.zoomIdentity.translate(150, 0));
    g.selectAll(".link").data(nodes.descendants().slice(1))
                    .enter().append("path")
                    .attr("class", "link")
                    .attr("d", d => {
                        return "M" + d.x + "," + d.y
                                + "C" + d.x  + "," + (d.y + d.parent.y) / 2
                                + " " + d.parent.x + "," + (d.y + d.parent.y) / 2
                                + " " + d.parent.x + "," + d.parent.y;
                    });
   // nodes.descendants().forEach((d) => {d.y = d.depth * 180; });
    const node = g.selectAll(".node").data(nodes.descendants())
                .enter().append("g")
                .attr("class", d => {
                    return "node" + (d.children ? " node--internal" : " node--leaf");
                })
                .attr("transform", d => "translate(" + d.x + "," + d.y + ")");
    node.append("circle").attr("r", 10);
    node.append("text").attr("dy", ".35em")
                                        .attr("y", d => {
                                            return d.children ? -20 : 20;
                                        })
                                        .style("text-anchor", "middle")
                                        .text(d => d.data.name);
    
    data.x0 = 100;
    centerNode(data);
    
    function zoomed() {
        g.attr("transform", d3.event.transform);//The zoom and panning is affecting my G element which is a child of SVG
    }

    function centerNode(source){

        let t = d3.zoomTransform(zoomer.node());
        let x =  t.x;
        let y = source.x0;
        y = -y *t.k + height / 2;
    
        g.transition()
         .duration(750)
         .attr("transform", "translate(" + x + "," + y + ")scale(" + t.k + ")")
         .on("end", function(){ zoomer.call(zoom.transform, d3.zoomIdentity.translate(x,y).scale(t.k))});
    }

}

//CLEAR TREE DIV
function clearTreeDiv(element){
    document.querySelector(element).innerHTML = '';
}