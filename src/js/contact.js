
/* Contact email manipulation */

var formSentCount = 0;
var formSentCountLimit = 2;

var requestURL = 'http://mailman.letsmowe.com/citodon/';
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
		
		// ajax request
		$.ajax({
			cache: false,
			crossDomain: true,
			data: requestData,
			method: 'get',
			beforeSend: function() {
				formLocked = true;
				form.changeState('is-sending');
			},
			error: function (data) {
				console.log(data);
				form.changeState('is-fail');
				form.send(requestData, 5000);
			},
			success: function (data) {
				console.log(data);
				if (data.sent)
					form.changeState('is-success');
				else
					form.changeState('is-error');
				formLocked = false;
			},
			timeout: 12000,
			url: requestURL
		});
		
	}
	
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