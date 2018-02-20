# Brace Document
## Allocating plugins on the system



---
### Brace document
* [Synopsis](https://github.com/restarian/brace_document/blob/master/docs/README.md)
* [Contributor code of conduct](https://github.com/restarian/brace_document/blob/master/docs/code_of_conduct.md)
* [Making a difference with brace document ](https://github.com/restarian/brace_document/blob/master/docs/contributing.md)
* Specification
  * [License information](https://github.com/restarian/brace_document/blob/master/docs/specification/license.md)
* The plugin system
  * **Allocating plugins on the system**
  * [Creating plugins](https://github.com/restarian/brace_document/blob/master/docs/the_plugin_system/creating_plugins.md)
* Using brace document
  * [Using the program script](https://github.com/restarian/brace_document/blob/master/docs/using_brace_document/command_line_usage.md)
  * [Using the module directly](https://github.com/restarian/brace_document/blob/master/docs/using_brace_document/module_import_usage.md)

---
#### Plugin locations
Only modules which are located withing a *node_modules* directory that is also specified in the current *module.paths* array can be used as plugins for Brace document. The *--plugin-path* or *option.pluginPath* option can be used to specify an additional path to search for plugins.

#### Plugin identification
By default, a module is potentially identified as a plugin if the directory/module name is prepended with *brace_document_"*. 
The *--plugin-regex* or *option.pluginRegex* option can be set to identify other plugins. It is important to recognize that any module/directory name which matches the regular expression is attempted to be used. Therefore, it is smart to use a *^* at the beginning of the regular expression to ensure that no unwanted plugins are found.






