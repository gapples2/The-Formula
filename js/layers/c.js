addLayer("c", {
    name: "C",
    symbol() { return player[this.layer].unlocked?("c = "+format(player[this.layer].value)):"C" },
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
        "blank",
        ["display-text", function() {return tmp.goals.unlocks>=5?tmp.c.cityDisplay:""}],
        "blank",
        "clickables",
        "blank",
        "buyables",
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

        player[this.layer].timeUntilBuilt = player[this.layer].timeUntilBuilt.minus(diff).max(0)
        if(player[this.layer].building&&player[this.layer].timeUntilBuilt.eq(0)){
            player[this.layer].building=false
            player[this.layer].cities=player[this.layer].cities.add(1)
        }

        player[this.layer].cities = player[this.layer].cities.min(tmp[this.layer].cityAmt)
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
    doReset(layer){
        if(layers[layer].row>layers[this.layer].row){
            keep=[]
            layerDataReset(this.layer,keep)
        }
    },
    cityAmt(){
        let a = player.a.value.add(1).log10()
        let b = player.b.value.add(1).log2()
        let c = player.c.value

        let total = a.times(b).times(c)

        return total.floor()
    },
    cityEffect(){
        let eff = new Decimal(1.5).pow(player[this.layer].cities)

        return eff
    },
    cityDisplayFormula(){
        let f = "1.5<sup>Cities</sup>"

        return f
    },
    cityBuildTime(){
        let base = new Decimal(1.5).pow(player[this.layer].cities).div(player[this.layer].value.times(player.d.value.add(1)).add(1))
        base=base.div(buyableEffect(this.layer, 11))

        return base
    },
    cityDisplay(){
        return `${formatWhole(player[this.layer].cities)}/${formatWhole(tmp[this.layer].cityAmt)} cities built<br>
        <br>
        city(${formatWhole(player[this.layer].cities)}) = ${format(tmp[this.layer].cityEffect)}<br>
        city(Cities) = ${tmp[this.layer].cityDisplayFormula}<br>
        <br>
        buildtime(${formatWhole(player[this.layer].cities)}) = ${format(tmp[this.layer].cityBuildTime)}<br>
        buildtime(Cities) = ${tmp[this.layer].cityBuildTimeDisplay}`
    },
    cityBuildTimeDisplay(){
        let f = "1.5<sup>Cities</sup> ÷ Builders ÷ (c "+(player.d.unlocked?"× (d + 1) ":"")+"+ 1)"

        return f
    },
    clickables: {
        11: {
            title: "Building",
            display() {return "Build cities to multiply n(t).\n\nStatus: "+(player[this.layer].building?"Building.\n\n"+formatTime(player[this.layer].timeUntilBuilt)+" until the city is built.":"Idle.")},
            onClick(){
                player[this.layer].building=true
                player[this.layer].timeUntilBuilt=tmp[this.layer].cityBuildTime
            },
            canClick(){
                return !player[this.layer].building&&player[this.layer].cities.lt(tmp[this.layer].cityAmt)
            },
            unlocked(){return tmp.goals.unlocks>=5}
        }
    },
    buyables: {
        rows: 2,
        cols: 2,
        11: {
            title() { return "Builders<br>×"+format(tmp[this.layer].buyables[this.id].effect) },
            effExp() {
                let exp = new Decimal(1);
                exp=exp.add(buyableEffect(this.layer, 12))
                return exp;
            },
            effect() { 
                let eff = player[this.layer].buyables[this.id].plus(1).add(buyableEffect(this.layer, 22)).pow(tmp[this.layer].buyables[this.id].effExp);
                return eff;
            },
            cost(x=player[this.layer].buyables[this.id]) { return Decimal.pow(1.2, x).times(10).ceil() },
            display() { return "Cost: "+formatWhole(tmp[this.layer].buyables[this.id].cost)+" Cities" },
            canAfford() { return player[this.layer].cities.gte(layers[this.layer].buyables[this.id].cost()) },
            buy() { 
                if(!hasMilestone("d", 0))player[this.layer].cities = player[this.layer].cities.sub(tmp[this.layer].buyables[this.id].cost).max(0)
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].plus(1);

                player[this.layer].timeUntilBuilt=new Decimal(0)
            },
            unlocked() { return hasAchievement("goals",42) },
        },
        12: {
            title() { return "Builders Exponent<br>+"+format(tmp[this.layer].buyables[this.id].effect) },
            effExp() {
                let exp = new Decimal(1);
                return exp;
            },
            effect() { 
                let eff = player[this.layer].buyables[this.id].add(buyableEffect(this.layer, 22)).pow(tmp[this.layer].buyables[this.id].effExp);
                return eff;
            },
            cost(x=player[this.layer].buyables[this.id]) { return Decimal.pow(1.5, x).times(15).ceil() },
            display() { return "Cost: "+formatWhole(tmp[this.layer].buyables[this.id].cost)+" Cities" },
            canAfford() { return player[this.layer].cities.gte(layers[this.layer].buyables[this.id].cost()) },
            buy() { 
                if(!hasMilestone("d", 0))player[this.layer].cities = player[this.layer].cities.sub(tmp[this.layer].buyables[this.id].cost).max(0)
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].plus(1);
                
                player[this.layer].timeUntilBuilt=new Decimal(0)
            },
            unlocked() { return hasAchievement("goals",42) },
        },
        21: {
            title() { return "Better b(B)<br>×"+format(tmp[this.layer].buyables[this.id].effect) },
            effExp() {
                let exp = new Decimal(2);
                return exp;
            },
            effect() { 
                let eff = tmp[this.layer].buyables[this.id].effExp.pow(player[this.layer].buyables[this.id].add(buyableEffect(this.layer, 22)))
                return eff;
            },
            cost(x=player[this.layer].buyables[this.id]) { return Decimal.pow(2, x).times(20).ceil() },
            display() { return "Cost: "+formatWhole(tmp[this.layer].buyables[this.id].cost)+" Cities" },
            canAfford() { return player[this.layer].cities.gte(layers[this.layer].buyables[this.id].cost()) },
            buy() { 
                if(!hasMilestone("d", 0))player[this.layer].cities = player[this.layer].cities.sub(tmp[this.layer].buyables[this.id].cost).max(0)
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].plus(1);

                player[this.layer].timeUntilBuilt=new Decimal(0)
            },
            unlocked() { return hasAchievement("goals",42) },
        },
        22: {
            title() { return "Free Levels<br>+"+format(tmp[this.layer].buyables[this.id].effect) },
            effExp() {
                let exp = new Decimal(1);
                return exp;
            },
            effect() { 
                let eff = player[this.layer].buyables[this.id].add(1).log2().pow(tmp[this.layer].buyables[this.id].effExp)
                return eff;
            },
            cost(x=player[this.layer].buyables[this.id]) { return Decimal.pow(10, x).times(25).ceil() },
            display() { return "Cost: "+formatWhole(tmp[this.layer].buyables[this.id].cost)+" Cities" },
            canAfford() { return player[this.layer].cities.gte(layers[this.layer].buyables[this.id].cost()) },
            buy() { 
                if(!hasMilestone("d", 0))player[this.layer].cities = player[this.layer].cities.sub(tmp[this.layer].buyables[this.id].cost).max(0)
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].plus(1);
                
                player[this.layer].timeUntilBuilt=new Decimal(0)
            },
            unlocked() { return hasAchievement("goals",42) },
        },  
    },
})