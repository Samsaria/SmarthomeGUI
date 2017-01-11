const dataFilePath = '../../data/devices.json';

//Load data either from local storage, if not present load from file
$(document).ready(() => {
    var localStorageDevices = JSON.parse(localStorage.getItem('devices'));
    if (localStorageDevices) {
        createListFromData("#device-list", ".template > li", localStorageDevices, "devices");
    } else {
        createListFromFile("#device-list", ".template > li", dataFilePath, "devices")
            .then(() =>  sortByName("#device-list", true));
    }
});

//Click listeners for switching off devices and storing to localstorage
$(document).on("click", "input", function (evt) {
    var id = evt.target.attributes.jsonid.nodeValue;
    var storedDevices = JSON.parse(localStorage.getItem('devices'));
    updateCheckedData(storedDevices, id);
});


//Filtering
$("#device-filter").keyup(onFilterChanged);
$("#device-filter").change(onFilterChanged);

function onFilterChanged(evt) {
    var text = $(evt.target).val();
    filterList(text, "#device-list", x => x.find(".name").text());
}

//Sorting: true/false/null for ascending/descending/none
$("#sort-by-name .sort-asc").click(() => sortByName("#device-list", false));
$("#sort-by-name .sort-desc").click(() => sortByName("#device-list", true));
$("#sort-by-state .sort-asc").click(() => sortByState("#device-list", false));
$("#sort-by-state .sort-desc").click(() => sortByState("#device-list", true));

var sortings = {
    name: null,
    state: null
}

var sortButtons = {
    name: $("#sort-by-name"),
    state: $("#sort-by-state"),
}

//Setup on page load
setSortButtonVisibilities();