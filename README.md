# ✦ タロット占い 天星鑑定

Next.js + Supabase + Stripe + Vercel による本格タロット占いWebサービス

---

## ファイル構成

```
tarot-next4/
├── src/
│   ├── app/
│   │   ├── layout.tsx              ← 共通レイアウト
│   │   ├── page.tsx                ← / → /login へリダイレクト
│   │   ├── login/page.tsx          ← ログインページ
│   │   ├── pricing/page.tsx        ← 料金プランページ
│   │   ├── tokusho/page.tsx        ← 特定商取引法ページ
│   │   ├── app/page.tsx            ← タロット占いアプリ本体
│   │   └── api/
│   │       ├── auth/callback/      ← 認証コールバック
│   │       ├── auth/init/          ← ユーザー初期化
│   │       ├── checkout/           ← Stripe決済
│   │       ├── webhook/            ← Stripe Webhook
│   │       ├── history/            ← 鑑定履歴
│   │       ├── ai-reading/         ← AI鑑定プロキシ
│   │       └── billing-portal/     ← Stripeポータル
│   └── lib/
│       ├── supabase-server.ts
│       ├── supabase-admin.ts
│       └── stripe.ts
├── public/
│   └── tarot-app.html             ← タロットアプリ本体
├── supabase-setup.sql             ← SupabaseのSQL（一度だけ実行）
├── package.json
├── tsconfig.json
├── next.config.js
└── .env.example                   ← 環境変数テンプレート
```

---

## デプロイ手順

### STEP 1 — Supabase セットアップ
1. https://supabase.com でプロジェクト作成
2. SQL Editor で `supabase-setup.sql` を実行
3. Settings → API Keys から以下をコピー：
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - Publishable key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Secret key → `SUPABASE_SERVICE_ROLE_KEY`

### STEP 2 — Stripe セットアップ
1. https://dashboard.stripe.com で商品を2つ作成：
   - 買い切りプラン（¥2,500・一回限り）→ `STRIPE_PRICE_ONETIME`
   - 月額プラン（¥980・毎月）→ `STRIPE_PRICE_SUBSCRIPTION`
2. APIキーをコピー → `STRIPE_SECRET_KEY`

### STEP 3 — GitHub にアップロード
```bash
git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/あなたのID/tarot-next.git
git branch -M main
git push -u origin main
```

### STEP 4 — Vercel にデプロイ
1. https://vercel.com でリポジトリをインポート
2. 環境変数を設定（.env.example を参照）
3. Deploy をクリック

### STEP 5 — Stripe Webhook 登録
1. Stripe → 開発者 → Webhook → エンドポイントを追加
2. URL: `https://あなたのURL.vercel.app/api/webhook`
3. イベント選択：
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. 署名シークレット → `STRIPE_WEBHOOK_SECRET`

### STEP 6 — Supabase URL 更新
- Authentication → URL Configuration
- Site URL: `https://あなたのURL.vercel.app`
- Redirect URLs: `https://あなたのURL.vercel.app/login`

### STEP 7 — テスト決済
テストカード: `4242 4242 4242 4242`（有効期限・CVC は任意）

---

## 環境変数一覧

| 変数名 | 説明 |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | SupabaseのProject URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | SupabaseのPublishable key |
| `SUPABASE_SERVICE_ROLE_KEY` | SupabaseのSecret key |
| `STRIPE_SECRET_KEY` | Stripeのシークレットキー |
| `STRIPE_WEBHOOK_SECRET` | StripeのWebhook署名シークレット |
| `STRIPE_PRICE_ONETIME` | 買い切りプランの価格ID |
| `STRIPE_PRICE_SUBSCRIPTION` | 月額プランの価格ID |
| `NEXT_PUBLIC_SITE_URL` | デプロイ後のVercel URL |

---

## 費用

| サービス | 費用 |
|---|---|
| Supabase | 無料 |
| Vercel | 無料 |
| GitHub | 無料 |
| Stripe | 売上の3.6%のみ |

**初期費用ゼロで公開できます！**

---

## 運営者情報

運営：美好蘭  
メール：ran-miyoshi@outlook.jp
