import {onOrIfDomContentLoaded} from "/lib/site/js/stairz.js"
import {
	S, T, QUERY_TAB_CURR,
	getConfig, saveTabsAsLinks,
} from "/js/main.js"

const [tabCurr] = await T.query(QUERY_TAB_CURR)

const main = async () => {
	const config = await getConfig()
	const [$form] = document.forms
	$form.title.value = tabCurr.title
	$form.url.value = tabCurr.url
	$form.ts.value = new Date().toISOString()
	$form.close.checked = config.popup_close
	$form.onsubmit = saveTab
}

const saveTab = async function(e) {
	e.preventDefault() // `return false` does not work with `async`
	const tabEdited = {
		title: this.title.value,
		url: this.url.value,
		favIconUrl: tabCurr.favIconUrl,
	}
	const tags = this.tags.value.split(",").map(x => x.trim())
	const ts = this.ts.value.trim()
	if (ts && Number.isNaN(+new Date(ts))) {
		return // TODO: error handling
	}
	await saveTabsAsLinks([tabEdited], tags, ts)
	if (this.close.checked)
		await T.remove(tabCurr.id)
	window.close()
}

onOrIfDomContentLoaded(main)
