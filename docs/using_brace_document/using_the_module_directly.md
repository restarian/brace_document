## Using the module directly 

---
### Brace document pages
* [Contributer code of conduct](https://github.com/restarian/brace_document/blob/master/docs/contributer_code_of_conduct.md)
* [Guidelines for contributing](https://github.com/restarian/brace_document/blob/master/docs/guidelines_for_contributing.md)
* [Synopsis](https://github.com/restarian/brace_document/blob/master/docs/synopsis.md)
* Specification
  * [License information](https://github.com/restarian/brace_document/blob/master/docs/specification/license_information.md)
  * [Package information](https://github.com/restarian/brace_document/blob/master/docs/specification/package_information.md)
  * [Unit test output](https://github.com/restarian/brace_document/blob/master/docs/specification/unit_test_output.md)
* The plugin system
  * [Allocating plugins on the system](https://github.com/restarian/brace_document/blob/master/docs/the_plugin_system/allocating_plugins_on_the_system.md)
  * Creating additional plugins
    * [The callback and accociated data](https://github.com/restarian/brace_document/blob/master/docs/the_plugin_system/creating_additional_plugins/the_callback_and_accociated_data.md)
    * [The module outline and structure](https://github.com/restarian/brace_document/blob/master/docs/the_plugin_system/creating_additional_plugins/the_module_outline_and_structure.md)
* Using brace document
  * [Command line usage](https://github.com/restarian/brace_document/blob/master/docs/using_brace_document/command_line_usage.md)
  * **Using the module directly**

Brace_document can be utilized by importing either the *brace_document.js* or *document_parse.js* scripts. The *brace_document.js* script is 
used by the CLI to set extra data needed for convenience and thusly requires a option object to be passed into the constructor. 
This object can either be a [commander](https://npmjs.org/packages/commander) instance or an object literal containing the option data. 

**Below is a print-out of the default option data which can be set/passed to the scripts when importing them. Note: the default values of the module option are the same as the defaults for the CLI.** 
```javascript
document_parse.option = {
	sort: "native", 
	reverseSort: false,
	recursive: false, 
	enableAll: false,
	backup: "",
	pluginPath: "",
	pluginEnable: "",
	pluginRegex: "^brace_document_.*"
}
```

All of the Brace_document options which are are available via the command line script are also available by setting them directly to the *document_parse.js* module. The few exceptions are as follows: 
	* -h, --help *This option is used only by the cli program to ouput the usage text.
	* --plugins *This option is used only by the cli program to output the available plugins to the program from the execution location.

#### Below is an example of how to set option data directly to the *document_parse.js* module.
```javascript
// Note: The bracket print module instance parameter is optional as it is also loaded automatically if not included.

var parser = require([Bracket print])

parser.option.recursive = true
parser.option.sort = "depth" 
parser.option.reverseSort = true
// This can be outside the project root as long as relative_docs dir is not.
parser.option.backup = ../../docs 

// This is a internal value which can be set manually if desired. Note: It will also be resolved if need be.
// It is fine to use absolute paths when setting this value even though it is named with the word relative internally. This directory can be outside the 
// project root as long as the backup option is set to a path within the project. The *project_root* value will be set to the process current working 
// directory if this is not supplied when calling module of from the CLI. 
parser.relative_docs_dir = "docs_raw"
```

#### Below is an example of how to pass the option data to the *brace_document.js* module.
```javascript
// Note: The bracket print module instance parameter is optional as it is also loaded automatically if not included.
var docs = document_parse([Bracket print])

parser.option.recursive = true
parser.option.sort = "depth" 
parser.option.reverseSort = true
// This can be outside the project root as long as relative_docs dir is not.
parser.option.backup = ../../docs 

// This is a internal value which can be set manually if desired. Note: It will also be resolved if need be.
// It is fine to use absolute paths when setting this value even though it is named with the word relative internally. This directory can be outside the 
// project root as long as the backup option is set to a path within the project. The *project_root* value will be set to the process current working 
// directory if this is not supplied when calling module of from the CLI. 
parser.relative_docs_dir = "docs_raw"
```

#### There are a couple of unique circumstances when using the module as a script vs uses the CLI
The *pluginEnable* option is unique to an imported Brace_document module. This option contains a contains a string of comma separated plugin module names. It is not accessible via the CLI and is used to determine what plugins should be called from the list of available plugins.
E.g. ```document_parser.option.pluginEnable = "navlink, yourPlugin"```
 
The last argument passed into the cli program is the docs directory. This is set outside the options object directly to the *document_parse* module if need be.  
