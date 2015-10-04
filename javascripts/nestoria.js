(function(global){
	var url = 'http://api.nestoria.co.uk/api?' +
				'country=uk&pretty=1&action=search_listings&' +
				'encoding=json&listing_type=buy&page=1&' +
				'number_of_results=6';

	var nestoriaApi = {
		getLocations: function(placeName, successCallback, errorCallback) {
			$.ajax({
				url: url + '&place_name=' + placeName,
				dataType: 'jsonp',
				success: successCallback,
				error: errorCallback
			});
		}
	};

	global.nestoriaApi = nestoriaApi;
})(window);
