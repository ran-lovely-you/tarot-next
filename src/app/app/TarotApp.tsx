'use client'
import { useEffect } from 'react'

interface Props {
  userEmail: string
  accessType: string
  checkoutSuccess: boolean
}

export default function TarotApp({ userEmail, accessType, checkoutSuccess }: Props) {

  useEffect(() => {
    if (checkoutSuccess) {
      setTimeout(() => alert('✦ ご購入ありがとうございます！タロット鑑定をお楽しみください。'), 400)
    }
  }, [checkoutSuccess])

  async function doLogout() {
    const { createClient } = await import('@/lib/supabase-browser')
    const sb = createClient()
    await sb.auth.signOut()
    location.href = '/login'
  }

  async function openPortal() {
    const res = await fetch('/api/billing-portal', { method: 'POST' })
    const data = await res.json()
    if (data.url) location.href = data.url
    else alert(data.error || 'エラーが発生しました')
  }

  const planLabel = accessType === 'subscription' ? 'サブスク月額' : '買い切り'

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: "\n*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }\n\n:root {\n  --deep: #0e0a22;\n  --mid: #1a1035;\n  --purple: #6b3fa0;\n  --purple-light: #9b6fd4;\n  --gold: #d4af37;\n  --gold-light: #f0d060;\n  --moon: #f0eefc;\n  --text: #e8e4f8;\n  --muted: #9a94c0;\n  --card-back: #1d1540;\n  --card-border: #4a2e7a;\n}\n\nbody {\n  background: var(--deep);\n  color: var(--text);\n  font-family: 'Noto Serif JP', serif;\n  min-height: 100vh;\n  overflow-x: hidden;\n}\n\n/* ---- \u661f\u7a7a\u80cc\u666f ---- */\n#stars {\n  position: fixed;\n  inset: 0;\n  pointer-events: none;\n  z-index: 0;\n}\n\n/* ---- \u30ec\u30a4\u30a2\u30a6\u30c8 ---- */\n.wrap {\n  position: relative;\n  z-index: 1;\n  max-width: 860px;\n  margin: 0 auto;\n  padding: 0 20px 80px;\n}\n\nheader {\n  text-align: center;\n  padding: 50px 0 30px;\n}\n\n.title-en {\n  font-family: 'Cinzel Decorative', serif;\n  font-size: clamp(18px, 4vw, 30px);\n  letter-spacing: 0.12em;\n  color: var(--gold);\n  text-shadow: 0 0 20px rgba(212,175,55,0.4);\n}\n\n.title-ja {\n  font-size: 13px;\n  letter-spacing: 0.3em;\n  color: var(--muted);\n  margin-top: 6px;\n}\n\n.ornament {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  justify-content: center;\n  margin: 18px 0;\n  color: var(--gold);\n  opacity: 0.5;\n  font-size: 20px;\n}\n.ornament::before, .ornament::after {\n  content: '';\n  flex: 1;\n  max-width: 160px;\n  height: 1px;\n  background: linear-gradient(90deg, transparent, var(--gold), transparent);\n}\n\n/* ---- \u30bb\u30af\u30b7\u30e7\u30f3\u5171\u901a ---- */\nsection { margin-bottom: 40px; }\n.section-title {\n  font-size: 13px;\n  letter-spacing: 0.3em;\n  color: var(--gold);\n  text-align: center;\n  margin-bottom: 20px;\n}\n\n/* ---- \u30b9\u30d7\u30ec\u30c3\u30c9\u9078\u629e ---- */\n.spread-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));\n  gap: 12px;\n}\n\n.spread-btn {\n  background: rgba(26,16,53,0.7);\n  border: 1px solid var(--card-border);\n  border-radius: 12px;\n  padding: 20px 16px;\n  cursor: pointer;\n  transition: all 0.25s;\n  text-align: center;\n  color: var(--text);\n  font-family: 'Noto Serif JP', serif;\n}\n.spread-btn:hover {\n  border-color: var(--purple-light);\n  background: rgba(107,63,160,0.2);\n  transform: translateY(-2px);\n}\n.spread-btn.active {\n  border-color: var(--gold);\n  background: rgba(212,175,55,0.1);\n  box-shadow: 0 0 18px rgba(212,175,55,0.2);\n}\n.spread-btn .s-icon { font-size: 28px; margin-bottom: 8px; }\n.spread-btn .s-name { font-size: 15px; font-weight: 600; }\n.spread-btn .s-desc { font-size: 11px; color: var(--muted); margin-top: 4px; line-height: 1.5; }\n\n/* ---- \u30c8\u30d4\u30c3\u30af\u9078\u629e ---- */\n.topic-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));\n  gap: 10px;\n}\n.topic-chip {\n  background: rgba(26,16,53,0.7);\n  border: 1px solid var(--card-border);\n  border-radius: 10px;\n  padding: 14px 12px;\n  cursor: pointer;\n  transition: all 0.25s;\n  text-align: center;\n  color: var(--muted);\n  font-family: 'Noto Serif JP', serif;\n  font-size: 13px;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 6px;\n  user-select: none;\n}\n.topic-chip:hover {\n  border-color: var(--purple-light);\n  color: var(--text);\n}\n.topic-chip.selected {\n  border-color: var(--gold);\n  background: rgba(212,175,55,0.1);\n  color: var(--gold-light);\n  box-shadow: 0 0 14px rgba(212,175,55,0.15);\n}\n.topic-chip .t-icon { font-size: 22px; }\n.topic-hint {\n  text-align: center;\n  font-size: 11px;\n  color: var(--muted);\n  margin-top: 10px;\n  letter-spacing: 0.1em;\n}\n\n/* ---- \u8cea\u554f\u5165\u529b ---- */\n.q-wrap { position: relative; }\n.q-wrap textarea {\n  width: 100%;\n  min-height: 80px;\n  background: rgba(26,16,53,0.8);\n  border: 1px solid var(--card-border);\n  border-radius: 10px;\n  padding: 16px;\n  color: var(--text);\n  font-family: 'Noto Serif JP', serif;\n  font-size: 15px;\n  resize: none;\n  outline: none;\n  transition: border-color 0.2s;\n}\n.q-wrap textarea:focus { border-color: var(--purple-light); }\n.q-wrap textarea::placeholder { color: var(--muted); }\n\n/* ---- \u30b7\u30e3\u30c3\u30d5\u30eb\u30dc\u30bf\u30f3 ---- */\n.btn-primary {\n  display: block;\n  width: 100%;\n  max-width: 300px;\n  margin: 0 auto;\n  padding: 16px 32px;\n  background: linear-gradient(135deg, var(--purple) 0%, #4a2070 100%);\n  border: 1px solid var(--purple-light);\n  border-radius: 50px;\n  color: var(--moon);\n  font-family: 'Noto Serif JP', serif;\n  font-size: 16px;\n  font-weight: 600;\n  letter-spacing: 0.15em;\n  cursor: pointer;\n  transition: all 0.3s;\n  box-shadow: 0 4px 20px rgba(107,63,160,0.4);\n}\n.btn-primary:hover {\n  transform: translateY(-2px);\n  box-shadow: 0 8px 30px rgba(107,63,160,0.5);\n  background: linear-gradient(135deg, var(--purple-light) 0%, var(--purple) 100%);\n}\n.btn-primary:active { transform: scale(0.98); }\n.btn-primary:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }\n\n/* ---- \u30ab\u30fc\u30c9\u30a8\u30ea\u30a2 ---- */\n#card-area {\n  display: none;\n  margin-bottom: 40px;\n}\n\n.spread-label {\n  font-size: 12px;\n  letter-spacing: 0.2em;\n  color: var(--muted);\n  text-align: center;\n  margin-bottom: 24px;\n}\n\n.cards-row {\n  display: flex;\n  justify-content: center;\n  flex-wrap: wrap;\n  gap: 20px;\n}\n\n/* ---- \u30ab\u30fc\u30c9\u672c\u4f53 ---- */\n.card-slot {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 10px;\n}\n\n.card-pos-label {\n  font-size: 11px;\n  letter-spacing: 0.2em;\n  color: var(--gold);\n  opacity: 0.7;\n}\n\n.card {\n  width: 90px;\n  height: 154px;\n  perspective: 800px;\n  cursor: pointer;\n}\n.card-inner {\n  position: relative;\n  width: 100%;\n  height: 100%;\n  transform-style: preserve-3d;\n  transition: transform 0.65s cubic-bezier(0.4,0,0.2,1);\n  border-radius: 10px;\n}\n.card.flipped .card-inner { transform: rotateY(180deg); }\n\n.card-face {\n  position: absolute;\n  inset: 0;\n  border-radius: 10px;\n  backface-visibility: hidden;\n  -webkit-backface-visibility: hidden;\n  overflow: hidden;\n  border: 1.5px solid var(--card-border);\n}\n\n/* \u88cf\u9762 */\n.card-back-face {\n  background: var(--card-back);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.card-back-pattern {\n  width: 80%;\n  height: 86%;\n  border: 1px solid rgba(107,63,160,0.5);\n  border-radius: 6px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.card-back-pattern svg { width: 60%; height: 60%; opacity: 0.5; }\n\n/* \u8868\u9762 */\n.card-front-face {\n  transform: rotateY(180deg);\n  background: var(--mid);\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: space-between;\n  padding: 8px 6px;\n}\n.card-front-face.reversed { transform: rotateY(180deg) rotate(180deg); }\n\n.card-symbol {\n  font-size: 36px;\n  line-height: 1;\n  filter: drop-shadow(0 0 8px rgba(212,175,55,0.4));\n}\n.card-name {\n  font-size: 9px;\n  font-weight: 600;\n  letter-spacing: 0.08em;\n  color: var(--gold);\n  text-align: center;\n  line-height: 1.4;\n}\n.card-number {\n  font-size: 8px;\n  color: var(--muted);\n  font-family: 'Cinzel Decorative', serif;\n}\n.reversed-badge {\n  position: absolute;\n  bottom: 4px;\n  right: 4px;\n  font-size: 8px;\n  background: rgba(107,63,160,0.5);\n  color: var(--purple-light);\n  padding: 2px 5px;\n  border-radius: 4px;\n  letter-spacing: 0.05em;\n  display: none;\n}\n.card.flipped .reversed-badge { display: block; }\n\n/* ---- \u9451\u5b9a\u7d50\u679c ---- */\n#reading-area {\n  display: none;\n}\n\n.reading-card {\n  background: rgba(26,16,53,0.85);\n  border: 1px solid var(--card-border);\n  border-radius: 16px;\n  padding: 28px;\n  margin-bottom: 20px;\n  opacity: 0;\n  transform: translateY(16px);\n  transition: opacity 0.5s, transform 0.5s;\n}\n.reading-card.visible { opacity: 1; transform: translateY(0); }\n\n.reading-card-header {\n  display: flex;\n  align-items: center;\n  gap: 14px;\n  margin-bottom: 16px;\n  padding-bottom: 14px;\n  border-bottom: 1px solid rgba(107,63,160,0.3);\n}\n.reading-symbol { font-size: 32px; }\n.reading-meta {}\n.reading-position {\n  font-size: 11px;\n  letter-spacing: 0.25em;\n  color: var(--gold);\n  margin-bottom: 3px;\n}\n.reading-card-name {\n  font-size: 17px;\n  font-weight: 700;\n  color: var(--moon);\n}\n.reading-reversed {\n  font-size: 10px;\n  color: var(--purple-light);\n  letter-spacing: 0.1em;\n  margin-top: 2px;\n}\n\n.reading-text {\n  font-size: 14px;\n  line-height: 1.9;\n  color: var(--text);\n}\n\n.reading-overall {\n  background: linear-gradient(135deg, rgba(107,63,160,0.2), rgba(26,16,53,0.6));\n  border: 1px solid var(--gold);\n  border-radius: 16px;\n  padding: 28px;\n  margin-top: 10px;\n  opacity: 0;\n  transform: translateY(16px);\n  transition: opacity 0.5s, transform 0.5s;\n}\n.reading-overall.visible { opacity: 1; transform: translateY(0); }\n.reading-overall-title {\n  font-size: 12px;\n  letter-spacing: 0.3em;\n  color: var(--gold);\n  margin-bottom: 14px;\n}\n.reading-overall-text {\n  font-size: 15px;\n  line-height: 2;\n  color: var(--moon);\n}\n\n/* ---- \u3082\u3046\u4e00\u5ea6\u30dc\u30bf\u30f3 ---- */\n.btn-reset {\n  display: block;\n  width: 100%;\n  max-width: 260px;\n  margin: 30px auto 0;\n  padding: 14px 28px;\n  background: transparent;\n  border: 1px solid var(--muted);\n  border-radius: 50px;\n  color: var(--muted);\n  font-family: 'Noto Serif JP', serif;\n  font-size: 14px;\n  letter-spacing: 0.2em;\n  cursor: pointer;\n  transition: all 0.25s;\n}\n.btn-reset:hover { border-color: var(--text); color: var(--text); }\n\n/* ---- hint ---- */\n.hint {\n  text-align: center;\n  font-size: 12px;\n  color: var(--muted);\n  margin-top: 10px;\n  letter-spacing: 0.1em;\n}\n\n/* ---- loading ---- */\n.loading {\n  text-align: center;\n  padding: 40px;\n  color: var(--muted);\n  font-size: 14px;\n  letter-spacing: 0.2em;\n  display: none;\n}\n.loading span {\n  display: inline-block;\n  animation: pulse 1.4s infinite;\n}\n.loading span:nth-child(2) { animation-delay: 0.2s; }\n.loading span:nth-child(3) { animation-delay: 0.4s; }\n@keyframes pulse {\n  0%,100%{opacity:0.3} 50%{opacity:1}\n}\n\n/* ---- AI\u8a2d\u5b9a\u30d1\u30cd\u30eb ---- */\n.ai-panel {\n  background: rgba(26,16,53,0.7);\n  border: 1px solid var(--card-border);\n  border-radius: 12px;\n  padding: 18px 20px;\n}\n.ai-toggle-row {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 12px;\n  cursor: pointer;\n}\n.ai-toggle-label {\n  font-size: 14px;\n  font-weight: 600;\n  color: var(--text);\n}\n.ai-toggle-desc {\n  font-size: 11px;\n  color: var(--muted);\n  margin-top: 4px;\n  line-height: 1.6;\n}\n.switch {\n  position: relative;\n  width: 46px;\n  height: 24px;\n  flex-shrink: 0;\n}\n.switch input { opacity: 0; width: 0; height: 0; }\n.slider {\n  position: absolute;\n  cursor: pointer;\n  inset: 0;\n  background: rgba(154,148,192,0.25);\n  border-radius: 24px;\n  transition: 0.3s;\n}\n.slider::before {\n  content: '';\n  position: absolute;\n  width: 18px; height: 18px;\n  left: 3px; bottom: 3px;\n  background: var(--moon);\n  border-radius: 50%;\n  transition: 0.3s;\n}\ninput:checked + .slider { background: var(--purple); }\ninput:checked + .slider::before { transform: translateX(22px); background: var(--gold-light); }\n\n.ai-key-row {\n  margin-top: 14px;\n  display: none;\n}\n.ai-key-row.show { display: block; }\n.ai-key-row input[type=\"password\"], .ai-key-row input[type=\"text\"] {\n  width: 100%;\n  background: rgba(14,10,34,0.7);\n  border: 1px solid var(--card-border);\n  border-radius: 8px;\n  padding: 10px 12px;\n  color: var(--text);\n  font-family: 'Noto Serif JP', serif;\n  font-size: 13px;\n  outline: none;\n}\n.ai-key-row input:focus { border-color: var(--purple-light); }\n.ai-key-note {\n  font-size: 10.5px;\n  color: var(--muted);\n  margin-top: 8px;\n  line-height: 1.7;\n}\n.ai-key-note a { color: var(--purple-light); }\n\n/* ---- \u5c65\u6b74 ---- */\n.history-toggle-btn {\n  display: block;\n  width: 100%;\n  max-width: 260px;\n  margin: 10px auto 0;\n  padding: 12px 24px;\n  background: transparent;\n  border: 1px solid var(--card-border);\n  border-radius: 50px;\n  color: var(--muted);\n  font-family: 'Noto Serif JP', serif;\n  font-size: 13px;\n  letter-spacing: 0.2em;\n  cursor: pointer;\n  transition: all 0.25s;\n}\n.history-toggle-btn:hover { border-color: var(--purple-light); color: var(--text); }\n\n#history-area { display: none; }\n\n.history-item {\n  background: rgba(26,16,53,0.7);\n  border: 1px solid var(--card-border);\n  border-radius: 12px;\n  padding: 16px 18px;\n  margin-bottom: 12px;\n  cursor: pointer;\n  transition: all 0.2s;\n}\n.history-item:hover { border-color: var(--purple-light); }\n.history-item-top {\n  display: flex;\n  justify-content: space-between;\n  align-items: flex-start;\n  gap: 10px;\n}\n.history-date {\n  font-size: 11px;\n  color: var(--gold);\n  letter-spacing: 0.1em;\n}\n.history-spread {\n  font-size: 13px;\n  font-weight: 600;\n  color: var(--text);\n  margin-top: 4px;\n}\n.history-question {\n  font-size: 12px;\n  color: var(--muted);\n  margin-top: 4px;\n  line-height: 1.6;\n}\n.history-cards {\n  font-size: 11px;\n  color: var(--purple-light);\n  margin-top: 6px;\n}\n.history-delete {\n  background: none;\n  border: none;\n  color: var(--muted);\n  font-size: 16px;\n  cursor: pointer;\n  line-height: 1;\n  padding: 2px 6px;\n  flex-shrink: 0;\n}\n.history-delete:hover { color: #d46a6a; }\n.history-empty {\n  text-align: center;\n  color: var(--muted);\n  font-size: 13px;\n  padding: 30px 0;\n}\n.history-clear {\n  display: block;\n  margin: 14px auto 0;\n  background: none;\n  border: 1px solid var(--card-border);\n  color: var(--muted);\n  border-radius: 50px;\n  padding: 8px 20px;\n  font-size: 11px;\n  letter-spacing: 0.15em;\n  cursor: pointer;\n  font-family: 'Noto Serif JP', serif;\n}\n.history-clear:hover { border-color: #d46a6a; color: #d46a6a; }\n\n/* ---- \u8a73\u7d30\u8868\u793a\u30e2\u30fc\u30c0\u30eb ---- */\n.modal-overlay {\n  display: none;\n  position: fixed;\n  inset: 0;\n  background: rgba(8,5,18,0.85);\n  z-index: 100;\n  align-items: flex-start;\n  justify-content: center;\n  overflow-y: auto;\n  padding: 40px 16px;\n}\n.modal-overlay.show { display: flex; }\n.modal-box {\n  background: var(--mid);\n  border: 1px solid var(--card-border);\n  border-radius: 16px;\n  max-width: 700px;\n  width: 100%;\n  padding: 30px;\n  position: relative;\n}\n.modal-close {\n  position: absolute;\n  top: 14px; right: 18px;\n  background: none;\n  border: none;\n  color: var(--muted);\n  font-size: 22px;\n  cursor: pointer;\n}\n.modal-close:hover { color: var(--text); }\n.modal-title {\n  font-size: 14px;\n  letter-spacing: 0.2em;\n  color: var(--gold);\n  margin-bottom: 4px;\n}\n.modal-date {\n  font-size: 11px;\n  color: var(--muted);\n  margin-bottom: 18px;\n}\n\n/* ---- PDF\u4fdd\u5b58\u30dc\u30bf\u30f3 ---- */\n.btn-pdf {\n  display: block;\n  width: 100%;\n  max-width: 260px;\n  margin: 16px auto 0;\n  padding: 13px 24px;\n  background: rgba(212,175,55,0.12);\n  border: 1px solid var(--gold);\n  border-radius: 50px;\n  color: var(--gold-light);\n  font-family: 'Noto Serif JP', serif;\n  font-size: 13px;\n  letter-spacing: 0.2em;\n  cursor: pointer;\n  transition: all 0.25s;\n}\n.btn-pdf:hover { background: rgba(212,175,55,0.22); }\n\n/* ---- \u30ed\u30fc\u30c7\u30a3\u30f3\u30b0\u5c0f ---- */\n.ai-loading {\n  text-align: center;\n  font-size: 12px;\n  color: var(--purple-light);\n  letter-spacing: 0.2em;\n  margin: 10px 0;\n  display: none;\n}\n.ai-loading.show { display: block; }\n\n/* ---- \u5370\u5237\u7528 ---- */\n@media print {\n  #stars, header .ornament, #sec-spread, #sec-topics, #sec-ai, .q-wrap, #btn-shuffle,\n  .hint, .btn-reset, .btn-pdf, .history-toggle-btn, #history-area,\n  .spread-label, .card { display: none !important; }\n  body { background: #fff; color: #111; }\n  .wrap { max-width: 100%; padding: 0; }\n  .reading-card, .reading-overall {\n    background: #fff !important;\n    border: 1px solid #ccc !important;\n    color: #111 !important;\n    box-shadow: none !important;\n    opacity: 1 !important;\n    transform: none !important;\n    page-break-inside: avoid;\n  }\n  .reading-card-name, .reading-overall-title, .reading-position, .title-en { color: #6b3fa0 !important; }\n  .reading-text, .reading-overall-text { color: #222 !important; }\n}\n\n/* ---- \u30b7\u30e3\u30c3\u30d5\u30eb\u30a2\u30cb\u30e1 ---- */\n@keyframes shuffle-fly {\n  0% { transform: translate(0,0) rotate(0deg); opacity:1; }\n  50% { transform: translate(var(--dx), var(--dy)) rotate(var(--dr)); opacity:0.6; }\n  100% { transform: translate(0,0) rotate(0deg); opacity:1; }\n}\n.shuffling { animation: shuffle-fly 0.6s ease-in-out; }\n" }} />

      {/* トップバー */}
      <div style={{
        display:'flex', alignItems:'center', justifyContent:'space-between',
        padding:'12px 24px', borderBottom:'1px solid #4a2e7a',
        fontFamily:"'Noto Serif JP',serif", position:'relative', zIndex:10,
        background:'rgba(14,10,34,0.95)'
      }}>
        <span style={{ fontFamily:"'Cinzel Decorative',serif", color:'#d4af37', fontSize:15, letterSpacing:'0.12em' }}>✦ Tarot Reading</span>
        <div style={{ display:'flex', alignItems:'center', gap:10, flexWrap:'wrap' }}>
          <span style={{ fontSize:11, color:'#9a94c0' }}>{userEmail}</span>
          <span style={{ fontSize:10, padding:'3px 10px', border:'1px solid #4a2e7a', borderRadius:20, color:'#9b6fd4' }}>{planLabel}</span>
          {accessType === 'subscription' && (
            <button onClick={openPortal} style={{ background:'none', border:'1px solid #4a2e7a', borderRadius:50, color:'#9a94c0', fontSize:11, padding:'5px 14px', cursor:'pointer', fontFamily:'inherit' }}>プラン管理</button>
          )}
          <button onClick={doLogout} style={{ background:'none', border:'1px solid #4a2e7a', borderRadius:50, color:'#9a94c0', fontSize:11, padding:'5px 14px', cursor:'pointer', fontFamily:'inherit' }}>ログアウト</button>
        </div>
      </div>

      {/* タロットアプリ本体（HTML） */}
      <div dangerouslySetInnerHTML={{ __html: "<canvas id=\"stars\"></canvas>\n\n<div class=\"wrap\">\n\n<header>\n  <div class=\"title-en\">Tarot Reading</div>\n  <div class=\"title-ja\">\u30bf\u30ed\u30c3\u30c8\u5360\u3044\u9451\u5b9a</div>\n  <div class=\"ornament\">\u2726</div>\n</header>\n\n<!-- \u30b9\u30d7\u30ec\u30c3\u30c9\u9078\u629e -->\n<section id=\"sec-spread\">\n  <div class=\"section-title\">\u25c8 \u30b9\u30d7\u30ec\u30c3\u30c9\u3092\u9078\u3076 \u25c8</div>\n  <div class=\"spread-grid\">\n    <button class=\"spread-btn active\" data-spread=\"one\" onclick=\"selectSpread(this)\">\n      <div class=\"s-icon\">\ud83c\udf19</div>\n      <div class=\"s-name\">1\u679a\u5f15\u304d</div>\n      <div class=\"s-desc\">\u4eca\u65e5\u306e\u6d41\u308c\u30fb\u30b7\u30f3\u30d7\u30eb\u306a\u7b54\u3048</div>\n    </button>\n    <button class=\"spread-btn\" data-spread=\"duo\" onclick=\"selectSpread(this)\">\n      <div class=\"s-icon\">\u2696\ufe0f</div>\n      <div class=\"s-name\">2\u679a\u5f15\u304d</div>\n      <div class=\"s-desc\">\u73fe\u72b6\u3068\u30a2\u30c9\u30d0\u30a4\u30b9</div>\n    </button>\n    <button class=\"spread-btn\" data-spread=\"three\" onclick=\"selectSpread(this)\">\n      <div class=\"s-icon\">\u2600\u2726\u263d</div>\n      <div class=\"s-name\">\u904e\u53bb\u30fb\u73fe\u5728\u30fb\u672a\u6765</div>\n      <div class=\"s-desc\">3\u679a\u30fb\u6642\u9593\u8ef8\u3067\u6d41\u308c\u3092\u8aad\u3080</div>\n    </button>\n    <button class=\"spread-btn\" data-spread=\"yesno\" onclick=\"selectSpread(this)\">\n      <div class=\"s-icon\">\ud83c\udfaf</div>\n      <div class=\"s-name\">YES / NO \u5360\u3044</div>\n      <div class=\"s-desc\">3\u679a\u30fb\u7b54\u3048\u3092\u30ba\u30d0\u30ea\u5c0e\u304f</div>\n    </button>\n    <button class=\"spread-btn\" data-spread=\"love\" onclick=\"selectSpread(this)\">\n      <div class=\"s-icon\">\ud83d\udc95</div>\n      <div class=\"s-name\">\u604b\u611b\u30b9\u30d7\u30ec\u30c3\u30c9</div>\n      <div class=\"s-desc\">3\u679a\u30fb\u4e8c\u4eba\u306e\u95a2\u4fc2\u3092\u8aad\u3080</div>\n    </button>\n    <button class=\"spread-btn\" data-spread=\"work\" onclick=\"selectSpread(this)\">\n      <div class=\"s-icon\">\ud83d\udcbc</div>\n      <div class=\"s-name\">\u4ed5\u4e8b\u30fb\u8ee2\u8077</div>\n      <div class=\"s-desc\">4\u679a\u30fb\u30ad\u30e3\u30ea\u30a2\u306e\u65b9\u5411\u6027</div>\n    </button>\n    <button class=\"spread-btn\" data-spread=\"cross\" onclick=\"selectSpread(this)\">\n      <div class=\"s-icon\">\u2720</div>\n      <div class=\"s-name\">\u30b1\u30eb\u30c8\u5341\u5b57</div>\n      <div class=\"s-desc\">5\u679a\u30fb\u72b6\u6cc1\u306e\u6df1\u3044\u5206\u6790</div>\n    </button>\n    <button class=\"spread-btn\" data-spread=\"decision\" onclick=\"selectSpread(this)\">\n      <div class=\"s-icon\">\ud83d\udd00</div>\n      <div class=\"s-name\">\u9078\u629e\u30fb\u6c7a\u65ad</div>\n      <div class=\"s-desc\">5\u679a\u30fbA\u304bB\u304b\u8ff7\u3063\u305f\u3068\u304d</div>\n    </button>\n    <button class=\"spread-btn\" data-spread=\"star\" onclick=\"selectSpread(this)\">\n      <div class=\"s-icon\">\u2b50</div>\n      <div class=\"s-name\">\u30b9\u30bf\u30fc\u30b9\u30d7\u30ec\u30c3\u30c9</div>\n      <div class=\"s-desc\">6\u679a\u30fb\u5168\u65b9\u4f4d\u306e\u7dcf\u5408\u9451\u5b9a</div>\n    </button>\n    <button class=\"spread-btn\" data-spread=\"horseshoe\" onclick=\"selectSpread(this)\">\n      <div class=\"s-icon\">\ud83e\uddff</div>\n      <div class=\"s-name\">\u30db\u30fc\u30b9\u30b7\u30e5\u30fc</div>\n      <div class=\"s-desc\">7\u679a\u30fb\u904b\u547d\u306e\u9053\u7b4b\u3092\u8a73\u7d30\u306b</div>\n    </button>\n    <button class=\"spread-btn\" data-spread=\"mandala\" onclick=\"selectSpread(this)\">\n      <div class=\"s-icon\">\ud83c\udf38</div>\n      <div class=\"s-name\">\u30de\u30f3\u30c0\u30e9\u30b9\u30d7\u30ec\u30c3\u30c9</div>\n      <div class=\"s-desc\">9\u679a\u30fb\u4eba\u751f\u306e\u5168\u9818\u57df\u3092\u7db2\u7f85</div>\n    </button>\n    <button class=\"spread-btn\" data-spread=\"year\" onclick=\"selectSpread(this)\">\n      <div class=\"s-icon\">\ud83d\uddd3\ufe0f</div>\n      <div class=\"s-name\">\u5e74\u9593\u904b\u52e2</div>\n      <div class=\"s-desc\">12\u679a\u30fb1\u30f6\u6708\u3054\u3068\u306e\u904b\u6c17</div>\n    </button>\n  </div>\n</section>\n\n<!-- \u30c8\u30d4\u30c3\u30af\u9078\u629e -->\n<section id=\"sec-topics\">\n  <div class=\"section-title\">\u25c8 \u5360\u3044\u305f\u3044\u30c8\u30d4\u30c3\u30af\u3092\u9078\u3076\uff08\u8907\u6570\u9078\u629e\u53ef\uff09\u25c8</div>\n  <div class=\"topic-grid\" id=\"topic-grid\">\n    <div class=\"topic-chip\" data-topic=\"future\" onclick=\"toggleTopic(this)\"><div class=\"t-icon\">\ud83d\udd2e</div>\u672a\u6765\u306e\u904b\u52e2</div>\n    <div class=\"topic-chip\" data-topic=\"love\" onclick=\"toggleTopic(this)\"><div class=\"t-icon\">\ud83d\udc9e</div>\u604b\u611b\u30fb\u7d50\u5a5a\u904b</div>\n    <div class=\"topic-chip\" data-topic=\"marriage\" onclick=\"toggleTopic(this)\"><div class=\"t-icon\">\ud83d\udc8d</div>\u5a5a\u6d3b\u30fb\u7d50\u5a5a</div>\n    <div class=\"topic-chip\" data-topic=\"breakup\" onclick=\"toggleTopic(this)\"><div class=\"t-icon\">\ud83d\udc94</div>\u5225\u308c\u30fb\u5fa9\u7e01</div>\n    <div class=\"topic-chip\" data-topic=\"money\" onclick=\"toggleTopic(this)\"><div class=\"t-icon\">\ud83d\udcb0</div>\u4ed5\u4e8b\u30fb\u304a\u91d1\u904b</div>\n    <div class=\"topic-chip\" data-topic=\"career\" onclick=\"toggleTopic(this)\"><div class=\"t-icon\">\ud83d\ude80</div>\u8ee2\u8077\u30fb\u30ad\u30e3\u30ea\u30a2</div>\n    <div class=\"topic-chip\" data-topic=\"business\" onclick=\"toggleTopic(this)\"><div class=\"t-icon\">\ud83c\udfe2</div>\u8d77\u696d\u30fb\u526f\u696d</div>\n    <div class=\"topic-chip\" data-topic=\"study\" onclick=\"toggleTopic(this)\"><div class=\"t-icon\">\ud83d\udcda</div>\u52c9\u5f37\u30fb\u53d7\u9a13</div>\n    <div class=\"topic-chip\" data-topic=\"health\" onclick=\"toggleTopic(this)\"><div class=\"t-icon\">\ud83c\udf3f</div>\u5065\u5eb7\u30fb\u4f53\u8abf</div>\n    <div class=\"topic-chip\" data-topic=\"mental\" onclick=\"toggleTopic(this)\"><div class=\"t-icon\">\ud83e\uddd8</div>\u5fc3\u306e\u5e73\u7a4f\u30fb\u7652\u3057</div>\n    <div class=\"topic-chip\" data-topic=\"caution\" onclick=\"toggleTopic(this)\"><div class=\"t-icon\">\u26a0\ufe0f</div>\u4eba\u751f\u306e\u6ce8\u610f\u70b9</div>\n    <div class=\"topic-chip\" data-topic=\"relationship\" onclick=\"toggleTopic(this)\"><div class=\"t-icon\">\ud83e\udd1d</div>\u4eba\u9593\u95a2\u4fc2</div>\n    <div class=\"topic-chip\" data-topic=\"family\" onclick=\"toggleTopic(this)\"><div class=\"t-icon\">\ud83c\udfe0</div>\u5bb6\u65cf\u30fb\u89aa\u5b50\u95a2\u4fc2</div>\n    <div class=\"topic-chip\" data-topic=\"friend\" onclick=\"toggleTopic(this)\"><div class=\"t-icon\">\ud83d\udc6b</div>\u53cb\u4eba\u30fb\u30b3\u30df\u30e5\u30cb\u30c6\u30a3</div>\n    <div class=\"topic-chip\" data-topic=\"yearly\" onclick=\"toggleTopic(this)\"><div class=\"t-icon\">\ud83c\udf8d</div>\u4eca\u5e74\u306e\u904b\u6c17</div>\n    <div class=\"topic-chip\" data-topic=\"monthly\" onclick=\"toggleTopic(this)\"><div class=\"t-icon\">\ud83c\udf1b</div>\u4eca\u6708\u306e\u904b\u6c17</div>\n    <div class=\"topic-chip\" data-topic=\"move\" onclick=\"toggleTopic(this)\"><div class=\"t-icon\">\ud83c\udfe1</div>\u5f15\u8d8a\u3057\u30fb\u74b0\u5883\u5909\u5316</div>\n    <div class=\"topic-chip\" data-topic=\"travel\" onclick=\"toggleTopic(this)\"><div class=\"t-icon\">\u2708\ufe0f</div>\u65c5\u884c\u30fb\u51fa\u5f35</div>\n    <div class=\"topic-chip\" data-topic=\"talent\" onclick=\"toggleTopic(this)\"><div class=\"t-icon\">\ud83c\udf1f</div>\u624d\u80fd\u30fb\u4f7f\u547d\u30fb\u5929\u8077</div>\n    <div class=\"topic-chip\" data-topic=\"advice\" onclick=\"toggleTopic(this)\"><div class=\"t-icon\">\ud83c\udf40</div>\u958b\u904b\u30a2\u30c9\u30d0\u30a4\u30b9</div>\n  </div>\n  <div class=\"topic-hint\">\u8907\u6570\u9078\u629e\u53ef \u2014 \u9078\u629e\u3057\u306a\u3044\u5834\u5408\u306f\u5168\u4f53\u9451\u5b9a\u306e\u307f\u8868\u793a\u3055\u308c\u307e\u3059</div>\n</section>\n\n<!-- AI\u9451\u5b9a\u30e2\u30fc\u30c9 -->\n<section id=\"sec-ai\">\n  <div class=\"section-title\">\u25c8 AI\u9451\u5b9a\u30e2\u30fc\u30c9 \u25c8</div>\n  <div class=\"ai-panel\">\n    <label class=\"ai-toggle-row\">\n      <div>\n        <div class=\"ai-toggle-label\">Claude AI\u306b\u3088\u308b\u52d5\u7684\u9451\u5b9a\u6587\u3092\u4f7f\u3046</div>\n        <div class=\"ai-toggle-desc\">ON \u306b\u3059\u308b\u3068\u3001\u5f15\u3044\u305f\u30ab\u30fc\u30c9\u3068\u9078\u3093\u3060\u30c8\u30d4\u30c3\u30af\u306b\u5408\u308f\u305b\u3066\u3001AI\u304c\u305d\u306e\u90fd\u5ea6\u30aa\u30ea\u30b8\u30ca\u30eb\u306e\u9451\u5b9a\u6587\u3092\u751f\u6210\u3057\u307e\u3059\u3002OFF \u306e\u5834\u5408\u306f\u5185\u8535\u30c6\u30f3\u30d7\u30ec\u30fc\u30c8\u3067\u9451\u5b9a\u3057\u307e\u3059\u3002</div>\n      </div>\n      <div class=\"switch\">\n        <input type=\"checkbox\" id=\"ai-toggle\" onchange=\"toggleAI()\">\n        <span class=\"slider\"></span>\n      </div>\n    </label>\n    <div class=\"ai-key-row\" id=\"ai-key-row\">\n      <input type=\"password\" id=\"ai-api-key\" placeholder=\"sk-ant-... \uff08Anthropic API\u30ad\u30fc\uff09\" oninput=\"saveApiKey()\">\n      <div class=\"ai-key-note\">\n        API\u30ad\u30fc\u306f\u3053\u306e\u7aef\u672b\u306e\u30d6\u30e9\u30a6\u30b6\u5185\uff08localStorage\uff09\u306b\u306e\u307f\u4fdd\u5b58\u3055\u308c\u3001\u5916\u90e8\u306b\u306f\u9001\u4fe1\u3055\u308c\u307e\u305b\u3093\u3002\u9451\u5b9a\u306e\u751f\u6210\u6642\u306e\u307f Anthropic API \u3078\u76f4\u63a5\u9001\u4fe1\u3055\u308c\u307e\u3059\u3002<br>\n        API\u30ad\u30fc\u3092\u304a\u6301\u3061\u3067\u306a\u3044\u5834\u5408\u306f <a href=\"https://console.anthropic.com/\" target=\"_blank\" rel=\"noopener\">console.anthropic.com</a> \u304b\u3089\u53d6\u5f97\u3067\u304d\u307e\u3059\uff08\u5229\u7528\u306b\u306f\u6599\u91d1\u304c\u767a\u751f\u3057\u307e\u3059\uff09\u3002\n      </div>\n    </div>\n  </div>\n</section>\n\n<!-- \u5c65\u6b74 -->\n<section style=\"text-align:center\">\n  <button class=\"history-toggle-btn\" onclick=\"toggleHistoryView()\">\ud83d\udcdc \u9451\u5b9a\u5c65\u6b74\u3092\u898b\u308b</button>\n</section>\n\n<!-- \u5c65\u6b74\u30a8\u30ea\u30a2 -->\n<div id=\"history-area\">\n  <div class=\"section-title\">\u25c8 \u9451\u5b9a\u5c65\u6b74 \u25c8</div>\n  <div id=\"history-list\"></div>\n</div>\n\n\n<!-- \u8cea\u554f\u5165\u529b -->\n<section>\n  <div class=\"section-title\">\u25c8 \u5360\u3044\u305f\u3044\u3053\u3068\u3092\u66f8\u304f\uff08\u4efb\u610f\uff09\u25c8</div>\n  <div class=\"q-wrap\">\n    <textarea id=\"question\" placeholder=\"\u4f8b\uff1a\u8ee2\u8077\u306b\u3064\u3044\u3066\u3001\u5f7c\u3068\u306e\u95a2\u4fc2\u3001\u4eca\u5f8c\u306e\u904b\u52e2\u2026\u4f55\u3067\u3082\u66f8\u3044\u3066\u304f\u3060\u3055\u3044\u3002\"></textarea>\n  </div>\n</section>\n\n<!-- \u30b7\u30e3\u30c3\u30d5\u30eb -->\n<section style=\"text-align:center\">\n  <button class=\"btn-primary\" id=\"btn-shuffle\" onclick=\"startReading()\">\ud83d\udd2e &nbsp;\u30ab\u30fc\u30c9\u3092\u30b7\u30e3\u30c3\u30d5\u30eb\u3059\u308b</button>\n  <div class=\"hint\">\u30ab\u30fc\u30c9\u3092\u30af\u30ea\u30c3\u30af\u3057\u30661\u679a\u305a\u3064\u3081\u304f\u3063\u3066\u304f\u3060\u3055\u3044</div>\n</section>\n\n<!-- \u30ab\u30fc\u30c9\u30a8\u30ea\u30a2 -->\n<div id=\"card-area\">\n  <div class=\"section-title\" id=\"spread-title\"></div>\n  <div class=\"cards-row\" id=\"cards-row\"></div>\n</div>\n\n<!-- \u9451\u5b9a\u4e2d -->\n<div class=\"loading\" id=\"loading\">\n  <span>\u9451</span><span>\u5b9a</span><span>\u4e2d</span>\n  <span>\u2026</span>\n</div>\n<div class=\"ai-loading\" id=\"ai-loading\">\u2726 AI\u304c\u661f\u3005\u306e\u58f0\u3092\u8aad\u307f\u53d6\u3063\u3066\u3044\u307e\u3059 \u2726</div>\n\n<!-- \u9451\u5b9a\u7d50\u679c -->\n<div id=\"reading-area\">\n  <div class=\"section-title\">\u25c8 \u9451\u5b9a\u7d50\u679c \u25c8</div>\n  <div id=\"reading-cards\"></div>\n  <div class=\"reading-overall\" id=\"reading-overall\">\n    <div class=\"reading-overall-title\">\u25c8 \u7dcf\u5408\u30e1\u30c3\u30bb\u30fc\u30b8 \u25c8</div>\n    <div class=\"reading-overall-text\" id=\"overall-text\"></div>\n  </div>\n  <div id=\"topic-readings\"></div>\n  <button class=\"btn-pdf\" onclick=\"window.print()\">\ud83d\udcc4 \u7d50\u679c\u3092PDF\u3067\u4fdd\u5b58\u3059\u308b</button>\n  <button class=\"btn-reset\" onclick=\"resetAll()\">\u2726 \u3082\u3046\u4e00\u5ea6\u5360\u3046 \u2726</button>\n</div>\n\n</div>\n\n<!-- \u5c65\u6b74\u8a73\u7d30\u30e2\u30fc\u30c0\u30eb -->\n<div class=\"modal-overlay\" id=\"modal-overlay\" onclick=\"closeModalIfBackdrop(event)\">\n  <div class=\"modal-box\">\n    <button class=\"modal-close\" onclick=\"closeModal()\">\u00d7</button>\n    <div class=\"modal-title\" id=\"modal-spread\"></div>\n    <div class=\"modal-date\" id=\"modal-date\"></div>\n    <div id=\"modal-question\" style=\"font-size:13px;color:var(--muted);margin-bottom:16px;\"></div>\n    <div id=\"modal-cards\"></div>\n    <div class=\"reading-overall visible\" id=\"modal-overall\">\n      <div class=\"reading-overall-title\">\u25c8 \u7dcf\u5408\u30e1\u30c3\u30bb\u30fc\u30b8 \u25c8</div>\n      <div class=\"reading-overall-text\" id=\"modal-overall-text\"></div>\n    </div>\n    <div id=\"modal-topics\"></div>\n  </div>\n</div>" }} />

      {/* タロットのメインスクリプト */}
      <script dangerouslySetInnerHTML={{ __html: `

/* ===== 星空 ===== */
(function(){
  const c = document.getElementById('stars');
  const ctx = c.getContext('2d');
  let W, H, stars=[];
  function resize(){ W=c.width=window.innerWidth; H=c.height=window.innerHeight; init(); }
  function init(){
    stars=[];
    for(let i=0;i<220;i++){
      stars.push({x:Math.random()*W,y:Math.random()*H,r:Math.random()*1.2+0.3,a:Math.random(),s:Math.random()*0.008+0.002,d:Math.random()<0.5?1:-1});
    }
  }
  function draw(){
    ctx.clearRect(0,0,W,H);
    stars.forEach(s=>{
      s.a+=s.s*s.d;
      if(s.a>1||s.a<0) s.d*=-1;
      ctx.beginPath();
      ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
      ctx.fillStyle=`rgba(230,220,255,${s.a})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  window.addEventListener('resize',resize);
  resize(); draw();
})();

/* ===== タロットデータ ===== */
const MAJOR = [
  {n:"0",name:"愚者",sym:"🃏",keywords:["自由","冒険","純粋さ","新たな出発"],rev_keywords:["無謀","現実逃避","準備不足"]},
  {n:"I",name:"魔術師",sym:"🎩",keywords:["意志力","スキル","創造力","行動"],rev_keywords:["欺き","操作","能力の浪費"]},
  {n:"II",name:"女教皇",sym:"📖",keywords:["直感","内なる知恵","神秘","静寂"],rev_keywords:["秘密","表面的知識","判断ミス"]},
  {n:"III",name:"女帝",sym:"👑",keywords:["豊かさ","母性","創造","自然"],rev_keywords:["過保護","依存","不毛"]},
  {n:"IV",name:"皇帝",sym:"⚔️",keywords:["権威","安定","リーダーシップ","秩序"],rev_keywords:["独裁","頑固","支配欲"]},
  {n:"V",name:"教皇",sym:"✝️",keywords:["伝統","精神的導き","教育","信仰"],rev_keywords:["偏見","束縛","形式主義"]},
  {n:"VI",name:"恋人たち",sym:"💕",keywords:["愛","選択","調和","価値観"],rev_keywords:["不一致","優柔不断","不誠実"]},
  {n:"VII",name:"戦車",sym:"🏆",keywords:["勝利","意志","前進","克服"],rev_keywords:["挫折","攻撃性","制御不能"]},
  {n:"VIII",name:"力",sym:"🦁",keywords:["勇気","内なる強さ","忍耐","自制"],rev_keywords:["弱さ","恐れ","自信喪失"]},
  {n:"IX",name:"隠者",sym:"🔦",keywords:["内省","独自の道","精神的探求","知恵"],rev_keywords:["孤立","引きこもり","現実逃避"]},
  {n:"X",name:"運命の輪",sym:"🌀",keywords:["転換点","運命","チャンス","循環"],rev_keywords:["不運","抵抗","逆境"]},
  {n:"XI",name:"正義",sym:"⚖️",keywords:["公正","真実","バランス","責任"],rev_keywords:["不公平","不誠実","偏り"]},
  {n:"XII",name:"吊られた男",sym:"🙃",keywords:["犠牲","新視点","待機","悟り"],rev_keywords:["無駄な犠牲","停滞","自己欺き"]},
  {n:"XIII",name:"死神",sym:"💀",keywords:["変容","終わり","新たな始まり","解放"],rev_keywords:["抵抗","停滞","変化への恐れ"]},
  {n:"XIV",name:"節制",sym:"🌊",keywords:["バランス","調和","忍耐","中庸"],rev_keywords:["過剰","不均衡","焦り"]},
  {n:"XV",name:"悪魔",sym:"🔗",keywords:["執着","束縛","欲望","影"],rev_keywords:["解放","束縛からの自由","覚醒"]},
  {n:"XVI",name:"塔",sym:"⚡",keywords:["突然の変化","崩壊","混乱","目覚め"],rev_keywords:["災難の回避","長引く崩壊","変化への抵抗"]},
  {n:"XVII",name:"星",sym:"⭐",keywords:["希望","再生","インスピレーション","癒し"],rev_keywords:["絶望","失望","自己不信"]},
  {n:"XVIII",name:"月",sym:"🌙",keywords:["幻想","恐れ","潜在意識","直感"],rev_keywords:["混乱の解消","真実の発見","恐れの克服"]},
  {n:"XIX",name:"太陽",sym:"☀️",keywords:["成功","活力","明るさ","喜び"],rev_keywords:["楽観的すぎる","一時的な成功","過信"]},
  {n:"XX",name:"審判",sym:"🔔",keywords:["覚醒","再生","評価","使命"],rev_keywords:["自己批判","後悔","目的の欠如"]},
  {n:"XXI",name:"世界",sym:"🌍",keywords:["完成","達成","統合","完全"],rev_keywords:["未完成","遅れ","閉塞感"]}
];

// 小アルカナ（4スート各14枚 → 略版: エースと絵札のみ16枚追加）
const MINOR_EXTRA = [
  {n:"Ace",name:"ワンドのエース",sym:"🕯️",keywords:["情熱の芽生え","新しいプロジェクト","創造力","エネルギー"],rev_keywords:["停滞","エネルギー不足","遅延"]},
  {n:"Ace",name:"カップのエース",sym:"🏆",keywords:["感情の始まり","愛","直感","豊かさ"],rev_keywords:["感情の空虚","拒絶","感情の抑圧"]},
  {n:"Ace",name:"ソードのエース",sym:"⚔️",keywords:["知性","新しいアイデア","明晰さ","真実"],rev_keywords:["混乱","悪いスタート","誤った判断"]},
  {n:"Ace",name:"ペンタクルのエース",sym:"💰",keywords:["物質的豊かさ","新しい機会","安定","現実"],rev_keywords:["機会の損失","不安定","物質主義"]},
  {n:"King",name:"ワンドのキング",sym:"🔥",keywords:["ビジョン","カリスマ","起業家精神","情熱的なリーダー"],rev_keywords:["独裁","傲慢","衝動的"]},
  {n:"Queen",name:"カップのクイーン",sym:"💙",keywords:["共感","感情的知性","直感","思いやり"],rev_keywords:["感情的操作","依存","共依存"]},
  {n:"Knight",name:"ソードのナイト",sym:"🌪️",keywords:["行動力","野心","直接的","知性的挑戦"],rev_keywords:["衝動的","無謀","攻撃的"]},
  {n:"Page",name:"ペンタクルのページ",sym:"🌱",keywords:["学習","実践的なスキル","努力","着実な成長"],rev_keywords:["不注意","学習の困難","向上心の欠如"]},
];

const ALL_CARDS = [...MAJOR, ...MINOR_EXTRA];

/* ===== スプレッド定義 ===== */
const SPREADS = {
  one:      { label:"【1枚引き】今のあなたへのメッセージ", positions:["今のあなたへ"] },
  duo:      { label:"【2枚引き】現状とアドバイス", positions:["現状","アドバイス"] },
  three:    { label:"【過去・現在・未来】時間軸で流れを読む", positions:["過去","現在","未来"] },
  yesno:    { label:"【YES/NO占い】答えをズバリ導く", positions:["現状の流れ","障害・課題","結論（YES/NO）"] },
  love:     { label:"【恋愛スプレッド】二人の関係を読む", positions:["あなたの気持ち","相手の気持ち","関係の行方"] },
  work:     { label:"【仕事・転職スプレッド】キャリアの方向性", positions:["現在の状況","強み・才能","障害","最善の選択"] },
  cross:    { label:"【ケルト十字】状況の深い鑑定", positions:["現状","課題","過去の影響","近い未来","潜在意識"] },
  decision: { label:"【選択・決断スプレッド】AかBか迷ったとき", positions:["現在地","選択肢A","選択肢B","捨てるもの","最善の道"] },
  star:     { label:"【スタースプレッド】全方位の総合鑑定", positions:["中心（テーマ）","精神面","感情面","物質面","過去","未来"] },
  horseshoe:{ label:"【ホースシュー】運命の道筋・7枚詳細鑑定", positions:["過去","現在","隠れた影響","乗り越える課題","周囲の環境・人物","近い未来","最終的な結果"] },
  mandala:  { label:"【マンダラスプレッド】人生の全領域を網羅", positions:["自己","愛・関係","仕事・使命","お金・豊かさ","健康・体","精神・魂","障害","才能・ギフト","全体のメッセージ"] },
  year:     { label:"【年間運勢】12ヶ月の流れを読む", positions:["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"] }
};

/* ===== 状態 ===== */
let currentSpread = 'one';
let drawnCards = [];
let flippedCount = 0;
let selectedTopics = [];

function toggleTopic(el) {
  el.classList.toggle('selected');
  const t = el.dataset.topic;
  if (el.classList.contains('selected')) {
    selectedTopics.push(t);
  } else {
    selectedTopics = selectedTopics.filter(x=>x!==t);
  }
}

function selectSpread(btn) {
  document.querySelectorAll('.spread-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  currentSpread = btn.dataset.spread;
}

function shuffle(arr) {
  const a = [...arr];
  for (let i=a.length-1;i>0;i--) {
    const j = Math.floor(Math.random()*(i+1));
    [a[i],a[j]]=[a[j],a[i]];
  }
  return a;
}

function startReading() {
  const sp = SPREADS[currentSpread];
  const count = sp.positions.length;

  // シャッフル
  const shuffled = shuffle(ALL_CARDS);
  drawnCards = shuffled.slice(0,count).map(card=>({
    ...card,
    reversed: Math.random()<0.35
  }));
  flippedCount = 0;

  document.getElementById('card-area').style.display = 'block';
  document.getElementById('spread-title').textContent = sp.label;
  document.getElementById('reading-area').style.display = 'none';
  document.getElementById('loading').style.display = 'none';
  document.getElementById('btn-shuffle').disabled = true;

  buildCards(sp.positions);
  document.getElementById('card-area').scrollIntoView({behavior:'smooth'});
}

function buildCards(positions) {
  const row = document.getElementById('cards-row');
  row.innerHTML = '';
  drawnCards.forEach((card, i) => {
    const slot = document.createElement('div');
    slot.className = 'card-slot';
    slot.innerHTML = `
      <div class="card-pos-label">${positions[i]}</div>
      <div class="card" id="card-${i}" onclick="flipCard(${i})">
        <div class="card-inner">
          <div class="card-face card-back-face">
            <div class="card-back-pattern">
              <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="30" cy="30" r="22" stroke="#6b3fa0" stroke-width="1"/>
                <circle cx="30" cy="30" r="14" stroke="#6b3fa0" stroke-width="0.7"/>
                <line x1="30" y1="8" x2="30" y2="52" stroke="#6b3fa0" stroke-width="0.7"/>
                <line x1="8" y1="30" x2="52" y2="30" stroke="#6b3fa0" stroke-width="0.7"/>
                <line x1="14" y1="14" x2="46" y2="46" stroke="#6b3fa0" stroke-width="0.5"/>
                <line x1="46" y1="14" x2="14" y2="46" stroke="#6b3fa0" stroke-width="0.5"/>
                <polygon points="30,20 33,28 42,28 35,33 38,42 30,37 22,42 25,33 18,28 27,28" fill="rgba(212,175,55,0.3)" stroke="#d4af37" stroke-width="0.7"/>
              </svg>
            </div>
          </div>
          <div class="card-face card-front-face${card.reversed?' reversed':''}">
            <div class="card-number">${card.n}</div>
            <div class="card-symbol">${card.sym}</div>
            <div class="card-name">${card.name}</div>
            <div class="reversed-badge">逆位置</div>
          </div>
        </div>
      </div>
    `;
    row.appendChild(slot);
  });
}

function flipCard(i) {
  const el = document.getElementById(`card-${i}`);
  if (el.classList.contains('flipped')) return;
  el.classList.add('flipped');
  flippedCount++;
  if (flippedCount === drawnCards.length) {
    setTimeout(showReading, 800);
  }
}

/* ===== トピック別鑑定（20種類） ===== */
const TOPIC_DATA = {
  future: {
    title:"未来の運勢", icon:"🔮",
    pos:[
      "{card}が示す通り、これから訪れる流れは{k1}に満ちています。{k2}を意識して過ごすことで、運命は静かに、しかし確実にあなたを良い方向へ導いていくでしょう。",
      "未来へのカードは{card}。{k1}のエネルギーが少しずつ形になっていく時期です。{k2}に意識を向けることで、思いがけない巡り合わせが訪れるかもしれません。",
      "{card}が未来に輝いています。{k1}を軸に置き、{k2}を日々の指針にすることで、望む未来へのルートが自然と開かれていきます。"
    ],
    rev:[
      "{card}（逆位置）が未来に現れたことは、{k1}に関する見直しの時期を示しています。{k2}を急がず、計画を整理し直すことが結果的に良い未来へつながります。",
      "未来の流れに{card}の逆位置。{k1}の面で停滞を感じても、それは次の前進への準備期間。{k2}を丁寧に扱うことで道は再び開かれます。",
      "{card}（逆位置）は{k1}への警戒を促しています。{k2}に関して少し立ち止まり、本当に進みたい方向を静かに確認してみましょう。"
    ]
  },
  love: {
    title:"恋愛・結婚運", icon:"💞",
    pos:[
      "恋愛面では{card}が{k1}の訪れを告げています。パートナーがいる方は{k2}を深める好機。フリーの方は、自然な出会いの中に運命的なつながりが隠れているかもしれません。",
      "{card}は愛における{k1}を象徴しています。{k2}を大切にすることで、関係はより誠実で温かなものへと育っていくでしょう。",
      "「{card}」が恋愛運に現れました。{k1}のエネルギーが高まり、{k2}を意識した言葉や行動が、心の距離を縮めていくでしょう。"
    ],
    rev:[
      "{card}（逆位置）は、恋愛において{k1}に向き合う時期であることを示しています。{k2}についてすれ違いがあるなら、丁寧に確認する時間を持ちましょう。",
      "恋愛運に現れた{card}の逆位置は、{k1}への気づきを促しています。{k2}を一人で抱え込まず、信頼できる人に話すことで整理されていきます。",
      "{card}（逆位置）から見えるのは、{k1}にまつわる心の揺れ。{k2}について焦らず、自分の本当の気持ちと向き合うことが大切です。"
    ]
  },
  marriage: {
    title:"婚活・結婚", icon:"💍",
    pos:[
      "{card}が婚活・結婚の領域に現れました。{k1}のエネルギーが高まっており、{k2}を心がけることで縁がより近づいてきます。自分らしさを大切に歩みましょう。",
      "結婚運に{card}が輝いています。{k1}という土台を大切にしながら、{k2}を意識した出会いや選択が、理想のパートナーとの縁を結んでいくでしょう。",
      "{card}は、{k1}のエネルギーで結婚への道が開かれていることを示しています。{k2}を磨くことで、素晴らしいご縁が引き寄せられます。"
    ],
    rev:[
      "{card}（逆位置）は婚活・結婚において{k1}の見直しを示しています。{k2}に関する焦りを手放し、今の自分を整えることが先決かもしれません。",
      "結婚運に{card}の逆位置が現れました。{k1}への固執が縁を遠ざけているかもしれません。{k2}の視点から一度見直してみましょう。",
      "{card}（逆位置）は{k1}への注意を促しています。条件よりも{k2}を優先することで、本当の幸せへの扉が開かれていきます。"
    ]
  },
  breakup: {
    title:"別れ・復縁", icon:"💔",
    pos:[
      "{card}が示すのは、{k1}を通じた再生の力。別れや復縁の悩みに対して、{k2}を大切にしながら前を向くことで、新しい形の幸せが見えてきます。",
      "別れ・復縁の問いに{card}が応えています。{k1}のエネルギーは癒しと再出発を示します。{k2}を軸に、自分のペースで歩んでいきましょう。",
      "{card}は{k1}を通じて、この状況に意味があることを告げています。{k2}を意識することで、別れが新たな出会いへの礎となっていきます。"
    ],
    rev:[
      "{card}（逆位置）は、{k1}への執着が続いていることを示しています。{k2}を意識しながら、少しずつ前に進む準備を始めましょう。",
      "別れ・復縁の領域に{card}の逆位置。{k1}にまつわる感情が整理されていない段階かもしれません。{k2}を大切にしながら時間を味方につけてください。",
      "{card}（逆位置）が告げるのは、{k1}を急がないこと。{k2}について心の準備ができてから動くことが、最善の結果につながります。"
    ]
  },
  money: {
    title:"仕事・お金運", icon:"💰",
    pos:[
      "仕事・お金の面では{card}が{k1}を後押ししています。{k2}を活かす場面が増え、努力が形になりやすい時期。新しい提案や挑戦にも良いタイミングです。",
      "{card}が示すのは、{k1}による安定と発展。{k2}を意識して取り組むことで、評価や収入につながる実りが期待できます。",
      "金運・仕事運に{card}が現れました。{k1}の流れが強まり、{k2}を丁寧に積み重ねることで、物質的な豊かさが広がっていくでしょう。"
    ],
    rev:[
      "{card}（逆位置）は、仕事やお金において{k1}への注意を促しています。{k2}に関する判断は慎重に。大きな決断は情報を整理してからにしましょう。",
      "金運・仕事運に{card}の逆位置が現れました。{k1}の見直しを示しています。無理な{k2}は避け、足元を固めることが今は最善です。",
      "{card}（逆位置）は{k1}に関するトラブルへの警戒を示しています。{k2}を後回しにせず、今すぐ確認・整理する時間を作りましょう。"
    ]
  },
  career: {
    title:"転職・キャリア", icon:"🚀",
    pos:[
      "{card}が転職・キャリアの領域に現れました。{k1}のエネルギーが高まっており、{k2}を方向性として選ぶことで、より輝けるステージへと進んでいけるでしょう。",
      "キャリアの転換点に{card}が輝いています。{k1}を信じて踏み出すことが、今のあなたには最善です。{k2}を自分の軸に置いて動いてみてください。",
      "{card}は、{k1}がキャリアアップの鍵であることを示しています。{k2}を磨くことで、新しいフィールドでの活躍が広がっていきます。"
    ],
    rev:[
      "{card}（逆位置）は転職・キャリアにおける{k1}への慎重さを求めています。{k2}が定まらないうちに大きな変化を急がず、今の環境で学べることを探してみましょう。",
      "キャリア面に{card}の逆位置が現れました。{k1}についての見直しが必要かもしれません。{k2}について第三者の意見も参考にすると良いでしょう。",
      "{card}（逆位置）が示すのは、{k1}に関する迷い。{k2}を明確にすることが、方向性を定める最初のステップとなります。"
    ]
  },
  business: {
    title:"起業・副業", icon:"🏢",
    pos:[
      "起業・副業の問いに{card}が応えています。{k1}のエネルギーが味方しており、{k2}を活かしたアイデアが現実の力になりやすい時期です。",
      "{card}は、{k1}を軸にした事業が芽吹くことを示しています。{k2}を丁寧に積み重ねることで、収益とやりがいの両立が近づいてきます。",
      "起業・副業に{card}が現れました。{k1}のエネルギーが追い風となっています。{k2}を忘れずに、一歩ずつ着実に進んでいきましょう。"
    ],
    rev:[
      "{card}（逆位置）は、起業・副業において{k1}への注意を示しています。{k2}を後回しにした見切り発車は避け、準備を整えてから動きましょう。",
      "起業・副業の領域に{card}の逆位置が現れました。{k1}に関するリスクが潜んでいます。{k2}を固めることで、そのリスクは最小化できます。",
      "{card}（逆位置）は{k1}に関する過信を戒めています。{k2}を土台に、小さな検証を繰り返しながら進むことが安全な道筋です。"
    ]
  },
  study: {
    title:"勉強・受験", icon:"📚",
    pos:[
      "勉強・受験の領域に{card}が現れました。{k1}のエネルギーが高まり、{k2}を意識した学び方が結果を引き寄せていきます。努力は必ず報われるでしょう。",
      "{card}は、{k1}を通じて知識と成果が結びつく時期であることを示しています。{k2}を日常のリズムに組み込むことで、力が着実についていきます。",
      "受験・勉強運に{card}が輝いています。{k1}のサポートを受け、{k2}を意識して取り組むことで、目指す結果への扉が開かれていくでしょう。"
    ],
    rev:[
      "{card}（逆位置）は、勉強・受験において{k1}への意識が散漫になりやすい時期を示しています。{k2}を絞って、質を重視した取り組みに切り替えましょう。",
      "勉強運に{card}の逆位置。{k1}が滞っているサインかもしれません。{k2}を見直し、環境や方法を変えることで流れが変わり始めます。",
      "{card}（逆位置）は{k1}に関する焦りを示しています。{k2}よりもまず、心身のコンディションを整えることが先決です。"
    ]
  },
  health: {
    title:"健康・体調", icon:"🌿",
    pos:[
      "健康面では{card}が{k1}を表しています。{k2}を意識した生活リズムを心がけることで、心身ともに良い状態が続くでしょう。",
      "{card}は、体と心の{k1}を示すカード。{k2}な時間を意識的に作ることで、エネルギーが満ちていきます。",
      "{card}が健康運に現れました。{k1}の状態が良好で、{k2}を継続することで、さらに活力がみなぎっていくでしょう。"
    ],
    rev:[
      "{card}（逆位置）は、健康面で{k1}への注意を促しています。無理を続けず、{k2}を取り入れて心身を労わる時間を作りましょう。",
      "健康運に{card}の逆位置が現れました。小さな不調のサイン。{k1}を見過ごさず、{k2}を大切にすることで早めに整えることができます。",
      "{card}（逆位置）は{k1}に関する体のサインに耳を傾けるよう告げています。{k2}の習慣を見直し、専門家に相談することも検討してみましょう。"
    ]
  },
  mental: {
    title:"心の平穏・癒し", icon:"🧘",
    pos:[
      "{card}が心の領域に寄り添っています。{k1}のエネルギーが癒しをもたらしており、{k2}を意識することで心の重荷が少しずつ軽くなっていきます。",
      "心の平穏を求めるあなたに{card}が応えます。{k1}を受け入れることで内側が静かになり、{k2}が自然と戻ってくるでしょう。",
      "{card}は{k1}という癒しのエネルギーを運んできています。{k2}を大切にした時間を意識的に持つことで、魂が本来の輝きを取り戻します。"
    ],
    rev:[
      "{card}（逆位置）は、心の{k1}が滞っていることを示しています。{k2}を無理に求めず、まず自分が今どう感じているかを認めることから始めましょう。",
      "心の領域に{card}の逆位置が現れました。{k1}にまつわる感情が溜まっているサインかもしれません。{k2}を小さなことから取り入れ、少しずつ解放していきましょう。",
      "{card}（逆位置）は{k1}への過剰なこだわりを手放すよう告げています。{k2}を頼り、信頼できる人とつながることが癒しへの近道です。"
    ]
  },
  caution: {
    title:"人生の注意点", icon:"⚠️",
    pos:[
      "{card}は、{k1}という良い流れの中にも、{k2}に対する油断は禁物だと伝えています。順調な時こそ、足元を確認する意識を持ちましょう。",
      "全体として{k1}な流れの中で、{card}は{k2}について軽視しないようにと示しています。小さな違和感を放置しないことが大切です。",
      "{card}からの警告は、{k1}に関する見落としへの注意。{k2}について、一度立ち止まって丁寧に確認する時間を持ちましょう。"
    ],
    rev:[
      "{card}（逆位置）が示す注意点は、{k1}に関する思い込みです。{k2}について、一度立ち止まって本当にそれが必要かを問い直してみてください。",
      "注意すべきは{card}が表す{k1}の影響。{k2}に振り回されず、自分の本当の気持ちを確認することがトラブルを避ける鍵となります。",
      "{card}（逆位置）は{k1}に関するパターンの繰り返しを警戒しています。{k2}について過去と同じ選択をしていないか、振り返ってみましょう。"
    ]
  },
  relationship: {
    title:"人間関係", icon:"🤝",
    pos:[
      "人間関係においては{card}が{k1}の広がりを示しています。{k2}を大切にすることで、周囲との繋がりがより豊かなものになっていくでしょう。",
      "{card}は、{k1}を通じて人とのご縁が深まる時期を表しています。{k2}な対応を心がけることで、良い関係が築かれていきます。",
      "{card}が人間関係に現れました。{k1}のエネルギーがコミュニティ全体を明るく照らしています。{k2}を大切にすることで、信頼が深まっていきます。"
    ],
    rev:[
      "{card}（逆位置）は、人間関係において{k1}にまつわる誤解やすれ違いに注意を促しています。{k2}について、相手の立場から見直す時間を持つと良いでしょう。",
      "人間関係に{card}の逆位置が現れました。{k1}を一人で抱え込みやすい時期です。{k2}を意識して、適度な距離感を保つことが大切です。",
      "{card}（逆位置）は、{k1}に関する関係性の見直しを促しています。{k2}が失われているなら、勇気を持って話し合うタイミングかもしれません。"
    ]
  },
  family: {
    title:"家族・親子関係", icon:"🏠",
    pos:[
      "{card}が家族・親子の領域に現れました。{k1}のエネルギーが家族全体を包み、{k2}を意識したコミュニケーションが絆を深めていきます。",
      "家族運に{card}が輝いています。{k1}が家族の間に流れており、{k2}を大切にすることで、温かいつながりがさらに育まれていくでしょう。",
      "{card}は家族への{k1}の贈り物を告げています。{k2}を日常の中で表現することが、家族の幸福につながっていきます。"
    ],
    rev:[
      "{card}（逆位置）は、家族・親子関係において{k1}が滞っていることを示しています。{k2}について、感情的にならず冷静に向き合う機会を作りましょう。",
      "家族運に{card}の逆位置が現れました。{k1}にまつわる誤解や遠慮が積み重なっているかもしれません。{k2}を素直に伝えることから始めてみましょう。",
      "{card}（逆位置）は、{k1}に関する家族の中のパターンに気づくよう告げています。{k2}を変えることで、関係性の風通しが良くなっていきます。"
    ]
  },
  friend: {
    title:"友人・コミュニティ", icon:"👫",
    pos:[
      "友人・コミュニティの領域に{card}が現れました。{k1}のエネルギーが人とのつながりを豊かにしており、{k2}を大切にすることで素晴らしいご縁が広がっていきます。",
      "{card}は、{k1}を通じた仲間との絆を示しています。{k2}を意識したコミュニケーションが、コミュニティをさらに輝かせていくでしょう。",
      "{card}が友人運に輝いています。{k1}のエネルギーが周囲との共鳴を高め、{k2}が友情をより深いものにしてくれます。"
    ],
    rev:[
      "{card}（逆位置）は友人・コミュニティにおける{k1}の乱れを示しています。{k2}が一方的になっていないか、関係性のバランスを確認してみましょう。",
      "友人運に{card}の逆位置。{k1}にまつわる誤解や距離感のズレが生じているかもしれません。{k2}を率直に伝えることで関係が修復されていきます。",
      "{card}（逆位置）は{k1}に関する人間関係の疲れを示しています。{k2}を大切にしながら、一時的に距離を置くことで気持ちが整理されていきます。"
    ]
  },
  yearly: {
    title:"今年の運気", icon:"🎍",
    pos:[
      "今年全体の運気には{card}が強く影響し、{k1}をテーマとした一年になりそうです。{k2}を意識して過ごすことで、年間を通して安定した成長が期待できます。",
      "{card}が示す今年のキーワードは{k1}。{k2}に関わる出来事が、今年のあなたにとって大きな意味を持つでしょう。",
      "今年の運気に{card}が輝いています。{k1}のエネルギーが通年を流れ、{k2}を軸にした選択が実りへとつながっていきます。"
    ],
    rev:[
      "{card}（逆位置）が示す今年は、{k1}についての見直しがテーマとなりそうです。{k2}を急がず、年の前半は基盤づくりに時間をかけると良いでしょう。",
      "今年の運気に{card}の逆位置が現れました。{k1}に関する課題と向き合う一年です。{k2}を丁寧に扱うことで、後半に大きな転機が訪れます。",
      "{card}（逆位置）は今年、{k1}に関する解放をテーマとして示しています。{k2}を手放すことで、来年への新しい流れが生まれてきます。"
    ]
  },
  monthly: {
    title:"今月の運気", icon:"🌛",
    pos:[
      "今月の流れに{card}が現れました。{k1}のエネルギーが強く働いており、{k2}を意識した行動が月全体の運気を底上げしてくれます。",
      "{card}は、今月が{k1}に関する好機であることを示しています。{k2}をテーマに、今月の行動指針を立ててみましょう。",
      "今月は{card}が示す{k1}のエネルギーが満ちています。{k2}を積極的に取り入れることで、この月に最大の実りが得られるでしょう。"
    ],
    rev:[
      "{card}（逆位置）が今月に現れました。{k1}に関して無理をしやすい月です。{k2}を優先し、ペースを落とすことで来月への活力が蓄えられます。",
      "今月の運気に{card}の逆位置。{k1}が滞りやすい時期です。{k2}に集中して、小さな改善を積み重ねることが最善です。",
      "{card}（逆位置）は今月、{k1}への警戒を示しています。{k2}を後回しにせず、今すぐ対処することでダメージを最小限にできます。"
    ]
  },
  move: {
    title:"引越し・環境変化", icon:"🏡",
    pos:[
      "{card}が引越し・環境変化の領域に現れました。{k1}のエネルギーが変化を後押ししており、{k2}を重視した新しい環境への移行が吉と出るでしょう。",
      "環境変化の問いに{card}が応えています。{k1}を大切にした選択が、新たな場所での豊かな生活へとつながっていきます。{k2}を判断基準にしてみましょう。",
      "{card}は{k1}を通じた環境の刷新を示しています。{k2}を軸に場所や環境を選ぶことで、新天地での運気が大きく開花します。"
    ],
    rev:[
      "{card}（逆位置）は引越し・環境変化において{k1}への慎重さを求めています。{k2}が整う前に急ぎすぎると後悔につながるかもしれません。",
      "環境変化の領域に{card}の逆位置が現れました。{k1}に関して見落としがあるかもしれません。{k2}を再確認してから判断を下すことを勧めます。",
      "{card}（逆位置）は{k1}に関する不安を示しています。{k2}を具体的にリストアップし、不安を解消してから動くことが最善です。"
    ]
  },
  travel: {
    title:"旅行・出張", icon:"✈️",
    pos:[
      "旅行・出張の領域に{card}が輝いています。{k1}のエネルギーが旅を豊かにし、{k2}を意識することで素晴らしい体験と出会いが訪れるでしょう。",
      "{card}は、旅における{k1}の恩恵を告げています。{k2}を旅の目的や姿勢に置くことで、単なる移動以上の深い体験が生まれます。",
      "{card}が旅運に現れました。{k1}が旅全体を包み、{k2}を活かすことで記憶に残る素晴らしい旅となるでしょう。"
    ],
    rev:[
      "{card}（逆位置）は旅行・出張において{k1}への注意を促しています。{k2}に関するトラブルに備え、事前の準備と確認を丁寧に行いましょう。",
      "旅運に{card}の逆位置が現れました。{k1}の面で予期せぬ変更が生じやすいでしょう。{k2}に余裕を持たせた計画がベストです。",
      "{card}（逆位置）は{k1}に関する注意を告げています。この時期の旅は{k2}を重視し、無理のないスケジュールを組むことを勧めます。"
    ]
  },
  talent: {
    title:"才能・使命・天職", icon:"🌟",
    pos:[
      "{card}が才能・使命の領域に輝いています。{k1}はあなた固有の才能の核心です。{k2}を通じてその才能を世に発揮することが、天職への道を開いていきます。",
      "使命を問うあなたに{card}が応えます。{k1}こそがあなたのギフト。{k2}を表現する場を意識的に作ることで、使命感が強まり道が拓けていきます。",
      "{card}は{k1}を通じたあなたの天職を示しています。{k2}を磨くことで、世界があなたの存在を必要とする場面が増えていくでしょう。"
    ],
    rev:[
      "{card}（逆位置）は、{k1}というあなたの才能が十分に発揮されていないことを示しています。{k2}への恐れを手放すことで、本来の力が解放されます。",
      "才能・使命の領域に{card}の逆位置が現れました。{k1}に関する自信の欠如が才能の開花を妨げているかもしれません。{k2}を信じて一歩踏み出しましょう。",
      "{card}（逆位置）は{k1}に関する社会への貢献への迷いを示しています。{k2}を問い直し、本当に好きなことと得意なことの交点を探してみましょう。"
    ]
  },
  advice: {
    title:"開運アドバイス", icon:"🍀",
    pos:[
      "開運のカギは{card}が示す{k1}にあります。日常の中で{k2}を意識的に取り入れてみてください。小さな行動の積み重ねが、運気を大きく後押しします。",
      "{card}からのアドバイスは、{k1}を大切にすること。特に{k2}に関わる選択をするとき、直感を信じてみると良い結果につながりやすいでしょう。",
      "{card}が示す開運の方向は{k1}です。{k2}を生活の中に自然に組み込むことで、宇宙のサポートがより強く届くようになります。"
    ],
    rev:[
      "{card}（逆位置）からのアドバイスは、{k1}を一度見直すこと。{k2}についての考え方を少し変えるだけで、停滞していた運気が動き出すきっかけになります。",
      "開運のためには、{card}が示す{k1}への気づきが大切です。{k2}に対する執着を少し緩めることで、新しい流れが入ってくるでしょう。",
      "{card}（逆位置）は{k1}に関するブロックを示しています。{k2}に意識を向けて、思い込みや古いパターンを手放すことが開運への最短路です。"
    ]
  }
};

function generateTopicReading(topic) {
  const data = TOPIC_DATA[topic];
  const card = rnd(drawnCards);
  const keys = card.reversed ? card.rev_keywords : card.keywords;
  const k1 = rnd(keys);
  let k2 = rnd(keys.filter(k=>k!==k1));
  if (!k2) k2 = k1;
  const templates = card.reversed ? data.rev : data.pos;
  const text = rnd(templates)
    .replace(/{card}/g, `「${card.name}」`)
    .replace(/{k1}/g, k1)
    .replace(/{k2}/g, k2);
  return { title: data.title, icon: data.icon, text };
}

const INTRO = ["このカードが示すのは、","星々が語るのは、","宇宙の声は囁きます——","深い洞察が浮かび上がります。","運命の糸が指し示すのは、"];
const CONN = ["それはまた、","同時に、","さらに深く見ると、","この流れの中で、","重要なことに、"];

function rnd(arr){ return arr[Math.floor(Math.random()*arr.length)]; }

function generateCardReading(card, position, spreadType) {
  const keys = card.reversed ? card.rev_keywords : card.keywords;
  const k1 = rnd(keys), k2 = rnd(keys.filter(k=>k!==k1)||keys);
  const posMap = {
    "今のあなたへ":"今この瞬間のあなた全体を映す",
    "現在":"今あなたが置かれている状況",
    "過去":"これまでの流れと背景",
    "未来":"これから訪れる可能性",
    "課題":"乗り越えるべき試練",
    "潜在意識":"心の奥で感じていること",
    "あなたの気持ち":"あなたの内なる想い",
    "相手の気持ち":"相手が抱いているエネルギー",
    "関係の行方":"二人の関係が向かう先",
    "あなた":"あなたの内面",
    "相手":"相手が持つエネルギー",
    "関係の流れ":"二人の間に流れる力",
    "アドバイス":"これから心がけるべきこと",
    "現状":"今の状況全体",
    "隠れた影響":"見えないところで働いている力",
    "乗り越える課題":"立ち向かうべき試練",
    "周囲の環境・人物":"あなたを取り巻く環境や人々",
    "近い未来":"もうすぐ訪れる出来事",
    "最終的な結果":"この流れが向かう先",
    "強み・才能":"あなたが持つ力と可能性",
    "障害":"克服すべき壁や問題",
    "最善の選択":"今最も良い行動の指針",
    "現在地":"あなたが今立っている場所",
    "選択肢A":"一方の道が持つエネルギー",
    "選択肢B":"もう一方の道が持つエネルギー",
    "捨てるもの":"手放すべき執着や考え",
    "最善の道":"運命が示す最良の選択",
    "現在の状況":"今の仕事・キャリアの状態",
    "過去の影響":"今に影響する過去の出来事",
    "中心（テーマ）":"このテーマの核心にあるもの",
    "精神面":"心・思考・信念の状態",
    "感情面":"感情・直感・内なる声",
    "物質面":"現実・お金・環境の状態",
    "自己":"今のあなた自身の本質",
    "愛・関係":"あなたの愛と人間関係",
    "仕事・使命":"あなたの天職と社会的役割",
    "お金・豊かさ":"物質的な豊かさと流れ",
    "健康・体":"心身のコンディション",
    "精神・魂":"スピリチュアルな成長",
    "才能・ギフト":"神から与えられた特別な資質",
    "全体のメッセージ":"9つを統合した宇宙からの言葉",
    "現状の流れ":"今置かれているエネルギー",
    "結論（YES/NO）":"答えが示す方向性"
  };
  // 月のマッピング（年間運勢）
  const months = ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"];

  const months = ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"];
  const posDesc = months.includes(position) ? (position + "の運気と流れ") : (posMap[position] || position + "の領域");

  const templates = card.reversed ? [
    `${rnd(INTRO)}「${card.name}（逆位置）」。${posDesc}において、${k1}が試されているサインです。${rnd(CONN)}${k2}に関する課題が浮き彫りになっています。これは批判ではなく、内側を見つめ直す機会。今こそ立ち止まり、何を手放すべきかを静かに問いかけてみてください。`,
    `「${card.name}」が逆位置で現れました。${posDesc}の文脈では、${k1}や${k2}のエネルギーが滞っているかもしれません。しかし、すべての停滞は次の前進への準備期間。焦らず、今できることに丁寧に向き合いましょう。`,
    `${posDesc}に「${card.name}（逆位置）」が寄り添っています。${k1}の面で揺れを感じているなら、それは正直な自分の声。${rnd(CONN)}${k2}を見直すことが、新しい光への扉となるでしょう。`,
    `「${card.name}（逆位置）」が伝えるのは、${posDesc}における${k1}への警告です。${rnd(CONN)}${k2}に関して、無理を重ねていないか振り返ってみましょう。一度ペースを落とすことが、後の安定につながります。`,
    `${posDesc}の領域に「${card.name}」が逆位置で現れたことは、${k1}を巡る感情の揺れを示しています。${k2}について誰かに頼ることをためらわないでください。助けを求めることは弱さではありません。`
  ] : [
    `${rnd(INTRO)}「${card.name}」。${posDesc}において、${k1}と${k2}のエネルギーが強く働いています。${rnd(CONN)}このカードはあなたに自信を持って前に進むよう告げています。今持っている力を信じてください。`,
    `「${card.name}」が${posDesc}に輝いています。${k1}の波動が高まり、${k2}の恩恵があなたを包んでいます。${rnd(CONN)}直感を大切にしながら、一歩一歩確かに歩んでいきましょう。`,
    `${posDesc}に「${card.name}」が現れました。${k1}が満ち、${k2}の可能性が広がっています。${rnd(CONN)}宇宙はあなたの意図に応えようとしています。心を開いて流れに乗ってください。`,
    `「${card.name}」のカードは、${posDesc}における${k1}の到来を告げています。${rnd(CONN)}${k2}を意識した小さな一歩が、思いのほか大きな実りへとつながっていくでしょう。`,
    `${posDesc}を象徴する「${card.name}」からは、${k1}と${k2}という二つの力が感じられます。今のあなたには、それらを受け取るだけの準備がすでに整っています。安心して前を向いてください。`
  ];
  return rnd(templates);
}

function generateOverall(cards, spreadType, question) {
  const q = question ? `「${question}」についての問いに対し、` : '';
  const cardNames = cards.map(c=>c.reversed?`${c.name}（逆）`:c.name).join('・');
  const positiveCount = cards.filter(c=>!c.reversed).length;
  const tone = positiveCount >= cards.length/2 ? "前向き" : "慎重";

  const msgs = [
    `${q}${cardNames}という組み合わせは、あなたの状況に深い意味を投げかけています。全体として${tone}なエネルギーが流れており、変化の兆しが感じられます。自分の内なる声を大切にしながら、一日一日を誠実に生きることが、望む未来への最短距離です。星はいつもあなたを照らしています。`,
    `${q}今回引かれた${cardNames}は、それぞれが呼応し合い一つのメッセージを紡いでいます。${tone}なエネルギーが基調となり、行動と内省のバランスが鍵となりそうです。恐れず、しかし焦らず——あなたのペースで歩みを進めてください。宇宙はあなたの側にあります。`,
    `${cardNames}というカードが示す今の流れは、${tone}な方向へと向かっています。大切なのは、外の出来事に振り回されるのではなく、自分自身の中心を保つこと。今日この鑑定があなたに届いたのも、偶然ではありません。必要なメッセージは、すでにあなたの心に届いているはずです。`
  ];
  return rnd(msgs);
}

async function showReading() {
  const sp = SPREADS[currentSpread];
  const question = document.getElementById('question').value.trim();
  const container = document.getElementById('reading-cards');
  container.innerHTML = '';
  document.getElementById('topic-readings').innerHTML = '';

  document.getElementById('reading-area').style.display = 'block';

  let cardTexts = null, overallText = null, topicResults = null;

  // ---- AIモードが有効な場合、Claude APIで動的生成を試みる ----
  if (isAiEnabled()) {
    document.getElementById('ai-loading').classList.add('show');
    try {
      const ai = await generateAiReading(sp, question);
      if (ai) {
        cardTexts = ai.cards;
        overallText = ai.overall;
        topicResults = ai.topics;
      }
    } catch(e) {
      console.error('AI鑑定の生成に失敗しました:', e);
    }
    document.getElementById('ai-loading').classList.remove('show');
  }

  // ---- カードごとの鑑定 ----
  const finalCardTexts = [];
  drawnCards.forEach((card, i) => {
    const text = (cardTexts && cardTexts[i]) ? cardTexts[i] : generateCardReading(card, sp.positions[i], currentSpread);
    finalCardTexts.push(text);
    const rc = document.createElement('div');
    rc.className = 'reading-card';
    rc.innerHTML = `
      <div class="reading-card-header">
        <div class="reading-symbol">${card.sym}</div>
        <div class="reading-meta">
          <div class="reading-position">${sp.positions[i]}</div>
          <div class="reading-card-name">${card.name}</div>
          ${card.reversed ? '<div class="reading-reversed">逆位置</div>' : ''}
        </div>
      </div>
      <div class="reading-text">${text}</div>
    `;
    container.appendChild(rc);
    setTimeout(()=>rc.classList.add('visible'), i*300+100);
  });

  // ---- 総合メッセージ ----
  const overall = document.getElementById('reading-overall');
  const finalOverall = overallText || generateOverall(drawnCards, currentSpread, question);
  document.getElementById('overall-text').textContent = finalOverall;
  setTimeout(()=>overall.classList.add('visible'), drawnCards.length*300+400);

  // ---- トピック別鑑定 ----
  const topicContainer = document.getElementById('topic-readings');
  const finalTopics = [];
  selectedTopics.forEach((topic, idx) => {
    const data = TOPIC_DATA[topic];
    let r;
    if (topicResults && topicResults[topic]) {
      r = { title: data.title, icon: data.icon, text: topicResults[topic] };
    } else {
      r = generateTopicReading(topic);
    }
    finalTopics.push(r);
    const tc = document.createElement('div');
    tc.className = 'reading-card';
    tc.innerHTML = `
      <div class="reading-card-header">
        <div class="reading-symbol">${r.icon}</div>
        <div class="reading-meta">
          <div class="reading-position">${r.title}</div>
        </div>
      </div>
      <div class="reading-text">${r.text}</div>
    `;
    topicContainer.appendChild(tc);
    setTimeout(()=>tc.classList.add('visible'), drawnCards.length*300+600+idx*250);
  });

  document.getElementById('reading-area').scrollIntoView({behavior:'smooth'});

  // ---- 履歴に保存 ----
  saveToHistory({
    date: new Date().toISOString(),
    spreadKey: currentSpread,
    spreadLabel: sp.label,
    question: question,
    cards: drawnCards.map((c,i)=>({
      name: c.name, sym: c.sym, n: c.n, reversed: c.reversed,
      position: sp.positions[i], text: finalCardTexts[i]
    })),
    overall: finalOverall,
    topics: finalTopics
  });
}

/* ============================================================
   AI鑑定モード（Claude API）
   ============================================================ */
function isAiEnabled() {
  return document.getElementById('ai-toggle').checked &&
         document.getElementById('ai-api-key').value.trim().length > 0;
}

function toggleAI() {
  const checked = document.getElementById('ai-toggle').checked;
  document.getElementById('ai-key-row').classList.toggle('show', checked);
  localStorage.setItem('tarotAiEnabled', checked ? '1' : '0');
}

function saveApiKey() {
  localStorage.setItem('tarotApiKey', document.getElementById('ai-api-key').value.trim());
}

function loadAiSettings() {
  const enabled = localStorage.getItem('tarotAiEnabled') === '1';
  const key = localStorage.getItem('tarotApiKey') || '';
  document.getElementById('ai-toggle').checked = enabled;
  document.getElementById('ai-api-key').value = key;
  document.getElementById('ai-key-row').classList.toggle('show', enabled);
}

async function generateAiReading(sp, question) {
  const apiKey = document.getElementById('ai-api-key').value.trim();
  if (!apiKey) return null;

  const cardsDesc = drawnCards.map((c,i)=>
    `${i+1}. ポジション「${sp.positions[i]}」: ${c.name}（${c.reversed ? '逆位置' : '正位置'}）`
  ).join('\n');

  const topicsDesc = selectedTopics.length
    ? selectedTopics.map(t=>`- ${t}: ${TOPIC_DATA[t].title}`).join('\n')
    : '（トピック指定なし）';

  const prompt = `あなたは経験豊かなプロのタロット占い師です。以下の鑑定結果について、温かく、具体的で、専門的な鑑定文を日本語で作成してください。

【スプレッド】${sp.label}
【質問・相談内容】${question || '（特になし。全体運として鑑定してください）'}

【引かれたカード】
${cardsDesc}

【追加で鑑定してほしいトピック】
${topicsDesc}

以下の形式の有効なJSONのみを出力してください。前置きや説明、コードブロック記号（\`\`\`）は一切含めないでください。

{
  "cards": ["1番目のカードの鑑定文（150〜220文字程度）", "2番目のカードの鑑定文", ...],
  "overall": "全体を通した総合メッセージ（200〜300文字程度）",
  "topics": {
    "トピックのキー（英語）": "そのトピックに関する鑑定文（150〜220文字程度）"
  }
}

cardsの配列は、上記カードの順番と同じ数・同じ順序にしてください。topicsは「追加で鑑定してほしいトピック」に挙げたキー（英語の識別子）のみを使ってください。鑑定文はカードの象徴と意味、正位置・逆位置の違いを踏まえ、具体的で実用的なアドバイスを含めてください。`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true"
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 2048,
      messages: [{ role: "user", content: prompt }]
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`API error ${response.status}: ${errText}`);
  }

  const data = await response.json();
  const text = data.content.map(b=>b.text||'').join('\n').trim();
  const clean = text.replace(/^```json\s*|^```\s*|```\s*$/g, '').trim();
  const parsed = JSON.parse(clean);
  return parsed;
}

/* ============================================================
   履歴機能（localStorage）
   ============================================================ */
const HISTORY_KEY = 'tarotHistory';
const HISTORY_MAX = 30;

function saveToHistory(entry) {
  let history = [];
  try { history = JSON.parse(localStorage.getItem(HISTORY_KEY)) || []; } catch(e) {}
  history.unshift(entry);
  if (history.length > HISTORY_MAX) history = history.slice(0, HISTORY_MAX);
  try { localStorage.setItem(HISTORY_KEY, JSON.stringify(history)); } catch(e) {
    console.warn('履歴の保存に失敗しました（容量上限の可能性があります）');
  }
  if (document.getElementById('history-area').style.display !== 'none') {
    renderHistory();
  }
}

function getHistory() {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY)) || []; } catch(e) { return []; }
}

function toggleHistoryView() {
  const area = document.getElementById('history-area');
  const show = area.style.display === 'none' || area.style.display === '';
  area.style.display = show ? 'block' : 'none';
  if (show) {
    renderHistory();
    area.scrollIntoView({behavior:'smooth'});
  }
}

function formatDate(iso) {
  const d = new Date(iso);
  return `${d.getFullYear()}/${String(d.getMonth()+1).padStart(2,'0')}/${String(d.getDate()).padStart(2,'0')} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
}

function renderHistory() {
  const history = getHistory();
  const list = document.getElementById('history-list');
  list.innerHTML = '';

  if (history.length === 0) {
    list.innerHTML = '<div class="history-empty">まだ鑑定履歴はありません。占いを行うと、ここに記録が残ります。</div>';
    return;
  }

  history.forEach((entry, idx) => {
    const cardNames = entry.cards.map(c=>`${c.name}${c.reversed?'(逆)':''}`).join('・');
    const item = document.createElement('div');
    item.className = 'history-item';
    item.innerHTML = `
      <div class="history-item-top">
        <div>
          <div class="history-date">${formatDate(entry.date)}</div>
          <div class="history-spread">${entry.spreadLabel}</div>
          ${entry.question ? `<div class="history-question">「${entry.question}」</div>` : ''}
          <div class="history-cards">${cardNames}</div>
        </div>
        <button class="history-delete" onclick="deleteHistoryItem(event, ${idx})">×</button>
      </div>
    `;
    item.addEventListener('click', (e)=>{
      if (e.target.classList.contains('history-delete')) return;
      openHistoryModal(idx);
    });
    list.appendChild(item);
  });

  const clearBtn = document.createElement('button');
  clearBtn.className = 'history-clear';
  clearBtn.textContent = '履歴をすべて削除';
  clearBtn.onclick = clearHistory;
  list.appendChild(clearBtn);
}

function deleteHistoryItem(e, idx) {
  e.stopPropagation();
  let history = getHistory();
  history.splice(idx, 1);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  renderHistory();
}

function clearHistory() {
  if (!confirm('鑑定履歴をすべて削除します。よろしいですか？')) return;
  localStorage.removeItem(HISTORY_KEY);
  renderHistory();
}

function openHistoryModal(idx) {
  const entry = getHistory()[idx];
  if (!entry) return;

  document.getElementById('modal-spread').textContent = `◈ ${entry.spreadLabel} ◈`;
  document.getElementById('modal-date').textContent = formatDate(entry.date);
  document.getElementById('modal-question').textContent = entry.question ? `占いたいこと：${entry.question}` : '';

  const cardsEl = document.getElementById('modal-cards');
  cardsEl.innerHTML = '';
  entry.cards.forEach(c => {
    const rc = document.createElement('div');
    rc.className = 'reading-card visible';
    rc.innerHTML = `
      <div class="reading-card-header">
        <div class="reading-symbol">${c.sym}</div>
        <div class="reading-meta">
          <div class="reading-position">${c.position}</div>
          <div class="reading-card-name">${c.name}</div>
          ${c.reversed ? '<div class="reading-reversed">逆位置</div>' : ''}
        </div>
      </div>
      <div class="reading-text">${c.text}</div>
    `;
    cardsEl.appendChild(rc);
  });

  document.getElementById('modal-overall-text').textContent = entry.overall;

  const topicsEl = document.getElementById('modal-topics');
  topicsEl.innerHTML = '';
  (entry.topics || []).forEach(t => {
    const tc = document.createElement('div');
    tc.className = 'reading-card visible';
    tc.innerHTML = `
      <div class="reading-card-header">
        <div class="reading-symbol">${t.icon}</div>
        <div class="reading-meta">
          <div class="reading-position">${t.title}</div>
        </div>
      </div>
      <div class="reading-text">${t.text}</div>
    `;
    topicsEl.appendChild(tc);
  });

  document.getElementById('modal-overlay').classList.add('show');
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('show');
}

function closeModalIfBackdrop(e) {
  if (e.target.id === 'modal-overlay') closeModal();
}

/* ============================================================
   初期化
   ============================================================ */
document.addEventListener('DOMContentLoaded', loadAiSettings);

function resetAll() {
  drawnCards = [];
  flippedCount = 0;
  document.getElementById('card-area').style.display = 'none';
  document.getElementById('reading-area').style.display = 'none';
  document.getElementById('reading-cards').innerHTML = '';
  document.getElementById('topic-readings').innerHTML = '';
  document.getElementById('btn-shuffle').disabled = false;
  document.querySelectorAll('.reading-card').forEach(el=>el.classList.remove('visible'));
  document.getElementById('reading-overall').classList.remove('visible');
  window.scrollTo({top:0,behavior:'smooth'});
}


/* サーバー履歴同期 */
window.saveToHistory = async function(entry) {
  try {
    await fetch('/api/history', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ spreadLabel: entry.spreadLabel, question: entry.question, data: entry })
    });
  } catch(e) {}
  // localStorageにも保存
  let h = []; try { h = JSON.parse(localStorage.getItem('tarotHistory') || '[]'); } catch(e) {}
  h.unshift(entry); if(h.length > 30) h = h.slice(0,30);
  try { localStorage.setItem('tarotHistory', JSON.stringify(h)); } catch(e) {}
};

const _origToggle = typeof toggleHistoryView === 'function' ? toggleHistoryView : null;
window.toggleHistoryView = async function() {
  const area = document.getElementById('history-area');
  const show = area.style.display === 'none' || area.style.display === '';
  area.style.display = show ? 'block' : 'none';
  if (show) {
    try {
      const rows = await fetch('/api/history').then(r => r.json());
      const norm = rows.map(r => ({ ...r.data_json, date: r.created_at, _serverId: r.id }));
      localStorage.setItem('tarotHistory', JSON.stringify(norm));
    } catch(e) {}
    if (typeof renderHistory === 'function') renderHistory();
    area.scrollIntoView({ behavior: 'smooth' });
  }
};
      ` }} />
    </>
  )
}
