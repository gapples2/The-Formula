addLayer("d", {
    name: "D",
    symbol() { return player[this.layer].unlocked?("d = "+format(player[this.layer].value)):"D" },
    position: 2,
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        value: new Decimal(0),
        cities: new Decimal(0),
        timeUntilBuilt: new Decimal(0),
        building: false
    }},
    nodeStyle: { "min-width": "60px", height: "60px", "font-size": "30px", "padding-left": "15px", "padding-right": "15px" },
    color: "#ffff55",
    resource: "D-Power", 
    baseResource: "c(C)", 
    baseAmount() {return player.c.value}, 
    type: "normal",
    requires() { return new Decimal(5) },
    reqDiv() { 
        let div = new Decimal(1);
        return div;
    },
    base() {
        let base = new Decimal(5);
        return base;
    },
    exponent: new Decimal(1.25),
    canBuyMax() { return true },
    autoPrestige() { return false },
    resetsNothing() { return false },
    tooltipLocked() { return "Req: c(C) ≥ "+formatWhole(tmp[this.layer].requires) },
    prestigeButtonText() {
        let text = "Reset for <b>"+formatWhole(tmp[this.layer].resetGain)+"</b> D-Power<br><br>";
        if (tmp[this.layer].canBuyMax) text += "Next: c(C) ≥ "+format(tmp[this.layer].nextAt)
        else text += "Req: c(C) ≥ "+format(tmp[this.layer].getNextAt)
        text += "<br>Req Base: "+format(tmp[this.layer].base)
        text += "<br>Req Exponent: "+format(tmp[this.layer].exponent)
        return text;
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "d", description: "D: Reset for D-Power", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown() { return tmp.goals.unlocks>=6 },
    tabFormat: [
        "main-display",
        "prestige-button",
        "blank",
        ["display-text", function() { return "<h3>d("+formatWhole(player[this.layer].points)+") = "+format(player[this.layer].value)+"</h3>" }],
        ["display-text", function() { return "d(D) = "+tmp[this.layer].displayFormula }],
        "blank",
        "milestones",
    ],
    addedValue() {
        let added = new Decimal(0);
        return added;
    },
    displayFormula() {
        let f = "D";
        if (tmp[this.layer].addedValue.gt(0)) f += " + "+format(tmp[this.layer].addedValue)
        return "("+f+")<sup>exp</sup>";
    },
    calculateValue(D=player[this.layer].points) {
        let val = D;
        if (tmp[this.layer].addedValue.gt(0)) val = val.plus(tmp[this.layer].addedValue);
        return val.pow(player.ex.value);
    },
    update(diff) {
        player[this.layer].value = tmp[this.layer].calculateValue
    },
    componentStyles: {
        buyable: {
            width: "120px",
            "min-width": "120px",
            height: "120px",
            "border-radius": "5%",
        },
        clickable: {
            width: "140px",
            height: "100px",
            "border-radius": "5%",
            "z-index": "1",
        }
    },
    branches: ["c"],
    doReset(layer){
        if(layers[layer].row>layers[this.layer].row){
            keep=[]
            layerDataReset(this.layer,keep)
        }
    },
    milestones: {
        0: {
            requirementDescription: "d(D) ≥ 1.3",
            effectDescription: "City buyables don't remove cities.",
            done() { return player.d.value.gte(1.3) }
        },
    }
})