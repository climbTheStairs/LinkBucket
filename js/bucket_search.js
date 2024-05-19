import {$, onOrIfDomContentLoaded} from "/lib/site/js/stairz.js"

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
	$search.onkeydown = (e) => {
		if (e.key === "Enter")
			filt($search.value)
	}
}

const filt = (q) => {
	q = q.toLowerCase().split(" ").filter(x => x)
	for (const $li of $bucket.children) {
		const id = $li.id.slice("link-".length)
		// TODO: `bucket` undefined
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
				...[...Array(OPS[t].length)].map(() => stk.pop())))
		else
			stk.push(f(t))
	return stk.reduce(OPS._implicit)
}

onOrIfDomContentLoaded(main)
