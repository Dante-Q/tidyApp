/**
 * Admin middleware to protect admin-only routes
 */
export const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  if (!req.user.isAdmin) {
    return res.status(403).json({
      success: false,
      message: "Admin access required",
    });
  }

  next();
};
