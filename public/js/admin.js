
      var first, second;
      $().ready(function(){
       $('#info').hide();
     });

      $('.tree-toggle-nav-content').click(function () {
        first = $(this).attr('first');
        second = $(this).attr('second');
        $.get('/admin/p/'+first+'/'+second,function(data,status){
                  $('#info').show();
          $('#location').html('location : '+ first + ' / ' +second);
          console.log(data);
          console.log(CKEDITOR.instances);
          CKEDITOR.instances.editor1.setData(data.content);
        });
      });

      $(document).on('click','#submitBtn', function(){
        var data = CKEDITOR.instances.editor1.getData();
        //alert(data);
        $.post('/admin/p/'+first+'/'+second,
        {
          first:first,
          second:second,
          html:data
        },
        function(data,status){
          //alert("Data: " + data + "\nStatus: " + status);
        });
      });

      $('.tree-toggle').click(function () {
        $(this).parent().children('ul.tree').toggle(200);
      });
