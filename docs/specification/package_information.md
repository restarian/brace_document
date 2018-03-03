
---
### Brace document pages
* [Contributer code of conduct](https://github.com/restarian/brace_document/blob/master//contributer_code_of_conduct.md)
* [Guidelines for contributing](https://github.com/restarian/brace_document/blob/master//guidelines_for_contributing.md)
* [Synopsis](https://github.com/restarian/brace_document/blob/master//synopsis.md)
* Specification
  * [License information](https://github.com/restarian/brace_document/blob/master//specification/license_information.md)
  * **Package information**
  * [Unit test output](https://github.com/restarian/brace_document/blob/master//specification/unit_test_output.md)
* The plugin system
  * [Allocating plugins on the system](https://github.com/restarian/brace_document/blob/master//the_plugin_system/allocating_plugins_on_the_system.md)
  * [The callback and accociated data](https://github.com/restarian/brace_document/blob/master//the_plugin_system/the_callback_and_accociated_data.md)
  * [The module outline and structure](https://github.com/restarian/brace_document/blob/master//the_plugin_system/the_module_outline_and_structure.md)
* Using brace document
  * [Command line usage](https://github.com/restarian/brace_document/blob/master//using_brace_document/command_line_usage.md)
  * [Using the module directly](https://github.com/restarian/brace_document/blob/master//using_brace_document/using_the_module_directly.md)
 
 
**Version**: 0.7.6

**Description**: A platform for plugin utilization regarding document generation which has many plugins

**Author**: [Robert Steckroth](mailto:RobertSteckroth@gmail.com)

**Dependencies**: [amdefine](https://npmjs.org/package/amdefine) [bracket_print](https://npmjs.org/package/bracket_print) [commander](https://npmjs.org/package/commander)

**Development dependencies**: [brace_document_navlink](https://npmjs.org/package/brace_document_navlink) [brace_maybe](https://npmjs.org/package/brace_maybe) [bracket_utils](https://npmjs.org/package/bracket_utils) [mocha](https://npmjs.org/package/mocha) [chai](https://npmjs.org/package/chai) [requirejs](https://npmjs.org/package/requirejs)

**Package scripts**:

| Name | Action |
| ---- | ------ |
 | test | ```mocha``` |
 | brace_document | ```node ./bin/document.js``` |
 | make_docs | ```npm run brace_document --silent -- --navlink -r -i docs_raw -b docs --force-title --title 'Brace document pages' --sort depth``` |
 | make_docs_extra | ```npm run make_docs --silent -- --batten-document-specification --batten-document-mocha``` |

**Keywords**: *markdown*, *documentation*, *platform*, *generation*

**Technologies used in development**:
  * [VIM](https://www.vim.org) As an IDE
  * [Windows 10](https://www.microsoft.com/en-us/software-download/windows10) For unit testing and as the base operating system
  * [Ubuntu on Windows](https://www.microsoft.com/en-us/store/p/ubuntu/9nblggh4msv6) As the development operating environment
  * [Git](https://git-scm.com) For repository management
  * [Github](https://github.com) For repository storage
  * [NPM](https://npmjs.org) For module storage
  * [Blender](https://blender.org) For logo design and rendering