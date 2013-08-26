$(function () {
    $('#news-table tbody .title a').click(function () {
        var id = $(this).data('id');
        $.ajax({
            type: 'GET',
            url: '/news/'+id,
            dataType: 'json'
        }).done(function(data) { 
            $('#news-content-Modal .modal-title').html(data.title);
            $('#news-content-Modal .modal-body').html(data.html);
        });
    });

    $('#index-news-table tbody a').click(function () {
        var id = $(this).data('id');
        $.ajax({
            type: 'GET',
            url: '/news/'+id,
            dataType: 'json'
        }).done(function(data) { 
            $('#news-content-Modal .modal-title').html(data.title);
            $('#news-content-Modal .modal-body').html(data.html);
        });
    });
});