## Allocating plugins on the system

---
### Document pages

---

#### Plugin locations
Only modules which are located withing a *node_modules* directory that is also contained within the current *module.paths* array can be used as plugins for Brace document. The *--plugin-path* or *option.pluginPath* option can be used to specify an additional path to search for plugins.
Note: the *pluginPath* will be appended with *node_modules* if it does not already end with one.

#### Plugin identification
By default, a module is potentially identified as a plugin if the directory/module name is prepended with *brace_document_"*. 
The *--plugin-regex* or *option.pluginRegex* option can be set to identify other plugins. It is important to recognize that any module/directory name which matches the regular expression is attempted to be used. Therefore, it is smart to use a *^* at the beginning of the regular expression to ensure that no unwanted plugins are found.






