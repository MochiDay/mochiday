# Welcome to MochiDay!

📖 See the [Remix docs](https://remix.run/docs) and the [Remix Vite
docs](https://remix.run/docs/en/main/future/vite) for details on
supported features.

## Environment Variables

Start by copying `.dev.vars.example` to `.dev.vars` and filling in the
values.

```sh
npm run init
```

## Supabase

If you made any changes to the Supabase schema, you will need to
regenerate the types following [the guide](https://supabase.com/docs/reference/javascript/typescript-support).

## Typegen

Generate types for your Cloudflare bindings in `wrangler.toml`:

```sh
npm run typegen
```

You will need to rerun typegen whenever you make changes to `wrangler.toml`.

## Development

Run the Vite dev server:

```sh
npm run dev
```

To run Wrangler:

```sh
npm run build
npm run start
```

## Deployment

> [!WARNING]  
> Cloudflare does _not_ use `wrangler.toml` to configure deployment bindings.
> You **MUST** [configure deployment bindings manually in the Cloudflare dashboard][bindings].

First, build your app for production:

```sh
npm run build
```

Then, deploy your app to Cloudflare Pages:

```sh
npm run deploy
```

[bindings]: https://developers.cloudflare.com/pages/functions/bindings/
