$(function () {
    //alert("html5 upload");
    var dropbox = $('#dropboxModeratingPhotos'),
		message = $('.message', dropbox);

    dropbox.filedrop({
        // The name of the $_FILES entry:
        paramname: 'files',

        maxfiles: 25,
        maxfilesize: 4,
        url: '/Upload/UploadDropZoneFilesImgUr', //UploadMultipleImages

        uploadFinished: function (i, file, response) {
            $.data(file).addClass('done');
            userSession.imgurImageTemplateModeratingPhotos.push(response);
            var scope = angular.element(document.getElementById("ModeratingPhotosViewAfterUploadId")).scope();
            scope.$apply(function () {            
                scope.refreshModeratingPhotosListDiv();
            });
            //angular.element(document.getElementById('ModeratingPhotosViewAfterUploadId')).scope().refreshModeratingPhotosListDiv(); 
            //console.log(userSession.listOfImgurImages);
        },

        error: function (err, file) {
            switch (err) {
                case 'BrowserNotSupported':
                    showMessage('Your browser does not support HTML5 file uploads!');
                    break;
                case 'TooManyFiles':
                    alert('Too many files! Please select 25 at most!');
                    break;
                case 'FileTooLarge':
                    alert(file.name + ' is too large! Please upload files up to 4mb (configurable).');
                    break;
                default:
                    break;
            }
        },

        // Called before each upload is started
        beforeEach: function (file) {
            if (!file.type.match(/^image\//)) {
                alert('Only images are allowed!');

                // Returning false will cause the
                // file to be rejected
                return false;
            }
        },

        uploadStarted: function (i, file, len) {
            createImage(file);
        },

        progressUpdated: function (i, file, progress) {
            $.data(file).find('.progress').width(progress);
        }

    });

    var template = '<div class="preview">' +
						'<span class="imageHolder">' +
							'<img />' +
							'<span class="uploaded"></span>' +
						'</span>' +
						'<div class="progressHolder">' +
							'<div class="progress"></div>' +
						'</div>' +
					'</div>';


    function createImage(file) {

        var preview = $(template),
			image = $('img', preview);

        var reader = new FileReader();

        image.width = 100;
        image.height = 100;

        reader.onload = function (e) {

            // e.target.result holds the DataURL which
            // can be used as a source of the image:

            image.attr('src', e.target.result);
        };

        // Reading the file as a DataURL. When finished,
        // this will trigger the onload function above:
        reader.readAsDataURL(file);

        message.hide();
        preview.appendTo(dropbox);

        // Associating a preview container
        // with the file, using jQuery's $.data():

        $.data(file, preview);
    }

    function showMessage(msg) {
        message.html(msg);
    }

});