# ✦ タロット占い Webサービス（Next.js版）

四柱推命と同じ構成：**Next.js + Supabase + Stripe + Vercel**

---

## ファイル構成

```
tarot-next/
├── src/app/
│   ├── layout.tsx              ← 共通レイアウト
│   ├── page.tsx                ← / → /login へリダイレクト
│   ├── login/page.tsx          ← ログインページ（マジックリンク認証）
│   ├── pricing/page.tsx        ← 料金プランページ
│   ├── tokusho/page.tsx        ← 特定商取引法ページ
│   ├── app/
│   │   ├── page.tsx            ← 認証チェック（サーバー側）
│   │   └── TarotApp.tsx        ← タロット占いアプリ本体
│   └── api/
│       ├── auth/callback/      ← Supabase認証コールバック
│       ├── checkout/           ← Stripe決済セッション作成
│       ├── webhook/            ← Stripe Webhook受信
│       ├── history/            ← 鑑定履歴CRUD
│       ├── ai-reading/         ← AI鑑定プロキシ
│       └── billing-portal/     ← Stripeカスタマーポータル
├── src/lib/
│   ├── supabase-browser.ts
│   ├── supabase-server.ts
│   ├── stripe.ts
│   └── access.ts
├── supabase-setup.sql          ← SupabaseのSQL（一度だけ実行）
└── .env.example
```

---

## STEP 1 — Supabase のセットアップ

1. https://supabase.com にアクセスし「**Start your project**」
2. GitHubアカウントでサインアップ
3. 「**New project**」→ プロジェクト名: `tarot-reading` / パスワード設定 / Region: `Northeast Asia (Tokyo)`
4. 作成完了後（約1分）、左メニュー「**SQL Editor**」を開く
5. `supabase-setup.sql` の内容をコピー＆ペーストして「**Run**」
6. 左メニュー「**Settings**」→「**API**」から以下をコピー：
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon / public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** → `SUPABASE_SERVICE_ROLE_KEY`

### メール認証の設定（マジックリンク）
- Supabase → **Authentication** → **URL Configuration**
- Site URL: `https://tarot-xxxxx.vercel.app`（Vercelデプロイ後に更新）
- Redirect URLs に追加: `https://tarot-xxxxx.vercel.app/api/auth/callback`

---

## STEP 2 — Stripe のセットアップ

1. https://dashboard.stripe.com でアカウント作成・本人確認
2. **商品カタログ** → 「＋作成」で2つの商品を作る：

**① 単発購入（2,500円）**
- 名前: `タロット占い 買い切りプラン`
- 価格: 一回限りの支払い / ¥2,500
- `price_xxx` を `STRIPE_PRICE_ONETIME` にコピー

**② 月額サブスクリプション**
- 名前: `タロット占い 月額プラン`
- 価格: 定期課金 / ¥980 / 毎月
- `price_xxx` を `STRIPE_PRICE_SUBSCRIPTION` にコピー

3. **設定** → **ビリング** → **カスタマーポータル** → 有効化

---

## STEP 3 — GitHub にアップロード

```bash
cd tarot-next
git init
git add .
git commit -m "initial commit"
# GitHubで新しいリポジトリ(tarot-next)を作成してから：
git remote add origin https://github.com/あなたのID/tarot-next.git
git branch -M main
git push -u origin main
```

---

## STEP 4 — Vercel にデプロイ

1. https://vercel.com → 「**Add New Project**」→ `tarot-next` を選択
2. 「**Environment Variables**」に以下を入力：

| Key | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | SupabaseのURL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabaseのanon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabaseのservice_role key |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_live_xxx` |
| `STRIPE_SECRET_KEY` | `sk_live_xxx` |
| `STRIPE_WEBHOOK_SECRET` | `whsec_xxx`（次のSTEPで取得） |
| `STRIPE_PRICE_ONETIME` | `price_xxx` |
| `STRIPE_PRICE_SUBSCRIPTION` | `price_xxx` |
| `NEXT_PUBLIC_SITE_URL` | `https://tarot-xxxxx.vercel.app` |

3. 「**Deploy**」→ 完了後にURLをメモ

---

## STEP 5 — Stripe Webhook を登録

1. Stripeダッシュボード → **開発者** → **Webhook** → **エンドポイントを追加**
2. URL: `https://tarot-xxxxx.vercel.app/api/webhook`
3. イベント選択:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. 署名シークレット（`whsec_xxx`）を Vercel の `STRIPE_WEBHOOK_SECRET` に設定して再デプロイ

---

## STEP 6 — Supabase の URL を本番に更新

1. Supabase → **Authentication** → **URL Configuration**
2. Site URL と Redirect URLs を実際の Vercel URL に更新

---

## STEP 7 — テスト決済

テストカード: `4242 4242 4242 4242`（有効期限・CVCは任意）

---

## 費用（最小構成）

| サービス | 費用 |
|---|---|
| Supabase | 無料 |
| Vercel | 無料 |
| GitHub | 無料 |
| Stripe | 売上の3.6%のみ（¥2,500なら約¥90） |

**初期費用ゼロで公開できます！**
