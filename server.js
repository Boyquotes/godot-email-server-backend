const express = require("express");
const cors = require("cors");
var bodyParser = require("body-parser");
const dotenv = require("dotenv");
const mailer = require("nodemailer");
const app = express();
dotenv.config({ path: `./config.env` });

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:5173", "*"],
    methods: ["GET", "POST"],
    credentials: true
}))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3001;

app.use('/sendit', (req, res) => {
    const { subject, body, data, link } = req.body;

    const sender = (elem) => {
        const emailTemplate = `<div style="background-color:#170f1e;color:#fff;padding:1.5rem;border-radius:10px">
        <img style="width:40%;height:4rem" src="cid:img" alt="" data-image-whitelisted="" class="CToWUd" data-bit="iit"> 
        <h2 style="font-family:Gill Sans;font-weight:500">Dear ${elem.name},</h2>
        <h3 style="font-family:Gill Sans;font-weight:400">${body}</h3>
        <br/>
        <h4 style="font-family:Gill Sans;font-weight:400; line-height: 1.5rem;">Regards<br/>Team GoDot<br/>Thank You</h4>
        </div>`;

        const emailTemplateWithLink = `<div style="background-color:#170f1e;color:#fff;padding:1.5rem;border-radius:10px">
        <img style="width:40%;height:4rem" src="cid:img" alt="" data-image-whitelisted="" class="CToWUd" data-bit="iit"> 
        <h2 style="font-family:Gill Sans;font-weight:500">Dear ${elem.name},</h2>
        <h3 style="font-family:Gill Sans;font-weight:400">${body}</h3>
        <br>
        <h3 style="font-family:Gill Sans;font-weight:400">Can’t wait to see you there! </h3>
        <a href="https://www.google.com/" style="background: linear-gradient(to right, #CFA911 0%, #CF1512 100%);border-radius:4px;color:#fff;display:flex;font-family:Gill Sans;font-weight:700;outline:none;padding:1rem 2rem;white-space:nowrap;text-decoration:none;width:8rem" target="_blank">Register Now</a>  
        <br/>
        <h4 style="font-family:Gill Sans;font-weight:400; line-height: 1.5rem;">Regards<br/>Team GoDot<br/>Thank You</h4>
        </div>`;

        const transporter = mailer.createTransport({
            service: "gmail",

            auth: {
                user: process.env.user,
                pass: process.env.pass
            }
        });

        const mailOption = {
            from: process.env.user,
            to: elem.email,
            subject: subject,
            html: link == "" ? emailTemplate : emailTemplateWithLink,
            text: link == "" ? emailTemplate : emailTemplateWithLink,
            attachments: [{
                filename: 'img.png',
                path: __dirname + '/assets/logo.png',
                cid: 'img'
            }]
        }

        transporter.sendMail(mailOption, async (error, info) => {
            return error ? (res.json({ message: "Error happen while send emails to the user!!! 🔴" })) : console.log(info)
        })
    }


    var varCounter = 0;
    var varName = () => {
        if (varCounter <= data.length - 1) {
            sender(data[varCounter]);
            varCounter++;
        } else {
            clearInterval(intervalId);
            return res.json({ message: "Email send to the user!!! 🟢" })
        }
    };

    var intervalId = setInterval(varName, 1500);
});

app.get('/', (req, res) => { res.json({ message: "You've come to the right place... it's a GET request!!" }) });

app.listen(PORT, () => { console.log("Server is running...."); })
