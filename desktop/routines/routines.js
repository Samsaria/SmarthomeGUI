//Load data
$(document).ready(function() {
    createListFromFile("#routine-list", ".template > li", "../../data/routines.json");
});

function routineExecuted() {
    swal("Successfully executed!!", "Wait for your devices to perform!", "success");
}