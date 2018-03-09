(function() {
  $(function() {
    "use strict";
    $("#fileupload").fileupload({
      url: "../../../../se7en.herokuapp.com/uploads"
    });
    $("#fileupload").fileupload("option", "redirect", window.location.href.replace(/\/[^\/]*$/, "/cors/result.html?%s"));
    if (window.location.hostname === "blueimp.github.io") {
      $("#fileupload").fileupload("option", {
        url: "../../../../blueimp.github.io/jQuery-File-Upload/index.html",
        disableImageResize: /Android(?!.*Chrome)|Opera/.test(window.navigator.userAgent),
        maxFileSize: 5000000,
        acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i
      });
      if ($.support.cors) {
        return $.ajax({
          url: "../../../../blueimp.github.io/jQuery-File-Upload/index.html",
          type: "HEAD"
        }).fail(function() {
          return $("<div class=\"alert alert-danger\"/>").text("Upload server currently unavailable - " + new Date()).appendTo("#fileupload");
        });
      }
    } else {
      $("#fileupload").addClass("fileupload-processing");
      return $.ajax({
        url: $("#fileupload").fileupload("option", "url"),
        dataType: "json",
        context: $("#fileupload")[0]
      }).always(function() {
        return $(this).removeClass("fileupload-processing");
      }).done(function(result) {
        return $(this).fileupload("option", "done").call(this, $.Event("done"), {
          result: result
        });
      });
    }
  });

}).call(this);
