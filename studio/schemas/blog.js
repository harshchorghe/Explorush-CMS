export default {
  name: "blog",
  title: "Blog",
  type: "document",

  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    },

    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    },

    {
      name: "coverImage",
      title: "Cover Image",
      type: "image",
      options: {
        hotspot: true,
      },
    },

    {
      name: "content",
      title: "Content",
      type: "text",
      validation: (Rule) => Rule.required(),
    },

    {
      name: "author",
      title: "Author",
      type: "reference",
      to: [{ type: "author" }],
    },

    {
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
    },
  ],
};