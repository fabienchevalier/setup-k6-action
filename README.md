<div align="center">

  <img
    src="./k6.gif"
    width="600"
    style="pointer-events: none;" />

  <br />
  Open source performance testing tool and SaaS for ambitious engineering teams.

</div>

# setup-k6-action

This action sets up a Grafana k6 environment for use in a GitHub Actions workflow by:

- Installing a specific version of k6.
- Installing Chrome for Browser Testing (optional).
- Installing [xk6 dashboards extension](https://github.com/grafana/xk6-dashboard) in order to generate Grafana dashboards from k6 test results (optional).

After that we can use the [run-k6-action](https://github.com/grafana/run-k6-action/) to execute the k6 tests in the GitHub Actions workflow.

## Inputs

The following inputs can be used as `step.with` key:

| Name                   | Type    | Required | Description                                                                                   |
| ---------------------- | ------- | -------- | --------------------------------------------------------------------------------------------- |
| `k6-version`           | string  | `false`  | Specify the k6 version to use. e.g. `'0.49.0'`. If not set, latest K6 version will be used.   |
| `browser`              | boolean | `false`  | Default `false`. If set to `true` chrome is also installed along with K6 for Browser testing. |
| `k6-dashboard`         | boolean | `false`  | Default `false`. If set to `true` xk6 dashboards extension is installed.                      |
| `k6-dashboard-version` | string  | `false`  | Specify the xk6 version to use. e.g. `'0.1.0'`. If not set, latest xk6 version will be used.  |

## Usage

Following are some examples of using the workflow.

### Basic

Uses the latest k6 version

```yaml
on:
  push:

jobs:
  protocol:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: grafana/setup-k6-action@v1
      - uses: grafana/run-k6-action@v1
        with:
          path: |
            ./tests/api*.js
```

Specify which k6 version to use

```yaml
on:
  push:

jobs:
  protocol:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: grafana/setup-k6-action@v1
        with:
          k6-version: '0.49.0'
      - uses: grafana/run-k6-action@v1
        with:
          path: |
            ./tests/api*.js
```

### Browser Testing

```yaml
on:
  push:

jobs:
  protocol:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: grafana/setup-k6-action@v1
        with:
          k6-version: '0.49.0'
          browser: true
      - uses: grafana/run-k6-action@v1
        with:
          path: |
            ./tests/api*.js
```
### xk6 dashboards extension

```yaml
on:
  push:

jobs:
  protocol:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: grafana/setup-k6-action@v1
        with:
          k6-version: '0.49.0'
          k6-dashboard: true
      - uses: grafana/run-k6-action@v1
        with:
```
