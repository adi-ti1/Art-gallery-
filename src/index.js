const express = require("express");
const path = require("path");
const app = express();
const LogInCollection = require("./mongo");

const port = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const tempelatePath = path.join(__dirname, '../tempelates');
const publicPath = path.join(__dirname, '../public');

app.set('view engine', 'hbs');
app.set('views', tempelatePath);
app.use(express.static(publicPath));

app.get('/signup', (req, res) => {
    res.render('signup');
});

app.get('/', (req, res) => {
    res.render('login');
});

app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/Painting', (req, res) => {
    res.render('Painting');
});

app.get('/home', (req, res) => {
    res.render('home');
});

app.get('/contact', (req, res) => {
    res.render('contact');
});
app.get('/Photography', (req, res) => {
    res.render('Photography');
});
app.get('/Sculpture', (req, res) => {
    res.render('Sculpture');
});
app.get('/next', (req, res) => {
    res.render('next');
});

app.get('/NewMedia', (req, res) => {
    res.render('NewMedia');
});

app.post('/signup', async(req, res) => {
    try {
        const data = {
            email: req.body.email,
            password: req.body.password
        };

        const emailRegex = /.+@gmail\.com$/;
        if (!emailRegex.test(req.body.email)) {
            return res.status(400).send("Invalid email format. Please enter a valid Gmail address.");
        }

        if (req.body.password.length < 8) {
            return res.status(400).send("Password must be at least 8 characters long.");
        }

        const checking = await LogInCollection.findOne({ email: req.body.email });

        if (checking && checking.email === req.body.email && checking.password === req.body.password) {
            res.send("User details already exist");
        } else {
            await LogInCollection.insertMany([data]);
            res.status(201).render("home", { naming: req.body.email });
        }
    } catch (error) {
        res.status(500).send("Error occurred: " + error.message);
    }
});

app.post('/login', async(req, res) => {
    try {
        const check = await LogInCollection.findOne({ email: req.body.email });

        if (check && check.password === req.body.password) {
            res.status(201).render("home", { naming: `${req.body.password}+${req.body.email}` });
        } else {
            res.send("Incorrect password or email");
        }
    } catch (error) {
        res.status(500).send("Error occurred: " + error.message);
    }
});

app.listen(3000, () => {
    console.log('port connected');
});