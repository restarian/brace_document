
# Main page
## The main page

----
### Document pages
* [License information](https://github.com/restarian/markdown_mutate/blob/master/doc/license.md)
* [The todo list](https://github.com/restarian/markdown_mutate/blob/master/doc/todo.md)

----

[![Bash on Windows](https://raw.githubusercontent.com/restarian/brace_umd/master/doc/image/ubuntu_windows_logo.png)](https://github.com/Microsoft/BashOnWindows)

**Author: Robert Steckroth, Bustout**

**License: MIT**

**Bonuses:**
* Branch specific urls so that branches maintain unique docs
* well commented, professional code

**Caveats:**
  * Only works with git based projects



This module provides an idempotent script/shell command that injects navigation list syntax into markdown pages. The pages are collected from a directory in the git project and link urls are created which reference them.

Below is the markdown page before and after mutation:

```javascript

# My module
## The main page

Some text about the project here
```
After running the mutate_markdown command/script:

```javascript

# My module
## The main page

----
### Document pages
----

Some text about the project here
```


