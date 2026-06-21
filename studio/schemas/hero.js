export default {
  name: "hero",
  title: "Hero Slideshow",
  type: "document",

  fields: [
    {
      name: "title",
      title: "Title / Label",
      type: "string",
      description: "A label for this hero slideshow setup (e.g., 'Homepage Slideshow')",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "images",
      title: "Slideshow Images",
      type: "array",
      of: [
        {
          type: "object",
          name: "slide",
          title: "Slide",
          fields: [
            {
              name: "image",
              title: "Image",
              type: "image",
              options: { hotspot: true },
              validation: (Rule) => Rule.required(),
            },
            {
              name: "caption",
              title: "Caption / Title",
              type: "string",
              description: "Optional caption overlay text",
            },
            {
              name: "subtitle",
              title: "Subtitle",
              type: "string",
              description: "Optional subtitle text",
            },
          ],
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    },
  ],
};
