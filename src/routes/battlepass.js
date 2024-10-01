const mongoose = require('mongoose');
const BattlePass = require('../database/mongodb/Models/profile/BattlePass.js');

// Worked on these for nothing because it dont work anyway and i cant be bothered to try make it work...

module.exports = async function (fastify, options) {
    fastify.get('/fortnite/api/game/v2/battlepass/:accountId', async (request, reply) => {
        const { accountId } = request.params;

        let battlePass = await BattlePass.findOne({ accountId: accountId });
        if (!battlePass) {
            return reply.code(404).send({
                error: 'arcane.errors.battlepass_not_found',
                error_description: 'Battle Pass data not found for this account'
            });
        }

        return reply.code(200).send({
            accountId: battlePass.accountId,
            currentLevel: battlePass.currentLevel,
            currentTier: battlePass.currentTier,
            unlockedRewards: battlePass.unlockedRewards,
            unlocked: battlePass.unlocked  
        });
    });

    fastify.post('/fortnite/api/game/v2/battlepass/:accountId/upgrade', async (request, reply) => {
        const { accountId } = request.params;
        const { levels, tiers } = request.body;

        let battlePass = await BattlePass.findOne({ accountId: accountId });
        if (!battlePass) {
            battlePass = new BattlePass({ accountId, currentLevel: 1, currentTier: 1 });
        }

        battlePass.currentLevel += levels || 0;
        battlePass.currentTier += tiers || 0;
        await battlePass.save();

        return reply.code(200).send({
            message: 'Battle Pass upgraded successfully',
            currentLevel: battlePass.currentLevel,
            currentTier: battlePass.currentTier,
            unlocked: battlePass.unlocked  
        });
    });

    fastify.post('/fortnite/api/game/v2/battlepass/:accountId/reset', async (request, reply) => {
        const { accountId } = request.params;

        let battlePass = await BattlePass.findOne({ accountId: accountId });
        if (!battlePass) {
            return reply.code(404).send({
                error: 'arcane.errors.battlepass_not_found',
                error_description: 'Battle Pass data not found for this account'
            });
        }

        battlePass.currentLevel = 1;
        battlePass.currentTier = 1;
        battlePass.unlockedRewards = [];
        battlePass.unlocked = false;  
        await battlePass.save();

        return reply.code(200).send({
            message: 'Battle Pass progress reset',
            currentLevel: battlePass.currentLevel,
            currentTier: battlePass.currentTier,
            unlocked: battlePass.unlocked  
        });
    });

    fastify.post('/fortnite/api/game/v2/battlepass/:accountId/buy', async (request, reply) => {
        const { accountId } = request.params;

        let battlePass = await BattlePass.findOne({ accountId: accountId });
        if (!battlePass) {
            battlePass = new BattlePass({ accountId, currentLevel: 1, currentTier: 1 });
        }

        if (battlePass.unlocked) {
            return reply.code(400).send({
                error: 'arcane.errors.battlepass_already_unlocked',
                error_description: 'Battle Pass is already unlocked.'
            });
        }

        battlePass.unlocked = true;  
        await battlePass.save();

        return reply.code(200).send({
            message: 'Battle Pass unlocked successfully',
            currentLevel: battlePass.currentLevel,
            currentTier: battlePass.currentTier,
            unlocked: battlePass.unlocked  
        });
    });

    fastify.post('/fortnite/api/game/v2/battlepass/:accountId/claimReward', async (request, reply) => {
        const { accountId } = request.params;
        const { rewardId } = request.body;

        let battlePass = await BattlePass.findOne({ accountId: accountId });
        if (!battlePass) {
            return reply.code(404).send({
                error: 'arcane.errors.battlepass_not_found',
                error_description: 'Battle Pass data not found for this account'
            });
        }

        if (!battlePass.unlocked) {
            return reply.code(403).send({
                error: 'arcane.errors.battlepass_not_unlocked',
                error_description: 'You must unlock the Battle Pass to claim rewards.'
            });
        }

        if (!battlePass.unlockedRewards.includes(rewardId)) {
            battlePass.unlockedRewards.push(rewardId);
            await battlePass.save();
        }

        return reply.code(200).send({
            message: 'Reward claimed successfully',
            unlockedRewards: battlePass.unlockedRewards
        });
    });
};