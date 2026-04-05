# StackPick Affiliate Program Registration Guide

가입 우선순위: 커미션 높은 순 + 승인 빠른 순

---

## 즉시 가입 가능 (자동 승인 또는 1-2일)

### 1. Bluehost — $65-$130/sale
- 가입: https://www.bluehost.com/affiliates
- 네트워크: Impact
- 쿠키: 30일
- 승인: 자동 (Impact 계정 필요)
- 적용 페이지: bluehost-vs-siteground, bluehost-vs-hostinger, best-web-hosting

### 2. Hostinger — 40%+/sale
- 가입: https://www.hostinger.com/affiliates
- 네트워크: Direct
- 쿠키: 30일
- 승인: 1-2일
- 적용 페이지: bluehost-vs-hostinger, siteground-vs-hostinger, best-web-hosting

### 3. ClickUp — $25/free signup (구매 불필요!)
- 가입: https://clickup.com/partners
- 네트워크: PartnerStack
- 쿠키: 30일
- 승인: 자동
- 적용 페이지: clickup-vs-monday, asana-vs-clickup, notion-vs-clickup, best-project-management

### 4. Moosend — 40% lifetime recurring
- 가입: https://moosend.com/affiliate-program/
- 네트워크: Direct
- 쿠키: 90일
- 승인: 1-2일
- 적용 페이지: moosend-vs-mailchimp, best-email-marketing

### 5. Systeme.io — 60% lifetime recurring (최고 커미션)
- 가입: https://systeme.io/affiliate-program
- 네트워크: Direct
- 쿠키: 180일
- 승인: 자동
- 적용 페이지: systeme-io-vs-getresponse, best-marketing-automation

### 6. NordVPN — 40-100% new + 30% renewal
- 가입: https://nordvpn.com/affiliate/
- 네트워크: Direct (NordVPN CPS)
- 쿠키: 30일
- 승인: 1-3일
- 적용 페이지: nordvpn-vs-expressvpn, nordvpn-vs-surfshark, nordvpn-vs-cyberghost, best-vpn

---

## 1주 내 승인 예상

### 7. WP Engine — $200+/sale (최고 단가)
- 가입: https://wpengine.com/affiliate-program/
- 네트워크: ShareASale
- 쿠키: 180일
- 승인: 3-7일
- 적용 페이지: wp-engine-vs-kinsta, cloudways-vs-wp-engine, best-web-hosting

### 8. Kinsta — $50-500 + 10% lifetime
- 가입: https://kinsta.com/affiliates/
- 네트워크: Direct
- 쿠키: 60일
- 승인: 1-3일
- 적용 페이지: wp-engine-vs-kinsta, best-web-hosting

### 9. GetResponse — 33% lifetime recurring
- 가입: https://www.getresponse.com/affiliate-programs
- 네트워크: Direct
- 쿠키: 120일
- 승인: 1-3일
- 적용 페이지: activecampaign-vs-getresponse, systeme-io-vs-getresponse, best-email-marketing, best-marketing-automation

### 10. HubSpot — 30% recurring
- 가입: https://www.hubspot.com/partners/affiliates
- 네트워크: Impact
- 쿠키: 180일
- 승인: 3-7일 (사이트 리뷰)
- 적용 페이지: hubspot-crm-vs-pipedrive, hubspot-vs-activecampaign, best-crm, best-marketing-automation

### 11. Pipedrive — 33% recurring 12mo
- 가입: https://www.pipedrive.com/en/affiliates
- 네트워크: PartnerStack
- 쿠키: 90일
- 승인: 1-3일
- 적용 페이지: hubspot-crm-vs-pipedrive, freshsales-vs-pipedrive, pipedrive-vs-monday-crm, best-crm

### 12. ActiveCampaign — 30% recurring 12mo
- 가입: https://www.activecampaign.com/partners/affiliate
- 네트워크: PartnerStack
- 쿠키: 90일
- 승인: 1-3일
- 적용 페이지: activecampaign-vs-getresponse, activecampaign-vs-keap, hubspot-vs-activecampaign, best-email-marketing, best-marketing-automation

### 13. Shopify — $100-150/referral
- 가입: https://www.shopify.com/affiliates
- 네트워크: Impact
- 쿠키: 30일
- 승인: 3-7일 (사이트 리뷰)
- 적용 페이지: shopify-vs-woocommerce, shopify-vs-bigcommerce, shopify-vs-squarespace, wix-vs-shopify, best-ecommerce

### 14. Teachable — 30% lifetime recurring
- 가입: https://teachable.com/affiliates
- 네트워크: Direct (via Impact)
- 쿠키: 30일
- 승인: 1-3일
- 적용 페이지: teachable-vs-thinkific, kajabi-vs-teachable, podia-vs-teachable, best-online-course-platforms

### 15. LiveChat — 20% lifetime recurring
- 가입: https://partners.livechat.com/affiliate-program/
- 네트워크: Direct
- 쿠키: 120일
- 승인: 1-2일
- 적용 페이지: livechat-vs-tidio, livechat-vs-intercom, best-helpdesk-software

---

## 가입 후 할 일

1. 각 프로그램에서 affiliate link 복사
2. src/data/*.json 파일에서 affiliateUrl 필드 교체
3. 페이지 재생성:
   ```bash
   node generate-comparison.mjs --data src/data/web-hosting.json --all
   node generate-best-of.mjs --data src/data/web-hosting.json --slug best-web-hosting
   # 각 카테고리 반복
   ```
4. 빌드 & 배포:
   ```bash
   npx astro build
   git add -A && git commit -m "Update affiliate links" && git push
   ```

## 예상 수익 (전체 승인 후)

| 카테고리 | 핵심 프로그램 | 월 예상 |
|---|---|---|
| Web Hosting | Bluehost $65 + WP Engine $200 | $810 |
| Email Marketing | GetResponse 33% + Moosend 40% | $340 |
| CRM | HubSpot 30% + Pipedrive 33% | $405 |
| Marketing Automation | Systeme.io 60% + ActiveCampaign 30% | $380 |
| E-Commerce | Shopify $150 + BigCommerce 200% | $450 |
| VPN | NordVPN 100% + Surfshark 40% | $520 |
| Project Management | ClickUp $25/free + Monday 100% | $300 |
| Website Builders | Webflow 50% + Wix $100 | $350 |
| Online Courses | Kajabi 30% lifetime + Teachable 30% | $290 |
| Helpdesk | LiveChat 20% lifetime | $260 |
| **Total** | | **$4,105/월** |
