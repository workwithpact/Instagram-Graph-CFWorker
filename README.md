# Multi-Tenant Instagram Basic Display on CloudFlare Workers
We've had to set up quite a few Basic Display instagram connectors for our clients.

We've reinvented the wheel a few times, and grew tired of it. So we made this multi-tenant CloudFlare Worker to handle instagram basic displays.

## Setting it up
Once deployed to Cloudflare, create a new secret for each of your clients. For example, if your client is `alexleclair`, do:
```
wranger secret put TOKEN_ALEXLECLAIR
```
and paste in your [Basic Display API token](https://developers.facebook.com/docs/instagram-basic-display-api/)

Instagram data will then be available at : `https://<worker-name>.<subdomain>.workers.dev/alexleclair`


## Allowing user login (Advanced use case)
If you want, you can also use the Instagram Login flow and save tokens in Workers KV.

To do so, first create a new KV namespace within Cloudflare and copy its ID.
Next, open `wrangler.toml` and add the following configuration at the bottom of the file, taking care to change `{ID}` to the ID you copied from Cloudflare.

```
kv_namespaces = [ 
  { binding = "graphConfig", id = "{ID}", preview_id = "{ID}" }
]
```

Once done, head over to Facebook Developers and find the app you created in the "Setting it up" section of this README.
In the left sidebar, under PRODUCTS, click on `Instagram Basic Display`, then `Basic Display`.

Copy your Instagram App Id, and set it up in your Worker as a secret:
```
wrangler secret put APP_ID
```

Do the same thing with the app secret:
```
wrangler secret put APP_SECRET
```

Once published to cloudflare (`wrangler publish`), head over to your Worker's URL: `https://{WORKER_NAME}.{WORKER_SUBDOMAIN}.workers.dev`, which will automatically redirect you to the Instagram login flow.

Once you've gone through the login flow, (and assuming you were setup as a tester if the app is in development mode), you will be able to fetch your media through `https://{WORKER_NAME}.{WORKER_SUBDOMAIN}.workers.dev/{USERNAME}`, where `{USERNAME}` is your Instagram username.