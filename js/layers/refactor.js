addLayer("re", {
    name: "refactor",
    symbol() { return player[this.layer].unlocked?("r = "+format(player[this.layer].value)):"r" },
    position: 0,
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        value: new Decimal(0),
    }},
    nodeStyle: { "min-width": "60px", height: "60px", "font-size": "30px", "padding-left": "15px", "padding-right": "15px" },
    color: "#f8a9ba",
    resource: "Refactored Timespeed", 
    baseResource: "n", 
    baseAmount() {return player.value}, 
    type: "custom",
    tooltipLocked() { return "" },
    canReset() { return tmp[this.layer].getResetGain.gte(0.2) && tmp.goals.achsCompleted>=10 },
    getResetGain() {
        return new Decimal(0.5).minus(player.ex.value)
    },
    getNextAt() {
        return Infinity
    },
    prestigeButtonText() {
        let text = "Reset for "+"<b>"+format(tmp[this.layer].resetGain,2)+"</b> Refactored Timespeed<br><br>";
        text += "Req: exp(e) ≤ 0.3 and goals completed ≥ 10"
        return text;
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "r", description: "r: Refactor", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return tmp.goals.unlocks>=3},
    displayFormula() {
        let f = "R ÷ 2 + 0.5";
        
        return f;
    },
    calculateValue(val=player[this.layer].points) {
        val=val.div(2).add(0.5)

        if(val.gt(1))val=val.sqrt()

        return val
    },
    update(diff) {
        player[this.layer].value = tmp[this.layer].calculateValue
    },
    tabFormat: [
        "main-display",
        "prestige-button",
        "blank",
        ["display-text", function() { return "<h3>r("+formatWhole(player[this.layer].points)+") = "+format(player[this.layer].value)+"</h3>" }],
        ["display-text", function() { return "r(R) = "+tmp[this.layer].displayFormula }],
        "blank",
        "milestones"
    ],
    componentStyles: {
        buyable: {
            width: "140px",
            height: "100px",
            "border-radius": "5%",
            "z-index": "1",
        },
        bar: {
            "z-index": "0",
        },
    },
    branches: ["ex"],
    milestones: {
        0: {
            requirementDescription: "r ≥ 0.7",
            effectDescription: "Keep the first row of achievements on reset.",
            done() { return player[this.layer].value.gte(0.7) },
            onComplete(){player.goals.achievements=[11,12,13,14,15,16]}
        },
        1: {
            requirementDescription: "r ≥ 1",
            effectDescription: "Keep B-Power on exponent reset.",
            done() { return player[this.layer].value.gte(1) },
            unlocked(){return hasMilestone(this.layer, 0)}
        },
        2: {
            requirementDescription: "r ≥ 1.25",
            effectDescription: "Keep Avolve on exponent reset.",
            done() { return player[this.layer].value.gte(1.25) },
            unlocked(){return hasMilestone(this.layer, 1)}
        },
        3: {
            requirementDescription: "r ≥ 1.5",
            effectDescription: "Unlock c.",
            done() { return player[this.layer].value.gte(1.5) },
            unlocked(){return hasMilestone(this.layer, 2)}
        },
    },
    doReset(layer){
        if(layer=="re"){
            let keep = []
            layerDataReset("ex")
            layerDataReset("a")
            layerDataReset("b")
        }
    }
})
