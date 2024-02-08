<template>
	<div />
</template>

<script>
/* eslint-disable */
import postscribe from 'postscribe'

export default {
	props: {
		async: {
			type: Boolean,
			default: false
		},
		defer: {
			type: Boolean,
			default: false
		},
		src: {
			type: String,
			required: true
		}
	},
	mounted() {
		let script = `<script src="${this.src}"`
		if (this.async) script += ' async'
		if (this.defer) script += ' defer'
		script += '><\/script>'
		postscribe(this.$el, script)
	}
}
</script>
