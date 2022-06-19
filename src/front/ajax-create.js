/* eslint-disable no-undef */
$(document).ready(() => {
	$('#create').submit(function (event) {
		$.ajax({
			method: 'POST',
			url: '/create-result',
			data: {
				name: $('#name').val(),
				cost: $('#cost').val(),
				amount: $('#amount').val(),
			},
			success: function (result) {
				if (result.eMsg || result.err) {
					alert(result.eMsg || result.err);
				} else {
					alert(
						`You created document with fields: Name = ${result.name}, Cost = ${result.cost}, Amount = ${result.amount}`,
					);
					window.location.replace(`/items?_id=${result._id}`);
					//$('#weather-temp').html('<strong>' + result + '</strong> degrees');
				}
			},
		});
		event.preventDefault();
	});
});
