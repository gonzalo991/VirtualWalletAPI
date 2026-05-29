import { register, login } from "./auth.service";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiResponse } from "../../utils/apiResponse";

export const registerController = asyncHandler(async (req, res) => {
    const response = await register(req.body);
    return res.status(201).json(
        ApiResponse.success("Registration successful", response,)
    );
});

export const loginController = asyncHandler(async (req, res) => {
    const response = await login(req.body);
    return res.status(200).json(
        ApiResponse.success("Login Successful", response)
    );
});