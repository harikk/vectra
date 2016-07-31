$(function () {
    var svg;

    function init() {
        svg = Snap("#drawingArea");
        svg.canvas();
        Snap.load("logo.svg", function (f) {
            svg.append(f);  
            svg.updateInnerCanvas();
            svg.selectable();
            var texts = svg.selectAll("svg>text");
            for (var i = 0; i < texts.length; i++){
                texts[i].text();
            }
        });
       
        window.addEventListener("svgSeleted", function (evt){ 
            //console.log("onSvgSeleted", evt.element);
        }, false);
        
        window.addEventListener("svgMultipleSeleted", function (evt){ 
            //console.log("svgMultipleSeleted", evt.elements);
        }, false);
         
    }


    init();
}); 