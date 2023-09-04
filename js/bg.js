import {
	C, R, T, QUERY_TAB_CURR, QUERY_WIN_CURR,
	getTags, saveTabsAsLinks,
} from "/js/main.js"

const save_curr = async () => {
	const tags = await getTags()
	if (tags === null)
		return // action aborted
	const [tabCurr] = await T.query(QUERY_TAB_CURR)
	await saveTabsAsLinks([tabCurr], tags)
}

const save_close_curr = async () => {
	const tags = await getTags()
	if (tags === null)
		return // action aborted
	const [tabCurr] = await T.query(QUERY_TAB_CURR)
	await saveTabsAsLinks([tabCurr], tags)
	await T.remove(tabCurr.id)
}

const save_all = async () => {
	const tags = await getTags()
	if (tags === null)
		return // action aborted
	const tabs = await T.query(QUERY_WIN_CURR)
	await saveTabsAsLinks(tabs, tags)
}

const save_close_all = async () => {
	const tags = await getTags()
	if (tags === null)
		return // action aborted
	const tabs = await T.query(QUERY_WIN_CURR)
	await saveTabsAsLinks(tabs, tags)
	await T.remove(tabs.map(tab => tab.id))
}

const go_to_bucket = async () => {
	const url = R.getURL("/html/bucket.html")
	const [tabBucket] = await T.query({currentWindow: true, url})
	if (tabBucket)
		await T.update(tabBucket.id, {active: true})
	else
		await T.create({url: "/html/bucket.html"})
}

const cmds = {
	save_curr, save_close_curr,
	save_all, save_close_all,
	go_to_bucket,
}

C.onCommand.addListener(cmd => console.debug("recv cmd: "+cmd))
C.onCommand.addListener(cmd => cmds[cmd]().catch(console.error))
