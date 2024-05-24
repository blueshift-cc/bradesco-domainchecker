import express, { Response, Request } from "express";
import bodyParser from 'body-parser';
import cors from 'cors';
import fetch from "node-fetch";
import psl from 'psl';
//import 'simple-whois' from 'simple-whois';
const simpleWhois = require('simple-whois');
const https = require('https');

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

//const allowedOrigins = ['http://localhost:3000', 'http://localhost:80', 'https://gadetector.bohr.io', 'https://gadetector.blueshift.cc'];
const allowedOrigins = ['http://localhost:3000', 'http://localhost', 'http://localhost:81', 'https://gadetector.bohr.io', 'https://gadetector.blueshift.cc'];

const options: cors.CorsOptions = {
  origin: allowedOrigins
};

var app = express();
app.use(cors(options));
app.use(bodyParser.json({ limit: "100mb" }))
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }))

const validateDomain = (s: string) => {
  try {
    new URL("https://" + s);
    return true;
  }
  catch (e) {
    console.error(e);
    return false;
  }
};

function extractHostname(url: any) {
  var hostname;
  //find & remove protocol (http, ftp, etc.) and get hostname

  if (url.indexOf("//") > -1) {
    hostname = url.split('/')[2];
  } else {
    hostname = url.split('/')[0];
  }

  //find & remove port number
  hostname = hostname.split(':')[0];
  //find & remove "?"
  hostname = hostname.split('?')[0];

  validateDomain(hostname);
  return hostname;
}


app.get("/", function (req: Request, res: Response) {
  res.send("Hello world");
});

app.post("/process", async function (req: Request, res: Response) {

  var responseData: any = [];

  try {
    const urlTextArea: String = req.body?.urlTextArea;

    const urls: string[] = urlTextArea.split(/[;\n ]/);

    const urlsDeDuplicated = [...new Set(urls)];

    for (let i = 0; i < urlsDeDuplicated.length; i++) {

      let hostname: any = psl.get(extractHostname(urlsDeDuplicated[i]));

      //let url = new URL(hostname);
      let url = new URL(`https://${hostname}`);
      await fetch(url, {
        //signal: AbortSignal.timeout(2000),
        agent: httpsAgent
      }).then(async (response: any) => {
        const data = await response.text();
        let whoisData = await simpleWhois.getWhois(hostname, { deepWhois: false });
        console.log(whoisData);
        responseData.push({ "domain": hostname, "status": response.status, whois: whoisData });

      }).catch((e: any) => {
        console.log(e);
        responseData.push({ "domain": hostname, "status": '-', whois: '-' });
      });
    }
    res.json(responseData);
  }
  catch (e) {
    res.status(500);
    res.send(JSON.stringify(e));
    return;
  }
});

if (!module.parent) {
  app.listen(3000);
  console.log("Express started on port 3000");
}

export default app;
