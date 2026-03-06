import { ROUTES } from '@/app/app.route';

export const SIDE_MENU_LIST = [
    { key: 'setting', label: '설정', icon: 'setting', link: ROUTES.SETTING },
    {
        key: 'myDisposalHistory',
        label: '내 배출 정보 확인',
        icon: 'appinfo',
        link: ROUTES.MYDISPOSAL,
    },
    { key: 'faq', label: 'FAQ', icon: 'faq' },
    { key: 'notice', label: '알림', icon: 'notice' },
    { key: 'appinfo', label: '앱정보', icon: 'appinfo' },
    {
        key: 'category',
        label: '배출 품목 분류',
        icon: 'category',
        subitem: true,
    },
] as const;

export const CATEGORY_SUB_MENUS = ['대형폐기물', '생활폐기물'];
