import {onOrIfDomContentLoaded} from "/lib/site/js/stairz.js"

const [$form] = document.forms

const main = () => {
	configLoad()
	$form.onsubmit = configSave
}

const configLoad = async () => {
	const config = await browser.runtime.sendMessage("config")
	;[...$form].filter($in => $in.name)
		.forEach($in => $in.checked = config[$in.name])
}

const configSave = async (e) => {
	e.preventDefault() // `return false` does not work with `async`
	const config = Object.fromEntries([...$form]
		.filter($in => $in.name)
		.map($in => [$in.name, $in.checked]))
	await browser.storage.local.set({config})
}

onOrIfDomContentLoaded(main)
