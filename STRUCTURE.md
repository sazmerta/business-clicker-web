# بنية Business Clicker Web

- `client/src/pages/Home.tsx`: واجهة اللعبة، حالة الاقتصاد، الحفظ المحلي، وسجل النشاط.
- `client/src/index.css`: هوية Arcade Ledger، التخطيط المتجاوب، الحركة، والملمس البصري.
- `client/src/App.tsx`: نقطة الدخول والمسار الرئيسي.
- `client/index.html`: عنوان اللعبة وخطوط Google Fonts.

## نموذج البيانات

`GameState` يتكون من `money`, `clickPower`, `clickUpgradeLevel`, `autoIncome`, `assets[]`, `events[]`, و`lifetime`.

## قرار معماري
هذه النسخة لا تحتاج محركًا ثلاثي الأبعاد؛ اللعبة الأصلية عبارة عن اقتصاد نقر وواجهات Unity UI. لذلك تم نقل المنطق إلى React state مع مؤقت interval واحد للربح التلقائي، وإبقاء واجهة المستخدم قابلة للوصول عبر أزرار HTML حقيقية.
