
## 2024-05-24 - [Fix Remote Code Execution in Fallback Executor]
**Vulnerability:** The code executor service implemented a `SubprocessExecutor` as a fallback when Docker was unavailable. This fallback passed unsanitized, user-provided code directly to `subprocess.run()`, resulting in a critical Remote Code Execution (RCE) vulnerability on the host machine.
**Learning:** Fallback mechanisms intended for "development" can introduce critical security risks if they bypass security controls (like sandboxing). User input should never be passed directly to system shells or runtimes without strict isolation.
**Prevention:** Remove insecure fallbacks entirely. If a dependency required for security (like Docker) is unavailable, the application must fail securely and refuse to process the request rather than degrading to an insecure state.
