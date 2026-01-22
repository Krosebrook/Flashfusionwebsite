# Manual Branch Deletion Guide

Since automated deletion requires special GitHub permissions, follow these manual steps:

## Option 1: Delete via GitHub Web Interface

1. Go to: https://github.com/Krosebrook/Flashfusionwebsite/branches
2. Find each branch and click the trash icon to delete:
   - ✅ claude/build-missing-criticals-01YapFE3hYRDQugLCkxxA8Sw
   - ✅ claude/check-env-vars-011CUV1wH8viRdnhjX4QGdLG
   - ✅ copilot/build-new-feature-refactor-again
   - ✅ copilot/build-next-feature-production-grade
   - ✅ copilot/fix-uncommitted-pushes
   - ✅ copilot/scaffold-completed-feature
   - ✅ copilot/sub-pr-14-again
   - ✅ claude/phase1-2-fixes-011CUeiMH5ZEppMrLYoHsion
   - ✅ dependabot/npm_and_yarn/motion-12.23.24
   - ✅ dependabot/npm_and_yarn/build-tools-61257fea64

## Option 2: Delete via Command Line

Run the provided script with proper GitHub credentials:

```bash
./delete-branches.sh
```

Or run commands individually:

```bash
# Delete fully merged branches
git push origin --delete claude/build-missing-criticals-01YapFE3hYRDQugLCkxxA8Sw
git push origin --delete claude/check-env-vars-011CUV1wH8viRdnhjX4QGdLG
git push origin --delete copilot/build-new-feature-refactor-again
git push origin --delete copilot/build-next-feature-production-grade
git push origin --delete copilot/fix-uncommitted-pushes
git push origin --delete copilot/scaffold-completed-feature
git push origin --delete copilot/sub-pr-14-again

# Delete outdated branches
git push origin --delete claude/phase1-2-fixes-011CUeiMH5ZEppMrLYoHsion
git push origin --delete dependabot/npm_and_yarn/motion-12.23.24
git push origin --delete dependabot/npm_and_yarn/build-tools-61257fea64
```

## Verification

After deletion, verify only 2 branches remain:

```bash
git branch -r
# Expected output:
# origin/main
# origin/copilot/merge-remaining-branches
```

## Safety Notes

✅ **Safe to delete** - All changes either:

- Already merged into main (7 branches)
- Outdated and superseded (3 branches)

❌ **No risk of data loss** - All valuable code is preserved in main

See [BRANCH_CLEANUP_SUMMARY.md](./BRANCH_CLEANUP_SUMMARY.md) for detailed analysis.
