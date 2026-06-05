export default {
  name: "vlog",
  title: "Vlog",
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
      options: {
        source: "title",
        maxLength: 96,
      },
    },

    {
      name: "videoUrl",
      title: "YouTube Video URL",
      type: "url",
    },

    {
      name: "thumbnail",
      title: "Thumbnail",
      type: "image",
      options: { hotspot: true },
    },
  ],
};