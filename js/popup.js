import {$, extendProto, onOrIfDomContentLoaded} from "/lib/site/js/stairz.js"
extendProto.Element()

const QUERY_TAB_CURR = {active: true, currentWindow: true}
const QUERY_WIN_CURR = {currentWindow: true, pinned: false}
const win = new URL(location).searchParams.get("win") === "1"
const tabs = await browser.tabs.query(win ? QUERY_WIN_CURR : QUERY_TAB_CURR)
const [$form] = document.forms

const main = () => {
	$("#links").append(...tabs.map(tab2tr))
	$form.ts.value = new Date().toISOString()
	browser.runtime.sendMessage("config").then(config =>
		$form.close.checked = config.popup_close)
	$form.onsubmit = saveTabs
	// Sometimes autofocus doesn't work by itself.
	setTimeout(() => $form.tags.focus(), 1)
}

const tab2tr = ({title, url, favIconUrl}) => {
	const [$tr] = $("#link-tr").content.cloneNode(true).children
	$tr.$(`[name="title"]`).value = title
	$tr.$(`[name="url"  ]`).value = url
	return $tr
}

const saveTabs = async (e) => {
	e.preventDefault() // `return false` does not work with `async`
	const tabsToSave = [...$form.title].map((_, i) => ({
		title: $form.title[i].value,
		url:   $form.url[i].value,
		favIconUrl: tabs[i].favIconUrl,
	}))
	const tags = $form.tags.value.split(",").map(x => x.trim())
	const ts   = $form.ts.value.trim()
	if (ts && Number.isNaN(+new Date(ts))) {
		return // TODO: error handling
	}
	try {
		await saveTabsAsLinks(tabsToSave, tags, ts)
	} catch (_) {
		return // TODO: error handling
	}
	if ($form.close.checked)
		await browser.tabs.remove(tabs.map(t => t.id))
	window.close()
}

const saveTabsAsLinks = async (tabs, tags, ts = new Date().toISOString()) => {
	let {bucket, favicons, maxId} = await browser.storage.local.get({
		bucket: {},
		favicons: {},
		maxId: 0,
	})
	for (const {title, url, favIconUrl} of tabs) {
		saveFavicon(favicons, url, favIconUrl)
		bucket[++maxId] = {id: maxId, title, url, tags, ts}
	}
	await browser.storage.local.set({bucket, favicons, maxId})
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

onOrIfDomContentLoaded(main)
