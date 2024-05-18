import {$, extendProto, onOrIfDomContentLoaded} from "/lib/site/js/stairz.js"
extendProto.Element()

const $bucket = $("#bucket")
let $sel

const main = () => {
	document.onkeydown = keyboardNav
	new MutationObserver(selNextIfDeleted).observe($bucket, {childList: true})
}

const keyboardNav = async (e) => {
	if (e.key === "Escape")
		return document.activeElement.blur()
	if (![document.body, null].includes(document.activeElement))
		return

	$sel = $(".selected")

	switch (e.key) {
	case "j":
		if (!$sel)
			return selLink($bucket.children[0])
		return selLink($findVisibleFwd($sel.nextElementSibling))

	case "k":
		if (!$sel)
			return selLink($bucket.children[$bucket.children.length-1])
		return selLink($findVisibleBwd($sel.previousElementSibling))

	case "c":
		if (!$sel)
			return
		// `setTimeout` with 1ms prevents "c"
		// from being inserted into `<input>` in opened modal.
		// TODO: Is there a better way to do this?
		return setTimeout(() => $sel?.$(".link-change").click(), 1)

	case "d":
		if (!$sel)
			return
		return $sel?.$(".link-delete").click()

	case "g":
		return selLink($bucket.children[0])

	case "G":
		return selLink($bucket.children[$bucket.children.length-1])

	case "Enter":
		$sel?.$("a").click()
		return
	}
}

const selLink = ($link) => {
	$sel?.classList.remove("selected")
	$sel = $link
	$sel?.classList.add("selected")
}

const $findVisibleFwd = ($link) => {
	if (!$link || !$link.classList.contains("hidden"))
		return $link
	return $findVisibleFwd($link.nextElementSibling)
}

const $findVisibleBwd = ($link) => {
	if (!$link || !$link.classList.contains("hidden"))
		return $link
	return $findVisibleBwd($link.previousElementSibling)
}

const selNextIfDeleted = (records) => {
	const r = records.find(({removedNodes}) =>
		[...removedNodes].includes($sel))
	if (r)
		selLink($findVisibleFwd(r.nextSibling) ??
			$findVisibleBwd(r.previousSibling))
}

onOrIfDomContentLoaded(main)
