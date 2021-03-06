/**
 * Label jQuery plugin.
 * For a given selection, gets the label and puts it as a value for its 
 * related input.
 * If you select a form, it searchs for labels inside the form. If you
 * select an input it tries to get the label related to that input, and if
 * you select a
 * 
 * MIT License
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * @todo Make a better filter when the form is submitted, for ajax inputs it 
 *       will be a problem. If you only work with normal form-tags it will 
 *       work like a charm.
 * @author Augusto Pascutti <augusto [at] phpsp [dot] org [dot] br>
 */
(function($) {
  $.fn.jLabel = function(settings) {
    var config = 
		{
			/**
			 * Classname to be put into the INPUT tags for event binding
			 * and styling
			 *
			 * @var string
			 */
			'className' : 'live-label',
			/**
			 * If TRUE, hides the found labels afeter inserting them 
			 * into the corresponding input
			 *
			 * @var boolean
			 */
			'hideLabel': true,
			/**
			 * If TRUE cleans the value of the input before applying
			 * the label to it.
			 *
			 * @var boolean
			 */
			'overwriteValue': false,
			/**
			 * Input types listed here are ignored by the plugin
			 *
			 * @var Array
			 */
			'ignoreTypes': ['checkbox','radio']
		};

    if (settings) $.extend(config, settings);

	/**
	 * Log function
	 */
	function log() {
		if ( window.console.log == undefined ) return;
		
		$(arguments).each(function() {
			window.console.log(this);
		});
	}
	
	// Registers the live events (focus/blur)
	$('.'+config.className).live('focus',function() {
		_data  = $(this).data('jLabel');
		_val   = $(this).val();
		
		if ( _data == undefined || _data == "" ) return false;			
		if ( _val == _data ) $(this).val("");
	}).live('blur', function() {
		_data  = $(this).data('jLabel');
		_val   = $(this).val();
		
		if ( _data == undefined || _data == "" ) return false;
		if ( _val.length <= 0 ) $(this).val(_data);
	});
	// Register submit event to remove value from the inputs
	$('form').submit(function() {
		$('.'+config.className).each(function() {
			_val  = $(this).val();
			_data = $(this).data('jLabel');
			
			if ( _data == undefined || _data == "" ) return true;
			if ( _val == _data ) {
				$(this).val('');
			}
		});
	});
	
	// Iterates between the selected elements in search of labels
    this.each(function() {
		var collection = [];
		switch (this.tagName) {
			case 'FORM':
				collection = $('label', this).get();
				break;
			case 'INPUT':
				id = $(this).attr('id');
				if ( id == undefined || id == "" ) break;
				collection = $('label[for='+id+']').get();
				break;
			case 'LABEL':
				collection = [this];
				break;
			default:
				collection = [];
				break;
		}
		if ( collection.length <= 0 ) return true;
		
		$(collection).each(function() {
			_for   = $(this).attr('for');
			if ( _for == undefined || _for == "" ) return true;

			_value = $(this).html();
			_for   = $('#'+_for);
			
			// Veryfying ignored types
			var ignore = false;
			$(config.ignoreTypes).each(function() {
				if ( _for.attr('type') == this ) {
					ignore = true;
					log('Ignorar');
					return true;
				}
			});
			if (ignore) return true;
			
			if ( $(_for).size() <= 0 ) return true;
			// Apply class and data to focus/blur events
			_for.data('jLabel',_value)
				.addClass(config.className);
			// What to do with the current val of the input
			if ( config.overwriteValue ) {
				_for.val(_value);
			} else if (_for.val().length <= 0) {
				_for.val(_value);
			}
			// Hide label after applying it the input
			if ( config.hideLabel ) $(this).hide();
		});
    });

    return this;
  };
})(jQuery);
