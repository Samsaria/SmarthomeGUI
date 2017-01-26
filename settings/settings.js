function resetState() {
    swal({
            title: "Are you sure?",
            text: "You will reset the test environment to the initial state",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, reset!",
            closeOnConfirm: false
        },
        function(){
            localStorage.clear();
            reloadData();
            swal("Resetted!", "Data has been reset", "success");
        });
}

function reloadData(){
    reloadJSON("../data/routines.json", "routines");
    reloadJSON("../data/devices.json", "devices");
    reloadJSON("../data/groups.json", "groups");
}

