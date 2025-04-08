const express = require('express');
const app = express();
const port = process.env.PORT || 5001;
const cors = require('cors');

/** ---------- MIDDLEWARE ---------- **/
app.use(cors());
app.use(express.json());
app.use(express.static('build'));

/** ---------- EXPRESS ROUTES ---------- **/
const applicantsRouter = require('./routes/applicants.router.js');
app.use('/api/applicants', applicantsRouter);

const dependentsRouter = require('./routes/dependents.router.js');
app.use('/api/dependents', dependentsRouter);


/** ---------- START SERVER ---------- **/
app.listen(port, function () {
    console.log('Listening on port: ', port);
});