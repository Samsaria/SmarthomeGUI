//Load data either from local storage, if not present load from file
$(document).ready(() => {
    var localStorageGroups = JSON.parse(localStorage.getItem('groups'));
    if (localStorageGroups) {
        createSubListFromData("#groups-list", ".template > li", ".subListTemplate > li", localStorageGroups, "groups");
    } else {
        createListSubListFromFile("#groups-list", ".template > li", ".subListTemplate > li", "../data/groups.json", "groups");
    }
});

//Click listeners for switching off devices and storing to localstorage
$(document).on("click", "input", function (evt) {
    var id = evt.target.attributes.jsonid.nodeValue;
    var storedDevices = JSON.parse(localStorage.getItem('devices'));
    updateCheckedData(storedDevices, id);
});


function createListSubListFromFile(listSelector, templateSelector, subListTemplateSelector, dataFilePath, identifier) {
    return readDataFile(dataFilePath)
        .then(result => createSubListFromData(listSelector, templateSelector, subListTemplateSelector, result, identifier));
}

function createSubListFromData(listSelector, templateSelector, subListTemplateSelector, data, identifier) {

    var listElement = $(listSelector);
    var subListTemplateElement = $(subListTemplateSelector);
    var templateElement = $(templateSelector);

    if (templateElement == null || !templateElement.length)
        return; //No element found

    if (subListTemplateElement == null || !subListTemplateElement.length)
        return; //No subList found

    var templateStr = templateElement[0].outerHTML;
    var subListTemplateStr = subListTemplateElement[0].outerHTML;

    //Replace all "(template)" placeholders"
    templateStr = templateStr.replace(/\(template\)/g, "");
    subListTemplateStr = subListTemplateStr.replace(/\(template\)/g, "");

    writeTolocalStorage(identifier, data);   //Store groups to local storage

    /****Get devices for groups either from local storage or file*********/
    var localStorageDevices = JSON.parse(localStorage.getItem('devices'));
    if (localStorageDevices) {
        parseInformation(data, localStorageDevices, templateStr, listElement, subListTemplateStr, "devices");
    } else {
        readDataFile("../data/devices.json")
            .then(subList => parseInformation(data, subList, templateStr, listElement, subListTemplateStr, "devices"));
    }



}
function parseInformation(data, subList, templateStr, listElement, subListTemplateStr, identifier) {
    for (let element of data) {
        //MDL needs an unique id for each inpute element. Create a random GUID

        let filledTemplate = nano(templateStr, element);
        listElement.append(filledTemplate);

        $.each(element.devices,function(index, item){
            $.each(subList, function(i, subListItem){
                if (item.id == subListItem.id) {
                    item = subListItem;
                    item.templateId = guidGenerator();
                }
            });

            let filledSubList = nano(subListTemplateStr, item);
            listElement.append(filledSubList);
        });
    }

    writeTolocalStorage(identifier, subList); //write devices to local storage
    //Tell MDL to update elements
    componentHandler.upgradeElements(listElement);

}