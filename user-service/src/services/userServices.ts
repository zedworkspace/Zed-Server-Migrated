import User from "../models/userModel";

export const getBulkUsers = async (userIds: string[]) => {
  const users = await User.find({ _id: { $in: userIds } })
  return users;
};
