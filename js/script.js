$(document).ready(function() {
    $('#embed-code').change(function(){
        $.each($('#chart-col'), function() {
            $('#chart').html($('#embed-code').val());
            $("#code").hide();
        });
    });
    $('.embed').click(function(){
        $(this).addClass("active");
    });
});