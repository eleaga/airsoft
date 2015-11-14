$('.vote').click(function(){
	var button = this;
	var value = $(this).attr('value');
	var to = $(this).attr('to');

	$.ajax({
	  type: "POST",
	  url: '/vote',
	  data: {to: to, value: value}
	}).done(function(voto) {
		if(voto==0){
				Materialize.toast('Voto não pode ser salvo.', 4000) 
		}else{
				Materialize.toast('Voto salvo.', 4000) 
		}
		// $( '.vote' ).removeClass( "disable" );
		// $( button ).addClass( "disable" );
	});

});
	

$('input#team').keyup(function(){
	var team = $(this).val();
	$('#teamId').val('');

	$.ajax({
	  type: "POST",
	  url: '/team/json',
	  data: {team: team},
	}).done(function(result){

		$('#dropdownTime').html('');
		var i = 0;
		result.team.forEach(function(time) {
			i++;
			liTime = '<li><span value="'+time._id+'">'+time.name+'</span></li>';
			$('#dropdownTime').append(liTime);
		});
		$('#dropdownTime').css({display: "block", opacity: "1" });
	});
});

$('#dropdownTime').on('click', 'li', function(){
	id = $(this).find('span').attr('value');
	nome = $(this).find('span').html();
	console.log(nome)
	console.log(id)
	$('#team').val(nome);
	$('#teamId').val(id);
	$('#dropdownTime').hide();
})
