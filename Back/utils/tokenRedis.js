require("dotenv").config();
const { Redis } = require('@upstash/redis');

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const KEY_ML_TOKENS = process.env.KEY_ML_TOKENS;

/**
 * Guarda el JSON
 * @param data 
 */
const guardarToken = async (data) => {
    const expiresAt = Date.now() + (data.expires_in * 1000) - 300000; 
    
    const dataToSave = {
        ...data,
        expires_at: expiresAt
    };
    
    await redis.set(KEY_ML_TOKENS, JSON.stringify(dataToSave));
};

/**
 * @returns Data del JSON 
 */
const getToken = async () => {
    try {
        const data = await redis.get(KEY_ML_TOKENS);

        if (!data) {
            return null;
        }

        return data;
    } catch (error) {
        return null;
    }
};

module.exports = {
    guardarToken,
    getToken
};