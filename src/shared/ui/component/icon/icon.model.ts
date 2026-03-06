import appinfo from '@/shared/ui/assets/icon/appinfo.svg';
import arrowRight from '@/shared/ui/assets/icon/arrowRight.svg';

import chevronUp from '@/shared/ui/assets/icon/chevronUp.svg';
import chevronDown from '@/shared/ui/assets/icon/chevronDown.svg';
import chevronLeft from '@/shared/ui/assets/icon/chevronLeft.svg';
import cameraEntry from '@/shared/ui/assets/icon/cameraEntry.svg';
import category from '@/shared/ui/assets/icon/category.svg';
import close from '@/shared/ui/assets/icon/close.svg';

import faq from '@/shared/ui/assets/icon/faq.svg';

import menu from '@/shared/ui/assets/icon/menu.svg';

import notice from '@/shared/ui/assets/icon/notice.svg';
import notificationInactive from '@/shared/ui/assets/icon/notificationInactive.svg';

import search from '@/shared/ui/assets/icon/search.svg';
import setting from '@/shared/ui/assets/icon/setting.svg';

import symbolGov from '@/shared/ui/assets/icon/symbolGov.svg';
import symbolKeco from '@/shared/ui/assets/icon/symbolKeco.svg';
import symbolKyolim from '@/shared/ui/assets/icon/symbolKyolim.svg';

export const ICON_MAP = {
    appinfo,
    arrowRight,

    chevronUp,
    chevronDown,
    chevronLeft,
    cameraEntry,
    category,
    close,

    faq,

    menu,

    notice,
    notificationInactive,

    search,
    setting,

    symbolGov,
    symbolKeco,
    symbolKyolim,
} as const;

export type IconName = keyof typeof ICON_MAP;
