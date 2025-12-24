# Moodle Plugin: GitHub Code Filter

## Latest Release: 
[![Latest Release](https://img.shields.io/github/v/release/November7/GitHubCodeFilter)](https://github.com/November7/GitHubCodeFilter/releases/latest)

## Overview
The **GitHub Code Filter** plugin allows Moodle course creators to embed source code directly from GitHub into course content. By referencing a GitHub *raw* file URL, the plugin automatically fetches the code and displays it with syntax highlighting, making programming examples clear and visually engaging for students.

## Features
- Fetches code from **GitHub raw URLs** and inserts it into Moodle pages  
- Supports **syntax highlighting** using Highlight.js  
- Works with multiple programming languages (C++, Python, Java, PHP, etc.)  
- Simple integration: just paste the GitHub raw link into your course content  
- Lightweight and efficient — no manual copy-paste or duplication of code  

## Installation
1. Clone or download this repository  
2. Copy the plugin folder into your Moodle installation under:  /filter/githubcode or install using zip file
3. Log in as an administrator and navigate to:  
**Site administration → Plugins → Manage filters**  
4. Enable the **GitHub Code Filter**  

![GitHub release (latest by date)](https://img.shields.io/github/v/release/November7/GitHubCodeFilter)

## Version history
- **v0.1** - First working release: [githubcode v0.1.zip](https://github.com/November7/GitHubCodeFilter/blob/main/release/githubcode%20v0.1.zip), based on *highlight.js*  
- **v0.2** - Engine switched to a custom implementation (under construction)
- **v0.9.8** - Early working release based on custom engine. Known issues: zebra-style with margins & multiline comment.
- **v1.0.0** - Stable (?) version, based on custom engine. Known issues: multi-word title.
- **v1.0.1** - New option in plugin settings: default theme. 
- **v1.0.2** - New options in plugin settings: default linenumbers, default zebra-style row: [githubcode v1.0.2.zip](https://github.com/November7/GitHubCodeFilter/blob/main/release/githubcode%20v1.0.2.zip)

## Available parameters
- href (required)
- linenumbers[=off]
- zebrastyle[=off]
- theme
  - dark
  - blue
  - light

## Usage
Insert a GitHub raw file link within a page or other activities:

```text
{githubcode href=raw.githubusercontent.com/user/repo/main/example.cpp linenumbers theme=dark}
```
or
```text
{githubcode href=https://raw.githubusercontent.com/user/repo/main/example.cpp linenumbers zebrastyle}
```
or
```text
{githubcode href=<a href'https://raw.githubusercontent.com/user/repo/main/example.cpp'>...</a> linenumbers=off theme=dark zebrastyle=off}
```

## Version history
- **v0.1** - First working release: [githubcode v0.1.zip](https://github.com/November7/GitHubCodeFilter/blob/main/release/githubcode%20v0.1.zip), based on *highlight.js*  
- **v0.2** - Engine switched to a custom implementation (under construction)
- **v0.9.8** - Early working release based on custom engine. Known issues: zebra-style with margins & multiline comment.
- **v1.0.0** - Stable (?) version, based on custom engine. Known issues: multi-word title.
- **v1.0.1** - New option in plugin settings: default theme. 
- **v1.0.2** - New options in plugin settings: default linenumbers, default zebra-style row: [githubcode v1.0.2.zip](https://github.com/November7/GitHubCodeFilter/blob/main/release/githubcode%20v1.0.2.zip)

