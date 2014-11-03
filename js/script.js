$(document).ready(function() {

    $('#dashboard').cbDashboard();
    $('#dashboard').cbDashboardEdit();
    
    $('#addRow').on('click', function(){
        $('#dashboard').trigger('add');
    });

//    $('#embed-code').change(function(){
//        $.each($('#chart-col'), function() {
//            $('#chart').html($('#embed-code').val());
//            $("#code").hide();
//        });
//    });
//    $('.embed').click(function(){
//        $(this).addClass("active");
//    });
});