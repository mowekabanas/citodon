/*!
 * Mowe Citodon Project v0.0.1 (http://letsmowe.org/)
 * Copyright 2013-2016 Mowe Developers
 * Licensed under MIT (https://github.com/mowekabanas/citodon/blob/master/LICENSE)
*/

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

/* Email deliver */

var EmailDeliver = (function () {

	/**
	 * Email deliver constructor
	 * @constructor
	 */
	function EmailDeliver(formID) {

		this.formID = formID;
		this.destination = "fromagio_cristiano@live.com"; // CONFIGURATION REQUIRED

		if (this.formID)
			this.init();

	}

	EmailDeliver.prototype.formatMessage = function () {

		var element = document.getElementById(this.formID);
		var name = element.querySelector("input#name").value;
		var email = element.querySelector("input#email").value;
		var subject = element.querySelector("input#subject").value;
		var message = element.querySelector("textarea#message").value;
		var textBody = "Nome: " + name + "\n\n" + message;

		var body = {
			"From": "mailman@elbit.com.br",
			"To": this.destination,
			"Subject": subject,
			"TextBody": textBody,
			"HTMLBody": textBody,
			"ReplyTo": email
		};

		console.log(JSON.stringify(body));

		var xhr = new XMLHttpRequest();
		xhr.open('POST', 'https://api.postmarkapp.com/email', true);
		xhr.setRequestHeader("Accept", "application/json");
		xhr.setRequestHeader("Content-Type", "application/json");
		xhr.setRequestHeader("X-Postmark-Server-Token", "POSTMARK_API_TEST");
		xhr.send(JSON.stringify(body));
		xhr.onload = function () {

			if (xhr.status >= 200 && xhr.status < 400) {

				try {
					console.log(xhr.responseText);
				} catch (ex) {
					console.log("Error parse: " + ex);
				}

			} else {
				console.log("Erro");
			}

		};

	};

	EmailDeliver.prototype.init = function () {

		this.destination ? this.formatMessage() : console.log('Destination missing');

	};

	return EmailDeliver;

})();

/* Jump.js based ES5 refactoring by Giulio Mainardi */
/* https://github.com/sitepoint-editors/smooth-scrolling */

initSmoothScrolling();

function jump(target, options) {
	var
		start = window.pageYOffset,
		opt = {
			duration: options.duration,
			offset: options.offset || 0,
			callback: options.callback,
			easing: options.easing || easeInOutQuad
		},
		distance = typeof target === 'string'
			? opt.offset + document.querySelector(target).getBoundingClientRect().top
			: target,
		duration = typeof opt.duration === 'function'
			? opt.duration(distance)
			: opt.duration,
		timeStart, timeElapsed
		;

	requestAnimationFrame(function(time) { timeStart = time; loop(time); });

	function loop(time) {
		timeElapsed = time - timeStart;

		window.scrollTo(0, opt.easing(timeElapsed, start, distance, duration));

		if (timeElapsed < duration)
			requestAnimationFrame(loop)
		else
			end();
	}

	function end() {
		window.scrollTo(0, start + distance);

		if (typeof opt.callback === 'function')
			opt.callback();
	}

	// Robert Penner's easeInOutQuad - http://robertpenner.com/easing/
	function easeInOutQuad(t, b, c, d)  {
		t /= d / 2
		if(t < 1) return c / 2 * t * t + b
		t--
		return -c / 2 * (t * (t - 2) - 1) + b
	}

}

/* Jump.js utilities functions */

function initSmoothScrolling() {

	var duration = 800;

	var pageUrl = location.hash
			? stripHash(location.href)
			: location.href
		;

	delegatedLinkHijacking();
	//directLinkHijacking();

	function delegatedLinkHijacking() {
		document.body.addEventListener('click', onClick, false);

		function onClick(e) {
			if (!isInPageLink(e.target))
				return;

			e.stopPropagation();
			e.preventDefault();

			jump(e.target.hash, {
				duration: duration,
				callback: function() {
					setFocus(e.target.hash);
				}
			});
		}
	}

	function directLinkHijacking() {
		[].slice.call(document.querySelectorAll('a'))
			.filter(isInPageLink)
			.forEach(function(a) { a.addEventListener('click', onClick, false); })
		;

		function onClick(e) {
			e.stopPropagation();
			e.preventDefault();

			jump(e.target.hash, {
				duration: duration
			});
		}

	}

	function isInPageLink(n) {
		return n.tagName.toLowerCase() === 'a'
			&& n.hash.length > 0
			&& stripHash(n.href) === pageUrl
			;
	}

	function stripHash(url) {
		return url.slice(0, url.lastIndexOf('#'));
	}

	// Adapted from:
	// https://www.nczonline.net/blog/2013/01/15/fixing-skip-to-content-links/
	function setFocus(hash) {
		var element = document.getElementById(hash.substring(1));

		if (element) {
			if (!/^(?:a|select|input|button|textarea)$/i.test(element.tagName)) {
				element.tabIndex = -1;
			}

			element.focus();
		}
	}

}

/* Mowe Logo 1.6 */

var Logo = (function () {

	/**
	 * SVG Logo request
	 * @param viewport {Element}
	 * @param url {string}
	 * @param fallback {object}
	 * @constructor
	 */
	function Logo(viewport, url, fallback) {

		var self = this;

		this.viewport = viewport;
		this.url = url;
		this.fallback = fallback;

		this.get();

	}

	/**
	 * Append to element
	 * @param toElement {Element}
	 * @param before {Element}
	 */
	Logo.prototype.appendTo = function (toElement, before) {

		if (!before)
			toElement.appendChild(this.viewport);
		else
			toElement.insertBefore(this.viewport, before);

	};

	/**
	 * Clone the logo and append to element
	 * @param toElement {Element}
	 */
	Logo.prototype.cloneTo = function (toElement) {

		toElement.innerHTML = this.content;

	};

	Logo.prototype.get = function () {

		var self = this;

		if (this.viewport && this.url) {

			var request = new XMLHttpRequest();
			request.open('GET', this.url, true);

			request.onreadystatechange = function() {

				if (this.readyState === 4)
					if (this.status == 200)
						if (this.responseText) {

							try {

								self.content = this.responseText;
								self.viewport.innerHTML = self.content;
								if (self.fallback)
									self.fallback();

							} catch (e) { }

						}

			};

			request.send();
			request = null;

		}

	};

	return Logo;

})();

/* Popover */

var Popover = (function () {

	/**
	 * Popover constructor
	 * @constructor
	 */
	function Popover(element, toggleList) {

		var self = this;

		this.element = element;
		this.toggleList = toggleList;

		this.onToggleMouseOver = function () {

			self.active();

		};

		this.onToggleMouseOut = function () {

			self.inactive();

		};

		this.onToggleTouch = function (event) {

			self.active();

		};

		this.onCloseClick = function (event) {

			self.inactive();

		};

		this.onBackdropTouch = function (event) {

			self.inactive();

		};

		if (element)
			this.init();

	}

	Popover.prototype.active = function () {

		this.element.classList.add('is-hover');

	};

	Popover.prototype.inactive = function () {

		this.element.classList.remove('is-hover');

	};

	Popover.prototype.addListeners = function () {

		for (var i = this.toggleList.length; i--; ) {


			this.toggleList[i].addEventListener('mouseover', this.onToggleMouseOver, false);
			this.toggleList[i].addEventListener('mouseout', this.onToggleMouseOut, false);
			this.toggleList[i].addEventListener('touchstart', this.onToggleTouch, false);

		}

		if (this.close)
			this.close.addEventListener('click', this.onCloseClick, false);

		if (this.backdrop)
			this.backdrop.addEventListener('touchstart', this.onBackdropTouch, false);

	};

	Popover.prototype.getElements = function () {

		this.close = this.element.querySelector('.Popover-close');
		this.backdrop = this.element.querySelector('.Popover-backdrop');

	};

	Popover.prototype.init = function () {

		this.getElements();

		this.addListeners();

	};

	return Popover;

})();

/* Required fields */

var RequiredField = (function () {

	/**
	 * Required Field constructor
	 * @constructor
	 */
	function RequiredField(viewport, fieldClass) {

		var self = this;

		this.viewport = viewport;

		this.input = {};
		this.fieldClass = fieldClass;

		this.onClick = function () {

			try {

				self.input.viewport.focus();

			} catch ( e ) { }

		};

		this.onFocus = function () {

			self.viewport.classList.add('has-focus');

			if (self.input.viewport.value)
				self.viewport.classList.remove('is-empty');

		};

		this.onBlur = function () {

			self.viewport.classList.remove('has-focus');

			if (!self.input.viewport.value)
				self.viewport.classList.add('is-empty');
			else
				self.viewport.classList.remove('is-empty');

		};

		this.onInput = function () {

			if (self.input.viewport.value) {
				self.viewport.classList.remove('is-empty');
				self.viewport.classList.add('has-label');
				self.viewport.classList.add('is-valid');
			} else {
				self.viewport.classList.remove('has-label');
				self.viewport.classList.remove('is-valid');
			}

		};

		if (this.viewport)
			this.init();

	}

	/**
	 * Normalize
	 */
	RequiredField.prototype.normalize = function () {

		if (this.input.viewport.value)
			this.viewport.classList.add('has-label');

	};

	/**
	 * Add the listeners
	 * It support IE8
	 */
	RequiredField.prototype.addListeners = function () {

		try {

			this.viewport.addEventListener('click', this.onClick, false);

			this.input.viewport.addEventListener('focus', this.onFocus, false);
			this.input.viewport.addEventListener('blur', this.onBlur, false);
			this.input.viewport.addEventListener('input', this.onInput, false);

		} catch ( e ) {	}

	};

	/**
	 * Get the input element
	 * @return {boolean}
	 */
	RequiredField.prototype.getInputElement = function () {

		this.input.viewport = this.viewport.querySelector(this.fieldClass);

		return !!this.input.viewport;

	};

	/**
	 * Init the instance
	 */
	RequiredField.prototype.init = function () {

		if (this.getInputElement())
			this.addListeners();

		this.normalize();

	};

	return RequiredField;

})();

/* Toggle */

var Toggle = (function () {

	/**
	 * Toggle constructor
	 * @constructor
	 */
	function Toggle(element, target, toggleStateClass) {

		var self = this;

		this.element = element;
		this.target = target;
		this.toggleStateClass= toggleStateClass;

		this.isActive = false;

		this.onMouseOver = function (event) {

			self.active();

		};

		this.onMouseOut = function (event) {

			self.inactive();

		};

		this.onClick = function (event) {

			self.toggle();

		};

		this.onTouchStart = function (event) {

			self.toggle();


		};

		if (this.element)
			this.init();

	}

	Toggle.prototype.active = function () {

		this.isActive = true;

		for (var i = this.target.length; i--; )
			this.target[i].classList.add(this.toggleStateClass);

	};

	Toggle.prototype.inactive = function () {

		this.isActive = false;

		for (var i = this.target.length; i--; )
			this.target[i].classList.remove(this.toggleStateClass);

	};

	Toggle.prototype.toggle = function () {

		if (this.isActive)
			this.inactive();
		else
			this.active();

	};


	Toggle.prototype.getCurrentState = function () {

		try {

			if (this.target.length)
				for (var i = this.target.length; i--; )
					if (this.target[i].classList.contains(this.toggleStateClass))
						return true;
					else if (this.target.classList.contains(this.toggleStateClass))
						return true;

		} catch (e) { }

		return false;

	};

	Toggle.prototype.addListeners = function () {

		if (this.element) {

			try {

				this.element.addEventListener('mouseover', this.onMouseOver, false);
				this.element.addEventListener('mouseout', this.onMouseOut, false);
				//this.element.addEventListener('click', this.onClick, false);
				this.element.addEventListener('touchstart', this.onTouchStart, false);

			} catch (e) { }

		}

	};

	Toggle.prototype.init = function () {

		this.addListeners();

		this.inactive();

	};

	return Toggle;

})();