# 📋 Copy-Paste Commands (No Experience Required)

> **Just copy these commands and paste them. No need to understand how they work.**

## Check If Everything Is Working
```bash
# Copy and paste this entire block
cd "C:\Users\kyler\Desktop\Enterprise-AI-Automation"
echo "=== SYSTEM HEALTH CHECK ==="
./scripts/monitoring/health-check.sh
echo ""
echo "=== WHAT'S NEXT ==="
head -5 pending-repos.txt
```

## Deploy MCP to ONE Repository (Safest Option)
```bash
# Replace "test-repo-sandbox" with the repo name you want
cd "C:\Users\kyler\Desktop\Enterprise-AI-Automation"
./scripts/deployment/deploy-single-repo.sh Krosebrook test-repo-sandbox
```

## Deploy to Your 5 Most Important Repos
```bash
cd "C:\Users\kyler\Desktop\Enterprise-AI-Automation"
./scripts/deployment/deploy-all.sh Krosebrook 5
```

## When Something Goes Wrong
```bash
# Copy-paste this to get help info
cd "C:\Users\kyler\Desktop\Enterprise-AI-Automation"
echo "=== RECENT ERRORS ==="
tail -20 logs/*.log | grep -i error
echo ""
echo "=== SYSTEM STATUS ==="
./scripts/monitoring/health-check.sh
echo ""
echo "=== WHAT TO DO ==="
echo "1. Look in TROUBLESHOOTING.md for these error messages"
echo "2. Try the 'Quick Fixes' section first"
echo "3. If still broken, restart everything with enterprise-ai.sh"
```

## Daily Cleanup (Run This Every Morning)
```bash
cd "C:\Users\kyler\Desktop\Enterprise-AI-Automation"
quick-improvements.bat
echo "=== TODAY'S GOALS ==="
echo "Check the DAILY-CHECKLIST.md file for what to do today"
```

## Emergency Reset (Only When Everything Is Broken)
```bash
# STOP - only use this when you're really stuck
cd "C:\Users\kyler\enterprise-ai"
./enterprise-ai.sh stop
./enterprise-ai.sh start-dev
cd "C:\Users\kyler\Desktop\Enterprise-AI-Automation"
./scripts/monitoring/health-check.sh
```

## Check How Many Repos Have MCP Deployed
```bash
cd "C:\Users\kyler\Desktop\Enterprise-AI-Automation"
echo "=== MCP DEPLOYMENT STATUS ==="
cat CURRENT-STATE.json | findstr "deployedRepos"
echo ""
echo "=== NEXT REPOS TO DEPLOY ==="
head -10 pending-repos.txt
```

## Backup Everything Important (Do This Weekly)
```bash
cd "C:\Users\kyler\Desktop\Enterprise-AI-Automation"
mkdir "backups\backup-%date:~-4,4%-%date:~-10,2%-%date:~-7,2%"
copy CURRENT-STATE.json "backups\backup-%date:~-4,4%-%date:~-10,2%-%date:~-7,2%\"
copy pending-repos.txt "backups\backup-%date:~-4,4%-%date:~-10,2%-%date:~-7,2%\"
copy daily-operations.log "backups\backup-%date:~-4,4%-%date:~-10,2%-%date:~-7,2%\"
echo "✅ Backup completed"
```

---

## 🎯 Start Here (Your First Day)
1. Copy-paste the "Check If Everything Is Working" command
2. If health is above 75%, try deploying to one test repo
3. If health is below 75%, look in TROUBLESHOOTING.md
4. Add a line to daily-operations.log about what you did

**Remember**: You don't need to understand these commands. Just copy, paste, and see what happens.