(function($) {
	$.fbmodal = function(config) {
		var defaults, options, fbmodal, popup, header, close, content, footer, overlay, buttons, closeit;
		var table, rowBot, rowTop, rowMid, loadgif, buttoncolor;  // more var settings, formatting
			defaults = {
				type: 'info'  	//  info, warning	
				, method: 'text'	// text, ajax
				, href:	'' // the URL for ajax method
				, loaddata: '' // the POST parameters to pass
				, title: 'My Title' 
				, text: 'Default Text' 
				, loading : "Loading..."  // text or html image 
				, width: 300
				, callback: function () {}
				, closeTrigger: true
				, escClose: true
				, overlay: true
				, overlayClose: true
				, modaltop	: "30%"
				, buttons: [{
					'text': 'Ok'
					, 'color': 'blue'
					, 'callback': function () {
						$.fbmodal.close ();  
						options.callback (); 
					}
				}]
			};
		
		options = $.extend(defaults, config);
		
		// if a modal is already open, close it
		// you should be able to comment out this bit if you want many fbmodal windows
		if($('.fbmodal_popup').length){
			$.fbmodal.close (); 
			}
		
		
		fbmodal = $('<div>', { 
			'class' : 'fbmodal',			
		}).css({'top':options.modaltop}).appendTo ('body');
		

		popup = $('<div>', { 
			'class' : 'fbmodal_popup' 
		}).appendTo(fbmodal);
		
		contents = $('<div/>',{})
		if(options.title != ''){
			header = $('<div/>', { 
				'class' : 'title', 'html': options.title
			})
			if(options.closeTrigger) {
				closeit = $('<a>', { 
					'href': 'javascript:;'
					, 'class': 'fbmodal_popup_close'
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
					$.fbmodal.close (); 
				} 
			}, { 
				'text': 'No'
				, 'color': 'grey'
				, 'callback': function () { $.fbmodal.close (); }	
			}, {
				'text': 'Cancel'
				, 'color': 'grey'
				, 'callback': function () { $.fbmodal.close ();	}	
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


		rowTop = '<table><tbody><tr><td class="tl"></td><td class="b"></td><td class="tr"></td></tr>';
		rowMid = '<tr><td class="b"></td><td id="body"></td><td class="b"></td></tr>';
		rowBot = '<tr><td class="bl"></td><td class="b"></td><td class="br"></td></tr></tbody></table>';
		
		table = $(rowTop+rowMid+rowBot);
		table.css({'width':options.width}).appendTo(popup);
		
		
		
		popup.find('#body').append(contents);
		
		// Do later for an X close checkbox
/*		if (options.closeTrigger) {
			close = $('<a>', { 
				'href': 'javascript:;'
				, 'class': 'msgAlert_close'
				, 'click': close
			}).appendTo (header);	
		}		*/
		
		fbmodal.appendTo ('body');
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
				'class': 'fbmodal_overlay'
			}).appendTo ('body');
			
			if (options.overlay && options.overlayClose) {
				overlay.bind ('click', close);
			}
		}

		if (options.escClose) {
			$(document).bind ('keyup.fbmodal', function (e) { 
				if (e.keyCode == 27) { 
					$.fbmodal.close (); 
				} 
			});
		}
		
		$(window).bind("resize", function(){
			fbWidth();
		});
		
		function fbWidth(){ 
			var windowWidth=$(window).width();
			var fbmodalWidth=$(".fbmodal").width();
			var fbWidth=windowWidth / 2 - fbmodalWidth / 2;
			$(".fbmodal").css("left",fbWidth);
	    }
		
		function close (e)
		{
			//console.log("Closing");			
			e.preventDefault ();
			$.fbmodal.close ();
		}
	};

	$.fbmodal.close = function () {
		//$('.fbmodal_overlay').fadeOut ('fast', function () { $(this).remove (); });
		$('.fbmodal').fadeOut('fast', function () {
			$(this).remove (); 
			$('.fbmodal_overlay').remove();
		});
		//$(document).unbind ('keyup.msgAlert');
	}
})(jQuery);