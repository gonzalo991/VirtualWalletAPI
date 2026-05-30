import { register, login, logout, refreshSession, logoutAllSessions } from "./auth.service";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiResponse } from "../../utils/apiResponse";
import { HTTP_STATUS } from "../../constants/httpStatus";

export const registerController = asyncHandler(async (req, res) => {
    const response = await register(req.body);
    return res.status(HTTP_STATUS.CREATED).json(
        ApiResponse.success("Registration successful", response,)
    );
});

export const loginController = asyncHandler(async (req, res) => {
    const response = await login(req.body);
    return res.status(HTTP_STATUS.OK).json(
        ApiResponse.success("Login Successful", response)
    );
});

export const refreshTokenController = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;

    const response = await refreshSession(refreshToken);

    res.status(HTTP_STATUS.OK).json(
        ApiResponse.success("Token refreshed", response)
    );
});

export const logoutController = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;

    await logout(refreshToken);

    res.status(HTTP_STATUS.OK).json(
        ApiResponse.success("Logged out")
    )
});

export const logoutAllSessionsController = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;
    const userId = refreshToken.id;

    await logoutAllSessions(userId);

    res.status(HTTP_STATUS.OK).json(
        ApiResponse.success("All sessions logged out")
    );
});