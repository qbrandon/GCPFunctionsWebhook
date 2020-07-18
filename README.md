# GCPFunctionsWebhook
Basic example of GCP Functions based webhook handler for UiPath.  
It illustrates how to leverage `job.completed` incoming webhooks targeting a specific package name to send an email notification of completion.  
More than half the code is actually handling the email-sending part via Sengrid.

## Deployment
In your Google Cloud Platform console, create a new Function and select the Node.js v10 runtime.  
You can copy/paste the content of `index.js` and `package.json` in the inline editor.  
DO change the placeholder `<SomePackageName>` to the package name you actually wish to monitor.
Then create 3 environment variables to configure:
- `SECRET_KEY`: the same secret key configured in Orchestrator for the Webhook endpoint
- `SENDGRID_API_KEY`: the API key from Sendgrid (simply needs permissions to send emails)
- `MAILTO`: the email address to notify

Then copy the function's URL to configure the webhook in Orchestrator.

## Remarks
The default `noreply@domain.com` from address is most likely going to lead to your notification not reaching the MAILTO address due to spam filters picking up the origin as suspicious, so feel free to change it to something more adapted to your use case.

As you can see, the code shows how easy it is to leverage the PayloadHandler class as an event emitter for each webhook type.  
You also get to define your own behavior for the rejection of the payload/signature pair (here simply returning a 500 error.)  
I have considered turning the package name into a configuration (one of the env var,) but eventually decided that it was actually part of the code logic, so left it hardcoded there.  
A proper implementation would rely on an external config file (spreadsheet?) to store package-email address pairs, but that would drown the sample into out-of-scope complexity.