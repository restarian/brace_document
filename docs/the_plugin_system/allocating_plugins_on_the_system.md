## Allocating plugins on the system

---
### Document pages
* [Contributer code of conduct](https://github.com/restarian/brace_document/blob/master/docs/contributer_code_of_conduct.md)
* [Guilines for contributing](https://github.com/restarian/brace_document/blob/master/docs/guilines_for_contributing.md)
* [Synopsis](https://github.com/restarian/brace_document/blob/master/docs/synopsis.md)
* Specification
  * [License information](https://github.com/restarian/brace_document/blob/master/docs/specification/license_information.md)
  * [Package data and information](https://github.com/restarian/brace_document/blob/master/docs/specification/package_data_and_information.md)
* The plugin system
  * **Allocating plugins on the system**
  * [Creating additional plugins](https://github.com/restarian/brace_document/blob/master/docs/the_plugin_system/creating_additional_plugins.md)
* Using brace document
  * [Command line usage](https://github.com/restarian/brace_document/blob/master/docs/using_brace_document/command_line_usage.md)
  * [Using the module directly](https://github.com/restarian/brace_document/blob/master/docs/using_brace_document/using_the_module_directly.md)

---

#### Plugin locations
Only modules which are located withing a *node_modules* directory that is also specified in the current *module.paths* array can be used as plugins for Brace document. The *--plugin-path* or *option.pluginPath* option can be used to specify an additional path to search for plugins.

#### Plugin identification
By default, a module is potentially identified as a plugin if the directory/module name is prepended with *brace_document_"*. 
The *--plugin-regex* or *option.pluginRegex* option can be set to identify other plugins. It is important to recognize that any module/directory name which matches the regular expression is attempted to be used. Therefore, it is smart to use a *^* at the beginning of the regular expression to ensure that no unwanted plugins are found.






