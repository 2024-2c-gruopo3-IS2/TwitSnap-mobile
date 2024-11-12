import * as functions from 'firebase-functions';

function generateUserEmailID(email) {
    return `${email.replace(/[\.\#\$\/\[\]]/g, '_')}`;
}

export default generateUserEmailID;