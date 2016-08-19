
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

		this.onToggleClick = function (event) {

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
			this.toggleList[i].addEventListener('click', this.onToggleClick, false);

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