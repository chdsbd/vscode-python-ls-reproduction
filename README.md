# vscode-reproduction

1. run `poetry install`
2. open vscode in root directory (`vscode .`)
3. navigate to `test_user_agent.py` and see unresolved import errors

If the following diff is applied and `poetry install` is run again, the
unresolved import issues disappear.

```diff
diff --git a/pyproject.toml b/pyproject.toml
index 56d7c43..5909876 100644
--- a/pyproject.toml
+++ b/pyproject.toml
@@ -3,9 +3,6 @@ name = "backend"
 version = "0.1.0"
 description = ""
 authors = []
-packages = [
-    { include = "core", from = "backend" },
-]
 
 [tool.poetry.dependencies]
 python = "^3.7"

```
