export default {
  name: "trip",
  title: "Trip",
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
      title: "Trip Type",
      type: "string",
      options: {
        list: [
          { title: "Trek", value: "trek" },
          { title: "City", value: "city" },
          { title: "Road Trip", value: "road" },
          { title: "International", value: "international" },
        ],
      },
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
  ],
};