# Moodle Plugin: GitHub Code Filter

[![Latest Release](https://img.shields.io/github/v/release/November7/GitHubCodeFilter)](https://github.com/November7/GitHubCodeFilter/releases/latest)
![Last Commit](https://img.shields.io/github/last-commit/November7/GitHubCodeFilter)
![License](https://img.shields.io/github/license/November7/GitHubCodeFilter)


## Overview
The **GitHub Code Filter** plugin allows Moodle course creators to embed source code directly from GitHub into course content. By referencing a GitHub *raw* file URL, the plugin automatically fetches the code and displays it with syntax highlighting, making programming examples clear and visually engaging for students.

- **Type:** Moodle filter plugin  
- **Directory:** `/filter/githubcode`  
- **Purpose:** Embed GitHub raw code with syntax highlighting  
- **Requires:** Moodle 4.x+  
- **Maintainer:** Nov7  


## Features
- Fetches code from **GitHub raw URLs** and inserts it into Moodle pages  
- Automatic **syntax highlighting** (custom engine)  
- Supports multiple languages (C++, Python, Java, PHP, etc.)  
- Optional line numbers and zebra‑style rows  
- Multiple themes: **light**, **dark**, **blue**  
- Simple integration — just paste the GitHub raw link  
- Lightweight and efficient
- Built‑in caching of GitHub code to reduce bandwidth usage and improve performance

## Installation
1. Download the latest ZIP from: **Releases → Latest**
2. Log in as an administrator
3. Extract and upload the plugin folder into: `/filter/githubcode` or install as an moodle administrator
4. Navigate to: **Site administration → Plugins → Manage filters**  
5. Enable **GitHub Code Filter**

## Available parameters
| Parameter      | Required | Default | Description |
|----------------|----------|---------|-------------|
| `href`         | yes      | —       | GitHub raw file URL |
| `linenumbers`  | no       | on      | Show line numbers (`on` / `off`) |
| `zebrastyle`   | no       | on      | Alternating row background |
| `theme`        | no       | light   | `light`, `dark`, `blue` |


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
{githubcode href=<a href='https://raw.githubusercontent.com/user/repo/main/example.cpp'>...</a> linenumbers=off theme=dark zebrastyle=off}
```

## Compatibility
- Moodle 4.X

## Limitations
- Only public GitHub raw URLs are supported
- Very large files may load slowly depending on server configuratio

## Roadmap
- [x] Improve zebra‑style rendering  
- [x] Add optional local caching of GitHub files  
- [ ] Fix existing themes
- [ ] Fix unwanted extra newline in the output
- [ ] Add additional themes  
- [ ] Add `{rawcode}...{/rawcode}` feature (allow inserting raw code directly into Moodle content)  
- [ ] Enable three‑way code insertion:  
      - current: `{githubcode params}`  
      - fallback block: `{githubcode params} fallback block {/githubcode}`  
      - raw code block: `{rawcode params} inserted code block {/rawcode}`  

## Version history
- **v1.0.2** - New options in plugin settings: default linenumbers, default zebra-style row
- **v1.0.1** - New option in plugin settings: default theme. 
- **v1.0.0** - Stable version, based on custom engine. Known issues: multi-word title.
- **v0.9.8** - Early working release based on custom engine. Known issues: zebra-style with margins & multiline comment.
- **v0.2.0** - Engine switched to a custom implementation (under construction)
- **v0.1.0** - First working release based on *highlight.js*  

