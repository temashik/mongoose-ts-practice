/* eslint-disable no-undef */
$(document).ready(() => {
	// eslint-disable-next-line no-debugger
	$('#delete').submit(function (event) {
		$.ajax({
			method: 'POST',
			url: '/delete-result',
			data: {
				_id: $('#_id').val(),
			},
			success: function (result) {
				if (result.eMsg) {
					$('#error').html('<strong>' + result.eMsg + '</strong>');
				} else {
					window.location.replace(`/?eMsg=${result.msg}`);
				}
			},
		});
		event.preventDefault();
	});
});
