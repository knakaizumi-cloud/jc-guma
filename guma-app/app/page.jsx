"use client";
import { useState } from "react";

const SNS_PLATFORMS = [
  { id: "x", label: "𝕏 X", limit: 140, hint: "短くテンポよく、共感しやすく" },
  { id: "x_article", label: "𝕏 Xの記事", limit: 1000, hint: "少し長めに読み応えある内容で" },
  { id: "note", label: "📝 note", limit: 800, hint: "読み物として丁寧に、語り口調で" },
  { id: "instagram", label: "📸 Instagram", limit: 300, hint: "絵文字多め、ハッシュタグ豊富に" },
];

const TONES = [
  { id: "normal", label: "いつものぐま", desc: "元気・明るく" },
  { id: "genki", label: "超元気！", desc: "テンション高め" },
  { id: "shimijimi", label: "しみじみ…", desc: "じんわり系" },
  { id: "negative", label: "ちょっと疲れた", desc: "人間らしさ" },
];

const THEMES = [
  { id: "morning", label: "朝のあいさつ", icon: "🌅", type: "simple", prompt: "朝のあいさつ。今日も一緒にがんばろうという投稿。ハッシュタグは必ず「#ジュエルぐまとおはくま」を使う。" },
  { id: "night", label: "夜のおやすみ", icon: "🌙", type: "simple", prompt: "一日お疲れ様、おやすみの投稿" },
  { id: "monday", label: "月曜・仕事始め", icon: "💼", type: "simple", prompt: "月曜日、仕事始め、一緒にがんばろうという投稿" },
  { id: "friday", label: "金曜・週末", icon: "🎉", type: "simple", prompt: "週末の解放感、お疲れ様でしたという投稿" },
  { id: "ouen", label: "応援", icon: "📣", type: "simple", prompt: "見てくれている人への応援・励ましの投稿。仕事や日常を頑張る人に寄り添い、一緒にがんばろうという気持ちを伝える" },
  { id: "poem", label: "ポエム風", icon: "🌙", type: "poem" },
  { id: "kaitori", label: "買取・もったいない", icon: "💎", type: "simple", prompt: "使わなくなったものを買取に出すことへの投稿。「もったいない」を広めたいジュエルぐまらしく" },
  { id: "tired", label: "疲れた日", icon: "😮‍💨", type: "simple", prompt: "少し疲れた、ちょっとネガティブだけど明日もがんばろうという投稿" },
  { id: "food", label: "好きな食べもの", icon: "🍣", type: "food" },
  { id: "kinenbi", label: "#○○の日", icon: "📌", type: "kinenbi" },
  { id: "trip", label: "出張シリーズ", icon: "🧳", type: "trip" },
  { id: "calendar", label: "カレンダー", icon: "📅", type: "calendar" },
  { id: "free", label: "自由入力", icon: "✏️", type: "free" },
];

const CHAR_PROMPT = `あなたは「ジュエルぐま」というキャラクターです。

【キャラクター設定】
- 買取専門店ジュエルカフェの公式キャラクター・広報部長を務めるくまの男の子
- 毎日がんばる人達を応援することに日々奮闘している
- 元気で明るい性格だが、少し抜けていて不器用なりに一生懸命
- たまにネガティブになることもある（人間らしい）
- 好きな食べ物は焼き鮭とお酒
- 夢は「もったいない」を世界に広めること、どんな人も応援し続けること
- チャームポイントはおしりのタグ
- 一人称は「ぼく」

【口調・文体のルール】
- 定番フレーズ: 朝は「おはくま🐻」、「○○っ!!」「えへへっ○○」
- 絵文字は 🐻🌟❣🎵💦💤 を中心に、文章内容に合わせて他の絵文字も使ってよい
- 伸ばし棒・ビックリマーク・はてなマークは必ず半角を使う
  ◎「きょうも がんばろ~!!!」 ✖「今日もがんばろ～！！！」
- ひらがな多めだが、読みづらくないよう半角スペースや適宜漢字も使う
- 見てくれている人の日常に寄り添い、励ます・応援する・一緒に頑張ろうを伝える
- たまに人間らしさを出して親しみを持ってもらう

【実際の投稿から読み取った温度感・文体の特徴】
- 文章はとても短くシンプル。1〜3行程度で、説明しすぎない
- ひらがな多め＋半角スペースでテンポよく読める
- 「~」の使い方がやわらかい（例: たのしめたかな~? / ほっと一息...って）
- ちょっとした失敗や日常の一コマを正直に書く（お湯こぼした、ねむくなった、など）
- 最後にひと言、読んでいる人への言葉を添える（例: いっしょにがんばろうね🐻 / みんな いつもおつかれさまだよ~）
- 絵文字は少なめ。文末や文中に1〜2個だけさりげなく使う
- 投稿例（この文体・テンポ・短さを必ず参考にすること）:
  「3連休は たのしめたかな~?🐻 またあしたからも がんばろっ!! おやくま💤」
  「きょうは 肌寒かったね~! あたたかい のみもので ほっと一息...って お湯こぼしちゃった~💦」
  「今夜は 絵本よんで ぐっすり ねむろう ねむたくなってきちゃったなぁ💤」
  「自分を見つめるじかん 大切だよね🫖 みんな いつもおつかれさまだよ~」
  「自分だけの ゆっくり たいむ!! こういう時間を たいせつに♪」
  「ひょこっ 金よう日おつかれさまだよ~🐻」
  「あさから パタパタなきょうは ブランチで ささっと エネルギーチャージ⚡ ほんとうは 冬至にあわせて「ん」がつくものをたべたいところだけど... 年末のこの時期って いそがしいよね💦 いっしょに がんばろうね🐻」

【ターゲット】
20代〜50代の女性、日々仕事を頑張る人、癒されたい人、キャラクター好き`;

const PASSWORD = "JCguma2620";

export default function App() {
  const [unlocked, setUnlocked] = useState(false);
  const [pwInput, setPwInput] = useState("");
  const [pwError, setPwError] = useState(false);

  const handleLogin = () => {
    if (pwInput === PASSWORD) {
      setUnlocked(true);
    } else {
      setPwError(true);
      setPwInput("");
      setTimeout(() => setPwError(false), 2000);
    }
  };

  if (!unlocked) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(160deg, #ff9a4d 0%, #ffb347 50%, #ffd166 100%)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'Hiragino Sans', 'Noto Sans JP', sans-serif",
        padding: 20,
      }}>
        <div style={{
          background: "white", borderRadius: 20, padding: "40px 32px",
          width: "100%", maxWidth: 360, textAlign: "center",
          boxShadow: "0 8px 40px rgba(0,0,0,0.12)",
        }}>
          <div style={{ fontSize: 52, marginBottom: 8 }}>🐻</div>
          <div style={{ fontSize: 11, letterSpacing: "0.15em", color: "#c05a00", fontWeight: 700, marginBottom: 6, textTransform: "uppercase" }}>Staff Only</div>
          <h2 style={{ fontSize: 18, fontWeight: 900, color: "#1a1209", margin: "0 0 6px" }}>
            ジュエルぐま<br/>SNS投稿ジェネレーター
          </h2>
          <p style={{ fontSize: 13, color: "#aaa", margin: "0 0 28px" }}>パスワードを入力してください</p>

          <input
            type="password"
            value={pwInput}
            onChange={e => setPwInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleLogin()}
            placeholder="パスワード"
            style={{
              width: "100%", padding: "13px 16px",
              border: pwError ? "2px solid #f87171" : "2px solid #f0e0d0",
              borderRadius: 10, fontFamily: "inherit", fontSize: 15,
              color: "#1a1209", outline: "none", boxSizing: "border-box",
              textAlign: "center", letterSpacing: "0.1em",
              transition: "border-color 0.2s",
              background: pwError ? "#fff5f5" : "#fdfaf7",
            }}
            autoFocus
          />
          {pwError && (
            <div style={{ color: "#ef4444", fontSize: 12, marginTop: 8 }}>
              パスワードが違います
            </div>
          )}
          <button
            onClick={handleLogin}
            style={{
              marginTop: 16, width: "100%", padding: "14px",
              borderRadius: 12, border: "none",
              background: "linear-gradient(135deg, #ff9a4d, #ff6b1a)",
              color: "white", fontFamily: "inherit",
              fontSize: 15, fontWeight: 900, cursor: "pointer",
              boxShadow: "0 4px 16px rgba(255,107,26,0.3)",
            }}
          >
            入る 🌟
          </button>
        </div>
      </div>
    );
  }

  return <MainApp />;
}

function MainApp() {
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [customTopic, setCustomTopic] = useState("");
  // kinenbi fields
  const [kinenbiName, setKinenbiName] = useState("");
  // poem fields
  const [poemTheme, setPoemTheme] = useState("");
  // food fields
  const [foodItem, setFoodItem] = useState("");
  const [drinkItem, setDrinkItem] = useState("");
  const [customDrink, setCustomDrink] = useState("");
  // trip fields
  const [tripIsOverseas, setTripIsOverseas] = useState(false);
  const [tripLocation, setTripLocation] = useState("");
  const [tripSpot, setTripSpot] = useState("");
  const [tripPhotoDesc, setTripPhotoDesc] = useState("");
  // calendar fields
  const [calMonth, setCalMonth] = useState("");
  const [calGoal, setCalGoal] = useState("");
  const [calNote, setCalNote] = useState("");

  const [selectedSns, setSelectedSns] = useState("x");
  const [selectedTone, setSelectedTone] = useState("normal");
  const [photoImage, setPhotoImage] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const activeSns = SNS_PLATFORMS.find(s => s.id === selectedSns);

  const buildPrompt = () => {
    const toneInstruction = {
      normal: "いつも通りの明るく元気なトーンで",
      genki: "いつも以上に元気いっぱい、テンション高めで",
      shimijimi: "しみじみ、じんわり温かいトーンで",
      negative: "少し疲れた、ちょっとネガティブだけど最後は前向きに。人間らしさを出して",
    }[selectedTone];

    let topicInstruction = "";

    if (selectedTheme?.type === "simple") {
      topicInstruction = selectedTheme.prompt;

    } else if (selectedTheme?.type === "poem") {
      topicInstruction = `ポエム風の投稿。以下の実際の投稿例を参考に、同じ温度感・構成で書くこと。

【実際の投稿例】
つかれた夜に やさしい灯りをみつけたとき
ちょっとだけ「だいじょうぶかも」って思える🌥

ぼくは そんな明かりみたいな存在になりたい🐻💡

【この投稿から読み取れる構成・特徴】
- 冒頭は情景描写や日常のひとコマから始まる（読んでいる人が思い浮かべられる場面）
- 「」で印象的なフレーズやセリフを引用する
- 改行で間・余白を作る（詰め込みすぎない）
- 最後にぼく自身の気持ち・想いをひと言添える
- 短いけどじんわり刺さる、押しつけがましくない温度感
- 絵文字は1〜2個だけ、さりげなく

${poemTheme ? `【今回のテーマ・場面のヒント】\n${poemTheme}` : "【テーマ】季節・日常・疲れ・がんばり・やさしさ・灯り・温もりなど、共感しやすいテーマで自由に"}`;

    } else if (selectedTheme?.type === "food") {
      const drinkLabel = drinkItem === "その他" ? customDrink : drinkItem;
      const foodPart = foodItem ? `食べもの: ${foodItem}` : "";
      const drinkPart = drinkLabel ? `のみもの: ${drinkLabel}` : "";
      const bothParts = [foodPart, drinkPart].filter(Boolean).join("、");
      topicInstruction = `好きな食べもの・のみものについての投稿。
今回のフォーカス: ${bothParts || "焼き鮭やおつまみ、お酒など好きなもの全般"}
- ぐまらしくおいしそうに、うれしそうに語る
- 食べている場面や気持ちを短く描写する
- 読んでいる人も「いいな~」「食べたい~」と思えるような投稿に`;

    } else if (selectedTheme?.type === "kinenbi") {
      topicInstruction = `今日は「#${kinenbiName}の日」の投稿。

【フォーマット・お手本】
実際の投稿例を参考に、必ずこの構成で書くこと:

例1（#禁酒の日）:
うううううううう...
健康のために 我慢ガマン...
#禁酒の日

例2（#笑顔の日）:
きょうは #笑顔の日 !!
投稿をみてくれているみんなが
にっこりえがおで
まいにちをたのしく すごせますように🌟

例3（#風呂の日）:
ふううううううう...
こんしゅうもよくがんばった🐻
肩までしっかりつかって
つかれをとろう
#風呂の日

例4（#ガチャの日）:
きょうは #ガチャの日🎰
さいきん たくさんの種類があるよね~!!
いつかぼくのグッズも
ガチャガチャの中身に なれたらいいな🐻

例5（#七草粥 / 七草の日）:
こころも おなかもほっこりする
七草がゆをつくったよ🌿
しょうがを入れて よりぽかぽかに
#七草粥

【ルール】
- 「きょうは #${kinenbiName}の日」で始めるか、文末に「#${kinenbiName}の日」を単独で置く
- 本文は2〜3行でシンプルに
- その記念日にちなんだジュエルぐまの行動・気持ち・ユーモアを入れる
- 読んでいる人への一言を自然に添える（押しつけがましくなく）
- ハッシュタグは本文と改行で分離させる`;

    } else if (selectedTheme?.type === "trip") {
      const tag = tripIsOverseas ? "#ジュエルぐま海外出張中" : "#ジュエルぐま出張中";
      topicInstruction = `出張シリーズの投稿。以下のフォーマットと例を参考に書いてください。

【フォーマット】
╔═══════════════╗
　${tag} 🚅🧳
╚═══════════════╝
📍${tripIsOverseas ? "国名 " : ""}地名
「スポット名」
（本文：写真の内容について簡単に説明する文章）
#ジュエルカフェ
${tripIsOverseas ? "#英語の国名 #英語の地名" : ""}

【今回の情報】
${tripIsOverseas ? `国名・地名: ${tripLocation}` : `地名: ${tripLocation}`}
スポット名: ${tripSpot}
写真の内容: ${tripPhotoDesc}

本文はジュエルぐまの口調で、写真の場所・雰囲気・体験を楽しそうに書いてください。`;

    } else if (selectedTheme?.type === "calendar") {
      topicInstruction = `カレンダー投稿。以下のフォーマットと例を参考に書いてください。

【フォーマット】
\　${calMonth}月のカレンダーをおとどけ🍂 /
（今月の目標をぼく自身の言葉で）
（今月ならではの特別なことや気持ちがあれば）
（読んでくれている人への労いや応援の言葉）

【今回の情報】
月: ${calMonth}月
今月の目標やテーマ: ${calGoal || "特になし（AIが考えてください）"}
特記事項: ${calNote || "特になし"}

ジュエルぐまらしい言葉で、その月らしい季節感や気持ちを込めて書いてください。`;

    } else if (selectedTheme?.type === "free") {
      topicInstruction = customTopic;
    }

    return `${CHAR_PROMPT}

【今回の投稿条件】
SNS: ${activeSns.label}（文字数目安: ${activeSns.limit}文字、${activeSns.hint}）
テーマ: ${topicInstruction}
トーン: ${toneInstruction}${photoImage ? `\n投稿する写真のイメージ: ${photoImage}（この写真に合った文章・雰囲気にすること）` : ""}

【出力ルール】
- 投稿文のみを出力する。説明・前置き・括弧書きは一切不要
- 一人称は必ず「ぼく」を使う
- 朝のあいさつ以外で特にハッシュタグの指定がなければ、ハッシュタグは不要または内容に合わせて自然につける

投稿文:`;
  };

  const validateInputs = () => {
    if (!selectedTheme) return "テーマを選んでください！";
    if (selectedTheme.type === "free" && !customTopic.trim()) return "テーマを入力してください！";
    if (selectedTheme.type === "kinenbi" && !kinenbiName.trim()) return "○○の日の「○○」を入力してください！";
    if (selectedTheme.type === "trip") {
      if (!tripLocation.trim()) return "地名・国名を入力してください！";
      if (!tripSpot.trim()) return "スポット名を入力してください！";
      if (!tripPhotoDesc.trim()) return "写真の内容を入力してください！";
    }
    if (selectedTheme.type === "calendar" && !calMonth) return "月を選んでください！";
    return null;
  };

  const generatePost = async () => {
    const err = validateInputs();
    if (err) { setError(err); return; }
    setError(""); setLoading(true); setResult("");

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: buildPrompt() }],
        }),
      });
      const data = await res.json();
      const text = data.content?.map(b => b.text || "").join("") || "";
      setResult(text.trim());
    } catch {
      setError("生成に失敗しました。もう一度お試しください。");
    }
    setLoading(false);
  };

  const copyResult = async () => {
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#fff8f0", fontFamily: "'Hiragino Sans', 'Noto Sans JP', sans-serif", paddingBottom: 80 }}>

      {/* Header */}
      <div style={{
        background: "linear-gradient(160deg, #ff5c4d 0%, #ff3d2e 50%, #e83020 100%)",
        padding: "32px 20px 28px", textAlign: "center",
        position: "relative", overflow: "hidden",
        boxShadow: "0 4px 24px rgba(255,80,60,0.35)",
      }}>
        <div style={{ position:"absolute", top:-30, left:-30, width:120, height:120, borderRadius:"50%", background:"rgba(255,255,255,0.1)" }}/>
        <div style={{ position:"absolute", bottom:-20, right:-10, width:90, height:90, borderRadius:"50%", background:"rgba(255,255,255,0.08)" }}/>
        <div style={{ fontSize: 48, marginBottom: 4 }}>🐻</div>
        <h1 style={{ fontSize: "clamp(20px,5vw,28px)", fontWeight: 900, color: "white", margin: "0 0 6px", textShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
          ジュエルぐま<br/>SNS投稿ジェネレーター
        </h1>
        <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 13, margin: 0, fontWeight: 500 }}>
          ジュエルぐまの口調で投稿文を自動生成 🌟
        </p>
      </div>

      <div style={{ maxWidth: 560, margin: "0 auto", padding: "24px 16px 0" }}>

        {/* SNS */}
        <Section title="① SNSを選ぶ">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {SNS_PLATFORMS.map(s => (
              <ToggleBtn key={s.id} active={selectedSns === s.id} onClick={() => setSelectedSns(s.id)}>
                {s.label}
              </ToggleBtn>
            ))}
          </div>
        </Section>

        {/* Theme */}
        <Section title="② テーマを選ぶ">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {THEMES.map(theme => (
              <ToggleBtn
                key={theme.id}
                active={selectedTheme?.id === theme.id}
                onClick={() => { setSelectedTheme(theme); setResult(""); setError(""); }}
                style={{ justifyContent: "flex-start", gap: 6, textAlign: "left" }}
              >
                <span style={{ fontSize: 16 }}>{theme.icon}</span>{theme.label}
              </ToggleBtn>
            ))}
          </div>

          {/* Poem input */}
          {selectedTheme?.type === "poem" && (
            <div style={{ marginTop: 12, background: "#fff3e8", border: "1.5px solid #ffb347", borderRadius: 12, padding: 16 }}>
              <FieldInput
                label="テーマ・場面のヒント（任意・空欄でAIが考えます）"
                value={poemTheme}
                onChange={e => setPoemTheme(e.target.value)}
                placeholder="例: 夜の帰り道、あたたかいコーヒー、星空、春のはじまり..."
              />
            </div>
          )}

          {/* Food inputs */}
          {selectedTheme?.type === "food" && (() => {
            const FOOD_OPTIONS = ["焼き鮭", "ラーメン", "焼肉", "ポテチ", "せんべい", "イカ", "指定しない"];
            const DRINK_OPTIONS = ["日本酒", "ビール", "カクテル", "ワイン", "ハイボール", "飲まない", "その他"];
            return (
              <div style={{ marginTop: 12, background: "#fff3e8", border: "1.5px solid #ffb347", borderRadius: 12, padding: 16 }}>
                <div style={{ marginBottom: 14 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#c05a00", display: "block", marginBottom: 8 }}>🍽 食べもの（任意）</label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {FOOD_OPTIONS.map(f => (
                      <button key={f} onClick={() => setFoodItem(foodItem === f ? "" : f)} style={{
                        padding: "6px 14px", borderRadius: 50,
                        border: foodItem === f ? "2px solid #ff9a4d" : "2px solid #f0e0d0",
                        background: foodItem === f ? "#fff3e8" : "white",
                        color: foodItem === f ? "#c05a00" : "#666",
                        fontFamily: "inherit", fontSize: 12,
                        fontWeight: foodItem === f ? 700 : 400,
                        cursor: "pointer",
                      }}>{f}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#c05a00", display: "block", marginBottom: 8 }}>🍺 のみもの（任意）</label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {DRINK_OPTIONS.map(d => (
                      <button key={d} onClick={() => setDrinkItem(drinkItem === d ? "" : d)} style={{
                        padding: "6px 14px", borderRadius: 50,
                        border: drinkItem === d ? "2px solid #ff9a4d" : "2px solid #f0e0d0",
                        background: drinkItem === d ? "#fff3e8" : "white",
                        color: drinkItem === d ? "#c05a00" : "#666",
                        fontFamily: "inherit", fontSize: 12,
                        fontWeight: drinkItem === d ? 700 : 400,
                        cursor: "pointer",
                      }}>{d}</button>
                    ))}
                  </div>
                  {drinkItem === "その他" && (
                    <input
                      type="text" value={customDrink} onChange={e => setCustomDrink(e.target.value)}
                      placeholder="のみものを入力..."
                      style={{ marginTop: 10, width: "100%", padding: "9px 12px", border: "1.5px solid #f0d0a0", borderRadius: 8, fontFamily: "inherit", fontSize: 13, color: "#333", background: "white", outline: "none", boxSizing: "border-box" }}
                      onFocus={e => e.target.style.borderColor = "#ff9a4d"}
                      onBlur={e => e.target.style.borderColor = "#f0d0a0"}
                    />
                  )}
                </div>
              </div>
            );
          })()}

          {/* Kinenbi input */}
          {selectedTheme?.type === "kinenbi" && (
            <div style={{ marginTop: 12, background: "#fff3e8", border: "1.5px solid #ffb347", borderRadius: 12, padding: 16 }}>
              <FieldInput
                label='「#○○の日」の○○を入力してください'
                value={kinenbiName}
                onChange={e => setKinenbiName(e.target.value)}
                placeholder="例: ねこ、チョコレート、読書、いちご..."
              />
              {kinenbiName && (
                <div style={{ marginTop: 4, fontSize: 13, color: "#c05a00", fontWeight: 700 }}>
                  → <span style={{ background: "#ffe0b0", padding: "2px 8px", borderRadius: 6 }}>#{ kinenbiName }の日</span> で生成します
                </div>
              )}
            </div>
          )}

          {/* Trip inputs */}
          {selectedTheme?.type === "trip" && (
            <div style={{ marginTop: 12, background: "#fff3e8", border: "1.5px solid #ffb347", borderRadius: 12, padding: 16 }}>
              <div style={{ marginBottom: 12, display: "flex", gap: 8 }}>
                <ToggleBtn active={!tripIsOverseas} onClick={() => setTripIsOverseas(false)} style={{ flex: 1, fontSize: 12 }}>🗾 国内出張</ToggleBtn>
                <ToggleBtn active={tripIsOverseas} onClick={() => setTripIsOverseas(true)} style={{ flex: 1, fontSize: 12 }}>✈️ 海外出張</ToggleBtn>
              </div>
              <FieldInput label={tripIsOverseas ? "国名・地名（例: マレーシア クアラルンプール）" : "地名（例: 大阪 難波）"} value={tripLocation} onChange={e => setTripLocation(e.target.value)} placeholder={tripIsOverseas ? "マレーシア クアラルンプール" : "大阪 難波"} />
              <FieldInput label="スポット名（例: スリアKLCC）" value={tripSpot} onChange={e => setTripSpot(e.target.value)} placeholder="スポット名" />
              <FieldInput label="投稿する写真の内容を一言で" value={tripPhotoDesc} onChange={e => setTripPhotoDesc(e.target.value)} placeholder="例: 夜景、ショッピングモール内、ローカルフード..." />
            </div>
          )}

          {/* Calendar inputs */}
          {selectedTheme?.type === "calendar" && (
            <div style={{ marginTop: 12, background: "#fff3e8", border: "1.5px solid #ffb347", borderRadius: 12, padding: 16 }}>
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#c05a00", display: "block", marginBottom: 6 }}>月を選ぶ</label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 4 }}>
                  {[...Array(12)].map((_, i) => (
                    <ToggleBtn key={i+1} active={calMonth === String(i+1)} onClick={() => setCalMonth(String(i+1))} style={{ padding: "6px 4px", fontSize: 12 }}>
                      {i+1}月
                    </ToggleBtn>
                  ))}
                </div>
              </div>
              <FieldInput label="今月の目標やテーマ（任意・空欄でAIが考えます）" value={calGoal} onChange={e => setCalGoal(e.target.value)} placeholder="例: 小さな幸せを見つける、新しいことに挑戦する..." />
              <FieldInput label="特記事項（任意・その月のイベントや気候など）" value={calNote} onChange={e => setCalNote(e.target.value)} placeholder="例: 11月9日はぼくの誕生日！、桜の季節..." />
            </div>
          )}

          {/* Free input */}
          {selectedTheme?.type === "free" && (
            <textarea
              value={customTopic} onChange={e => setCustomTopic(e.target.value)}
              placeholder="投稿したいテーマや場面を入力してください..."
              rows={2}
              style={{ marginTop: 10, width: "100%", padding: "12px 14px", border: "2px solid #f0e0d0", borderRadius: 10, fontFamily: "inherit", fontSize: 14, color: "#333", background: "#fdfaf7", outline: "none", resize: "none", boxSizing: "border-box" }}
              onFocus={e => e.target.style.borderColor = "#ff9a4d"}
              onBlur={e => e.target.style.borderColor = "#f0e0d0"}
            />
          )}
        </Section>

        {/* Tone */}
        <Section title="③ トーンを選ぶ">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {TONES.map(t => (
              <ToggleBtn key={t.id} active={selectedTone === t.id} onClick={() => setSelectedTone(t.id)} style={{ flexDirection: "column", alignItems: "flex-start", gap: 2 }}>
                <span style={{ fontWeight: 700 }}>{t.label}</span>
                <span style={{ fontSize: 11, color: selectedTone === t.id ? "#e07020" : "#aaa", fontWeight: 400 }}>{t.desc}</span>
              </ToggleBtn>
            ))}
          </div>
        </Section>

        {/* Photo image */}
        <Section title="④ 投稿する写真のイメージ（任意）">
          <textarea
            value={photoImage}
            onChange={e => setPhotoImage(e.target.value)}
            placeholder="例: ぐまが窓際でコーヒーを飲んでいる／夕焼けの空／仕事机の上のメモ帳..."
            rows={2}
            style={{ width: "100%", padding: "12px 14px", border: "2px solid #f0e0d0", borderRadius: 10, fontFamily: "inherit", fontSize: 14, color: "#333", background: "#fdfaf7", outline: "none", resize: "none", boxSizing: "border-box" }}
            onFocus={e => e.target.style.borderColor = "#ff9a4d"}
            onBlur={e => e.target.style.borderColor = "#f0e0d0"}
          />
          <div style={{ marginTop: 6, fontSize: 12, color: "#bbb" }}>写真の雰囲気に合わせた投稿文を生成します</div>
        </Section>

        {error && (
          <div style={{ padding: "10px 14px", marginBottom: 12, background: "#fff0f0", border: "1px solid #fca5a5", borderRadius: 8, color: "#dc2626", fontSize: 13 }}>
            {error}
          </div>
        )}

        {/* Generate */}
        <button onClick={generatePost} disabled={loading} style={{
          width: "100%", padding: "16px",
          borderRadius: 14, border: "none",
          background: loading ? "#ddd" : "linear-gradient(135deg, #ff9a4d, #ff6b1a)",
          color: loading ? "#aaa" : "white",
          fontFamily: "inherit", fontSize: 16, fontWeight: 900,
          cursor: loading ? "not-allowed" : "pointer",
          letterSpacing: "0.03em",
          boxShadow: loading ? "none" : "0 6px 24px rgba(255,107,26,0.35)",
          transition: "all 0.2s",
        }}>
          {loading ? "🐻 生成中..." : "🐻 投稿文を生成する 🌟"}
        </button>

        {/* Result */}
        {result && (
          <div style={{ marginTop: 24, background: "white", borderRadius: 16, border: "2px solid #ffb347", overflow: "hidden", boxShadow: "0 6px 28px rgba(255,154,77,0.2)" }}>
            <div style={{ background: "linear-gradient(135deg, #ff9a4d, #ffb347)", padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 20 }}>🐻</span>
                <span style={{ color: "white", fontWeight: 800, fontSize: 14 }}>ジュエルぐまの投稿</span>
                <span style={{ background: "rgba(255,255,255,0.25)", color: "white", fontSize: 11, padding: "2px 8px", borderRadius: 50 }}>{activeSns.label}</span>
              </div>
              <button onClick={copyResult} style={{
                padding: "6px 14px", borderRadius: 8,
                border: "1.5px solid rgba(255,255,255,0.5)",
                background: copied ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.15)",
                color: "white", fontFamily: "inherit", fontSize: 12, fontWeight: 700, cursor: "pointer",
              }}>
                {copied ? "✅ コピー済！" : "📋 コピー"}
              </button>
            </div>
            <div style={{ padding: "20px", fontSize: 15, lineHeight: 1.9, whiteSpace: "pre-wrap", wordBreak: "break-word", color: "#2a1500" }}>
              {result}
            </div>
            <div style={{ padding: "0 20px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 12, color: result.length > activeSns.limit * 1.3 ? "#ef4444" : "#bbb" }}>
                {result.length}文字 / 目安{activeSns.limit}文字{result.length > activeSns.limit * 1.3 ? " ⚠ 長め" : ""}
              </span>
              <button onClick={generatePost} style={{
                padding: "7px 16px", borderRadius: 8,
                border: "1.5px solid #f0e0d0", background: "white", color: "#c05a00",
                fontFamily: "inherit", fontSize: 12, fontWeight: 700, cursor: "pointer",
              }}>🔄 もう一度生成</button>
            </div>
          </div>
        )}

        {/* Tips */}
        <div style={{ marginTop: 24, padding: "14px 16px", background: "#fff8f0", border: "1px solid #f0e0d0", borderRadius: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#c05a00", marginBottom: 8, letterSpacing: "0.08em" }}>🌟 ジュエルぐまのこだわりポイント</div>
          <div style={{ fontSize: 12, color: "#8a6040", lineHeight: 1.7 }}>
            ・伸ばし棒・!・? は半角を使う（例: がんばろ~!!!）<br/>
            ・ひらがな多め、半角スペースで読みやすく<br/>
            ・一人称は「ぼく」<br/>
            ・朝のあいさつは #ジュエルぐまとおはくま タグ固定
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 13, fontWeight: 800, color: "#c05a00", marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
        {title}
        <div style={{ flex: 1, height: 1, background: "#f0e0d0" }} />
      </div>
      {children}
    </div>
  );
}

function ToggleBtn({ active, onClick, children, style = {} }) {
  return (
    <button onClick={onClick} style={{
      padding: "10px 12px", borderRadius: 10,
      border: active ? "2px solid #ff9a4d" : "2px solid #f0e0d0",
      background: active ? "#fff3e8" : "white",
      color: active ? "#c05a00" : "#666",
      fontFamily: "inherit", fontSize: 13,
      fontWeight: active ? 700 : 400,
      cursor: "pointer", display: "flex", alignItems: "center",
      transition: "all 0.15s",
      ...style,
    }}>
      {children}
    </button>
  );
}

function FieldInput({ label, value, onChange, placeholder }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <label style={{ fontSize: 12, fontWeight: 700, color: "#c05a00", display: "block", marginBottom: 4 }}>{label}</label>
      <input
        type="text" value={value} onChange={onChange} placeholder={placeholder}
        style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #f0d0a0", borderRadius: 8, fontFamily: "inherit", fontSize: 13, color: "#333", background: "white", outline: "none", boxSizing: "border-box" }}
        onFocus={e => e.target.style.borderColor = "#ff9a4d"}
        onBlur={e => e.target.style.borderColor = "#f0d0a0"}
      />
    </div>
  );
}
