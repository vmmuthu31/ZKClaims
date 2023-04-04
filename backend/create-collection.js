const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://admin:admin@cluster0.rxnpu.mongodb.net/zkclaims"
);

const submittedLinkSchema = new mongoose.Schema({
  callback_id: { type: String, required: true },
  claims: { type: String, required: false },
  status: { type: String, required: true },
  email: { type: String, required: true },
  template_id: { type: String, required: false },
  repo: { type: String, required: false },
});

const SubmittedLink = mongoose.model("SubmittedLink", submittedLinkSchema);

SubmittedLink.createCollection()
  .then(() => {
    console.log("SubmittedLink collection created successfully");
    mongoose.connection.close();
  })
  .catch((error) => {
    console.error(`Error creating SubmittedLink collection: ${error}`);
    mongoose.connection.close();
  });
