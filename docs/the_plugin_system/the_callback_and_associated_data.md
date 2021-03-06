# Brace Document
## Using the shared platform data

---
### Brace Document help pages
* [Contributor code of conduct](https://github.com/restarian/brace_document/blob/master/docs/contributor_code_of_conduct.md)
* [Guidelines for contributing](https://github.com/restarian/brace_document/blob/master/docs/guidelines_for_contributing.md)
* [Synopsis](https://github.com/restarian/brace_document/blob/master/docs/synopsis.md)
* Specification
  * [License information](https://github.com/restarian/brace_document/blob/master/docs/specification/license_information.md)
  * [Package information](https://github.com/restarian/brace_document/blob/master/docs/specification/package_information.md)
  * [Unit test output](https://github.com/restarian/brace_document/blob/master/docs/specification/unit_test_output.md)
* The plugin system
  * [Allocating plugins on the system](https://github.com/restarian/brace_document/blob/master/docs/the_plugin_system/allocating_plugins_on_the_system.md)
  * **The callback and associated data**
  * [The module outline and structure](https://github.com/restarian/brace_document/blob/master/docs/the_plugin_system/the_module_outline_and_structure.md)
* Using brace document
  * [Command line usage](https://github.com/restarian/brace_document/blob/master/docs/using_brace_document/command_line_usage.md)
  * [Using the module directly](https://github.com/restarian/brace_document/blob/master/docs/using_brace_document/using_the_module_directly.md)

---

### IMPORTANT: Be sure to mind the *dryRun* option when creating additional plugins.
A plugin dry run execution should call **all** of methods/members that would be normally be called without making changes which are considered mutating.

Examples of mutating changes are:
* writing to, or deleting from the file system
* creating and/or removing links from the file system
* running system programs which alter things outside the plugin script
* altering any object which is not directly derived from the Brace Document and/or plugin modules. Examples of this are: altering the Object.prototype or a property of a loaded module.

### Creating the plugin constructor
The plugin must be a function as the require/import call. This function is passed the Brace Document instance object as the first argument. This is the only way the plugin can acquire the Brace Document module object.

### Creating the plugin callback function
All plugin calls must also return an object which contains a property named *runThrough*. The *runThrough* property must be a function. This function will be called with the *structure* and *data* objects as the first and second argument. The *runThrough* function must also call a callback (*the third argument*), when it has finished so that subsequent plugins can be called when it finishes.
Note: the plugin will timeout if the callback is not called and the plugin calls will commence.

### Learning how to create plugins by example
#### The following code snippets are to demonstrate the concept of plugin module creation.

Below is the minimum structure needed to create a Brace Document plugin
```javascript
module.exports = function() {
	this.runThrough = function(structure, data, cb) {
		// The callback must be called when the plugin finises so that the other
		// plugins are called.
		cb()
	}
	return this
}

// Here is another way of doing the same thing as above but with prototypes
var plugin = function() { }
plugin.prototype.runThrough = function(structure, data, cb) {
	// The callback must be called when the plugin finises so that the other
	// plugins are called.
	cb()
}
module.exports = plugin
```

This example plugin contains all of the data which is available to the plugins:
```javascript

// The brace_document_instance and bracket_print_instance arguments are optional
// but it is recommeded to save these to the plugin constructor like below.

module.exports = function(document_parse_instance, bracket_print_instance) {

	// The API members in here can be used within the plugins for advanced usage.
	this.parser = brace_document_instance
	// Setting the options from the parser to the plugin is reccomended sense the
	// option data collected from all of the plugins will be available in it.
	this.option = this.parser.option

	this.runThrough = function(structure, data, cb) {
		// The callback must be called when the plugin finises so that the other
		// plugins are called.
		cb()
	}
	return this
}
```

**Note: both the *structure* and *data* objects can/are mutated by the various plugins. Any one particular plugin must consider if/how another plugin may have mutated the structure and/or data objects in order to prevent an error condition.**

### The *structure* object
The *structure* object is an Array generated by the **document_parse.createStructure** API member and is the first parameter passed into the *runThrough* method returned by the plugin require/import function call. It is representative of the directories and files which will be created by the **document_parse.createStructure** API member. The object entries can be re-ordered to create a different directory structure before *createStructure* is called.
Directories are denoted as Objects within the structure Array. The first key of the Object is the only value used when creating directories. Files are stored as string entries in the Array. The file string entry also serves as a unique key which correlates to the *data* object.

### The *data* object
The *data* object is an object generated by the **document_parse.acquireData** API member and is the second parameter passed into the *runThrough* callback. This object stores all of the file content which can mutated by the other plugins. The object keys in this object are paths which correspond to the *structure* object paths. This is the method of determining where they will end up in the output directory structure.
