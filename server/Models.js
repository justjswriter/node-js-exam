const mongoose = require("mongoose");
const { ProjectPostSchema, ProjectUserSchema } = require("./Schemas");

const ProjectUserModel = mongoose.model("ProjectUser", ProjectUserSchema);
const ProjectPostModel = mongoose.model("ProjectPost", ProjectPostSchema);

module.exports = {
    ProjectUserModel,
    ProjectPostModel,
};