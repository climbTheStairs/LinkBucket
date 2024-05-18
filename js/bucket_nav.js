import {$, extendProto, onOrIfDomContentLoaded} from "/lib/site/js/stairz.js"
extendProto.Element()

const $bucket = $("#bucket")
let $sel

const main = () => {
	document.onkeydown = keyboardNav
	new MutationObserver(modifyNewLinks).observe($bucket, {childList: true})
	for (const $link of $bucket.children)
		if (!("navigable" in $link.dataset))
			modifyNewLink($link)
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
		return selLink($nextVisible($sel))

	case "k":
		if (!$sel)
			return selLink($bucket.children[$bucket.children.length-1])
		return selLink($prevVisible($sel))

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

const $nextVisible = ($link) => {
	do
		$link = $link?.nextElementSibling
	while ($link && $link.classList.contains("hidden"))
	return $link
}

const $prevVisible = ($link) => {
	do
		$link = $link?.previousElementSibling
	while ($link && $link.classList.contains("hidden"))
	return $link
}

const modifyNewLinks = (records) => {
	for (const {addedNodes} of records)
		for (const $link of addedNodes)
			modifyNewLink($link)
}

const modifyNewLink = ($link) => {
	const $d = $link.$(".link-delete")
	const linkDeleteOld = $d.onclick.bind($d)
	$d.onclick = async () => {
		const $selNext = $nextVisible($sel) ?? $prevVisible($sel)
		await linkDeleteOld()
		if (!$bucket.contains($sel))
			selLink($selNext)
	}
	$link.dataset.navigable = true
}

onOrIfDomContentLoaded(main)
