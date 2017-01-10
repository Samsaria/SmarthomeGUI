//Load data
$(document).ready(function() {
    createListFromFile("#routine-list", ".template > li", "routines.json");
});

var templateElement = $(templateSelector);

templateElement.onclick({

});

function routineExecuted(){
    swal("Successfully executed!!", "Wait for your devices to perform!", "success");
}
