const applicationRepo = require("../repositories/application.repositories");
const weightRepo = require("../repositories/weight.repositories");
const SAWRepo = require("../repositories/SAW.repositories");
const { v4: uuidv4 } = require("uuid");

exports.sendMail_Results = async (payload) => {
  await SAWRepo.sendMail_Results(payload);

  return true;
};
