Snap.plugin( function( Snap, Element, Paper, global ) {
    var svg;
    
    Element.prototype.text = function() {
        $("#textEdit").hide();
        svg = this.paper;
        this.attr("data-text", "true");
        var element;
        var attrs;
        var textElem = this;
        
        $("#textEdit").blur(function (){
            if (element) {
                attrs.fill = attrs.color; 
                delete attrs.color;
                delete attrs.left;
                delete attrs.top;
                element.attr(attrs);
                element = undefined;
                $("#textEdit").hide();
            }
        }); 
        svg.mousedown(function (evt){
            console.log(evt);
            if (element){
            }
        });
        this.node.addEventListener("svgSeleted", function (evt){
            element = evt.element;
            if (element == textElem) { 
                if (element.attr("data-text") == "true"){ 
                    var bbox = element.node.getBoundingClientRect(); 
                    attrs = {
                        left: bbox.left,
                        top: bbox.top,
                        height: bbox.height,
                        width: bbox.width,
                        x: element.attr("x"),
                        y: element.attr("y"),
                        textAnchor: element.attr("text-anchor"), 
                        fontFamily: element.attr("font-family"),
                        fontSize: element.attr("font-size"),
                        fontStyle: element.attr("font-style"),
                        textAlign: element.attr("text-align"),
                        color: element.attr("fill"),
                        fontVarient: element.attr("font-variant"),
                        fontStretch: element.attr("font-stretch")
                    };
                    console.log("evt fired", attrs);
                    $("#textEdit").css(attrs); 
                    $("#textEdit").val(element.node.textContent);
                    $("#textEdit").show();
                    $("#textEdit").focus();
                    element.attr({
                        x: 3000000
                    });
                }
            } else {
                $("#textEdit").blur();
            }
        }, false); 
    };
});