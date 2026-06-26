export const tripsQuery = `
*[_type == "trip"] | order(startDate desc){
  _id,
  title,
  slug,
  location,
  type,
  budget,
  description,
  coverImage{
    asset->{
      _id,
      url
    }
  },
  startDate,
  endDate
}
`;

export const blogsQuery = `
*[_type == "blog"] | order(_createdAt desc){
  _id,
  title,
  slug,
  content,
  _createdAt,
  coverImage{
    asset->{
      _id,
      url
    }
  },
  category->{
    title
  }
}
`;

export const vlogsQuery = `
*[_type == "vlog"] | order(_createdAt desc){
  _id,
  title,
  slug,
  videoUrl,
  thumbnail{
    asset->{
      _id,
      url
    }
  }
}
`;

export const websiteTourQuery = `
*[_type == "websiteTourSettings"][0]{
  _id,
  title,
  videoUrl,
  thumbnail{
    asset->{
      _id,
      url
    }
  },
  description,
  buttonText,
  enableTour,
  showOnlyOnMobile,
  autoShowOnFirstVisit,
  showOnlyOnce
}
`;