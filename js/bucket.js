import {
	$, $create,
	extendProto,
	onOrIfDomContentLoaded,
} from "/lib/site/js/stairz.js"
import {S} from "/js/main.js"

export {promptChangeLink, deleteLink}

extendProto.Element()

const {bucket, favicons} = await S.get({bucket: {}, favicons: {}})

const $dialog = $("dialog")
const $form = $dialog.$("form")
const $search = $("#search")
const $bucket = $("#bucket")

const and = (x, y) => y && x
const or  = (x, y) => y || x
const not = (x) => !x
const OPS = {
	and, or, not,
	_implicit: and, "+": or, "-": not,
}

const main = () => {
	$form.$(`button[type="button"]`).onclick = () => $dialog.close()
	$search.onkeydown = (e) => {
		if (e.key === "Enter")
			filt($search.value)
	}
	$bucket.append(...Object.values(bucket).map(link2html))
}

const filt = (q) => {
	q = q.toLowerCase().split(" ").filter(x => x)
	for (const $li of $bucket.children) {
		const id = $li.id.slice("link-".length)
		const hasTag = [].includes.bind(bucket[id].tags)
		$li.classList.toggle("hidden", !evalRpn(q, hasTag))
	}
}

const evalRpn = (rpn, f = x => x) => {
	if (rpn.length == 0)
		return true
	const stk = []
	for (const t of rpn)
		if (Object.hasOwn(OPS, t))
			stk.push(OPS[t](
				...[...Array(OPS[t].length)]
					.map(() => stk.pop())))
		else
			stk.push(f(t))
	return stk.reduce(OPS._implicit)
}

const getFavicon = (url) => {
	try {
		return favicons[new URL(url).host] ?? ""
	} catch (_) {
		return ""
	}
}

const link2html = ({id, title, url, tags, ts}) => {
	const $li = $create("li", {
		id: "link-"+id,
	})
	const $icon = $create("img", {
		className: "favicon",
		src: getFavicon(url), // TODO: Default favicon
	})
	const $a = $create("a")
	updateLinkA($a, {title, url, tags, ts})
	const $c = $create("button", {
		textContent: "c",
		onclick: function() {
			promptChangeLink(this.closest("li"))
		},
	})
	const $d = $create("button", {
		textContent: "d",
		onclick: function() {
			deleteLink(this.closest("li"))
		},
	})
	$li.append($d, $c, $icon, $a)
	return $li
}

const updateLinkA = ($a, {title, url, tags, ts}) => {
	$a.textContent = `${title || url} (${tags.join(",")})`
	$a.href = url
	$a.title = ts
}

const promptChangeLink = function($li) {
	const id = $li.id.slice("link-".length)
	$form.title.value = bucket[id].title
	$form.url.value   = bucket[id].url
	$form.tags.value  = bucket[id].tags.join(",")
	$form.ts.value    = bucket[id].ts
	$form.onsubmit = () => changeLink($li)
	$dialog.showModal()
}

const changeLink = async function($li) {
	const id = $li.id.slice("link-".length)
	bucket[id].title = $form.title.value
	bucket[id].url   = $form.url.value
	bucket[id].tags  = $form.tags.value.split(",").map(x => x.trim())
	bucket[id].ts    = $form.ts.value
	updateLinkA($li.$("a"), bucket[id])

	// `$li` is updated in the UI
	// regardless of whether storage is successfully updated
	// so that the user does not lose their changes if it is not.
	// This is different from `deleteLink()`.
	// TODO: Do this a different way such that consistency
	try {
		await S.set({bucket})
	} catch (e) {
		return // TODO: error handling
	}
}

const deleteLink = async function($li) {
	if (!window.confirm("Are you sure you want to delete this link?"))
		return false
	const id = $li.id.slice("link-".length)
	const link = bucket[id]
	delete bucket[id]
	try {
		await S.set({bucket})
	} catch (e) {
		bucket[id] = link
		return false // TODO: error handling
	}
	$li.remove()
	return true
}

onOrIfDomContentLoaded(main)
