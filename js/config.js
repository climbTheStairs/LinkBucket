import {onOrIfDomContentLoaded} from "/lib/site/js/stairz.js"
import {S, getConfig} from "/js/main.js"

const main = () => {
	const [$form] = document.forms
	configLoad()
	$form.onsubmit = configSave
}

const configLoad = async () => {
	const config = await getConfig()
	const [$form] = document.forms
	;[...$form].filter($in => $in.name)
		.forEach($in => $in.checked = config[$in.name])
}

const configSave = async (e) => {
	const [$form] = document.forms
	const config = Object.fromEntries([...$form]
		.filter($in => $in.name)
		.map($in => [$in.name, $in.checked]))
	await S.set({config})
	e.preventDefault() // `return false` does not work with `async`
}

onOrIfDomContentLoaded(main)
