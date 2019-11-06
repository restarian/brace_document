# Brace Document
## How modules are defined as plugins

---
### Document pages

---

#### Important: a plugin name is determined by the directory name, **not** from the name entry in the *package.json* file.


#### Plugins use tense string values located in the *package.json* file to determine at what time the plugin will be called at run-time.
This property is called *tense* and is first used (before the priority value) to determine calling order.

Brace Document plugins are called in a pre-determined order within four different event types:

1. The directory structure object is gathered from the specified input documentation directory structure.
  - The **first** tense plugins are called using the priority values (lower first). The newly generated structure object is passed in with an empty data object. The data object is empty sense it has not been collected at this run phase.
2. All of the input documentation page content is collected and stored in the data object.
  - The **collect** tense plugins are called passing in both the current structure and page content data objects.
3. The current structure object is used to create any new directories in the input (or backup) location (no page content files are written yet).
  - The **directory** tense plugins are called with both structure and data objects.
3. The newly modified documentation content is written to the same (or backup), directory using the page data object.
  - The **last** tense plugins are called with both structure and data objects.

#### The plugins use priority integer values from the *package.json* file to assemble a plugin calling order.
Lower priority values will cause the plugin to run firstly. Plugins which modify the *data* object should be called last (*have a higher priority value*), so that other plugins which create additional documents via the *structure* and *data* objects will also be included in the modifications. For example, given the scenario: a plugin adds a new document page but is called after the [brace_document_navlink](https://npmjs.org/packages/brace_document_navlink) because the priority value is higher than it. The document page created by the plugin will not have the navigation links added to it like the others because it ran after the modifications happened. Therefore, the priority of that plugin should be set to a lower value than *brace_document_navlink* plugin *priority* value.

An example *package.json* entry which contains the priority value:
```javascript
{
	"name": "brace_document_myplugin",
	"version": "0.1.2",
	"main": "lib/brace_document_myplugin.js",
	"priority": "2", <-- The value which will be used to establish a calling order.
	"tense": "last", <-- The phase of the run-time which calls the plugin.
	...
```

### How option data is shared to the platform
#### Brace Document uses [Commander](https://npmjs.org/packages/commander) to process CLI arguments so the data structure in the *options.js* file is very similar
Any/all plugins located by Brace Document will be checked for an *option.js* module located in the base directory of the plugin (*sub-directories are not checked*). The option data contained therein is appended into the *parser* option data and available for use in any of the other available plugins. This data is also added to the help screen which is viewed using the *help* option.
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
