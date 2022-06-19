/* eslint-disable no-undef */
$(document).ready(() => {
	$('#delete').submit(function (event) {
		$.ajax({
			method: 'POST',
			url: '/delete-result',
			data: {
				name: $('#name').val(),
				cost: $('#cost').val(),
				amount: $('#amount').val(),
			},
			success: function (result) {
				if (result.eMsg || result.err) {
					alert(result.eMsg || result.err);
				} else {
					alert('Document was successfully deleted');
				}
			},
		});
		event.preventDefault();
	});
});
