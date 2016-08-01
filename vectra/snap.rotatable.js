
Snap.plugin( function( Snap, Element, Paper, global ) { 
    Element.prototype.rotatable = function() {
        var svg  = this.paper.parent();
        var rotateRect;
        var rotateLine; 
        
        function svgSelected(evt){
            var bandBbox = evt.data.getBBox();
            var x1 = bandBbox.x + (bandBbox.width / 2);
            var y1 = bandBbox.y;
            var x2 = x1;
            var y2 = y1 - 20;
            
            if (svg.select("#_internalRotateLine")){
                rotateLine = svg.select("#_internalRotateLine");
                rotateLine.attr({
                    x1: x1,
                    y1: y1,
                    x2: x2,
                    y2: y2
                });
            } else {
                rotateLine = svg.line(x1, y1, x2, y2);
            }
            rotateLine.attr({
                "stroke-width": "1",
                "stroke-dasharray": "4,4",
                "stroke-opacity": "1",
                "stroke": "#000",
                "id": "_internalRotateLine"
            });
        }
        
        function svgUnSelected(){
            rotateLine = svg.select("#_internalRotateLine");
            if (rotateLine){
                svg.select("#_internalRotateLine").remove();
            }
            rotateLine = undefined;
        }
        
        this.node.addEventListener("svgDragging", svgSelected, false);
        window.addEventListener("svgMultipleDragging", svgSelected, false);
        
        this.node.addEventListener("svgSeleted", svgSelected, false);
        window.addEventListener("svgMultipleSeleted", svgSelected, false);
        
        this.node.addEventListener("svgUnSeleted", svgUnSelected, false);
        window.addEventListener("svgMultipleUnSeleted", svgUnSelected, false);
    };
}); 