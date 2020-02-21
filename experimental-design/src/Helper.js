// use this for config also. decide if I'd better move to something else later

const SearchingPageMessages = () => [
    'Calculating midpoint ...',
    'Assessing midpoint postcode ...',
    'Shortlisting places ...',
    'Generating links for WhatsApp, CityMapper, Google Maps ...'
  ]

const decideOnTheItemsToPresent = (allItems) => {
    let maxNumberOfResults = 3
    let targetGroup = allItems.sort((a,b)=>a.user_ratings_total>b.user_ratings_total ?-1:1).sort((a,b)=>a.rating>b.rating ?-1:1)
    if (targetGroup.length >= maxNumberOfResults) {
        return (targetGroup.slice(0,maxNumberOfResults))
    } else {return targetGroup}
}

export default { SearchingPageMessages,decideOnTheItemsToPresent }