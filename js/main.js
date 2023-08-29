export {
	C, R, S, T, QUERY_TAB_CURR, QUERY_WIN_CURR,
	getConfig, setConfig, getTags, tab2link, saveLinks,
}

const {
	commands: C,
	runtime: R,
	storage: { local: S },
	tabs: T,
} = browser

const DEFAULT_CONFIG = { popup_close: true }
const QUERY_TAB_CURR = { active: true, currentWindow: true }
const QUERY_WIN_CURR = { currentWindow: true, pinned: false }

const getConfig = async () => {
	return Object.assign({}, DEFAULT_CONFIG, await S.get({ config: {} }))
}
const setConfig = async (key, val) => {
	const config = await getConfig()
	config[key] = val ?? DEFAULT_CONFIG[key]
	S.set({ config })
}

const getTags = async () => {
	const code = `window.prompt("Enter tags:")`
	const [tags] = await T.executeScript({ code })
	if (typeof tags !== "string")
		// either user aborted (tags is `null`)
		// or current tab is privileged (tags is `undefined`)
		return null
	return tags.split(",").map(x => x.trim())
}

const tab2link = (tab, tags, ts) => {
	const { title, url, favIconUrl } = tab
	ts ??= new Date().toISOString()
	return { title, url, tags, ts, favIconUrl }
}

const saveLinks = async (...links) => {
	const { bucket } = await S.get({ bucket: [] })
	bucket.push(...links)
	await S.set({ bucket })
}
