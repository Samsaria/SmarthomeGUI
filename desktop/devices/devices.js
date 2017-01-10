//Load data
$(document).ready(() => {
    createListFromFile("#device-list", ".template > li", "../../data/devices.json").then(
        () => sortByName("#device-list", true)
    )

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