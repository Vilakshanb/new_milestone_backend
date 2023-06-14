export const onBoardingBasicClientInfo = () => {
  let pipeline = [],
    matchCondition = {},
    sortCondition = {};

  sortCondition = { createdAt: -1 };

  pipeline.push(
    { $match: matchCondition },
    {
      $project: {
        _id: 1,
        firstName: 1,
        middleName: 1,
        lastName: 1,
        gender: 1,
        mobileNumber: 1,
        DOB: 1,
        email: 1,
        panNumber: 1,
      },
    },
    { $sort: sortCondition }
  );

  return pipeline;
};
