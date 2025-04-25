const asyncHandler = require('express-async-handler');
const Contact = require('../models/contactModel');
//@desc Get all contacts
//@route GET /api/contacts
//@access private
const getContacts = asyncHandler(async(req, res) => {
    const contacts = await Contact.find({user_id: req.user.id})
    res.status(200).json(contacts);
});

//@desc Create a contact
//@route POST /api/contacts
//@access private
const createContact = asyncHandler(async(req, res) => {
    // Validate request body
    const { name, email, phone } = req.body;
    if (!name || !email || !phone) {
        res.status(400);
        throw new Error("All fields are mandatory!");
    }
    const contact = await Contact.create({
        name,
        email,
        phone,
        user_id: req.user.id
    });
    res.status(201).json(contact);
});

//@desc Get a contact
//@route GET /api/contacts/:id
//@access private
const getContact = asyncHandler(async(req, res) => {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
        res.status(404);
        throw new Error("Contact not found!");
    }
    // Check if the contact belongs to the logged-in user
    // Assuming req.user.id contains the ID of the logged-in user
    if(contact.user_id.toString() !== req.user.id) {
        res.status(401);
        throw new Error("User not authorized!");
    }
    res.status(200).json(contact);
});

//@desc Update a contact
//@route PUT /api/contacts/:id
//@access private
const updateContact = asyncHandler(async(req, res) => {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
        res.status(404);
        throw new Error("Contact not found!");
    }
    // Check if the contact belongs to the logged-in user
    // Assuming req.user.id contains the ID of the logged-in user
    if(contact.user_id.toString() !== req.user.id) {
        res.status(401);
        throw new Error("User not authorized!");
    }
    const updatedContact = await Contact.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    });
    res.status(200).json(updatedContact);
});

//@desc Delete a contact
//@route DELETE /api/contacts/:id
//@access private
const deleteContact = asyncHandler(async(req, res) => {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
        res.status(404);
        throw new Error("Contact not found!");
    }
    // Check if the contact belongs to the logged-in user
    // Assuming req.user.id contains the ID of the logged-in user
    if(contact.user_id.toString() !== req.user.id) {
        res.status(401);
        throw new Error("User not authorized!");
    }
    // Delete the contact
    await contact.deleteOne({_id: req.params.id});
    res.status(200).json(contact);
});

module.exports = {
  getContacts,
  createContact,
  getContact,
  updateContact,
  deleteContact
};
