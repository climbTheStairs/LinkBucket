import { $, $create, onOrIfDomContentLoaded } from "/lib/site/js/stairz.js"
import { S } from "/js/main.js"

const { bucket } = await S.get({ bucket: [] })

const link2html = ({ title, url, tags, ts, favIconUrl }) => {
	const $li = $create("li")
	const $img = $create("img", {
		className: "favicon",
		src: favIconUrl,
	})
	const $a = $create("a", {
		textContent: `${title} (${tags.join()})`,
		href: url,
		title: ts,
	})
	$li.append($img, $a)
	return $li
}

const bucket_load = () => $("ul").append(...bucket.map(link2html))

onOrIfDomContentLoaded(bucket_load)
