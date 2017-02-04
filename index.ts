import {liefsError, TypeOf, CheckArgTypes, throwType, isStart, argsObj, isUniqueSelector, onEvent} from "liefs-lib";
import {Coord} from "liefs-coordinates";
import {Container} from "liefs-container";

declare var jasmineTests: boolean;

export class Dragbar {
  static mouseDown (e: Event) {
    console.log("MouseDown");
  }
  static mouseUp (e: Event) {
    console.log("MouseUp");
  }
  static noInit: boolean = true;
  Selector = () => { return this.parent.selector() + " > ." + (this.parent.lastDirection ? "H" : "V") + "dragbar"; };
  el: Element;
  size: Coord = new Coord();
  front: boolean = true;
  parent: Item;
  width: number;
  constructor(item: Item, front: boolean = true, width = undefined) {
    this.parent = item;
    this.front = front;
    if (document.querySelectorAll(this.Selector()).length)
        this.el = document.querySelectorAll(this.Selector())[0];
    else {
        this.el = document.createElement("div");
        this.el.className = "Hdragbar"; // gets updated anyways - this is just a reminder
        if (this.parent.el.firstChild) this.parent.el.insertBefore(this.el, this.parent.el.firstChild);
        else this.parent.el.appendChild(this.el);
    }

    if (Dragbar.noInit) { onEvent(document.body, "mouseup", Dragbar.mouseUp); Dragbar.noInit = false; }
    onEvent(this.el, "mousedown", Dragbar.mouseDown);

    this.width = width || Container.of(item).margin || Container.marginDefault;
  }
  update() {
    console.log("Dragbar Update Called()");
    for (let eachKey of Object.keys(this.size)) this.size[eachKey] = this.parent.size[eachKey];
    if (Container.of(this.parent).direction) {
      this.size.x += this.parent.size.width;
      this.size.width = this.width;
    } else {
      this.size.y += this.parent.size.height;
      this.size.height = this.width;
    }
//  }
//  set() {
    directiveSetStyles(this.el, {
      left: px(this.size.x), top: px(this.size.y), width: px(this.size.width), height: px(this.size.height)
    });
  }
}

export class Item {
    static get(label: string, instance = 0): Item {
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
        let dragFront: boolean = true;
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
                if (isItem[0] === "*") {
                    myArgsObj.string[i] = isItem.slice(1);
                    dragFront = false;
                }
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
                newItem.currentPage = 0;
                return newItem;
            }
            else
                Icontainer = new Container(Ilabel, IisHor, Iitems, Imargin);
        }
        newItem = new Item(Ilabel, Istart, Imin, Imax, Icontainer);
        if (IpageTitle) newItem.pageTitle = IpageTitle;
        if (!dragFront) newItem.dragBar.front = dragFront;
        return newItem;
    }
    static nextPage(item_: Item | string, stop: boolean = false) {
        let item: Item = Item.parseItem(item_);
        if (item.currentPage + 1 < item.pages.length) Item.setPage(item, item.currentPage + 1);
        else if (!stop) Item.setPage(item, 0);
    }
    static backPage(item_: Item | string, stop: boolean = false) {
        let item: Item = Item.parseItem(item_);
        if (item.currentPage > 0) Item.setPage(item, item.currentPage - 1);
        else if (!stop) Item.setPage(item, item.pages.length - 1);
    }
    static setPage(item_: Item | string, value: string | number) {
        Item.parseValue(value, Item.parseItem(item_));
        Handler.resizeEvent();
    }
    static parseValue(value_: string | number, item: Item) {
        let foundPage: boolean = false;
        if (TypeOf(value_, "string")) {
            for (let i = 0; i < item.pages.length; i++)
                if (item.pages[i].label === <string>value_) {
                    item.currentPage = i;
                    foundPage = true;
                    break;
                }
            if (!foundPage) liefsError.badArgs("page id not found", <string>value_, "Item setPage");
        }
        else {
            if (item.pages.length - 1 < <number>value_) liefsError.badArgs("Max Pages for " + item.label + " is " + item.pages.length, (<number>value_).toString(), "Item setPage");
            item.currentPage = <number>value_;
        }
    }
    static parseItem(item_: Item | string): Item {
        let item: Item;
        if (TypeOf(item_, "string")) {
            if (!isItIn(<string>item_, Item.items)) liefsError.badArgs("Item Name Not Identified", <string>item_, "Item - setPage()");
            item = Item.items[<string>item_][0];
        }
        else item = <Item>item_;
        if (!item.pages) liefsError.badArgs("Item " + item.label + " to be defined with pages", "it wasn't", "Item - setPage()");
        return item;
    }
    static page(item: Item): Item { return (item.pages) ? item.pages[item.currentPage] : item; }
    static debug = true;
    static items: { [index: string]: Array<Item>; } = {};

    label: string;
    instance: number;
    start: string;
    current: string;
    lastDirection: boolean = true;
    size: Coord;
    min: string;
    max: string;
    container: Container;
    pages: Array<Item>;
    pageTitle: string;  //////// this will be leaving
    currentPage: number;
    el: Element;
    selector = () => { return "#" + this.label; };
    dragBar: Dragbar;
//    dragSelector = () => { return this.selector() + " > ." + (this.lastDirection ? "H" : "V") + "dragbar"; };
//    dragEl: Element;
//    dragbar: Coord;
//    dragFront: boolean = true;

    constructor(label: string, start: string, min: string = undefined, max: string = undefined, container: Container = undefined) {
        let el: any;
        this.label = label;
        this.start = start;
        if (min) this.min = min;
        if (max) this.max = max;
        if (container) this.container = container;

        if (!(label in Item.items)) Item.items[label] = [];
        this.instance = Item.items[label].length;
        Item.items[label].push(this);

        if (typeof Handler === "function") Handler.activate();

        if (this.start === "0px") Container.suspectedRoot = this.container;

        if (isUniqueSelector(this.selector())) {
            this.el = document.querySelectorAll(this.selector())[0];
            this.el["style"]["position"] = "fixed";

            if (min || max) setTimeout(() => {this.dragBar = new Dragbar(this); }, 0);

        }
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
