import Transformation from '../models/transformationModel.mjs';
import Trainer from '../models/trainerModel.mjs';
import Plan from '../models/pricingModel.mjs';

export const getTransformations = async (req, res) => {
  try {
    const data = await Transformation.find({});
    console.log("Transformations:", data);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch transformations" });
  }
};

export const getTrainers = async (req, res) => {
  try {
    const data = await Trainer.find({});
    console.log("Trainers:", data);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch trainers" });
  }
};

export const getPlans = async (req, res) => {
  try {
    const data = await Plan.find({});
    console.log("Plans:", data);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch plans" });
  }
};

import Config from '../models/contentModel.mjs';

export const getSiteConfig = async (req, res) => {
  console.log("CONFIG API HIT");
  const config = await Config.findOne();
  res.json(config || {});
};
