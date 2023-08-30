import {
	$, $create,
	extendProto,
	onOrIfDomContentLoaded,
} from "/lib/site/js/stairz.js"
import { S } from "/js/main.js"
extendProto.Element()

const { bucket } = await S.get({ bucket: [] })

const $dialog = $("dialog")
const $form = $dialog.$("form")

const link2html = ({ title, url, tags, ts, favIconUrl }, idx) => {
	const $li = $create("li", {
		title: ts,
	})
	$li.dataset.idx = idx
	const $icon = $create("img", {
		className: "favicon",
		src: favIconUrl,
	})
	const $a = $create("a", {
		textContent: `${title || url} (${tags.join()})`,
		href: url,
	})
	const $change = $create("button", {
		textContent: "c",
		onclick: promptChangeLink,
	})
	const $delete = $create("button", {
		textContent: "d",
		onclick: deleteLink,
	})
	$li.append($icon, $a, $change, $delete)
	return $li
}

const promptChangeLink = async function() {
	const $li = this.closest("li")
	const { idx } = $li.dataset
	$form.title.value = bucket[idx].title
	$form.url.value   = bucket[idx].url
	$form.tags.value  = bucket[idx].tags.join(",")
	$form.ts.value    = bucket[idx].ts
	$form.onsubmit = () => changeLink($li)
	$dialog.showModal()
}

const changeLink = async function($li) {
	const { idx } = $li.dataset

	bucket[idx].title = $form.title.value
	bucket[idx].url   = $form.url.value
	bucket[idx].tags  = $form.tags.value.split(",").map(x => x.trim())
	bucket[idx].ts    = $form.ts.value

	// `$li` is updated in the UI
	// regardless of whether storage is successfully updated
	// so that the user does not lose their changes if it is not.
	// This is different from `deleteLink()`.
	$li.after(link2html(bucket[idx], idx))
	$li.remove()
	try {
		await S.set({ bucket: bucket.filter(x => x) })
	} catch (e) {
		return // TODO: error handling
	}
}

const deleteLink = async function() {
	const $li = this.closest("li")
	const { idx } = $li.dataset
	// Removing bucket[idx] would mess up indices of later elements
	bucket[idx] = null
	try {
		await S.set({ bucket: bucket.filter(x => x) })
	} catch (e) {
		return // TODO: error handling
	}
	// `$li` is only removed from bucket.html
	// if it is successfully removed from storage
	// so that the UI accurately reflects the extension's state.
	// This is different from `promptChangeLink()`.
	$li.remove()
}

const bucket_load = () => {
	$form.$(`button[type="button"]`).onclick = () => $dialog.close()
	$("ul").append(...bucket.map(link2html))
}

onOrIfDomContentLoaded(bucket_load)
