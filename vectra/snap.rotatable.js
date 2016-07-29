
Snap.plugin( function( Snap, Element, Paper, global ) {
    Element.prototype.rotatable = function() {
        var svg  = this.paper;  
        svg.root.click(function (e){
            e.stopPropagation();
            if (svg.select("._internalRotatable") != null){
                svg.select("._internalRotatable").remove();
            }
        });
        
        
        this.click(function (e) {
            e.stopPropagation(); 
        });
    };
}); 