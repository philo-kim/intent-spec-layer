# Korean Community Launch Draft

Use this as a starting point when sharing Intent Specification Layer with Korean
developer communities. Keep the tone practical and feedback-oriented. Do not
cross-post the same text everywhere.

Repository:

```text
https://github.com/philo-kim/intent-spec-layer
```

## OKKY / Community Short Post

Title options:

```text
AI 코딩에서 "스펙은 있는데 실제 테스트가 없는 문제"를 줄이려고 ILS를 공개했습니다
```

```text
AI 코딩 에이전트가 테스트 없이 완료했다고 착각하지 않게 하는 스펙 레이어를 만들었습니다
```

Post:

```md
안녕하세요. AI 코딩을 하면서 반복해서 겪는 문제가 하나 있었습니다.

자연어로 설명하면 AI가 코드는 빠르게 만듭니다. 그런데 어느 순간부터
"그럴듯하게 동작하는 코드"와 "의도한 제품 경험을 실제로 지키는 코드"가
갈라집니다.

특히 위험했던 지점은 테스트였습니다.

- REQ-ID는 있음
- 테스트 stub도 생성됨
- Verification Map도 있음
- 그런데 실제 동작을 증명하는 테스트/가드레일/수동 검증은 없음

이 상태에서도 AI는 작업이 완료됐다고 말하기 쉽습니다.

그래서 Intent Specification Layer(ILS)라는 오픈소스 레포를 공개했습니다.

핵심 아이디어는 단순합니다.

`docs/`는 설명하고, `spec/`은 지배한다.

그리고 각 의도 문장은 아래처럼 검증 의무로 이어져야 합니다.

```text
intent -> EARS behavior -> REQ/S statement ID -> verification obligation
       -> generated stub -> non-generated trace -> executed evidence
```

중요한 점은 generated test stub은 증거가 아니라는 것입니다.
`@Spec(...)` 주석도 최종 증거가 아닙니다.
실제 테스트, 가드레일, smoke check, 또는 명시된 수동 UX/runtime 리뷰가
실행되거나 기록되어야 verified로 봅니다.

레포:

https://github.com/philo-kim/intent-spec-layer

현재 들어있는 것:

- L0-L3 스펙 구조
- EARS 기반 행동 명세
- spec review loop
- REQ-ID / statement-level verification bridge
- AI agent operating protocol
- feature spec / review ledger / agent task brief 템플릿
- 작은 실험과 재현 가능한 체크 스크립트

제가 가장 피드백 받고 싶은 부분은 이겁니다.

1. AI 에이전트가 이 레포를 읽었을 때 실제로 테스트를 만들어야겠다는 압박을 받는가?
2. generated stub, mapped, traced, verified 상태 구분이 실무적으로 충분한가?
3. spec이 구현 상태 추적 문서로 오염되지 않으면서도 코드 갭을 발견하는 데 쓸 수 있는가?
4. 한국 팀/개발자들이 실제 프로젝트에 적용한다면 어떤 템플릿이 더 필요할까?

홍보보다는 방법론 피드백을 받고 싶어서 올립니다.
비슷한 문제를 겪어보신 분들의 의견이 궁금합니다.
```

## Velog / Blog Longer Post

Title:

```text
AI 코딩에서 generated test stub은 증거가 아니다: Intent Specification Layer를 공개하며
```

Post:

```md
# AI 코딩에서 generated test stub은 증거가 아니다

AI 코딩을 하다 보면 자연어 설명만으로도 코드가 빠르게 나옵니다.
문제는 코드가 "돌아간다"는 사실과 "의도한 제품 경험을 지킨다"는 사실이
같지 않다는 점입니다.

처음에는 PRD나 대화 맥락만 잘 쓰면 충분하다고 생각하기 쉽습니다.
하지만 실제 구현이 커지면 AI가 추측해야 하는 영역이 늘어납니다.

- 이 상태에서 사용자가 다시 제출하면?
- 외부 서비스는 성공했는데 로컬 저장이 실패하면?
- 이미 처리된 요청이 다시 들어오면?
- 실패 후 사용자는 다음에 무엇을 해야 하는가?
- 테스트 stub은 있는데 실제 테스트는 없는 상태를 완료로 봐도 되는가?

이런 문제를 줄이기 위해 Intent Specification Layer(ILS)를 만들었습니다.

GitHub:

https://github.com/philo-kim/intent-spec-layer

## 핵심 규칙

```text
docs/ explains. spec/ governs.
```

`docs/`는 설명 문서입니다.
`spec/`은 구현과 리뷰를 지배하는 의도 정본입니다.

## 구조

ILS는 네 개의 레이어를 사용합니다.

| Layer | 역할 |
|---|---|
| L0 Constitution | 제품 전체 가치, 금지할 shortcut, 상위 권한 |
| L1 Domain Truth | 엔티티, 상태, 용어, invariant |
| L2 Behavior Spec | EARS 기반 행동 명세 |
| L3 Interface Contract | 순서, payload, idempotency, rollback, partial failure |

모든 기능에 네 레이어가 다 필요한 것은 아닙니다.
하지만 행동 변경에는 L2가 필요하고, 공유 용어에는 L1이 필요하고,
rollback/idempotency/외부 서비스/결제/삭제 같은 경계가 있으면 L3가 필요합니다.

## 테스트 체계의 핵심

이번에 가장 신경 쓴 부분은 테스트입니다.

REQ-ID가 있다고 충분하지 않습니다.
generated test stub이 있다고 충분하지 않습니다.
`@Spec(...)` 주석이 있다고 충분하지 않습니다.

ILS에서는 각 의도 문장이 아래 흐름을 타야 합니다.

```text
intent -> EARS behavior -> REQ/S statement ID -> verification obligation
       -> generated stub -> non-generated trace -> executed evidence
```

상태도 분리합니다.

| 상태 | 의미 |
|---|---|
| generated_stub | 자동 생성된 자리. 증거 아님 |
| mapped | 검증 경로가 정해짐. 아직 증거 아님 |
| traced | 실제 코드/테스트/가드레일에 연결됨. 아직 최종 증거 아님 |
| verified | 테스트/가드레일/smoke/manual review가 실행 또는 기록됨 |
| manual_only | 자동화가 부적합하고 수동 리뷰가 인정된 증거 |
| blocked | 증거 경로는 알지만 현재 실행 불가 |

AI 에이전트가 구현을 시작할 때는 먼저 REQ/S ID를 잡고, 어떤 테스트나
가드레일을 같이 바꿀지 정해야 합니다. 구현 후에 "테스트는 나중에"가 아니라,
구현과 검증 증거가 같은 변화 안에 있어야 합니다.

## 왜 공개했나

이 레포는 특정 제품의 문서가 아니라, AI 코딩을 더 안전하게 하기 위한
작업 방식입니다.

특히 이런 팀이나 개인에게 도움이 될 수 있다고 생각합니다.

- AI 코딩 에이전트를 실무 코드에 쓰는 사람
- PRD나 plan mode만으로는 구현 품질이 흔들린다고 느끼는 사람
- "스펙은 있는데 테스트는 빈껍데기"인 상태를 줄이고 싶은 사람
- AI가 만든 코드를 리뷰 가능한 의도 단위로 쪼개고 싶은 사람

## 피드백 받고 싶은 질문

1. 이 구조를 AI 에이전트가 읽으면 실제로 테스트를 만들어야겠다고 느낄까요?
2. `generated_stub`, `mapped`, `traced`, `verified` 구분이 실무적으로 충분할까요?
3. `spec/`이 구현 상태표로 오염되지 않으면서 코드 갭을 발견하는 도구로 쓰일 수 있을까요?
4. 한국 개발팀에서 쓰려면 어떤 예제나 템플릿이 더 필요할까요?

레포:

https://github.com/philo-kim/intent-spec-layer
```

## Posting Notes

- Lead with the problem, not the repo.
- Ask for feedback on the method, not stars.
- Do not post the same text to every community.
- After posting, stay available for comments for at least 12-24 hours.
- If a community treats self-promotion strictly, share the longer article first
  and put the repository link after the explanation.
