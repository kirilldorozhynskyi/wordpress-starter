# Animation directives

Use the shared directives where the design calls for motion. Follow the Hinohara pattern of targeting the smallest element that needs to move. Choose timing,
scale and trigger positions from the current design. The values below are starting points.

## Reveal a heading or paragraph

Apply `v-reveal-heading` to an individual heading for a character reveal and `v-reveal-text` to an individual paragraph for a line reveal. Keep links, buttons
and form controls outside the animated text element. Preserve existing `<pre>` elements and their content.

```vue
<h2 v-if="ce.title" v-reveal-heading="{ start: 'top 85%', duration: 0.65, stagger: 0.018 }">
	{{ ce.title }}
</h2>
<p v-if="ce.intro" v-reveal-text="{ duration: 0.8, stagger: 0.1 }">
	{{ ce.intro }}
</p>
```

Both directives accept `start`, `duration`, `stagger` and `delay`. `rotation` sets the starting angle for the character reveal. Timing values are in seconds.
If a parent needs to wait for an async layout before measuring lines, set `data-reveal-pending` on that parent until the layout is ready, then remove the attribute.

## Reveal media with a mask

Use `v-reveal-mask` on a media frame for a clip-path reveal. To reveal several frames as a group, pass a descendant `selector` and a `stagger` in seconds.

```vue
<div v-if="ce.image" v-reveal-mask="{ direction: 'left', duration: 1.1, ease: 'power3.out', fade: false }" class="aspect-video overflow-hidden">
	<Image :image="ce.image" class="block size-full" img-class="size-full object-cover" />
</div>
```

`direction` accepts `top`, `left` or `bottom`. For a sliding reveal use `slide: true` on an overflow-hidden frame with a child element. Each selected frame
stays in place while its first child moves.

## Zoom media while scrolling

Keep the outer frame responsible for layout and clipping. Apply `v-scroll-zoom-out` to the inner full-size layer. The directive uses the parent as its scroll
trigger, so place it on the direct child of the frame.

```vue
<div v-if="ce.image" class="aspect-video overflow-hidden">
	<div v-scroll-zoom-out="{ from: 1.2, to: 1, start: 'top bottom', end: 'bottom top', scrub: true }" class="size-full">
		<Image :image="ce.image" class="block size-full" img-class="size-full object-cover" />
	</div>
</div>
```

## Fade in a block

Use `v-jd-animate` for a simple fade-up as a block enters the viewport. `delay` and `duration` are in milliseconds. Use `once: true` for a single entrance.

```vue
<p v-if="ce.caption" v-jd-animate="{ once: true, delay: 80, duration: 500 }">
	{{ ce.caption }}
</p>
```

## Integration checks

The directives are registered in `resources/Private/js/inertia.ts`. The client implementations are in `resources/Private/js/directives/` and the shared
styles are in `resources/Private/css/animations.css`, all under `wp-content/themes/inertia/`. Keep GSAP behind the dynamic imports in `directives/client.ts`
so it loads when a directive that needs it mounts. Run `npm run test:e2e -- --project=motion` to check SSR and hydration, reduced motion, and cleanup after
Inertia navigation.
