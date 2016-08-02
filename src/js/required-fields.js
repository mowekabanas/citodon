
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