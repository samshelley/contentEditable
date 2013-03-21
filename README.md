contentEditable
===============

This plugin fixes the copy/cut/paste and drag and drop problems that happen when you make something contenteditable.

There are a lot of full featured wysiwyg editors--all this plugin does it make sure that you can only paste plain-text into content editable fields.

This is useful if you want the the benefits of using a div/span as a contenteditable text input box (as opposed to an input), but don't want to let users paste in full HTML objects.

This will work much better once all browsers implement clipboardData handlers. For now, it works best in IE/Chrome/Safari

This doesn't work in Firefox but it looks like they are adding clipboardData to nightly builds soon (as of March 19, 2013)

Known Issues:
 * doesn't work with firefox/IE <8 (although ie8 is definitely possible)
 * breaks undo/redo
 * doesn't imitate drag and drop selection

Works in IE 8-10, Chrome, Safari (untested in IE for now)
