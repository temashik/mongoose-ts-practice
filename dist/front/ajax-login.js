/* eslint-disable no-undef */
$(document).ready(() => {
	$('#login').submit(function (event) {
		$.ajax({
			method: 'POST',
			url: '/login-success',
			data: {
				email: $('#email').val(),
				password: $('#password').val(),
			},
			success: function (result) {
				if (result.eMsg) {
					$('#error').html('<strong>' + result.eMsg + '</strong>');
				} else {
					window.location.replace('/');
					//$('#weather-temp').html('<strong>' + result + '</strong> degrees');
				}
			},
		});
		event.preventDefault();
	});
});
