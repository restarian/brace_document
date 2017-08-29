# Brace navbar 
## The main page

----
### Document pages
* [License information](https://github.com/restarian/markdown_mutate/blob/master/doc/license.md)
* [The todo list](https://github.com/restarian/markdown_mutate/blob/master/doc/todo.md)
* [Using the command](https://github.com/restarian/markdown_mutate/blob/master/doc/usage.md)

----

[![Bash on Windows](https://raw.githubusercontent.com/restarian/restarian/master/doc/image/ubuntu_windows_logo.png)](https://github.com/Microsoft/BashOnWindows)

..part of the [Brace suite](https://github.com/restarian/restarian/blob/master/brace/README.md)
![Brace](https://raw.githubusercontent.com/restarian/restarian/master/brace/doc/image/brace_logo_small.png)

**Author: Robert Steckroth, Bustout**

**License: MIT**

**Bonuses:**
* Tested in Ubuntu 16.04 and Windows 10
* Integrates git repository information
* Idempotent javascript runs as a command from anywhere on the system or locally as a nodejs script 
* Document pages are valid markdown documents before and after mutation 
* Script is idempotent while maintaining individual changes to pages.
* Branch specific urls so branches maintain own unique documentation commits
* Well commented, professional code

**Caveats:**
  * Only works with git based projects

This module provides an idempotent script/shell command that injects navigation list syntax into markdown pages. The pages are collected from a directory in the git project and link urls are created which reference them.

Below is the markdown page before and after mutation:

```javascript

# My module
## The main page

Some text about the project here
```
After running the *navbar* command/script the navigation links are add like below.

```javascript

# My module
## The main page

----
### Document pages
* [License information](https://github.com/username/project/blob/master/doc/license.md)
* [The todo list](https://github.com/username/project/blob/master/doc/todo.md)
* [Using the command](https://github.com/username/project/blob/master/doc/usage.md)

----

Some text about the project here
```


