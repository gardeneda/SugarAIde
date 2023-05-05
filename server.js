// All things to do with servers are put here.

const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

const app = require('./src/middleware/app');

const port = process.env.PORT || 5050;
app.listen(port, () => {
    console.log(`Listening to port ${port}`);
})

