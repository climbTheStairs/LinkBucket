import {$, extendProto, onOrIfDomContentLoaded} from "/lib/site/js/stairz.js"
import {
	S, T, QUERY_TAB_CURR, QUERY_WIN_CURR,
	getConfig, saveTabsAsLinks,
} from "/js/main.js"
extendProto.Element()

const saveWin = new URL(location.href).searchParams.get("win") === "1"
const tabs = await T.query(saveWin ? QUERY_WIN_CURR : QUERY_TAB_CURR)
const [$form] = document.forms

const main = async () => {
	$("#links").append(...tabs.map(tab2tr))
	$form.ts.value = new Date().toISOString()
	getConfig().then(config => {
		$form.close.checked = config.popup_close
	})
	$form.onsubmit = saveTabs
	// Sometimes autofocus doesn't work by itself.
	setTimeout(() => $form.tags.focus(), 1)
}

const tab2tr = ({title, url, favIconUrl}) => {
	const [$tr] = $("#link-tr").content.cloneNode(true).children
	$tr.$(`[name="title"     ]`).value = title
	$tr.$(`[name="url"       ]`).value = url
	return $tr
}

const saveTabs = async (e) => {
	e.preventDefault() // `return false` does not work with `async`
	const tabsToSave = $form.title.map((_, i) => ({
		title:      $form.title[i].value,
		url:        $form.url[i].value,
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
		await T.remove(tabs.map(t => t.id))
	window.close()
}

onOrIfDomContentLoaded(main)
