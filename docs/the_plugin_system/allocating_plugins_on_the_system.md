## Allocating plugins on the system

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
  * **Allocating plugins on the system**
  * Creating additional plugins
    * [The module outline and structure](https://github.com/restarian/brace_document/blob/master/docs/the_plugin_system/creating_additional_plugins/the_module_outline_and_structure.md)
    * [The run through function and accociated data](https://github.com/restarian/brace_document/blob/master/docs/the_plugin_system/creating_additional_plugins/the_runThrough_function_and_accociated_data.md)
* Using brace document
  * [Command line usage](https://github.com/restarian/brace_document/blob/master/docs/using_brace_document/command_line_usage.md)
  * [Using the module directly](https://github.com/restarian/brace_document/blob/master/docs/using_brace_document/using_the_module_directly.md)

---

#### The plugin locations are similar to the nodejs module object.
Only modules which are located within a *node_modules* directory that is also contained within the current *module.paths* array can be used as plugins for Brace document. The *pluginPath* option can be used to specify an additional path to search for plugins. The first module located will be the plugin which is used.
Note: the *pluginPath* value will be appended with *node_modules* if it does not already end with one.

#### Plugins are identified using the name of the directory which housed them.
A module is potentially identified as a plugin if the directory name is a regular expression match using the *pluginRegex* option. 
Note: It is smart to use a *^* at the beginning of the regular expression to ensure that no unwanted plugins are found.
Dot fret too much if a unexpected plugin is located by the matching system. Modules which do not conform to the plugin standards of the program will be delicately rejected with an error message.

##### Hint: the *plugins** option can be used to display a simple list of the located plugins relative to a project. It then returns early without call the API.






