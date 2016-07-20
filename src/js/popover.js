
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