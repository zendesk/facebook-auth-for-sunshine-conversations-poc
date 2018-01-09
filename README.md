# Getting started

1. create a _.env_ file using _.env.example_ as a template
2. Run `npm i`
3. Run `npm start`
4. Deploy this service behind a proxy on port 8000 (e.g. ngrok)
5. Whitelist your proxy domain by adding it as a Website platform in your Facebook app settings
6. Visit the root route of your proxy service to use a UI to integrate a Facebook page to a Smooch app

**Warning:** In this code sample, sensitive, non-expiring, page access tokens are exposed to the client for the sake of simplicity of exposition. Do not use this pattern in your production applications.
