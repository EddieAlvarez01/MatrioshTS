//CSS PROJECT
import '../css/style.css';

//CODE IMPOIRTS
import {editor} from './codemirror';
import * as d3 from 'd3';
import { traduction } from './app';

const btnTraduction = document.querySelector('#btnTraduction');

//LISTENER
btnTraduction.addEventListener('click', traductionTxt);

//TRANSLATE LANGUAGE
function traductionTxt(){
    if(editor.getValue() != ''){
        const root = traduction(editor.getValue());
        const data = establishHierarchy(root, {});
        graphTree(data);
    }else{
        console.log('NO TEXT PROVIDED');
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
function graphTree(data){
    const margin = {
        top: 40,
        right: 90,
        bottom: 50,
        left: 90
    };
    const width = 660 - margin.right - margin.left;
    const height = 500 - margin.top - margin.bottom;
    const tree = d3.tree().size([width, height]);
    let nodes = d3.hierarchy(data);
    nodes = tree(nodes);
    const svg = d3.select("#imgTreeTraduction").append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom);
    const g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    const link = g.selectAll(".link").data(nodes.descendants().slice(1))
                    .enter().append("path")
                    .attr("class", "link")
                    .attr("d", d => {
                        return "M" + d.x + "," + d.y
                                + "C" + d.x  + "," + (d.y + d.parent.y) / 2
                                + " " + d.parent.x + "," + (d.y + d.parent.y) / 2
                                + " " + d.parent.x + "," + d.parent.y;
                    });
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
}