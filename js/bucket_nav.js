import {$, onOrIfDomContentLoaded} from "/lib/site/js/stairz.js"
import {promptChangeLink, deleteLink} from "/js/bucket.js"

const $bucket = $("#bucket")

const main = () => document.onkeydown = keyboardNav

const keyboardNav = (e) => {
	if (e.key === "Escape")
		return document.activeElement.blur()
	if (![document.body, null].includes(document.activeElement))
		return

	const $hi = $(".highlighted")

	switch (e.key) {
	case "j":
		if (!$hi)
			return $bucket.children[0].classList.add("highlighted")
		if (!$nextVisible($hi))
			return
		$hi.classList.remove("highlighted")
		$nextVisible($hi).classList.add("highlighted")
		return

	case "k":
		if (!$hi)
			return $bucket.children[$bucket.children.length-1]
				.classList.add("highlighted")
		if (!$prevVisible($hi))
			return
		$hi.classList.remove("highlighted")
		$prevVisible($hi).classList.add("highlighted")
		return

	case "c":
		if (!$hi)
			return
		// `setTimeout` with 1ms prevents "c"
		// from being inserted into the opened `<input>`.
		// TODO: Is there a better way to do this?
		setTimeout(() => promptChangeLink($hi), 1)
		return

	case "d":
		if (!$hi)
			return
		deleteLink($hi)
		;($nextVisible($hi) || $prevVisible($hi))
			?.classList.add("highlighted")
		return

	case "g":
		$hi?.classList.remove("highlighted")
		$bucket.children[0]?.classList.add("highlighted")
		return

	case "G":
		$hi?.classList.remove("highlighted")
		$bucket.children[$bucket.children.length-1]
			?.classList.add("highlighted")
		return

	case "Enter":
		$hi?.$("a").click()
		return
	}
}

const $nextVisible = ($el) => {
	do
		$el = $el.nextElementSibling
	while ($el && $el.classList.contains("hidden"))
	return $el
}

const $prevVisible = ($el) => {
	do
		$el = $el.previousElementSibling
	while ($el && $el.classList.contains("hidden"))
	return $el
}

onOrIfDomContentLoaded(main)
