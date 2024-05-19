import {onOrIfDomContentLoaded} from "/lib/site/js/stairz.js"
import {S, getConfig} from "/js/main.js"

const [$form] = document.forms

const main = () => {
	configLoad()
	$form.onsubmit = configSave
}

const configLoad = async () => {
	const config = await getConfig()
	;[...$form].filter($in => $in.name)
		.forEach($in => $in.checked = config[$in.name])
}

const configSave = async (e) => {
	e.preventDefault() // `return false` does not work with `async`
	const config = Object.fromEntries([...$form]
		.filter($in => $in.name)
		.map($in => [$in.name, $in.checked]))
	await S.set({config})
}

onOrIfDomContentLoaded(main)
