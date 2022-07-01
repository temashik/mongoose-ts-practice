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
				if (result.eRoot) {
					window.location.replace(`/?eMsg=${result.eRoot}`);
				} else if (result.eMsg) {
					$('#error').html('<strong>' + result.eMsg + '</strong>');
				} else {
					alert('You successfully created document ');
					window.location.replace(`/items?_id=${result._id}`);
				}
			},
		});
		event.preventDefault();
	});
});
