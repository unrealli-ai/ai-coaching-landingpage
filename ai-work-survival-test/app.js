(function () {
  const SESSION_KEY = 'unrealli_ai_survival_session_id';
  const COACHING_URL = 'https://kmong.com/gig/759427';
  const APPS_SCRIPT_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxGaEA5l7i-ux1cdW-vcIy8pfQwhqPOQfDtv4aA9pAY2K4CUGBawbUvJfhDpBwVvl5uEw/exec";

  const QUESTIONS = [
    {
      id: 'q1',
      title: 'AI를 업무에 얼마나 써봤나요?',
      scored: true,
      options: [
        [1, '거의 안 써봤어요'],
        [2, '가끔 검색이나 질문할 때만 써요'],
        [3, '문서/메일/정리 업무에 가끔 써요'],
        [4, '반복 업무에 꽤 자주 써요'],
        [5, '업무 방식 일부를 AI로 바꿔봤어요'],
      ],
    },
    {
      id: 'q2',
      title: 'AI를 쓸 때 보통 어떻게 쓰나요?',
      scored: true,
      options: [
        [1, '뭘 물어봐야 할지 몰라서 잘 못 써요'],
        [2, '생각나는 대로 질문하고 답변만 봐요'],
        [3, '초안 작성이나 요약에 써요'],
        [4, '내 자료를 넣고 결과물을 다듬어요'],
        [5, '반복해서 쓸 수 있는 프롬프트/양식으로 만들어 써요'],
      ],
    },
    {
      id: 'q3',
      title: 'AI를 업무에 쓰면서 제일 막히는 건 뭔가요?',
      scored: true,
      options: [
        [1, '어떤 업무에 써야 할지 모르겠어요'],
        [2, 'AI에게 뭐라고 물어봐야 할지 모르겠어요'],
        [3, '답변은 나오는데 업무에 바로 쓰기 애매해요'],
        [4, '내 자료나 파일을 어떻게 넣어야 할지 모르겠어요'],
        [5, '한 번은 되는데 반복해서 쓰기 어려워요'],
      ],
    },
    {
      id: 'q4',
      title: '가장 줄이고 싶은 반복 업무는 뭔가요?',
      scored: false,
      options: [
        [0, '자료 찾고 정리하기'],
        [0, '글/문서/보고서 초안 쓰기'],
        [0, '엑셀·시트 정리하기'],
        [0, '여러 파일이나 내용을 하나로 합치기'],
        [0, '숫자나 내용이 맞는지 확인하기'],
        [0, '메일·메시지 답변 쓰기'],
        [0, '회의록·메모 정리하기'],
        [0, '반복 업무가 많긴 한데 뭘 줄일지 모르겠어요'],
      ],
    },
    {
      id: 'q5',
      title: '지금 가장 필요한 도움은 뭔가요?',
      scored: true,
      options: [
        [1, '내 업무에 AI를 어디에 쓸 수 있는지 알고 싶어요'],
        [2, '내 업무에 맞는 질문/프롬프트를 만들고 싶어요'],
        [3, '엑셀·시트·자료를 더 깔끔하게 정리하고 싶어요'],
        [4, '반복 업무를 줄이는 방법을 같이 찾아보고 싶어요'],
        [5, '내 업무 방식 자체를 AI로 업그레이드하고 싶어요'],
      ],
    },
  ].map((question) => ({
    ...question,
    options: question.options.map((option) => ({
      score: option[0],
      value: option[1],
      label: option[1],
    })),
  }));

  const RESULTS = [
    {
      level: 1,
      min: 4,
      max: 6,
      title: 'AI 구경러',
      verdict: 'AI가 좋다는 말은 많이 들었지만, 아직 내 업무에 붙일 첫 단추를 찾는 단계예요.',
      blocker: ['어떤 업무부터 AI에 맡겨야 할지 흐릿해요.', '질문을 시작하는 것 자체가 부담스러울 수 있어요.'],
      next: ['오늘 했던 반복 업무 하나만 골라보세요.', 'AI에게 “이 일을 더 빨리 끝내는 방법을 알려줘”라고 물어보세요.'],
    },
    {
      level: 2,
      min: 7,
      max: 10,
      title: '복붙 생존러',
      verdict: 'AI를 가끔 쓰지만, 아직 답변을 복사해 고치는 수준에 머무를 가능성이 높아요.',
      blocker: ['질문이 짧아서 결과가 매번 흔들릴 수 있어요.', '내 자료나 원하는 형식을 함께 주는 습관이 아직 약할 수 있어요.'],
      next: ['“정리해줘” 대신 결과물 형식까지 같이 말해보세요.', '자주 쓰는 문장이나 양식을 하나 만들어두세요.'],
    },
    {
      level: 3,
      min: 11,
      max: 14,
      title: '프롬프트 견습생',
      verdict: 'AI로 초안이나 요약은 만들 수 있지만, 반복해서 쓰는 방식은 아직 다듬는 중이에요.',
      blocker: ['업무마다 새로 질문하느라 시간이 다시 들 수 있어요.', '좋은 결과가 나와도 다음에 재사용하기 어려울 수 있어요.'],
      next: ['반복 업무 하나를 골라 고정 질문 양식으로 바꿔보세요.', '자료, 조건, 결과물 형식을 한 번에 묶어보세요.'],
    },
    {
      level: 4,
      min: 15,
      max: 17,
      title: 'AI 업무 부스터',
      verdict: 'AI를 업무 속도 개선에 꽤 잘 쓰고 있어요. 이제 반복되는 일의 틀을 만드는 단계예요.',
      blocker: ['프롬프트만으로는 부족한 업무가 보이기 시작할 수 있어요.', '시트 구조나 검수 기준까지 같이 정리하면 효과가 커져요.'],
      next: ['자주 하는 일을 체크리스트와 입력 양식으로 고정해보세요.', 'AI가 할 일과 내가 확인할 일을 분리해보세요.'],
    },
    {
      level: 5,
      min: 18,
      max: 20,
      title: '워크플로우 빌더',
      verdict: 'AI를 단순 질문 도구가 아니라, 내 업무 방식을 바꾸는 도구로 보기 시작한 단계예요.',
      blocker: ['개별 질문보다 반복 가능한 운영 방식이 더 중요해져요.', '내 업무를 팀이나 고객에게도 재사용 가능한 형태로 정리할 수 있어요.'],
      next: ['반복 업무를 단계별 흐름으로 적어보세요.', '사람이 판단할 부분과 AI가 도울 부분을 나눠보세요.'],
    },
  ];

  const DEFAULT_BEFORE_AFTER = {
    title: '반복 업무, 이렇게 줄일 수 있어요',
    items: [
      ['여러 파일 복붙', '한 번에 모아 정리'],
      ['보고서 빈 문서', 'AI 초안 만들기'],
      ['눈으로 검수', '오류 후보 먼저 찾기'],
    ],
  };

  const BEFORE_AFTER_BY_LEVEL = {
    1: {
      title: 'AI에게 맡길 수 있는 일부터 찾아보세요',
      items: [
        ['어디에 쓸지 모름', '반복 업무부터 찾기'],
        ['검색만 하다 끝남', '내 업무 질문해보기'],
        ['혼자 다 처리함', 'AI에게 초안 맡기기'],
      ],
    },
    2: {
      title: '복붙에서 벗어나, 내 업무에 맞게 바꿔보세요',
      items: [
        ['답변만 복붙', '내 상황에 맞게 수정'],
        ['질문이 매번 달라짐', '자주 쓰는 질문 저장'],
        ['결과가 애매함', '원하는 형식까지 요청'],
      ],
    },
    3: {
      title: '이제 반복해서 쓸 수 있는 방식으로 정리해보세요',
      items: [
        ['매번 새로 질문', '업무별 프롬프트 만들기'],
        ['초안만 받고 끝', '검수 기준까지 추가'],
        ['파일 정리가 어려움', '자료 넣는 방식 정리'],
      ],
    },
    4: {
      title: '잘 쓰고 있습니다. 이제 흐름으로 묶을 차례예요',
      items: [
        ['작업마다 따로 AI 사용', '반복 흐름으로 연결'],
        ['결과물마다 품질 차이', '기준 문서로 품질 고정'],
        ['혼자만 잘 씀', '팀도 쓸 수 있게 정리'],
      ],
    },
    5: {
      title: '이미 잘하고 있습니다. 이제 자동화 구조로 확장해보세요',
      items: [
        ['AI를 개별 작업에 사용', '업무 흐름 전체로 설계'],
        ['사람이 매번 실행', '버튼·시트·자동화로 연결'],
        ['나만 아는 방식', '팀 운영 시스템으로 정리'],
      ],
    },
  };

  const SPRITES = {
    robot: [
      '.....kkkk.....', '......kk......', '...kkkkkkkk...', '..klllllllkk..', '.kltwwwttwwlk.',
      '.kltwkwttwkwlk', '.kltwwwttwwlk.', '.kl..tttt..lk.', 'kkl........lk.', 'kklllllllllk..',
      '.kkkkkkkkkk...', '....k....k....', '...kkk..kkk...',
    ],
    check: ['......tt', '.....tt.', '....tt..', 'k..tt...', 'kktt....', '.ktt....', '..t.....'],
  };

  const PAL = {
    '.': null,
    k: '#0D1530',
    w: '#fff',
    t: '#BFEFD9',
    T: '#66C9AC',
    l: '#D9D3FF',
  };

  const state = {
    sessionId: getSessionId(),
    source: getSource(),
    view: 'hero',
    index: 0,
    answers: {},
    resultPayload: null,
    reportRequestPayload: null,
  };

  const root = document.getElementById('root');

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  }

  function createId() {
    if (window.crypto && typeof window.crypto.randomUUID === 'function') return window.crypto.randomUUID();
    return `id_${Date.now()}_${Math.random().toString(36).slice(2, 12)}`;
  }

  function captureEvent(eventName, properties) {
    if (window.posthog && typeof window.posthog.capture === 'function') {
      window.posthog.capture(eventName, properties || {});
    }
  }

  async function sendToGoogleSheets(payload) {
    if (!APPS_SCRIPT_WEB_APP_URL) {
      console.info("Apps Script URL is empty. Skipping Google Sheets save.", payload);
      return;
    }

    try {
      await fetch(APPS_SCRIPT_WEB_APP_URL, {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify(payload),
      });
    } catch (error) {
      console.error("Failed to send payload to Google Sheets:", error);
    }
  }

  function getSessionId() {
    try {
      const saved = localStorage.getItem(SESSION_KEY);
      if (saved) return saved;
      const next = createId();
      localStorage.setItem(SESSION_KEY, next);
      return next;
    } catch (_) {
      return createId();
    }
  }

  function getSource() {
    const params = new URLSearchParams(window.location.search);
    return params.get('source') || params.get('utm_source') || 'direct';
  }

  function answerText(answer) {
    return answer ? answer.label || answer.value || '' : '';
  }

  function resultByScore(score) {
    return RESULTS.find((result) => score >= result.min && score <= result.max) || RESULTS[0];
  }

  function getPrimaryOfferFit(answers) {
    const q5 = answerText(answers.q5);
    if (q5 === '내 업무에 AI를 어디에 쓸 수 있는지 알고 싶어요') return 'AI코칭형';
    if (q5 === '내 업무에 맞는 질문/프롬프트를 만들고 싶어요') return '프롬프트실습형';
    if (q5 === '엑셀·시트·자료를 더 깔끔하게 정리하고 싶어요') return '데이터구조화형';
    if (q5 === '반복 업무를 줄이는 방법을 같이 찾아보고 싶어요') return '자동화진단형';
    if (q5 === '내 업무 방식 자체를 AI로 업그레이드하고 싶어요') return '시스템설계형';
    return 'AI코칭형';
  }

  function getTaskTag(answers) {
    const q4 = answerText(answers.q4);
    if (q4 === '자료 찾고 정리하기') return '리서치요약형';
    if (q4 === '글/문서/보고서 초안 쓰기' || q4 === '회의록·메모 정리하기') return '문서작성형';
    if (q4 === '엑셀·시트 정리하기') return '시트정리형';
    if (q4 === '여러 파일이나 내용을 하나로 합치기') return '자료취합형';
    if (q4 === '숫자나 내용이 맞는지 확인하기') return '검수정리형';
    if (q4 === '메일·메시지 답변 쓰기') return '고객응대형';
    return '일반업무형';
  }

  function buildResultPayload() {
    const totalScore = ['q1', 'q2', 'q3', 'q5'].reduce((sum, id) => sum + (state.answers[id]?.score || 0), 0);
    const result = resultByScore(totalScore);
    const q3Answer = answerText(state.answers.q3);
    const q4Answer = answerText(state.answers.q4);
    const q5Answer = answerText(state.answers.q5);

    return {
      type: "test_response",
      submitted_at: new Date().toISOString(),
      session_id: state.sessionId,
      attempt_id: createId(),
      source: state.source,
      q1_score: state.answers.q1?.score || null,
      q1_answer: answerText(state.answers.q1),
      q2_score: state.answers.q2?.score || null,
      q2_answer: answerText(state.answers.q2),
      q3_score: state.answers.q3?.score || null,
      q3_answer: q3Answer,
      q4_score: "",
      q4_task_type: q4Answer,
      q4_answer: q4Answer,
      q5_score: state.answers.q5?.score || null,
      q5_answer: q5Answer,
      q5_bottleneck: q3Answer,
      q6_task_type: q4Answer,
      q7_score: "",
      q7_answer: "",
      q8_needed_help: q5Answer,
      free_text_task: "",
      total_score: totalScore,
      result_level: result.level,
      result_title: result.title,
      primary_offer_fit: getPrimaryOfferFit(state.answers),
      task_tag: getTaskTag(state.answers),
      user_agent: navigator.userAgent,
    };
  }

  function sprite(name, scale) {
    const rows = SPRITES[name];
    if (!rows) return '';
    const rects = rows.flatMap((row, y) => row.split('').map((char, x) => {
      const fill = PAL[char];
      return fill ? `<rect x="${x}" y="${y}" width="1" height="1" fill="${fill}"></rect>` : '';
    })).join('');
    return `<svg viewBox="0 0 ${rows[0].length} ${rows.length}" width="${rows[0].length * scale}" height="${rows.length * scale}" style="shape-rendering:crispEdges;image-rendering:pixelated;display:block">${rects}</svg>`;
  }

  function brand() {
    return '<div class="brand"><span class="brand-mark" aria-hidden="true"><span></span></span><span class="brand-name">UNREALLI</span></div>';
  }

  function shell(content, compact) {
    return `<main class="app-shell ${compact ? 'compact' : ''}" data-event="page_view"><div class="page-grid" aria-hidden="true"></div><header class="topbar">${brand()}<span class="topbar-kicker">AI WORK SURVIVAL TEST</span></header>${content}</main>`;
  }

  function renderHero() {
    root.innerHTML = shell(`
      <section class="hero-layout hero-ad">
        <div class="hero-copy">
          <h1><span class="title-line"><span class="text-accent">AI</span>는 다들 쓴다는데,</span><span class="title-line">내 업무는 왜 <span class="text-peach">그대로</span>일까요?</span></h1>
          <p class="lead"><span class="sub-accent">5문항</span>으로 확인하는<br>내 AI 업무 생존력 레벨</p>
        </div>
        <div class="hero-scene image-scene pixel-card mint">
          <picture>
            <source media="(max-width: 620px)" srcset="assets/hero-mobile.png">
            <img class="character-main-image" src="assets/hero-pc.png" alt="외계인 직장인과 AI 도우미가 함께 업무를 보는 장면">
          </picture>
        </div>
        <button class="btn-pixel hero-cta" data-action="start" data-event="start_test_click">내 레벨 확인하기 →</button>
      </section>
    `);
  }

  function renderQuestion() {
    const q = QUESTIONS[state.index];
    const selected = state.answers[q.id];
    root.innerHTML = shell(`
      <section class="question-panel" data-event="question_${state.index + 1}_viewed">
        <div class="question-head"><button class="text-button" data-action="prev">← 이전</button><span class="step-count">${String(state.index + 1).padStart(2, '0')} / ${String(QUESTIONS.length).padStart(2, '0')}</span></div>
        <div class="progress">${QUESTIONS.map((_, index) => `<span class="${index <= state.index ? 'on' : ''}"></span>`).join('')}</div>
        <div class="question-body">
          <div class="eyebrow">QUESTION ${String(state.index + 1).padStart(2, '0')}</div>
          <h2>${escapeHtml(q.title)}</h2>
          <div class="choice-list">${q.options.map((option, index) => {
            const active = answerText(selected) === option.label;
            return `<button class="choice ${active ? 'selected' : ''}" data-action="select" data-index="${index}" data-event="question_${state.index + 1}_answered"><span class="num">${String.fromCharCode(65 + index)}</span><span class="choice-text">${escapeHtml(option.label)}</span>${active ? '<span class="choice-check" aria-hidden="true"></span>' : ''}</button>`;
          }).join('')}</div>
        </div>
      </section>
    `, true);
  }

  function resultCard(tone, title, items) {
    return `<article class="diag ${tone}"><h3>${title}</h3><ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul></article>`;
  }

  function renderBeforeAfter(result) {
    const data = BEFORE_AFTER_BY_LEVEL[result.level] || DEFAULT_BEFORE_AFTER;
    return `<section class="before-after-section"><h3>${escapeHtml(data.title)}</h3><div class="before-after-box">${data.items.map((pair) => `
      <div class="ba-row"><span>${escapeHtml(pair[0])}</span><b>→</b><strong>${escapeHtml(pair[1])}</strong></div>
    `).join('')}</div></section>`;
  }

  function renderCheatCode() {
    return `<details class="cheat-card">
      <summary>🎁 오늘의 AI 치트코드 보기</summary>
      <div class="cheat-content">
        <p>내가 반복하는 업무는 [업무명]이야.<br>입력 자료는 [자료]이고,<br>원하는 결과물은 [결과물 형식]이야.</p>
        <p>이 업무를 AI로 줄이려면</p>
        <ol>
          <li>어떤 순서로 맡기면 좋을지</li>
          <li>어떤 프롬프트를 쓰면 좋을지</li>
          <li>내가 검수해야 할 부분은 뭔지</li>
        </ol>
        <p>정리해줘.</p>
      </div>
    </details>`;
  }

  function getFinalCardAsset(level) {
    const safeLevel = Number(level) >= 1 && Number(level) <= 5 ? Number(level) : 3;
    return {
      level: safeLevel,
      src: `assets/final-level-${safeLevel}.png`,
      download: `ai-work-survival-card-level-${safeLevel}.png`,
    };
  }

  function renderResult() {
    const payload = state.resultPayload;
    const result = resultByScore(payload.total_score);
    const cardAsset = getFinalCardAsset(result.level);
    root.innerHTML = shell(`
      <section class="result-layout result-focused" id="preview-result" data-event="result_viewed">
        <div class="result-main pixel-card">
          <div class="final-card-frame">
            <img class="final-result-card-image" src="${cardAsset.src}" alt="AI 업무 생존력 카드 LV.${String(cardAsset.level).padStart(2, '0')} ${escapeHtml(result.title)}" loading="eager" decoding="async" onerror="this.hidden=true; this.nextElementSibling.hidden=false;">
            <div class="card-image-fallback" hidden>
              <div class="eyebrow">AI 업무 생존력 카드</div>
              <strong>LV.${String(result.level).padStart(2, '0')} ${escapeHtml(result.title)}</strong>
              <p>${escapeHtml(result.verdict)}</p>
            </div>
          </div>
          <a class="save-card-button" href="${cardAsset.src}" download="${cardAsset.download}" data-event="result_card_downloaded">결과 카드 저장하기</a>
          <div class="result-cta-panel">
            <a class="btn-pixel cta-full result-primary-cta" href="${COACHING_URL}" target="_blank" rel="noopener noreferrer" data-event="kmong_cta_clicked">내 AI 업무 스킬 레벨업하기 →</a>
          </div>
          ${renderCheatCode()}
          ${renderBeforeAfter(result)}
          <div class="report-soft-area">
            <button class="btn-pixel ghost cta-full" data-action="restart">다시 풀기</button>
          </div>
        </div>
      </section>
    `);
  }

  function renderReport(submitted, errors) {
    const payload = state.resultPayload;
    const defaultReportTask = payload.q4_answer || '';
    root.innerHTML = shell(`
      <section class="report-layout">
        <button class="text-button" data-action="back-result">← 결과로 돌아가기</button>
        <div class="report-panel pixel-card">
          ${submitted ? `
            <div class="success-box"><div class="success-mark">OK</div><h1>신청이 접수되었습니다.</h1><p>작성해주신 내용을 바탕으로 맞춤 리포트 대상자를 선정해 개별 안내드릴게요.</p><button class="btn-pixel" data-action="back-result">결과 다시 보기</button></div>
          ` : `
            <form id="report-form" novalidate>
              <span class="chip lav">OPTIONAL</span>
              <h1>맞춤 리포트 신청</h1>
              <p class="section-copy">원하면 결과 아래에서 추가 신청할 수 있어요. 메인 액션은 AI 업무 스킬 레벨업입니다.</p>
              <label class="field-group"><span>NICKNAME</span><input class="field" name="nickname" placeholder="원하는 닉네임"></label>
              <label class="field-group"><span>EMAIL</span><input class="field" name="email" type="email" placeholder="hello@example.com">${errors?.email ? `<em>${errors.email}</em>` : ''}</label>
              <label class="field-group"><span>줄이고 싶은 반복 업무</span><textarea class="field" name="report_task" rows="4" placeholder="예) 주간 리포트 취합 및 정리">${escapeHtml(defaultReportTask)}</textarea></label>
              <label class="consent-row"><input name="consent" type="checkbox"><span>개인정보 수집·이용에 동의합니다. 맞춤 리포트 후보 선정 및 결과 안내 목적으로만 사용합니다.</span></label>
              ${errors?.consent ? `<em class="form-error">${errors.consent}</em>` : ''}
              <button class="btn-pixel cta-full" type="submit" data-event="report_submitted">신청하기 →</button>
            </form>
          `}
        </div>
      </section>
    `, true);
  }

  function render() {
    if (state.view === 'hero') renderHero();
    if (state.view === 'question') renderQuestion();
    if (state.view === 'result') renderResult();
    if (state.view === 'report') renderReport(false, {});
  }

  root.addEventListener('submit', (event) => {
    if (event.target.id !== 'report-form') return;
    event.preventDefault();
    const form = new FormData(event.target);
    const email = String(form.get('email') || '').trim();
    const consent = form.get('consent') === 'on';
    const errors = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = '이메일 형식을 확인해주세요.';
    if (!consent) errors.consent = '개별 안내를 받으려면 동의가 필요해요.';
    if (Object.keys(errors).length) {
      renderReport(false, errors);
      return;
    }

    state.reportRequestPayload = {
      type: "report_request",
      submitted_at: new Date().toISOString(),
      session_id: state.resultPayload.session_id,
      attempt_id: state.resultPayload.attempt_id,
      source: state.resultPayload.source,
      nickname: String(form.get('nickname') || '').trim(),
      email,
      report_task: String(form.get('report_task') || '').trim(),
      q4_task_type: state.resultPayload.q4_task_type,
      q4_answer: state.resultPayload.q4_answer,
      q5_score: state.resultPayload.q5_score,
      q5_answer: state.resultPayload.q5_answer,
      q5_bottleneck: state.resultPayload.q5_bottleneck,
      q6_task_type: state.resultPayload.q6_task_type,
      q8_needed_help: state.resultPayload.q8_needed_help,
      result_level: state.resultPayload.result_level,
      result_title: state.resultPayload.result_title,
      total_score: state.resultPayload.total_score,
      primary_offer_fit: state.resultPayload.primary_offer_fit,
      task_tag: state.resultPayload.task_tag,
      consent,
    };
    console.log('resultPayload', state.resultPayload);
    console.log('reportRequestPayload', state.reportRequestPayload);
    captureEvent('report_submitted', { source: state.source, result_level: state.resultPayload.result_level });
    sendToGoogleSheets(state.reportRequestPayload);
    renderReport(true, {});
  });

  root.addEventListener('click', (event) => {
    const target = event.target.closest('[data-action]');
    if (!target) return;
    const action = target.dataset.action;

    if (target.dataset.event) {
      captureEvent(target.dataset.event, { source: state.source, question_index: state.index + 1 });
    }

    if (action === 'start') {
      state.view = 'question';
      state.index = 0;
    }

    if (action === 'select') {
      const q = QUESTIONS[state.index];
      const option = q.options[Number(target.dataset.index)];
      if (!option) return;
      state.answers[q.id] = option;
      root.querySelectorAll('.choice').forEach((button) => {
        button.disabled = true;
        if (button !== target) button.classList.add('choice-muted');
      });
      target.classList.add('selected');
      if (!target.querySelector('.choice-check')) {
        target.insertAdjacentHTML('beforeend', '<span class="choice-check" aria-hidden="true"></span>');
      }

      window.setTimeout(() => {
        if (state.index < QUESTIONS.length - 1) {
          state.index += 1;
        } else {
          state.resultPayload = buildResultPayload();
          console.log('resultPayload', state.resultPayload);
          captureEvent('result_viewed', {
            source: state.source,
            result_level: state.resultPayload.result_level,
            total_score: state.resultPayload.total_score,
          });
          sendToGoogleSheets(state.resultPayload);
          state.view = 'result';
        }
        render();
      }, 180);
      return;
    }

    if (action === 'prev') {
      if (state.view === 'question' && state.index > 0) {
        state.index -= 1;
      } else {
        state.view = state.view === 'report' ? 'result' : 'hero';
      }
    }

    if (action === 'report') state.view = 'report';
    if (action === 'back-result') state.view = 'result';
    if (action === 'restart') {
      state.view = 'hero';
      state.index = 0;
      state.answers = {};
      state.resultPayload = null;
      state.reportRequestPayload = null;
    }

    render();
  });

  window.AISurvivalApp = { QUESTIONS, RESULTS, buildResultPayload, getPrimaryOfferFit, getTaskTag };
  captureEvent('page_view', { source: state.source });
  render();
}());
