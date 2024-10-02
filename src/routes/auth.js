const fastify = require('fastify');
const crypto = require('crypto');
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

const User = require('../database/mongodb/Models/user/user.js');
const UserV2 = require('../database/mongodb/Models/user/userv2.js');
const UserV3 = require('../database/mongodb/Models/user/userv3.js');
const Token = require('../database/mongodb/Models/token.js');
const functions = require("../utils/functions.js");
const { error } = require('console');
const account = require('./account.js');
const { response } = require('../api/v1/index.js');

let current_email;
let current_username;
let current_accountId;
let clientId;

module.exports = async function (fastify, options) {
    fastify.post('/account/api/oauth/token', async (request, reply) => {
        const { grant_type, username, password, token_type } = request.body || {};

        try {
            clientId = functions.DecodeBase64(request.headers["authorization"].split(" ")[1]).split(":");
        
            if (!clientId[1]) {
                throw new Error("invalid client id");
            }
        
            clientId = clientId[0];
        } catch {
            return reply.code(400).send({
                errorCode: "errors.com.epicgames.common.oauth.invalid_client",
                errorMessage: "It appears that your Authorization header may be invalid or not present, please verify that you are sending the correct headers.",
                messageVars: [],
                numericErrorCode: 1011,
                originatingService: "invalid_client"
            });
        }
    
        if (grant_type == "password") {
            let user = await UserV3.findOne({ Email: username });
            if (!user) {
                user = await UserV2.findOne({ Email: username });
                if (!user) {
                    user = await User.findOne({ email: username });
                    if (!user) {
                        return reply.code(404).send({
                            error: "arcane.errors.user.not_found",
                            error_description: "User not found in the database"
                        });
                    }
                }
            }
    
            let userpassword = user.Password || user.password;
            if (!userpassword) {
                return reply.code(404).send({
                    error: "arcane.errors.password.not_found",
                });
            }
    
            const verifypass = await bcrypt.compare(password, userpassword);
            if (!verifypass) {
                return reply.code(400).send({
                    error: "arcane.errors.invalid_password",
                    error_description: "The password provided is incorrect"
                });
            }

            current_accountId = user.Account || user.accountId;
            if (!current_accountId) {
                console.error("AccountID Is Not Found In The User Model");
                return reply.code(404).send({
                    error: 'arcane.errors.accountid.not_found',
                    error_description: 'AccountID not found in the user model'
                });
            }

            let current_token = await Token.findOne({ accountId: current_accountId });
            if (!current_token || new Date() > current_token.expiresAt) {
                const newAccessToken = crypto.randomBytes(32).toString('hex');
                const newRefreshToken = crypto.randomBytes(32).toString('hex');
    
                if (current_token) {
                    current_token.token = newAccessToken;
                    current_token.expiresAt = new Date(Date.now() + 28800 * 1000);
                    current_token.refreshToken = newRefreshToken;
                    current_token.refreshExpiresAt = new Date(Date.now() + 86400 * 1000);
                } else {
                    current_token = new Token({
                        token: newAccessToken,
                        accountId: current_accountId,
                        expiresAt: new Date(Date.now() + 28800 * 1000),
                        refreshToken: newRefreshToken,
                        refreshExpiresAt: new Date(Date.now() + 86400 * 1000)
                    });
                }
    
                await current_token.save();
            }
    
            return reply.code(200).send({
                access_token: current_token.token, 
                expires_in: Math.round((new Date(current_token.expiresAt).getTime() - Date.now()) / 1000), 
                expires_at: current_token.expiresAt.toISOString(), 
                token_type: 'bearer',
                refresh_token: current_token.refreshToken, 
                refresh_expires_in: Math.round((new Date(current_token.refreshExpiresAt).getTime() - Date.now()) / 1000), 
                refresh_expires_at: current_token.refreshExpiresAt.toISOString(),
                account_id: current_accountId, 
                client_id: clientId, 
                internal_client: true,
                client_service: 'fortnite',
                displayName: user.Username || user.username, 
                app: 'fortnite',
                in_app_id: current_accountId, 
                device_id: "mocked_device_id_123", 
                session_id: "mocked_session_id_12345", 
                issued_at: new Date().toISOString(), 
                scopes: ["basic_profile", "friends_read", "email"], 
                permissions: {
                    is_admin: false, 
                    can_chat: true 
                },
                ip_address: "192.168.1.1", 
                geo_location: {
                    country: "US", 
                    region: "California" 
                },
                platform: {
                    type: "PC", 
                    version: "10.0.1", 
                    device: "Windows" 
                },
                subscription_status: "active", 
                two_factor_enabled: true, 
                achievements: ["achievement_1", "achievement_2"], 
                inventory: {
                    vbucks: 1000, 
                    skins: ["skin_1", "skin_2"], 
                    emotes: ["emote_1", "emote_2"] 
                }
            });
        }
    });

    fastify.post('/account/api/oauth/verify', async (request, reply) => {
        let current_token = await Token.findOne({ accountId: current_accountId });
        if (!current_token || new Date() > current_token.expiresAt) {
            return response.status(404).send({
                error: "arcane.errors.invalid_token",
                error_description: 'token not found or expired'
            })
        }

        let user = await UserV3.findOne({ Account: current_accountId });
        if (!user) {
            user = await UserV2.findOne({ Account: current_accountId });
            if (!user) {
                user = await User.findOne({ accountId: current_accountId });
                if (!user) {
                    return reply.code(404).send({
                        error: "arcane.errors.user.not_found",
                        error_description: "User not found in the database"
                    });
                }
            }
        }
        
        return reply.code(200).send({
            access_token: current_token.token, 
            expires_in: Math.round((new Date(current_token.expiresAt).getTime() - Date.now()) / 1000), 
            expires_at: current_token.expiresAt.toISOString(), 
            token_type: 'bearer',
            refresh_token: current_token.refreshToken, 
            refresh_expires_in: Math.round((new Date(current_token.refreshExpiresAt).getTime() - Date.now()) / 1000),
            refresh_expires_at: current_token.refreshExpiresAt.toISOString(),
            account_id: current_accountId, 
            client_id: clientId, 
            internal_client: true,
            client_service: 'fortnite',
            displayName: user.Username || user.username, 
            app: 'fortnite',
            in_app_id: current_accountId, 
            device_id: "mocked_device_id_123", 
            session_id: "mocked_session_id_12345", 
            issued_at: new Date().toISOString(), 
            scopes: ["basic_profile", "friends_read", "email"], 
            permissions: {
                is_admin: false, 
                can_chat: true 
            },
            ip_address: "192.168.1.1", 
            geo_location: {
                country: "US", 
                region: "California" 
            },
            platform: {
                type: "PC", 
                version: "10.0.1", 
                device: "Windows" 
            },
            subscription_status: "active", 
            two_factor_enabled: true, 
            achievements: ["achievement_1", "achievement_2"], 
            inventory: {
                vbucks: 1000, 
                skins: ["skin_1", "skin_2"], 
                emotes: ["emote_1", "emote_2"] 
            }
        });
    });
    
    fastify.post('/fortnite/api/game/v2/profileToken/verify/:accountId', async (request, reply) => {
        const { accountId } = request.params;
        const token = request.body.token;

        const tokenEntry = await Token.findOne({ token: token });
    
        if (!tokenEntry || new Date() > tokenEntry.expiresAt) {
            console.error("Token is either invalid or expired");
            return reply.code(401).send({
                error: 'arcane.errors.invalid_token',
                error_description: 'Token is either invalid or expired'
            });
        }
        
        return reply.code(200).send({
            "valid": true,
            "token": tokenEntry.token,
            "accountId": accountId
        })
    })

    fastify.get('/account/api/public/account/:accountId?', async (request, reply) => {
        const accountId = request.params.accountId || request.query.accountId;
    
        if (!accountId) {
            return reply.code(400).send({
                error: 'arcane.errors.missing_account_id',
                error_description: 'Account ID is required'
            });
        }
    
        let user = await UserV2.findOne({ Account: accountId }) || await User.findOne({ accountId: accountId });
    
        if (!user) {
            return reply.code(404).send({
                error: 'arcane.errors.user_not_found',
                error_description: 'User not found in the database'
            });
        }
    
        return reply.code(200).send({
            id: accountId,
            displayName: user.Username || user.username,
            email: user.Email || user.email,
            externalAuths: {}
        });
    }); 

    fastify.get('/account/api/public/account/:accountId/externalAuths', async (request, reply) => {
        const { accountId } = request.params;

        return reply.code(200).send({
            accountId: accountId,
            externalAuths: []
        });
    }); 

    fastify.post('/account/api/oauth/recover', async (request, reply) => {
        const { email } = request.body || {};

        if (!email) {
            return reply.code(400).send({
                error: 'arcane.errors.missing_email',
                error_description: 'Email address is required to recover the account.'
            });
        }
        return reply.code(200).send({
            message: `A password recovery email has been sent to ${email}`,
            status: 'success',
        });
    });

    fastify.post('/account/api/oauth/social_login', async (request, reply) => {
        const { provider, token } = request.body || {};

        if (!provider || !token) {
            return reply.code(400).send({
                error: 'arcane.errors.missing_credentials',
                error_description: 'Provider and token are required for social login.'
            });
        }

        return reply.code(200).send([]);
    });

  fastify.delete('/account/api/oauth/sessions/kill', async (request, reply) => {
        return reply.code(200).send({ message: 'Sessions killed' });
    });

  fastify.delete('/account/api/oauth/sessions/kill/:token', async (request, reply) => {
        const { token } = request.params;

        try {
            const deletedToken = await Token.findOneAndDelete({ token: token });

            if (!deletedToken) {
                return reply.code(404).send({
                    error: 'arcane.errors.token_not_found',
                    error_description: 'Token not found'
                });
            }

            console.log(`Session killed for token: ${token}`);
            return reply.code(200).send({ message: 'Session killed' });

        } catch (error) {
            console.error('Error killing session:', error);
            return reply.code(500).send({
                error: 'arcane.errors.server_error',
                error_description: 'An internal server error occurred'
            });
        }
    }); 
};