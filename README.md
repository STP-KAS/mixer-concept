# MIX

**Parker’s Kaspa Explained + STP doors and wallets + PegLab.**

Public site: [https://mixxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.club](https://mixxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.club)  
Local preview: [http://127.0.0.1:8910/](http://127.0.0.1:8910/)

Parker codes the explanations. STP does the doors, Kasware/Kastle, and Windows preview. PegLab is the dapp unit that depegs on purpose.

This is not a token, not a bank, and not Parker’s kaspaexplained.com. It is the mix.

## Three lanes

| Lane | What you get |
| --- | --- |
| **Learn** | Parker’s payment, parallel-block, and spending-rule models. Sources you can check. |
| **Doors** | STP audience doors, welcome film, PoW ethos, Node tab, playground with tKAS. |
| **PegLab** | In-browser depeg engine at `/peglab`. Live KasWare lab at `/lab/`. |

Town economy (Sprout Harbor) stays at `/covenants`. Wrap lab at `/wrap`.

Upstream education: [parker2017code/kaspa-explained](https://github.com/parker2017code/kaspa-explained) · [kaspaexplained.com](https://kaspaexplained.com)  
STP overlay: [STP-KAS/kaspaexplained-delusional-stp](https://github.com/STP-KAS/kaspaexplained-delusional-stp) · [stpstpstpstpstpstpstp.club](https://stpstpstpstpstpstpstp.club)  
PegLab: [STP-KAS/peglab-stp](https://github.com/STP-KAS/peglab-stp) · [peglabbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb.club](https://peglabbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb.club)

## Run locally

```powershell
cd C:\Users\Remco\mix-club
npm ci
.\start-ui.ps1
```

Then open:

- [http://127.0.0.1:8910/](http://127.0.0.1:8910/)
- [http://127.0.0.1:8910/peglab](http://127.0.0.1:8910/peglab)
- [http://127.0.0.1:8910/lab/](http://127.0.0.1:8910/lab/)

The host tKAS faucet for PegLab stays on the standalone PegLab server at [http://127.0.0.1:8765/](http://127.0.0.1:8765/) when that process is running. MIX’s public `/lab/` never ships a seed.

DNS for the public domain: [DNS.md](DNS.md).

## Honest limits

- TESTNET-10 toys are not USD, not a business, and not a mainnet app.
- Education pages are independent of Kaspa core.
- Anybody can compile a similarly named PegLab series. Verify genesis outpoint, template hash, series bytes, and backing.
