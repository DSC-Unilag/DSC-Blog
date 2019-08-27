const permissions = (req, res, next, permission, action) => {
  const { payload } = req;
  if (!payload.claims
    || !payload.claims[permission]
    || !payload.claims[permission][action]
  ) {
    return res.status(403).send({
      success: false,
      message: 'You do not have permission to perform this action'
    });
  }
  return next();
}

module.exports = permissions;
