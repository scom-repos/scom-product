import { ICommunityProductInfo, ICommunityStallInfo } from '@scom/scom-social-sdk';

export interface IProductConfig {
    creatorId?: string;
    communityId?: string;
    stallId?: string;
    productId?: string;
}

export interface IProductInfo {
    config?: IProductConfig,
    product?: ICommunityProductInfo;
    stall?: ICommunityStallInfo;
}