# P-21 JWT Validation Handoff

> Updated: 2026-07-05

## Outcome

P-21 is partly implemented across five repositories. The main backend and Android code slices are complete and committed on isolated `codex/p-21-*` branches. Platform docs/evidence and final cross-service BDD verification are still pending.

## Completed branches

| Repository | Branch | Commit | Status |
| --- | --- | --- | --- |
| book-realm | `codex/p-21-platform-jwt` | `7432837` | BDD JWT boundary scenarios added |
| br-library-service | `codex/p-21-library-jwt` | `a9825d5` | Library derives mark/comment identity from JWT |
| br-event-stats | `codex/p-21-stats-jwt` | `0e92ac7` | Stats derives progress identity from JWT |
| br-ai-service | `codex/p-21-ai-jwt` | `44e7517` | AI POST endpoints require JWT |
| br-reader-app | `codex/p-21-reader-jwt` | `0902835` | Android sends bearer token and stops sending protected `userId` |

## Verification already run

- book-realm: `npm run bdd:dry`, `npm run verify:fast`.
- br-library-service: `mvn -Dtest=ReadingMarkControllerTest test`, `mvn test`.
- br-event-stats: `mvn -Dtest=StatsControllerTest test`, `mvn test`.
- br-ai-service: `mvn -Dtest=JwtUtilsTest test`, `mvn -Dtest=AiControllerTest test`, `mvn test`.
- br-reader-app: `.\gradlew.bat testDebugUnitTest --tests "*AuthHeaderInterceptorTest" --tests "*ReadingInteractionDtoTest"`, `.\gradlew.bat testDebugUnitTest assembleDebug`.

## Review notes

- Library passed spec review. Quality review found four issues; all were fixed in `a9825d5`.
- Stats passed spec review. Local quality check found no critical or important issue.
- AI and Android implementation reports are complete, but final spec/quality review still needs to be run.
- Android build warning remains: AGP `8.5.2` is tested up to `compileSdk = 34`; project uses `35`. Build passed.

## Still to do

1. Review AI slice: spec compliance and quality.
2. Review Android slice: spec compliance and quality.
3. Run cross-repo search for remaining client-owned protected `userId`.
4. Start platform services and run `book-realm` `npm run bdd:api` with `BDD_OTHER_TOKEN`.
5. Update ADR-011 to `Implemented` only after final evidence exists.
6. Update API reference: protected endpoints require `Authorization: Bearer <token>` and derive user identity from JWT.
7. Update Linear P-21 with final evidence and PR links.
8. Open/finish draft PRs or merge branches when ready.

## Resume checklist on a new computer

1. Clone all five repositories from GitHub.
2. Check out the branches listed above.
3. Install Java 21, Node, Android SDK, Maven, and GitHub CLI.
4. For Android, create local `local.properties` with the local SDK path.
5. Run each repo's verification command from the table above.
6. Continue from the review and docs tasks in this handoff.

## Important local paths from the old machine

- Platform worktree: `C:\Users\艾莉\.config\superpowers\worktrees\p-21\book-realm`
- Library worktree: `C:\Users\艾莉\.config\superpowers\worktrees\p-21\br-library-service`
- Stats worktree: `C:\Users\艾莉\.config\superpowers\worktrees\p-21\br-event-stats`
- AI worktree: `C:\Users\艾莉\.config\superpowers\worktrees\p-21\br-ai-service`
- Android worktree: `C:\dev\worktrees\p-21\br-reader-app`
