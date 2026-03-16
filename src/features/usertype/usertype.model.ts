import { UserType, UserTypeBadgeBase } from './usertype.type';

export const USER_TYPES: ReadonlyArray<{
    type: UserType;
    label: string;
    badge: UserTypeBadgeBase;
}> = [
    {
        type: 'PERSONAL',
        label: '개인',
        badge: 'userTypePersonal',
    },
    {
        type: 'BUSINESS',
        label: '사업자',
        badge: 'userTypeBusiness',
    },
];
