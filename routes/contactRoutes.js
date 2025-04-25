const express = require('express');
const router = express.Router();
const {
     getContacts, 
     createContact,
     getContact, 
     updateContact, 
     deleteContact 
    } = require('../controllers/contactController');

const validateToken = require('../middleware/validateTokenHandler');

router.use(validateToken); // Apply the validateToken middleware to all routes
// Define the routes for the contact API
router.route('/').get(getContacts).post(createContact);
router.route('/:id').get(getContact).put(updateContact).delete(deleteContact);

// Export the router to be used in the main server file
module.exports = router;

