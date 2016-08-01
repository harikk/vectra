$(function () {
    var svg;

    function init() {
        svg = Snap("#drawingArea");
        svg.canvas();
        Snap.load("logo.svg", function (f) {
            svg.append(f);  
            svg.updateInnerCanvas();
            svg.selectable();
            var items = svg.selectAll("svg>svg>*");
            for (var i = 0; i < items.length; i++){
                switch(items[i].type){
                    case "text":{
                        items[i].text(); 
                    }
                    default: {
                        items[i].rotatable(); 
                    }
                } 
            }
        });
         
    }


    init();
}); 