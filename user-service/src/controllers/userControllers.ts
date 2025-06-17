import catchAsync from "../utils/catchAsync";
import * as userService from "../services/userServices";

export const getBulkUsers = catchAsync(async (req, res) => {
    const body = req.body
    const users = await userService.getBulkUsers(body);
    res.status(201).json({
        status: "success",
        message: "user fetched successfully based on the channel",
        data: users,
    });
});
