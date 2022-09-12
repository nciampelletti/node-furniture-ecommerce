const agg = [
  {
    $match: {
      product: new ObjectId("631ecdbb6cd608fb72d0b30b"),
    },
  },
  {
    $group: {
      _id: "$product",
      averageRating: {
        $avg: "$rating",
      },
      numOfReviews: {
        $sum: 1,
      },
    },
  },
  {},
]
