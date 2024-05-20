const saveTab = async () => {
	browser.browserAction.setPopup({popup: "/html/popup.html"})
	await browser.browserAction.openPopup()
}

const saveWin = async () => {
	browser.browserAction.setPopup({popup: "/html/popup.html?win=1"})
	await browser.browserAction.openPopup()
}

const gotoBucket = async () => {
	const url = browser.runtime.getURL("/html/bucket.html")
	const [tab] = await browser.tabs.query({currentWindow: true, url})
	if (tab)
		await browser.tabs.update(tab.id, {active: true})
	else
		await browser.tabs.create({url: "/html/bucket.html"})
}

const DEFAULT_CONFIG = {popup_close: true}
const config = async (sendResp) => {
	const {config} = await browser.storage.local.get({config: {}})
	sendResp({...DEFAULT_CONFIG, ...config})
}

const cmds = {saveTab, saveWin, gotoBucket}
const msgs = {config}
browser.commands.onCommand.addListener(cmd => {
	console.debug("recv cmd: "+cmd)
	cmds[cmd]().catch(console.error)
})
browser.runtime.onMessage.addListener((msg, _, sendResp) => {
	console.debug("recv msg: "+msg)
	msgs[msg](sendResp).catch(console.error)
	return true
})
