import {
	C, R, T, QUERY_TAB_CURR, QUERY_WIN_CURR,
	saveTabsAsLinks,
} from "/js/main.js"

const {browserAction: BA} = browser

const saveTab = async () => {
	BA.setPopup({popup: "/html/popup.html"})
	await BA.openPopup()
}

const saveWin = async () => {
	BA.setPopup({popup: "/html/popup.html?win=1"})
	await BA.openPopup()
}

const gotoBucket = async () => {
	const url = R.getURL("/html/bucket.html")
	const [tabBucket] = await T.query({currentWindow: true, url})
	if (tabBucket)
		await T.update(tabBucket.id, {active: true})
	else
		await T.create({url: "/html/bucket.html"})
}

const cmds = {saveTab, saveWin, gotoBucket}

C.onCommand.addListener(cmd => console.debug("recv cmd: "+cmd))
C.onCommand.addListener(cmd => cmds[cmd]().catch(console.error))
