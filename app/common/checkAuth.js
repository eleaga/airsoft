
module.exports = {

	auth: function(req, res, cb){
		if (!req.isAuthenticated()) {
		    res.status('401').json('Não autorizado');
	  
		}
	}
}