<template>
	<div class="mb-1">
		<!-- file upload input -->
		<div class="custom-file">
			<label :for="id" class="form-label" v-html="label" />
			<input :id="id" type="file" :accept="accept" :multiple="multiple" class="form-control" :class="{ 'is-invalid': error }" @change="uploadFile" />
			<span class="invalid-feedback" v-html="error" />
		</div>
		<!-- uploaded files -->
		<div v-for="(upload, index) in uploads" :key="index" class="custom-file-upload d-flex my-half">
			<span class="custom-file-upload-description me-1 align-self-center" :class="{ error: upload.error }">{{ upload.description }}</span>
			<span v-if="!upload.error" v-show="!upload.loading" class="custom-file-upload-clear btn btn-secondary btn-sm align-self-start" @click="clearFile(index)">
				X
			</span>
			<transition name="fade">
				<div v-show="upload.loading" class="spinner-border spinner-border-sm" role="status">
					<span class="visually-hidden">Loading</span>
				</div>
			</transition>
		</div>
	</div>
</template>

<script>
import axios from 'axios'
import Element from './Element.vue'

const UPLOAD_FILE_URL = '/wp-json/jdev/upload-file'
const UPLOAD_MAX_FILES_COUNT = 15

export default {
	extends: Element,
	props: {
		outputField: {
			type: Object,
			required: true
		}
	},
	data() {
		return {
			accept: this.input.data.allowedExtensions
				? this.input.data.allowedExtensions
						.split(',')
						.map((extension) => `.${extension.trim()}`)
						.join(', ')
						.trim()
				: '*',
			maxFiles: this.input.data.maxFiles ? this.input.data.maxFiles : UPLOAD_MAX_FILES_COUNT,
			maxFileSize: {
				mb: this.input.data.maxFileSize,
				// eslint-disable-line no-magic-numbers
				kb: Math.floor(this.input.data.maxFileSize * 1000),
				// eslint-disable-line no-magic-numbers
				b: Math.floor(this.input.data.maxFileSize * 1000000)
			},
			multiple: this.input.data.multiple,
			outputKey: this.outputField.key,
			uploads: []
		}
	},
	methods: {
		clearFile(index) {
			this.uploads.splice(index, 1)
		},

		submitData() {
			let data = ''
			this.uploads
				.filter((upload) => !upload.error && upload.url)
				.forEach((upload, index) => {
					// eslint-disable-next-line no-param-reassign,no-plusplus
					data += `${++index}: ${upload.description} - ${upload.url} \r\n`
				})
			return {
				[this.outputKey]: data
			}
		},

		uploadFile(event) {
			if (!event.target.files.length) return
			let files = Array.from(event.target.files)
			if (files.length > this.maxFiles) {
				this.error = `Maximum allowed files count ${this.maxFiles} reached`
				files = files.slice(0, this.maxFiles)
			}
			files.forEach((file) => {
				if (this.uploads.length === this.maxFiles) {
					this.error = `Maximum allowed files count ${this.maxFiles} reached`
				} else {
					this.uploads.push({
						description: `${file.name} - ${Math.round(file.size / 1024)}Kb`, // eslint-disable-line no-magic-numbers
						url: null,
						error: false,
						loading: false
					})
					const upload = this.uploads[this.uploads.length - 1]
					if (this.maxFileSize.length && file.size > this.maxFileSize.b) {
						// check file size if maxFileSize is defined
						upload.error = true
						upload.description += ` - Maximum allowed file size ${this.maxFileSize.mb}MB exceeded`
					} else {
						// upload file
						upload.loading = true
						const formData = new FormData()
						formData.append('file', file)
						axios
							.post(UPLOAD_FILE_URL, formData)
							.then((response) => {
								upload.url = response.data.url
							})
							.catch((error) => {
								console.error('Oops an error occurred: ', error)
							})
							.then(() => {
								upload.loading = false
							})
					}
				}
			})
		}
	}
}
</script>
