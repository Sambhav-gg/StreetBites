// src/middleware/role.middleware.js
export const onlyVendor = (req, res, next) => {
    if (req.user.role !== "vendor") {
      return res.status(403).json({ message: "Access denied: Vendors only" });
    }
    next();
  };
  