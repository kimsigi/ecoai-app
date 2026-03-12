import { ROUTES } from '@/app/app.route';

// 홈 사이드 메뉴(☰) 정의
export const SIDE_MENUS = [
    {
        key: 'setting',
        label: '설정',
        icon: 'setting',
        link: ROUTES.SETTING,
    },
    {
        key: 'disposal',
        label: '내 배출 정보 확인',
        icon: 'disposal',
        link: ROUTES.HOME, // TODO. 이부분 수정 필요
    },
    {
        key: 'faq',
        label: 'FAQ',
        icon: 'faq',
        link: ROUTES.FAQ,
    },
    {
        key: 'notice',
        label: '알림',
        icon: 'notice',
        link: ROUTES.NOTIFICATION,
    },
    {
        key: 'appinfo',
        label: '앱정보',
        icon: 'appinfo',
        link: ROUTES.APPINFO,
    },
    {
        key: 'category',
        label: '배출 품목 분류',
        icon: 'category',
        subitem: [
            {
                key: 'bulky',
                label: '대형폐기물',
                link: ROUTES.CATEGORY,
            },
            {
                key: 'household',
                label: '생활폐기물',
                link: ROUTES.CATEGORY,
            },
        ],
    },
] as const;
