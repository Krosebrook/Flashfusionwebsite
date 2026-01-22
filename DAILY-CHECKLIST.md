# 📋 Daily Operations Checklist

> **5-minute daily routine to keep your system healthy**

## Morning Routine (2 minutes)
- [ ] Run `quick-improvements.bat` (cleans up and checks health)
- [ ] Check `daily-operations.log` for any issues
- [ ] Look at `CURRENT-STATE.json` - are the numbers growing?

## Before Any Deployments (1 minute)
- [ ] Run: `./scripts/monitoring/health-check.sh`
- [ ] Make sure health is above 75%
- [ ] If below 75%, check `TROUBLESHOOTING.md`

## After Deployments (1 minute)  
- [ ] Update `CURRENT-STATE.json` with new numbers
- [ ] Add a line to `daily-operations.log` about what you deployed
- [ ] Test one deployed repo: `gh repo view ORG/REPO --web`

## End of Day (1 minute)
- [ ] Backup important files: `copy CURRENT-STATE.json backups\`
- [ ] Write one sentence in `daily-operations.log` about today
- [ ] Close any running services if not needed overnight

## Weekly (5 minutes)
- [ ] Read through `TROUBLESHOOTING.md` to learn about common issues  
- [ ] Update the priority list in `pending-repos.txt`
- [ ] Clean up old backup files (keep last 7 days)

## Red Flags (Stop and Ask for Help)
- ❌ Health check below 50%
- ❌ Can't access GitHub (`gh auth status` fails)
- ❌ Seeing lots of "ERROR" in logs
- ❌ Deployments failing repeatedly

---

**Remember**: You don't need to understand everything. Follow the checklist, and ask for help when you see red flags.