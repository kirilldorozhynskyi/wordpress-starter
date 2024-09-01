<template>
	<section class="flex items-center h-full p-16">
		<div class="container flex flex-col items-center justify-center px-5 mx-auto my-8">
			<div class="max-w-xl text-center">
				<h2 class="mb-8 font-extrabold text-9xl"><span class="sr-only">Error</span>404</h2>
				<p class="text-2xl font-semibold md:text-3xl" v-html="$tc('default.404.title')" />
				<p class="mt-4 mb-8" v-html="$tc('default.404.text')" />

				<div class="flex justify-center">
					<Link
						href="/"
						class="bg-slate-900 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 text-white font-semibold h-12 px-6 rounded-lg w-full flex items-center justify-center sm:w-auto dark:bg-sky-500 dark:highlight-white/20 dark:hover:bg-sky-400"
						rel="noopener noreferrer"
						v-html="$tc('default.404.btn')"
					/>
				</div>
			</div>
		</div>
	</section>
</template>
