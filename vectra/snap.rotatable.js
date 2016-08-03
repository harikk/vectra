
Snap.plugin( function( Snap, Element, Paper, global ) { 
    Element.prototype.rotatable = function() {
        var svg  = this.paper.parent();
        var rotateCtrl;
        var rotateLine; 
        
        var localMatrixEl;
        var localMatrixBand;
        
        var element;
        var selectRect;
        
        var pointOfRotation;
        var bandPointOfRotation;
        
        var angle = 0;
        
        function dragging(dx, dy, x, y, evt){
            evt.stopPropagation();
            angle++;
            
            var t = new Snap.Matrix();
            t.rotate(angle, pointOfRotation.x, pointOfRotation.y);
            t.add(localMatrixEl);
            element.transform(t);
            
            var f = new Snap.Matrix();
            f.rotate(angle, bandPointOfRotation.x, bandPointOfRotation.y);
            f.add(localMatrixBand);
            selectRect.transform(f);
            rotateCtrl.transform(f);
            rotateLine.transform(f);
        }
        
        function dragStart(x, y, evt){
            localMatrixEl = element.transform().localMatrix;
            localMatrixBand = selectRect.transform().localMatrix;
            evt.stopPropagation();
        }
        
        function dragEnd(evt){
            evt.stopPropagation();
        }
        
        function svgSelected(evt){
            var bandBbox = evt.data.getBBox ? evt.data.getBBox(): evt.data.band.getBBox();
            var x1 = bandBbox.x + (bandBbox.width / 2);
            var y1 = bandBbox.y;
            var x2 = x1;
            var y2 = y1 - 20;
            
            element = evt.data.elementGroup ? evt.data.elementGroup : evt.element;
            var elBBox = element.getBBox ? element.getBBox() : evt.data.elementGroup.getBBox(); 
            selectRect = evt.data.band || evt.data;
            var bandBBox = selectRect.getBBox();
            pointOfRotation = {x: elBBox.x + (elBBox.width / 2), y: elBBox.y + (elBBox.height / 2)};
            bandPointOfRotation = {x: bandBBox.x + (bandBBox.width / 2), y: bandBBox.y + (bandBBox.height / 2)};
            
            rotateLine = svg.select("#_internalRotateLine");
            if (rotateLine){
                rotateLine.attr({
                    x1: x1,
                    y1: y1,
                    x2: x2,
                    y2: y2
                });
            } else {
                rotateLine = svg.line(x1, y1, x2, y2);
                rotateLine.attr({
                    "stroke-width": "1",
                    "stroke-dasharray": "4,4",
                    "stroke-opacity": "1",
                    "stroke": "#000",
                    "id": "_internalRotateLine" 
                });
            }
            
            var r = 5;
            var x = x1;
            var y = y2;
            rotateCtrl = svg.select("#_internalRotateControl");
            if (rotateCtrl){
                rotateCtrl.attr({
                    cx: x,
                    cy: y,
                    r: r
                });
            } else {
                rotateCtrl = svg.circle(x, y, r);
                rotateCtrl.attr({
                    "stroke-width": "1",  
                    "stroke": "black",
                    "fill": "green",
                    "cursor": "pointer",
                    "id": "_internalRotateControl" 
                });
                rotateCtrl.drag(dragging, dragStart, dragEnd);
            }
            
            var rotateStr = element.transform().toString(); 
            if (rotateStr.indexOf("r") > 0){
                rotateStr = rotateStr.substr(rotateStr.indexOf("r") + 1).split(",");
                angle = parseFloat(rotateStr[0]);
                var x = rotateStr[1];
                var y = rotateStr[2];
                var f = new Snap.Matrix();
                f.rotate(angle, bandPointOfRotation.x, bandPointOfRotation.y);
                f.add(localMatrixBand);
                selectRect.transform(f);
                rotateCtrl.transform(f);
                rotateLine.transform(f);
            }  
        }
        
        function svgUnSelected(){
            rotateLine = svg.select("#_internalRotateLine");
            if (rotateLine){
                svg.select("#_internalRotateLine").remove();
            }
            rotateLine = undefined;
            rotateCtrl = svg.select("#_internalRotateControl");
            if (rotateCtrl){
                svg.select("#_internalRotateControl").remove();
            }
            rotateCtrl = undefined;
        }
        
        this.node.addEventListener("svgDragging", svgSelected, false);
        window.addEventListener("svgMultipleDragging", svgSelected, false);
        
        this.node.addEventListener("svgSeleted", svgSelected, false);
        window.addEventListener("svgMultipleSeleted", svgSelected, false);
        
        this.node.addEventListener("svgUnSeleted", svgUnSelected, false);
        window.addEventListener("svgMultipleUnSeleted", svgUnSelected, false);
    };
}); 