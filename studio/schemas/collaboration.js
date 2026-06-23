export default {
  name: "collaboration",
  title: "Collaboration Request",
  type: "document",
  fields: [
    {
      name: "name",
      title: "Full Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "company",
      title: "Company/Brand Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "email",
      title: "Email Address",
      type: "string",
      validation: (Rule) => Rule.required().email(),
    },
    {
      name: "phone",
      title: "Phone Number",
      type: "string",
    },
    {
      name: "collabType",
      title: "Collaboration Type",
      type: "string",
      options: {
        list: [
          { title: "Brand Sponsorship", value: "brand_sponsorship" },
          { title: "Destination Marketing", value: "destination_marketing" },
          { title: "Hotel/Resort Review", value: "hotel_resort_review" },
          { title: "Content Creation", value: "content_creation" },
          { title: "Group Trip Partnership", value: "group_trip_partnership" },
          { title: "Other", value: "other" },
        ],
      },
    },
    {
      name: "budget",
      title: "Budget Range",
      type: "string",
      options: {
        list: [
          { title: "Under ₹1,000", value: "under_1k" },
          { title: "₹1,000 - ₹5,000", value: "1k_5k" },
          { title: "₹5,000 - ₹10,000", value: "5k_10k" },
          { title: "₹10,000+", value: "10k_plus" },
          { title: "Flexible / Contact Us", value: "flexible" },
        ],
      },
    },
    {
      name: "details",
      title: "Campaign Details",
      type: "text",
    },
    {
      name: "links",
      title: "Website/Social Media Links",
      type: "text",
    },
    {
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "New", value: "new" },
          { title: "Contacted", value: "contacted" },
          { title: "In Discussion", value: "in_discussion" },
          { title: "Confirmed", value: "confirmed" },
          { title: "Rejected", value: "rejected" },
        ],
      },
      initialValue: "new",
    },
  ],
};
