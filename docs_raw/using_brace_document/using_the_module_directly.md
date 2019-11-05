# Brace Document
## Using the module pragmatically

---
### Document pages

---

### Brace document fully supports scripting usage.
It is utilized by importing either the *lib -> brace_document.js* or the *lib -> document_parse.js* modules using either require or an AMD loader. The *brace_document.js* module is used by the CLI to handle extra data for convenience and thusly requires a option object to be passed into the constructor.

Setting option data to the *brace_document.js* module is done by passing an Object literal or [Commander](https://npmjs.org/packages/commander) instance into the constructor call as the first argument. This parameter is non-optional so an empty object must at least be passed in to the constructor call.

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
// Note: The Bracket print module instance parameter is optional. It is loaded
// automatically if not included as a parameter.
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
// Note: The bracket print module instance parameter is optional as it
// is also loaded automatically if not included.
var parser = require("./lib/document_parse.js")([Bracket print])

parser.option.recursive = true
parser.option.sort = "depth"
parser.option.reverseSort = true
// This can be outside the project location as long as relative_docs dir is not.
parser.option.projectLocation = "./"
parser.option.input = "./docs_raw"
parser.option.backup = "../../docs"

// It is fine to use absolute or relative paths when setting the *projectLocation*,
// "input" or "backup" options. The input directory can be outside the project
// location as long as the backup option is set to a path at or below the project location.
```

### There is one difference in option data availability using the module as a script vs using it from the CLI
The *pluginEnable* option is unique to a imported *brace_document.js* module. This option contains a contains a string of comma separated plugin module names which tell the **document_parse.runPlugin* member what plugins should be called. It is not accessible to be set via the command line but is instead automatically created from all of the plugins which were dentoed as command line parameter flags.
However, the *pluginEnable* option can be used when using the modules programically.
