addLayer("C", {
    name: "Computer Chips", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "C", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#4BDC13",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "Computer Chips", // Name of prestige currency
    baseResource: "Points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade('C', 13)) mult = mult.times(upgradeEffect('C', 13))
        if (hasUpgrade('F', 11)) mult = mult.times(upgradeEffect('F', 11))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "C", description: "C: Reset for Computer Chips", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    upgrades: {
        11: {
            title: "Production Start",
            description: "Get 1 more point per second",
            cost: new Decimal(5),
            effect() {               
                let effect = new Decimal(1)
                if (hasUpgrade('C', 22)) effect = effect.times(upgradeEffect('C', 22))
                return effect
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id)) },
        },
        12: {
            title: "Computer Points",
            description: "Computer Chips boost points",
            cost: new Decimal(10),
            effect() {
                let effect = player[this.layer].points.add(1).pow(0.5)
                if (hasUpgrade('C', 23)) effect = effect.times(upgradeEffect('C', 23))
                return effect
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
        },
        13: {
            title: "Point Chips",
            description: "Points Boost Computer Chips gain",
            cost: new Decimal(25),
            effect() {
                let effect = player.points.add(1).pow(0.15)
                if (hasUpgrade('C', 23)) effect = effect.times(upgradeEffect('C', 23))
                return effect
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        21: {
            title: "Point Factory",
            description: "Points boost Factory points",
            cost: new Decimal(500),
            unlocked() { return hasUpgrade('F', 12)},
            effect() {
                return player.points.add(1).pow(0.05)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        22: {
            title: "Production Start Squared",
            description: "Production Start is now based on points",
            cost: new Decimal(750),
            unlocked() { return hasUpgrade('F', 12)},
            effect() {
                return player.points.add(1).pow(0.03)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        23: {
            title: "Boosting old",
            description: "Boost the 2nd and 3rd upgrade in 1st row",
            cost: new Decimal(2000),
            unlocked() { return hasUpgrade('F', 12)},
            effect() {
                return player.points.add(1).pow(0.10)
            }
        },
    },
    buyables: {
        11: {
            cost(x) { return new Decimal(10000).mul(x) },
            unlocked() { return hasUpgrade('F', 13)},
            title() { return "Pointing boosting"},
            display() { return "Points are boosted by 2 <br>" + "Cost: " + player[this.layer].cost +"<br>Amount: " + player[layer].buyables[id] },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
    },
},
})

addLayer("F", {
    name: "Factory", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "F", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
		ComputerChips: new Decimal(0),
    }},
    color: "#964B00",
    requires: new Decimal(100), // Can be a function that takes requirement increases into account
    resource: "Factory points", // Name of prestige currency
    baseResource: "Computer Chips", // Name of resource prestige is based on
    baseAmount() {return player.C.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade('C', 21)) mult = mult.times(upgradeEffect('C', 21))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "F", description: "F: Reset for Factory", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    upgrades: {
        11: {
            title: "Factory Production",
            description: "Computer Chips are boosted by Factory points",
            cost: new Decimal(5),
            effect() {
                return player.F.points.add(1).pow(0.5)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        12: {
            title: "Factory presents",
            description: "Unlock 1 row of Computer Chip upgrades",
            cost: new Decimal(10),
        },
        13: {
            title: "Computer Buyable",
            description: "Unlock a buyable in Computer Chips",
            cost: new Decimal(25),
            unlocked() { return hasUpgrade('F', 12)}
        },
    },
})