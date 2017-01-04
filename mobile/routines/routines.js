//Load data
$(document).ready(() =>
    createListFromFile("#routine-list", ".template > li", "routines.json")
);