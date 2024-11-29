import { ICommunityProductInfo } from '@scom/scom-social-sdk';

export interface IProductInfo {
    config?: {
        communityUri: string;
        productId?: string;
    },
    product?: ICommunityProductInfo;
}