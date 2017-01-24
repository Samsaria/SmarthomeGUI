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
            swal("Resetted!", "Data has been reset", "success");
        });
}


