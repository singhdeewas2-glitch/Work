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
  try {
    const config = await Config.findOne();
    res.json(config || {});
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch config' });
  }
};

export const resolveMapUrl = async (req, res) => {
  const { url } = req.query;
  if (!url) return res.json({ url: '' });

  try {
    // We fetch the URL. If it's a maps.app.goo.gl link, default node fetch follows up to 20 redirects natively!
    const fetchMod = (await import('node-fetch')).default || global.fetch;
    const response = await fetchMod(url, { redirect: 'follow' });
    
    // We send back the heavily expanded final Google Maps desktop/mobile URL
    res.json({ url: response.url });
  } catch (error) {
    // If blocked or failed, fallback to original.
    res.json({ url: url });
  }
};
