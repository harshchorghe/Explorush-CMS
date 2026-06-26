export default {
  name: "websiteTourSettings",
  title: "Website Tour Settings",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "videoUrl",
      title: "Video URL (Google Drive Share Link)",
      type: "url",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "thumbnail",
      title: "Thumbnail Image",
      type: "image",
      options: { hotspot: true },
    },
    {
      name: "description",
      title: "Description",
      type: "text",
    },
    {
      name: "buttonText",
      title: "Button Text",
      type: "string",
      initialValue: "Watch Website Tour",
    },
    {
      name: "enableTour",
      title: "Enable Website Tour",
      type: "boolean",
      initialValue: true,
    },
    {
      name: "showOnlyOnMobile",
      title: "Show Only on Mobile",
      type: "boolean",
      initialValue: false,
    },
    {
      name: "autoShowOnFirstVisit",
      title: "Auto Show on First Visit",
      type: "boolean",
      initialValue: true,
    },
    {
      name: "showOnlyOnce",
      title: "Show Only Once",
      type: "boolean",
      initialValue: true,
    },
  ],
};
