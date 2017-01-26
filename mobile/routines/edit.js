var routineWorkingOn;
//Load data
$(document).ready(function () {
    let routineId = getUrlParameter('id');
    let routines = JSON.parse(localStorage.getItem('routines'));
    var found = getObjects(routines, 'id', routineId); // Returns an array of matching objects

    let devices = JSON.parse(localStorage.getItem('devices'));
    let foundDevices = [];

    for (let device of found[0].devices) {
        let temp = getObjects(devices, "id", device.id);
        temp[0].new_state = device.new_state;
        foundDevices.push(temp);
    }

    createListFromArrayData("#devices-list", ".template > li", foundDevices);

    $('#routine_name').text(found[0].name);
    $('#routine_icon').text(found[0].icon);

    prefillDates(found[0].days);
    prefillTime(found[0].repeat_at);
    prefillActive(found[0].state);
});

function prefillDates(days) {
    if (days == null)
        return
    for (let day of days) {
        $('#' + day).prop("checked", true);
    }
}

function prefillTime(time) {
    if (time)
        $('#time')[0].value = time;
}

function prefillActive(active) {
    if (active)
        $('#active').prop("checked", active);
}

function saveRoutine() {
    var days = [];

    if ($('#Monday').closest(".mdl-checkbox").hasClass("is-checked")) {
        days.push("Monday")
    }
    if ($('#Tuesday').closest(".mdl-checkbox").hasClass("is-checked")) {
        days.push("Tuesday")
    }
    if ($('#Wednesday').closest(".mdl-checkbox").hasClass("is-checked")) {
        days.push("Wednesday")
    }
    if ($('#Thursday').closest(".mdl-checkbox").hasClass("is-checked")) {
        days.push("Thursday")
    }
    if ($('#Friday').closest(".mdl-checkbox").hasClass("is-checked")) {
        days.push("Friday")
    }
    if ($('#Saturday').closest(".mdl-checkbox").hasClass("is-checked")) {
        days.push("Saturday")
    }
    if ($('#Sunday').closest(".mdl-checkbox").hasClass("is-checked")) {
        days.push("Sunday")
    }

    /** set the time **/
    let timestring = $('#time')[0].value;

    /** Set the state **/
    let state;
    let active_style;
    /** set active **/
    if ($('#active').closest(".mdl-checkbox").hasClass("is-checked")) {
        state = "checked";
        active_style = "active_green";
    } else {
        state = "";
        active_style = "";
        timestring = "";
    }

    //No active without time
    if ($('#active').closest(".mdl-checkbox").hasClass("is-checked") && !timestring.match(/\d{1,2}:\d\d/)) {
        swal("No time provided!", "Cannot be active without time!", "error");
    } else {
        let routines = JSON.parse(localStorage.getItem('routines'));

        let currentId = getUrlParameter('id');
        for (let routine of routines) {
            if (routine.id == currentId) {
                routine.days = days;
                routine.repeat_at = timestring;
                routine.state = state;
                routine.active_style = active_style;
            }
        }

        writeTolocalStorage("routines", routines);
        swal("Saved!", "Data has been saved!", "success");
    }
}

function routineExecuted() {
    swal("Successfully executed!!", "Wait for your devices to perform!", "success");
}


function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};

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

function createListFromArrayData(listSelector, templateSelector, data) {

    var listElement = $(listSelector);
    var templateElement = $(templateSelector);

    if (templateElement == null || !templateElement.length)
        return; //No element found

    var templateStr = templateElement[0].outerHTML;
    //Replace all "(template)" placeholders"
    templateStr = templateStr.replace(/\(template\)/g, "");

    for (let element of data) {
        console.log(element);
        //MDL needs an unique id for each inpute element. Create a random GUID
        element[0].templateId = guidGenerator();

        let filledTemplate = nano(templateStr, element[0]);
        listElement.append(filledTemplate);
    }

    //Tell MDL to update elements
    componentHandler.upgradeElements(listElement);
}

$("#slider-range").slider({
    range: true,
    min: 0,
    max: 1440,
    step: 15,
    values: [600, 720],
    slide: function (e, ui) {
        var hours1 = Math.floor(ui.values[0] / 60);
        var minutes1 = ui.values[0] - (hours1 * 60);

        if (hours1.length == 1) hours1 = '0' + hours1;
        if (minutes1.length == 1) minutes1 = '0' + minutes1;
        if (minutes1 == 0) minutes1 = '00';
        if (hours1 >= 12) {
            if (hours1 == 12) {
                hours1 = hours1;
                minutes1 = minutes1 + " PM";
            } else {
                hours1 = hours1 - 12;
                minutes1 = minutes1 + " PM";
            }
        } else {
            hours1 = hours1;
            minutes1 = minutes1 + " AM";
        }
        if (hours1 == 0) {
            hours1 = 12;
            minutes1 = minutes1;
        }



        $('.slider-time').html(hours1 + ':' + minutes1);

        var hours2 = Math.floor(ui.values[1] / 60);
        var minutes2 = ui.values[1] - (hours2 * 60);

        if (hours2.length == 1) hours2 = '0' + hours2;
        if (minutes2.length == 1) minutes2 = '0' + minutes2;
        if (minutes2 == 0) minutes2 = '00';
        if (hours2 >= 12) {
            if (hours2 == 12) {
                hours2 = hours2;
                minutes2 = minutes2 + " PM";
            } else if (hours2 == 24) {
                hours2 = 11;
                minutes2 = "59 PM";
            } else {
                hours2 = hours2 - 12;
                minutes2 = minutes2 + " PM";
            }
        } else {
            hours2 = hours2;
            minutes2 = minutes2 + " AM";
        }

        $('.slider-time2').html(hours2 + ':' + minutes2);
    }
});
