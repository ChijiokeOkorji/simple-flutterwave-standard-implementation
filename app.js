require("dotenv").config();

const axios = require("axios");
const express = require("express");

const app = express();
const path = require("path");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// This is an example merely for tutorial purposes. Actual implementation may differ.
app.post("/pay", async (req, res) => {
  try {
    const response = await axios.post('https://api.flutterwave.com/v3/payments', {
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
    }, {
      headers: {
        Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`
      }
    });

    res.redirect(response.data.data.link);
  } catch(error) {
    return res.status(500).json({
      status: false,
      message: 'Fetch failed',
      error
    });
  }
});

// This is an example merely for tutorial purposes. Actual implementation may differ.
app.post("/webhook", async (req, res) => {
  try {
    const secretHash = process.env.FLW_SECRET_HASH;
    const signature = req.headers["verif-hash"];

    if (!signature || signature !== secretHash) {
      return res.status(401).end();
    }

    // It's a good idea to log all received events.
    console.log(req.body);

    if (
      response.data.status === "successful"
      && response.data.amount === expectedAmount
      && response.data.currency === expectedCurrency
    ) {
      // Do something...
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
