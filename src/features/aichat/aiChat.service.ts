// features/ai-chat/services/aiChat.service.ts

import { Alert, Linking } from "react-native";
import { ChatMessageDraft } from "./aiChat.type";
import Clipboard from "@react-native-clipboard/clipboard";

/**
 * func 이벤트에 따른 AI 응답 결정
 * ❗ id 생성 금지
 * ❗ RN / WebView 모름
 */
export function handleAiChatAction(
  type: string,
  payload: Record<string, string>
): ChatMessageDraft[] {
  switch (type) {
    case "CALL":
      Linking.openURL(`tel:${payload.phone}`);
      return [
        {
          sender: "ai",
          html: `<div>전화 연결</div>`,
        },
      ];
    case "COPY":
      Clipboard.setString(payload.value);
      Alert.alert("복사 완료", "클립보드에 저장되었습니다.");
      return [
        {
          sender: "ai",
          html: `<div>클립보드 복사</div>`,
        },
      ];  
    case "URL":
      Linking.openURL(payload.url);
      return [
        {
          sender: "ai",
          html: `<div>페이지링크</div>`,
        },
      ];
    case "ADDRESS":
      //const lat = payload.lat;
      //const lng = payload.lng;
      //const label = encodeURIComponent(payload.title);
      
      // 카카오맵 앱 전용 URL 스키마 (좌표 기반 마커 표시)
      Linking.openURL(`kakaomap://look?p=${payload.lat},${payload.lng}`);
      // 앱 미설치 시 이동할 웹 링크
      //const webUrl = `https://map.kakao.com/link/map/${label},${lat},${lng}`;

      
      /*
      try {
        const isInstalled = await Linking.canOpenURL("kakaomap://");
        
        if (isInstalled) {
          await Linking.openURL(url);
        } else {
          // 앱이 없으면 웹 브라우저로 띄워주기
          await Linking.openURL(webUrl);
        }
      } catch (error) {
        Alert.alert("알림", "지도 앱을 열 수 없습니다.");
      }
        */
      
      return [
        {
          sender: "ai",
          html: `<div>지도열기</div>`,
        },
      ];

    

    case "ROUTE":
      //const lat = payload.lat;
      //const lng = payload.lng;
      //const label = encodeURIComponent(payload.title);
      //자동차: by=CAR
      //대중교통: by=PUBLICTRANSIT
      //도보: by=FOOT
      // 카카오맵 앱 전용 URL 스키마 (좌표 기반 마커 표시)
      Linking.openURL(`kakaomap://route?ep=${payload.lat},${payload.lng}&by=CAR`);
      //출발지도 지정필요시
      //kakaomap://route?sp=시작위도,시작경도&ep=도착위도,도착경도&by=CAR
      return [
        {
          sender: "ai",
          html: `<div>길찾기</div>`,
        },
      ];

    default:
      return [];
  }
}
