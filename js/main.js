export {
	C, R, S, T, QUERY_TAB_CURR, QUERY_WIN_CURR,
	getConfig, getTags, saveTabsAsLinks,
}

const {
	commands: C,
	runtime: R,
	storage: {local: S},
	tabs: T,
} = browser

const DEFAULT_CONFIG = {popup_close: true}
const QUERY_TAB_CURR = {active: true, currentWindow: true}
const QUERY_WIN_CURR = {currentWindow: true, pinned: false}

const getConfig = async () => {
	const {config} = await S.get({config: {}})
	return {...DEFAULT_CONFIG, ...config}
}

const getTags = async () => {
	const code = `window.prompt("Enter tags:")`
	const [tags] = await T.executeScript({code})
	if (typeof tags !== "string")
		// either user aborted (tags is `null`)
		// or current tab is privileged (tags is `undefined`)
		return null
	return tags.split(",").map(x => x.trim())
}

const saveFavicon = (favicons, url, favicon) => {
	try {
		const {host} = new URL(url)
		if (host && favicon)
			favicons[host] = favicon
	} catch (_) {
		// Only possible error is if `url` is invalid;
		// in that case, do absolutely nothing.
	}
}

const saveTabsAsLinks = async (tabs, tags, ts = new Date().toISOString()) => {
	let {bucket, favicons, maxId} = await S.get({
		bucket: {},
		favicons: {},
		maxId: 0,
	})
	for (const {title, url, favIconUrl} of tabs) {
		saveFavicon(favicons, url, favIconUrl)
		bucket[++maxId] = {id: maxId, title, url, tags, ts}
	}
	await S.set({bucket, favicons, maxId})
}
