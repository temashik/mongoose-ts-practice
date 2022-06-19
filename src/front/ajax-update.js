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
				if (result.eMsg || result.err) {
					alert(result.eMsg || result.err);
				} else {
					alert('Document was successfully updated');
					//$('#weather-temp').html('<strong>' + result + '</strong> degrees');
				}
			},
		});
		event.preventDefault();
	});
});
