import express from "express";
const router = express.Router();
import { registerUser } from "../controllers/userController.js"; // Assuming you have a registerUser controller
// import { jwt } from "../config/jwt.js"; // Import the jwt object if you were using it

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
router.post("/register", registerUser); // Removed verifyToken here

// ... other routes, potentially with authentication ...

export default router;
      // ... response data ...
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// ... other routes, potentially with authentication ...

module.exports = router;
