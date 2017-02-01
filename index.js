"use strict";
const liefs_lib_1 = require("liefs-lib");
const liefs_container_1 = require("liefs-container");
class Item {
    constructor(label, start, min = undefined, max = undefined, container = undefined) {
        this.selector = () => { return "#" + this.label; };
        this.label = label;
        this.start = this.current = start;
        if (min)
            this.min = min;
        if (max)
            this.max = max;
        if (container)
            this.container = container;
        if (!(label in Item.items))
            Item.items[label] = [];
        this.instance = Item.items[label].length;
        Item.items[label].push(this);
        if (typeof Handler === "function")
            Handler.activate();
        if (this.start === "0px")
            liefs_container_1.Container.suspectedRoot = this.container;
        if (!isUniqueSelector(this.selector()) && (!this.container) && !("jasmineTests" in window))
            liefs_lib_1.liefsError.badArgs("Selector Search for '" + this.label + "' to find ONE matching div", "Matched " + document.querySelectorAll(this.selector()).length.toString() + " times", "Handler Item Check");
    }
    static get(label, instance = 0) {
        if (label in Item.items)
            return Item.items[label][instance];
        return undefined;
    }
    static h(...Arguments) {
        Arguments.push("hor");
        return exports.I(...Arguments);
    }
    static v(...Arguments) {
        Arguments.push("ver");
        return exports.I(...Arguments);
    }
    static I(...Arguments) {
        let newItem;
        let myArgsObj = liefs_lib_1.argsObj(arguments);
        let Ilabel, Istart, Imin, Imax, Imargin;
        let Iitems, Icontainer, IisHor;
        let isItem;
        let IpageTitle;
        if ("array_Item" in myArgsObj) {
            if (!("Item" in myArgsObj))
                myArgsObj.Item = [];
            for (let eachArray of myArgsObj["array_Item"])
                for (let eachItem of eachArray)
                    myArgsObj.Item.push(eachItem);
        }
        if ("number" in myArgsObj)
            Imargin = myArgsObj.number[0];
        if ("string" in myArgsObj) {
            for (let i = 0; i < myArgsObj.string.length; i++) {
                isItem = myArgsObj.string[i];
                if (isItem[0] === "-" || isItem[0] === "|") {
                    IisHor = (isItem[0] === "-");
                    myArgsObj.string[i] = isItem.slice(1);
                }
                if (isItem.slice(-1) === "-" || isItem.slice(-1) === "|") {
                    IisHor = (isItem.slice(-1) === "-");
                    myArgsObj.string[i] = isItem.slice(0, -1);
                }
                if (isItem.slice(0, 3) === "hor" || isItem.slice(0, 3) === "ver")
                    IisHor = (isItem.slice(0, 3) === "hor");
                else if (!(Ilabel))
                    Ilabel = myArgsObj.string[i];
                else if (!(IpageTitle))
                    IpageTitle = myArgsObj.string[i];
                if (isItem in Item.items) {
                    if (!myArgsObj["item"])
                        myArgsObj["item"] = [];
                    myArgsObj["item"].push(exports.items[isItem]);
                }
            }
        }
        if ("start" in myArgsObj) {
            Istart = myArgsObj.start[0];
            if (myArgsObj.start.length > 1)
                Imin = myArgsObj.start[1];
            if (myArgsObj.start.length > 2)
                Imax = myArgsObj.start[2];
            if (myArgsObj.start.length > 3)
                liefs_lib_1.liefsError.badArgs("Start, Min, Max", "That, and more!", "Create Instance Of Item() " + JSON.stringify(myArgsObj.start.slice(3)));
        }
        if ("Item" in myArgsObj) {
            Iitems = myArgsObj.Item;
        }
        if ("Container" in myArgsObj)
            Icontainer = myArgsObj.container[0];
        if (!Ilabel)
            Ilabel = "item" + (Object.keys(Item.items).length / 1000).toFixed(3).slice(-3);
        if (!Istart)
            Istart = "0px";
        if (Iitems && Icontainer)
            liefs_lib_1.liefsError.badArgs("items, or a container.", "received both", "Create Instance Of Item() " + Ilabel);
        if (Iitems) {
            if (IisHor === undefined) {
                newItem = new Item(Ilabel, Istart, Imin, Imax);
                newItem.pages = Iitems;
                newItem.pages.unshift(newItem);
                return newItem;
            }
            else
                Icontainer = new liefs_container_1.Container(Ilabel, IisHor, Iitems, Imargin);
        }
        newItem = new Item(Ilabel, Istart, Imin, Imax, Icontainer);
        if (IpageTitle)
            newItem.pageTitle = IpageTitle;
        return newItem;
    }
}
Item.debug = true;
Item.items = {};
exports.Item = Item;
exports.I = Item.I;
exports.v = Item.v;
exports.h = Item.h;
exports.items = Item.items;
exports.getItem = Item.get;
//# sourceMappingURL=index.js.map