module.exports = {
  sidebar: [
    "about",
    "users-listing-and-details",
    "managing-user-roles-and-permissions",
    {
      type: 'category',
      label: 'Tenant Management',
      collapsed: true,
      items: [
        "tenant-management/overview",
        "tenant-management/details",
        "tenant-management/third-party",
      ]
    }
  ],
}