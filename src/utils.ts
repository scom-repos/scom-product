import { application } from "@ijstech/components";
import { Nip19, SocialDataManager, SocialUtilsManager } from "@scom/scom-social-sdk";

export function getCommunityBasicInfoFromUri(communityUri: string) {
    const info = SocialUtilsManager.getCommunityBasicInfoFromUri(communityUri);
    info.creatorId = Nip19.npubEncode(info.creatorId);
    return info;
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