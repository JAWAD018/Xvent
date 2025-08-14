// import Event from "../models/Event.js";

// export const createEvent = async (req, res) => {
//   try {
//     const event = await Event.create({ ...req.body, createdBy: req.user.id });
//     res.status(201).json(event);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// export const getEvents = async (req, res) => {
//   try {
//     const events = await Event.find().populate("createdBy", "name email");
//     res.json(events);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// export const deleteEvent = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const event = await Event.findById(id);

//     if (!event) return res.status(404).json({ message: "Event not found" });
//     if (event.createdBy.toString() !== req.user.id && req.user.role !== "admin") {
//       return res.status(403).json({ message: "Unauthorized" });
//     }

//     await Event.findByIdAndDelete(id);

//     res.json({ message: "Event deleted" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };


import Event from "../models/Event.js";

// @desc    Create a new event
export const createEvent = async (req, res) => {
  try {
    const event = await Event.create({ ...req.body, createdBy: req.user.id });
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all events
export const getEvents = async (req, res) => {
  try {
    const events = await Event.find().populate("createdBy", "name email");
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get event by ID
export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate("createdBy", "name email");
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update event
export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.createdBy.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete event
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
