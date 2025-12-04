# Chart Game & Trading Analysis Platform

이 프로젝트는 사용자의 트레이딩 성향을 분석하는 게임과, 실제 MT4 트레이딩 내역을 연동하여 분석할 수 있는 대시보드 플랫폼입니다.

## 🚀 시작하기 (Getting Started)

### 1. 설치 (Installation)
프로젝트 루트 디렉토리에서 의존성을 설치합니다.
```bash
npm install
```

### 2. 실행 (Run)
개발 서버를 실행합니다.
```bash
npm run dev
```
브라우저에서 `http://localhost:3000`으로 접속하여 확인합니다.

### 3. MT4 연동 (선택 사항)
시스템 트레이딩(EA) 신호를 연동하려면:
1. `src/features/trade-receiver/ea/My_Strategy_EA.mq4` 파일을 MT4의 `Experts` 폴더에 복사하고 컴파일합니다.
2. MT4 설정(`Tools` -> `Options` -> `Expert Advisors`)에서 `Allow WebRequest`를 켜고 `http://localhost:3000/api/trades`를 추가합니다.
3. EA를 차트에 적용하면 자동으로 거래 내역이 웹 대시보드로 전송됩니다.

## 📂 주요 기능
- **나만의 투자 전략 알아보기**: 모의 투자를 통해 나의 투자 성향(스캘퍼, 스윙 등)을 분석해줍니다.
- **트레이딩 대시보드**: 내 매매 내역과 승률, 수익률 등을 시각적으로 보여줍니다.
- **외부 연동**: MetaTrader 4(MT4)와 연동하여 자동매매 내역을 실시간으로 수집합니다.

## 🛠 기술 스택
- **Next.js 14**
- **TypeScript**
- **Tailwind CSS**
- **Zustand**
