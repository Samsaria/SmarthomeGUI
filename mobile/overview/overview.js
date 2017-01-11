const removeDelay = 1500; //ms
const dataFilePath = '../../data/devices.json';

//Load data
$(document).ready(() => {
        var localStorageDevices = JSON.parse(localStorage.getItem('devices'));
        if (localStorageDevices) {
            var activeDevices = getCheckedDevices(localStorageDevices);
            createListFromData("#overview-list", ".template > li", activeDevices);
        } else {
            return readDataFile(dataFilePath)
                .then(fileDevices =>  {
                    var activeDevices = getCheckedDevices(fileDevices);
                    createListFromData("#overview-list", ".template > li", activeDevices);
                });
        }
    }
);

//Click listeners for switching off devices
$(document).on("click", "input", function (evt) {
    var id = evt.target.attributes.jsonid.nodeValue;
    var storedDevices = JSON.parse(localStorage.getItem('devices'));
    updateCheckedData(storedDevices, id);
    removeListEntryAfterDelay(evt.target);
});

function removeListEntryAfterDelay(inputElement) {
    var $input = $(inputElement);
    var switchOn = isSwitchOn($input);

    //This is called before switching off, so check for switch on
    if (switchOn)
        setTimeout(() => {
            if (isSwitchOn($input)) //Was it switched on again?
                return;
            $input.closest(".mdl-list__item").remove();
        }, removeDelay);
}

function isSwitchOn(inputElement) {
    var $input = inputElement instanceof jQuery ? inputElement : $(inputElement);
    var $label = $input.closest(".mdl-switch");

    return $label.hasClass("is-checked");
}
