import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="text-center space-y-8 max-w-2xl px-8">
        <h1 className="text-6xl font-bold">📈 차트 매매 게임</h1>

        <p className="text-xl text-gray-400">
          50턴 동안 차트를 보고 매수/매도하여
          <br />
          최고의 수익률을 달성하세요!
        </p>

        <div className="bg-gray-800 rounded-lg p-8 space-y-4 text-left">
          <h2 className="text-2xl font-semibold text-center mb-6">게임 규칙</h2>
          <ul className="space-y-3 text-gray-300">
            <li>💰 초기 자산: 10,000,000원</li>
            <li>🎮 총 50턴 진행</li>
            <li>📊 매수: 100주 단위</li>
            <li>💵 매도: 보유 주식 전량</li>
            <li>🎯 목표: 최대 수익률 달성</li>
          </ul>
        </div>

        <Link
          href="/game"
          className="inline-block px-12 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-2xl font-semibold transition-all"
        >
          게임 시작
        </Link>
      </div>
    </div>
  );
}
