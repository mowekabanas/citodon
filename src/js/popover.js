
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

		this.onToggleClick = function (event) {

			self.element.classList.add('is-hover');

		};

		this.onCloseClick = function (event) {

			self.element.classList.remove('is-hover');

		};

		this.onBackdropTouch = function (event) {

			self.element.classList.remove('is-hover');

		};

		if (element)
			this.init();

	}

	Popover.prototype.addListeners = function () {

		for (var i = this.toggleList.length; i--; )
			this.toggleList[i].addEventListener('click', this.onToggleClick, false);

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