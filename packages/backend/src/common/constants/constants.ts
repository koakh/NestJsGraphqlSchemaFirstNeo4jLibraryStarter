type Constants = {
  graphTypes: { [key: string]: string; };
}

// neo4j models
export const constants: Constants = {
  graphTypes: {
    ORDER: 'Order',
    CUSTOMER: 'Customer',
    ADDRESS: 'Address',
    BOOK: 'Book',
    REVIEW: 'Review',
    AUTHOR: 'Author',
    SUBJECT: 'Subject',
    WEATHER: 'Weather',
    USER: 'User',
  },
}
