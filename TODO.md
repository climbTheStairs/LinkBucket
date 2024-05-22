## run this
```sh
find . -name .git -type d -prune -o -type f -exec grep -F 'T'ODO {} +
```

## user features
- ~~`popup.html`~~
- ~~`config.html`~~
- ~~changing and deleting of links~~
- update `bucket.html` on storage change
- import/export
- tagging:
	- tag query aliases/"metatags"
	- hierarchical subtags
- `bucket.html` organization:
	- ~~filtering by tag~~
	- tabs
	- pinned tag queries
	- text search (?)
	- list all tabs?
	- sort links by
- keyboard controls (WIP)
	- select multiple (visual mode?)
	- delete without confirmation
- mouse chording (see `MouseEvent.button` and `MouseEvent.buttons`)
- sync to server
- UI extensibility via CSS & JS
- browser search suggestions (?)
- save to bookmarks instead (?)
- icon
- OneTab-like behav
	- <https://github.com/cnwangjie/better-onetab>
	- <https://github.com/josh-berry/tab-stash>
- find better name
- see disk usage

## implementation
- ~~modules~~
- ~~dependency management~~
- ~~Git~~
- ~~don't store duplicate favicons~~
- error handling & logging
- documentation (`README.md`, doc comments)
- chromium, mv3 compatibility
- TypeScript
- tests
- examine page load speed
- clean unused favicons

## edge cases
- find out if `confirm()` is bad
	because it can be disabled, breaking functionality
- special handling for non-`http` links
	- for each kind of special link, record:
		- url
		- `tabs.Tab` obj has `favIconUrl`
		- `new URL` properties `host`, `hostname`, `origin`
		- openable from lb
		- match pattern
		- OneTab behavior
- need for locks (?)

## disorg ex
- sep config
- rm config

