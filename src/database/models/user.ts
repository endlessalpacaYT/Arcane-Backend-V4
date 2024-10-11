import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
    {
        created: { type: Date, required: true },
        banned: { type: Boolean, default: false },
        discordId: { type: String, required: true, unique: true },
        accountId: { type: String, required: true, unique: true },
        username: { type: String, required: true, unique: true },
        username_lower: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        general: {
            language: { type: String, default: "en-US" },
            subtitles: { type: Boolean, default: true }
        },
        notifications: {
            gameInvite: { type: Boolean, default: true },
            friendRequest: { type: Boolean, default: true },
            partyInvite: { type: Boolean, default: true }
        },
        privacy: {
            profileVisibility: {
              type: String,
              enum: ["Public", "Private", "FriendsOnly"],
              default: "Public"
            },
            showGameActivity: { type: Boolean, default: true }
        },
        controls: {
            sensitivity: { type: Number, default: 1.0 },
            invertedYAxis: { type: Boolean, default: false }
        },
        audio: {
            masterVolume: { type: Number, default: 100 },
            musicVolume: { type: Number, default: 100 },
            voiceChatVolume: { type: Number, default: 100 }
        },
        externalAuths: [
            {
              provider: { type: String }, 
              providerId: { type: String }, 
              linkedAt: { type: Date, default: Date.now } 
            }
        ],
        socialBans: {
            bans: [
              {
                reason: { type: String },
                issuedAt: { type: Date },
                expiresAt: { type: Date }
              }
            ],
            warnings: [
              {
                reason: { type: String },
                issuedAt: { type: Date }
              }
            ]
        }
    },
    {
        collection: "users"
    }
)

const model = mongoose.model('UserSchema', UserSchema);

export default model;