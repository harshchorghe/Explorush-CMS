export default {
  name: "upcomingTour",
  title: "Upcoming Tour & Event",
  type: "document",

  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
    },

    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
    },

    {
      name: "location",
      title: "Location",
      type: "string",
    },

    {
      name: "type",
      title: "Type",
      type: "string",
      options: {
        list: [
          { title: "Trek", value: "trek" },
          { title: "Expedition", value: "expedition" },
          { title: "Workshop", value: "workshop" },
          { title: "City Exploration", value: "city" },
          { title: "Road Trip", value: "road" },
          { title: "International", value: "international" },
        ],
      },
    },

    {
      name: "price",
      title: "Price per Person",
      type: "string",
      description: "e.g. $2,499 or $1,200",
    },

    {
      name: "totalSlots",
      title: "Total Slots Available",
      type: "number",
    },

    {
      name: "bookedSlots",
      title: "Booked Slots",
      type: "number",
    },

    {
      name: "description",
      title: "Description",
      type: "text",
    },

    {
      name: "coverImage",
      title: "Cover Image",
      type: "image",
      options: { hotspot: true },
    },

    {
      name: "gallery",
      title: "Gallery",
      type: "array",
      of: [{ type: "image" }],
    },

    {
      name: "startDate",
      title: "Start Date",
      type: "datetime",
    },

    {
      name: "endDate",
      title: "End Date",
      type: "datetime",
    },

    {
      name: "itinerary",
      title: "Itinerary",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "day", type: "string", title: "Day" },
            { name: "plan", type: "text", title: "Plan" },
          ],
        },
      ],
    },

    {
      name: "guidelines",
      title: "Guidelines & Rules",
      type: "array",
      of: [{ type: "string" }],
    },

    {
      name: "included",
      title: "What's Included",
      type: "array",
      of: [{ type: "string" }],
    },

    {
      name: "excluded",
      title: "What's Excluded",
      type: "array",
      of: [{ type: "string" }],
    },

    {
      name: "author",
      title: "Guide / Author",
      type: "reference",
      to: [{ type: "author" }],
    },
  ],
};
