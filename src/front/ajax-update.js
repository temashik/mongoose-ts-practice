/* eslint-disable no-undef */
$(document).ready(() => {
	$('#update').submit(function (event) {
		$.ajax({
			method: 'POST',
			url: '/update-result',
			data: {
				name: $('#name').val(),
				newName: $('#newName').val(),
				cost: $('#cost').val(),
				newCost: $('#newCost').val(),
				amount: $('#amount').val(),
				newAmount: $('#newAmount').val(),
			},
			success: function (result) {
				if (result.eRoot) {
					window.location.replace(`/?eMsg=${result.eRoot}`);
				} else if (result.eMsg) {
					$('#error').html('<strong>' + result.eMsg + '</strong>');
				} else {
					alert('Document was successfully updated');
					$('body').replaceWith(result);
					//$('#weather-temp').html('<strong>' + result + '</strong> degrees');
				}
			},
		});
		event.preventDefault();
	});
});
