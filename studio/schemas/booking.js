export default {
  name: "booking",
  title: "Booking",
  type: "document",

  fields: [
    {
      name: "name",
      title: "Full Name",
      type: "string",
    },

    {
      name: "email",
      title: "Email Address",
      type: "string",
    },

    {
      name: "phone",
      title: "Phone Number",
      type: "string",
    },

    {
      name: "parentPhone",
      title: "Emergency / Parent Phone Number",
      type: "string",
    },

    {
      name: "address",
      title: "Home Address",
      type: "text",
    },

    {
      name: "tour",
      title: "Upcoming Tour & Event",
      type: "reference",
      to: [{ type: "upcomingTour" }],
    },
  ],
};
