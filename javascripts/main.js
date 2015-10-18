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

    //show data from localStorage
    var showDataFromLocalStorage = function() {
        console.log('showDataFromLocalStorage');
        var array = JSON.parse( localStorage.getItem("successLocations") );
        console.log (array);
        var fragment = document.createDocumentFragment();
        var existingUl = document.getElementById('result_2');

        if (array) {
            function someFunc (element, index, array) {
            var li = document.createElement('li');
            var a = document.createElement ('a');
            a.href  =  '#' + element;
            a.innerHTML = element;

            a.addEventListener("click", function() {
                console.log( 'was click the link' );
                // получаем значение атрибута href и удаляем из него #
                var hRef =  a.getAttribute('href').slice( 1 );
                console.log(hRef);
                // потом это занчение внести в queryText.set( val );
                queryText.set( hRef );
                //меняем значение города в форме
                var inputField = document.getElementById('query');
                inputField.value = a.innerHTML;
            }, false);

            li.appendChild(a);
            fragment.appendChild(li);
        }
        }
        array.forEach(someFunc);
        existingUl.innerHTML='';
        existingUl.appendChild(fragment);

    };

    showDataFromLocalStorage();

    // response_code 100 or 101 or 110
    // native js
	var showBuildingsList = function(response){
        console.log ( 'run showBuildingsList');
        // native js
        var elements  = response.listings;
        console.log ('listings= ', elements);
        var fragment = document.createDocumentFragment();
        var existingUl = document.getElementById('result_2');

        function someFunc (element) {
            var li = document.createElement('li');
            var img = document.createElement('img');
            var h2 = document.createElement('h2');
			var p1 = document.createElement('p');
			var p2 = document.createElement('p');

            img.src = element.img_url;
			li.appendChild(img);

			h2.innerHTML = element.price_formatted;
			li.appendChild(h2);

			p1.innerHTML = element.title;
			li.appendChild(p1);

			p2.innerHTML = element.summary;
			li.appendChild(p2);

            fragment.appendChild(li);
            //console.log ('fragment= ', fragment)
        }
        elements.forEach(someFunc);

        existingUl.innerHTML='';
        existingUl.appendChild(fragment)
    };

    // response_code 200 or 202
    // native js
	    var showLocationsList = function (response){
		console.log ( 'run showLocationsList');
        console.log( 'response = ', response );
		var elements = response.locations;
        console.log (elements);
        var fragment = document.createDocumentFragment();
        var existingUl = document.getElementById('result_2');

        function someFunc (element) {
            var li = document.createElement('li');
            var a = document.createElement ('a');
            a.href  = '#' + element.place_name;
            a.innerHTML = element.long_title;

            a.addEventListener("click", function() {
                console.log( 'was click the link' );
                console.log( a );
                // получаем значение атрибута href и удаляем из него #
                var hRef =  a.getAttribute('href').slice( 1 );
                console.log(hRef);
                // потом это занчение внести в queryText.set( val );
                queryText.set( hRef );
                //меняем значение города в форме
                var inputField = document.getElementById('query');
                inputField.value = a.innerHTML;
            }, false);

            li.appendChild(a);
            fragment.appendChild(li);
        }

        elements.forEach(someFunc);
        existingUl.innerHTML='';
        existingUl.appendChild(fragment);
    };

    // response_code 201
    // native js
	var showErrorList = function(response){
        console.log('showErrorList');
        console.log( response );
        var answer = response.application_response_text;
        //console.log( 'answer= ', answer );
        var li = document.createElement( 'li' );
        var p = document.createElement( 'p' );
        var fragment = document.createDocumentFragment();
        var existingUl = document.getElementById('result_2');
        p.innerHTML = 'your request did not produce results. The response from the server - ' + answer;
        li.appendChild(p);
        fragment.appendChild(li);
        existingUl.innerHTML='';
        existingUl.appendChild(fragment);
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

                    // saveToLocastorage(text)
                    var fromLocal = JSON.parse( localStorage.getItem("successLocations") );
                    console.log( fromLocal );
                    if ( !fromLocal ) { // !null === true
                        fromLocal = [];
                    }
                   // get data for localstorage
                    var text = data.request.location;
                    // push in fromlocal
                    if ( fromLocal.indexOf(text) === -1 ){
                        fromLocal.push( text );
                    }
                    // stringify
                    var json = JSON.stringify( fromLocal );
                    // entry in LocalStorage
                    localStorage.setItem("successLocations", json);
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
	// действие при событи querytext:change
    $query.on('querytext:change', onChangeQueryText);

});

/*
// Другие варианты напсания функций
// вариант showBuildingsList с помощью шаблонизатора
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

         //
         //localStorage.setItem("successLocations", text);
         //localStorage.getItem("successLocations");
         //JSON.stringify
         //JSON.parse
    };

// вариант showBuildingsList с помощью jQuery
var showBuildingsList = function(response){
		var $listingsList = $('#listings-list');
		var htmlList = $listingsList.html();
		var listingTemplate = _.template( htmlList );
		var newHtml = listingTemplate({
			items: response.listings
		});

		$result.html( newHtml );
};

 // вариант функции response_code 200 or 202
    // underscore.js
    var showLocationsList = function(response){
		// response.locations
		// $result
		console.info('showLocationsList', response.locations);
        // получили html-фрагмент в виде строки
		var htmlTemplate = $('#locations-list').html();
        console.log( 'htmlTemplate= ', htmlTemplate );

		var funcTemplate = _.template(htmlTemplate);

		var newHtmlTemplate = funcTemplate({
			locations: response.locations,
			first: '<li>1</li>'
		});

		$result.html( newHtmlTemplate );
	};

 // response_code 201
    // underscore.js
    var showErrorList = function(response){
		// response.locations
		// $result
		console.info('showErrorList', response.application_response_text);
        // получили html-фрагмент в виде строки
		var htmlTemplate = $('#error-list').html();
        console.log( 'htmlTemplate= ', htmlTemplate );

		var funcTemplate = _.template(htmlTemplate);

		var newHtmlTemplate = funcTemplate({
			locations: response.application_response_text,
			first: '<li>1</li>'
		});

		$result.html( newHtmlTemplate );
	};
	*/
