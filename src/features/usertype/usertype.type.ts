export type UserType = 'PERSONAL' | 'BUSINESS';

export type UserTypeBadgeBase = 'userTypePersonal' | 'userTypeBusiness';

export type UserTypeBadgeName =
    | `${UserTypeBadgeBase}Active`
    | `${UserTypeBadgeBase}Inactive`;
