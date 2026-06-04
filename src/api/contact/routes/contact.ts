// src/api/contact/routes/contact.js
module.exports = {
  routes: [
    {
      method: "POST",
      path: "/contact",
      handler: "contact.send",
      config: { auth: false },
    },
  ],
};
