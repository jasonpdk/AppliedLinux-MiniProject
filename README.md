# AppliedLinux-MiniProject

## Mongo Export/Import
mongoexport --db scriptDb --collection scripts --out mongoBackup.json
mongoimport --db scriptDb --collection scripts --file mongoBackup.json
