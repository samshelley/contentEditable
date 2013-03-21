/**
 * @author Sam Shelley
 *
 * This plugin fixes the copy/cut/paste and drag and drop
 * problems that happen when you make something contenteditable.
 *
 * There are a lot of full featured wysiwyg editors--all this plugin
 * does it make sure that you can only paste plain-text into content
 * editable fields.
 *
 * This is useful if you want the the benefits of
 * using a div/span as a contenteditable text input box (as opposed
 * to an input), but don't want to let users paste in
 * full HTML objects.
 *
 * This will work much better once all browsers implement
 * clipboardData handlers. For now, it works best in IE/Chrome/Safari
 *
 * This doesn't work in Firefox but it looks like they are adding clipboardData
 * to nightly builds soon (as of March 19, 2013)
 *
 * Known Issues:
 *  - doesn't work with firefox/IE <8 (although ie8 is definitely possible)
 *  - breaks undo/redo
 *  - doesn't imitate drag and drop selection
 *
 * Works in IE9-10, Chrome, Safari
 */
(function( $ ) {
    $.fn.contentEditable = function() {

        this.on("paste", function(evt) {
            if(evt.originalEvent.clipboardData || window.clipboardData)  {
                evt.preventDefault();
                //webkit (and bleeding edge Firefox)
                var selection = window.getSelection ? window.getSelection() : document.selection;
                var range = selection.getRangeAt ? selection.getRangeAt(0) : selection.createRange();

                //prepare new range selection

    			var startingCaretPosition = range.startOffset;

				//place the pasted content at the cursor position within
				//the div
				var $target = $(evt.target);
				var clipboard = evt.originalEvent.clipboardData ? evt.originalEvent.clipboardData.getData("text/plain") :
					window.clipboardData.getData("Text");
				var newText = $target.text().substring(0,range.startOffset) +
				clipboard +
				$target.text().substring(range.endOffset,$target.text().length);
				$target.text(newText);

				//create a new selection range so that the cursor is at the end
				//of the newly pasted content
				var targetNode = evt.target;
				if(window.getSelection) { // webkit
					if(evt.target.childNodes.length > 0) targetNode = evt.target.childNodes[0];
					var newRange = document.createRange();
					newRange.setStart(targetNode,startingCaretPosition+clipboard.length);
					newRange.setEnd(targetNode,startingCaretPosition+clipboard.length);
					if(selection.rangeCount > 0) selection.removeAllRanges();
					selection.addRange(newRange);
				} else { //IE
					if(evt.target.childNodes.length > 0) targetNode = evt.target.childNodes[0];
					
					var newRange = document.selection.createRange();
					newRange.moveToElementText(evt.target);
					newRange.setStart(targetNode,startingCaretPosition+clipboard.length);
					newRange.setEnd(targetNode,startingCaretPosition+clipboard.length);
					newRange.select();
				}
            }
        });
        this.on("drop", function(evt) {
            evt.preventDefault();
            console.log(window.getSelection().getRangeAt(0));
            var clipboard = evt.originalEvent.dataTransfer ? evt.originalEvent.dataTransfer.getData("text/plain") :
                window.event.dataTransfer.getData("Text");

            var range, caretPosition;
            if (document.caretPositionFromPoint) { //w3
                range = caretPositionFromPoint(evt.originalEvent.clientX, evt.originalEvent.clientY);
                caretPosition = range.startOffset;
            } else if (document.caretRangeFromPoint) { //webkit
                range = document.caretRangeFromPoint(evt.originalEvent.clientX, evt.originalEvent.clientY);
                caretPosition = range.startOffset;
            } else if(evt.originalEvent.rangeOffset) { //Firefox
                caretPosition = evt.originalEvent.rangeOffset;
            } else { //IE
                range = document.body.createTextRange();
                range.moveToPoint(evt.originalEvent.clientX, evt.originalEvent.clientY);
                range.select();
                caretPosition = range.startOffset;
            }
            var $target = $(evt.target);
            var newText = $target.text().substring(0,caretPosition) +
                clipboard +
                $target.text().substring(caretPosition,$target.text().length);
            $target.text(newText);
        });
        /* firefox solution is not smooth enough -- will implement later
         if(!window.Clipboard && !window.clipboardData) { //its firefox
             this.after("<div class='cursor'>&nbsp;</div>");
             var cursor = this.next();
             cursor.attr("style","top:"+(this.offset().top+4)+";left:"+(this.offset().left+this.width()+5)+";");

             this.after("<input style='opacity:0;' />");
             var input = this.next();
             var _this = this;
             this.on("focus", function() {
                 $(_this).next().focus();
             });
             input.on("keyup", function(evt) {
                 console.log(evt);
                 _this.text(_this.text()+String.fromCharCode(evt.which));
                 cursor.attr("style","top:"+(_this.offset().top+4)+";left:"+(_this.offset().left+_this.width()+5)+";");
             });
         }*/


    };
})( jQuery );
