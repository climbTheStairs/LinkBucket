import {$, onOrIfDomContentLoaded} from "/lib/site/js/stairz.js"

const $bucket = $("#bucket")
let $sel, $selNext

const main = () => {
	document.onkeydown = keyboardNav
	for (const $link of $bucket.children)
		// Theoretically but not practically possible race condition (?)
		$link.addEventListener("link-delete", () => selLink($selNext))
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
	$selNext = $nextVisible($sel) ?? $prevVisible($sel)
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

onOrIfDomContentLoaded(main)
