Ти — Senior Data Analyst + Senior Frontend Developer.
Працюй безпосередньо з поточним репозиторієм.

У репозиторії вже знаходиться підготовлений аналітиком файл: data.xlsx
Це готовий очищений dataset, тому не потрібно вручну створювати або перераховувати колонки, які вже є у файлі.

Зокрема, аналітик уже підготував:
concept — концепт креативу;
success — результат виконання performance target.
success має значення, які позначають, чи виконав creative target.

Перед початком реалізації сам перевір фактичні назви колонок та значення в success, але не змінюй dataset без необхідності.

Завдання:
Створи інтерактивний performance marketing dashboard на:
- Next.js
- TypeScript
- Tailwind CSS
- Recharts

Dashboard має аналізувати рекламні creatives з data.xlsx.
Це повинен бути не просто набір графіків, а зрозумілий decision-making dashboard, за яким можна швидко побачити:
- куди витрачається рекламний бюджет;
- які creatives ефективні;
- які creatives не виконали target;
- які audiences працюють краще;
- які concepts працюють краще;
- які influencers показують кращі результати;
- які creative types та languages використовують бюджет;
- де знаходяться найбільші неефективні витрати.

1. Спочатку проаналізуй dataset
Перш ніж створювати UI:
- знайди data.xlsx у repository;
- прочитай його;
- визнач фактичні назви колонок;
- визнач типи даних;
- перевір unique values для: audience, type, language, concept, success;
- перевір missing/null values;
- перевір формат: ROI, percentage metrics, currency metrics;
- коротко повідом мені, як ти зрозумів структуру dataset.

Не вигадуй mock data.
Усі графіки, KPI та insights повинні будуватися тільки на реальному data.xlsx.

2. Business Logic
Основна логіка performance:
MN:
- effective if ROI > 0
- Чим більший ROI — тим кращий результат.
WMN:
- effective if CPU Slay < $30
- Чим нижчий CPU Slay — тим кращий результат.

Dataset уже має колонку: success.
Використовуй її як основне готове позначення effective / ineffective.
При цьому перевір, що її значення узгоджуються з описаною вище business logic. Не перераховуй і не переписуй success, якщо дані коректні.

3. Дуже важливе правило
Не порівнюй ROI та CPU Slay напряму.
Це дві різні performance metrics:
- ROI → higher is better;
- CPU Slay → lower is better.

Тому не роби:
- спільний average;
- єдиний ranking, де ROI та CPU Slay змішані;
- одну Y-axis для цих метрик.
Якщо потрібно аналізувати MN та WMN одночасно, використовуй success / success rate або розділяй аналіз аудиторій.

4. Color Logic
Основний стиль dashboard: dopamine aesthetic blue.
Для звичайної структури даних використовуй: electric blue, cobalt blue, blue gradients, світлі blue accents.
Для performance status:
🟢 green = effective / target achieved
🔴 red = ineffective / target not achieved
⚪️ gray = missing / insufficient data, якщо таке є.
Не використовуй green/red для звичайних categorical charts без performance meaning.

5. Dashboard Header
Title: Creative Performance Dashboard
Subtitle: Performance Marketing Analytics
Додай невеликий badge: Creative Analytics
Header має виглядати сучасно, але не займати надто багато місця.

6. Global Filters
У верхній частині dashboard зроби filters: Audience, Creative Type, Influencer, Language, Concept, Efficiency / Success.
Efficiency: All, Effective, Ineffective.
Додай: Reset Filters.
Filters повинні працювати глобально. Після зміни filter мають автоматично оновлюватися: KPI, charts, Top Creatives, Cost of Failure, Insights.

7. KPI Overview
Після filters зроби ряд основних KPI cards:
- Total Spend: SUM(spend)
- Total Creatives: кількість creatives після filtering
- Effective Creatives: кількість success = effective
- Ineffective Creatives: кількість success = ineffective
- Success Rate: effective creatives / all valid creatives * 100
- Spend on Underperforming Creatives: SUM(spend) для ineffective creatives.
Для monetary values використовуй зрозуміле currency formatting.

8. Spend Structure
Створи section: Spend Structure.
Покажи структуру рекламних витрат за: audience, creative type, influencer, language, concept, efficiency.
Не роби всі visualizations однаковими.

Spend by Audience: Donut Chart. Покажи MN, WMN. Tooltip: audience, spend, % total spend.
Spend by Creative Type: Bar Chart (static, motion).
Spend by Language: Bar Chart.
Top Influencers by Spend: Horizontal Bar Chart (Top 10).
Top Concepts by Spend: Horizontal Bar Chart (Top 10).

9. Effective vs Ineffective Spend
Створи важливу section: Effective vs Ineffective Spend.
Покажи, скільки бюджету припадає на: 🟢 Effective Creatives, 🔴 Ineffective Creatives.
Обов'язково покажи: Ineffective Spend Share (ineffective spend / total spend * 100).

10. Spend + Performance Structure
Додай більш глибоку visualization: Where Is the Budget Working?
Побудуй stacked charts, де spend категорії розділений на 🟢 Effective Spend та 🔴 Ineffective Spend для: Creative Type, Language, Influencer, Concept. (Використовуй Top 10 для великих категорій).

11. Top Creatives (Tabs)
Tab 1 — By Spend: Top 10 by spend (Creative Name, Audience, Concept, Influencer, Spend, ROI/CPU Slay, Status badge).
Tab 2 — By Performance: Окремі рейтинги (MN за ROI DESC, WMN за CPU Slay ASC).
Tab 3 — By Influencer: Select Influencer -> creatives list.
Tab 4 — By Conversion: Toggle "Paid Conversion | Slay Conversion". Покажи Top за `paid_units_share` або `slay_share`. Відсотки форматуй правильно (0.145 -> 14.5%).

12. Spend vs Performance
Створи scatter plot.
MN View: X=Spend, Y=ROI. Reference line: ROI=0. Green dots > 0, Red dots <= 0.
WMN View: X=Spend, Y=CPU Slay. Reference line: CPU Slay=30. Green dots < 30, Red dots >= 30.
Якщо Audience = All, покажи toggle для перемикання MN/WMN.

13. Influencer Performance
Агрегуй дані. Для кожного: Total Spend, Creatives count, Effective, Ineffective, Success Rate, Ineffective Spend.
Таблиця + Chart (Spend vs Success Rate by Influencer).

14. Concept Performance
Агрегуй по concept. Таблиця + Chart (Top Concepts by Spend & Performance). Поруч зі spend завжди показуй Success Rate.

15. CUSTOM IDEA — Cost of Failure
💸 Cost of Failure (Which underperforming creatives consumed the most budget?)
Тільки creatives зі success = ineffective. Sort by spend DESC (Top 5).
Horizontal Bar Chart (bars in red). В tooltip показувати target vs actual result (наприклад: ROI: -18.4% | Target: > 0%).
Додай KPI: Spend on Underperforming Creatives та Share of Budget on Underperforming Creatives.

16. Automatic Data Insights
3–5 коротких автоматичних інсайтів на основі відфільтрованих даних.
НЕ використовуй LLM API. Тільки математичні обчислення в frontend-логіці.

17. Formatting
Currency: spend, cpu, cpm, cpc, cpu_slay.
Percentages: ROI, CTR, Hook, Hold, CR, share-метрики. Перевір формат (0.3191 = 31.91%).
Missing values: "—" або "No data", не перетворюй на 0.

18. Design (Dopamine Blue Analytics)
Світлий фон, electric blue, clean spacing, rounded corners.
Green тільки для success, Red тільки для failure. Сучасний і преміальний вигляд.

19. UX
Responsive design, hover tooltips, legends, empty states. Уникай horizontal overflow.

20. Data Architecture (Strict JSON Pipeline)
data.xlsx уже лежить у repository. Читати Excel-файл безпосередньо у Next.js компонентах — це погана практика, яка тягне важкі бібліотеки і ламає Vercel deployment.
Тому зроби наступне:
1. Створи Node.js скрипт (наприклад, `scripts/convertData.mjs`), який за допомогою бібліотеки `xlsx` читає `data.xlsx` і зберігає результат як `data.json` у папку `public` або `src/data`.
2. Додай у `package.json` команду для генерації перед білдом: `"predev": "node scripts/convertData.mjs"`, `"prebuild": "node scripts/convertData.mjs"`.
3. Додай бібліотеку `xlsx` у `devDependencies`, щоб вона не потрапила у production bundle.
4. Next.js dashboard повинен читати ТІЛЬКИ згенерований `data.json` (через звичайний `import` або `fetch`).

21. Project Structure
Використай компонентну архітектуру (components/dashboard/, lib/analytics.ts і т.д.). Не пиши все в одному page.tsx.

22. Code Quality
Reusable components, TypeScript interfaces, centralized formatting. No `any`.

23. Vercel Deployment Requirement
Проєкт повинен бути готовим до Vercel. `npm run build` має проходити без помилок.

24. Workflow
Step 1: Аналіз data.xlsx.
Step 2: Написання скрипта генерації JSON (див. п.20) і генерація даних.
Step 3: Створення типів та data layer (на основі JSON).
Step 4: Реалізація UI та графіків.
Step 5: Валідація розрахунків.
Step 6: UI Polish.
Step 7: Перевірка build.

25. Final Checklist
- Використовується реальний JSON, згенерований з data.xlsx.
- Скрипт конвертації працює коректно.
- Concept та Success беруться з готових колонок.
- Фільтри та KPI працюють глобально.
- Колірна логіка (Зелений/Червоний) дотримана суворо.
- Проєкт без проблем білдиться.

26. Після завершення
Коротко поясни структуру, як запустити конвертер, як підтягуються дані і як задеплоїти на Vercel.