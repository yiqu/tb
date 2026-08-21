# Objective 

- Upgrade ESLint to latest, v10.
- releases: https://github.com/eslint/eslint/releases
- docs: https://eslint.org/docs/latest/

# Notes

- Reference to the docs to upgrade this apps version eslint to latest.
- make sure all eslint, linting dependencies work as well. If not ask questions before proceeding further.
- are there and eslint related dependencies not needed anymore? if so remove. 
- make sure the lint actually still works. Test this after upgrading.
- convert the eslintrc.json to latest modernized way of eslint config rules.
- make sure the vscode plugins will also work with the upgrade. List the version of the eslint plugin i should install now.
- currently i have this command that chains 2 commands together:

```js
  {
    "key": "ctrl+shift+c",
    "command": "extension.multiCommand.execute",
    "args": { "command": "multiCommand.formatPrettierDocumentAndEsLintAutoFix" }
  },
```

in user settings:

```js
  "multiCommand.commands": [
    {
      "command": "multiCommand.formatPrettierDocumentAndEsLintAutoFix",
      "sequence": [
        "editor.action.formatDocument",
        "eslint.executeAutofix"
      ]
    },
    {
      "command": "multiCommand.formatPrettierDocumentAndEsLintAutoFixThenSave",
      "sequence": [
        "editor.action.formatDocument",
        "eslint.executeAutofix",
        "workbench.action.files.saveAll"
      ]
    }
  ],
```

can you verify this will still work, or is it not needed anymore. I want ctrl shift c run format, auto fix.

