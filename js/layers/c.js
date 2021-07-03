addLayer("c", {
    name: "C",
    symbol() { return player[this.layer].unlocked?("c = "+format(player[this.layer].value)):"C" },
    position: 2,
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        value: new Decimal(0),
    }},
    nodeStyle: { "min-width": "60px", height: "60px", "font-size": "30px", "padding-left": "15px", "padding-right": "15px" },
    color: "#55ff55",
    resource: "C-Power", 
    baseResource: "n", 
    baseAmount() {return player.value}, 
    type: "custom",
    requires() { return new Decimal(1e15) },
    reqDiv() { 
        let div = new Decimal(1);
        return div;
    },
    base() {
        let base = new Decimal(400);
        return base;
    },
    exponent: new Decimal(1.25),
    canBuyMax() { return false },
    autoPrestige() { return false },
    resetsNothing() { return false },
    tooltipLocked() { return "Req: n(t) ≥ "+formatWhole(tmp[this.layer].requires) },
    canReset() { return tmp[this.layer].getResetGain.gte(1) },
    getResetGain() { 
        let gain = tmp[this.layer].baseAmount.times(tmp[this.layer].reqDiv).div(tmp[this.layer].requires).max(1).log(tmp[this.layer].base).root(tmp[this.layer].exponent).plus(1).floor().sub(player[this.layer].points).max(0)
        if (!tmp[this.layer].canBuyMax) gain = gain.min(1);
        if (tmp[this.layer].baseAmount.times(tmp[this.layer].reqDiv).lt(tmp[this.layer].requires)) return new Decimal(0);
        return gain;
    },
    getNextAt(canBuyMax=false) {
        let amt = player[this.layer].points.plus((canBuyMax&&tmp[this.layer].baseAmount.gte(tmp[this.layer].nextAt))?tmp[this.layer].getResetGain:0)
        return Decimal.pow(tmp[this.layer].base, amt.pow(tmp[this.layer].exponent)).times(tmp[this.layer].requires).div(tmp[this.layer].reqDiv)
    },
    prestigeButtonText() {
        let text = "Reset for <b>"+formatWhole(tmp[this.layer].resetGain)+"</b> C-Power<br><br>";
        if (tmp[this.layer].canBuyMax) text += "Next: n(t) ≥ "+format(tmp[this.layer].nextAtDisp)
        else text += "Req: n(t) ≥ "+format(tmp[this.layer].getNextAt)
        text += "<br>Req Base: "+format(tmp[this.layer].base)
        text += "<br>Req Exponent: "+format(tmp[this.layer].exponent)
        return text;
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "c", description: "C: Reset for C-Power", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown() { return hasMilestone("re",3) },
    tabFormat: [
        "main-display",
        "prestige-button",
        "blank",
        ["display-text", function() { return "<h3>c("+formatWhole(player[this.layer].points)+") = "+format(player[this.layer].value)+"</h3>" }],
        ["display-text", function() { return "c(C) = "+tmp[this.layer].displayFormula }],
    ],
    addedValue() {
        let added = new Decimal(0);
        return added;
    },
    displayFormula() {
        let f = "C";
        if (tmp[this.layer].addedValue.gt(0)) f += " + "+format(tmp[this.layer].addedValue)
        return "("+f+")<sup>exp</sup>";
    },
    calculateValue(C=player[this.layer].points) {
        let val = C;
        if (tmp[this.layer].addedValue.gt(0)) val = val.plus(tmp[this.layer].addedValue);
        return val.pow(player.ex.value);
    },
    update(diff) {
        player[this.layer].value = tmp[this.layer].calculateValue
    },
    componentStyles: {
        gridable: {
            width: "120px",
            "min-width": "120px",
            height: "120px",
            "border-radius": "5%",
        },
    },
    branches: ["ex"],
    doReset(layer){
        if(layers[layer].row>layers[this.layer].row){
            keep=[]
            layerDataReset(this.layer,keep)
        }
    }
})