# 🚨 Troubleshooting Guide - Enterprise AI Automation

> When things go wrong, check here first. Solutions are ordered by likelihood and impact.

## 🔥 Critical Issues (Fix Immediately)

### 1. All Services Down
**Symptoms**: No services responding, all ports unreachable
```bash
# Quick diagnosis
C:\Users\kyler\enterprise-ai\enterprise-ai.sh status

# Force restart everything
C:\Users\kyler\enterprise-ai\enterprise-ai.sh stop
C:\Users\kyler\enterprise-ai\enterprise-ai.sh start-dev

# Check for port conflicts
netstat -ano | findstr "54323\|5678\|7860"

# If still broken - nuclear option
taskkill /F /IM node.exe
taskkill /F /IM python.exe
C:\Users\kyler\enterprise-ai\enterprise-ai.sh start-dev
```

### 2. GitHub Push Protection Blocking Deployments
**Symptoms**: `remote rejected` with secret scanning message

**Root Cause**: API keys detected in MCP config files

**Fix**:
```bash
# Check if using environment variables correctly
grep -r "sk-ant-" scripts/
grep -r "ANTHROPIC_API_KEY.*sk-ant" scripts/

# Should return nothing. If it finds actual keys, fix with:
sed -i 's/sk-ant-[^"]*/"${ANTHROPIC_API_KEY}"/g' scripts/deployment/*.sh
```

### 3. Rate Limit Exceeded
**Symptoms**: `403 rate limit exceeded` or `429 too many requests`

**Fix**:
```bash
# Check current rate limit status
gh api rate_limit

# If exceeded, wait or switch to different token
export GITHUB_TOKEN="your_backup_token"

# For Anthropic rate limits
grep "rate.*limit\|429\|exceeded" C:\Users\kyler\enterprise-ai\logs\*.log
```

## ⚡ Common Issues

### 4. n8n Command Not Found
**Symptoms**: `/usr/bin/bash: line 1: n8n: command not found`

**Fix**:
```bash
# Method 1: Use full path
node "C:\Users\kyler\AppData\Roaming\npm\node_modules\n8n\bin\n8n" --version

# Method 2: Fix PATH (permanent solution)
echo 'export PATH="$PATH:/c/Users/kyler/AppData/Roaming/npm"' >> ~/.bashrc
source ~/.bashrc

# Method 3: Create alias
echo 'alias n8n="node /c/Users/kyler/AppData/Roaming/npm/node_modules/n8n/bin/n8n"' >> ~/.bashrc
```

### 5. Supabase Connection Failed
**Symptoms**: `Connection refused` on port 54323

**Fix**:
```bash
# Check if Supabase is running
supabase status

# If not running
supabase start

# If port conflict
supabase stop
netstat -ano | findstr "54323"
# Kill process using the port
taskkill /F /PID [PID_NUMBER]
supabase start
```

### 6. MCP Deployment Stuck/Failed
**Symptoms**: Deployment hangs or fails silently

**Fix**:
```bash
# Check deployment logs
ls -la logs/deploy_*

# Kill stuck processes
ps aux | grep "deploy-single-repo\|git clone"
kill -9 [PID]

# Clean up temp directories
rm -rf temp_*
rm -rf tmp-*

# Retry single repo
./scripts/deployment/deploy-single-repo.sh Krosebrook test-repo-sandbox
```

### 7. API Keys Not Working
**Symptoms**: `401 unauthorized` or `invalid api key`

**Fix**:
```bash
# Test Claude API key
curl -H "Authorization: Bearer $ANTHROPIC_API_KEY" \
     -H "Content-Type: application/json" \
     https://api.anthropic.com/v1/messages

# Test GitHub API key  
gh api user

# Check .env.enterprise file
cat C:\Users\kyler\.env.enterprise | grep -E "(ANTHROPIC|GITHUB|SUPABASE)"

# Rotate keys if needed
./security/rotate-all-keys.sh
```

## 🔧 Performance Issues

### 8. Slow API Responses
**Symptoms**: Requests taking >10 seconds

**Fix**:
```bash
# Check API usage
./scripts/monitoring/check-api-usage.sh

# Monitor real-time
curl -w "@curl-format.txt" -H "Authorization: Bearer $ANTHROPIC_API_KEY" \
     https://api.anthropic.com/v1/messages

# Check for memory leaks
ps aux | grep node | head -20
```

### 9. High Memory Usage
**Symptoms**: System slowing down, out of memory errors

**Fix**:
```bash
# Find memory hogs
ps aux --sort=-%mem | head -10

# Restart MCP servers (they can leak memory)
./scripts/monitoring/restart-mcp-servers.sh

# Clean up node processes
pkill -f "mcp-server.js"
pkill -f "n8n"
```

## 🕵️ Debugging Techniques

### Log Analysis
```bash
# Find errors in logs
grep -i "error\|fail\|exception" C:\Users\kyler\enterprise-ai\logs\*.log

# Monitor logs in real-time
tail -f C:\Users\kyler\enterprise-ai\logs\*.log

# Search for specific issues
grep -r "429\|rate.*limit" logs/
grep -r "connection refused\|timeout" logs/
```

### System Health Check
```bash
# Run comprehensive health check
./scripts/monitoring/health-check.sh

# Test each service individually
curl http://localhost:54323/rest/v1/ # Supabase
curl http://localhost:5678/rest/healthz # n8n (if running)

# Check disk space
df -h

# Check network connectivity
ping github.com
ping api.anthropic.com
```

### MCP Server Testing
```bash
# Test MCP server directly
echo '{"method": "tools/list"}' | node mcp-server.js

# Test with Claude Code
claude --mcp-server ./mcp-server.js

# Check MCP configuration
cat .mcp/config.json | jq .
```

## 🚑 Emergency Recovery Procedures

### Complete System Reset
```bash
#!/usr/bin/env bash
# Emergency reset script - USE WITH CAUTION

# 1. Stop all services
C:\Users\kyler\enterprise-ai\enterprise-ai.sh stop
pkill -f "node.*mcp"
pkill -f "python.*langflow"

# 2. Backup current state
cp CURRENT-STATE.json "99-Archive/emergency-backup-$(date +%Y%m%d_%H%M%S).json"

# 3. Reset to known good state
git stash
git checkout main
git pull origin main

# 4. Restore environment
cp .env.enterprise.backup .env.enterprise

# 5. Start fresh
C:\Users\kyler\enterprise-ai\enterprise-ai.sh start-dev
```

### Database Recovery
```bash
# If Supabase is corrupted
supabase db reset
supabase start

# Restore from backup
supabase db dump > backup.sql
# Edit backup.sql to remove problematic data
supabase db reset
psql -h localhost -p 54322 -U postgres -d postgres < backup.sql
```

### API Key Emergency Rotation
```bash
# When keys are compromised
./security/emergency-key-rotation.sh

# Manual steps:
# 1. Generate new keys in service dashboards
# 2. Update .env.enterprise
# 3. Update GitHub secrets
# 4. Restart all services
# 5. Test everything
```

## 📱 Monitoring & Alerts

### Set Up Alerts
```bash
# Create monitoring script that emails/slacks on issues
./scripts/monitoring/setup-alerts.sh your-email@domain.com

# Test alert system
./scripts/monitoring/test-alerts.sh
```

### Key Metrics to Monitor
- API response times
- Error rates
- Memory usage
- Disk space
- Network connectivity
- Service uptime

## 🐛 Known Bugs

### Bug #1: MCP Memory Leak
**Issue**: MCP servers consume more memory over time
**Workaround**: Restart MCP servers every 1000 requests
**Status**: Tracking issue #123

### Bug #2: Race Condition in Batch Deploy
**Issue**: Parallel deployments can conflict
**Workaround**: Reduce batch size to 1
**Status**: Fix in progress

### Bug #3: Windows Path Issues
**Issue**: Bash scripts fail on Windows with spaces in paths
**Workaround**: Use Git Bash, avoid PowerShell
**Status**: Investigating

## 🔍 Getting Help

### Self-Service
1. Check this troubleshooting guide ✓
2. Search logs for error messages
3. Test with minimal example
4. Check GitHub issues

### Community Support
- Discord: #enterprise-ai-help
- GitHub Issues: Use templates
- Stack Overflow: Tag `mcp-enterprise`

### Escalation
- Critical issues: Slack @channel
- Security issues: security@yourdomain.com
- Data loss: backup-recovery@yourdomain.com

## 📊 Diagnostic Commands

Save these for quick diagnosis:

```bash
# System health one-liner
C:\Users\kyler\enterprise-ai\enterprise-ai.sh status && echo "=== PORTS ===" && netstat -ano | findstr "54323\|5678\|7860" && echo "=== DISK ===" && df -h . && echo "=== MEMORY ===" && free -h

# MCP deployment status
find . -name "mcp-server.js" | wc -l && echo "repos with MCP"

# API usage today
grep "$(date +%Y-%m-%d)" logs/*.log | grep -c "API"

# Error rate
grep -c "ERROR\|error" logs/*.log || echo "0"
```

## 🎯 Performance Optimization

### Quick Wins
```bash
# Clean up old logs
find logs/ -name "*.log" -mtime +7 -delete

# Clear npm cache
npm cache clean --force

# Optimize git repos
find . -name ".git" -type d -exec git -C {} gc --aggressive \;
```

### Monitoring Setup
```bash
# Install monitoring tools
npm install -g pm2  # Process manager
pip install psutil  # System monitoring

# Start with monitoring
pm2 start mcp-server.js --name "mcp-production"
pm2 monit
```

---

*Last Updated: January 9, 2025*
*If you find new issues, please update this guide!*