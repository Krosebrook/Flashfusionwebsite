# 🚀 Quick Export Commands Reference

## **🔥 One-Line Exports**

### **Zip Export (Most Platforms)**
```bash
# Create clean ZIP export
zip -r flashfusion-$(date +%Y%m%d).zip . -x "node_modules/*" ".git/*" "*.log" "dist/*"
```

### **Git Export to GitHub**
```bash
# Quick Git setup and push
git init && git add . && git commit -m "FlashFusion export $(date)" && git remote add origin YOUR_REPO_URL && git push -u origin main
```

### **Docker Export**
```bash
# Build Docker image for export
docker build -t flashfusion-export . && docker save flashfusion-export > flashfusion-docker-export.tar
```

---

## **📋 Platform-Specific Quick Commands**

### **Replit**
```bash
# Method 1: Shell command
replit-git-setup && git push origin main

# Method 2: Manual ZIP
zip -r replit-export.zip . -x "node_modules/*"
```

### **CodeSandbox**
```bash
# Export via CLI (if available)
codesandbox export

# Or use the UI: File → Export to ZIP
```

### **VS Code / Local**
```bash
# Copy to new location
cp -r . /path/to/export/flashfusion-backup

# Or create archive
tar -czf flashfusion-backup-$(date +%Y%m%d).tar.gz --exclude=node_modules --exclude=.git .
```

---

## **⚡ Verification Commands**

### **Check Export Completeness**
```bash
# Count essential files
echo "Components: $(find components -name '*.tsx' | wc -l)"
echo "UI Components: $(find components/ui -name '*.tsx' | wc -l)"
echo "Pages: $(find components/pages -name '*.tsx' | wc -l)"
echo "Services: $(find services -name '*.ts' | wc -l)"
echo "Total TypeScript files: $(find . -name '*.tsx' -o -name '*.ts' | grep -v node_modules | wc -l)"
```

### **Test Export Locally**
```bash
# Quick setup test
npm install && npm run build && echo "✅ Export successful!"
```

### **Verify Key Files**
```bash
# Check critical files exist
for file in App.tsx package.json vite.config.ts styles/globals.css; do
  [ -f "$file" ] && echo "✅ $file" || echo "❌ Missing: $file"
done
```

---

## **🛡️ Security-Safe Export**

### **Clean Export (Remove Sensitive Data)**
```bash
# Create clean export without secrets
zip -r flashfusion-clean.zip . \
  -x "node_modules/*" \
  -x ".git/*" \
  -x ".env*" \
  -x "*.log" \
  -x "dist/*" \
  -x ".cache/*"

echo "🔒 Clean export created - remember to add your own .env file!"
```

### **Production-Ready Export**
```bash
# Build and export production version
npm run build
zip -r flashfusion-production.zip . \
  -x "node_modules/*" \
  -x ".git/*" \
  -x "src/*" \
  -x "*.log"
```

---

## **🚀 Deploy-Ready Exports**

### **Vercel-Ready**
```bash
# Export optimized for Vercel
zip -r flashfusion-vercel.zip . -x "node_modules/*" ".git/*" "*.log"
echo "📁 Ready for Vercel - just drag & drop this ZIP!"
```

### **Netlify-Ready**
```bash
# Export with Netlify config
npm run build
zip -r flashfusion-netlify.zip . -x "node_modules/*" ".git/*" "src/*"
echo "📁 Ready for Netlify - includes build files!"
```

### **Docker-Ready**
```bash
# Create Docker deployment package
docker build -t flashfusion .
docker save flashfusion | gzip > flashfusion-docker.tar.gz
echo "🐳 Docker image ready for deployment!"
```

---

## **🔄 Automated Export Script**
```bash
#!/bin/bash
# Save as export-flashfusion.sh

DATE=$(date +%Y%m%d-%H%M%S)
PROJECT_NAME="flashfusion-$DATE"

echo "🚀 Starting FlashFusion export..."

# Create export directory
mkdir -p exports

# Method 1: Git export (if git exists)
if [ -d ".git" ]; then
  echo "📦 Creating Git archive..."
  git archive --format=zip --output="exports/$PROJECT_NAME-git.zip" HEAD
fi

# Method 2: File system export
echo "📁 Creating file system archive..."
zip -r "exports/$PROJECT_NAME-files.zip" . \
  -x "node_modules/*" \
  -x ".git/*" \
  -x "*.log" \
  -x "dist/*" \
  -x "exports/*"

# Verification
echo "✅ Export complete!"
echo "📊 Files created:"
ls -lh exports/$PROJECT_NAME*

echo "🔍 To verify export:"
echo "cd exports && unzip $PROJECT_NAME-files.zip && npm install && npm run dev"
```

---

## **📞 Emergency Export (If Nothing Else Works)**

```bash
# Nuclear option - copy everything manually
mkdir flashfusion-manual-export
cp App.tsx flashfusion-manual-export/
cp package.json flashfusion-manual-export/
cp -r components flashfusion-manual-export/
cp -r styles flashfusion-manual-export/
cp -r supabase flashfusion-manual-export/
cp -r lib flashfusion-manual-export/
cp -r services flashfusion-manual-export/
cp -r hooks flashfusion-manual-export/
cp -r types flashfusion-manual-export/
cp -r utils flashfusion-manual-export/
cp vite.config.ts flashfusion-manual-export/
cp tsconfig.json flashfusion-manual-export/
cp index.html flashfusion-manual-export/
cp main.ts flashfusion-manual-export/

echo "🆘 Manual export complete - test with: cd flashfusion-manual-export && npm install"
```

Run any of these commands in your project root directory! 🎯