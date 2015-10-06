// $ document ready
$(function () {

	// находим форму
	var $searhForm = $('#searh-form');

	// находим input
	var $query = $('#query');

    // находим <div> для результата
	var $result = $('#result');

	// создаем переменную
    var queryText = (function() {
		var _value = '';

		return {
			get: function() {
				// возвращение переменной _value
				return _value;
			},
			set: function(val) {
				// изменение переменной _value
				_value = val;
				// вызов события 'querytext:change'
				$query.trigger('querytext:change', val);
			}
		};
	})();

	// создаем функцию коллбек для submit формы
	var onSubmitHandler = function (event) {
		// зановим значение в переменную
        queryText.set( $query.val() );
		// отмена действия по умолчанию
        event.preventDefault();
	};

	var showBuildingsList = function(response){
		console.info('showBuildingsList', response);

		var $listingsList = $('#listings-list');

		var htmlList = $listingsList.html();

		var listingTemplate = _.template( htmlList );

		var newHtml = listingTemplate({
			items: response.listings
		});

		$result.html( newHtml );
	};

	var showLocationsList = function(){
		console.info('showLocationsList');
	};

	var showErrorList = function(){
		console.error('showErrorList');
	};

	var onChangeQueryText = function (event, text) {
		console.log('querytext:change');
		var callbackSuccess = function(data) {
			console.info(data);
			switch (data.response.application_response_code) {
				case '100':
				case '101':
				case '110':
					showBuildingsList(data.response);
				break;
				case '200':
				case '202':
					showLocationsList(data.response);
				break;
				default:
					showErrorList(data.response);
			}
		};
		var callbackError = function(data) {
			console.error(data);
			//showErrorList(false, data);
		};
		nestoriaApi.getLocations(text, callbackSuccess, callbackError);
	};

	$searhForm.on('submit', onSubmitHandler);
	$query.on('querytext:change', onChangeQueryText);

});
