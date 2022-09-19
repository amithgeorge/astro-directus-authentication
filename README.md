This is based off https://github.com/directus/examples

This is a demo repo. Wanted to check how I could integrate Astro and Directus CMS. The Astro site uses Directus for user login/authentication.

In the `astro` folder, create a copy of the `.env.sample` file and name it `.env`. For testing purposes you may keep existing value for `AUTH_COOKIE_SECRET_KEY`. Eventually do change it to a different string.

Install the npm dependencies in each folder.

```shell
cd astro
npm install
cd ../directus
npm install
```

To run the demo, first start the Directus server.

```shell
(cd directus; npm run start)
```

Then in a different tab, start the Astro dev server.

```shell
(cd astro; npm run dev)
```

Visit the homepage at `http://localhost:3000`. Click the `Login` button. You should see the homepage with "logged in" content.
