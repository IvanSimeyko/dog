// $ document ready
$(function () {

	// находим форму
	var $searhForm = $('#searh-form');
	// находим input
	var $query = $('#query');

	// создаем функцию коллбек для submit формы	
	var onSubmitHandler = function (event) {
		// this - это объект элемента на котором произошло событие
		var inputValue = $query.val();
		console.log('onSubmitHandler', inputValue);

		var error, success;
		
		error = function(data) {
			console.log(data);
		}
		success = error;

		nestoriaApi.getLocations(inputValue, success, error);

		event.preventDefault();
	};

	$searhForm.on('submit', onSubmitHandler);
});