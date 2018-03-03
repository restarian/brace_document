## How modules are defined as plugins 

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
  * **The module outline and structure**
* Using brace document
  * [Command line usage](https://github.com/restarian/brace_document/blob/master//using_brace_document/command_line_usage.md)
  * [Using the module directly](https://github.com/restarian/brace_document/blob/master//using_brace_document/using_the_module_directly.md)

Note: the plugin name is determined by the directory name, **not** from the name entry in the *package.json* file.

#### Plugins are called in an order 
##### Brace document uses a priority integer value from the *package.json* file to assemble a plugin calling order. 
Lower priority values will cause the plugin to run firstly. Plugins which modify the *data* object should be called last (*have a higher priority value*), so that other plugins which create additional documents via the *structure* and *data* objects will also be included in the modifications. For example, given the scenario: a plugin adds a new document page but is called after the [brace_document_navlink](https://npmjs.org/packages/brace_document_navlink) because the priority value is higher than it. The document page created by the plugin will not have the navigation links added to it like the others because it ran after the modifications happened. Therefore, the priority of that plugin should be set to a lower value than *brace_document_navlink* plugin *priority* value.

An example *package.json* entry which contains the priority value:
```javascript
{
	"name": "brace_document_myplugin",
	"version": "0.1.2",
	"main": "lib/brace_document_myplugin.js",
	"priority": "2", <-- the value which will be used to establish a calling order.
	...
```

#### How option data is shared to the platform 
##### Brace document uses [Commander](https://npmjs.org/packages/commander) to process CLI arguments so the data structure in the *options.js* file is very similar
Any/all plugins located by Brace document will be checked for an *option.js* module located in the base directory of the plugin (*sub-directories are not checked*). The option data contained therein is appended into the *parser* option data and available for use in any of the other available plugins. This data is also added to the help screen which is viewed using the *help* option. 
Note: that *options.js* file is a module, **not** a script.

The script below demonstrates basic *option.js* data form:

```javascript
module.exports = [

	{ 
		"usage": "Some text about the plugin and any helpfull data to know when at the command line."
	},
	{
		"flag": "-a, --alpha <string>", 
		"help": "A option to use in this plugin.",
		"default": "AAA", 
	},
	{
		"flag": "-b, ---beta <string>", 
		"help": "Set this to the beta word.",
		"setter" function(val) { return val + "_beta" } 
	},
	{
		"flag": "-f", 
		"help": "A simple flag to set"
	},
]
```

