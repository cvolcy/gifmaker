(function () {

	var server = io.connect(window.location.origin);
	var app = {};
	var is_generating = false;

	app.generate_gif = function(e) {
		if ((e.which === 13 || e.which === 1) && !is_generating) {
			if (!$('form').valid())
				return false;
			e.preventDefault();
			var url = $('.form-text').val();
			if (url != "") {
				data = app.serializeObject($("form"));
				data.abstatus = !!$("[data-ad-slot] iframe").length;
				if (data.starttime == "")
					data.starttime = "00:00:00";
				if (data.endtime == "")
					delete data.endtime;
				server.emit('generate', data);
				$(".progress").fadeIn();
				is_generating = !is_generating;
			}
		}
	}

	app.serializeObject = function(form) {
		var o = {};
		var a = form.serializeArray();
		$.each(a, function() {
			if (o[this.name] !== undefined) {
				if (!o[this.name].push) {
					o[this.name] = [o[this.name]];
				}
				o[this.name].push(this.value || '');
			} else {
				o[this.name] = this.value || '';
			}
		});
		return o;
	};

	app.errorMessage = function (err) {
		$(".error-message").text(err.message).fadeIn('fast', function(){
			errorMessage = this
			setTimeout(function(){
				$(errorMessage).fadeOut();
			}, 6000);
		});
	}

	server.on('connect', function(data) {
	})

	server.on('completed', function(data){
		// console.log(data);
		document.location.href = data.url;
	});

	server.on('progress', function(progress){
		$(".progress .progress-bar").css("width", parseInt(progress*100)+ "%").text(parseInt(progress*100) + " %");
	});

	server.on('fail', function(err){
		app.errorMessage(err);
		$(".progress").fadeOut();
		is_generating = false;
	});

	$('.form-submit').on('click', app.generate_gif);

	$('.form-text')
	.on('keypress', app.generate_gif)
	.focus()

	$("form").validate();
	$.validator.addMethod(
		"regex",
		function(value, element, regexp) {
			var re = new RegExp(regexp);
			return this.optional(element) || re.test(value);
		},
		"Please check your input."
		);
	$(".timerange-container input[type=text]").each(function(){
		$(this).rules("add", { regex: "^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$" });
	});
})();

$(function(){
	if (!$("[data-ad-slot] iframe").length) {
		$("script + script + script + script + div").fadeIn(4000, function(){
			var warning = this;
			setTimeout(function(){
				$(warning).fadeOut(2000);
			}, 15000);
		});
	}
});
