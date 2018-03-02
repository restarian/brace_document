## Allocating plugins on the system

---
### Document pages

#### The plugin locations are similar to the nodejs module object.
Only modules which are located within a *node_modules* directory that is also contained within the current *module.paths* array can be used as plugins for Brace document. The *pluginPath* option can be used to specify an additional path to search for plugins. The first module located will be the plugin which is used.
Note: the *pluginPath* value will be appended with *node_modules* if it does not already end with one.

#### Plugins are identified using the name of the directory which housed them.
A module is potentially identified as a plugin if the directory name is a regular expression match using the *pluginRegex* option. 
Note: It is smart to use a *^* at the beginning of the regular expression to ensure that no unwanted plugins are found.
Dot fret too much if a unexpected plugin is located by the matching system. Modules which do not conform to the plugin standards of the program will be delicately rejected with an error message.

##### Hint: the *plugins* option can be used to display a simple list of the located plugins relative to a project. It then returns early without call the API.

#### Plugins names will be shortened withing the platform if the directory name starts with *brace_document_*.
This is done out of convenience when enabling plugins. 



