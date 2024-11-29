import { application } from "@ijstech/components";

export function getCommunityBasicInfoFromUri(communityUri: string) {
    const parts = communityUri.split('/');
    return {
        creatorId: parts[1],
        communityId: parts[0]
    }
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