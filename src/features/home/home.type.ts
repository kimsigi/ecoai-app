import { SIDE_MENUS } from './home.model';

// SIDE_MENUS 배열의 "한 항목" 타입을 추출
// ex) setting / faq / category(subitem 포함) 같은 유니온 타입이 됨
export type SideMenu = (typeof SIDE_MENUS)[number];

// SideMenu 유니온 중에서 "subitem 배열을 가진 항목(category)"만 골라낸 뒤,
// 그 subitem 배열의 "한 항목" 타입을 추출
// ex) { key: "bulky" | "household", label: string, link: ... } 형태
export type SideSubMenu = Extract<
    SideMenu,
    { subitem: readonly unknown[] }
>['subitem'][number];
