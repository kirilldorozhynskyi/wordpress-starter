<template>
	<slot />
</template>

<script>
/* eslint-disable */
export default {
	mounted() {
		this.animateNumbers()
	},
	methods: {
		animateNumbers() {
			let observer = new IntersectionObserver(
				(entries) => {
					entries.forEach((entry) => {
						if (entry.isIntersecting) {
							const elNumbers = entry.target.querySelectorAll('.ce-counter-item-number')
							if (elNumbers) {
								elNumbers.forEach((counter) => {
									const animate = () => {
										const speed = counter.getAttribute('data-speed')
										const number = +counter.getAttribute('data-number')
										const data = +counter.innerText
										const time = number / speed

										if (data < number) {
											counter.innerText = Math.ceil(data + time)
											setTimeout(animate, 1)
										} else {
											counter.innerText = number
										}
									}

									animate()
								})
							}
						}
					})
				},
				{ rootMargin: '-50% 0%' }
			)
			new Set([document.querySelector('.ce-counter')]).forEach((element) => {
				observer.observe(element)
			})
		}
	}
}
</script>
