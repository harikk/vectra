
Snap.plugin(function (Snap, Element, Paper, global) {
    var svg; 
    var start;
    var multiSelectRect;
    var singleSelectRect;
    var mode;
    var selectedItem; 
    
    function triggerEvent(evName, evTarget, fireTarget, data){ 
        var evt = Events.createEvent(evName);
        evt.element = evTarget;  
        evt.data = data;
        Events.fireEvent(evt, fireTarget); 
    }

    Element.prototype.selectable = function () {
        var localMatrix;
        svg = this;
        svg.mousedown(function (evt, x, y) {
            var item = Snap(evt.target);
            var winPos = convertToWindowPoints(x, y)
            var _selectItem = function () {
                var selected = item;
                resetSelection();
                if (selected && selected.type != "svg") {
                    selectedItem = getOuterGroupEl(selected);
                    getRubberBand(selectedItem);
                    mode = "select";
                    triggerEvent("svgSeleted", selectedItem, selectedItem.node, singleSelectRect); 
                }
            }
            if (mode == "select" || mode == "multiselected") {
                if (!isInternalNode(item)) {
                    if (isElementUnderPoint(singleSelectRect, winPos.x, winPos.y)) {
                        // do nothing
                    } else {
                        _selectItem();
                    }
                } else {
                    resetSelection();
                }
            } else {
                _selectItem();
            }
        });
        var lastDx, lastDy;
        svg.drag(function (dx, dy, x, y, evt) { 
            var coords = convertToWindowPoints(x, y); 
            lastDx = dx;
            lastDy = dy;
            if (mode == "select" || mode == "multiselected") {
                var t = new Snap.Matrix();
                t.translate(dx, dy);
                t.add(localMatrix);
                selectedItem.transform(t);

                var bbox = getWindowPosition(selectedItem);
                singleSelectRect.attr({
                    x: bbox.x - 10,
                    y: bbox.y - 10
                });
                if (mode == "multiselected"){
                    triggerEvent("svgMultipleDragging", selectedItem, undefined, singleSelectRect);
                } else {
                    triggerEvent("svgDragging", selectedItem, selectedItem.node, singleSelectRect);
                }
            } else {
                if (!multiSelectRect) {
                    multiSelectRect = svg.rect(coords.x, coords.y, 1, 1, 0, 0);
                    multiSelectRect.attr({
                        "fill": "#000",
                        "fill-opacity": "0.1",
                        "stroke-width": "1",
                        "stroke-dasharray": "4,4",
                        "stroke-opacity": "1",
                        "stroke": "#000",
                    });
                }
                mode = "multiselecting";

                var bbox = getWindowPosition(multiSelectRect);
                var cx = bbox.x;
                var cy = bbox.y;
                var ch = coords.y - start.y;
                var cw = coords.x - start.x;
                if (ch < 0) {
                    cy = coords.y;
                    ch = (start.y - coords.y);
                }
                if (cw < 0) {
                    cx = coords.x;
                    cw = (start.x - coords.x);
                }
                multiSelectRect.attr({
                    width: cw,
                    height: ch,
                    y: cy,
                    x: cx
                });
            }
        }, function (x, y) { 
            if (mode == "select" || mode == "multiselected") {
                localMatrix = selectedItem.transform().localMatrix;
            } else {
                resetSelection()
                start = convertToWindowPoints(x, y);
            }
        }, function () { 
            if (mode == "multiselecting") {
                var bounds = getWindowPosition(multiSelectRect);
                var items = svg.selectAll("svg > *");
                multiSelectRect.remove();
                selectedItem = undefined;
                var g = svg.select("svg").g();
                g.attr("id", "_internalMultiSelectGroup");
                items.forEach(function (el) {
                    if(!isInternalNode(el)){
                        var elBounds = getWindowPosition(el);
                        if (el.type != "svg" && isDisplayableBbox(elBounds)) {
                            if (Snap.path.isBBoxIntersect(elBounds, bounds)) {
                                el.attr("data-old-transform", el.transform().localMatrix.toTransformString());
                                g.add(el); 
                            }
                        }
                    }
                });
                if (g) {
                    selectedItem = g;
                    /* check for non displayable elements like <desc>, <metadata> etc */
                    if (isDisplayableBbox(getWindowPosition(g))) {
                        getRubberBand(g); 
                        mode = "multiselected";
                        triggerEvent("svgMultipleSeleted", g.children(), undefined, singleSelectRect);
                    } else {
                        resetSelection();
                    }
                } else {
                    resetSelection();
                }
            } 
        });
    }; 
    
    function resetSelection() { 
        var rect = svg.select("#_internalRubberBand");
        if (rect != null) {
            rect.remove();
        }
        if (singleSelectRect) {
            singleSelectRect.remove();
            singleSelectRect = undefined;
        }
        if (multiSelectRect) {
            multiSelectRect.remove();
            multiSelectRect = undefined;
        }
        var multiGroup = svg.select("#_internalMultiSelectGroup");
        if (multiGroup) {
            var items = multiGroup.children();
            var innerSvg = svg.select("svg"); 
            for (var i = items.length; i > 0; i--) {
                var item = items[i - 1];
                item.transform(item.transform().totalMatrix.toTransformString());
                innerSvg.append(item);
            }  
            triggerEvent("svgMultipleUnSeleted", items);
            multiGroup.remove();
        } else if (selectedItem) { 
            triggerEvent("svgUnSeleted", selectedItem, selectedItem.node, singleSelectRect);
        }
        mode = "clear";
        return rect;
    }
     
    function getWindowPosition (elem){
        var coord = elem.node.getBoundingClientRect();
        var screenPos = convertToWindowPoints(0, 0);
        return {
            x: coord.left + screenPos.x,
            y: coord.top + screenPos.y,
            height: coord.height,
            width: coord.width
        };
    }
    
    function convertToWindowPoints(x, y){
        var real = svg.node.getBoundingClientRect();
        return {
            x: x - real.left,
            y: y - real.top
        };
    }
    
    function isInternalNode(el) {
        return !el || el.node.id == "canvasBg" || el.node.id == "canvasFg";
    }

    function getOuterGroupEl(el) {
        var parent = el.parent();
        if (parent) {
            if (parent.parent() && parent.parent().type == "g") {
                return getOuterGroupEl(parent);
            } else if (parent.type == "g") {
                return parent;
            } else {
                return el;
            }
        } else {
            return el;
        }
    }
    
    function isElementUnderPoint(obj, x, y) { 
        return Snap.path.isPointInsideBBox(getWindowPosition(obj), x, y);
    }

    function isDisplayableBbox(bbox) {
        return bbox.height > 0 && bbox.width > 0;
    }

    function getRubberBand(node) {
        var screen = getWindowPosition(node);
        singleSelectRect = svg.rect(screen.x - 10, screen.y - 10, screen.width + 20, screen.height + 20, 0, 0);
        singleSelectRect.attr({
            "fill": "#000",
            "fill-opacity": "0",
            "stroke-width": "1",
            "stroke-dasharray": "4,4",
            "stroke-opacity": "1",
            "cursor": "move",
            "stroke": "#000",
            "id": "_internalRubberBand"
        });
        singleSelectRect.click(function (){
            triggerEvent("svgClicked", selectedItem, selectedItem.node, singleSelectRect);
        });
    }
    
    function updateRubberBand(){
        if (selectedItem){
            var band = svg.select("#_internalRubberBand");
            var screen = getWindowPosition(selectedItem);
            band.attr("width", screen.width + 20);
            band.attr("height", screen.height + 20);
            band.attr("x", screen.x - 10);
            band.attr("y", screen.y - 10);
        }
    }
    
    Element.prototype.getWindowPosition = getWindowPosition;
    Element.prototype.convertToWindowPoints = convertToWindowPoints; 
    Element.prototype.updateRubberBand = updateRubberBand; 
}); 