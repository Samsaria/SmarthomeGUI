const removeDelay = 1500; //ms

//Load data
$(document).ready(function() {
    createListSubListFromFile("#groups-list", ".template > li", ".subListTemplate > li", "../../data/groups.json")
});

function createListSubListFromFile(listSelector, templateSelector, subListTemplateSelector, dataFilePath) {
    return readDataFile(dataFilePath)
        .then(result => createSubListFromData(listSelector, templateSelector, subListTemplateSelector, result));
}

function createSubListFromData(listSelector, templateSelector, subListTemplateSelector, data) {

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

    readDataFile("../../data/devices.json")
        .then(subList => parseInformation(data, subList, templateStr, listElement, subListTemplateStr));

}
function parseInformation(data, subList, templateStr, listElement, subListTemplateStr) {
    for (let element of data) {
        //MDL needs an unique id for each inpute element. Create a random GUID
        element.templateId = guidGenerator();

        let filledTemplate = nano(templateStr, element);
        listElement.append(filledTemplate);

        var ids = [];


        $.each(element.devices,function(index, item){
            item.templateId = guidGenerator();

            $.each(subList, function(i, subListItem){
                if (item.id == subListItem.id) {
                    item = subListItem;
                }
            });

            let filledSubList = nano(subListTemplateStr, item);
            listElement.append(filledSubList);
        });
    }

    //Tell MDL to update elements
    componentHandler.upgradeElements(listElement);

}