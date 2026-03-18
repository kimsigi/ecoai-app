import appinfo from '@/shared/ui/assets/icon/appinfo.svg';
import arrowRight from '@/shared/ui/assets/icon/arrowRight.svg';

import chevronUp from '@/shared/ui/assets/icon/chevronUp.svg';
import chevronDown from '@/shared/ui/assets/icon/chevronDown.svg';
import chevronLeft from '@/shared/ui/assets/icon/chevronLeft.svg';
import cameraEntry from '@/shared/ui/assets/icon/cameraEntry.svg';
import category from '@/shared/ui/assets/icon/category.svg';
import close from '@/shared/ui/assets/icon/close.svg';
import clear from '@/shared/ui/assets/icon/clear.svg';

import disposal from '@/shared/ui/assets/icon/disposal.svg';

import faq from '@/shared/ui/assets/icon/faq.svg';

import kyolimsoftCI from '@/shared/ui/assets/icon/kyolimsoftCI.svg';

import logo from '@/shared/ui/assets/icon/logo.svg';

import menu from '@/shared/ui/assets/icon/menu.svg';

import notice from '@/shared/ui/assets/icon/notice.svg';
import notificationInactive from '@/shared/ui/assets/icon/notificationInactive.svg';

import search from '@/shared/ui/assets/icon/search.svg';
import setting from '@/shared/ui/assets/icon/setting.svg';
import symbolGov from '@/shared/ui/assets/icon/symbolGov.svg';
import symbolKeco from '@/shared/ui/assets/icon/symbolKeco.svg';
import symbolKyolim from '@/shared/ui/assets/icon/symbolKyolim.svg';

import userTypePersonalActive from '@/shared/ui/assets/icon/userTypePersonalActive.svg';
import userTypePersonalInactive from '@/shared/ui/assets/icon/userTypePersonalInactive.svg';
import userTypeBusinessActive from '@/shared/ui/assets/icon/userTypeBusinessActive.svg';
import userTypeBusinessInactive from '@/shared/ui/assets/icon/userTypeBusinessInactive.svg';

export const ICON_MAP = {
    appinfo,
    arrowRight,

    chevronUp,
    chevronDown,
    chevronLeft,
    cameraEntry,
    category,
    close,
    clear,

    disposal,

    faq,

    kyolimsoftCI,

    logo,

    menu,

    notice,
    notificationInactive,

    search,
    setting,
    symbolGov,
    symbolKeco,
    symbolKyolim,

    userTypePersonalActive,
    userTypePersonalInactive,
    userTypeBusinessActive,
    userTypeBusinessInactive,
} as const;

export type IconName = keyof typeof ICON_MAP;
