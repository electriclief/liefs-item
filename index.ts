import {liefsError, TypeOf, CheckArgTypes, throwType, isStart, argsObj, isUniqueSelector} from "liefs-lib";
import {Coord} from "liefs-coordinates";
import {Container} from "liefs-container";

declare var jasmineTests: boolean;

export class Item {
    static get(label: string, instance = 0) {
        if (label in Item.items) return Item.items[label][instance];
        return undefined;
    }
    static h(...Arguments: any[]) {
        Arguments.push("hor");
        return I(...Arguments);
    }
    static v(...Arguments: any[]) {
        Arguments.push("ver");
        return I(...Arguments);
    }
    static I(...Arguments: any[]): Item {
        let newItem: Item;
        let myArgsObj = argsObj(arguments);
        let Ilabel: string, Istart: string, Imin: string, Imax: string, Imargin: number;
        let Iitems: Array<Item>, Icontainer: Container, IisHor: boolean;
        let isItem: string;
        let IpageTitle: string;
        if ("array_Item" in myArgsObj) {
            if (!("Item" in myArgsObj)) myArgsObj.Item = [];
            for (let eachArray of myArgsObj["array_Item"])
                for (let eachItem of eachArray)
                    myArgsObj.Item.push(eachItem);
        }
        if ("number" in myArgsObj) Imargin = myArgsObj.number[0];
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
                    if (!myArgsObj["item"]) myArgsObj["item"] = [];
                    myArgsObj["item"].push(items[isItem]);
                }
            }
        }
        if ("start" in myArgsObj) {
            Istart = myArgsObj.start[0];
            if (myArgsObj.start.length > 1) Imin = myArgsObj.start[1];
            if (myArgsObj.start.length > 2) Imax = myArgsObj.start[2];
            if (myArgsObj.start.length > 3)
                liefsError.badArgs("Start, Min, Max", "That, and more!", "Create Instance Of Item() " + JSON.stringify(myArgsObj.start.slice(3)));
        }
        if ("Item" in myArgsObj) { Iitems = myArgsObj.Item; }
        if ("Container" in myArgsObj) Icontainer = myArgsObj.container[0];
        ///// ok now create
        if (!Ilabel) Ilabel = "item" + (Object.keys(Item.items).length / 1000).toFixed(3).slice(-3);
        if (!Istart) Istart = "0px"; // liefsError.badArgs("A Start Value", "none", "I() - " + Ilabel);

        if (Iitems && Icontainer) liefsError.badArgs("items, or a container.", "received both", "Create Instance Of Item() " + Ilabel);
        if (Iitems) {
            if (IisHor === undefined) {
                newItem = new Item(Ilabel, Istart, Imin, Imax);
                newItem.pages = Iitems;
                newItem.pages.unshift(newItem);
                return newItem;
            }
            else
                Icontainer = new Container(Ilabel, IisHor, Iitems, Imargin);
        }
        newItem = new Item(Ilabel, Istart, Imin, Imax, Icontainer);
        if (IpageTitle) newItem.pageTitle = IpageTitle;
        return newItem;
    }

    static debug = true;
    static items: { [index: string]: Array<Item>; } = {};

    label: string;
    instance: number;
    start: string;
    current: string;
    lastDirection: boolean;
    size: Coord; // = new Coord();
    min: string;
    max: string;
    container: Container;
    pages: Array<Item>;
    pageTitle: string;
    currentPage: number;
    el: Element;
    selector = () => { return "#" + this.label; };

    constructor(label: string, start: string, min: string = undefined, max: string = undefined, container: Container = undefined) {
        this.label = label;
        this.start = this.current = start;
        if (min) this.min = min;
        if (max) this.max = max;
        if (container) this.container = container;

        if (!(label in Item.items)) Item.items[label] = [];
        this.instance = Item.items[label].length;
        Item.items[label].push(this);

        if (typeof Handler === "function") Handler.activate();

        if (this.start === "0px") Container.suspectedRoot = this.container;

        if (isUniqueSelector(this.selector())) this.el = document.querySelectorAll(this.selector())[0];
        else if ((!this.container) && !("jasmineTests" in window))
          liefsError.badArgs("Selector Search for '" + this.label + "' to find ONE matching div",
          "Matched " + document.querySelectorAll(this.selector()).length.toString() + " times", "Handler Item Check");
      }

}

export let I = Item.I;
export let v = Item.v;
export let h = Item.h;
export let items = Item.items;
export let getItem = Item.get;
