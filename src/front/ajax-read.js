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
