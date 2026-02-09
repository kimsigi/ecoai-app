import { ChatMessage } from "./aiChat.type";

export const initialChatMessages: ChatMessage[] = [
  {
  id: "m_t1",
  sender: "ai",
  html: `
    <div style="
      display:flex;
      flex-direction:column;
      gap:10px;
      font-size:14px;
      line-height:1.6;
      color:#111827;
    ">
      <div>
        <svg
  width="16"
  height="16"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  style="margin-right:6px;"
>
  <path d="M22 16.92v3a2 2 0 0 1-2.18 2
           19.79 19.79 0 0 1-8.63-3.07
           19.5 19.5 0 0 1-6-6
           19.79 19.79 0 0 1-3.07-8.67
           A2 2 0 0 1 4.11 2h3
           a2 2 0 0 1 2 1.72
           12.84 12.84 0 0 0 .7 2.81
           a2 2 0 0 1-.45 2.11L8.09 9.91
           a16 16 0 0 0 6 6l1.27-1.27
           a2 2 0 0 1 2.11-.45
           12.84 12.84 0 0 0 2.81.7
           A2 2 0 0 1 22 16.92z"/>
</svg>SVG 이미지 파일이 아닌 '코드'로 만든 아이콘
<br />
📞📋🌐 이것은 이모지 아이콘
<br />
<p onclick="func('URL', { url: 'https://www.naver.com' })">
    <img src="https://mml.pstatic.net/www/mobile/edit/20260208_1095/upload_1770552134185DCnYt.png" width="100" height="100">
    <span>네이버 이미지URL 링크</span>
</p>
<br />
<p><span onClick="func('ADDRESS', {'title': '서울시청', 'lat': '37.5665', 'lng': '126.9780'})">서울시청 위치 표시</span></p>
<p><span onClick="func('ROUTE', {'title': '서울시청', 'lat': '37.5665', 'lng': '126.9780'})">내위치에서 서울시청 길찾기</span></p>
      </div>
  `,
},
  {
  id: "m_call",
  sender: "ai",
  html: `
    <div style="
      display:flex;
      flex-direction:column;
      gap:10px;
      font-size:14px;
      line-height:1.6;
      color:#111827;
    ">
      <div>
냉장고는 <b>폐가전제품 무상수거 서비스</b>를 이용하여 배출할 수 있습니다.<br/>
        아래 기관으로 문의해 주세요.
      </div>

      <div style="
        background-color:#ffffff;
        border-radius:14px;
        padding:14px;
        box-shadow:0 4px 10px rgba(0,0,0,0.06);
        display:flex;
        flex-direction:column;
        gap:10px;
      ">
        <div style="
          font-size:15px;
          font-weight:700;
          color:#111827;
        ">
          노원구청 자원순환과
        </div>

        <div style="
          font-size:14px;
          font-weight:600;
          color:#2563eb;
        ">
          02-2116-3807
        </div>

        <div style="
          display:flex;
          gap:8px;
          margin-top:6px;
        ">
          <button
            onclick="func('CALL', { phone: '02-1234-5678' })"
            style="
              flex:1;
              padding:10px 0;
              border-radius:10px;
              border:none;
              background-color:#2563eb;
              color:#ffffff;
              font-size:14px;
              font-weight:600;
              cursor:pointer;
            "
          >
            📞 전화 걸기
          </button>

          <button
            onclick="func('COPY', { value: '02-1234-5678' })"
            style="
              flex:1;
              padding:10px 0;
              border-radius:10px;
              border:none;
              background-color:#f1f5f9;
              color:#111827;
              font-size:14px;
              font-weight:600;
              cursor:pointer;
            "
          >
            번호 복사
          </button>
        </div>

        <div
          onclick="func('URL', { url: 'https://www.naver.com/' })"
          style="
            margin-top:4px;
            font-size:13px;
            color:#2563eb;
            text-decoration:underline;
            cursor:pointer;
            align-self:flex-start;
          "
        >
          ▶ 자세한 배출 방법 보기
        </div>
      </div>
    </div>
  `,
},
{
  id: "m_public_info",
  sender: "ai",
  html: `
    <div style="
      display:flex;
      flex-direction:column;
      gap:10px;
      font-size:14px;
      line-height:1.6;
      color:#111827;
    ">
      <!-- 안내 텍스트 -->
      <div>
        • 냉장고는 폐가전제품
        <span
          onclick="func('CALL', { phone: '02-1234-5678' })"
          style="
            color:#2563eb;
            font-weight:600;
            text-decoration:underline;
            cursor:pointer;
          "
        >
          무상수거서비스(02-2116-3807)
        </span>
        를 이용하여 배출합니다.<br/>
        • 무상수거서비스를 이용하기 어려운 경우에는
        대형폐기물 배출합니다.<br/>
        • 신제품 구매 시 생산·판매처의 회수 서비스를 이용하여 배출합니다.
      </div>

      <!-- 보조 안내 -->
      <div style="
        background-color:#eef2ff;
        border-radius:12px;
        padding:10px 12px;
        font-size:13px;
        color:#1e40af;
      ">
        노원구 무상수거서비스 대상자는
        <b>직배출</b>입니다.<br/>
        배출신청은 전화와 온라인으로 가능합니다.
      </div>

      <!-- 전화 카드 -->
      <div style="
        background-color:#ffffff;
        border-radius:14px;
        padding:14px;
        box-shadow:0 4px 10px rgba(0,0,0,0.06);
        display:flex;
        flex-direction:column;
        gap:10px;
      ">
        <div style="
          font-size:13px;
          color:#6b7280;
        ">
          (주)앰솔 · 노원구
        </div>

        <div style="
          font-size:18px;
          font-weight:700;
          color:#111827;
        ">
          02-2116-3807
        </div>

        <div style="
          font-size:13px;
          color:#2563eb;
        ">
          스마트 클린 노원 배출 신청
        </div>

        <div style="
          display:flex;
          gap:8px;
          margin-top:6px;
        ">
          <button
            onclick="func('CALL', { phone: '02-1234-5678' })"
            style="
              flex:1;
              padding:10px 0;
              border-radius:10px;
              border:none;
              background-color:#2563eb;
              color:#ffffff;
              font-size:14px;
              font-weight:600;
              cursor:pointer;
            "
          >
            📞 전화걸기
          </button>

          <button
            onclick="func('COPY', { value: '02-1234-5678' })"
            style="
              flex:1;
              padding:10px 0;
              border-radius:10px;
              border:none;
              background-color:#f1f5f9;
              color:#111827;
              font-size:14px;
              font-weight:600;
              cursor:pointer;
            "
          >
            📋 복사하기
          </button>
        </div>

        <button
          onclick="func('URL', { url: 'https://www.naver.com/' })"
          style="
            margin-top:4px;
            padding:8px 0;
            border-radius:10px;
            border:none;
            background-color:#e0edff;
            color:#1d4ed8;
            font-size:13px;
            font-weight:600;
            cursor:pointer;
          "
        >
          🌐 홈페이지
        </button>
      </div>

      <!-- 마지막 질문 -->
      <div style="
        margin-top:6px;
        font-size:14px;
        color:#111827;
      ">
        더 자세한 정보나 다른 배출 방법을 확인할까요?
      </div>

      <!-- 선택 버튼 -->
      <div style="
        display:flex;
        gap:10px;
      ">
        <button
          onclick="func('END', {})"
          style="
            flex:1;
            padding:10px 0;
            border-radius:20px;
            border:1px solid #2563eb;
            background-color:#ffffff;
            color:#2563eb;
            font-size:14px;
            font-weight:600;
            cursor:pointer;
          "
        >
          아니요
        </button>

        <button
          onclick="func('YES')"
          style="
            flex:1;
            padding:10px 0;
            border-radius:20px;
            border:none;
            background-color:#2563eb;
            color:#ffffff;
            font-size:14px;
            font-weight:600;
            cursor:pointer;
          "
        >
          예
        </button>
      </div>
    </div>
  `,
}


];
