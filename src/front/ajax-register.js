/* eslint-disable no-undef */
$(document).ready(() => {
	$('#register').submit(function (event) {
		$.ajax({
			method: 'POST',
			url: '/register-result',
			data: {
				name: $('#name').val(),
				email: $('#email').val(),
				password: $('#password').val(),
				possibilities: $('#possibilities').val(),
			},
			success: function (result) {
				if (result.eMsg || result.err) {
					alert(result.eMsg || result.err);
				} else {
					alert(result.msg);
					window.location.replace('/login');
					//$('#weather-temp').html('<strong>' + result + '</strong> degrees');
				}
			},
		});
		event.preventDefault();
	});
});
