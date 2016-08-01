
Snap.plugin(function (Snap, Element, Paper, global) {
    Element.prototype.text = function () {
        var attrs;
        var element;
        var textElem = this;
        var svg = this.paper.parent();
        var inputElem = document.getElementById("textEdit");
        
        inputElem.style.display = "none";
        inputElem.onkeyup = function (evt) {
            if (element) {
                textElem.attr({text: this.value});
                element.updateRubberBand();
                updateTextPosition();
            }
        };

        this.node.addEventListener("svgUnSeleted", function (evt) {
            if (element) {
                if (attrs) {
                    attrs.fill = attrs.color;
                    delete attrs.color;
                    delete attrs.left;
                    delete attrs.top;
                    element.attr(attrs);
                }
                inputElem.style.display = "none";
                element.attr("visibility", "visible");
                element = undefined;
            }
        });

        this.node.addEventListener("svgDragging", function (evt) {
            if (inputElem.style.display !== "none") {
                updateTextPosition();
            }
        });

        this.node.addEventListener("svgClicked", function (evt) {
            if (inputElem.style.display === "none") {
                showEditText();
            }
        });

        this.node.addEventListener("svgSeleted", function (evt) {
            element = evt.element;
            if (element == textElem) {
                showEditText();
            } else {
                inputElem.blur();
            }
        }, false); 
        
        function updateTextPosition() {
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

        function showEditText() {
            updateTextPosition();
            inputElem.value = element.node.textContent;
            inputElem.style.display = "block"; 
            inputElem.focus();
            inputElem.select();
            element.attr("visibility", "hidden");
        }
    };
});