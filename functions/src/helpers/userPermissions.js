const userPermissions = (role) => {
  let privileges = {};
  const roles = ['super admin', 'admin', 'contributor'];
  if (!roles.includes(role)) {
    return false;
  }
  switch (role) {
    case 'super admin':
      return (privileges = {
        articles: {
          create: true,
          read: true,
          update: true,
          delete: true,
        },
        categories: {
          create: true,
          read: true,
          update: true,
          delete: true,
        },
        admin: {
          create: true,
          read: true,
          update: true,
          delete: true,
        },
        contributors: {
          create: true,
          read: true,
          update: true,
          delete: true,
        },
        applications: {
          create: false,
          read: true,
          update: true,
          delete: true,
        },
      });
    case 'admin':
      return (privileges = {
        articles: {
          create: true,
          read: true,
          update: true,
          delete: true,
        },
        categories: {
          create: true,
          read: true,
          update: true,
          delete: true,
        },
        admin: {
          create: false,
          read: true,
          update: false,
          delete: false,
        },
        contributors: {
          create: true,
          read: true,
          update: true,
          delete: true,
        },
        applications: {
          create: false,
          read: true,
          update: true,
          delete: true,
        },
      });
    case 'contributor':
      return (privileges = {
        articles: {
          create: true,
          read: true,
          update: true,
          delete: true,
        },
        categories: {
          create: false,
          read: true,
          update: false,
          delete: false,
        },
        admin: {
          create: false,
          read: false,
          update: false,
          delete: false,
        },
        contributors: {
          create: false,
          read: false,
          update: false,
          delete: false,
        },
        applications: {
          create: false,
          read: false,
          update: false,
          delete: false,
        },
      });
    default:
      return privileges;
  }
};

module.exports = userPermissions;
