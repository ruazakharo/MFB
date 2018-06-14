var SERVER_URL = 'api';

$(function(){
    $("#sliderContent").load("www/slider.html", () => {
        $('.flexslider').flexslider({
            controlNav: false
        });
    });
    $("#supportMenuContent").load("www/support_menu.html");
    $("#mainMenuContent").load("www/main_menu.html");
    $("#infoContent").load("www/info.html", () => {
        // create empty select wrapper
        createCustomdSelect();
        $.get(SERVER_URL + "/appointment/reasons").done((reasons) => {
            // remove empty wrapper
            $('.select-selected, .select-items').remove();
            // update original select
            for (reason of reasons) {
                $('#accountReasons').append($('<option>', {
                    value: reason.id,
                    text: reason.text
                }));
            }
            // create select wrapper with server data
            createCustomdSelect();
        });

        $("#accountPhone").on('keydown', function (e) {
            // Allow: backspace, delete, tab, escape, enter and .
            if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
                 // Allow: Ctrl/cmd+A
                (e.keyCode == 65 && (e.ctrlKey === true || e.metaKey === true)) ||
                 // Allow: Ctrl/cmd+C
                (e.keyCode == 67 && (e.ctrlKey === true || e.metaKey === true)) ||
                 // Allow: Ctrl/cmd+X
                (e.keyCode == 88 && (e.ctrlKey === true || e.metaKey === true)) ||
                 // Allow: home, end, left, right
                (e.keyCode >= 35 && e.keyCode <= 39)) {
                     // let it happen, don't do anything
                     return;
            }
            // Ensure that it is a number and stop the keypress
            if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                e.preventDefault();
            }
        });

        $("#accountPhone").intlTelInput({
            autoPlaceholder: 'aggressive',
            separateDialCode: true,
            autoHideDialCode: false,
            onlyCountries: ['uk', 'ru', 'us', 'in'],
            utilsScript: "masked-input/js/utils.js",
            formatOnDisplay: true
        });
    });
});


const isPhoneValid = (phone) => {
    return $("#accountPhone").intlTelInput("isValidNumber");
}

const getName = () => {
    return $("#accountName").val();
}

const getPhone = () => {
    return $("#accountPhone").intlTelInput("getNumber");
}

const getReasonId = () => {
    return $('.same-as-selected').attr('option-id');
}

const signup = () => {
    const name = getName();
    if(!name) {
        alert("Please enter Name");
        return;
    }
    const phone = '+' + getPhone().replace(/\D/gi, ''); // regex return only numbers after masking
    if(!isPhoneValid(phone)) {
        alert("Please enter valid phone");
        return;
    }
    const reasonId = getReasonId();
    if(!reasonId) {
        alert("Please select the Reason");
        return;
    }

    const data = {
        name: name,
        phoneNumber: phone,
        appointmentReasonId: reasonId
    }

    $.ajax({
        type: 'POST',
        url: SERVER_URL + '/signup',
        contentType: 'application/json',
        data: JSON.stringify(data),
        dataType: 'json',
        success: function() {
            $("#accountInfoButton").hide();
            $("#smsSuccessful").show();
        },
        error: function() {
            alert("fail request");
        }
    });
}