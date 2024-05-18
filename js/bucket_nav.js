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

	let $li
	$sel = $(".selected")

	switch (e.key) {
	case "j":
		if (!$sel)
			return selLink($bucket.children[0])
		if (!($li = $findVisibleFwd($sel.nextElementSibling)))
			return
		return selLink($li)

	case "k":
		if (!$sel)
			return selLink($bucket.children[$bucket.children.length-1])
		if (!($li = $findVisibleBwd($sel.previousElementSibling)))
			return
		return selLink($li)

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

const selLink = ($li) => {
	$sel?.classList.remove("selected")
	$sel = $li
	$sel?.classList.add("selected")
}

const $findVisibleFwd = ($li) => {
	if (!$li || !$li.classList.contains("hidden"))
		return $li
	return $findVisibleFwd($li.nextElementSibling)
}

const $findVisibleBwd = ($li) => {
	if (!$li || !$li.classList.contains("hidden"))
		return $li
	return $findVisibleBwd($li.previousElementSibling)
}

const selNextIfDeleted = (records) => {
	const r = records.find(({removedNodes}) =>
		[...removedNodes].includes($sel))
	if (r)
		selLink($findVisibleFwd(r.nextSibling) ??
			$findVisibleBwd(r.previousSibling))
}

onOrIfDomContentLoaded(main)
