## How modules are defined as plugins

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
  * [The callback and associated data](https://github.com/restarian/brace_document/blob/master/docs/the_plugin_system/the_callback_and_associated_data.md)
  * **The module outline and structure**
* Using brace document
  * [Command line usage](https://github.com/restarian/brace_document/blob/master/docs/using_brace_document/command_line_usage.md)
  * [Using the module directly](https://github.com/restarian/brace_document/blob/master/docs/using_brace_document/using_the_module_directly.md)

---

#### Important: a plugin name is determined by the directory name, **not** from the name entry in the *package.json* file.


#### Plugins use string values located in the *package.json* file to determine at what time the plugin will be called at run-time.

Brace Document plugins are called in a pre-determined order within three different event types:

1. The directory structure object is created from the documentation directory structure.
  - The **first** tense plugins are called using the priority values (lower first). An empty data object is passed into these plugins sense it was not collected yet.
2. All of the documentation text is collected and stored in the structure object. 
  - The **collect** tense plugins are called with both the current structure and data objects.
3. The newly modified documentation is written to the same (or backup), directory using the modified structure and data objects.
  - The **last** tense plugins are called with both structure and data objects.

#### The plugins use priority integer values from the *package.json* file to assemble a plugin calling order.
Lower priority values will cause the plugin to run firstly. Plugins which modify the *data* object should be called last (*have a higher priority value*), so that other plugins which create additional documents via the *structure* and *data* objects will also be included in the modifications. For example, given the scenario: a plugin adds a new document page but is called after the [brace_document_navlink](https://npmjs.org/packages/brace_document_navlink) because the priority value is higher than it. The document page created by the plugin will not have the navigation links added to it like the others because it ran after the modifications happened. Therefore, the priority of that plugin should be set to a lower value than *brace_document_navlink* plugin *priority* value.

An example *package.json* entry which contains the priority value:
```javascript
{
	"name": "brace_document_myplugin",
	"version": "0.1.2",
	"main": "lib/brace_document_myplugin.js",
	"priority": "2", <-- the value which will be used to establish a calling order.
	"tense": "last", <-- the time of the run-time which calls the plugin.
	...
```

### How option data is shared to the platform
#### Brace document uses [Commander](https://npmjs.org/packages/commander) to process CLI arguments so the data structure in the *options.js* file is very similar
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
