require("dotenv").config();

const got = require("got");

const express = require("express");

const app = express();
const path = require("path");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/pay", async (req, res) => {
  try {
    const response = await got.post("https://api.flutterwave.com/v3/payments", {
      headers: {
          Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`
      },
      json: {
          tx_ref: Date.now().toString(),
          amount: "5000",
          currency: "NGN",
          redirect_url: "https://webhook.site/9d0b00ba-9a69-44fa-a43d-a82c33c36fdc",// the webpage to redirect the user after a successful/cancelled transaction
          customer: {
              email: req.body.email,
              phonenumber: req.body.phone,
              name: req.body.name
          },
          customizations: {
              title: "Payment Page",// the name of your business/page
              logo: ""// the web url of the logo to display
          }
      }
    }).json();

    res.redirect(response.data.link);
  } catch(error) {
    return res.status(500).json({
      status: false,
      message: 'Fetch failed',
      error
    });
  }
});

app.post("/webhook", async (req, res) => {
  try {
    const secretHash = process.env.FLW_SECRET_HASH;
    const signature = req.headers["verif-hash"];

    if (!signature || signature !== secretHash) {
      return res.status(401).end();
    }

    const payload = req.body;

    // It's a good idea to log all received events.
    console.log(payload);

    const csEmail = payload.customer?.email;
    const txAmount = payload.amount;
    const txReference = payload.txRef;

    if (
      response.data.status === "successful"
      && response.data.amount === expectedAmount
      && response.data.currency === expectedCurrency
    ) {
      return res.status(200).end();
    }
    
    return res.status(402).end();
  } catch (err) {
    return res.status(500).end();
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, console.log(`Server started on port ${PORT}`));
