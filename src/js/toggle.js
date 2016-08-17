
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

			console.log(event);

			self.inactive();

		};

		this.onClick = function (event) {

			self.toggle();

		};

		this.onTouchStart = function (event) {

			self.toggle();

			console.log(event);

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