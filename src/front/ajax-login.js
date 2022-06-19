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
				if (result.eMsg || result.err) {
					alert(result.eMsg || result.err);
				} else {
					$('body').replaceWith(result);
					//$('#weather-temp').html('<strong>' + result + '</strong> degrees');
				}
			},
		});
		event.preventDefault();
	});
});
