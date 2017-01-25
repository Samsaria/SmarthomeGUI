const dataFilePath = '../../data/routines.json';

//Load data
$(document).ready(function() {
    var localStorageRoutines = JSON.parse(localStorage.getItem('routines'));
    if (localStorageRoutines) {
        createListFromData("#routine-list", ".template > li", localStorageRoutines, "routines");
    } else {
        createListFromFile("#routine-list", ".template > li", dataFilePath, "routines")
            .then(() =>  sortByName("#device-list", true));
    }

});

function routineExecuted() {
    swal("Successfully executed", "Wait for your devices to perform.", "success");
}


