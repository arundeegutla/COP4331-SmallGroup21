// const showSignInModal = () => {
//     var modal = document.getElementById("sign-in-modal");
//     modal.style = "display: flex";
// }

// const hideSignInModal = () => {
//     var modal = document.getElementById("sign-in-modal");
//     modal.style = "display: none";
// }

$(function () {
    $('#get-started').click(function () {
        $('#modal-container').removeAttr('class').addClass("two");
        $('body').addClass('modal-active');
        $('.xbackground').show();

    });

    $('#close-modal').click(function () {
        $('#modal-container').addClass('out');
        $('body').removeClass('modal-active');
        $('.xbackground').hide();
    });
    
    $('#radio-1').click(function(){
        $('#modal').removeClass('right-panel-active');
    });

    $('#radio-2').click(function(){
        $('#modal').addClass('right-panel-active');
    });


    
});