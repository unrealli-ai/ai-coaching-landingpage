(function () {
  const SESSION_KEY = 'unrealli_ai_survival_session_id';
  const COACHING_URL = 'https://kmong.com/gig/759427';
  const APPS_SCRIPT_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxGaEA5l7i-ux1cdW-vcIy8pfQwhqPOQfDtv4aA9pAY2K4CUGBawbUvJfhDpBwVvl5uEw/exec";

  const QUESTIONS = [
    ['q1', true, false, 'AI 도구를 업무에 얼마나 써봤나요?', '', [
      [1, '거의 써본 적 없다'],
      [2, '가끔 검색이나 질문용으로 쓴다'],
      [3, '메일, 요약, 문장 정리에 써본다'],
      [4, '실제 업무 결과물 일부를 AI로 만든다'],
      [5, '반복 업무 흐름에 AI를 넣어 쓰고 있다'],
    ]],
    ['q2', true, false, 'AI를 쓸 때 가장 자주 하는 방식은?', '', [
      [1, '그냥 궁금한 걸 물어본다'],
      [2, '“이거 정리해줘”처럼 간단히 요청한다'],
      [3, '역할, 목적, 조건을 넣어 질문한다'],
      [4, '참고 자료와 원하는 결과물 형식을 같이 준다'],
      [5, '업무별로 반복 사용 가능한 프롬프트나 템플릿이 있다'],
    ]],
    ['q3', true, false, 'AI에게 맡겨도 되는 일과, 내가 직접 확인해야 하는 일을 구분할 수 있나요?', '', [
      [1, '아직 구분하기 어렵다'],
      [2, '일부는 가능할 것 같지만 확신은 없다'],
      [3, '쉬운 업무는 AI에게 맡길 수 있다고 생각한다'],
      [4, 'AI가 할 일과 내가 확인할 일을 나눌 수 있다'],
      [5, 'AI, 사람, 자동화 도구를 역할별로 나눠서 쓸 수 있다'],
    ]],
    ['q4', true, false, 'AI 답변을 받았을 때 보통 어떤 상태인가요?', '', [
      [1, '답변이 뻔해서 잘 안 쓴다'],
      [2, '괜찮긴 한데 다시 많이 고쳐야 한다'],
      [3, '초안으로는 쓸 수 있다'],
      [4, '조건을 추가해가며 실무용으로 다듬는다'],
      [5, '확인 기준까지 정해서 실제 업무에 활용한다'],
    ]],
    ['q5', false, true, '반복 업무를 줄이려고 할 때 가장 막히는 부분은 무엇인가요?', '여러 개 선택할 수 있어요. 점수에는 반영되지 않지만, 맞춤 리포트 후보 선정에 참고돼요.', [
      ['어떤 업무에 AI를 써야 할지 모르겠다'],
      ['AI에게 뭘 어떻게 물어봐야 할지 모르겠다'],
      ['답변은 나오는데 실무에 쓰기 애매하다'],
      ['내 파일이나 자료가 정리되어 있지 않다'],
      ['한 번은 되는데 반복해서 쓰기 어렵다'],
      ['AI, 엑셀/시트, 자동화 중 무엇이 맞는지 판단이 어렵다'],
    ]],
    ['q6', false, true, '요즘 가장 자주 반복하는 업무는 무엇인가요?', '여러 개 선택할 수 있어요. 현재 업무 유형을 고르면 결과 화면에서 더 정확히 분류해요.', [
      ['엑셀/구글시트 정리'],
      ['보고서/문서 작성'],
      ['자료 조사/요약'],
      ['메일/고객 응대 문구 작성'],
      ['회의록/메모 정리'],
      ['숫자 확인/검수/누락 체크'],
      ['여러 파일 취합/정리'],
      ['일정/업무 현황 관리'],
      ['정산/재고/배송 등 운영 데이터 관리'],
      ['기타'],
    ]],
    ['q7', true, false, '반복 업무를 누군가에게 넘긴다면, 어디까지 설명할 수 있나요?', '', [
      [1, '나도 그냥 하던 대로 하는 거라 설명하기 어렵다'],
      [2, '대략 뭘 해야 하는지는 말할 수 있다'],
      [3, '필요한 자료와 작업 순서는 설명할 수 있다'],
      [4, '원하는 결과물과 확인 기준까지 설명할 수 있다'],
      [5, '그대로 따라 할 수 있는 체크리스트/템플릿으로 정리할 수 있다'],
    ]],
    ['q8', false, false, '지금 가장 필요한 도움은 무엇인가요?', '이 답변은 추천 방향을 나누는 데 사용돼요.', [
      ['내 업무에 AI를 어디에 써야 할지 감 잡기'],
      ['내 업무에 맞는 프롬프트 만들기'],
      ['실제 업무 파일로 같이 실습해보기'],
      ['반복 업무 자동화 가능성 확인하기'],
      ['엑셀/구글시트 구조 개선하기'],
      ['업무 흐름 전체를 AI/자동화 구조로 바꾸기'],
    ]],
  ].map(([id, scored, multi, title, helper, options]) => ({
    id,
    scored,
    multi,
    title,
    helper,
    options: options.map((option) => scored
      ? { score: option[0], label: option[1] }
      : { value: option[0], label: option[0] }),
  }));

  const RESULTS = [
    {
      level: 1,
      min: 5,
      max: 8,
      title: 'AI 구경꾼',
      verdict: 'AI가 중요하다는 건 알지만, 아직 내 업무에 직접 붙여본 경험은 거의 없는 단계예요.',
      current: ['AI 툴 이름은 들어봤지만 실제 업무 활용은 적어요.', '업무는 아직 검색, 복붙, 수작업 중심일 가능성이 높아요.', '“언젠가 배워야지” 상태가 오래 이어지고 있을 수 있어요.'],
      blocker: ['어떤 업무에 AI를 써야 할지 감이 부족해요.', '첫 질문을 어떻게 시작해야 할지 막힐 수 있어요.', 'AI를 업무 도구보다 새로운 기술처럼 느끼고 있을 수 있어요.'],
      next: ['오늘 한 업무 하나를 골라보세요.', 'AI에게 “이 업무를 줄일 수 있는 방법을 알려줘”라고 물어보세요.', '결과가 별로여도 일단 한 번 업무에 붙여보는 경험이 먼저예요.'],
    },
    {
      level: 2,
      min: 9,
      max: 12,
      title: '복붙 사용자',
      verdict: 'AI를 가끔 쓰긴 하지만, 아직 실제 업무 흐름에 붙이진 못한 단계예요.',
      current: ['메일, 요약, 문장 정리에 AI를 가끔 사용할 수 있어요.', '하지만 결과를 그대로 쓰기엔 애매해서 다시 많이 고칠 수 있어요.', '내 파일, 내 기준, 내 반복 업무에는 아직 적용이 어려울 수 있어요.'],
      blocker: ['질문이 너무 짧거나 추상적일 수 있어요.', '참고 자료와 원하는 결과물 형식을 함께 주지 않을 수 있어요.', 'AI 결과를 실무용으로 다듬는 기준이 부족할 수 있어요.'],
      next: ['“정리해줘” 대신 “이 자료를 이 형식으로 바꿔줘”라고 요청해보세요.', '자주 하는 업무 하나를 골라 반복 프롬프트를 만들어보세요.', '결과가 나오면 확인 기준을 추가해 다시 요청해보세요.'],
    },
    {
      level: 3,
      min: 13,
      max: 17,
      title: '업무 적용 초보자',
      verdict: 'AI를 써보기 시작했지만, 아직 반복 업무 흐름으로 연결되진 않은 단계예요.',
      current: ['AI 답변을 실제 업무에 일부 활용하고 있어요.', '초안, 요약, 문장 정리에는 도움을 받고 있을 가능성이 높아요.', '하지만 매번 새로 물어보고, 반복 가능한 방식은 아직 약할 수 있어요.'],
      blocker: ['AI를 어디에 쓰면 좋은지는 조금 알지만, 반복 구조가 부족해요.', '업무마다 질문 방식이 달라 결과 품질이 흔들릴 수 있어요.', 'AI가 할 일과 내가 확인할 일이 아직 명확히 나뉘지 않았을 수 있어요.'],
      next: ['자주 하는 반복 업무 하나를 고르세요.', '필요한 자료, 작업 순서, 원하는 결과물을 적어보세요.', '그 업무를 기준으로 반복 사용 가능한 프롬프트를 만들어보세요.'],
    },
    {
      level: 4,
      min: 18,
      max: 21,
      title: 'AI 실무자',
      verdict: 'AI를 단순 질문 도구가 아니라, 실무 결과물을 만드는 파트너로 쓰기 시작한 단계예요.',
      current: ['업무 목적과 조건을 넣어 AI에게 요청할 수 있어요.', '결과물 형식까지 어느 정도 지정할 수 있어요.', 'AI가 할 일과 사람이 확인할 일을 나눠볼 수 있어요.'],
      blocker: ['이제 단발성 질문보다 반복 가능한 업무 흐름이 필요해요.', '프롬프트만으로는 한계가 있는 업무가 보이기 시작할 수 있어요.', '템플릿, 시트 구조, 자동화 연결이 다음 병목일 수 있어요.'],
      next: ['자주 쓰는 업무 흐름을 템플릿으로 고정하세요.', '반복 입력 양식과 확인 기준을 만들어보세요.', 'AI, 시트, 자동화 도구 중 무엇이 맞는지 구분해보세요.'],
    },
    {
      level: 5,
      min: 22,
      max: 25,
      title: 'AI 워크플로우 설계자',
      verdict: 'AI를 단순 도구가 아니라, 업무 시스템의 일부로 볼 수 있는 단계예요.',
      current: ['업무를 구조화하고 반복 가능한 흐름으로 만들 수 있어요.', 'AI, 사람, 자동화 도구의 역할을 구분할 수 있어요.', '개별 업무보다 전체 프로세스 개선에 관심이 있을 가능성이 높아요.'],
      blocker: ['이제 더 중요한 건 개별 프롬프트가 아니라 시스템화예요.', '개인 업무를 팀이나 고객에게 반복 제공 가능한 구조로 바꿔야 할 수 있어요.', '자동화와 운영 설계가 다음 단계일 수 있어요.'],
      next: ['반복 업무를 하나의 워크플로우로 정리하세요.', '사람이 판단할 부분과 자동화할 부분을 분리하세요.', '팀이나 고객에게 반복 제공 가능한 운영 시스템으로 확장해보세요.'],
    },
  ];

  const SPRITES = {
    worker: [
      '..................', '.....kkkkkkk......', '....khhhhhhhk.....', '...khhHHHHHhhk....',
      '...khssssssk......', '...kssksksskk.....', '...kssssssssk.....', '....kkkkkkkk......',
      '.....kbBBbk.......', '....kbBBBBbk......', '...kbBBwwBBbk.....', '..kbBBBwwBBBbk....',
      '.kggBBBBBBBBggk...', 'kgWWWWWWWWWWWWgk..', '.kkkkkkkkkkkkkk...', '...knnnk.knnnk....', '...kkkkk.kkkkk....',
    ],
    robot: [
      '.....kkkk.....', '......kk......', '...kkkkkkkk...', '..klllllllkk..', '.kltwwwttwwlk.',
      '.kltwkwttwkwlk', '.kltwwwttwwlk.', '.kl..tttt..lk.', 'kkl........lk.', 'kklllllllllk..',
      '.kkkkkkkkkk...', '....k....k....', '...kkk..kkk...',
    ],
    plant: ['..ttttt..', '.ttkkktt.', 'ttkTTTktt', 'tkTTtTTkt', '.ttkTktt.', '...kkk...', '..kpppk..', '..kpppk..', '..kkkkk..'],
    cloud: ['...kkkk...', '..kwwwwk..', '.kwwwwwwk.', 'kwwwwwwwwk', '.kkkkkkkk.'],
    check: ['......tt', '.....tt.', '....tt..', 'k..tt...', 'kktt....', '.ktt....', '..t.....'],
  };

  const PAL = {
    '.': null, k: '#0D1530', h: '#3B2A29', H: '#5A3F3D', s: '#FFD7B5', w: '#fff',
    W: '#F0EDE3', b: '#0D1530', B: '#18254A', n: '#0D1530', t: '#BFEFD9',
    T: '#66C9AC', l: '#D9D3FF', p: '#FFD9BF', g: '#A8B2C2',
  };

  const state = {
    sessionId: getSessionId(),
    source: getSource(),
    view: 'hero',
    index: 0,
    answers: {},
    freeTextTask: '',
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
    if (Array.isArray(answer)) return answer.map((item) => item.label || item.value || '').filter(Boolean);
    return answer ? answer.label || answer.value || '' : '';
  }

  function answerValue(answer) {
    const text = answerText(answer);
    return Array.isArray(text) ? text : text || '';
  }

  function resultByScore(score) {
    return RESULTS.find((result) => score >= result.min && score <= result.max) || RESULTS[0];
  }

  function getPrimaryOfferFit(answers) {
    const q5 = answerValue(answers.q5);
    const q8 = answerValue(answers.q8);
    const hasQ5 = (value) => Array.isArray(q5) ? q5.includes(value) : q5 === value;
    if (q8 === '업무 흐름 전체를 AI/자동화 구조로 바꾸기') return '시스템설계형';
    if (hasQ5('AI, 엑셀/시트, 자동화 중 무엇이 맞는지 판단이 어렵다') || q8 === '반복 업무 자동화 가능성 확인하기') return '자동화진단형';
    if (hasQ5('AI에게 뭘 어떻게 물어봐야 할지 모르겠다') || q8 === '내 업무에 맞는 프롬프트 만들기') return '프롬프트실습형';
    if (hasQ5('내 파일이나 자료가 정리되어 있지 않다') || q8 === '엑셀/구글시트 구조 개선하기') return '데이터구조화형';
    return 'AI코칭형';
  }

  function getTaskTag(answers) {
    const selected = Array.isArray(answerText(answers.q6)) ? answerText(answers.q6) : [answerText(answers.q6)];
    if (selected.includes('엑셀/구글시트 정리')) return '시트정리형';
    if (selected.includes('보고서/문서 작성') || selected.includes('회의록/메모 정리')) return '문서작성형';
    if (selected.includes('메일/고객 응대 문구 작성')) return '고객응대형';
    if (selected.includes('자료 조사/요약')) return '리서치요약형';
    if (selected.some((item) => ['숫자 확인/검수/누락 체크', '여러 파일 취합/정리', '정산/재고/배송 등 운영 데이터 관리'].includes(item))) return '운영데이터형';
    return '일반업무형';
  }

  function buildResultPayload() {
    const totalScore = ['q1', 'q2', 'q3', 'q4', 'q7'].reduce((sum, id) => sum + (state.answers[id]?.score || 0), 0);
    const result = resultByScore(totalScore);
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
      q3_answer: answerText(state.answers.q3),
      q4_score: state.answers.q4?.score || null,
      q4_answer: answerText(state.answers.q4),
      q5_bottleneck: answerText(state.answers.q5),
      q6_task_type: answerValue(state.answers.q6),
      q7_score: state.answers.q7?.score || null,
      q7_answer: answerText(state.answers.q7),
      q8_needed_help: answerText(state.answers.q8),
      free_text_task: state.freeTextTask.trim(),
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
    return `<main class="app-shell ${compact ? 'compact' : ''}"><div class="page-grid" aria-hidden="true"></div><header class="topbar">${brand()}<span class="topbar-kicker">AI WORK SURVIVAL TEST</span></header>${content}</main>`;
  }

  function renderHero() {
    root.innerHTML = shell(`
      <section class="hero-layout">
        <div class="hero-copy">
          <span class="chip lav">QUEST · AI WORK SURVIVAL TEST</span>
          <h1><span class="title-line">AI 업무</span><span class="title-line"><span>생존력</span> 테스트</span></h1>
          <p class="lead">다들 AI 쓴다는데, 내 업무는 왜 그대로일까요?<br>AI 활용 vs 실제 업무 적용, 지금 바로 진단해보세요.</p>
          <div class="chip-row"><span class="chip mint">8문항</span><span class="chip lav">약 2분</span><span class="chip peach">결과 즉시</span></div>
          <div class="hero-actions"><button class="btn-pixel" data-action="start">테스트 시작하기 →</button><button class="btn-pixel ghost" data-action="sample">예시 결과 보기</button></div>
          <p class="privacy-note">결과 전 이름, 이메일 등 개인 식별 정보는 입력하지 않습니다. 응답 데이터는 서비스 개선 및 통계 분석 목적으로 익명 저장될 수 있습니다.</p>
        </div>
        <div class="hero-scene image-scene pixel-card mint">
          <picture>
            <source media="(max-width: 620px)" srcset="assets/hero-mobile.png">
            <img class="character-main-image" src="assets/hero-pc.png" alt="외계인 직장인과 AI 도우미가 함께 업무를 보는 장면">
          </picture>
        </div>
      </section>
      <section class="benefit-row" aria-label="테스트 결과 요약">
        <article class="mini-card mint"><b>01</b><strong>내 위치 확인</strong><span>LV1-LV5 중 지금 어디쯤인지 정확히 보여드려요.</span></article>
        <article class="mini-card lav"><b>02</b><strong>막히는 핵심</strong><span>왜 AI 결과가 업무로 이어지지 않는지 진단해드려요.</span></article>
        <article class="mini-card peach"><b>03</b><strong>다음 한 걸음</strong><span>오늘 당장 할 수 있는 작은 실천을 제안해드려요.</span></article>
      </section>
    `);
  }

  function renderQuestion() {
    const q = QUESTIONS[state.index];
    const selected = state.answers[q.id];
    const hasSelected = Array.isArray(selected) ? selected.length > 0 : Boolean(selected);
    root.innerHTML = shell(`
      <section class="question-panel">
        <div class="question-head"><button class="text-button" data-action="prev">← 이전</button><span class="step-count">${String(state.index + 1).padStart(2, '0')} / ${String(QUESTIONS.length).padStart(2, '0')}</span></div>
        <div class="progress">${QUESTIONS.map((_, index) => `<span class="${index <= state.index ? 'on' : ''}"></span>`).join('')}</div>
        <div class="question-body">
          <div class="eyebrow">QUESTION ${String(state.index + 1).padStart(2, '0')}</div>
          <h2>${escapeHtml(q.title)}</h2>
          <div class="helper-card">${sprite('robot', 2.5)}<p>${q.multi ? '<strong>중복 선택 가능</strong><br>' : ''}${escapeHtml(q.helper || '가장 가까운 답변을 골라주세요. 정답은 없어요.')}</p></div>
          <div class="choice-list">${q.options.map((option, index) => {
            const selectedTexts = Array.isArray(answerText(selected)) ? answerText(selected) : [answerText(selected)];
            const active = selectedTexts.includes(answerText(option));
            return `<button class="choice ${active ? 'selected' : ''}" data-action="select" data-index="${index}"><span class="num">${String.fromCharCode(65 + index)}</span><span>${escapeHtml(option.label)}</span>${active ? `<span class="choice-check">${sprite('check', 1.4)}</span>` : ''}</button>`;
          }).join('')}</div>
        </div>
        <div class="nav-row"><button class="btn-pixel ghost" data-action="prev">← 이전</button><button class="btn-pixel" data-action="next" ${hasSelected ? '' : 'disabled'}>다음 →</button></div>
      </section>
    `, true);
  }

  function renderFreeText() {
    root.innerHTML = shell(`
      <section class="question-panel">
        <div class="question-head"><button class="text-button" data-action="prev">← 이전</button><span class="step-count">선택 입력</span></div>
        <div class="question-body">
          <div class="eyebrow">OPTIONAL NOTE</div>
          <h2>AI로 줄이고 싶은 반복 업무를 한 줄로 적어주세요.</h2>
          <p class="section-copy">선택사항입니다. 비워도 결과를 볼 수 있어요.</p>
          <textarea class="field tall" data-field="freeTextTask" placeholder="예) 여러 엑셀 파일을 합쳐서 보고서 만드는 업무&#10;예) 고객 문의 내용을 정리해서 답변 초안을 만드는 업무&#10;예) 숫자 누락이나 오류를 확인하는 업무">${escapeHtml(state.freeTextTask)}</textarea>
        </div>
        <div class="nav-row"><button class="btn-pixel ghost" data-action="prev">← 이전</button><button class="btn-pixel" data-action="result">결과 보기 →</button></div>
      </section>
    `, true);
  }

  function resultCard(tone, title, items) {
    return `<article class="diag ${tone}"><h3>${title}</h3><ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul></article>`;
  }

  function renderResult() {
    const payload = state.resultPayload;
    const result = resultByScore(payload.total_score);
    root.innerHTML = shell(`
      <section class="result-layout" id="preview-result">
        <div class="result-main pixel-card">
          <div class="result-hero">
            <div><div class="eyebrow">YOUR LEVEL · 8/8 완료</div><div class="lvl-num">LV.${String(result.level).padStart(2, '0')}</div><h2>${escapeHtml(result.title)}</h2><p>${escapeHtml(result.verdict)}</p></div>
            <div class="result-character image-character"><img src="assets/level-${result.level}-character.png" alt="LV.${String(result.level).padStart(2, '0')} ${escapeHtml(result.title)} 캐릭터"></div>
          </div>
          <div class="level-map">${RESULTS.map((item) => `<div class="${item.level === result.level ? 'active' : ''}"><img src="assets/level-${item.level}-character.png" alt=""><b>LV.${String(item.level).padStart(2, '0')}</b><span>${escapeHtml(item.title)}</span></div>`).join('')}</div>
          <a class="btn-pixel cta-full" href="${COACHING_URL}" target="_blank" rel="noopener noreferrer">내 업무로 AI 실습 코칭 보러가기 →</a>
        </div>
        <div class="result-side">
          ${resultCard('mint', '현재 상태', result.current)}
          ${resultCard('lav', '지금 막히는 핵심', result.blocker)}
          ${resultCard('peach', '추천 다음 단계', result.next)}
          <button class="report-card" data-action="report"><span class="report-icon">R</span><span><strong>2페이지 맞춤 리포트 후보로 신청하기</strong><small>작성해주신 반복 업무 기준 일부 분께 개별 안내</small></span><b>+</b></button>
          <button class="btn-pixel ghost cta-full" data-action="restart">다시 풀기</button>
        </div>
      </section>
    `);
  }

  function renderReport(submitted, errors) {
    const payload = state.resultPayload;
    root.innerHTML = shell(`
      <section class="report-layout">
        <button class="text-button" data-action="back-result">← 결과로 돌아가기</button>
        <div class="report-panel pixel-card">
          ${submitted ? `
            <div class="success-box"><div class="success-mark">OK</div><h1>신청이 접수되었습니다.</h1><p>작성해주신 내용을 바탕으로 맞춤 리포트 대상자를 선정해 개별 안내드릴게요.</p><button class="btn-pixel" data-action="back-result">결과 다시 보기</button></div>
          ` : `
            <form id="report-form" novalidate>
              <span class="chip lav">OPTIONAL</span>
              <h1>2페이지 맞춤 리포트 후보로 신청하기</h1>
              <p class="section-copy">작성해주신 내용을 바탕으로 일부 분께만 개별 인사이트를 제공해 드려요.</p>
              <label class="field-group"><span>NICKNAME</span><input class="field" name="nickname" placeholder="원하는 닉네임"></label>
              <label class="field-group"><span>EMAIL</span><input class="field" name="email" type="email" placeholder="hello@example.com">${errors?.email ? `<em>${errors.email}</em>` : ''}</label>
              <label class="field-group"><span>줄이고 싶은 반복 업무</span><textarea class="field" name="report_task" rows="4" placeholder="예) 주간 리포트 취합 및 정리">${escapeHtml(payload.free_text_task)}</textarea></label>
              <label class="consent-row"><input name="consent" type="checkbox"><span>개인정보 수집·이용에 동의합니다. 맞춤 리포트 후보 선정 및 결과 안내 목적으로만 사용합니다.</span></label>
              ${errors?.consent ? `<em class="form-error">${errors.consent}</em>` : ''}
              <button class="btn-pixel cta-full" type="submit">후보로 신청하기 →</button>
            </form>
          `}
        </div>
      </section>
    `, true);
  }

  function render() {
    if (state.view === 'hero') renderHero();
    if (state.view === 'question') renderQuestion();
    if (state.view === 'freeText') renderFreeText();
    if (state.view === 'result') renderResult();
    if (state.view === 'report') renderReport(false, {});
  }

  root.addEventListener('input', (event) => {
    if (event.target.dataset.field === 'freeTextTask') state.freeTextTask = event.target.value;
  });

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
    sendToGoogleSheets(state.reportRequestPayload);
    renderReport(true, {});
  });

  root.addEventListener('click', (event) => {
    const target = event.target.closest('[data-action]');
    if (!target) return;
    const action = target.dataset.action;
    if (action === 'start') {
      state.view = 'question';
      state.index = 0;
    }
    if (action === 'sample') {
      state.answers = {
        q1: QUESTIONS[0].options[2], q2: QUESTIONS[1].options[2], q3: QUESTIONS[2].options[2], q4: QUESTIONS[3].options[2],
        q5: [QUESTIONS[4].options[2]], q6: [QUESTIONS[5].options[1]], q7: QUESTIONS[6].options[2], q8: QUESTIONS[7].options[1],
      };
      state.freeTextTask = '';
      state.resultPayload = buildResultPayload();
      console.log('resultPayload', state.resultPayload);
      sendToGoogleSheets(state.resultPayload);
      state.view = 'result';
    }
    if (action === 'select') {
      const q = QUESTIONS[state.index];
      const option = q.options[Number(target.dataset.index)];
      if (q.multi) {
        const current = Array.isArray(state.answers[q.id]) ? state.answers[q.id] : [];
        const exists = current.some((item) => item.label === option.label);
        state.answers[q.id] = exists ? current.filter((item) => item.label !== option.label) : current.concat(option);
      } else {
        state.answers[q.id] = option;
      }
    }
    if (action === 'next') {
      if (state.index < QUESTIONS.length - 1) state.index += 1;
      else state.view = 'freeText';
    }
    if (action === 'prev') {
      if (state.view === 'freeText') {
        state.view = 'question';
        state.index = QUESTIONS.length - 1;
      } else if (state.index > 0) {
        state.index -= 1;
      } else {
        state.view = 'hero';
      }
    }
    if (action === 'result') {
      state.resultPayload = buildResultPayload();
      console.log('resultPayload', state.resultPayload);
      sendToGoogleSheets(state.resultPayload);
      state.view = 'result';
    }
    if (action === 'report') state.view = 'report';
    if (action === 'back-result') state.view = 'result';
    if (action === 'restart') {
      state.view = 'hero';
      state.index = 0;
      state.answers = {};
      state.freeTextTask = '';
      state.resultPayload = null;
      state.reportRequestPayload = null;
    }
    render();
  });

  window.AISurvivalApp = { QUESTIONS, RESULTS, buildResultPayload, getPrimaryOfferFit, getTaskTag };
  render();
}());
