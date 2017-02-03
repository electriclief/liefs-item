"use strict";
var liefs_lib_1 = require("liefs-lib");
var liefs_container_1 = require("liefs-container");
var Item = (function () {
    function Item(label, start, min, max, container) {
        if (min === void 0) { min = undefined; }
        if (max === void 0) { max = undefined; }
        if (container === void 0) { container = undefined; }
        var _this = this;
        this.selector = function () { return "#" + _this.label; };
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
        if (liefs_lib_1.isUniqueSelector(this.selector())) {
            this.el = document.querySelectorAll(this.selector())[0];
            this.el["style"]["position"] = "fixed";
        }
        else if ((!this.container) && !("jasmineTests" in window))
            liefs_lib_1.liefsError.badArgs("Selector Search for '" + this.label + "' to find ONE matching div", "Matched " + document.querySelectorAll(this.selector()).length.toString() + " times", "Handler Item Check");
    }
    Item.get = function (label, instance) {
        if (instance === void 0) { instance = 0; }
        if (label in Item.items)
            return Item.items[label][instance];
        return undefined;
    };
    Item.h = function () {
        var Arguments = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            Arguments[_i] = arguments[_i];
        }
        Arguments.push("hor");
        return exports.I.apply(void 0, Arguments);
    };
    Item.v = function () {
        var Arguments = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            Arguments[_i] = arguments[_i];
        }
        Arguments.push("ver");
        return exports.I.apply(void 0, Arguments);
    };
    Item.I = function () {
        var Arguments = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            Arguments[_i] = arguments[_i];
        }
        var newItem;
        var myArgsObj = liefs_lib_1.argsObj(arguments);
        var Ilabel, Istart, Imin, Imax, Imargin;
        var Iitems, Icontainer, IisHor;
        var isItem;
        var IpageTitle;
        if ("array_Item" in myArgsObj) {
            if (!("Item" in myArgsObj))
                myArgsObj.Item = [];
            for (var _a = 0, _b = myArgsObj["array_Item"]; _a < _b.length; _a++) {
                var eachArray = _b[_a];
                for (var _c = 0, eachArray_1 = eachArray; _c < eachArray_1.length; _c++) {
                    var eachItem = eachArray_1[_c];
                    myArgsObj.Item.push(eachItem);
                }
            }
        }
        if ("number" in myArgsObj)
            Imargin = myArgsObj.number[0];
        if ("string" in myArgsObj) {
            for (var i = 0; i < myArgsObj.string.length; i++) {
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
        ///// ok now create
        if (!Ilabel)
            Ilabel = "item" + (Object.keys(Item.items).length / 1000).toFixed(3).slice(-3);
        if (!Istart)
            Istart = "0px"; // liefsError.badArgs("A Start Value", "none", "I() - " + Ilabel);
        if (Iitems && Icontainer)
            liefs_lib_1.liefsError.badArgs("items, or a container.", "received both", "Create Instance Of Item() " + Ilabel);
        if (Iitems) {
            if (IisHor === undefined) {
                newItem = new Item(Ilabel, Istart, Imin, Imax);
                newItem.pages = Iitems;
                newItem.pages.unshift(newItem);
                newItem.currentPage = 0;
                return newItem;
            }
            else
                Icontainer = new liefs_container_1.Container(Ilabel, IisHor, Iitems, Imargin);
        }
        newItem = new Item(Ilabel, Istart, Imin, Imax, Icontainer);
        if (IpageTitle)
            newItem.pageTitle = IpageTitle;
        return newItem;
    };
    Item.nextPage = function (item_, stop) {
        if (stop === void 0) { stop = false; }
        var item = Item.parseItem(item_);
        if (item.currentPage + 1 < item.pages.length)
            Item.setPage(item, item.currentPage + 1);
        else if (!stop)
            Item.setPage(item, 0);
    };
    Item.backPage = function (item_, stop) {
        if (stop === void 0) { stop = false; }
        var item = Item.parseItem(item_);
        if (item.currentPage > 0)
            Item.setPage(item, item.currentPage - 1);
        else if (!stop)
            Item.setPage(item, item.pages.length - 1);
    };
    Item.setPage = function (item_, value) {
        Item.parseValue(value, Item.parseItem(item_));
        Handler.resizeEvent();
    };
    Item.parseValue = function (value_, item) {
        var foundPage = false;
        if (liefs_lib_1.TypeOf(value_, "string")) {
            for (var i = 0; i < item.pages.length; i++)
                if (item.pages[i].label === value_) {
                    item.currentPage = i;
                    foundPage = true;
                    break;
                }
            if (!foundPage)
                liefs_lib_1.liefsError.badArgs("page id not found", value_, "Item setPage");
        }
        else {
            if (item.pages.length - 1 > value_)
                liefs_lib_1.liefsError.badArgs("Max Pages for " + item.label + " is " + item.pages.length, value_.toString(), "Item setPage");
            item.currentPage = value_;
        }
    };
    Item.parseItem = function (item_) {
        var item;
        if (liefs_lib_1.TypeOf(item_, "string")) {
            if (!(item_ in Object.keys(Item.items)))
                liefs_lib_1.liefsError.badArgs("Item Name Not Identified", item_, "Item - setPage()");
            item = Item.items[item_][0];
        }
        else
            item = item_;
        if (!item.pages)
            liefs_lib_1.liefsError.badArgs("Item " + item.label + " to be defined with pages", "it wasn't", "Item - setPage()");
        return item;
    };
    return Item;
}());
Item.debug = true;
Item.items = {};
exports.Item = Item;
exports.I = Item.I;
exports.v = Item.v;
exports.h = Item.h;
exports.items = Item.items;
exports.getItem = Item.get;
