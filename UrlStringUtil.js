function updateUriStringParameter(uri, key, value) {
	  var re = new RegExp("([?|&])" + key + "=.*?(&|$)", "i");
	  separator = uri.indexOf('?') !== -1 ? "&" : "?";
	  if (uri.match(re)) {
	    return uri.replace(re, '$1' + key + "=" + value + '$2');
	  }
	  else {
	    return uri + separator + key + "=" + value;
	  }
}

function removeUriStringParameter(uri, key) {
	var url ="";
	// &key=value
	var re = new RegExp("([?|&])" + key + "=[A-Za-z0-9]*", "i");
	// single character
	var separators = new RegExp("([?|&])$", "i");

	if (uri.match(re)) {
		var part = uri.split(re);
		for (var x in part){
			//discard separators
			if (!part[x].match(separators)){
				url = url + part[x];
			}
		}
		return url;
	}
	else {
		//pattern not found
		return uri ;
	}
}
