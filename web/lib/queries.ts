export const tripsQuery = `
*[_type == "trip"] | order(startDate desc){
  _id,
  title,
  slug,
  location,
  type,
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