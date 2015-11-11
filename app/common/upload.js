var http = require('http');
var fs = require('fs');

module.exports = {

  imagePerfil: function(image, id, cb){  

	    var image_upload_path_old = image.path
	      , image_upload_path_new = './public/upload/' + id + '/'
	      , image_upload_name = image.name
	      , image_upload_path_name = image_upload_path_new + image_upload_name
	      ;
	      // console.log(files.image);
	      fs.mkdir(image_upload_path_new, function (err) {

		      if( ( image.type == 'image/jpeg' ||  image.type == 'image/png' ) && image.size < 1000000){
			      
			      fs.rename(
			        image_upload_path_old,
			        image_upload_path_name,
			        function (err) {
			        if (err) {
			          return false;
			        }
			        var imageEnd = '/upload/' + id + '/' + image_upload_name;
			        return cb(imageEnd);
			      });

		      }
		      else{
		      	return cb(false);
		      }
		  });
	  }
	
}