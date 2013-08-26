$(function () {
    CKEDITOR.replace('newsEditor');

    var first = '',
        second = '';

    $('.tree-toggle-nav-content').click(function () {
        first = $(this).data('first');
        second = $(this).data('second');
        $('#edit-page-Modal').modal('show');

        $.get('/admin/p/'+first+'/'+second,function(data,status){
            $('#location').html('Location : '+ first + ' / ' +second);
            console.log(data);
            console.log(CKEDITOR.instances);
            CKEDITOR.instances.editor1.setData(data.content);
        });
    });

    $(document).on('click','#updatePageBtn', function(){
      var data = CKEDITOR.instances.editor1.getData();
      //alert(data);
      $.post('/admin/p/'+first+'/'+second,
      {
        first:first,
        second:second,
        html:data
      },
      function(data,status){
        location.reload();
      });
    });

    $(document).on('click','#deletePageBtn', function(){
      $.post('/admin/p/'+first+'/'+second+'/delete',
      {
        first:first,
        second:second,
      },
      function(data,status){
        location.reload();
      });
    });

    $(document).on('click','#deleteNewsBtn', function(){
      id = 
      $.post('/news/'+id+'/delete',
      { 

      },
      function(data,status){
        alert("asdd");
        location.reload();
      });

    });

    $('.tree-toggle').click(function () {
      $(this).parent().children('ul.tree').toggle(200);
    });

});