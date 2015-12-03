module.exports = {

	isOwnerTeam: function(req, owner){  
		if(req.user && req.user.id==owner){
        	return true;
        }
        else{
        	return false; 
        }
    }

}