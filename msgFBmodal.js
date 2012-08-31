(function($) {
	$.modelbox = function(config) {
		var defaults, options, modelbox, popup, header, close, content, footer, overlay, buttons, closeit;
		var box, boxcontent, loadgif, buttoncolor;  // more var settings, formatting
		
			defaults = {
				type			: 'info',  				// info OR warning	
				method			: 'text',				// text OR ajax
				href			: '', 					// the URL for AJAX method
				loaddata		: '', 					// the POST parameters to pass
				title			: 'My Title',
				text			: 'Default Text',
				loading			: 'Loading...',  		// text or html image
				width			: 300,
				callback		: function () {},
				closeTrigger	: true,
				escClose		: true,
				overlay			: true,
				overlayClose	: true,
				modaltop		: "30%",
				buttons			: 						// read next line
				[{
					'text'		: 'Ok',
					'color'		: 'blue',
					'callback'	: 						// function on next line
					function () {
						$.modelbox.close ();  
						options.callback (); 
					}
				}]
			};
		
		options = $.extend(defaults, config);
		
		// If a modal is already open, close it
		if($('.modelbox_popup').length)
		{
			$.modelbox.close (); 
		}
		
		
		modelbox = $('<div>',
		{ 
			'class' : 'modelbox',			
		}).css({'top':options.modaltop}).appendTo ('body');
		

		popup = $('<div>',
		{ 
			'class' : 'modelbox_popup' 
		}).appendTo(modelbox);
		
		contents = $('<div/>',{})
		if(options.title != '')
		{
			header = $('<div/>',
			{ 
				'class' : 'title', 'html': options.title
			})
			if(options.closeTrigger)
			{
				closeit = $('<a>',
				{ 
					'href': '#'
					, 'class': 'modelbox_popup_close'
					, 'click': close
				}).appendTo(header);	
			}	
			header.appendTo(contents);
		}
		
		
		$('<div>', {
			'class': 'fbcontainer'
		}).appendTo(contents);
		
		
		if(options.method == 'text'){
			content = $('<div/>', {'class': 'fbcontent', 'html': options.text}).appendTo(contents);
		}
		else if(options.method == 'ajax'){
			content = $('<div/>', {'class': 'fbcontent', 'html': options.loading}).wrapInner('<div class="fbloading" />').appendTo(contents);
		}
		
	
		footer = $('<div/>', { 
			'class': 'footer' 
		});			
		




		if (options.type == 'warning') {
			options.buttons = [{ 
				'text': 'Yes'
				, 'color': 'blue'
				, 'callback': function () { 
					options.callback (); 
					$.modelbox.close (); 
				} 
			}, { 
				'text': 'No'
				, 'color': 'grey'
				, 'callback': function () { $.modelbox.close (); }	
			}, {
				'text': 'Cancel'
				, 'color': 'grey'
				, 'callback': function () { $.modelbox.close ();	}	
			}];		
		}

		buttons = $('<div/>', { 
			'class': 'right' 
		});	
		
		if (options.buttons.length > 0) {
			for (key in options.buttons) {
				// apply correct classes based on color option
				buttoncolor = ( options.buttons[key].color === "blue") ? "button_outside_border_blue" : "button_outside_border_grey";
				$('<div>', { 'text': options.buttons[key].text, 'class': buttoncolor })
					.wrapInner(function(){
						if(options.buttons[key].color === 'blue')
							{return '<div class="button_inside_border_blue" />';}
						else if(options.buttons[key].color === 'grey')
							{return '<div class="button_inside_border_grey" />';}
						})
					.bind ('click', options.buttons[key].callback)
					.appendTo (buttons);
			}
		}
		
		buttons.appendTo(footer);
		footer.appendTo(contents);


		boxcontent = $('<div id="body"></div>');
		boxcontent.css({'width':options.width}).appendTo(popup);
		
		
		
		popup.find('#body').append(contents);
		
		modelbox.appendTo ('body');
		fbWidth();
		
		if(options.method == 'ajax'){
			$.ajax({
				type	: "POST",
				url		: options.href,
				data	: options.loaddata,
				success	: function(getdata){
					$('.fbcontent').html(getdata);
				},
				error	: function(){
					$('.fbcontent').html("Failed to Load Content");
				}
			});	
		}
	

		if (options.overlay) {
			overlay = $('<div/>', {
				'class': 'modelbox_overlay'
			}).appendTo ('body');
			
			if (options.overlay && options.overlayClose) {
				overlay.bind ('click', close);
			}
		}

		if (options.escClose) {
			$(document).bind ('keyup.modelbox', function (e) { 
				if (e.keyCode == 27) { 
					$.modelbox.close (); 
				} 
			});
		}
		
		$(window).bind("resize", function(){
			fbWidth();
		});
		
		function fbWidth(){ 
			var windowWidth=$(window).width();
			var modelboxWidth=$(".modelbox").width();
			var fbWidth=windowWidth / 2 - modelboxWidth / 2;
			$(".modelbox").css("left",fbWidth);
	    }
		
		function close (e)
		{
			//console.log("Closing");			
			e.preventDefault ();
			$.modelbox.close ();
		}
	};

	$.modelbox.close = function () {
		$('.modelbox').fadeOut('fast', function () {
			$(this).remove (); 
			$('.modelbox_overlay').remove();
		});
	}
})(jQuery);