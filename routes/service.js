const express = require("express");
const router = express.Router();
const Service = require("../models/Service");

// GET ALL SERVICES
router.get("/", async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ADD NEW SERVICE
router.post("/", async (req, res) => {
  try {
    const { title, description, price, image } = req.body;

    if (!title || !description || !price || !image) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const service = new Service({
      title,
      description,
      price,
      image,
    });

    const savedService = await service.save();

    res.status(201).json({
      message: "Service added successfully",
      service: savedService,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// SEED DATA
router.get("/seed", async (req, res) => {
  try {
    const count = await Service.countDocuments();

    if (count > 0) {
      return res.json({ message: "Services already exist" });
    }

    const services = await Service.insertMany([
      {
        title: "Plumbing",
        description: "Leakage fixing, pipe repair and bathroom plumbing.",
        price: 500,
        image: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=800&q=80",
      },
      {
        title: "Electrical Work",
        description: "Fan, light, switch and wiring repair.",
        price: 600,
        image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=800&q=80",
      },
      {
        title: "House Cleaning",
        description: "Full home cleaning service.",
        price: 1000,
        image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80",
      },
      {
        title: "AC Repair",
        description: "AC servicing and cooling repair.",
        price: 1200,
        image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80",
      },
      {
        title: "Carpentry",
        description: "Furniture repair, door fixing and wood work.",
        price: 800,
        image: "https://images.unsplash.com/photo-1601058268499-e52658b8bb88?auto=format&fit=crop&w=800&q=80",
      },
      {
        title: "Painting",
        description: "Wall painting and room color service.",
        price: 2500,
        image: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=800&q=80",
      },
      {
        title: "Appliance Repair",
        description: "Fridge, washing machine and oven repair.",
        price: 900,
        image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
      },
      {
        title: "Pest Control",
        description: "Cockroach, mosquito and pest removal.",
        price: 1500,
        image: "https://images.unsplash.com/photo-1580752300968-2d0816c905f9?auto=format&fit=crop&w=800&q=80",
      },
      {
        title: "Gardening",
        description: "Garden cleaning and plant maintenance.",
        price: 700,
        image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=800&q=80",
      },
      {
        title: "Water Purifier Service",
        description: "RO filter change and purifier repair.",
        price: 650,
        image: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&w=800&q=80",
      },
    ]);

    res.json({
      message: "Sample services added successfully",
      services,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;