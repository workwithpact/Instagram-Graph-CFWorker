# Multi-Tenant Instagram Basic Display on CloudFlare Workers
We've had to set up quite a few Basic Display instagram connectors for our clients.

We've reinvented the wheel a few times, and grew tired of it. So we made this multi-tenant CloudFlare worker to handle instagram basic displays.

## Setting it up
Once deployed to Cloudflare, create a new secret for each of your clients. For example, if your client is `alexleclair`, do:
```
wranger secret put TOKEN_ALEXLECLAIR
```
and paste in your [https://developers.facebook.com/docs/instagram-basic-display-api/](Basic Display API token)

Instagram data will then be available at : https://<worker-name>.<subdomain>.workers.dev/alexleclair


