const {OAuth2Client} = require('google-auth-library');

const client = new OAuth2Client(
    process.env.GOOGLE_ID_CLIENT,
    process.env.GOOGLE_SECRET_KEY,
);

async function googleVerify( authCode = '' ) {
    try {

        const { tokens } = await client.getToken({
            code: authCode,
            client_id:process.env.GOOGLE_ID_CLIENT,
            client_secret:process.env.GOOGLE_SECRET_KEY,
            redirect_uri:'postmessage' 
        });
        const { id_token } = tokens;
        const ticket = await client.verifyIdToken({
            idToken: id_token,
            audience: process.env.GOOGLE_ID_CLIENT
        })

        const { email, name } = ticket.getPayload();
        return {
            email,
            name
        }
    } catch (error) {
        console.error('Error during token exchange:', error.response ? error.response.data : error.message);
        throw(error);
    }
}

module.exports = {
    googleVerify
}