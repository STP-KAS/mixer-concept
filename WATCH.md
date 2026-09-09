# Watch Parker and STP

MIX is the learn/explore benchmark. Door **principles** stay. Door **intel** is extracted from:

- [parker2017code/kaspa-explained](https://github.com/parker2017code/kaspa-explained) (education, models, status, contract lab)
- [STP-KAS/kaspaexplained-delusional-stp](https://github.com/STP-KAS/kaspaexplained-delusional-stp) (doors, Node, wallets, ethos)

Do not flatten the four doors into a textbook. Do not copy price talk. Pull dated Kaspa facts and interactive models onto the doors.

Local remotes in this repo: `upstream` (Parker), `stp` (STP overlay).

```powershell
git fetch upstream
git fetch stp
git log HEAD..upstream/main --oneline
git log HEAD..stp/main --oneline
```

Parker watch is a 24-hour Grok schedule only. No persistent SHA poller. STP is not on this schedule. When Parker `main` or another kaspa-explained branch moves, extract intel into MIX doors and rebuild.

Last seen 2026-09-09:

- Parker `upstream/main` `8ad2b604102694464a1206b4fdc66ddab09f37bf`
- Parker `upstream/studio-beta` `ba38e3be8027dbd3b985300d4a8db9bddd1c40c5` (isolated Kaspa Studio; not MIX runtime)
- STP `stp/main` `3a1f31e613a850e57b26b58a9bfecbc9096d4c2f`
