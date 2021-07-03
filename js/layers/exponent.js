addLayer("ex", {
    name: "^",
    symbol() { return player[this.layer].unlocked?("exp = "+format(player[this.layer].value)):"exp" },
    position: 0,
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        value: new Decimal(0),
        nextAt: {"a":4},
    }},
    nodeStyle: { "min-width": "60px", height: "60px", "font-size": "30px", "padding-left": "15px", "padding-right": "15px" },
    color: "#f8a9ba",
    resource: "Exponent-Power", 
    baseResource: "n", 
    baseAmount() {return player.value}, 
    type: "custom",
    tooltipLocked() { return "" },
    canReset() { return tmp[this.layer].getResetGain.gte(1) },
    getResetGain() {
        let nextAt = player[this.layer].nextAt
        let keys = Object.keys(nextAt)
        let amt = 1
        keys.forEach(key=>{
            if(player[key].value.lt(nextAt[key]))amt=0
        })

        return new Decimal(amt)
    },
    getNextAt() {
        const a = [2,4.5,9,18,Infinity]
        const b = [false,false,false,1.25,Infinity]
        const num = player[this.layer].points
        
        var obj = {"a":a[num]}
        if(b[num])obj["b"]=b[num]
        player[this.layer].nextAt=obj
        return Infinity
    },
    prestigeButtonText() {
        let text = "Reset for "+"<b>"+formatWhole(tmp[this.layer].resetGain)+"</b> Exponent-Power<br><br>";
        text += "Req: a(A) ≥ "+format(player[this.layer].nextAt["a"])+(player[this.layer].nextAt["b"]?" and b(B) ≥ "+format(player[this.layer].nextAt["b"]):"")
        return text;
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "^", description: "^: Reset for Exponent-Power", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    displayFormula() {
        let f = "e × (-0.05) + 0.5";
        
        return f;
    },
    calculateValue(val=player[this.layer].points) {
        val=val.times(-0.05).add(0.5)

        return val;
    },
    update(diff) {
        player[this.layer].value = tmp[this.layer].calculateValue
    },
    timespeedBoost(){
        return player.re.value.minus(player.ex.value).add(1).pow(10).pow(2)
    },
    tabFormat: [
        "main-display",
        "prestige-button",
        "blank",
        ["display-text", function() { return "<h3>exp("+formatWhole(player[this.layer].points)+") = "+format(player[this.layer].value)+"</h3>" }],
        ["display-text", function() { return "exp(e) = "+tmp[this.layer].displayFormula }],
        "blank",
        ["display-text", function() { return "<h3>timespeed("+formatWhole(player[this.layer].points)+") = "+format(tmp[this.layer].timespeedBoost)+"</h3>" }],
        ["display-text", function() { return "timespeed(e) = "+displayOtherFormula() }],
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
    branches: ["a"],
})
