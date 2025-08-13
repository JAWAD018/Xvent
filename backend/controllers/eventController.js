import Event from "../models/Event.js";

export const createEvent = async (req, res) => {
  try {
    const event = await Event.create({ ...req.body, createdBy: req.user.id });
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getEvents = async (req, res) => {
  try {
    const events = await Event.find().populate("createdBy", "name email");
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id);

    if (!event) return res.status(404).json({ message: "Event not found" });
    if (event.createdBy.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await Event.findByIdAndDelete(id);

    res.json({ message: "Event deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
