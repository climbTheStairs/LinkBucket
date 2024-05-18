import {$, onOrIfDomContentLoaded} from "/lib/site/js/stairz.js"
import {promptChangeLink, deleteLink} from "/js/bucket.js"

const $bucket = $("#bucket")

const main = () => document.onkeydown = keyboardNav

const keyboardNav = async (e) => {
	if (e.key === "Escape")
		return document.activeElement.blur()
	if (![document.body, null].includes(document.activeElement))
		return

	const $sel = $(".selected")

	switch (e.key) {
	case "j":
		if (!$sel)
			return $bucket.children[0].classList.add("selected")
		if (!$nextVisible($sel))
			return
		$sel.classList.remove("selected")
		$nextVisible($sel).classList.add("selected")
		return

	case "k":
		if (!$sel)
			return $bucket.children[$bucket.children.length-1]
				.classList.add("selected")
		if (!$prevVisible($sel))
			return
		$sel.classList.remove("selected")
		$prevVisible($sel).classList.add("selected")
		return

	case "c":
		if (!$sel)
			return
		// `setTimeout` with 1ms prevents "c"
		// from being inserted into the opened `<input>`.
		// TODO: Is there a better way to do this?
		setTimeout(() => promptChangeLink($sel), 1)
		return

	case "d":
		if (!$sel)
			return
		const $next = $nextVisible($sel) || $prevVisible($sel)
		if (await deleteLink($sel))
			$next?.classList.add("selected")
		return

	case "g":
		$sel?.classList.remove("selected")
		$bucket.children[0]?.classList.add("selected")
		return

	case "G":
		$sel?.classList.remove("selected")
		$bucket.children[$bucket.children.length-1]
			?.classList.add("selected")
		return

	case "Enter":
		$sel?.$("a").click()
		return
	}
}

const $nextVisible = ($link) => {
	do
		$link = $link.nextElementSibling
	while ($link && $link.classList.contains("hidden"))
	return $link
}

const $prevVisible = ($link) => {
	do
		$link = $link.previousElementSibling
	while ($link && $link.classList.contains("hidden"))
	return $link
}

onOrIfDomContentLoaded(main)
