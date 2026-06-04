module.exports = {
  async send(ctx) {
    const { to, subject, html } = ctx.request.body;

    console.log("Email details:", { to, subject, html });

    try {
      await strapi.plugin("email").service("email").send({
        to,
        subject,
        html,
        // 'from' and 'replyTo' are automatically pulled from your plugin config
      });
      ctx.send({ message: "Email sent successfully" });
    } catch (err) {
      ctx.badRequest("Failed to send email", { error: err.message });
    }
  },
};
