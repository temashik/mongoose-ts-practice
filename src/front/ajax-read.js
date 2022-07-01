/* eslint-disable no-undef */
$(document).ready(() => {
	$('#read').submit(function (event) {
		$.ajax({
			method: 'POST',
			url: '/read-result',
			data: {
				name: $('#name').val(),
				cost: $('#cost').val(),
				amount: $('#amount').val(),
			},
			success: function (result) {
				if (result.eRoot) {
					window.location.replace(`/?eMsg=${result.eRoot}`);
				} else if (result.eMsg) {
					$('#error').html('<strong>' + result.eMsg + '</strong>');
				} else {
					$('body').replaceWith(result);
					//$('#weather-temp').html('<strong>' + result + '</strong> degrees');
				}
			},
		});
		event.preventDefault();
	});
});
