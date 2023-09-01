import {
	$, $create,
	extendProto,
	onOrIfDomContentLoaded,
} from "/lib/site/js/stairz.js"
import { S } from "/js/main.js"

export { promptChangeLink, deleteLink }

extendProto.Element()

const { bucket } = await S.get({ bucket: {} })

const $dialog = $("dialog")
const $form = $dialog.$("form")
const $search = $("#search")
const $bucket = $("#main")

const and = (x, y) => y && x
const or  = (x, y) => y || x
const not = (x) => !x
const OPS = {
	and, or, not,
	_implicit: and, "+": or, "-": not,
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

const link2html = ({ id, title, url, tags, ts, favIconUrl }) => {
	const $li = $create("li", {
		id: "link-" + id,
	})
	const $icon = $create("img", {
		className: "favicon",
		src: favIconUrl,
	})
	const $a = $create("a")
	updateLinkA($a, { title, url, tags, ts })
	const $change = $create("button", {
		textContent: "c",
		onclick: function() {
			promptChangeLink(this.closest("li"))
		},
	})
	const $delete = $create("button", {
		textContent: "d",
		onclick: function() {
			deleteLink(this.closest("li"))
		},
	})
	$li.append($icon, $a, $change, $delete)
	return $li
}

const updateLinkA = ($a, { title, url, tags, ts }) => {
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
		await S.set({ bucket })
	} catch (e) {
		return // TODO: error handling
	}
}

const deleteLink = async function($li) {
	const id = $li.id.slice("link-".length)
	delete bucket[id]
	try {
		await S.set({ bucket })
	} catch (e) {
		return // TODO: error handling
	}
	$li.remove()
}

onOrIfDomContentLoaded(() => {
	$form.$(`button[type="button"]`).onclick = () => $dialog.close()
	$search.onkeydown = (e) => {
		if (e.key === "Enter")
			filt($search.value)
	}
	$bucket.append(...Object.values(bucket).map(link2html))
})
