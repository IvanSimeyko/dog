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
		// заносим значение в переменную
        queryText.set( $query.val() );
		// отмена действия по умолчанию
        event.preventDefault();
	};

	var showBuildingsList = function(response){
		console.info('showBuildingsList', response);

        var html = '';
        var existingUl = document.getElementById('result_2');
        var template = '<li><img src="## img_url ##"><h2><% title %></h2><p>{{ summary }}</p></li>';

        function someFunc (element) {
            var newLi = template;

            newLi = newLi.replace('## img_url ##', element.img_url);
            newLi = newLi.replace('<% title %>', element.title);
            newLi = newLi.replace('{{ summary }}', element.summary);

            html += newLi;
          }
          response.listings.forEach(someFunc);

          // добавление fragment в existingUl
          existingUl.innerHTML = html;
    };
		/*var $listingsList = $('#listings-list');
		var htmlList = $listingsList.html();
		var listingTemplate = _.template( htmlList );
		var newHtml = listingTemplate({
			items: response.listings
		});

		$result.html( newHtml );*/


        /*var listings = response.listings;
        console.log ('listings= ', listings);
        //var body = document.body;
        var fragment = document.createDocumentFragment();
        var existingUl = document.getElementById('result_2');

        function someFunc (element) {
            var li = document.createElement('li');
            var img = document.createElement('img');
            li.innerHTML = element.title;
            fragment.appendChild(li);
            //console.log ('fragment= ', fragment)
        };
        listings.forEach(someFunc);

        existingUl.innerHTML='';
        existingUl.appendChild(fragment)*/


	var showLocationsList = function(){
		console.info('showLocationsList');
	var showLocationsList = function (response){
		var elements = response.locations;
		var fragment = document.createDocumentFragment();
		var existingUl = document.getElementById('result_2');
		function someFunc (element) {
			var li = document.createElement('li');
			var p = document.createElement('p');
			p.innerHTML = element.long_title;
			li.appendChild(p);

			fragment.appendChild(li);
		}
		elements.forEach(someFunc);
		existingUl.innerHTML = '<h2> Возможно вы имели ввиду: </h2>';
		existingUl.appendChild(fragment);
	};
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
