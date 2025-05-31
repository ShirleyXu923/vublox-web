const formConfig = {
  organization: {
    fields: {
      name: {
        max: 50,
      },
      bio: {
        max: 200,
      },
      tags: {
        max: 5,
      },
      contact_website: {
        max: 50,
      },
      contact_email: {
        max: 200,
      },
      contact_url: {
        max: 100,
      },
    },
  },
  timeline: {
    fields: {
      description: {
        max: 1000,
        maxLabel: '1,000',
      },
    },
  },
};

export default formConfig;
