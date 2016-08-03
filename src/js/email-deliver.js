
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