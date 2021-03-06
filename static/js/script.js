$("#addchoice").click(function(){
		$(".box-o-choices").append('<input type="text" class="form-control" placeholder="Go hiking, buy the item, sell etc.">');
		amountOfInputs = $(".box-o-choices").find('input');
	});
	var time = 0,
		timeStep = 0,
		timeToStart = 0,
		amountOfInputs = $(".box-o-choices").find('input');

	var effectNames = [
		'singular'
	];

	$("#roll").click(function(){
			timeToEnd = Date.now()+getRandomInt(1000*(amountOfInputs.length), 1000*(amountOfInputs.length+1)*1.1);
			interateEffectsAndPick();
	});
	function interateEffectsAndPick(interations, choice){
		if(!setTime())
			doEffects(effectNames[getRandomInt(0, effectNames.length)]);
		else {
			// In this case, no choice is gonna be done
			// So we choose the first choice
			console.log("got exception");
			amountOfInputs.eq(0).addClass("pick");
		}
	}
	function doEffects(effect){
		if(effect == "singular"){
			console.log("running singular effect");
			if(singularEffect(0)) console.log("Singular is done and returned true!");
		} 
		else
		amountOfInputs.each(function(index){
			console.log("OKAY:"+index);
			setTime();
			if(effect == "waterfall") {
				$(this).addClass("pick");
				if(setTime()) return;
				setTimeout(function() {
					$(this).removeClass("pick");
				}.bind(this), 75*(index+1));
			} else if (effect == "random"){

			} else if (effect == "gradientWaterfall"){
				if(setTime()) {
					$(this).addClass("pick");
					return;
				}
				setTimeout(function() {
					$(this).addClass("pick");
					setTimeout(function() {
						$(this).removeClass("pick");
					}.bind(this), 50*(index+1));
				}.bind(this), 50*(index+0));
			}
		}).promise().done(function(){
			console.log("Do effects, for each promise is done");
			interateEffectsAndPick();
		});
	}
	function singularEffect(index){
		// Try not to get outofbounds
		if(setTime()) {
			console.log("Time is up, setting to index:"+index)
			if (index >= amountOfInputs.length) {
				console.log("Got an exception and set answer to 1");
				amountOfInputs.eq(0).addClass("pick"); 
			} else {
				amountOfInputs.eq(index).addClass("pick");
			}
			return false;
		}
		if(index >= amountOfInputs.length) {
			console.log("Exiting singularEffect, inputs "+amountOfInputs.length+", index "+index);
			interateEffectsAndPick();
			return true;
		} else {
			// Do promise
			var p1 = new Promise(function(resolve, reject){
				amountOfInputs.eq(index).addClass("pick");
				var timeoutTime = 0;
				console.log(timeToEnd-Date.now());
				if (timeToEnd-Date.now() >= 4000) {
					timeoutTime = 65;
				} else {
					timeoutTime = 65+(4000 - (timeToEnd-Date.now()))/4	;
					console.log("TimeoutTime:"+timeoutTime);
				}
				setTimeout(function() {
					amountOfInputs.eq(index).removeClass("pick");
					resolve();
				}, timeoutTime);
			});
			p1.then(function(){
				console.log("Calling on singular");
				singularEffect(++index);
			});
			
			
		}
	}
	function setTime(){
		if(timeToEnd-Date.now() >= 0){
			console.log("returning false");
			return false;
		} else {
			console.log("returning true");
			return true;
		}
	};
	function getRandomInt(min, max) {
  		return Math.floor(Math.random() * (max - min)) + min;
	}