import {
	C, R, T, QUERY_TAB_CURR, QUERY_WIN_CURR,
	getTags, saveLinks, tab2link,
} from "/js/main.js"

const cmds = {
	save_curr: async () => {
		const tags = await getTags()
		if (tags === null)
			return // action aborted
		const [tabCurr] = await T.query(QUERY_TAB_CURR)
		await saveLinks(tab2link(tabCurr, tags))
	},
	save_close_curr: async () => {
		const tags = await getTags()
		if (tags === null)
			return // action aborted
		const [tabCurr] = await T.query(QUERY_TAB_CURR)
		await saveLinks(tab2link(tabCurr, tags))
		await T.remove(tabCurr.id)
	},
	save_all: async () => {
		const tags = await getTags()
		if (tags === null)
			return // action aborted
		const tabs = await T.query(QUERY_WIN_CURR)
		await saveLinks(...tabs.map(tab => tab2link(tab, tags)))
	},
	save_close_all: async () => {
		const tags = await getTags()
		if (tags === null)
			return // action aborted
		const tabs = await T.query(QUERY_WIN_CURR)
		await saveLinks(...tabs.map(tab => tab2link(tab, tags)))
		await T.remove(tabs.map(tab => tab.id))
	},
	go_to_bucket: async () => {
		const url = R.getURL("/html/bucket.html")
		const [tabBucket] = await T.query({ currentWindow: true, url })
		if (tabBucket)
			await T.update(tabBucket.id, { active: true })
		else
			await T.create({ url: "/html/bucket.html" })
	},
}

C.onCommand.addListener(cmd => console.debug("recv cmd: " + cmd))
C.onCommand.addListener(cmd => cmds[cmd]().catch(console.error))
