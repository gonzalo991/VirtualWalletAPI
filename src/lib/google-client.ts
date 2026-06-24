import { OAuth2Client } from "google-auth-library"
import { env } from "../config/env"

export const googleClient = new OAuth2Client(env.OAUTH_CLIENT_ID);