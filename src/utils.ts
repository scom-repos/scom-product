import { application } from "@ijstech/components";
import { Nip19, SocialDataManager, SocialUtilsManager } from "@scom/scom-social-sdk";

function extractEnsName(name: string) {
    const result: { creatorId?: string, communityId?: string }  = {};
    const ensMap: { [key: string]: string; } = application.store?.ensMap || {};
    const value = ensMap[name];
    if (!value) return result;
    const ids = value.split('/');
    const isCommunity = ids.length > 1;
    if (isCommunity) {
        result.communityId = ids[0];
        result.creatorId = ids[1];
    }
    return result;
}

export function getCommunityBasicInfoFromUri(communityUri: string) {
    if (communityUri.includes('/')) {
        const parts = communityUri.split('/');
        return {
            creatorId: parts[1],
            communityId: parts[0]
        }
    } else {
        return extractEnsName(communityUri);
    }
}

export function getLoggedInUserId() {
    const logginedUserStr = localStorage.getItem('loggedInUser');
    if (!logginedUserStr) return;
    const logginedUser = JSON.parse(logginedUserStr);
    return logginedUser.id;
}

export async function fetchCommunities() {
    const logginedUserId = getLoggedInUserId();
    if (!logginedUserId) return [];
    const dataManager: SocialDataManager = application.store?.mainDataManager;
    const communities = await dataManager.fetchMyCommunities(logginedUserId);
    return communities;
}

export async function fetchCommunityStalls(creatorId: string, communityId: string) {
    const dataManager: SocialDataManager = application.store?.mainDataManager;
    const stalls = await dataManager.fetchCommunityStalls(creatorId, communityId);
    return stalls;
}

export async function fetchCommunityProducts(creatorId?: string, communityId?: string, stallId?: string) {
    const dataManager: SocialDataManager = application.store?.mainDataManager;
    const products = await dataManager.fetchCommunityProducts(creatorId, communityId, stallId);
    return products;
}