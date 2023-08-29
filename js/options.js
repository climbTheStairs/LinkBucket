import { onOrIfDomContentLoaded } from "/lib/site/js/stairz.js"
import { S, getConfig } from "/js/main.js"

const options_load = async () => {
	const config = await getConfig()
	const [$form] = document.forms
	;[...$form].filter($in => $in.name)
		.forEach($in => $in.checked = config[$in.name])
	$form.addEventListener("submit", options_submit)
}

const options_submit = async function(e) {
	e.preventDefault() // `return false` does not work with `async`
	const [$form] = document.forms
	const config = Object.fromEntries(
		[...$form].map($in => [$in.name, $in.checked]))
	await S.set({ config })
	window.close()
}

onOrIfDomContentLoaded(options_load)
