
/* Nano Templates - https://github.com/trix/nano */
function nano(template, data) {
    return template.replace(/\{([\w\.]*)\}/g, function (str, key) {
        var keys = key.split("."),
            v = data[keys.shift()];
        for (var i = 0, l = keys.length; i < l; i++) v = v[keys[i]];
        return (typeof v !== "undefined" && v !== null) ? v : "";
    });
}
/*End Nano Templates */


//THX to http://stackoverflow.com/a/6860916
function guidGenerator(noTrailingUnderscore) {
    var S4 = function () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    var guid = (noTrailingUnderscore ? "" : "_") + (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    return guid;
}

function reloadJSON(dataFilePath, identifier){
    return readDataFile(dataFilePath)
        .then(result =>  writeTolocalStorage(identifier, result));
}

function createListFromFile(listSelector, templateSelector, dataFilePath, identifier) {
    return readDataFile(dataFilePath)
        .then(result => createListFromData(listSelector, templateSelector, result, identifier));
}

function createListFromData(listSelector, templateSelector, data, identifier) {
    var listElement = $(listSelector);
    var templateElement = $(templateSelector);

    if (templateElement == null || !templateElement.length)
        return; //No element found

    var templateStr = templateElement[0].outerHTML;
    //Replace all "(template)" placeholders"
    templateStr = templateStr.replace(/\(template\)/g, "");

    for (let element of data) {
        //MDL needs an unique id for each inpute element. Create a random GUID
        element.templateId = guidGenerator();

        let filledTemplate = nano(templateStr, element);
        listElement.append(filledTemplate);
    }

    //Tell MDL to update elements
    componentHandler.upgradeElements(listElement);
    writeTolocalStorage(identifier, data);
}

function readDataFile(dataFilePath) {
    return new Promise(function (resolve, reject) {
        $.getJSON(dataFilePath).done(resolve).fail(reject);
    });
}

function getListItems(listSelector, emptyListSelector) {
    if (emptyListSelector == null)
        emptyListSelector = ".empty-list";

    return $(listSelector).find(".mdl-list__item:not(" + emptyListSelector + ")");
}

//Filtering
function filterList(text, listSelector, itemTextFunction, emptyListSelector) {
    if (itemTextFunction == null)
        itemTextFunction = (x => x.text());

    text = text.toLowerCase();

    var listItems = getListItems(listSelector, emptyListSelector);
    for (let i = 0; i < listItems.length; i++) {
        let item = listItems.eq(i);
        let itemText = itemTextFunction(item);
        let includes = itemText.toLowerCase().includes(text);
        if (includes) {
            item.show();
        } else {
            item.hide();
        }
    }
}

//Sorting
function sortByName(listSelector, ascending, textSelector) {
    if (textSelector == null)
        textSelector = ".name";

    if (ascending == null)
        ascending = true;

    sortList(listSelector, (x, y) => {
        let compared = $(x).find(textSelector).text().toLowerCase().localeCompare($(y).find(textSelector).text().toLowerCase());
        return ascending ? compared : -compared;
    })

    setSortState("name", ascending);
}

function sortByState(listSelector, ascending) {
    if (ascending == null)
        ascending = true;

    sortList(listSelector, (x, y) => {
        let cx = $(x).find(".mdl-switch").hasClass("is-checked");
        let cy = $(y).find(".mdl-switch").hasClass("is-checked");

        let val;
        if (cx === cy)
            val = 0;
        if (cx && !cy)
            val = -1;
        else
            val = 1;

        return ascending ? val : -val;
    })

    setSortState("state", ascending);
}


//Generic sorting methods
function sortList(listSelector, comparerFunction) {
    var elements = getListItems(listSelector);
    elements.sort(comparerFunction);

    //Sorting is done via flexbox "order" attribute
    for (let i = 0; i < elements.length; i++) {
        let element = elements.eq(i);
        element.css("order", i);
    }
}

function setSortState(prop, ascending) {
    var sortings = window.sortings;
    //prop should be a property of the sortings object
    if (!sortings || typeof prop !== "string" || sortings[prop] === undefined)
        return;

    if (ascending) {
        sortings[prop] = true;
    } else {
        sortings[prop] = false;
    }

    //Reset other sortings
    for (let key in sortings) {
        if (key !== prop)
            sortings[key] = null;
    }

    setSortButtonVisibilities();
}

function setSortButtonVisibilities() {
    var sortings = window.sortings;
    var sortButtons = window.sortButtons;

    if (!sortings || !sortButtons)
        return;

    for (let prop in sortings) {
        let buttonsContainer = sortButtons[prop];
        let state = sortings[prop];

        if (buttonsContainer == null || state === undefined)
            continue;

        buttonsContainer.removeClass("sort-ctn-asc sort-ctn-desc sort-ctn-none")
        switch (state) {
            case true:
                buttonsContainer.addClass("sort-ctn-asc");
                break;
            case false:
                buttonsContainer.addClass("sort-ctn-desc");
                break;
            case null:
                buttonsContainer.addClass("sort-ctn-none");
                break;
        }
    }
}


/** Modify json data **/

function writeTolocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function createObjectFromFile(dataFilePath) {
    return readDataFile(dataFilePath)
        .then(result => result);
}


function updateCheckedData(data, modifiedDeviceId) {
    var found = data.findIndex(function (item) {
        return item.id === modifiedDeviceId;
    });
    if (found != -1) {
        if (data[found]["state"] === "checked") {
            data[found]["state"] = "unchecked";
        }
        else {
            data[found]["state"] = "checked";
        }

        writeTolocalStorage("devices", data);
    }
    else {
        swal('Data not found!', 'error');
    }
}

function getCheckedDevices(data) {
    var found = data.filter(function (item) {
        if (item.state == "checked") {
            return item;
        }

    });
    return found;
}

// NestedLists
function mainItemClicked(mainItem) {
    mainItem = $(mainItem);

    var wasActive = mainItem.hasClass("active");

    mainItem.siblings().removeClass("active");

    //If it wasnt active before, set it to active
    if (!wasActive) {
        mainItem.addClass("active");
        mainItem.nextUntil(".main-item").addClass("active");
    } else {
        mainItem.removeClass("active");
    }
}