
Snap.plugin( function( Snap, Element, Paper, global ) {    
    Element.prototype.text = function() {
        $("#textEdit").hide();
        var element;
        var attrs;
        var textElem = this;
        var svg = this.paper.parent();
        var dragging = false;
        
        function updateTextPosition(){
            var elScreenCoords = element.node.getBoundingClientRect(); 
            var newBx = svg.convertToWindowPoints(elScreenCoords.left, elScreenCoords.top);            
            attrs = {
                left: newBx.x,
                top: newBx.y,
                height: elScreenCoords.height,
                width: elScreenCoords.width,
                x: element.attr("x"),
                y: element.attr("y"), 
                outline: "none",
                textAnchor: element.attr("text-anchor"), 
                fontFamily: element.attr("font-family"),
                fontSize: element.attr("font-size"),
                fontStyle: element.attr("font-style"),
                textAlign: element.attr("text-align"),
                color: element.attr("fill"),
                fontVarient: element.attr("font-variant"),
                fontStretch: element.attr("font-stretch")
            };
            $("#textEdit").css(attrs); 
        } 
        
        $("#textEdit").keyup(function (evt){
            if (element) {
                textElem.attr({ text: this.value});
                element.updateRubberBand();
                updateTextPosition();
            }
        });
        
        this.node.addEventListener("svgUnSeleted", function (evt){
            if (element) {
                if (attrs){
                    attrs.fill = attrs.color; 
                    delete attrs.color;
                    delete attrs.left;
                    delete attrs.top;
                    element.attr(attrs); 
                }
                $("#textEdit").hide();
                element.attr("visibility", "visible");
                element = undefined;
            }
        });
        
        this.node.addEventListener("svgDragging", function (evt){
            dragging = true;
            if ($("#textEdit").is(":visible")) {
                updateTextPosition();
            }
        }); 
        
        this.node.addEventListener("svgClicked", function (evt){
            dragging = false;
            if (!$("#textEdit").is(":visible")) {
                showEditText();
            }
        }); 
        
        this.node.addEventListener("svgSeleted", function (evt){
            element = evt.element;
            if (element == textElem) { 
                setTimeout(function(){
                    if (dragging){
                        dragging = false;
                    } else {
                        showEditText();
                    }
                }, 100);
            } else {
                $("#textEdit").blur();
            }
        }, false); 
        
        function showEditText() {
            updateTextPosition(); 
            $("#textEdit").val(element.node.textContent);
            $("#textEdit").show();
            $("#textEdit").focus(); 
            $("#textEdit").select();
            element.attr("visibility", "hidden");
        }
    };
});