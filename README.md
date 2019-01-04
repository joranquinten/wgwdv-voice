# wgwdv-voice-webhook

Docs: https://dialogflow.com/docs/fulfillment/how-it-works#response_format
Docs: https://github.com/dialogflow

Deploy with:

```
npm run deploy
```

After deployment. Test the new version by sending a POST request to the {DEPLOYED_DOMAIN_INCLUDING_PROTOCOL} with the wgwdv-secret in the header. If that workds, then alias the host to: "wgwdv-webhook.watzalikdoenvandaag.nl" with the following command:

```
now alias {DEPLOYED_DOMAIN_INCLUDING_PROTOCOL} wgwdv-webhook.watzalikdoenvandaag.nl
```