const express = require("express");
const app = express();
const monitor = require("./monitor");
const creds = require("./creds");
const port = 3000;

app.get("/", (req, res) => res.send("Hello World!"));
var _creds = creds.setup();

var credspass = monitor
	.credentials({
		bolt: true,
		routing: true,
		ip: _creds.ip || "localhost",
		user: _creds.username || "neo4j",
		password: _creds.password || "abc123"
	})
	.then(res => console.log(res))
	.catch(err => console.log("err", err));

app.listen(port, () => console.log(`Monitoring on port ${port}!`));
