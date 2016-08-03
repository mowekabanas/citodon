/*!
 * Mowe Citodon Project v0.0.1 (http://letsmowe.org/)
 * Copyright 2013-2016 Mowe Developers
 * Licensed under MIT (https://github.com/mowekabanas/citodon/blob/master/LICENSE)
*/

/* Mowe Logo 1.0 */

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

		toElement.appendChild(this.viewport.cloneNode(this.viewport));

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

								self.viewport.innerHTML = this.responseText;
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
	function Popover(element) {

		var self = this;

		this.element = element;

		this.isShown = true;

		try {

			this.element.addEventListener('mouseleave', function () {

				self.hide();

			});

		} catch (e) {}

	}

	Popover.prototype.show = function () {

		this.isShown = true;

		try {

			this.element.classList.add('is-shown');

		} catch (e) {}

	};

	Popover.prototype.hide = function () {

		this.isShown = false;

		try {

			this.element.classList.remove('is-shown');

		} catch (e) {}

	};

	Popover.prototype.toggle = function () {

		if (this.isShown)
			this.hide();
		else
			this.show();

	};

	Popover.call = function (id) {

		var popover = document.getElementById(id);

		try {

			if (popover.classList.contains('Popover')) {

				return new Popover(popover);

			}

		} catch (e) {

			return false;

		}

		return false;

	};

	return Popover;

})();