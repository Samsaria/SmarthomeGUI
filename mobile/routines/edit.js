//Load data
$(document).ready(function () {
    let routineId = getUrlParameter('id');
    let routines = JSON.parse(localStorage.getItem('routines'));
    var found = getObjects(routines, 'id', routineId); // Returns an array of matching objects

    let devices = JSON.parse(localStorage.getItem('devices'));
    let foundDevices =[];

    for(let device of found[0].devices){
        let temp = getObjects(devices, "id", device.id);
        temp[0].new_state = device.new_state;
        foundDevices.push(temp);
    }

    createListFromArrayData("#devices-list", ".template > li", foundDevices);

    $('#routine_name').text(found[0].name);
    $('#routine_icon').text(found[0].icon);
    prefillDates(found[0].days);
    prefillTime(found[0].repeat_at);
});

function prefillDates(days){
    for(let day of days){
        $('#'+day).prop("checked", true);
    }
}

function prefillTime(time){

}

function saveRoutine(){
    saveDays();
    saveTime();
    saveActive();
}
function routineExecuted() {
    swal("Successfully executed!!", "Wait for your devices to perform!", "success");
}


function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};

function getObjects(obj, key, val) {
    var objects = [];
    for (var i in obj) {
        if (!obj.hasOwnProperty(i)) continue;
        if (typeof obj[i] == 'object') {
            objects = objects.concat(getObjects(obj[i], key, val));
        } else if (i == key && obj[key] == val) {
            objects.push(obj);
        }
    }
    return objects;
}

function createListFromArrayData(listSelector, templateSelector, data) {

    var listElement = $(listSelector);
    var templateElement = $(templateSelector);

    if (templateElement == null || !templateElement.length)
        return; //No element found

    var templateStr = templateElement[0].outerHTML;
    //Replace all "(template)" placeholders"
    templateStr = templateStr.replace(/\(template\)/g, "");

    for (let element of data) {
        console.log(element);
        //MDL needs an unique id for each inpute element. Create a random GUID
        element[0].templateId = guidGenerator();

        let filledTemplate = nano(templateStr, element[0]);
        listElement.append(filledTemplate);
    }

    //Tell MDL to update elements
    componentHandler.upgradeElements(listElement);
}