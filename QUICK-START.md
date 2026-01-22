# ⚡ Quick Start - Get Running in 5 Minutes

> New developer? Start here for the fastest path to productivity.

## 🏃‍♂️ Speed Run (5 minutes)

### Step 1: Verify Prerequisites (30 seconds)
```bash
# Open Git Bash and run:
node --version && python --version && gh auth status
```
✅ Should show versions and "Logged in to github.com"

### Step 2: Test Existing Setup (1 minute)
```bash
# Check if enterprise AI system is ready:
C:\Users\kyler\enterprise-ai\enterprise-ai.sh status

# Test Supabase
curl http://localhost:54323 2>/dev/null && echo "✅ Supabase OK" || echo "❌ Supabase down"
```

### Step 3: Your First MCP Deployment (2 minutes)
```bash
# Go to automation folder
cd "C:\Users\kyler\Desktop\Enterprise-AI-Automation"

# Make scripts executable
chmod +x scripts/**/*.sh

# Test deploy to sandbox repo
./scripts/deployment/deploy-single-repo.sh Krosebrook test-repo-sandbox
```

### Step 4: Verify Success (1 minute)
```bash
# Check the deployment
gh repo view Krosebrook/test-repo-sandbox --web

# Run health check
./scripts/monitoring/health-check.sh
```

### Step 5: Update Status (30 seconds)
```bash
# Mark your first success
echo "$(date): First successful deployment" >> daily-log.txt

# Check what's next
cat CURRENT-STATE.json | jq '.nextActions[0]'
```

## 🎯 What You Just Did

1. **Verified** - Your development environment works
2. **Deployed** - MCP server to a test repository  
3. **Tested** - The deployment was successful
4. **Monitored** - System health is good
5. **Documented** - Your first achievement

## 🚀 Next Steps (Choose Your Path)

### Path A: Deploy to Production Repos
```bash
# Deploy to FlashFusion (highest priority)
./scripts/deployment/deploy-single-repo.sh Krosebrook FlashFusion-Unified

# Deploy to 5 more repos
./scripts/deployment/deploy-all.sh Krosebrook 5
```

### Path B: Understand the System
```bash
# Read the handoff notes
less HANDOFF-NOTES.md

# Explore MCP configurations
ls -la templates/mcp-server/

# Check current deployment status
cat CURRENT-STATE.json | jq '.repositories'
```

### Path C: Fix Issues
```bash
# If health check found problems
less TROUBLESHOOTING.md

# Test specific components
./scripts/monitoring/health-check.sh --report
```

## 🎓 Learning Resources (10 minutes each)

### Essential Commands
```bash
# System status
C:\Users\kyler\enterprise-ai\enterprise-ai.sh status

# Deploy one repo
./scripts/deployment/deploy-single-repo.sh ORG REPO

# Deploy multiple repos  
./scripts/deployment/deploy-all.sh ORG BATCH_SIZE

# Health check
./scripts/monitoring/health-check.sh

# View current state
cat CURRENT-STATE.json | jq .
```

### Key Files to Bookmark
- `START-HERE.md` - Main documentation
- `HANDOFF-NOTES.md` - Personal insights from previous dev
- `CURRENT-STATE.json` - Live system state
- `TROUBLESHOOTING.md` - When things break
- `scripts/deployment/` - Deployment automation

## 🔥 Pro Tips

### Speed Up Common Tasks
```bash
# Create aliases for frequent commands
echo 'alias deploy="./scripts/deployment/deploy-single-repo.sh"' >> ~/.bashrc
echo 'alias health="./scripts/monitoring/health-check.sh"' >> ~/.bashrc
echo 'alias status="C:\Users\kyler\enterprise-ai\enterprise-ai.sh status"' >> ~/.bashrc

# Now you can use:
deploy Krosebrook my-repo
health
status
```

### Monitor Everything
```bash
# Watch logs in real-time
tail -f logs/*.log

# Monitor system resources
watch -n 5 './scripts/monitoring/health-check.sh --json | jq .metrics'
```

### Batch Operations
```bash
# Deploy to all ChaosClubCo repos
./scripts/deployment/deploy-all.sh ChaosClubCo 5

# Check status of all organizations
for org in Krosebrook ChaosClubCo FlashFusionv1; do
  echo "=== $org ==="
  gh repo list $org --limit 5
done
```

## 🚨 Red Flags (Stop and Get Help)

- ❌ `gh auth status` fails → Need GitHub authentication
- ❌ Port 54323 not responding → Supabase not running
- ❌ "rate limit exceeded" → Need to wait or use different API key
- ❌ "remote rejected" on push → GitHub push protection (probably OK)
- ❌ Health check < 50% → System has serious issues

## 📞 Getting Unstuck

### Quick Fixes (Try First)
```bash
# Restart everything
C:\Users\kyler\enterprise-ai\enterprise-ai.sh stop
C:\Users\kyler\enterprise-ai\enterprise-ai.sh start-dev

# Clear caches
npm cache clean --force
git gc --aggressive

# Fix permissions
chmod +x scripts/**/*.sh
```

### Information to Gather (Before Asking for Help)
```bash
# System info
./scripts/monitoring/health-check.sh --report > system-status.md

# Recent errors
grep -i error logs/*.log | tail -10

# What you were trying to do
echo "I was running: [paste command here]"
echo "Expected: [what should happen]" 
echo "Actual: [what actually happened]"
```

## ✅ Success Metrics

After this quick start, you should have:

- [ ] ✅ System health check passing (>75%)
- [ ] 📦 At least 1 MCP server deployed
- [ ] 🔍 Understanding of log locations
- [ ] 🚀 Confidence to deploy to more repos
- [ ] 📚 Bookmarked key documentation
- [ ] 🛠️ Working development workflow

---

**🎉 Congratulations!** You're now ready to take over the Enterprise AI Automation system. 

**⏰ Time invested**: 5 minutes  
**🎯 Value unlocked**: Full system access and deployment capability  
**🚀 Next milestone**: Deploy MCP to 10+ repositories

---

*Questions? Check `HANDOFF-NOTES.md` for personal insights from the previous developer.*