# Workflow Builder - Frontend Challenge

A visual workflow builder application where users create workflows with different node types. Your task is to implement **form validation** and **auto-save functionality**.

## Quick Start

```bash
npm install
npm run dev
# Open http://localhost:5173
```

## Whats done

- Validated all node configuration fields
- Validated workflow structure (one Start block, one End block, proper routing)
- Disable Start and end block after 1 start/end node added. We can also keep it enabled and show error message.
- Displaying inline errors in the Node editor panel
- Updated ValidationPanel (left side) to show all errors

- characters requirements, regex check for URLs, alphanumeric patterns
- minimum number of items for fields, Dropdown options.

- Auto-save to localStorage when workflow is valid
  - Debounce saves (2 seconds after changes)
- Disabled Save button when the worflow is not valid.
- Show save status indicator - Click to Open More Info Modal.
  - idle/saving/saved/error
  - Last saved timestamp
  - Appropriate icons
- Restore workflow on app reload with user prompt
  - Prompt user to restore or discard
  - Discard Option
- Field name autocomplete for conditional nodes
  - All saved fields.

- Unit tests done for all newly created Components. Need to write tests for all Components.
