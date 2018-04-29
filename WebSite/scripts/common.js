$(function(){
    $("#sliderContent").load("www/slider.html", () => {
        $('.flexslider').flexslider({
            controlNav: false
        });
    });
    $("#supportMenuContent").load("www/support_menu.html");
    $("#mainMenuContent").load("www/main_menu.html");
    $("#infoContent").load("www/info.html", () => {
        createCustomdSelect();
        $.get("/appointment/reasons").done((data) => {
            // update the select here
        })
        $("#accountPhone").mask("+7 (999) 999-9999");
    });
});


const isPhoneValid = (phone) => {
    // simple phone validation (10 digits)
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone)
}

const getName = () => {
    return $("#accountName").val();
}

const getPhone = () => {
    return $("#accountPhone").val();
}

const getReasonId = () => {
    return $("#accountReason .selected").attr('data-option-value');
}

const signup = () => {
    const name = getName();
    if(!name) {
        alert("please enter Name");
        return;
    }
    const phone = getPhone().replace(/\D/gi, ''); // regex return only numbers after masking
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

    $.post("/user/sighnup", data)
        .done(() => {
            console.log("done request");
        })
        .fail(() => {
            console.log("fail request");
        })
}