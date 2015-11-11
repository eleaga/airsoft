module.exports = {

	pages: function(count, cb){  
		if(count){
			return Math.floor(count/20);
		}
		return 0;
	}
	
}