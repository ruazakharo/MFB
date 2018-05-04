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
        $.get("/api/appointment/reasons").done((reasons) => {
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

        $("#accountPhone").mask("+7 (999) 999-9999");
    });
});


const isPhoneValid = (phone) => {
    const phoneRegex = /^(\+\d)?\d{10}$/;
    return phoneRegex.test(phone)
}

const getName = () => {
    return $("#accountName").val();
}

const getPhone = () => {
    return $("#accountPhone").val();
}

const getReasonId = () => {
    return $('.same-as-selected').attr('option-id');
}

const signup = () => {
    const name = getName();
    if(!name) {
        alert("please enter Name");
        return;
    }
    const phone = '+' + getPhone().replace(/\D/gi, ''); // regex return only numbers after masking
    if(!isPhoneValid(phone)) {
        alert("please enter valid phone (10 digits)");
        return;
    }
    const reasonId = getReasonId();
    if(!reasonId) {
        alert("please select the Reason");
        return;
    }

    const data = {
        name: name,
        phoneNumber: phone,
        appointmentReasonId: reasonId
    }

    $.ajax({
        type: 'POST',
        url: 'api/signup',
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