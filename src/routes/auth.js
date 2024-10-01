const fastify = require('fastify');
const crypto = require('crypto');
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

const User = require('../database/mongodb/Models/user/user.js');
const UserV2 = require('../database/mongodb/Models/user/userv2.js');
const Token = require('../database/mongodb/Models/token.js');
const functions = require("../utils/functions.js");
const { error } = require('console');
const account = require('./account.js');

let current_email;
let current_username;
let current_accountId;

module.exports = async function (fastify, options) {
  fastify.post('/account/api/oauth/token', async (request, reply) => {
    let clientId;
    
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
    
    if (grant_type == 'password') {
        if (!username || !password) {
            console.error("Missing Credentials On Login");
            return reply.code(400).send({
                error: 'arcane.errors.missing.credentials',
                error_description: 'Username and password are required'
            });
        }
    
        let user = await UserV2.findOne({ Email: username }) || await User.findOne({ email: username });
        if (!user) {
            console.error("User Not Found In DB");
            return reply.code(404).send({
                error: 'arcane.errors.user.not_found',
                error_description: 'User not found in mongodb'
            });
        } else {
            const validPassword = await bcrypt.compare(password, user.Password || user.password);
            if (!validPassword) {
                console.error("An Invalid Password Was Sent");
                return reply.code(400).send({
                    error: 'arcane.errors.invalid_password',
                    error_description: 'An invalid password was sent'
                });
            }
            
            current_email = username;
            current_username = user.Username || user.username;
            if (!current_username) {
                console.error("Username Not Found In The User Model");
                return reply.code(404).send({
                    error: 'arcane.errors.username.not_found',
                    error_description: 'Username not found in the user model'
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
    
            console.log("A User Is Logging Onto The Backend With The Username: " + current_username);
    
            return reply.code(200).send({
                access_token: current_token.token,
                expires_in: Math.round((new Date(current_token.expiresAt).getTime() - Date.now()) / 1000),
                expires_at: current_token.expiresAt.toISOString(),
                token_type: 'bearer',
                refresh_token: current_token.refreshToken,
                refresh_expires: Math.round((new Date(current_token.refreshExpiresAt).getTime() - Date.now()) / 1000),
                refresh_expires_at: current_token.refreshExpiresAt.toISOString(),
                account_id: current_token.accountId,
                client_id: clientId,
                internal_client: true,
                client_service: 'fortnite',
                displayName: current_username,
                app: 'fortnite',
                in_app_id: current_token.accountId,
                device_id: 'arcane'
            });
        }
    }    
    else if (grant_type == 'client_credentials') {
        return reply.code(200).send({
            access_token: "eg1~ArcaneV2",
            expires_in: 14400, 
            expires_at: new Date(Date.now() + 14400 * 1000).toISOString(),
            token_type: "bearer",
            client_id: clientId,
            internal_client: true,
            client_service: "fortnite"
        });        
    }
    else if (grant_type === 'refresh_token') {
        const { refresh_token } = request.body;
    
        const existingToken = await Token.findOne({ refreshToken: refresh_token });
    
        if (!existingToken || existingToken.refreshExpiresAt < new Date()) {
            console.error("Invalid or expired refresh token");
            return reply.code(400).send({
                error: 'arcane.errors.invalid_refresh_token',
                error_description: 'The refresh token is invalid or expired'
            });
        }
    
        const newAccessToken = crypto.randomBytes(32).toString('hex');
        const newExpiresAt = new Date(Date.now() + 28800 * 1000);  
    
        const newRefreshToken = crypto.randomBytes(32).toString('hex');
        const newRefreshExpiresAt = new Date(Date.now() + 86400 * 1000);  
    
        existingToken.token = newAccessToken;
        existingToken.expiresAt = newExpiresAt;
        existingToken.refreshToken = newRefreshToken;  
        existingToken.refreshExpiresAt = newRefreshExpiresAt;
    
        await existingToken.save();
    
        return reply.code(200).send({
            access_token: `eg1~${newAccessToken}`,
            expires_in: 28800,  
            expires_at: newExpiresAt.toISOString(),
            token_type: 'bearer',
            refresh_token: `eg1~${newRefreshToken}`,
            refresh_expires_in: 86400,  
            refresh_expires_at: newRefreshExpiresAt.toISOString(),
            account_id: existingToken.accountId,
            client_id: clientId
        });
    }
    else {
        console.error("An Unsupported Grant Type Was Requested: " + grant_type);
        return reply.code(400).send({
            error: 'arcane.errors.unsupported_grant_type',
            error_description: `The grant type ${grant_type} is not supported`
        });
    }
    });

    fastify.post('/account/api/oauth/verify', async (request, reply) => {
        const { authorization } = request.headers;
    
        if (!authorization || !authorization.startsWith('Bearer ')) {
            console.error("Authorization token is required");
            return reply.code(400).send({
                error: 'arcane.errors.missing_token',
                error_description: 'Authorization token is required'
            });
        }
    
        const token = authorization.split(' ')[1];
    
        try {
            const tokenEntry = await Token.findOne({ token: token });
    
            if (!tokenEntry || new Date() > tokenEntry.expiresAt) {
                console.error("Token is either invalid or expired");
                return reply.code(401).send({
                    error: 'arcane.errors.invalid_token',
                    error_description: 'Token is either invalid or expired'
                });
            }
    
            const user = await UserV2.findOne({ Account: tokenEntry.accountId }) || await User.findOne({ accountId: tokenEntry.accountId });
            if (!user) {
                console.error("User not found in the database");
                return reply.code(404).send({
                    error: 'arcane.errors.user_not_found',
                    error_description: 'User not found in the database'
                });
            }
    
            return reply.code(200).send({
                access_token: tokenEntry.token,
                expires_in: Math.round((new Date(tokenEntry.expiresAt).getTime() - Date.now()) / 1000),
                expires_at: tokenEntry.expiresAt.toISOString(),
                token_type: 'bearer',
                refresh_token: tokenEntry.refreshToken,
                refresh_expires_in: Math.round((new Date(tokenEntry.refreshExpiresAt).getTime() - Date.now()) / 1000),
                refresh_expires_at: tokenEntry.refreshExpiresAt.toISOString(),
                account_id: tokenEntry.accountId,
                client_id: 'arcane',
                internal_client: true,
                client_service: 'fortnite',
                displayName: user.Username || user.username,
                app: 'fortnite',
                in_app_id: tokenEntry.accountId,
                device_id: 'arcane'
            });
        } catch (error) {
            console.error('Error verifying token:', error);
            return reply.code(500).send({
                error: 'arcane.errors.server_error',
                error_description: 'An internal server error occurred'
            });
        }
    });
    
    fastify.get('/account/api/oauth/verify', async (request, reply) => {
        const { authorization } = request.headers;
    
        if (!authorization || !authorization.startsWith('Bearer ')) {
            console.error("Authorization token is required");
            return reply.code(400).send({
                error: 'arcane.errors.missing_token',
                error_description: 'Authorization token is required'
            });
        }
    
        const token = authorization.split(' ')[1];
    
        try {
            const tokenEntry = await Token.findOne({ token: token });
    
            if (!tokenEntry || new Date() > tokenEntry.expiresAt) {
                console.error("Token is either invalid or expired");
                return reply.code(401).send({
                    error: 'arcane.errors.invalid_token',
                    error_description: 'Token is either invalid or expired'
                });
            }
    
            const user = await UserV2.findOne({ Account: tokenEntry.accountId }) || await User.findOne({ accountId: tokenEntry.accountId });
            if (!user) {
                console.error("User not found in the database");
                return reply.code(404).send({
                    error: 'arcane.errors.user_not_found',
                    error_description: 'User not found in the database'
                });
            }
    
            return reply.code(200).send({
                access_token: tokenEntry.token,
                expires_in: Math.round((new Date(tokenEntry.expiresAt).getTime() - Date.now()) / 1000),
                expires_at: tokenEntry.expiresAt.toISOString(),
                token_type: 'bearer',
                refresh_token: tokenEntry.refreshToken,
                refresh_expires_in: Math.round((new Date(tokenEntry.refreshExpiresAt).getTime() - Date.now()) / 1000),
                refresh_expires_at: tokenEntry.refreshExpiresAt.toISOString(),
                account_id: tokenEntry.accountId,
                client_id: 'arcane',
                internal_client: true,
                client_service: 'fortnite',
                displayName: user.Username || user.username,
                app: 'fortnite',
                in_app_id: tokenEntry.accountId,
                device_id: 'arcane'
            });
        } catch (error) {
            console.error('Error verifying token:', error);
            return reply.code(500).send({
                error: 'arcane.errors.server_error',
                error_description: 'An internal server error occurred'
            });
        }
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