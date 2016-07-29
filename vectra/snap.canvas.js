Snap.plugin(function (Snap, Element, Paper, global) { 
    var innerRect;
    Element.prototype.canvas = function () {
        var rect = this.rect(0, 0, 800, 600);
        var gradient = this.gradient("r(50%, 50%, 200%)#FFFFFF-#000000");
        var filter = this.filter(Snap.filter.shadow(0, 0, 5, "#0f0f0f", 0.5));
        rect.attr({
           fill: gradient,
           'pointer-events': "none",
           id: "canvasBg"
        });
        innerRect = this.rect(0, 0, 0, 0);
        innerRect.attr({
           fill: 'white',
           'pointer-events': "none",
           id: "canvasFg",
           filter: filter
        });
    };
    
    Element.prototype.getCanvas = function (){
        return innerRect;
    };
    
    Element.prototype.updateInnerCanvas = function () { 
        var viewBox = this.select("svg").attr("viewBox");
        var outerSvgDims = this.getBBox(); 
        var width = viewBox.width;
        var height = viewBox.height;
        var x = (outerSvgDims.width / 2) - (width / 2);
        var y = (outerSvgDims.height / 2) - (height / 2);
        
        var innerRectOptions = {
            x: x,
            y: y,
        };
        this.select("svg").attr(innerRectOptions);
        innerRectOptions.height = height,
        innerRectOptions.width = width;
        innerRect.attr(innerRectOptions);
    };
 
}); 