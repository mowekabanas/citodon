
	/* Contact */

	/* Contact email manipulation */

	var formSentCount = 0;
	var formSentCountLimit = 2;

	var requestURL = 'http://service.elbit.com.br/mailman/citodon';
	var formLocked = false;

	var form = {
		viewport: document.getElementById('cForm')
	};

	form.fields = {};
	form.sendButton = {};

	form.fields.cName = document.getElementById('cName');
	form.fields.cCity = document.getElementById('cCity');
	form.fields.cPhone = document.getElementById('cPhone');
	form.fields.cEmail = document.getElementById('cEmail');
	form.fields.cMessage = document.getElementById('cMessage');
	form.sendButton.viewport = document.getElementById('cSubmit');
	// form.fields.cAddress = document.getElementById('cAddress');

	form.states = [
		'is-error',
		'is-fail',
		'is-sending',
		'is-success'
	];

	form.changeState = function (state) {

		if (form.viewport) {

			for (var i = form.states.length; i--; )
				form.viewport.classList.remove(form.states[i])

			form.viewport.classList.add(state);

		}

	};

	// send the ajax request
	form.sendRequest = function(requestData) {

		if (requestData) {

			// vanilla js
			var xhr = new XMLHttpRequest();

			// "beforeSend"
			formLocked = true;
			form.changeState('is-sending');

			xhr.ontimeout = function (e) {
				console.log(e);
				form.changeState('is-fail');
			};

			xhr.onerror = function() {
				form.changeState('is-error');
				//form.send(requestData, 5000);
			};

			xhr.onreadystatechange = function(e) {

				if (xhr.readyState == 4) {

					if (xhr.status == 200) {
						console.log(xhr.responseText);
						form.changeState('is-success');
					} else {
						form.changeState('is-error');
					}

				}

				formLocked = false;

			};

			xhr.withCredentials = true;
			xhr.open('GET', requestURL + "?" + form.requestParams(requestData), true);
			xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
			xhr.timeout = 12000;

			xhr.send(null);

		}

	};

	// transform object into uri string
	form.requestParams = function (requestData) {

		var y = '', e = encodeURIComponent;

		for (var x in requestData) {
			y += '&' + e(x) + '=' + e(requestData[x]);
		}

		//&_t= ==> equals to cache: false;
		return y.slice(1) + '&_t=' + new Date().getTime();

	};

	// control the time delay to init the ajax request
	form.send = function(requestData, delay) {

		if (requestData) {

			if (delay) {
				setTimeout(function() {
					form.sendRequest(requestData);
				}, delay)
			} else {
				form.sendRequest(requestData);
			}

		}

	};

	// form submit button listener
	form.sendButton.viewport.addEventListener('click', function (ev) {

		ev.preventDefault();

		if (!formLocked) {

			if (formSentCount < formSentCountLimit) {

				var allow = !!(form.fields.cName.value && (form.fields.cPhone.value || form.fields.cEmail.value) && form.fields.cCity.value && form.fields.cMessage.value);

				if (allow) {

					// lock the form
					formLocked = true;

					// count the request
					formSentCount++;

					// get object data
					var requestData = {
						cName: form.fields.cName.value,
						cPhone: form.fields.cPhone.value,
						cEmail: form.fields.cEmail.value,
						cAddress: "",
						cCity: form.fields.cCity.value,
						cMessage: form.fields.cMessage.value
					};

					// send
					form.send(requestData, false);

				} else {
					form.changeState('is-error');
				}

			}

		}

	});