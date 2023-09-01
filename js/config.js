import { onOrIfDomContentLoaded } from "/lib/site/js/stairz.js"
import { S, getConfig } from "/js/main.js"

const main = async () => {
	const config = await getConfig()
	const [$form] = document.forms
	;[...$form].filter($in => $in.name)
		.forEach($in => $in.checked = config[$in.name])
	$form.onsubmit = configSave
}

const configSave = async function(e) {
	e.preventDefault() // `return false` does not work with `async`
	const [$form] = document.forms
	const config = Object.fromEntries([...$form]
		.filter($in => $in.name)
		.map($in => [$in.name, $in.checked]))
	await S.set({ config })
}

onOrIfDomContentLoaded(main)
