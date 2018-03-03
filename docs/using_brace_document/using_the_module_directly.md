## Using the module pragmatically 

---
### Brace document pages
* [Contributer code of conduct](https://github.com/restarian/brace_document/blob/master//contributer_code_of_conduct.md)
* [Guidelines for contributing](https://github.com/restarian/brace_document/blob/master//guidelines_for_contributing.md)
* [Synopsis](https://github.com/restarian/brace_document/blob/master//synopsis.md)
* Specification
  * [License information](https://github.com/restarian/brace_document/blob/master//specification/license_information.md)
  * [Package information](https://github.com/restarian/brace_document/blob/master//specification/package_information.md)
  * [Unit test output](https://github.com/restarian/brace_document/blob/master//specification/unit_test_output.md)
* The plugin system
  * [Allocating plugins on the system](https://github.com/restarian/brace_document/blob/master//the_plugin_system/allocating_plugins_on_the_system.md)
  * [The callback and accociated data](https://github.com/restarian/brace_document/blob/master//the_plugin_system/the_callback_and_accociated_data.md)
  * [The module outline and structure](https://github.com/restarian/brace_document/blob/master//the_plugin_system/the_module_outline_and_structure.md)
* Using brace document
  * [Command line usage](https://github.com/restarian/brace_document/blob/master//using_brace_document/command_line_usage.md)
  * **Using the module directly**

Brace document can be utilized by importing either the *lib -> brace_document.js* or *lib -> document_parse.js* modules. The *brace_document.js* script is 
used by the CLI to set extra data for convenience and thusly requires a option object to be passed into the constructor. 

Setting option data to the *brace_document.js* module is done by passing an Object literal or [commander](https://npmjs.org/packages/commander) instance into the constructor call as the first argument. This parameter is non-optional so an empty object must at least be passed in to the constructor call. 

Setting options data to the *document_parse.js* is done by adding properties to the *options* instance property. 

The parameter syntax for the two modules are as follows:
```require("./lib/brace_document.js")(<Commander instance, Object litteral>, [Bracket print instance], [success callback], [error callback])```
```require("./lib/document_parse.js")([Bracket print instance], [success callback], [error callback])```

The options below are only used within the *brace_document.js* module:

* *plugins* - outputs the available plugins
* *help* - outputs the help screen
* *color* - toggles color printing of log messages
* *quiet* - turns off all log messages 
* *verbose* - print superfluous log messages 

Below is a print-out of all the default option data which can be set (or passed), to the imported modules scripts. Note: the default values of the module option are the same as the defaults for the CLI. 

```javascript
document_parse.option = {
	sort: "native", 
	projectLocation: process.cwd(),
	reverseSort: false,
	recursive: false, 
	enableAll: false,
	backup: "",
	pluginPath: "",
	pluginEnable: "",
	pluginRegex: "^(brace|batten|bracket)[\_,\-]document[\_,\-]"
}
```

#### Below are two example snippets of how to set option data directly to the *brace_document.js* or *document_parse.js* modules.
```javascript
// Note: The Bracket print module instance parameter is optional. It is loaded automatically if not included as a parameter.
var option = {
	recursive: true,
	sort: "depth" ,
	reverseSort: true,
	projectLocation: "./",
	input: "./docs_raw",
	backup: "../../docs",
	color: false
}

var parser = require("./lib/brace_document.js")(option, [Bracket print])

```

```javascript
// Note: The bracket print module instance parameter is optional as it is also loaded automatically if not included.
var parser = require("./lib/document_parse.js")([Bracket print])

parser.option.recursive = true
parser.option.sort = "depth" 
parser.option.reverseSort = true
// This can be outside the project location as long as relative_docs dir is not.
parser.option.projectLocation = "./"
parser.option.input = "./docs_raw"
parser.option.backup = "../../docs"

// It is fine to use absolute or relative paths when setting the *projectLocation*, *input* or *backup* options. The input directory can be outside the 
// project location as long as the backup option is set to a path at or below the project location. 
```


#### There are a couple of unique circumstances when using the module as a script vs uses the CLI
The *pluginEnable* option is unique to a imported Brace_document module. This option contains a contains a string of comma separated plugin module names. It is not accessible via the CLI and is used to determine what plugins should be called from the list of available plugins.
E.g. ```document_parser.option.pluginEnable = "navlink, yourPlugin"```
 
