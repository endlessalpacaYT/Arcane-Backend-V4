const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const Profile = require("../Models/profile/profile");

const Version = require("../utils/functions"); 
const error = require("../utils/error");
const profileManager = require("../utils/profile");
const functions = require("../utils/functions");

module.exports = async function (fastify, options) {
  function checkFields(requiredFields, requestBody) {
    const missingFields = requiredFields.filter(field => !(field in requestBody));
    
    return {
      fields: missingFields,
      isValid: missingFields.length === 0
    };
  }
  
  fastify.post('/fortnite/api/game/v2/profile/:accountId/client/ClientQuestLogin', async (request, reply) => {
    const profiles = await Profile.findOne({ accountId: request.params.accountId });

    if (!await profileManager.validateProfile(request.query.profileId, profiles)) {
      return error.createError(
        "errors.com.epicgames.modules.profiles.operation_forbidden",
        `Unable to find template configuration for profile ${request.query.profileId}`,
        [request.query.profileId], 12813, undefined, 403, reply
      );
    }

    let profile = profiles.profiles[request.query.profileId];

    const QuestIDS = JSON.parse(JSON.stringify(require("./Quests.json")));

    const memory = Version.GetVersionInfo(request);

    let ApplyProfileChanges = [];
    let BaseRevision = profile.rvn;
    let ProfileRevisionCheck = (memory.build >= 12.20) ? profile.commandRevision : profile.rvn;
    let QueryRevision = request.query.rvn || -1;
    let StatChanged = false;

    let QuestCount = 0;
    let ShouldGiveQuest = true;
    let DateFormat = (new Date().toISOString()).split("T")[0];
    let DailyQuestIDS;
    let SeasonQuestIDS;

    try {
      if (request.query.profileId === "athena") {
        DailyQuestIDS = QuestIDS.Daily;

        if (QuestIDS.BattleRoyale && QuestIDS.BattleRoyale.hasOwnProperty(`Season${memory.season}`)) {
          SeasonQuestIDS = QuestIDS.BattleRoyale[`Season${memory.season}`];
        } else {
          console.warn("BattleRoyale or season data is missing.");
          SeasonQuestIDS = {};  
        }

        for (let key in profile.items) {
          if (profile.items[key].templateId.toLowerCase().startsWith("quest:athenadaily")) {
            QuestCount += 1;
          }
        }
      }

      if (profile.stats.attributes.hasOwnProperty("quest_manager")) {
        if (profile.stats.attributes.quest_manager.hasOwnProperty("dailyLoginInterval")) {
          if (profile.stats.attributes.quest_manager.dailyLoginInterval.includes("T")) {
            let DailyLoginDate = (profile.stats.attributes.quest_manager.dailyLoginInterval).split("T")[0];

            if (DailyLoginDate === DateFormat) {
              ShouldGiveQuest = false;
            } else {
              ShouldGiveQuest = true;
              if (profile.stats.attributes.quest_manager.dailyQuestRerolls <= 0) {
                profile.stats.attributes.quest_manager.dailyQuestRerolls += 1;
              }
            }
          }
        }
      }

      if (QuestCount < 3 && ShouldGiveQuest === true) {
        const NewQuestID = functions.MakeID();
        let randomNumber = Math.floor(Math.random() * DailyQuestIDS.length);

        for (let key in profile.items) {
          while (DailyQuestIDS[randomNumber].templateId.toLowerCase() === profile.items[key].templateId.toLowerCase()) {
            randomNumber = Math.floor(Math.random() * DailyQuestIDS.length);
          }
        }

        profile.items[NewQuestID] = {
          "templateId": DailyQuestIDS[randomNumber].templateId,
          "attributes": {
            "creation_time": new Date().toISOString(),
            "level": -1,
            "item_seen": false,
            "playlists": [],
            "sent_new_notification": false,
            "challenge_bundle_id": "",
            "xp_reward_scalar": 1,
            "challenge_linked_quest_given": "",
            "quest_pool": "",
            "quest_state": "Active",
            "bucket": "",
            "last_state_change_time": new Date().toISOString(),
            "challenge_linked_quest_parent": "",
            "max_level_bonus": 0,
            "xp": 0,
            "quest_rarity": "uncommon",
            "favorite": false
          },
          "quantity": 1
        };

        if (!profile.stats.attributes.quest_manager) {
          profile.stats.attributes.quest_manager = {}; 
        }
      
        profile.stats.attributes.quest_manager.dailyLoginInterval = new Date().toISOString();
        
        if (Array.isArray(DailyQuestIDS[randomNumber].objectives)) {
            for (let i in DailyQuestIDS[randomNumber].objectives) {
                profile.items[NewQuestID].attributes[`completion_${DailyQuestIDS[randomNumber].objectives[i].toLowerCase()}`] = 0;
            }
        }
        
        ApplyProfileChanges.push({
            "changeType": "itemAdded",
            "itemId": NewQuestID,
            "item": profile.items[NewQuestID]
        });
        
        ApplyProfileChanges.push({
            "changeType": "statModified",
            "name": "quest_manager",
            "value": profile.stats.attributes.quest_manager
        });
        
        StatChanged = true;
      
      }
    } catch (err) {
      console.error(err);
    }

    for (let key in profile.items) {
      if (key.startsWith("S") && Number.isInteger(Number(key[1])) && (key[2] === "-" || (Number.isInteger(Number(key[2])) && key[3] === "-"))) {
        if (!key.startsWith(`S${memory.season}-`)) {
          delete profile.items[key];

          ApplyProfileChanges.push({
            "changeType": "itemRemoved",
            "itemId": key
          });

          StatChanged = true;
        }
      }
    }

    if (SeasonQuestIDS) {
      if (request.query.profileId === "athena") {
        for (let ChallengeBundleSchedule in SeasonQuestIDS.ChallengeBundleSchedules) {
          if (profile.items.hasOwnProperty(ChallengeBundleSchedule.itemGuid)) {
            ApplyProfileChanges.push({
              "changeType": "itemRemoved",
              "itemId": ChallengeBundleSchedule.itemGuid
            });
          }

          ChallengeBundleSchedule = SeasonQuestIDS.ChallengeBundleSchedules[ChallengeBundleSchedule];

          profile.items[ChallengeBundleSchedule.itemGuid] = {
            "templateId": ChallengeBundleSchedule.templateId,
            "attributes": {
              "unlock_epoch": new Date().toISOString(),
              "max_level_bonus": 0,
              "level": 1,
              "item_seen": true,
              "xp": 0,
              "favorite": false,
              "granted_bundles": ChallengeBundleSchedule.granted_bundles
            },
            "quantity": 1
          };

          ApplyProfileChanges.push({
            "changeType": "itemAdded",
            "itemId": ChallengeBundleSchedule.itemGuid,
            "item": profile.items[ChallengeBundleSchedule.itemGuid]
          });

          StatChanged = true;
        }

        for (let ChallengeBundle in SeasonQuestIDS.ChallengeBundles) {
          if (profile.items.hasOwnProperty(ChallengeBundle.itemGuid)) {
            ApplyProfileChanges.push({
              "changeType": "itemRemoved",
              "itemId": ChallengeBundle.itemGuid
            });
          }

          ChallengeBundle = SeasonQuestIDS.ChallengeBundles[ChallengeBundle];

          profile.items[ChallengeBundle.itemGuid] = {
            "templateId": ChallengeBundle.templateId,
            "attributes": {
              "has_unlock_by_completion": false,
              "num_quests_completed": 0,
              "level": 0,
              "grantedquestinstanceids": ChallengeBundle.grantedquestinstanceids,
              "item_seen": true,
              "max_allowed_bundle_level": 0,
              "num_granted_bundle_quests": 0,
              "max_level_bonus": 0,
              "challenge_bundle_schedule_id": ChallengeBundle.challenge_bundle_schedule_id,
              "num_progress_quests_completed": 0,
              "xp": 0,
              "favorite": false
            },
            "quantity": 1
          };

          profile.items[ChallengeBundle.itemGuid].attributes.num_granted_bundle_quests = ChallengeBundle.grantedquestinstanceids.length;

          ApplyProfileChanges.push({
            "changeType": "itemAdded",
            "itemId": ChallengeBundle.itemGuid,
            "item": profile.items[ChallengeBundle.itemGuid]
          });

          StatChanged = true;
        }
      }

      for (let Quest in SeasonQuestIDS.Quests) {
        if (profile.items.hasOwnProperty(Quest.itemGuid)) {
          ApplyProfileChanges.push({
            "changeType": "itemRemoved",
            "itemId": Quest.itemGuid
          });
        }

        Quest = SeasonQuestIDS.Quests[Quest];

        profile.items[Quest.itemGuid] = {
          "templateId": Quest.templateId,
          "attributes": {
            "creation_time": new Date().toISOString(),
            "level": -1,
            "item_seen": true,
            "playlists": [],
            "sent_new_notification": true,
            "challenge_bundle_id": Quest.challenge_bundle_id || "",
            "xp_reward_scalar": 1,
            "challenge_linked_quest_given": "",
            "quest_pool": "",
            "quest_state": "Active",
            "bucket": "",
            "last_state_change_time": new Date().toISOString(),
            "challenge_linked_quest_parent": "",
            "max_level_bonus": 0,
            "xp": 0,
            "quest_rarity": "uncommon",
            "favorite": false
          },
          "quantity": 1
        };

        for (let i in Quest.objectives) {
          profile.items[Quest.itemGuid].attributes[`completion_${Quest.objectives[i].name.toLowerCase()}`] = 0;
        }

        ApplyProfileChanges.push({
          "changeType": "itemAdded",
          "itemId": Quest.itemGuid,
          "item": profile.items[Quest.itemGuid]
        });

        StatChanged = true;
      }
    }

    if (StatChanged === true) {
      profile.rvn += 1;
      profile.commandRevision += 1;

      await profiles.updateOne({ $set: { [`profiles.${request.query.profileId}`]: profile } });
    }

    if (QueryRevision !== ProfileRevisionCheck) {
      ApplyProfileChanges = [{
        "changeType": "fullProfileUpdate",
        "profile": profile
      }];
    }

    return reply.code(200).send({
      profileRevision: profile.rvn || 0,
      profileId: request.query.profileId,
      profileChangesBaseRevision: BaseRevision,
      profileChanges: ApplyProfileChanges,
      profileCommandRevision: profile.commandRevision || 0,
      serverTime: new Date().toISOString(),
      responseVersion: 1
    });
  });
    
    fastify.post("/fortnite/api/game/v2/profile/:accountId/client/:operation", async (request, reply) => {
      const profiles = await Profile.findOne({ accountId: request.params.accountId });
  
      console.log("Operation Requested: " + request.params.operation);
  
      if (!profiles || !await profileManager.validateProfile(request.query.profileId, profiles)) {
          return reply.code(403).send({
              errorCode: "errors.com.epicgames.modules.profiles.operation_forbidden",
              errorMessage: `Unable to find template configuration for profile ${request.query.profileId}`,
              messageVars: [request.query.profileId],
              numericErrorCode: 12813,
          });
      }
  
      let profile = profiles.profiles[request.query.profileId];
  
      if (profile.rvn === profile.commandRevision) {
          profile.rvn += 1;
  
          if (request.query.profileId === "athena") {
              if (!profile.stats.attributes.last_applied_loadout) {
                  profile.stats.attributes.last_applied_loadout = profile.stats.attributes.loadouts[0];
              }
          }
  
          await profiles.updateOne({ $set: { [`profiles.${request.query.profileId}`]: profile } });
      }
  
      const memory = Version.GetVersionInfo(request);
  
      if (request.query.profileId === "athena") {
          profile.stats.attributes.season_num = memory.season;
      }
  
      let MultiUpdate = [];
  
      if (request.query.profileId === "common_core" && global.giftReceived[request.params.accountId]) {
          global.giftReceived[request.params.accountId] = false;
  
          let athena = profiles.profiles["athena"];
  
          MultiUpdate = [{
              "profileRevision": athena.rvn || 0,
              "profileId": "athena",
              "profileChangesBaseRevision": athena.rvn || 0,
              "profileChanges": [{
                  "changeType": "fullProfileUpdate",
                  "profile": athena
              }],
              "profileCommandRevision": athena.commandRevision || 0,
          }];
      }
  
      let ApplyProfileChanges = [];
      let BaseRevision = profile.rvn;
      let ProfileRevisionCheck = (memory.build >= 12.20) ? profile.commandRevision : profile.rvn;
      let QueryRevision = request.query.rvn || -1;
  
      switch (request.params.operation) {
          case "QueryProfile":
          case "ClientQuestLogin":
          case "RefreshExpeditions":
          case "GetMcpTimeForLogin":
          case "IncrementNamedCounterStat":
          case "SetHardcoreModifier":
          case "SetMtxPlatform":
          case "BulkEquipBattleRoyaleCustomization":
          case "EquipBattleRoyaleCustomization":
          case "MarkNewQuestNotificationSent":
              break;
  
          default:
              return reply.code(404).send({
                  errorCode: "errors.com.epicgames.fortnite.operation_not_found",
                  errorMessage: `Operation ${request.params.operation} not valid`,
                  messageVars: [request.params.operation],
                  numericErrorCode: 16035,
              });
      }
  
      if (QueryRevision !== ProfileRevisionCheck) {
          ApplyProfileChanges = [{
              "changeType": "fullProfileUpdate",
              "profile": profile
          }];
      }
  
      return reply.code(200).send({
          profileRevision: profile.rvn || 0,
          profileId: request.query.profileId,
          profileChangesBaseRevision: BaseRevision,
          profileChanges: ApplyProfileChanges,
          profileCommandRevision: profile.commandRevision || 0,
          serverTime: new Date().toISOString(),
          ...(MultiUpdate.length > 0 && { multiUpdate: MultiUpdate }),
          responseVersion: 1
      });
  }); 
  
  fastify.post("/fortnite/api/game/v2/profile/:accountId/dedicated_server/:operation", async (request, reply) => {
    console.log("Operation Requested: " + request.params.operation);
    
    const profiles = await Profile.findOne({ accountId: request.params.accountId }).lean();
    
    if (!profiles) {
        return reply.code(404).send({});
    }

    if (!await profileManager.validateProfile(request.query.profileId, profiles)) {
        return reply.code(403).send({
            errorCode: "errors.com.epicgames.modules.profiles.operation_forbidden",
            errorMessage: `Unable to find template configuration for profile ${request.query.profileId}`,
            messageVars: [request.query.profileId],
            numericErrorCode: 12813
        });
    }

    let profile = profiles.profiles[request.query.profileId];

    if (request.query.profileId !== "athena") {
        return reply.code(400).send({
            errorCode: "errors.com.epicgames.modules.profiles.invalid_command",
            errorMessage: `dedicated_server is not valid on ${request.query.profileId} profile`,
            messageVars: ["dedicated_server", request.query.profileId],
            numericErrorCode: 12801
        });
    }

    let ApplyProfileChanges = [];
    let BaseRevision = profile.rvn;
    let QueryRevision = request.query.rvn || -1;

    if (QueryRevision !== BaseRevision) {
        ApplyProfileChanges = [{
            "changeType": "fullProfileUpdate",
            "profile": profile
        }];
    }

    return reply.code(200).send({
        profileRevision: profile.rvn || 0,
        profileId: request.query.profileId,
        profileChangesBaseRevision: BaseRevision,
        profileChanges: ApplyProfileChanges,
        profileCommandRevision: profile.commandRevision || 0,
        serverTime: new Date().toISOString(),
        responseVersion: 1
    });
  });

  fastify.post("/fortnite/api/game/v2/profile/:accountId/client/SetCosmeticLockerSlot", async (request, reply) => {
    const profiles = await Profile.findOne({ accountId: request.params.accountId });

    if (!profiles || !await profileManager.validateProfile(request.query.profileId, profiles)) {
      return reply.code(403).send({
        errorCode: "errors.com.epicgames.modules.profiles.operation_forbidden",
        errorMessage: `Unable to find template configuration for profile ${request.query.profileId}`,
        messageVars: [request.query.profileId],
        numericErrorCode: 12813
      });
    }

    if (request.query.profileId !== "athena") {
      return reply.code(400).send({
        errorCode: "errors.com.epicgames.modules.profiles.invalid_command",
        errorMessage: `SetCosmeticLockerSlot is not valid on ${request.query.profileId} profile`,
        messageVars: ["SetCosmeticLockerSlot", request.query.profileId],
        numericErrorCode: 12801
      });
    }

    let profile = profiles.profiles[request.query.profileId];
    const memory = Version.GetVersionInfo(request);

    if (request.query.profileId === "athena") profile.stats.attributes.season_num = memory.season;

    let ApplyProfileChanges = [];
    let BaseRevision = profile.rvn;
    let ProfileRevisionCheck = (memory.build >= 12.20) ? profile.commandRevision : profile.rvn;
    let QueryRevision = request.query.rvn || -1;
    let specialCosmetics = [
      "AthenaCharacter:cid_random",
      "AthenaBackpack:bid_random",
      "AthenaPickaxe:pickaxe_random",
      "AthenaGlider:glider_random",
      "AthenaSkyDiveContrail:trails_random",
      "AthenaItemWrap:wrap_random",
      "AthenaMusicPack:musicpack_random",
      "AthenaLoadingScreen:lsid_random"
    ];

    let missingFields = checkFields(["category", "lockerItem"], request.body);

    if (missingFields.fields.length > 0) {
      return reply.code(400).send({
        errorCode: "errors.com.epicgames.validation.validation_failed",
        errorMessage: `Validation Failed. [${missingFields.fields.join(", ")}] field(s) is missing.`,
        messageVars: [`[${missingFields.fields.join(", ")}]`],
        numericErrorCode: 1040
      });
    }

    if (typeof request.body.itemToSlot !== "string") return error.ValidationError("itemToSlot", "a string", reply);
    if (typeof request.body.slotIndex !== "number") return error.ValidationError("slotIndex", "a number", reply);
    if (typeof request.body.lockerItem !== "string") return error.ValidationError("lockerItem", "a string", reply);
    if (typeof request.body.category !== "string") return error.ValidationError("category", "a string", reply);

    if (!profile.items) profile.items = {};

    let itemToSlotID = "";

    if (request.body.itemToSlot) {
      for (let itemId in profile.items) {
        if (profile.items[itemId].templateId.toLowerCase() === request.body.itemToSlot.toLowerCase()) {
          itemToSlotID = itemId;
          break;
        }
      }
    }

    if (!profile.items[request.body.lockerItem]) {
      return reply.code(400).send({
        errorCode: "errors.com.epicgames.fortnite.id_invalid",
        errorMessage: `Item (id: '${request.body.lockerItem}') not found`,
        messageVars: [request.body.lockerItem],
        numericErrorCode: 16027
      });
    }

    if (profile.items[request.body.lockerItem].templateId.toLowerCase() !== "cosmeticlocker:cosmeticlocker_athena") {
      return reply.code(400).send({
        errorCode: "errors.com.epicgames.fortnite.id_invalid",
        errorMessage: `lockerItem id is not a cosmeticlocker`,
        messageVars: ["lockerItem"],
        numericErrorCode: 16027
      });
    }

    if (!profile.items[itemToSlotID] && request.body.itemToSlot) {
      let item = request.body.itemToSlot;

      if (!specialCosmetics.includes(item)) {
        return reply.code(400).send({
          errorCode: "errors.com.epicgames.fortnite.id_invalid",
          errorMessage: `Item (id: '${request.body.itemToSlot}') not found`,
          messageVars: [request.body.itemToSlot],
          numericErrorCode: 16027
        });
      } else {
        if (!item.startsWith(`Athena${request.body.category}:`)) {
          return reply.code(400).send({
            errorCode: "errors.com.epicgames.fortnite.id_invalid",
            errorMessage: `Cannot slot item of type ${item.split(":")[0]} in slot of category ${request.body.category}`,
            messageVars: [item.split(":")[0], request.body.category],
            numericErrorCode: 16027
          });
        }
      }
    }

    switch (request.body.category) {
      case "Dance":
      case "ItemWrap":
      case "Pickaxe":
      case "Glider":
        profile.items[request.body.lockerItem].attributes.locker_slots_data.slots[request.body.category].items = [request.body.itemToSlot];
        profile.stats.attributes[(`favorite_${request.body.category}`).toLowerCase()] = itemToSlotID || request.body.itemToSlot;

        ApplyProfileChanges.push({
          "changeType": "itemAttrChanged",
          "itemId": request.body.lockerItem,
          "attributeName": "locker_slots_data",
          "attributeValue": profile.items[request.body.lockerItem].attributes.locker_slots_data
        });
        break;
      default:
        break;
    }

    if (ApplyProfileChanges.length > 0) {
      profile.rvn += 1;
      profile.commandRevision += 1;
      profile.updated = new Date().toISOString();

      await profiles.updateOne({ $set: { [`profiles.${request.query.profileId}`]: profile } });
    }

    if (QueryRevision !== ProfileRevisionCheck) {
      ApplyProfileChanges = [{
        "changeType": "fullProfileUpdate",
        "profile": profile
      }];
    }

    return reply.code(200).send({
      profileRevision: profile.rvn || 0,
      profileId: request.query.profileId,
      profileChangesBaseRevision: BaseRevision,
      profileChanges: ApplyProfileChanges,
      profileCommandRevision: profile.commandRevision || 0,
      serverTime: new Date().toISOString(),
      responseVersion: 1
    });
  });

  fastify.post("/fortnite/api/game/v2/profile/:accountId/client/SetCosmeticLockerBanner", async (request, reply) => {
    const profiles = await Profile.findOne({ accountId: request.params.accountId });

    if (!profiles || !await profileManager.validateProfile(request.query.profileId, profiles)) {
      return reply.code(403).send({
        errorCode: "errors.com.epicgames.modules.profiles.operation_forbidden",
        errorMessage: `Unable to find template configuration for profile ${request.query.profileId}`,
        messageVars: [request.query.profileId],
        numericErrorCode: 12813
      });
    }

    if (request.query.profileId !== "athena") {
      return reply.code(400).send({
        errorCode: "errors.com.epicgames.modules.profiles.invalid_command",
        errorMessage: `SetCosmeticLockerBanner is not valid on ${request.query.profileId} profile`,
        messageVars: ["SetCosmeticLockerBanner", request.query.profileId],
        numericErrorCode: 12801
      });
    }

    let profile = profiles.profiles[request.query.profileId];
    const memory = Version.GetVersionInfo(request);

    if (request.query.profileId === "athena") profile.stats.attributes.season_num = memory.season;

    let ApplyProfileChanges = [];
    let BaseRevision = profile.rvn;
    let ProfileRevisionCheck = (memory.build >= 12.20) ? profile.commandRevision : profile.rvn;
    let QueryRevision = request.query.rvn || -1;

    let missingFields = checkFields(["bannerIconTemplateName", "bannerColorTemplateName", "lockerItem"], request.body);

    if (missingFields.fields.length > 0) {
      return reply.code(400).send({
        errorCode: "errors.com.epicgames.validation.validation_failed",
        errorMessage: `Validation Failed. [${missingFields.fields.join(", ")}] field(s) is missing.`,
        messageVars: [`[${missingFields.fields.join(", ")}]`],
        numericErrorCode: 1040
      });
    }

    if (typeof request.body.lockerItem !== "string") return error.ValidationError("lockerItem", "a string", reply);
    if (typeof request.body.bannerIconTemplateName !== "string") return error.ValidationError("bannerIconTemplateName", "a string", reply);
    if (typeof request.body.bannerColorTemplateName !== "string") return error.ValidationError("bannerColorTemplateName", "a string", reply);

    if (!profile.items) profile.items = {};

    if (!profile.items[request.body.lockerItem]) {
      return reply.code(400).send({
        errorCode: "errors.com.epicgames.fortnite.id_invalid",
        errorMessage: `Item (id: '${request.body.lockerItem}') not found`,
        messageVars: [request.body.lockerItem],
        numericErrorCode: 16027
      });
    }

    if (profile.items[request.body.lockerItem].templateId.toLowerCase() !== "cosmeticlocker:cosmeticlocker_athena") {
      return reply.code(400).send({
        errorCode: "errors.com.epicgames.fortnite.id_invalid",
        errorMessage: `lockerItem id is not a cosmeticlocker`,
        messageVars: ["lockerItem"],
        numericErrorCode: 16027
      });
    }

    let bannerProfileId = "common_core";

    let HomebaseBannerIconID = "";
    let HomebaseBannerColorID = "";

    if (!profiles.profiles[bannerProfileId].items) profiles.profiles[bannerProfileId].items = {};

    for (let itemId in profiles.profiles[bannerProfileId].items) {
      let templateId = profiles.profiles[bannerProfileId].items[itemId].templateId;

      if (templateId.toLowerCase() === `HomebaseBannerIcon:${request.body.bannerIconTemplateName}`.toLowerCase()) {
        HomebaseBannerIconID = itemId;
      }

      if (templateId.toLowerCase() === `HomebaseBannerColor:${request.body.bannerColorTemplateName}`.toLowerCase()) {
        HomebaseBannerColorID = itemId;
      }

      if (HomebaseBannerIconID && HomebaseBannerColorID) break;
    }

    if (!HomebaseBannerIconID) {
      return reply.code(400).send({
        errorCode: "errors.com.epicgames.fortnite.item_not_found",
        errorMessage: `Banner template 'HomebaseBannerIcon:${request.body.bannerIconTemplateName}' not found in profile`,
        messageVars: [`HomebaseBannerIcon:${request.body.bannerIconTemplateName}`],
        numericErrorCode: 16006
      });
    }

    if (!HomebaseBannerColorID) {
      return reply.code(400).send({
        errorCode: "errors.com.epicgames.fortnite.item_not_found",
        errorMessage: `Banner template 'HomebaseBannerColor:${request.body.bannerColorTemplateName}' not found in profile`,
        messageVars: [`HomebaseBannerColor:${request.body.bannerColorTemplateName}`],
        numericErrorCode: 16006
      });
    }

    profile.items[request.body.lockerItem].attributes.banner_icon_template = request.body.bannerIconTemplateName;
    profile.items[request.body.lockerItem].attributes.banner_color_template = request.body.bannerColorTemplateName;

    profile.stats.attributes.banner_icon = request.body.bannerIconTemplateName;
    profile.stats.attributes.banner_color = request.body.bannerColorTemplateName;

    ApplyProfileChanges.push({
      "changeType": "itemAttrChanged",
      "itemId": request.body.lockerItem,
      "attributeName": "banner_icon_template",
      "attributeValue": profile.items[request.body.lockerItem].attributes.banner_icon_template
    });

    ApplyProfileChanges.push({
      "changeType": "itemAttrChanged",
      "itemId": request.body.lockerItem,
      "attributeName": "banner_color_template",
      "attributeValue": profile.items[request.body.lockerItem].attributes.banner_color_template
    });

    if (ApplyProfileChanges.length > 0) {
      profile.rvn += 1;
      profile.commandRevision += 1;
      profile.updated = new Date().toISOString();

      await profiles.updateOne({ $set: { [`profiles.${request.query.profileId}`]: profile } });
    }

    if (QueryRevision !== ProfileRevisionCheck) {
      ApplyProfileChanges = [{
        "changeType": "fullProfileUpdate",
        "profile": profile
      }];
    }

    return reply.code(200).send({
      profileRevision: profile.rvn || 0,
      profileId: request.query.profileId,
      profileChangesBaseRevision: BaseRevision,
      profileChanges: ApplyProfileChanges,
      profileCommandRevision: profile.commandRevision || 0,
      serverTime: new Date().toISOString(),
      responseVersion: 1
    });
  });

  fastify.post("/fortnite/api/game/v2/profile/:accountId/client/EquipBattleRoyaleCustomization", async (request, reply) => {
    const profiles = await Profile.findOne({ accountId: request.params.accountId });

    if (!profiles || !await profileManager.validateProfile(request.query.profileId, profiles)) {
      return reply.code(403).send({
        errorCode: "errors.com.epicgames.modules.profiles.operation_forbidden",
        errorMessage: `Unable to find template configuration for profile ${request.query.profileId}`,
        messageVars: [request.query.profileId],
        numericErrorCode: 12813
      });
    }

    if (request.query.profileId !== "athena") {
      return reply.code(400).send({
        errorCode: "errors.com.epicgames.modules.profiles.invalid_command",
        errorMessage: `EquipBattleRoyaleCustomization is not valid on ${request.query.profileId} profile`,
        messageVars: ["EquipBattleRoyaleCustomization", request.query.profileId],
        numericErrorCode: 12801
      });
    }

    let profile = profiles.profiles[request.query.profileId];
    const memory = Version.GetVersionInfo(request);

    if (request.query.profileId === "athena") {
      profile.stats.attributes.season_num = memory.season;
    }

    let ApplyProfileChanges = [];
    let BaseRevision = profile.rvn;
    let ProfileRevisionCheck = (memory.build >= 12.20) ? profile.commandRevision : profile.rvn;
    let QueryRevision = request.query.rvn || -1;
    let specialCosmetics = [
      "AthenaCharacter:cid_random",
      "AthenaBackpack:bid_random",
      "AthenaPickaxe:pickaxe_random",
      "AthenaGlider:glider_random",
      "AthenaSkyDiveContrail:trails_random",
      "AthenaItemWrap:wrap_random",
      "AthenaMusicPack:musicpack_random",
      "AthenaLoadingScreen:lsid_random"
    ];

    let missingFields = checkFields(["slotName"], request.body);

    if (missingFields.fields.length > 0) {
      return reply.code(400).send({
        errorCode: "errors.com.epicgames.validation.validation_failed",
        errorMessage: `Validation Failed. [${missingFields.fields.join(", ")}] field(s) is missing.`,
        messageVars: [`[${missingFields.fields.join(", ")}]`],
        numericErrorCode: 1040
      });
    }

    if (typeof request.body.itemToSlot !== "string") return error.ValidationError("itemToSlot", "a string", reply);
    if (typeof request.body.slotName !== "string") return error.ValidationError("slotName", "a string", reply);

    if (!profile.items) profile.items = {};

    if (!profile.items[request.body.itemToSlot] && request.body.itemToSlot) {
      let item = request.body.itemToSlot;

      if (!specialCosmetics.includes(item)) {
        return reply.code(400).send({
          errorCode: "errors.com.epicgames.fortnite.id_invalid",
          errorMessage: `Item (id: '${request.body.itemToSlot}') not found`,
          messageVars: [request.body.itemToSlot],
          numericErrorCode: 16027
        });
      } else {
        if (!item.startsWith(`Athena${request.body.slotName}:`)) {
          return reply.code(400).send({
            errorCode: "errors.com.epicgames.fortnite.id_invalid",
            errorMessage: `Cannot slot item of type ${item.split(":")[0]} in slot of category ${request.body.slotName}`,
            messageVars: [item.split(":")[0], request.body.slotName],
            numericErrorCode: 16027
          });
        }
      }
    }

    if (profile.items[request.body.itemToSlot]) {
      if (!profile.items[request.body.itemToSlot].templateId.startsWith(`Athena${request.body.slotName}:`)) {
        return reply.code(400).send({
          errorCode: "errors.com.epicgames.fortnite.id_invalid",
          errorMessage: `Cannot slot item of type ${profile.items[request.body.itemToSlot].templateId.split(":")[0]} in slot of category ${request.body.slotName}`,
          messageVars: [profile.items[request.body.itemToSlot].templateId.split(":")[0], request.body.slotName],
          numericErrorCode: 16027
        });
      }

      let Variants = request.body.variantUpdates;

      if (Array.isArray(Variants)) {
        for (let i in Variants) {
          if (typeof Variants[i] !== "object") continue;
          if (!Variants[i].channel) continue;
          if (!Variants[i].active) continue;

          let index = profile.items[request.body.itemToSlot].attributes.variants.findIndex(x => x.channel == Variants[i].channel);

          if (index === -1) continue;
          if (!profile.items[request.body.itemToSlot].attributes.variants[index].owned.includes(Variants[i].active)) continue;

          profile.items[request.body.itemToSlot].attributes.variants[index].active = Variants[i].active;
        }

        ApplyProfileChanges.push({
          "changeType": "itemAttrChanged",
          "itemId": request.body.itemToSlot,
          "attributeName": "variants",
          "attributeValue": profile.items[request.body.itemToSlot].attributes.variants
        });
      }
    }

    let slotNames = ["Character", "Backpack", "Pickaxe", "Glider", "SkyDiveContrail", "MusicPack", "LoadingScreen"];

    let activeLoadoutId = profile.stats.attributes.loadouts[profile.stats.attributes.active_loadout_index];
    let templateId = profile.items[request.body.itemToSlot] ? profile.items[request.body.itemToSlot].templateId : request.body.itemToSlot;

    switch (request.body.slotName) {
      case "Dance":
        if (!profile.items[activeLoadoutId].attributes.locker_slots_data.slots[request.body.slotName]) break;

        if (typeof request.body.indexWithinSlot !== "number") return error.ValidationError("indexWithinSlot", "a number", reply);

        if (request.body.indexWithinSlot >= 0 && request.body.indexWithinSlot <= 5) {
          profile.stats.attributes.favorite_dance[request.body.indexWithinSlot] = request.body.itemToSlot;
          profile.items[activeLoadoutId].attributes.locker_slots_data.slots.Dance.items[request.body.indexWithinSlot] = templateId;

          ApplyProfileChanges.push({
            "changeType": "statModified",
            "name": "favorite_dance",
            "value": profile.stats.attributes["favorite_dance"]
          });
        }
        break;

      case "ItemWrap":
        if (!profile.items[activeLoadoutId].attributes.locker_slots_data.slots[request.body.slotName]) break;

        if (typeof request.body.indexWithinSlot !== "number") return error.ValidationError("indexWithinSlot", "a number", reply);

        switch (true) {
          case request.body.indexWithinSlot >= 0 && request.body.indexWithinSlot <= 7:
            profile.stats.attributes.favorite_itemwraps[request.body.indexWithinSlot] = request.body.itemToSlot;
            profile.items[activeLoadoutId].attributes.locker_slots_data.slots.ItemWrap.items[request.body.indexWithinSlot] = templateId;

            ApplyProfileChanges.push({
              "changeType": "statModified",
              "name": "favorite_itemwraps",
              "value": profile.stats.attributes["favorite_itemwraps"]
            });
            break;

          case request.body.indexWithinSlot == -1:
            for (let i = 0; i < 7; i++) {
              profile.stats.attributes.favorite_itemwraps[i] = request.body.itemToSlot;
              profile.items[activeLoadoutId].attributes.locker_slots_data.slots.ItemWrap.items[i] = templateId;
            }

            ApplyProfileChanges.push({
              "changeType": "statModified",
              "name": "favorite_itemwraps",
              "value": profile.stats.attributes["favorite_itemwraps"]
            });
            break;
        }
        break;

      default:
        if (!slotNames.includes(request.body.slotName)) break;
        if (!profile.items[activeLoadoutId].attributes.locker_slots_data.slots[request.body.slotName]) break;

        if (request.body.slotName === "Pickaxe" || request.body.slotName === "Glider") {
          if (!request.body.itemToSlot) {
            return reply.code(400).send({
              errorCode: "errors.com.epicgames.fortnite.id_invalid",
              errorMessage: `${request.body.slotName} can not be empty.`,
              messageVars: [request.body.slotName],
              numericErrorCode: 16027
            });
          }
        }

        profile.stats.attributes[(`favorite_${request.body.slotName}`).toLowerCase()] = request.body.itemToSlot;
        profile.items[activeLoadoutId].attributes.locker_slots_data.slots[request.body.slotName].items = [templateId];

        ApplyProfileChanges.push({
          "changeType": "statModified",
          "name": (`favorite_${request.body.slotName}`).toLowerCase(),
          "value": profile.stats.attributes[(`favorite_${request.body.slotName}`).toLowerCase()]
        });
        break;
    }

    if (ApplyProfileChanges.length > 0) {
      profile.rvn += 1;
      profile.commandRevision += 1;
      profile.updated = new Date().toISOString();

      await profiles.updateOne({ $set: { [`profiles.${request.query.profileId}`]: profile } });
    }

    if (QueryRevision !== ProfileRevisionCheck) {
      ApplyProfileChanges = [{
        "changeType": "fullProfileUpdate",
        "profile": profile
      }];
    }

    return reply.code(200).send({
      profileRevision: profile.rvn || 0,
      profileId: request.query.profileId,
      profileChangesBaseRevision: BaseRevision,
      profileChanges: ApplyProfileChanges,
      profileCommandRevision: profile.commandRevision || 0,
      serverTime: new Date().toISOString(),
      responseVersion: 1
    });
  });

  fastify.post("/fortnite/api/game/v2/profile/:accountId/client/SetBattleRoyaleBanner", async (request, reply) => {
    const profiles = await Profile.findOne({ accountId: request.params.accountId });

    if (!profiles || !await profileManager.validateProfile(request.query.profileId, profiles)) {
      return reply.code(403).send({
        errorCode: "errors.com.epicgames.modules.profiles.operation_forbidden",
        errorMessage: `Unable to find template configuration for profile ${request.query.profileId}`,
        messageVars: [request.query.profileId],
        numericErrorCode: 12813
      });
    }

    if (request.query.profileId !== "athena") {
      return reply.code(400).send({
        errorCode: "errors.com.epicgames.modules.profiles.invalid_command",
        errorMessage: `SetBattleRoyaleBanner is not valid on ${request.query.profileId} profile`,
        messageVars: ["SetBattleRoyaleBanner", request.query.profileId],
        numericErrorCode: 12801
      });
    }

    let profile = profiles.profiles[request.query.profileId];
    const memory = Version.GetVersionInfo(request);

    if (request.query.profileId === "athena") {
      profile.stats.attributes.season_num = memory.season;
    }

    let ApplyProfileChanges = [];
    let BaseRevision = profile.rvn;
    let ProfileRevisionCheck = (memory.build >= 12.20) ? profile.commandRevision : profile.rvn;
    let QueryRevision = request.query.rvn || -1;

    let missingFields = checkFields(["homebaseBannerIconId", "homebaseBannerColorId"], request.body);

    if (missingFields.fields.length > 0) {
      return reply.code(400).send({
        errorCode: "errors.com.epicgames.validation.validation_failed",
        errorMessage: `Validation Failed. [${missingFields.fields.join(", ")}] field(s) is missing.`,
        messageVars: [`[${missingFields.fields.join(", ")}]`],
        numericErrorCode: 1040
      });
    }

    if (typeof request.body.homebaseBannerIconId !== "string") {
      return error.ValidationError("homebaseBannerIconId", "a string", reply);
    }

    if (typeof request.body.homebaseBannerColorId !== "string") {
      return error.ValidationError("homebaseBannerColorId", "a string", reply);
    }

    let bannerProfileId = memory.build < 3.5 ? "profile0" : "common_core";
    let HomebaseBannerIconID = "";
    let HomebaseBannerColorID = "";

    if (!profiles.profiles[bannerProfileId].items) {
      profiles.profiles[bannerProfileId].items = {};
    }

    for (let itemId in profiles.profiles[bannerProfileId].items) {
      let templateId = profiles.profiles[bannerProfileId].items[itemId].templateId;

      if (templateId.toLowerCase() === `HomebaseBannerIcon:${request.body.homebaseBannerIconId}`.toLowerCase()) {
        HomebaseBannerIconID = itemId;
        continue;
      }

      if (templateId.toLowerCase() === `HomebaseBannerColor:${request.body.homebaseBannerColorId}`.toLowerCase()) {
        HomebaseBannerColorID = itemId;
        continue;
      }

      if (HomebaseBannerIconID && HomebaseBannerColorID) {
        break;
      }
    }

    if (!HomebaseBannerIconID) {
      return reply.code(400).send({
        errorCode: "errors.com.epicgames.fortnite.item_not_found",
        errorMessage: `Banner template 'HomebaseBannerIcon:${request.body.homebaseBannerIconId}' not found in profile`,
        messageVars: [`HomebaseBannerIcon:${request.body.homebaseBannerIconId}`],
        numericErrorCode: 16006
      });
    }

    if (!HomebaseBannerColorID) {
      return reply.code(400).send({
        errorCode: "errors.com.epicgames.fortnite.item_not_found",
        errorMessage: `Banner template 'HomebaseBannerColor:${request.body.homebaseBannerColorId}' not found in profile`,
        messageVars: [`HomebaseBannerColor:${request.body.homebaseBannerColorId}`],
        numericErrorCode: 16006
      });
    }

    if (!profile.items) profile.items = {};

    let activeLoadoutId = profile.stats.attributes.loadouts[profile.stats.attributes.active_loadout_index];

    profile.stats.attributes.banner_icon = request.body.homebaseBannerIconId;
    profile.stats.attributes.banner_color = request.body.homebaseBannerColorId;

    profile.items[activeLoadoutId].attributes.banner_icon_template = request.body.homebaseBannerIconId;
    profile.items[activeLoadoutId].attributes.banner_color_template = request.body.homebaseBannerColorId;

    ApplyProfileChanges.push({
      "changeType": "statModified",
      "name": "banner_icon",
      "value": profile.stats.attributes.banner_icon
    });

    ApplyProfileChanges.push({
      "changeType": "statModified",
      "name": "banner_color",
      "value": profile.stats.attributes.banner_color
    });

    if (ApplyProfileChanges.length > 0) {
      profile.rvn += 1;
      profile.commandRevision += 1;
      profile.updated = new Date().toISOString();

      await profiles.updateOne({ $set: { [`profiles.${request.query.profileId}`]: profile } });
    }

    if (QueryRevision !== ProfileRevisionCheck) {
      ApplyProfileChanges = [{
        "changeType": "fullProfileUpdate",
        "profile": profile
      }];
    }

    return reply.code(200).send({
      profileRevision: profile.rvn || 0,
      profileId: request.query.profileId,
      profileChangesBaseRevision: BaseRevision,
      profileChanges: ApplyProfileChanges,
      profileCommandRevision: profile.commandRevision || 0,
      serverTime: new Date().toISOString(),
      responseVersion: 1
    });
  });
}