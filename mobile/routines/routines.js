const dataFilePath = '../../data/routines.json';

//Load data
$(document).ready(function () {
    var localStorageRoutines = JSON.parse(localStorage.getItem('routines'));
    if (localStorageRoutines) {
        createListFromData("#routine-list", ".template > li", localStorageRoutines, "routines");
    } else {
        createListFromFile("#routine-list", ".template > li", dataFilePath, "routines")
            .then(() => sortByName("#device-list", true));
    }

});

function routineExecuted(element, id) {
    let routines = JSON.parse(localStorage.getItem('routines'));
    var routine = getObjects(routines, 'id', id)[0];

    let storageDevices = JSON.parse(localStorage.getItem('devices'));
    for (let routineDevice of routine.devices) {
        let storageDevice = getObjects(storageDevices, "id", routineDevice.id);
        if (storageDevice.length)
            storageDevice[0].state = routineDevice.new_state;
    }

    writeTolocalStorage("devices", storageDevices);
    swal("Successfully executed", "Wait for your devices to perform.", "success");
}

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