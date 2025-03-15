<template>
	<section class="flex h-full items-center p-16">
		<div class="container mx-auto my-8 flex flex-col items-center justify-center px-5">
			<div class="max-w-xl text-center">
				<h2 class="mb-8 text-9xl font-extrabold"><span class="sr-only">Error</span>404</h2>
				<p class="text-2xl font-semibold md:text-3xl" v-html="$t('page_404.title')" />
				<p class="mt-4 mb-8" v-html="$t('page_404.text')" />

				<div class="flex justify-center">
					<Link
						href="/"
						class="dark:highlight-white/20 flex h-12 w-full items-center justify-center rounded-lg bg-slate-900 px-6 font-semibold text-white hover:bg-slate-700 focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 focus:outline-none sm:w-auto dark:bg-sky-500 dark:hover:bg-sky-400"
						rel="noopener noreferrer"
						v-html="$t('page_404.btn')"
					/>
				</div>
			</div>
		</div>
	</section>
</template>
