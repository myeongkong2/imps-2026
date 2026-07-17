const nodeConfig = {
  age_group: { label: "연령대", states: ["65-69", "70-79", "80+"] },
  sex: { label: "성별", states: ["female", "male"] },
  physical_health: { label: "신체건강", states: ["low", "mid", "high"] },
  cognitive_function: { label: "인지기능", states: ["low", "mid", "high"] },
  psychological_condition: { label: "심리상태", states: ["low", "mid", "high"] },
  social_resources: { label: "사회적 자원", states: ["low", "mid", "high"] },
  socioeconomic_resources: { label: "사회경제적 자원", states: ["low", "mid", "high"] },
  health_behavior: { label: "건강행동", states: ["low", "mid", "high"] }
};

let currentLanguage = "ko";
const originalText = new WeakMap();
const exactTranslations = new Map(Object.entries({
  "본문으로 바로가기": "Skip to main content",
  "서론": "Introduction",
  "연구방법": "Methodology",
  "연구결과": "Results",
  "확률추론": "Inference",
  "결론": "Conclusion",
  "연구 흐름 보기": "View Study Flow",
  "확률 직접 보기": "Explore Probabilities",
  "분석 결과": "Analysis Results",
  "분석 결과 보기": "View Results",
  "Netica 사후추론": "Netica Inference",
  "노인의 기능상태": "Functional Status in Older Adults",
  "예측과 확률추론": "Prediction and Probabilistic Inference",
  "연령대·성별·여섯 기능 영역의 상태를 선택하고, 해당 집단의 기능제한 확률을 확인할 수 있습니다.": "Adjust age, sex, and six domains to estimate functional limitation.",
  "교차검증": "Cross-validation",
  "표본 밖 예측성능 검증": "Out-of-sample performance",
  "최종 TAN": "Final TAN",
  "상태 선택과 사후확률 갱신": "State selection and posterior updating",
  "분석 대상자": "Participants",
  "관찰된 기능제한": "Observed limitation",
  "예측 노드": "Predictor nodes",
  "상태를 선택해 기능제한 확률을 확인하세요": "Adjust Node States and Explore Functional Limitation",
  "노드의 상태를 선택해 100% 근거로 고정하면 기능상태와 나머지 모든 노드의 분포가 함께 갱신됩니다.": "Set a node state as 100% evidence to update functional status and every other node.",
  "노드 상태를 0% 또는 100% 근거로 고정하면 기능상태와 나머지 모든 노드의 분포가 함께 갱신됩니다.": "Set a node state to 0% or 100% evidence to update functional status and every other node.",
  "노드의 상태를 한 번 클릭하면 100% 근거로 고정되고, 같은 상태를 다시 클릭하면 해제됩니다. 기능상태와 나머지 모든 노드의 분포는 함께 갱신됩니다.": "Click a state once to set it as 100% evidence; click it again to remove the evidence. Functional status and every other node update together.",
  "근거": "Evidence",
  "노드 안의 한 상태를 100%로 고정": "Set one state in a node to 100%",
  "노드 안의 한 상태를 0% 또는 100%로 고정": "Set one node state to 0% or 100%",
  "상태를 클릭해 100%로 고정 · 다시 클릭해 해제": "Click a state for 100% · click again to clear",
  "선택 즉시 모든 노드의 조건부확률 재계산": "Recalculate all conditional probabilities immediately",
  "갱신": "Update",
  "다른 상태와 모든 노드의 확률 재계산": "Recalculate every node distribution",
  "구조": "Model",
  "R에서 추정한 전체 표본 최종 TAN CPT": "Full-sample final TAN CPTs estimated in R",
  "선택한 노드": "Selected node",
  "여러 노드의 설정을 동시에 유지할 수 있습니다.": "Keep several node settings at once.",
  "여러 노드의 100% 근거를 동시에 유지할 수 있습니다.": "Keep 100% evidence on several nodes at once.",
  "여러 노드의 0%·100% 근거를 동시에 유지할 수 있습니다.": "Keep 0% or 100% evidence on several nodes at once.",
  "각 상태의 0% 또는 100%를 선택하세요": "Choose 0% or 100% for a state",
  "노드 안의 상태를 클릭하세요": "Click a state inside a node",
  "선택하면 100%, 같은 상태를 다시 누르면 해제됩니다.": "A click sets 100%; clicking the same state again clears it.",
  "기준 확률로 되돌리기": "Reset to Baseline",
  "모든 설정 초기화": "Reset All Settings",
  "노드 초기화": "Reset Node",
  "기능상태 초기화": "Reset Functional Status",
  "초기화": "Reset",
  "기능제한 사후확률": "Posterior probability of limitation",
  "기능제한 직접 조절": "Adjust limitation directly",
  "기능독립": "Independent",
  "설정한 노드는 그대로 유지되며, 새 노드를 추가로 조절할 때마다 전체 확률이 다시 계산됩니다.": "Existing settings are maintained while the full distribution is recalculated after every adjustment.",
  "고정한 근거는 유지되며, 다른 노드를 추가로 선택할 때마다 전체 조건부확률이 다시 계산됩니다.": "Evidence remains fixed while all conditional probabilities update after each new selection.",
  "10-fold 교차검증 성능과 노드 상태별 예측확률·관찰률을 제시합니다.": "Ten-fold cross-validation performance, predicted probabilities, and observed rates by node state.",
  "10-fold 교차검증 ROC": "10-fold Cross-validated ROC",
  "Youden 절단점 분류표": "Youden Cutoff Table",
  "노드 상태별 예측확률과 관찰률": "Predicted Probability and Observed Rate by Node State",
  "파란색은 각 대상자의 표본 밖(out-of-fold) 예측확률 평균이고, 붉은색은 같은 상태 집단에서 실제로 기능제한이 관찰된 비율입니다.": "Blue is the mean out-of-fold predicted probability for participants in each state; red is the observed proportion with functional limitation in the same group.",
  "전체 24개 상태": "All 24 states",
  "최종 네트워크 사후확률 추론": "Posterior Inference in the Final Network",
  "전체 표본으로 추정한 최종 TAN의 사후확률 결과입니다. 아래 Netica 이미지는 기능상태를 근거로 고정한 역방향 추론 참고 화면입니다.": "Posterior probabilities from the final full-sample TAN. The Netica images below are reference views for reverse inference with functional status fixed as evidence.",
  "대표 근거 시나리오": "Representative Evidence Scenarios",
  "근거를 추가했을 때의 기능제한 사후확률": "Posterior probability of limitation after adding evidence",
  "기능상태를 100%로 고정한 역방향 진단추론": "Reverse Diagnostic Inference by Setting Functional Status to 100%",
  "결과 상태를 근거로 넣고 각 예측 노드의 조건부 분포를 비교합니다.": "Enter the outcome as evidence and compare conditional distributions across predictor nodes.",
  "기능독립 100%": "Independent 100%",
  "기능제한 100%": "Limited 100%",
  "기능제한이 없는 집단의 조건부 노드 분포": "Conditional distributions: independent group",
  "기능제한 집단의 조건부 노드 분포": "Conditional distributions: limited group",
  "PDF 원본 열기": "Open Original PDF",
  "무엇을 어떻게 분석했나": "Study Design and Analysis",
  "모형이 계산되는 방식": "How the Models Work",
  "분석 모형과 적용 방법": "Models and Their Application",
  "분석에 사용한 핵심 수식과 본 연구의 적용 과정을 함께 제시합니다.": "Key equations are presented together with how they were applied in this study.",
  "Convex GSCA는 관측지표의 가중합으로 영역별 component를 구성하며, 가중치는 0 이상이고 합은 1이 되도록 추정합니다.": "Convex GSCA forms domain components as weighted sums of observed indicators, with nonnegative weights constrained to sum to one.",
  "방향을 통일한 21개 지표를 z점수로 표준화한 뒤 여섯 영역별 convex component 점수를 추정했습니다. 이 연속 점수를 각 훈련 fold의 삼분위수로 낮음·중간·높음 상태로 구분했습니다.": "After aligning directionality, we standardized 21 indicators as z-scores and estimated convex component scores for six domains. Continuous scores were categorized as low, mid, or high using tertiles estimated within each training fold.",
  "TAN은 기능상태를 모든 예측노드의 부모로 두고, 예측노드 사이에는 최대 하나의 추가 부모를 허용하여 조건부 의존성을 표현합니다.": "TAN makes functional status a parent of every predictor and allows at most one additional predictor parent to represent conditional dependence.",
  "여섯 영역과 연령대·성별을 예측노드로 사용했습니다. 삼분위 절단점은 훈련 fold에서만 정하고 10-fold 교차검증으로 성능을 평가한 뒤, 전체 표본으로 최종 TAN을 추정해 확률추론에 사용했습니다.": "We used six domains, age group, and sex as predictors. Tertile cutpoints were estimated only in each training fold, performance was evaluated by 10-fold cross-validation, and the final full-sample TAN was used for probabilistic inference.",
  "우리 연구에서는": "In this study",
  "실제 사용 함수 보기": "View analysis functions",
  "왜 기능상태를 확률적으로 예측하는가": "Why Predict Functional Status Probabilistically?",
  "ADL과 IADL에서의 기능상태는 노인의 삶의 질과 독립생활을 반영하며 신체·인지·심리·사회·행동·경제적 요인과 함께 변합니다. 전통적인 회귀모형만으로는 여러 영역의 확률적 의존성과 부분적으로 관찰된 정보에 따른 확률 갱신을 한 화면에서 표현하기 어렵습니다. 이에 본 연구는 KLoSA 2024년 제10차 자료의 만 65세 이상 1,590명을 대상으로, 기능제한 위험을 예측하고 취약성 프로파일을 해석할 수 있는 TAN 베이지안 네트워크를 구축했습니다.": "Functional status in ADL and IADL reflects quality of life and independent living and varies with physical, cognitive, psychological, social, behavioral, and economic factors. Conventional regression does not directly display multidomain probabilistic dependencies or update probabilities from partially observed profiles. We therefore developed a TAN Bayesian network using 1,590 adults aged 65 years or older from the 2024 tenth wave of KLoSA to predict functional limitation and interpret vulnerability profiles.",
  "기능 취약성은 여러 영역이 함께 낮을 때 커졌습니다": "Functional Vulnerability Increased as Unfavorable Domains Accumulated",
  "TAN 분류모형은 AUC 0.731의 수용 가능한 선별 성능을 보였습니다. 기능제한 확률은 근거가 없을 때 18.9%였고, 신체건강과 인지기능이 모두 낮으면 42.2%, 여섯 영역이 모두 낮으면 60.3%로 증가했습니다. 반대로 여섯 영역이 모두 높으면 3.8%였습니다. 순방향 예측과 역방향 진단추론은 위험 선별과 기능 취약성 프로파일 해석에 함께 활용할 수 있습니다.": "The TAN classifier showed acceptable screening performance with an AUC of 0.731. The probability of functional limitation was 18.9% without evidence, 42.2% when physical health and cognitive function were both low, and 60.3% when all six domains were low. It fell to 3.8% when all six domains were high. Forward prediction and reverse diagnostic inference can jointly support risk screening and interpretation of functional vulnerability profiles.",
  "참고문헌": "References",
  "실제 분석에 사용한 Convex GSCA 구성식과 TAN 확률분해 및 학습 함수를 요약했습니다.": "The actual Convex GSCA specification, TAN factorization, and learning functions used in the analysis.",
  "ALS로 W와 A를 교대로 갱신해 오차분산의 합을 최소화": "Alternately update W and A by ALS to minimize the sum of error variances",
  "6개 연속 점수": "6 continuous scores",
  "훈련 fold 삼분위": "Training-fold tertiles",
  "블록 크기 4·6·2·3·3·3 · Bootstrap 1,000회": "Block sizes 4·6·2·3·3·3 · 1,000 bootstrap samples",
  "기능상태는 모든 예측노드의 부모가 되고, 예측노드끼리는 최대 하나의 추가 부모를 갖는 트리로 의존성을 표현합니다.": "Functional status parents every predictor; a learned tree gives each predictor at most one additional predictor parent.",
  "Y = 기능상태,  π(j) = 트리에서 선택된 추가 부모": "Y = functional status,  π(j) = additional parent selected by the tree",
  "선택한 100% 근거 e로 모든 노드의 사후확률 갱신": "Update all posterior distributions using the selected 100% evidence e",
  "tree.bayes 구조": "tree.bayes structure",
  "Bayesian CPT": "Bayesian CPTs",
  "10-fold 검증": "10-fold validation",
  "삼분위 절단점은 각 훈련 fold에서만 추정 · 화살표는 인과가 아닌 확률분해 방향": "Tertile cutpoints estimated within each training fold · Arrows encode factorization, not causality",
  "KLoSA 2024년 제10차 자료의 만 65세 이상 1,590명을 분석했습니다. ADL 또는 IADL에서 한 가지 이상의 제한이 있는 경우를 기능제한으로 정의했습니다. 21개 지표를 Convex GSCA로 여섯 영역에 요약하고, 훈련 fold의 삼분위수로 세 상태를 구성했습니다. 여섯 영역·연령대·성별을 포함한 TAN 분류모형은 10-fold 교차검증으로 평가했으며, 전체 표본의 최종 네트워크는 시나리오 추론과 역방향 진단추론에 사용했습니다.": "We analyzed 1,590 adults aged 65 years or older from the 2024 tenth wave of KLoSA. Functional limitation was defined as at least one ADL or IADL limitation. Twenty-one indicators were summarized into six domains using Convex GSCA, with three states defined by training-fold tertiles. A TAN classifier including the six domains, age group, and sex was evaluated by 10-fold cross-validation. The final full-sample network was used for scenario and reverse diagnostic inference.",
  "IMPS 2026 연구 결과": "IMPS 2026 Research Results"
}));

const tokenTranslations = [
  ["ADL 또는 IADL 1개 이상 제한", "At least one ADL or IADL limitation"],
  ["명 기능제한", " limited participants"],
  ["6개 영역 모두 높음", "All Six Domains High"], ["6개 영역 모두 낮음", "All Six Domains Low"],
  ["신체·인지 높음", "Physical + Cognitive High"], ["신체·인지 낮음", "Physical + Cognitive Low"],
  ["사회경제적 자원", "Socioeconomic Resources"], ["심리상태", "Psychological Condition"],
  ["사회적 자원", "Social Resources"], ["인지기능", "Cognitive Function"], ["신체건강", "Physical Health"],
  ["트리에서 선택된 추가 부모", "additional parent selected by the tree"], ["기능상태", "Functional Status"],
  ["건강행동", "Health Behavior"], ["관찰 기능제한", "Observed Limitation"], ["분석 표본", "Analysis Sample"],
  ["Youden 절단점", "Youden Cutoff"], ["양성예측도", "Positive Predictive Value"], ["음성예측도", "Negative Predictive Value"],
  ["민감도", "Sensitivity"], ["특이도", "Specificity"], ["기능제한", "Functional Limitation"],
  ["기능독립", "Independent"], ["기준 분포", "Baseline Distribution"], ["기준 확률", "Baseline Probability"],
  ["기준 대비", "vs Baseline"], ["동시에 유지 중", "Maintained Together"],
  ["다른 노드를 조절해도 기존 설정이 유지됩니다.", "Existing settings remain when another node is adjusted."],
  ["사용 방법", "How to Use"], ["노드 안의 상태를 눌러 100% 근거로 고정하세요", "Select a state to set it as 100% evidence"],
  ["고정한 근거에 따라 다른 노드의 확률이 함께 변합니다.", "Other node probabilities update from the fixed evidence."],
  ["다른 노드의 확률이 즉시 함께 변합니다.", "All other node probabilities update immediately."],
  ["선택 시", "Select ="],
  ["전체 표본", "Full Sample"], ["근거 없음", "No Evidence"], ["유지 중", "Maintained"], ["유지", "Maintained"],
  ["조절", "Adjusted"], ["연령대", "Age Group"], ["성별", "Sex"], ["여성", "Female"], ["남성", "Male"],
  ["낮음", "Low"], ["중간", "Mid"], ["높음", "High"], ["80세 이상", "Age 80+"], ["세", ""],
  ["실제/예측", "Actual/Predicted"], ["독립", "Independent"], ["제한", "Limited"],
  ["분석 결과를 불러오지 못했습니다. 페이지를 새로고침해 주세요.", "Could not load the analysis results. Please refresh the page."],
  ["기준", "Baseline"], ["관찰", "Observed"], ["확률", "Probability"], ["근거", "evidence"]
];

function translateKorean(text) {
  if (exactTranslations.has(text)) return exactTranslations.get(text);
  const translated = tokenTranslations.reduce((result, [ko, en]) => result.split(ko).join(en), text);
  return translated.replace(/(\d+)개/g, "$1 setting(s)");
}

function applyLanguage() {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let node;
  while ((node = walker.nextNode())) {
    if (node.parentElement?.closest("#language-toggle")) continue;
    const raw = node.nodeValue;
    const trimmed = raw.trim();
    if (!trimmed) continue;
    if (currentLanguage === "en") {
      if (/[ㄱ-힝]/.test(trimmed) || !originalText.has(node)) originalText.set(node, trimmed);
      const source = originalText.get(node) || trimmed;
      node.nodeValue = raw.replace(trimmed, translateKorean(source));
    } else if (originalText.has(node)) {
      node.nodeValue = raw.replace(trimmed, originalText.get(node));
    }
  }
  document.documentElement.lang = currentLanguage;
  const button = document.querySelector("#language-toggle");
  if (button) {
    button.textContent = currentLanguage === "ko" ? "EN" : "한국어";
    button.setAttribute("aria-label", currentLanguage === "ko" ? "영어로 전환" : "Switch to Korean");
  }
}

const nodeOrder = Object.keys(nodeConfig);
const stateLabels = {
  male: "남성", female: "여성", low: "낮음", mid: "중간", high: "높음",
  "65-69": "65–69세", "70-79": "70–79세", "80+": "80세 이상"
};

const networkStates = {
  functional_status: ["independent", "limited"],
  age_group: ["65-69", "70-79", "80+"], sex: ["male", "female"],
  physical_health: ["low", "mid", "high"], socioeconomic_resources: ["low", "mid", "high"],
  health_behavior: ["low", "mid", "high"], psychological_condition: ["low", "mid", "high"],
  cognitive_function: ["low", "mid", "high"], social_resources: ["low", "mid", "high"]
};
const networkOrder = ["functional_status", "age_group", "sex", "physical_health", "socioeconomic_resources", "health_behavior", "psychological_condition", "cognitive_function", "social_resources"];
const parents = {
  functional_status: [], age_group: ["functional_status"], sex: ["functional_status", "age_group"],
  physical_health: ["functional_status", "age_group"], socioeconomic_resources: ["functional_status", "age_group"],
  health_behavior: ["functional_status", "sex"], psychological_condition: ["functional_status", "physical_health"],
  cognitive_function: ["functional_status", "socioeconomic_resources"], social_resources: ["functional_status", "psychological_condition"]
};

const data = { summary: null, states: [], scenarios: [], cpts: {}, joint: [], baseline: null };
let selectedNode = "psychological_condition";
let softEvidence = new Map();

function parseCSV(text) {
  const rows = text.trim().split(/\r?\n/).map(line => {
    const values = [];
    let value = "";
    let quoted = false;
    for (let i = 0; i < line.length; i += 1) {
      const char = line[i];
      if (char === '"') quoted = !quoted;
      else if (char === "," && !quoted) { values.push(value); value = ""; }
      else value += char;
    }
    values.push(value);
    return values;
  });
  const headers = rows.shift();
  headers[0] = headers[0].replace(/^\uFEFF/, "");
  return rows.filter(row => row.some(Boolean)).map(values =>
    Object.fromEntries(headers.map((header, index) => [header, values[index]]))
  );
}

async function loadCSV(path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`${path} 파일을 불러오지 못했습니다.`);
  return parseCSV(await response.text());
}

function pct(value, digits = 1) { return `${(Number(value) * 100).toFixed(digits)}%`; }
function number(value) { return Number(value).toLocaleString("ko-KR"); }
function pp(value) {
  const v = Number(value) * 100;
  return `${v >= 0 ? "+" : ""}${v.toFixed(1)}%p`;
}
function stateLabel(state) { return stateLabels[state] || state; }
function stateRow(variable, state) {
  return data.states.find(row => row.variable === variable && row.state === state);
}

function profileText() {
  if (!softEvidence.size) return "기준 분포";
  return `조절 ${softEvidence.size}개`;
}

function localProbability(variable, assignment) {
  const rows = data.cpts[variable];
  const state = assignment[variable];
  const row = rows.find(candidate => {
    const candidateState = variable === "functional_status" ? candidate.Var1 : candidate[variable];
    return candidateState === state && parents[variable].every(parent => candidate[parent] === assignment[parent]);
  });
  return row ? Number(row.probability) : 0;
}

function buildJointTable() {
  const rows = [];
  function visit(index, assignment, weight) {
    if (index === networkOrder.length) { rows.push({ assignment: { ...assignment }, weight }); return; }
    const variable = networkOrder[index];
    networkStates[variable].forEach(state => {
      assignment[variable] = state;
      visit(index + 1, assignment, weight * localProbability(variable, assignment));
    });
  }
  visit(0, {}, 1);
  data.joint = rows;
}

function inferMarginals() {
  const totals = Object.fromEntries(networkOrder.map(variable => [variable, Object.fromEntries(networkStates[variable].map(state => [state, 0]))]));
  const weights = data.joint.map(row => row.weight);
  const constraints = [...softEvidence.entries()].map(([node, constraint]) => ({ node, ...constraint }));
  if (constraints.length) {
    for (let iteration = 0; iteration < 80; iteration += 1) {
      constraints.forEach(({ node, state, value }) => {
        let totalWeight = 0;
        let selectedWeight = 0;
        for (let i = 0; i < weights.length; i += 1) {
          totalWeight += weights[i];
          if (data.joint[i].assignment[node] === state) selectedWeight += weights[i];
        }
        const current = totalWeight ? selectedWeight / totalWeight : 0;
        const selectedFactor = current > 0 ? value / current : 0;
        const otherFactor = current < 1 ? (1 - value) / (1 - current) : 0;
        for (let i = 0; i < weights.length; i += 1) {
          weights[i] *= data.joint[i].assignment[node] === state ? selectedFactor : otherFactor;
        }
      });
      if (iteration % 5 === 4) {
        const maxError = Math.max(...constraints.map(({ node, state, value }) => {
          let sum = 0; let selected = 0;
          for (let i = 0; i < weights.length; i += 1) { sum += weights[i]; if (data.joint[i].assignment[node] === state) selected += weights[i]; }
          return Math.abs((sum ? selected / sum : 0) - value);
        }));
        if (maxError < 1e-7) break;
      }
    }
  }
  let total = 0;
  data.joint.forEach((row, index) => {
    const weight = weights[index];
    total += weight;
    networkOrder.forEach(variable => { totals[variable][row.assignment[variable]] += weight; });
  });
  networkOrder.forEach(variable => networkStates[variable].forEach(state => { totals[variable][state] = total ? totals[variable][state] / total : 0; }));
  return totals;
}

function renderTarget(marginals) {
  const limited = marginals.functional_status.limited;
  const independent = marginals.functional_status.independent;
  const baseline = data.baseline.functional_status.limited;
  document.querySelector("#target-profile").textContent = profileText();
  document.querySelector("#cv-risk-value").textContent = pct(limited);
  document.querySelector("#observed-value").textContent = pct(independent);
  document.querySelector("#observed-bar").style.width = pct(independent);
  document.querySelector("#target-n").textContent = softEvidence.size ? `조절 ${softEvidence.size}개` : "기준 확률";
  const change = document.querySelector("#probability-change");
  change.textContent = `기준 대비 ${pp(limited - baseline)}`;
  change.className = limited >= baseline ? "up" : "down";
  document.querySelector("#profile-summary").textContent = softEvidence.size
    ? `${profileText()} 유지 중 · 기능제한 ${pct(limited)} · 기능독립 ${pct(independent)}`
    : `기준 분포 · 기능제한 ${pct(limited)} · 기능독립 ${pct(independent)}`;
  const functionalEvidence = softEvidence.get("functional_status");
  document.querySelectorAll("[data-functional]").forEach(button => {
    button.classList.toggle("active", Boolean(functionalEvidence) && functionalEvidence.state === button.dataset.functional);
  });
  document.querySelector("#target-reset").disabled = !functionalEvidence;
  document.querySelector(".bn-target").classList.toggle("has-evidence", softEvidence.has("functional_status"));
  const target = document.querySelector(".bn-target");
  target.classList.remove("pulse");
  requestAnimationFrame(() => target.classList.add("pulse"));
}

function buildNodeControls() {
  document.querySelectorAll(".bn-node").forEach(card => {
    const node = card.dataset.node;
    const config = nodeConfig[node];
    const baseline = data.baseline[node];
    card.setAttribute("aria-label", `${config.label} 상태를 클릭해 100% 근거 선택`);
    card.innerHTML = `
      <header><strong>${config.label}</strong><button type="button" class="node-reset" aria-label="${config.label}만 초기화">노드 초기화</button></header>
      ${config.states.map(state => `
        <button type="button" class="dist-row" data-state="${state}" aria-label="${config.label} ${stateLabel(state)} 100% 근거 설정">
          <em>${stateLabel(state)}</em>
          <i><u style="width:${pct(baseline[state])}"></u></i>
          <b data-value>${pct(baseline[state])}</b>
          <small>기준 ${pct(baseline[state])}</small>
        </button>`).join("")}
    `;
    card.querySelectorAll(".dist-row").forEach(row => row.addEventListener("click", () => {
      selectedNode = node;
      const current = softEvidence.get(node);
      if (current && current.state === row.dataset.state) softEvidence.delete(node);
      else softEvidence.set(node, { state: row.dataset.state, value: 1 });
      renderInteractive();
    }));
    card.querySelector(".node-reset").addEventListener("click", event => {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      selectedNode = node;
      softEvidence.delete(node);
      renderInteractive();
    });
  });
}

function updateNodeControls(marginals) {
  document.querySelectorAll(".bn-node").forEach(card => {
    const node = card.dataset.node;
    const constraint = softEvidence.get(node);
    const active = Boolean(constraint);
    card.classList.toggle("selected", node === selectedNode);
    card.classList.toggle("has-evidence", active);
    card.querySelector(".node-reset").disabled = !active;
    card.querySelectorAll(".dist-row").forEach(row => {
      const state = row.dataset.state;
      const value = marginals[node][state];
      row.querySelector("u").style.width = pct(value);
      row.querySelector("[data-value]").textContent = pct(value);
      row.classList.toggle("active", active && constraint.state === state);
      row.setAttribute("aria-pressed", active && constraint.state === state ? "true" : "false");
    });
  });
}

function renderEditor() {
  const config = nodeConfig[selectedNode];
  document.querySelector("#editor-node-label").textContent = config.label;
  const options = document.querySelector("#state-options");
  const constraints = [...softEvidence.entries()];
  options.innerHTML = constraints.length
    ? `<div class="adjustment-readout"><span>동시에 유지 중</span><b>${constraints.map(([node, item]) => node === "functional_status" ? `${item.state === "limited" ? "기능제한" : "기능독립"} 100%` : `${nodeConfig[node].label} ${stateLabel(item.state)} 100%`).join(" · ")}</b><small>다른 노드를 조절해도 기존 설정이 유지됩니다.</small></div>`
    : `<div class="adjustment-readout"><span>사용 방법</span><b>노드 안의 상태를 클릭하세요</b><small>선택하면 100%, 같은 상태를 다시 누르면 해제됩니다.</small></div>`;
}

function renderInteractive() {
  const marginals = inferMarginals();
  updateNodeControls(marginals);
  renderEditor();
  renderTarget(marginals);
  applyLanguage();
  requestAnimationFrame(drawNetworkArrows);
}

function elementPoint(element, containerRect) {
  const rect = element.getBoundingClientRect();
  return {
    x: rect.left - containerRect.left + rect.width / 2,
    y: rect.top - containerRect.top + rect.height / 2,
    width: rect.width,
    height: rect.height
  };
}

function edgeAnchor(point, toward) {
  const dx = toward.x - point.x;
  const dy = toward.y - point.y;
  const scale = 1 / Math.max(Math.abs(dx) / (point.width / 2), Math.abs(dy) / (point.height / 2));
  return { x: point.x + dx * scale, y: point.y + dy * scale };
}

function drawArrow(ctx, fromPoint, toPoint, color, width, bend = 0) {
  const midpoint = { x: (fromPoint.x + toPoint.x) / 2, y: (fromPoint.y + toPoint.y) / 2 };
  const dx = toPoint.x - fromPoint.x;
  const dy = toPoint.y - fromPoint.y;
  const length = Math.hypot(dx, dy) || 1;
  const control = { x: midpoint.x - (dy / length) * bend, y: midpoint.y + (dx / length) * bend };
  const start = edgeAnchor(fromPoint, control);
  const end = edgeAnchor(toPoint, control);

  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.quadraticCurveTo(control.x, control.y, end.x, end.y);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.stroke();

  const angle = Math.atan2(end.y - control.y, end.x - control.x);
  const size = width > 1.8 ? 9 : 8;
  ctx.beginPath();
  ctx.moveTo(end.x, end.y);
  ctx.lineTo(end.x - size * Math.cos(angle - Math.PI / 6), end.y - size * Math.sin(angle - Math.PI / 6));
  ctx.lineTo(end.x - size * Math.cos(angle + Math.PI / 6), end.y - size * Math.sin(angle + Math.PI / 6));
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

function drawNetworkArrows() {
  const container = document.querySelector(".interactive-bn");
  const canvas = document.querySelector("#network-arrows");
  if (!container || !canvas) return;
  const scale = window.devicePixelRatio || 1;
  canvas.width = Math.round(container.clientWidth * scale);
  canvas.height = Math.round(container.clientHeight * scale);
  canvas.style.width = `${container.clientWidth}px`;
  canvas.style.height = `${container.clientHeight}px`;
  const ctx = canvas.getContext("2d");
  ctx.scale(scale, scale);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  const rect = container.getBoundingClientRect();
  const target = elementPoint(document.querySelector(".bn-target"), rect);
  const nodes = Object.fromEntries(nodeOrder.map(node => [node, elementPoint(document.querySelector(`[data-node="${node}"]`), rect)]));

  const classEdges = [
    ["age_group", 0], ["sex", 240], ["physical_health", 115], ["socioeconomic_resources", -165],
    ["health_behavior", 330], ["psychological_condition", -190], ["cognitive_function", -310], ["social_resources", 285]
  ];
  classEdges.forEach(([node, bend]) => drawArrow(ctx, target, nodes[node], "#9aa8b8", 1.45, bend));

  const tanEdges = [
    ["age_group", "sex", 40],
    ["age_group", "physical_health", 15],
    ["age_group", "socioeconomic_resources", -65],
    ["sex", "health_behavior", 0],
    ["physical_health", "psychological_condition", 0],
    ["socioeconomic_resources", "cognitive_function", 0],
    ["psychological_condition", "social_resources", 0]
  ];
  tanEdges.forEach(([from, to, bend]) => drawArrow(ctx, nodes[from], nodes[to], "#246fc8", 2.2, bend));
}

function metricCard(label, value, note) {
  return `<article><span>${label}</span><b>${value}</b><small>${note}</small></article>`;
}

function renderMetrics() {
  const s = data.summary;
  document.querySelector("#metrics-row").innerHTML = [
    metricCard("분석 표본", number(s.n), `${number(s.limited_n)}명 기능제한`),
    metricCard("관찰 기능제한", "18.9%", "ADL 또는 IADL 1개 이상 제한"),
    metricCard("10-fold CV AUC", Number(s.auc).toFixed(3), "out-of-fold prediction"),
    metricCard("Youden 절단점", Number(s.youden_threshold).toFixed(3), "maximum Youden index"),
    metricCard("민감도", pct(s.sensitivity), `TP ${number(s.confusion_matrix.tp)}`),
    metricCard("특이도", pct(s.specificity), `TN ${number(s.confusion_matrix.tn)}`),
    metricCard("양성예측도", pct(s.ppv), `FP ${number(s.confusion_matrix.fp)}`),
    metricCard("음성예측도", pct(s.npv), `FN ${number(s.confusion_matrix.fn)}`)
  ].join("");

  const m = s.confusion_matrix;
  document.querySelector("#confusion-matrix").innerHTML = `
    <table><thead><tr><th>실제/예측</th><th>독립</th><th>제한</th></tr></thead>
    <tbody><tr><th>독립</th><td><b>${number(m.tn)}</b><small>TN</small></td><td><b>${number(m.fp)}</b><small>FP</small></td></tr>
    <tr><th>제한</th><td><b>${number(m.fn)}</b><small>FN</small></td><td><b>${number(m.tp)}</b><small>TP</small></td></tr></tbody></table>`;
}

function renderStateChart() {
  document.querySelector("#state-chart").innerHTML = nodeOrder.map(variable => {
    const rows = nodeConfig[variable].states.map(state => stateRow(variable, state));
    return `<section class="state-panel">
      <h4>${nodeConfig[variable].label}</h4>
      ${rows.map(row => `
        <div class="state-chart-row">
          <span>${stateLabel(row.state)}</span>
          <div class="state-bar-pair" aria-label="CV ${pct(row.mean_cv_probability)}, 관찰 ${pct(row.observed_limited)}">
            <i><b class="cv" style="width:${pct(row.mean_cv_probability)}"></b></i>
            <i><b class="observed" style="width:${pct(row.observed_limited)}"></b></i>
          </div>
          <strong><b>${pct(row.mean_cv_probability)}</b><em>${pct(row.observed_limited)}</em></strong>
        </div>`).join("")}
    </section>`;
  }).join("");
}

const scenarioLabels = {
  "No evidence": "근거 없음", "Age 65-69": "65–69세", "Age 70-79": "70–79세", "Age 80+": "80세 이상",
  Male: "남성", Female: "여성", "Physical low": "신체건강 낮음", "Physical high": "신체건강 높음",
  "Cognitive low": "인지기능 낮음", "Cognitive high": "인지기능 높음", "Physical + cognitive low": "신체·인지 낮음",
  "Physical + cognitive high": "신체·인지 높음", "All domains low": "6개 영역 모두 낮음", "All domains high": "6개 영역 모두 높음"
};

function renderScenarios() {
  const sorted = [...data.scenarios].sort((a, b) => Number(a.probability_limited) - Number(b.probability_limited));
  document.querySelector("#scenario-bars").innerHTML = sorted.map(row => `
    <div><span>${scenarioLabels[row.scenario] || row.scenario}</span><i><b class="${row.scenario === "No evidence" ? "baseline-bar" : ""}" style="width:${Math.min(Number(row.probability_limited) * 100, 100)}%"></b></i><strong>${pct(row.probability_limited)}</strong><small>${pp(row.change_from_baseline)}</small></div>
  `).join("");
}

async function init() {
  try {
    const [summary, states, scenarios, functionalStatus, ageGroup, sex, physicalHealth, socioeconomicResources, healthBehavior, psychologicalCondition, cognitiveFunction, socialResources] = await Promise.all([
      fetch("data/r_cv/summary.json").then(response => response.json()),
      loadCSV("data/r_cv/state_results.csv"),
      loadCSV("data/representative_scenario_probabilities.csv"),
      loadCSV("data/cpt/functional_status_CPT.csv"),
      loadCSV("data/cpt/age_group_CPT.csv"),
      loadCSV("data/cpt/sex_CPT.csv"),
      loadCSV("data/cpt/physical_health_CPT.csv"),
      loadCSV("data/cpt/socioeconomic_resources_CPT.csv"),
      loadCSV("data/cpt/health_behavior_CPT.csv"),
      loadCSV("data/cpt/psychological_condition_CPT.csv"),
      loadCSV("data/cpt/cognitive_function_CPT.csv"),
      loadCSV("data/cpt/social_resources_CPT.csv")
    ]);
    Object.assign(data, {
      summary, states, scenarios,
      cpts: {
        functional_status: functionalStatus, age_group: ageGroup, sex,
        physical_health: physicalHealth, socioeconomic_resources: socioeconomicResources,
        health_behavior: healthBehavior, psychological_condition: psychologicalCondition,
        cognitive_function: cognitiveFunction, social_resources: socialResources
      }
    });
    buildJointTable();
    data.baseline = inferMarginals();
    buildNodeControls();
    document.querySelectorAll("[data-functional]").forEach(button => button.addEventListener("click", () => {
      const current = softEvidence.get("functional_status");
      if (current && current.state === button.dataset.functional) softEvidence.delete("functional_status");
      else softEvidence.set("functional_status", { state: button.dataset.functional, value: 1 });
      renderInteractive();
    }));
    document.querySelector("#target-reset").addEventListener("click", () => {
      softEvidence.delete("functional_status");
      renderInteractive();
    });
    document.querySelector("#clear-all").addEventListener("click", () => { softEvidence.clear(); renderInteractive(); });
    document.querySelector("#language-toggle").addEventListener("click", () => {
      currentLanguage = currentLanguage === "ko" ? "en" : "ko";
      applyLanguage();
    });
    window.addEventListener("resize", drawNetworkArrows);

    renderInteractive();
    renderMetrics();
    renderStateChart();
    renderScenarios();
    applyLanguage();
  } catch (error) {
    document.querySelector("#profile-summary").textContent = "분석 결과를 불러오지 못했습니다. 페이지를 새로고침해 주세요.";
    console.error(error);
  }
}

init();
