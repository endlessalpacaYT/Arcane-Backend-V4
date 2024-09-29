const mongoose = require('mongoose');

const BattlePassSchema = new mongoose.Schema({
  accountId: { type: String, required: true },
  currentLevel: { type: Number, default: 1 },
  currentTier: { type: Number, default: 1 },
  unlockedRewards: { type: Array, default: [] },
  unlocked: { type: Boolean, default: false }
});

const BattlePass = mongoose.model('BattlePass', BattlePassSchema);

module.exports = BattlePass;
