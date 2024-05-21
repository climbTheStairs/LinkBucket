import {$, extendProto, onOrIfDomContentLoaded} from "/lib/site/js/stairz.js"
extendProto.Element()

const [$form] = document.forms
const QUERY_TAB = {currentWindow: true, active: true}
const QUERY_WIN = {currentWindow: true, pinned: false}
const saveWin = +new URL(window.location).searchParams.get("win")
const tabsCurr = await browser.tabs.query(saveWin ? QUERY_WIN : QUERY_TAB)

const main = () => {
	if (tabsCurr.length === 0)
		return; // TODO: error
	$("#links").append(...tabsCurr.map(tab2tr))
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
	e.preventDefault()
	let {bucket, favicons, maxId} = await browser.storage.local.get({
		bucket: {},
		favicons: {},
		maxId: 0,
	})
	const tags = $form.tags.value.split(",").map(x => x.trim())
	const ts   = $form.ts.value.trim()
	if (ts && Number.isNaN(+new Date(ts))) {
		return // TODO: error handling
	}
	tabsCurr.forEach(({favIconUrl}, i) => {
		const title = ($form.title?.[i] ?? $form.title).value
		const url   = ($form.url?.[i]   ?? $form.url  ).value
		saveFavicon(favicons, url, favIconUrl)
		bucket[maxId++] = {title, url, tags, ts}
	})
	try {
		await browser.storage.local.set({bucket, favicons, maxId})
	} catch (_) {
		return // TODO: error handling
	}
	if ($form.close.checked)
		await browser.tabs.remove(tabsCurr.map(t => t.id))
	window.close()
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
