import { application } from "@ijstech/components";
import { Nip19, SocialUtilsManager } from "@scom/scom-social-sdk";

export function extractCommunityUri(communityUri: string) {
    const parts = communityUri.split('/');
    return {
        creatorId: parts[1],
        communityId: parts[0]
    }
}

export function getCommunityBasicInfoFromUri(communityUri: string) {
    const info = SocialUtilsManager.getCommunityBasicInfoFromUri(communityUri);
    info.creatorId = Nip19.npubEncode(info.creatorId);
    return info;
}

export async function fetchCommunityStalls(creatorId: string, communityId: string) {
    const dataManager = application.store?.mainDataManager;
    const stalls = await dataManager.fetchCommunityStalls(creatorId, communityId);
    return stalls;
}

export async function fetchCommunityProducts(creatorId: string, communityId: string) {
    const dataManager = application.store?.mainDataManager;
    const products = await dataManager.fetchCommunityProducts(creatorId, communityId);
    return products;
}