/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 7351:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const os = __importStar(__nccwpck_require__(2087));
/**
 * Commands
 *
 * Command Format:
 *   ::name key=value,key=value::message
 *
 * Examples:
 *   ::warning::This is the message
 *   ::set-env name=MY_VAR::some value
 */
function issueCommand(command, properties, message) {
    const cmd = new Command(command, properties, message);
    process.stdout.write(cmd.toString() + os.EOL);
}
exports.issueCommand = issueCommand;
function issue(name, message = '') {
    issueCommand(name, {}, message);
}
exports.issue = issue;
const CMD_STRING = '::';
class Command {
    constructor(command, properties, message) {
        if (!command) {
            command = 'missing.command';
        }
        this.command = command;
        this.properties = properties;
        this.message = message;
    }
    toString() {
        let cmdStr = CMD_STRING + this.command;
        if (this.properties && Object.keys(this.properties).length > 0) {
            cmdStr += ' ';
            let first = true;
            for (const key in this.properties) {
                if (this.properties.hasOwnProperty(key)) {
                    const val = this.properties[key];
                    if (val) {
                        if (first) {
                            first = false;
                        }
                        else {
                            cmdStr += ',';
                        }
                        cmdStr += `${key}=${escapeProperty(val)}`;
                    }
                }
            }
        }
        cmdStr += `${CMD_STRING}${escapeData(this.message)}`;
        return cmdStr;
    }
}
/**
 * Sanitizes an input into a string so it can be passed into issueCommand safely
 * @param input input to sanitize into a string
 */
function toCommandValue(input) {
    if (input === null || input === undefined) {
        return '';
    }
    else if (typeof input === 'string' || input instanceof String) {
        return input;
    }
    return JSON.stringify(input);
}
exports.toCommandValue = toCommandValue;
function escapeData(s) {
    return toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A');
}
function escapeProperty(s) {
    return toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A')
        .replace(/:/g, '%3A')
        .replace(/,/g, '%2C');
}
//# sourceMappingURL=command.js.map

/***/ }),

/***/ 2186:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const command_1 = __nccwpck_require__(7351);
const os = __importStar(__nccwpck_require__(2087));
const path = __importStar(__nccwpck_require__(5622));
/**
 * The code to exit an action
 */
var ExitCode;
(function (ExitCode) {
    /**
     * A code indicating that the action was successful
     */
    ExitCode[ExitCode["Success"] = 0] = "Success";
    /**
     * A code indicating that the action was a failure
     */
    ExitCode[ExitCode["Failure"] = 1] = "Failure";
})(ExitCode = exports.ExitCode || (exports.ExitCode = {}));
//-----------------------------------------------------------------------
// Variables
//-----------------------------------------------------------------------
/**
 * Sets env variable for this action and future actions in the job
 * @param name the name of the variable to set
 * @param val the value of the variable. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function exportVariable(name, val) {
    const convertedVal = command_1.toCommandValue(val);
    process.env[name] = convertedVal;
    command_1.issueCommand('set-env', { name }, convertedVal);
}
exports.exportVariable = exportVariable;
/**
 * Registers a secret which will get masked from logs
 * @param secret value of the secret
 */
function setSecret(secret) {
    command_1.issueCommand('add-mask', {}, secret);
}
exports.setSecret = setSecret;
/**
 * Prepends inputPath to the PATH (for this action and future actions)
 * @param inputPath
 */
function addPath(inputPath) {
    command_1.issueCommand('add-path', {}, inputPath);
    process.env['PATH'] = `${inputPath}${path.delimiter}${process.env['PATH']}`;
}
exports.addPath = addPath;
/**
 * Gets the value of an input.  The value is also trimmed.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string
 */
function getInput(name, options) {
    const val = process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || '';
    if (options && options.required && !val) {
        throw new Error(`Input required and not supplied: ${name}`);
    }
    return val.trim();
}
exports.getInput = getInput;
/**
 * Sets the value of an output.
 *
 * @param     name     name of the output to set
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setOutput(name, value) {
    command_1.issueCommand('set-output', { name }, value);
}
exports.setOutput = setOutput;
/**
 * Enables or disables the echoing of commands into stdout for the rest of the step.
 * Echoing is disabled by default if ACTIONS_STEP_DEBUG is not set.
 *
 */
function setCommandEcho(enabled) {
    command_1.issue('echo', enabled ? 'on' : 'off');
}
exports.setCommandEcho = setCommandEcho;
//-----------------------------------------------------------------------
// Results
//-----------------------------------------------------------------------
/**
 * Sets the action status to failed.
 * When the action exits it will be with an exit code of 1
 * @param message add error issue message
 */
function setFailed(message) {
    process.exitCode = ExitCode.Failure;
    error(message);
}
exports.setFailed = setFailed;
//-----------------------------------------------------------------------
// Logging Commands
//-----------------------------------------------------------------------
/**
 * Gets whether Actions Step Debug is on or not
 */
function isDebug() {
    return process.env['RUNNER_DEBUG'] === '1';
}
exports.isDebug = isDebug;
/**
 * Writes debug message to user log
 * @param message debug message
 */
function debug(message) {
    command_1.issueCommand('debug', {}, message);
}
exports.debug = debug;
/**
 * Adds an error issue
 * @param message error issue message. Errors will be converted to string via toString()
 */
function error(message) {
    command_1.issue('error', message instanceof Error ? message.toString() : message);
}
exports.error = error;
/**
 * Adds an warning issue
 * @param message warning issue message. Errors will be converted to string via toString()
 */
function warning(message) {
    command_1.issue('warning', message instanceof Error ? message.toString() : message);
}
exports.warning = warning;
/**
 * Writes info to log with console.log.
 * @param message info message
 */
function info(message) {
    process.stdout.write(message + os.EOL);
}
exports.info = info;
/**
 * Begin an output group.
 *
 * Output until the next `groupEnd` will be foldable in this group
 *
 * @param name The name of the output group
 */
function startGroup(name) {
    command_1.issue('group', name);
}
exports.startGroup = startGroup;
/**
 * End an output group.
 */
function endGroup() {
    command_1.issue('endgroup');
}
exports.endGroup = endGroup;
/**
 * Wrap an asynchronous function call in a group.
 *
 * Returns the same type as the function itself.
 *
 * @param name The name of the group
 * @param fn The function to wrap in the group
 */
function group(name, fn) {
    return __awaiter(this, void 0, void 0, function* () {
        startGroup(name);
        let result;
        try {
            result = yield fn();
        }
        finally {
            endGroup();
        }
        return result;
    });
}
exports.group = group;
//-----------------------------------------------------------------------
// Wrapper action state
//-----------------------------------------------------------------------
/**
 * Saves state for current action, the state can only be retrieved by this action's post job execution.
 *
 * @param     name     name of the state to store
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function saveState(name, value) {
    command_1.issueCommand('save-state', { name }, value);
}
exports.saveState = saveState;
/**
 * Gets the value of an state set by this action's main execution.
 *
 * @param     name     name of the state to get
 * @returns   string
 */
function getState(name) {
    return process.env[`STATE_${name}`] || '';
}
exports.getState = getState;
//# sourceMappingURL=core.js.map

/***/ }),

/***/ 8090:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const internal_globber_1 = __nccwpck_require__(8298);
/**
 * Constructs a globber
 *
 * @param patterns  Patterns separated by newlines
 * @param options   Glob options
 */
function create(patterns, options) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield internal_globber_1.DefaultGlobber.create(patterns, options);
    });
}
exports.create = create;
//# sourceMappingURL=glob.js.map

/***/ }),

/***/ 1026:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const core = __nccwpck_require__(2186);
/**
 * Returns a copy with defaults filled in.
 */
function getOptions(copy) {
    const result = {
        followSymbolicLinks: true,
        implicitDescendants: true,
        omitBrokenSymbolicLinks: true
    };
    if (copy) {
        if (typeof copy.followSymbolicLinks === 'boolean') {
            result.followSymbolicLinks = copy.followSymbolicLinks;
            core.debug(`followSymbolicLinks '${result.followSymbolicLinks}'`);
        }
        if (typeof copy.implicitDescendants === 'boolean') {
            result.implicitDescendants = copy.implicitDescendants;
            core.debug(`implicitDescendants '${result.implicitDescendants}'`);
        }
        if (typeof copy.omitBrokenSymbolicLinks === 'boolean') {
            result.omitBrokenSymbolicLinks = copy.omitBrokenSymbolicLinks;
            core.debug(`omitBrokenSymbolicLinks '${result.omitBrokenSymbolicLinks}'`);
        }
    }
    return result;
}
exports.getOptions = getOptions;
//# sourceMappingURL=internal-glob-options-helper.js.map

/***/ }),

/***/ 8298:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const core = __nccwpck_require__(2186);
const fs = __nccwpck_require__(5747);
const globOptionsHelper = __nccwpck_require__(1026);
const path = __nccwpck_require__(5622);
const patternHelper = __nccwpck_require__(9005);
const internal_match_kind_1 = __nccwpck_require__(1063);
const internal_pattern_1 = __nccwpck_require__(4536);
const internal_search_state_1 = __nccwpck_require__(9117);
const IS_WINDOWS = process.platform === 'win32';
class DefaultGlobber {
    constructor(options) {
        this.patterns = [];
        this.searchPaths = [];
        this.options = globOptionsHelper.getOptions(options);
    }
    getSearchPaths() {
        // Return a copy
        return this.searchPaths.slice();
    }
    glob() {
        var e_1, _a;
        return __awaiter(this, void 0, void 0, function* () {
            const result = [];
            try {
                for (var _b = __asyncValues(this.globGenerator()), _c; _c = yield _b.next(), !_c.done;) {
                    const itemPath = _c.value;
                    result.push(itemPath);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) yield _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return result;
        });
    }
    globGenerator() {
        return __asyncGenerator(this, arguments, function* globGenerator_1() {
            // Fill in defaults options
            const options = globOptionsHelper.getOptions(this.options);
            // Implicit descendants?
            const patterns = [];
            for (const pattern of this.patterns) {
                patterns.push(pattern);
                if (options.implicitDescendants &&
                    (pattern.trailingSeparator ||
                        pattern.segments[pattern.segments.length - 1] !== '**')) {
                    patterns.push(new internal_pattern_1.Pattern(pattern.negate, pattern.segments.concat('**')));
                }
            }
            // Push the search paths
            const stack = [];
            for (const searchPath of patternHelper.getSearchPaths(patterns)) {
                core.debug(`Search path '${searchPath}'`);
                // Exists?
                try {
                    // Intentionally using lstat. Detection for broken symlink
                    // will be performed later (if following symlinks).
                    yield __await(fs.promises.lstat(searchPath));
                }
                catch (err) {
                    if (err.code === 'ENOENT') {
                        continue;
                    }
                    throw err;
                }
                stack.unshift(new internal_search_state_1.SearchState(searchPath, 1));
            }
            // Search
            const traversalChain = []; // used to detect cycles
            while (stack.length) {
                // Pop
                const item = stack.pop();
                // Match?
                const match = patternHelper.match(patterns, item.path);
                const partialMatch = !!match || patternHelper.partialMatch(patterns, item.path);
                if (!match && !partialMatch) {
                    continue;
                }
                // Stat
                const stats = yield __await(DefaultGlobber.stat(item, options, traversalChain)
                // Broken symlink, or symlink cycle detected, or no longer exists
                );
                // Broken symlink, or symlink cycle detected, or no longer exists
                if (!stats) {
                    continue;
                }
                // Directory
                if (stats.isDirectory()) {
                    // Matched
                    if (match & internal_match_kind_1.MatchKind.Directory) {
                        yield yield __await(item.path);
                    }
                    // Descend?
                    else if (!partialMatch) {
                        continue;
                    }
                    // Push the child items in reverse
                    const childLevel = item.level + 1;
                    const childItems = (yield __await(fs.promises.readdir(item.path))).map(x => new internal_search_state_1.SearchState(path.join(item.path, x), childLevel));
                    stack.push(...childItems.reverse());
                }
                // File
                else if (match & internal_match_kind_1.MatchKind.File) {
                    yield yield __await(item.path);
                }
            }
        });
    }
    /**
     * Constructs a DefaultGlobber
     */
    static create(patterns, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = new DefaultGlobber(options);
            if (IS_WINDOWS) {
                patterns = patterns.replace(/\r\n/g, '\n');
                patterns = patterns.replace(/\r/g, '\n');
            }
            const lines = patterns.split('\n').map(x => x.trim());
            for (const line of lines) {
                // Empty or comment
                if (!line || line.startsWith('#')) {
                    continue;
                }
                // Pattern
                else {
                    result.patterns.push(new internal_pattern_1.Pattern(line));
                }
            }
            result.searchPaths.push(...patternHelper.getSearchPaths(result.patterns));
            return result;
        });
    }
    static stat(item, options, traversalChain) {
        return __awaiter(this, void 0, void 0, function* () {
            // Note:
            // `stat` returns info about the target of a symlink (or symlink chain)
            // `lstat` returns info about a symlink itself
            let stats;
            if (options.followSymbolicLinks) {
                try {
                    // Use `stat` (following symlinks)
                    stats = yield fs.promises.stat(item.path);
                }
                catch (err) {
                    if (err.code === 'ENOENT') {
                        if (options.omitBrokenSymbolicLinks) {
                            core.debug(`Broken symlink '${item.path}'`);
                            return undefined;
                        }
                        throw new Error(`No information found for the path '${item.path}'. This may indicate a broken symbolic link.`);
                    }
                    throw err;
                }
            }
            else {
                // Use `lstat` (not following symlinks)
                stats = yield fs.promises.lstat(item.path);
            }
            // Note, isDirectory() returns false for the lstat of a symlink
            if (stats.isDirectory() && options.followSymbolicLinks) {
                // Get the realpath
                const realPath = yield fs.promises.realpath(item.path);
                // Fixup the traversal chain to match the item level
                while (traversalChain.length >= item.level) {
                    traversalChain.pop();
                }
                // Test for a cycle
                if (traversalChain.some((x) => x === realPath)) {
                    core.debug(`Symlink cycle detected for path '${item.path}' and realpath '${realPath}'`);
                    return undefined;
                }
                // Update the traversal chain
                traversalChain.push(realPath);
            }
            return stats;
        });
    }
}
exports.DefaultGlobber = DefaultGlobber;
//# sourceMappingURL=internal-globber.js.map

/***/ }),

/***/ 1063:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
 * Indicates whether a pattern matches a path
 */
var MatchKind;
(function (MatchKind) {
    /** Not matched */
    MatchKind[MatchKind["None"] = 0] = "None";
    /** Matched if the path is a directory */
    MatchKind[MatchKind["Directory"] = 1] = "Directory";
    /** Matched if the path is a regular file */
    MatchKind[MatchKind["File"] = 2] = "File";
    /** Matched */
    MatchKind[MatchKind["All"] = 3] = "All";
})(MatchKind = exports.MatchKind || (exports.MatchKind = {}));
//# sourceMappingURL=internal-match-kind.js.map

/***/ }),

/***/ 1849:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const assert = __nccwpck_require__(2357);
const path = __nccwpck_require__(5622);
const IS_WINDOWS = process.platform === 'win32';
/**
 * Similar to path.dirname except normalizes the path separators and slightly better handling for Windows UNC paths.
 *
 * For example, on Linux/macOS:
 * - `/               => /`
 * - `/hello          => /`
 *
 * For example, on Windows:
 * - `C:\             => C:\`
 * - `C:\hello        => C:\`
 * - `C:              => C:`
 * - `C:hello         => C:`
 * - `\               => \`
 * - `\hello          => \`
 * - `\\hello         => \\hello`
 * - `\\hello\world   => \\hello\world`
 */
function dirname(p) {
    // Normalize slashes and trim unnecessary trailing slash
    p = safeTrimTrailingSeparator(p);
    // Windows UNC root, e.g. \\hello or \\hello\world
    if (IS_WINDOWS && /^\\\\[^\\]+(\\[^\\]+)?$/.test(p)) {
        return p;
    }
    // Get dirname
    let result = path.dirname(p);
    // Trim trailing slash for Windows UNC root, e.g. \\hello\world\
    if (IS_WINDOWS && /^\\\\[^\\]+\\[^\\]+\\$/.test(result)) {
        result = safeTrimTrailingSeparator(result);
    }
    return result;
}
exports.dirname = dirname;
/**
 * Roots the path if not already rooted. On Windows, relative roots like `\`
 * or `C:` are expanded based on the current working directory.
 */
function ensureAbsoluteRoot(root, itemPath) {
    assert(root, `ensureAbsoluteRoot parameter 'root' must not be empty`);
    assert(itemPath, `ensureAbsoluteRoot parameter 'itemPath' must not be empty`);
    // Already rooted
    if (hasAbsoluteRoot(itemPath)) {
        return itemPath;
    }
    // Windows
    if (IS_WINDOWS) {
        // Check for itemPath like C: or C:foo
        if (itemPath.match(/^[A-Z]:[^\\/]|^[A-Z]:$/i)) {
            let cwd = process.cwd();
            assert(cwd.match(/^[A-Z]:\\/i), `Expected current directory to start with an absolute drive root. Actual '${cwd}'`);
            // Drive letter matches cwd? Expand to cwd
            if (itemPath[0].toUpperCase() === cwd[0].toUpperCase()) {
                // Drive only, e.g. C:
                if (itemPath.length === 2) {
                    // Preserve specified drive letter case (upper or lower)
                    return `${itemPath[0]}:\\${cwd.substr(3)}`;
                }
                // Drive + path, e.g. C:foo
                else {
                    if (!cwd.endsWith('\\')) {
                        cwd += '\\';
                    }
                    // Preserve specified drive letter case (upper or lower)
                    return `${itemPath[0]}:\\${cwd.substr(3)}${itemPath.substr(2)}`;
                }
            }
            // Different drive
            else {
                return `${itemPath[0]}:\\${itemPath.substr(2)}`;
            }
        }
        // Check for itemPath like \ or \foo
        else if (normalizeSeparators(itemPath).match(/^\\$|^\\[^\\]/)) {
            const cwd = process.cwd();
            assert(cwd.match(/^[A-Z]:\\/i), `Expected current directory to start with an absolute drive root. Actual '${cwd}'`);
            return `${cwd[0]}:\\${itemPath.substr(1)}`;
        }
    }
    assert(hasAbsoluteRoot(root), `ensureAbsoluteRoot parameter 'root' must have an absolute root`);
    // Otherwise ensure root ends with a separator
    if (root.endsWith('/') || (IS_WINDOWS && root.endsWith('\\'))) {
        // Intentionally empty
    }
    else {
        // Append separator
        root += path.sep;
    }
    return root + itemPath;
}
exports.ensureAbsoluteRoot = ensureAbsoluteRoot;
/**
 * On Linux/macOS, true if path starts with `/`. On Windows, true for paths like:
 * `\\hello\share` and `C:\hello` (and using alternate separator).
 */
function hasAbsoluteRoot(itemPath) {
    assert(itemPath, `hasAbsoluteRoot parameter 'itemPath' must not be empty`);
    // Normalize separators
    itemPath = normalizeSeparators(itemPath);
    // Windows
    if (IS_WINDOWS) {
        // E.g. \\hello\share or C:\hello
        return itemPath.startsWith('\\\\') || /^[A-Z]:\\/i.test(itemPath);
    }
    // E.g. /hello
    return itemPath.startsWith('/');
}
exports.hasAbsoluteRoot = hasAbsoluteRoot;
/**
 * On Linux/macOS, true if path starts with `/`. On Windows, true for paths like:
 * `\`, `\hello`, `\\hello\share`, `C:`, and `C:\hello` (and using alternate separator).
 */
function hasRoot(itemPath) {
    assert(itemPath, `isRooted parameter 'itemPath' must not be empty`);
    // Normalize separators
    itemPath = normalizeSeparators(itemPath);
    // Windows
    if (IS_WINDOWS) {
        // E.g. \ or \hello or \\hello
        // E.g. C: or C:\hello
        return itemPath.startsWith('\\') || /^[A-Z]:/i.test(itemPath);
    }
    // E.g. /hello
    return itemPath.startsWith('/');
}
exports.hasRoot = hasRoot;
/**
 * Removes redundant slashes and converts `/` to `\` on Windows
 */
function normalizeSeparators(p) {
    p = p || '';
    // Windows
    if (IS_WINDOWS) {
        // Convert slashes on Windows
        p = p.replace(/\//g, '\\');
        // Remove redundant slashes
        const isUnc = /^\\\\+[^\\]/.test(p); // e.g. \\hello
        return (isUnc ? '\\' : '') + p.replace(/\\\\+/g, '\\'); // preserve leading \\ for UNC
    }
    // Remove redundant slashes
    return p.replace(/\/\/+/g, '/');
}
exports.normalizeSeparators = normalizeSeparators;
/**
 * Normalizes the path separators and trims the trailing separator (when safe).
 * For example, `/foo/ => /foo` but `/ => /`
 */
function safeTrimTrailingSeparator(p) {
    // Short-circuit if empty
    if (!p) {
        return '';
    }
    // Normalize separators
    p = normalizeSeparators(p);
    // No trailing slash
    if (!p.endsWith(path.sep)) {
        return p;
    }
    // Check '/' on Linux/macOS and '\' on Windows
    if (p === path.sep) {
        return p;
    }
    // On Windows check if drive root. E.g. C:\
    if (IS_WINDOWS && /^[A-Z]:\\$/i.test(p)) {
        return p;
    }
    // Otherwise trim trailing slash
    return p.substr(0, p.length - 1);
}
exports.safeTrimTrailingSeparator = safeTrimTrailingSeparator;
//# sourceMappingURL=internal-path-helper.js.map

/***/ }),

/***/ 6836:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const assert = __nccwpck_require__(2357);
const path = __nccwpck_require__(5622);
const pathHelper = __nccwpck_require__(1849);
const IS_WINDOWS = process.platform === 'win32';
/**
 * Helper class for parsing paths into segments
 */
class Path {
    /**
     * Constructs a Path
     * @param itemPath Path or array of segments
     */
    constructor(itemPath) {
        this.segments = [];
        // String
        if (typeof itemPath === 'string') {
            assert(itemPath, `Parameter 'itemPath' must not be empty`);
            // Normalize slashes and trim unnecessary trailing slash
            itemPath = pathHelper.safeTrimTrailingSeparator(itemPath);
            // Not rooted
            if (!pathHelper.hasRoot(itemPath)) {
                this.segments = itemPath.split(path.sep);
            }
            // Rooted
            else {
                // Add all segments, while not at the root
                let remaining = itemPath;
                let dir = pathHelper.dirname(remaining);
                while (dir !== remaining) {
                    // Add the segment
                    const basename = path.basename(remaining);
                    this.segments.unshift(basename);
                    // Truncate the last segment
                    remaining = dir;
                    dir = pathHelper.dirname(remaining);
                }
                // Remainder is the root
                this.segments.unshift(remaining);
            }
        }
        // Array
        else {
            // Must not be empty
            assert(itemPath.length > 0, `Parameter 'itemPath' must not be an empty array`);
            // Each segment
            for (let i = 0; i < itemPath.length; i++) {
                let segment = itemPath[i];
                // Must not be empty
                assert(segment, `Parameter 'itemPath' must not contain any empty segments`);
                // Normalize slashes
                segment = pathHelper.normalizeSeparators(itemPath[i]);
                // Root segment
                if (i === 0 && pathHelper.hasRoot(segment)) {
                    segment = pathHelper.safeTrimTrailingSeparator(segment);
                    assert(segment === pathHelper.dirname(segment), `Parameter 'itemPath' root segment contains information for multiple segments`);
                    this.segments.push(segment);
                }
                // All other segments
                else {
                    // Must not contain slash
                    assert(!segment.includes(path.sep), `Parameter 'itemPath' contains unexpected path separators`);
                    this.segments.push(segment);
                }
            }
        }
    }
    /**
     * Converts the path to it's string representation
     */
    toString() {
        // First segment
        let result = this.segments[0];
        // All others
        let skipSlash = result.endsWith(path.sep) || (IS_WINDOWS && /^[A-Z]:$/i.test(result));
        for (let i = 1; i < this.segments.length; i++) {
            if (skipSlash) {
                skipSlash = false;
            }
            else {
                result += path.sep;
            }
            result += this.segments[i];
        }
        return result;
    }
}
exports.Path = Path;
//# sourceMappingURL=internal-path.js.map

/***/ }),

/***/ 9005:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const pathHelper = __nccwpck_require__(1849);
const internal_match_kind_1 = __nccwpck_require__(1063);
const IS_WINDOWS = process.platform === 'win32';
/**
 * Given an array of patterns, returns an array of paths to search.
 * Duplicates and paths under other included paths are filtered out.
 */
function getSearchPaths(patterns) {
    // Ignore negate patterns
    patterns = patterns.filter(x => !x.negate);
    // Create a map of all search paths
    const searchPathMap = {};
    for (const pattern of patterns) {
        const key = IS_WINDOWS
            ? pattern.searchPath.toUpperCase()
            : pattern.searchPath;
        searchPathMap[key] = 'candidate';
    }
    const result = [];
    for (const pattern of patterns) {
        // Check if already included
        const key = IS_WINDOWS
            ? pattern.searchPath.toUpperCase()
            : pattern.searchPath;
        if (searchPathMap[key] === 'included') {
            continue;
        }
        // Check for an ancestor search path
        let foundAncestor = false;
        let tempKey = key;
        let parent = pathHelper.dirname(tempKey);
        while (parent !== tempKey) {
            if (searchPathMap[parent]) {
                foundAncestor = true;
                break;
            }
            tempKey = parent;
            parent = pathHelper.dirname(tempKey);
        }
        // Include the search pattern in the result
        if (!foundAncestor) {
            result.push(pattern.searchPath);
            searchPathMap[key] = 'included';
        }
    }
    return result;
}
exports.getSearchPaths = getSearchPaths;
/**
 * Matches the patterns against the path
 */
function match(patterns, itemPath) {
    let result = internal_match_kind_1.MatchKind.None;
    for (const pattern of patterns) {
        if (pattern.negate) {
            result &= ~pattern.match(itemPath);
        }
        else {
            result |= pattern.match(itemPath);
        }
    }
    return result;
}
exports.match = match;
/**
 * Checks whether to descend further into the directory
 */
function partialMatch(patterns, itemPath) {
    return patterns.some(x => !x.negate && x.partialMatch(itemPath));
}
exports.partialMatch = partialMatch;
//# sourceMappingURL=internal-pattern-helper.js.map

/***/ }),

/***/ 4536:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const assert = __nccwpck_require__(2357);
const os = __nccwpck_require__(2087);
const path = __nccwpck_require__(5622);
const pathHelper = __nccwpck_require__(1849);
const minimatch_1 = __nccwpck_require__(3973);
const internal_match_kind_1 = __nccwpck_require__(1063);
const internal_path_1 = __nccwpck_require__(6836);
const IS_WINDOWS = process.platform === 'win32';
class Pattern {
    constructor(patternOrNegate, segments) {
        /**
         * Indicates whether matches should be excluded from the result set
         */
        this.negate = false;
        // Pattern overload
        let pattern;
        if (typeof patternOrNegate === 'string') {
            pattern = patternOrNegate.trim();
        }
        // Segments overload
        else {
            // Convert to pattern
            segments = segments || [];
            assert(segments.length, `Parameter 'segments' must not empty`);
            const root = Pattern.getLiteral(segments[0]);
            assert(root && pathHelper.hasAbsoluteRoot(root), `Parameter 'segments' first element must be a root path`);
            pattern = new internal_path_1.Path(segments).toString().trim();
            if (patternOrNegate) {
                pattern = `!${pattern}`;
            }
        }
        // Negate
        while (pattern.startsWith('!')) {
            this.negate = !this.negate;
            pattern = pattern.substr(1).trim();
        }
        // Normalize slashes and ensures absolute root
        pattern = Pattern.fixupPattern(pattern);
        // Segments
        this.segments = new internal_path_1.Path(pattern).segments;
        // Trailing slash indicates the pattern should only match directories, not regular files
        this.trailingSeparator = pathHelper
            .normalizeSeparators(pattern)
            .endsWith(path.sep);
        pattern = pathHelper.safeTrimTrailingSeparator(pattern);
        // Search path (literal path prior to the first glob segment)
        let foundGlob = false;
        const searchSegments = this.segments
            .map(x => Pattern.getLiteral(x))
            .filter(x => !foundGlob && !(foundGlob = x === ''));
        this.searchPath = new internal_path_1.Path(searchSegments).toString();
        // Root RegExp (required when determining partial match)
        this.rootRegExp = new RegExp(Pattern.regExpEscape(searchSegments[0]), IS_WINDOWS ? 'i' : '');
        // Create minimatch
        const minimatchOptions = {
            dot: true,
            nobrace: true,
            nocase: IS_WINDOWS,
            nocomment: true,
            noext: true,
            nonegate: true
        };
        pattern = IS_WINDOWS ? pattern.replace(/\\/g, '/') : pattern;
        this.minimatch = new minimatch_1.Minimatch(pattern, minimatchOptions);
    }
    /**
     * Matches the pattern against the specified path
     */
    match(itemPath) {
        // Last segment is globstar?
        if (this.segments[this.segments.length - 1] === '**') {
            // Normalize slashes
            itemPath = pathHelper.normalizeSeparators(itemPath);
            // Append a trailing slash. Otherwise Minimatch will not match the directory immediately
            // preceeding the globstar. For example, given the pattern `/foo/**`, Minimatch returns
            // false for `/foo` but returns true for `/foo/`. Append a trailing slash to handle that quirk.
            if (!itemPath.endsWith(path.sep)) {
                // Note, this is safe because the constructor ensures the pattern has an absolute root.
                // For example, formats like C: and C:foo on Windows are resolved to an aboslute root.
                itemPath = `${itemPath}${path.sep}`;
            }
        }
        else {
            // Normalize slashes and trim unnecessary trailing slash
            itemPath = pathHelper.safeTrimTrailingSeparator(itemPath);
        }
        // Match
        if (this.minimatch.match(itemPath)) {
            return this.trailingSeparator ? internal_match_kind_1.MatchKind.Directory : internal_match_kind_1.MatchKind.All;
        }
        return internal_match_kind_1.MatchKind.None;
    }
    /**
     * Indicates whether the pattern may match descendants of the specified path
     */
    partialMatch(itemPath) {
        // Normalize slashes and trim unnecessary trailing slash
        itemPath = pathHelper.safeTrimTrailingSeparator(itemPath);
        // matchOne does not handle root path correctly
        if (pathHelper.dirname(itemPath) === itemPath) {
            return this.rootRegExp.test(itemPath);
        }
        return this.minimatch.matchOne(itemPath.split(IS_WINDOWS ? /\\+/ : /\/+/), this.minimatch.set[0], true);
    }
    /**
     * Escapes glob patterns within a path
     */
    static globEscape(s) {
        return (IS_WINDOWS ? s : s.replace(/\\/g, '\\\\')) // escape '\' on Linux/macOS
            .replace(/(\[)(?=[^/]+\])/g, '[[]') // escape '[' when ']' follows within the path segment
            .replace(/\?/g, '[?]') // escape '?'
            .replace(/\*/g, '[*]'); // escape '*'
    }
    /**
     * Normalizes slashes and ensures absolute root
     */
    static fixupPattern(pattern) {
        // Empty
        assert(pattern, 'pattern cannot be empty');
        // Must not contain `.` segment, unless first segment
        // Must not contain `..` segment
        const literalSegments = new internal_path_1.Path(pattern).segments.map(x => Pattern.getLiteral(x));
        assert(literalSegments.every((x, i) => (x !== '.' || i === 0) && x !== '..'), `Invalid pattern '${pattern}'. Relative pathing '.' and '..' is not allowed.`);
        // Must not contain globs in root, e.g. Windows UNC path \\foo\b*r
        assert(!pathHelper.hasRoot(pattern) || literalSegments[0], `Invalid pattern '${pattern}'. Root segment must not contain globs.`);
        // Normalize slashes
        pattern = pathHelper.normalizeSeparators(pattern);
        // Replace leading `.` segment
        if (pattern === '.' || pattern.startsWith(`.${path.sep}`)) {
            pattern = Pattern.globEscape(process.cwd()) + pattern.substr(1);
        }
        // Replace leading `~` segment
        else if (pattern === '~' || pattern.startsWith(`~${path.sep}`)) {
            const homedir = os.homedir();
            assert(homedir, 'Unable to determine HOME directory');
            assert(pathHelper.hasAbsoluteRoot(homedir), `Expected HOME directory to be a rooted path. Actual '${homedir}'`);
            pattern = Pattern.globEscape(homedir) + pattern.substr(1);
        }
        // Replace relative drive root, e.g. pattern is C: or C:foo
        else if (IS_WINDOWS &&
            (pattern.match(/^[A-Z]:$/i) || pattern.match(/^[A-Z]:[^\\]/i))) {
            let root = pathHelper.ensureAbsoluteRoot('C:\\dummy-root', pattern.substr(0, 2));
            if (pattern.length > 2 && !root.endsWith('\\')) {
                root += '\\';
            }
            pattern = Pattern.globEscape(root) + pattern.substr(2);
        }
        // Replace relative root, e.g. pattern is \ or \foo
        else if (IS_WINDOWS && (pattern === '\\' || pattern.match(/^\\[^\\]/))) {
            let root = pathHelper.ensureAbsoluteRoot('C:\\dummy-root', '\\');
            if (!root.endsWith('\\')) {
                root += '\\';
            }
            pattern = Pattern.globEscape(root) + pattern.substr(1);
        }
        // Otherwise ensure absolute root
        else {
            pattern = pathHelper.ensureAbsoluteRoot(Pattern.globEscape(process.cwd()), pattern);
        }
        return pathHelper.normalizeSeparators(pattern);
    }
    /**
     * Attempts to unescape a pattern segment to create a literal path segment.
     * Otherwise returns empty string.
     */
    static getLiteral(segment) {
        let literal = '';
        for (let i = 0; i < segment.length; i++) {
            const c = segment[i];
            // Escape
            if (c === '\\' && !IS_WINDOWS && i + 1 < segment.length) {
                literal += segment[++i];
                continue;
            }
            // Wildcard
            else if (c === '*' || c === '?') {
                return '';
            }
            // Character set
            else if (c === '[' && i + 1 < segment.length) {
                let set = '';
                let closed = -1;
                for (let i2 = i + 1; i2 < segment.length; i2++) {
                    const c2 = segment[i2];
                    // Escape
                    if (c2 === '\\' && !IS_WINDOWS && i2 + 1 < segment.length) {
                        set += segment[++i2];
                        continue;
                    }
                    // Closed
                    else if (c2 === ']') {
                        closed = i2;
                        break;
                    }
                    // Otherwise
                    else {
                        set += c2;
                    }
                }
                // Closed?
                if (closed >= 0) {
                    // Cannot convert
                    if (set.length > 1) {
                        return '';
                    }
                    // Convert to literal
                    if (set) {
                        literal += set;
                        i = closed;
                        continue;
                    }
                }
                // Otherwise fall thru
            }
            // Append
            literal += c;
        }
        return literal;
    }
    /**
     * Escapes regexp special characters
     * https://javascript.info/regexp-escaping
     */
    static regExpEscape(s) {
        return s.replace(/[[\\^$.|?*+()]/g, '\\$&');
    }
}
exports.Pattern = Pattern;
//# sourceMappingURL=internal-pattern.js.map

/***/ }),

/***/ 9117:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class SearchState {
    constructor(path, level) {
        this.path = path;
        this.level = level;
    }
}
exports.SearchState = SearchState;
//# sourceMappingURL=internal-search-state.js.map

/***/ }),

/***/ 9417:
/***/ ((module) => {

"use strict";

module.exports = balanced;
function balanced(a, b, str) {
  if (a instanceof RegExp) a = maybeMatch(a, str);
  if (b instanceof RegExp) b = maybeMatch(b, str);

  var r = range(a, b, str);

  return r && {
    start: r[0],
    end: r[1],
    pre: str.slice(0, r[0]),
    body: str.slice(r[0] + a.length, r[1]),
    post: str.slice(r[1] + b.length)
  };
}

function maybeMatch(reg, str) {
  var m = str.match(reg);
  return m ? m[0] : null;
}

balanced.range = range;
function range(a, b, str) {
  var begs, beg, left, right, result;
  var ai = str.indexOf(a);
  var bi = str.indexOf(b, ai + 1);
  var i = ai;

  if (ai >= 0 && bi > 0) {
    begs = [];
    left = str.length;

    while (i >= 0 && !result) {
      if (i == ai) {
        begs.push(i);
        ai = str.indexOf(a, i + 1);
      } else if (begs.length == 1) {
        result = [ begs.pop(), bi ];
      } else {
        beg = begs.pop();
        if (beg < left) {
          left = beg;
          right = bi;
        }

        bi = str.indexOf(b, i + 1);
      }

      i = ai < bi && ai >= 0 ? ai : bi;
    }

    if (begs.length) {
      result = [ left, right ];
    }
  }

  return result;
}


/***/ }),

/***/ 3717:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var concatMap = __nccwpck_require__(6891);
var balanced = __nccwpck_require__(9417);

module.exports = expandTop;

var escSlash = '\0SLASH'+Math.random()+'\0';
var escOpen = '\0OPEN'+Math.random()+'\0';
var escClose = '\0CLOSE'+Math.random()+'\0';
var escComma = '\0COMMA'+Math.random()+'\0';
var escPeriod = '\0PERIOD'+Math.random()+'\0';

function numeric(str) {
  return parseInt(str, 10) == str
    ? parseInt(str, 10)
    : str.charCodeAt(0);
}

function escapeBraces(str) {
  return str.split('\\\\').join(escSlash)
            .split('\\{').join(escOpen)
            .split('\\}').join(escClose)
            .split('\\,').join(escComma)
            .split('\\.').join(escPeriod);
}

function unescapeBraces(str) {
  return str.split(escSlash).join('\\')
            .split(escOpen).join('{')
            .split(escClose).join('}')
            .split(escComma).join(',')
            .split(escPeriod).join('.');
}


// Basically just str.split(","), but handling cases
// where we have nested braced sections, which should be
// treated as individual members, like {a,{b,c},d}
function parseCommaParts(str) {
  if (!str)
    return [''];

  var parts = [];
  var m = balanced('{', '}', str);

  if (!m)
    return str.split(',');

  var pre = m.pre;
  var body = m.body;
  var post = m.post;
  var p = pre.split(',');

  p[p.length-1] += '{' + body + '}';
  var postParts = parseCommaParts(post);
  if (post.length) {
    p[p.length-1] += postParts.shift();
    p.push.apply(p, postParts);
  }

  parts.push.apply(parts, p);

  return parts;
}

function expandTop(str) {
  if (!str)
    return [];

  // I don't know why Bash 4.3 does this, but it does.
  // Anything starting with {} will have the first two bytes preserved
  // but *only* at the top level, so {},a}b will not expand to anything,
  // but a{},b}c will be expanded to [a}c,abc].
  // One could argue that this is a bug in Bash, but since the goal of
  // this module is to match Bash's rules, we escape a leading {}
  if (str.substr(0, 2) === '{}') {
    str = '\\{\\}' + str.substr(2);
  }

  return expand(escapeBraces(str), true).map(unescapeBraces);
}

function identity(e) {
  return e;
}

function embrace(str) {
  return '{' + str + '}';
}
function isPadded(el) {
  return /^-?0\d/.test(el);
}

function lte(i, y) {
  return i <= y;
}
function gte(i, y) {
  return i >= y;
}

function expand(str, isTop) {
  var expansions = [];

  var m = balanced('{', '}', str);
  if (!m || /\$$/.test(m.pre)) return [str];

  var isNumericSequence = /^-?\d+\.\.-?\d+(?:\.\.-?\d+)?$/.test(m.body);
  var isAlphaSequence = /^[a-zA-Z]\.\.[a-zA-Z](?:\.\.-?\d+)?$/.test(m.body);
  var isSequence = isNumericSequence || isAlphaSequence;
  var isOptions = m.body.indexOf(',') >= 0;
  if (!isSequence && !isOptions) {
    // {a},b}
    if (m.post.match(/,.*\}/)) {
      str = m.pre + '{' + m.body + escClose + m.post;
      return expand(str);
    }
    return [str];
  }

  var n;
  if (isSequence) {
    n = m.body.split(/\.\./);
  } else {
    n = parseCommaParts(m.body);
    if (n.length === 1) {
      // x{{a,b}}y ==> x{a}y x{b}y
      n = expand(n[0], false).map(embrace);
      if (n.length === 1) {
        var post = m.post.length
          ? expand(m.post, false)
          : [''];
        return post.map(function(p) {
          return m.pre + n[0] + p;
        });
      }
    }
  }

  // at this point, n is the parts, and we know it's not a comma set
  // with a single entry.

  // no need to expand pre, since it is guaranteed to be free of brace-sets
  var pre = m.pre;
  var post = m.post.length
    ? expand(m.post, false)
    : [''];

  var N;

  if (isSequence) {
    var x = numeric(n[0]);
    var y = numeric(n[1]);
    var width = Math.max(n[0].length, n[1].length)
    var incr = n.length == 3
      ? Math.abs(numeric(n[2]))
      : 1;
    var test = lte;
    var reverse = y < x;
    if (reverse) {
      incr *= -1;
      test = gte;
    }
    var pad = n.some(isPadded);

    N = [];

    for (var i = x; test(i, y); i += incr) {
      var c;
      if (isAlphaSequence) {
        c = String.fromCharCode(i);
        if (c === '\\')
          c = '';
      } else {
        c = String(i);
        if (pad) {
          var need = width - c.length;
          if (need > 0) {
            var z = new Array(need + 1).join('0');
            if (i < 0)
              c = '-' + z + c.slice(1);
            else
              c = z + c;
          }
        }
      }
      N.push(c);
    }
  } else {
    N = concatMap(n, function(el) { return expand(el, false) });
  }

  for (var j = 0; j < N.length; j++) {
    for (var k = 0; k < post.length; k++) {
      var expansion = pre + N[j] + post[k];
      if (!isTop || isSequence || expansion)
        expansions.push(expansion);
    }
  }

  return expansions;
}



/***/ }),

/***/ 6891:
/***/ ((module) => {

module.exports = function (xs, fn) {
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        var x = fn(xs[i], i);
        if (isArray(x)) res.push.apply(res, x);
        else res.push(x);
    }
    return res;
};

var isArray = Array.isArray || function (xs) {
    return Object.prototype.toString.call(xs) === '[object Array]';
};


/***/ }),

/***/ 3973:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = minimatch
minimatch.Minimatch = Minimatch

var path = { sep: '/' }
try {
  path = __nccwpck_require__(5622)
} catch (er) {}

var GLOBSTAR = minimatch.GLOBSTAR = Minimatch.GLOBSTAR = {}
var expand = __nccwpck_require__(3717)

var plTypes = {
  '!': { open: '(?:(?!(?:', close: '))[^/]*?)'},
  '?': { open: '(?:', close: ')?' },
  '+': { open: '(?:', close: ')+' },
  '*': { open: '(?:', close: ')*' },
  '@': { open: '(?:', close: ')' }
}

// any single thing other than /
// don't need to escape / when using new RegExp()
var qmark = '[^/]'

// * => any number of characters
var star = qmark + '*?'

// ** when dots are allowed.  Anything goes, except .. and .
// not (^ or / followed by one or two dots followed by $ or /),
// followed by anything, any number of times.
var twoStarDot = '(?:(?!(?:\\\/|^)(?:\\.{1,2})($|\\\/)).)*?'

// not a ^ or / followed by a dot,
// followed by anything, any number of times.
var twoStarNoDot = '(?:(?!(?:\\\/|^)\\.).)*?'

// characters that need to be escaped in RegExp.
var reSpecials = charSet('().*{}+?[]^$\\!')

// "abc" -> { a:true, b:true, c:true }
function charSet (s) {
  return s.split('').reduce(function (set, c) {
    set[c] = true
    return set
  }, {})
}

// normalizes slashes.
var slashSplit = /\/+/

minimatch.filter = filter
function filter (pattern, options) {
  options = options || {}
  return function (p, i, list) {
    return minimatch(p, pattern, options)
  }
}

function ext (a, b) {
  a = a || {}
  b = b || {}
  var t = {}
  Object.keys(b).forEach(function (k) {
    t[k] = b[k]
  })
  Object.keys(a).forEach(function (k) {
    t[k] = a[k]
  })
  return t
}

minimatch.defaults = function (def) {
  if (!def || !Object.keys(def).length) return minimatch

  var orig = minimatch

  var m = function minimatch (p, pattern, options) {
    return orig.minimatch(p, pattern, ext(def, options))
  }

  m.Minimatch = function Minimatch (pattern, options) {
    return new orig.Minimatch(pattern, ext(def, options))
  }

  return m
}

Minimatch.defaults = function (def) {
  if (!def || !Object.keys(def).length) return Minimatch
  return minimatch.defaults(def).Minimatch
}

function minimatch (p, pattern, options) {
  if (typeof pattern !== 'string') {
    throw new TypeError('glob pattern string required')
  }

  if (!options) options = {}

  // shortcut: comments match nothing.
  if (!options.nocomment && pattern.charAt(0) === '#') {
    return false
  }

  // "" only matches ""
  if (pattern.trim() === '') return p === ''

  return new Minimatch(pattern, options).match(p)
}

function Minimatch (pattern, options) {
  if (!(this instanceof Minimatch)) {
    return new Minimatch(pattern, options)
  }

  if (typeof pattern !== 'string') {
    throw new TypeError('glob pattern string required')
  }

  if (!options) options = {}
  pattern = pattern.trim()

  // windows support: need to use /, not \
  if (path.sep !== '/') {
    pattern = pattern.split(path.sep).join('/')
  }

  this.options = options
  this.set = []
  this.pattern = pattern
  this.regexp = null
  this.negate = false
  this.comment = false
  this.empty = false

  // make the set of regexps etc.
  this.make()
}

Minimatch.prototype.debug = function () {}

Minimatch.prototype.make = make
function make () {
  // don't do it more than once.
  if (this._made) return

  var pattern = this.pattern
  var options = this.options

  // empty patterns and comments match nothing.
  if (!options.nocomment && pattern.charAt(0) === '#') {
    this.comment = true
    return
  }
  if (!pattern) {
    this.empty = true
    return
  }

  // step 1: figure out negation, etc.
  this.parseNegate()

  // step 2: expand braces
  var set = this.globSet = this.braceExpand()

  if (options.debug) this.debug = console.error

  this.debug(this.pattern, set)

  // step 3: now we have a set, so turn each one into a series of path-portion
  // matching patterns.
  // These will be regexps, except in the case of "**", which is
  // set to the GLOBSTAR object for globstar behavior,
  // and will not contain any / characters
  set = this.globParts = set.map(function (s) {
    return s.split(slashSplit)
  })

  this.debug(this.pattern, set)

  // glob --> regexps
  set = set.map(function (s, si, set) {
    return s.map(this.parse, this)
  }, this)

  this.debug(this.pattern, set)

  // filter out everything that didn't compile properly.
  set = set.filter(function (s) {
    return s.indexOf(false) === -1
  })

  this.debug(this.pattern, set)

  this.set = set
}

Minimatch.prototype.parseNegate = parseNegate
function parseNegate () {
  var pattern = this.pattern
  var negate = false
  var options = this.options
  var negateOffset = 0

  if (options.nonegate) return

  for (var i = 0, l = pattern.length
    ; i < l && pattern.charAt(i) === '!'
    ; i++) {
    negate = !negate
    negateOffset++
  }

  if (negateOffset) this.pattern = pattern.substr(negateOffset)
  this.negate = negate
}

// Brace expansion:
// a{b,c}d -> abd acd
// a{b,}c -> abc ac
// a{0..3}d -> a0d a1d a2d a3d
// a{b,c{d,e}f}g -> abg acdfg acefg
// a{b,c}d{e,f}g -> abdeg acdeg abdeg abdfg
//
// Invalid sets are not expanded.
// a{2..}b -> a{2..}b
// a{b}c -> a{b}c
minimatch.braceExpand = function (pattern, options) {
  return braceExpand(pattern, options)
}

Minimatch.prototype.braceExpand = braceExpand

function braceExpand (pattern, options) {
  if (!options) {
    if (this instanceof Minimatch) {
      options = this.options
    } else {
      options = {}
    }
  }

  pattern = typeof pattern === 'undefined'
    ? this.pattern : pattern

  if (typeof pattern === 'undefined') {
    throw new TypeError('undefined pattern')
  }

  if (options.nobrace ||
    !pattern.match(/\{.*\}/)) {
    // shortcut. no need to expand.
    return [pattern]
  }

  return expand(pattern)
}

// parse a component of the expanded set.
// At this point, no pattern may contain "/" in it
// so we're going to return a 2d array, where each entry is the full
// pattern, split on '/', and then turned into a regular expression.
// A regexp is made at the end which joins each array with an
// escaped /, and another full one which joins each regexp with |.
//
// Following the lead of Bash 4.1, note that "**" only has special meaning
// when it is the *only* thing in a path portion.  Otherwise, any series
// of * is equivalent to a single *.  Globstar behavior is enabled by
// default, and can be disabled by setting options.noglobstar.
Minimatch.prototype.parse = parse
var SUBPARSE = {}
function parse (pattern, isSub) {
  if (pattern.length > 1024 * 64) {
    throw new TypeError('pattern is too long')
  }

  var options = this.options

  // shortcuts
  if (!options.noglobstar && pattern === '**') return GLOBSTAR
  if (pattern === '') return ''

  var re = ''
  var hasMagic = !!options.nocase
  var escaping = false
  // ? => one single character
  var patternListStack = []
  var negativeLists = []
  var stateChar
  var inClass = false
  var reClassStart = -1
  var classStart = -1
  // . and .. never match anything that doesn't start with .,
  // even when options.dot is set.
  var patternStart = pattern.charAt(0) === '.' ? '' // anything
  // not (start or / followed by . or .. followed by / or end)
  : options.dot ? '(?!(?:^|\\\/)\\.{1,2}(?:$|\\\/))'
  : '(?!\\.)'
  var self = this

  function clearStateChar () {
    if (stateChar) {
      // we had some state-tracking character
      // that wasn't consumed by this pass.
      switch (stateChar) {
        case '*':
          re += star
          hasMagic = true
        break
        case '?':
          re += qmark
          hasMagic = true
        break
        default:
          re += '\\' + stateChar
        break
      }
      self.debug('clearStateChar %j %j', stateChar, re)
      stateChar = false
    }
  }

  for (var i = 0, len = pattern.length, c
    ; (i < len) && (c = pattern.charAt(i))
    ; i++) {
    this.debug('%s\t%s %s %j', pattern, i, re, c)

    // skip over any that are escaped.
    if (escaping && reSpecials[c]) {
      re += '\\' + c
      escaping = false
      continue
    }

    switch (c) {
      case '/':
        // completely not allowed, even escaped.
        // Should already be path-split by now.
        return false

      case '\\':
        clearStateChar()
        escaping = true
      continue

      // the various stateChar values
      // for the "extglob" stuff.
      case '?':
      case '*':
      case '+':
      case '@':
      case '!':
        this.debug('%s\t%s %s %j <-- stateChar', pattern, i, re, c)

        // all of those are literals inside a class, except that
        // the glob [!a] means [^a] in regexp
        if (inClass) {
          this.debug('  in class')
          if (c === '!' && i === classStart + 1) c = '^'
          re += c
          continue
        }

        // if we already have a stateChar, then it means
        // that there was something like ** or +? in there.
        // Handle the stateChar, then proceed with this one.
        self.debug('call clearStateChar %j', stateChar)
        clearStateChar()
        stateChar = c
        // if extglob is disabled, then +(asdf|foo) isn't a thing.
        // just clear the statechar *now*, rather than even diving into
        // the patternList stuff.
        if (options.noext) clearStateChar()
      continue

      case '(':
        if (inClass) {
          re += '('
          continue
        }

        if (!stateChar) {
          re += '\\('
          continue
        }

        patternListStack.push({
          type: stateChar,
          start: i - 1,
          reStart: re.length,
          open: plTypes[stateChar].open,
          close: plTypes[stateChar].close
        })
        // negation is (?:(?!js)[^/]*)
        re += stateChar === '!' ? '(?:(?!(?:' : '(?:'
        this.debug('plType %j %j', stateChar, re)
        stateChar = false
      continue

      case ')':
        if (inClass || !patternListStack.length) {
          re += '\\)'
          continue
        }

        clearStateChar()
        hasMagic = true
        var pl = patternListStack.pop()
        // negation is (?:(?!js)[^/]*)
        // The others are (?:<pattern>)<type>
        re += pl.close
        if (pl.type === '!') {
          negativeLists.push(pl)
        }
        pl.reEnd = re.length
      continue

      case '|':
        if (inClass || !patternListStack.length || escaping) {
          re += '\\|'
          escaping = false
          continue
        }

        clearStateChar()
        re += '|'
      continue

      // these are mostly the same in regexp and glob
      case '[':
        // swallow any state-tracking char before the [
        clearStateChar()

        if (inClass) {
          re += '\\' + c
          continue
        }

        inClass = true
        classStart = i
        reClassStart = re.length
        re += c
      continue

      case ']':
        //  a right bracket shall lose its special
        //  meaning and represent itself in
        //  a bracket expression if it occurs
        //  first in the list.  -- POSIX.2 2.8.3.2
        if (i === classStart + 1 || !inClass) {
          re += '\\' + c
          escaping = false
          continue
        }

        // handle the case where we left a class open.
        // "[z-a]" is valid, equivalent to "\[z-a\]"
        if (inClass) {
          // split where the last [ was, make sure we don't have
          // an invalid re. if so, re-walk the contents of the
          // would-be class to re-translate any characters that
          // were passed through as-is
          // TODO: It would probably be faster to determine this
          // without a try/catch and a new RegExp, but it's tricky
          // to do safely.  For now, this is safe and works.
          var cs = pattern.substring(classStart + 1, i)
          try {
            RegExp('[' + cs + ']')
          } catch (er) {
            // not a valid class!
            var sp = this.parse(cs, SUBPARSE)
            re = re.substr(0, reClassStart) + '\\[' + sp[0] + '\\]'
            hasMagic = hasMagic || sp[1]
            inClass = false
            continue
          }
        }

        // finish up the class.
        hasMagic = true
        inClass = false
        re += c
      continue

      default:
        // swallow any state char that wasn't consumed
        clearStateChar()

        if (escaping) {
          // no need
          escaping = false
        } else if (reSpecials[c]
          && !(c === '^' && inClass)) {
          re += '\\'
        }

        re += c

    } // switch
  } // for

  // handle the case where we left a class open.
  // "[abc" is valid, equivalent to "\[abc"
  if (inClass) {
    // split where the last [ was, and escape it
    // this is a huge pita.  We now have to re-walk
    // the contents of the would-be class to re-translate
    // any characters that were passed through as-is
    cs = pattern.substr(classStart + 1)
    sp = this.parse(cs, SUBPARSE)
    re = re.substr(0, reClassStart) + '\\[' + sp[0]
    hasMagic = hasMagic || sp[1]
  }

  // handle the case where we had a +( thing at the *end*
  // of the pattern.
  // each pattern list stack adds 3 chars, and we need to go through
  // and escape any | chars that were passed through as-is for the regexp.
  // Go through and escape them, taking care not to double-escape any
  // | chars that were already escaped.
  for (pl = patternListStack.pop(); pl; pl = patternListStack.pop()) {
    var tail = re.slice(pl.reStart + pl.open.length)
    this.debug('setting tail', re, pl)
    // maybe some even number of \, then maybe 1 \, followed by a |
    tail = tail.replace(/((?:\\{2}){0,64})(\\?)\|/g, function (_, $1, $2) {
      if (!$2) {
        // the | isn't already escaped, so escape it.
        $2 = '\\'
      }

      // need to escape all those slashes *again*, without escaping the
      // one that we need for escaping the | character.  As it works out,
      // escaping an even number of slashes can be done by simply repeating
      // it exactly after itself.  That's why this trick works.
      //
      // I am sorry that you have to see this.
      return $1 + $1 + $2 + '|'
    })

    this.debug('tail=%j\n   %s', tail, tail, pl, re)
    var t = pl.type === '*' ? star
      : pl.type === '?' ? qmark
      : '\\' + pl.type

    hasMagic = true
    re = re.slice(0, pl.reStart) + t + '\\(' + tail
  }

  // handle trailing things that only matter at the very end.
  clearStateChar()
  if (escaping) {
    // trailing \\
    re += '\\\\'
  }

  // only need to apply the nodot start if the re starts with
  // something that could conceivably capture a dot
  var addPatternStart = false
  switch (re.charAt(0)) {
    case '.':
    case '[':
    case '(': addPatternStart = true
  }

  // Hack to work around lack of negative lookbehind in JS
  // A pattern like: *.!(x).!(y|z) needs to ensure that a name
  // like 'a.xyz.yz' doesn't match.  So, the first negative
  // lookahead, has to look ALL the way ahead, to the end of
  // the pattern.
  for (var n = negativeLists.length - 1; n > -1; n--) {
    var nl = negativeLists[n]

    var nlBefore = re.slice(0, nl.reStart)
    var nlFirst = re.slice(nl.reStart, nl.reEnd - 8)
    var nlLast = re.slice(nl.reEnd - 8, nl.reEnd)
    var nlAfter = re.slice(nl.reEnd)

    nlLast += nlAfter

    // Handle nested stuff like *(*.js|!(*.json)), where open parens
    // mean that we should *not* include the ) in the bit that is considered
    // "after" the negated section.
    var openParensBefore = nlBefore.split('(').length - 1
    var cleanAfter = nlAfter
    for (i = 0; i < openParensBefore; i++) {
      cleanAfter = cleanAfter.replace(/\)[+*?]?/, '')
    }
    nlAfter = cleanAfter

    var dollar = ''
    if (nlAfter === '' && isSub !== SUBPARSE) {
      dollar = '$'
    }
    var newRe = nlBefore + nlFirst + nlAfter + dollar + nlLast
    re = newRe
  }

  // if the re is not "" at this point, then we need to make sure
  // it doesn't match against an empty path part.
  // Otherwise a/* will match a/, which it should not.
  if (re !== '' && hasMagic) {
    re = '(?=.)' + re
  }

  if (addPatternStart) {
    re = patternStart + re
  }

  // parsing just a piece of a larger pattern.
  if (isSub === SUBPARSE) {
    return [re, hasMagic]
  }

  // skip the regexp for non-magical patterns
  // unescape anything in it, though, so that it'll be
  // an exact match against a file etc.
  if (!hasMagic) {
    return globUnescape(pattern)
  }

  var flags = options.nocase ? 'i' : ''
  try {
    var regExp = new RegExp('^' + re + '$', flags)
  } catch (er) {
    // If it was an invalid regular expression, then it can't match
    // anything.  This trick looks for a character after the end of
    // the string, which is of course impossible, except in multi-line
    // mode, but it's not a /m regex.
    return new RegExp('$.')
  }

  regExp._glob = pattern
  regExp._src = re

  return regExp
}

minimatch.makeRe = function (pattern, options) {
  return new Minimatch(pattern, options || {}).makeRe()
}

Minimatch.prototype.makeRe = makeRe
function makeRe () {
  if (this.regexp || this.regexp === false) return this.regexp

  // at this point, this.set is a 2d array of partial
  // pattern strings, or "**".
  //
  // It's better to use .match().  This function shouldn't
  // be used, really, but it's pretty convenient sometimes,
  // when you just want to work with a regex.
  var set = this.set

  if (!set.length) {
    this.regexp = false
    return this.regexp
  }
  var options = this.options

  var twoStar = options.noglobstar ? star
    : options.dot ? twoStarDot
    : twoStarNoDot
  var flags = options.nocase ? 'i' : ''

  var re = set.map(function (pattern) {
    return pattern.map(function (p) {
      return (p === GLOBSTAR) ? twoStar
      : (typeof p === 'string') ? regExpEscape(p)
      : p._src
    }).join('\\\/')
  }).join('|')

  // must match entire pattern
  // ending in a * or ** will make it less strict.
  re = '^(?:' + re + ')$'

  // can match anything, as long as it's not this.
  if (this.negate) re = '^(?!' + re + ').*$'

  try {
    this.regexp = new RegExp(re, flags)
  } catch (ex) {
    this.regexp = false
  }
  return this.regexp
}

minimatch.match = function (list, pattern, options) {
  options = options || {}
  var mm = new Minimatch(pattern, options)
  list = list.filter(function (f) {
    return mm.match(f)
  })
  if (mm.options.nonull && !list.length) {
    list.push(pattern)
  }
  return list
}

Minimatch.prototype.match = match
function match (f, partial) {
  this.debug('match', f, this.pattern)
  // short-circuit in the case of busted things.
  // comments, etc.
  if (this.comment) return false
  if (this.empty) return f === ''

  if (f === '/' && partial) return true

  var options = this.options

  // windows: need to use /, not \
  if (path.sep !== '/') {
    f = f.split(path.sep).join('/')
  }

  // treat the test path as a set of pathparts.
  f = f.split(slashSplit)
  this.debug(this.pattern, 'split', f)

  // just ONE of the pattern sets in this.set needs to match
  // in order for it to be valid.  If negating, then just one
  // match means that we have failed.
  // Either way, return on the first hit.

  var set = this.set
  this.debug(this.pattern, 'set', set)

  // Find the basename of the path by looking for the last non-empty segment
  var filename
  var i
  for (i = f.length - 1; i >= 0; i--) {
    filename = f[i]
    if (filename) break
  }

  for (i = 0; i < set.length; i++) {
    var pattern = set[i]
    var file = f
    if (options.matchBase && pattern.length === 1) {
      file = [filename]
    }
    var hit = this.matchOne(file, pattern, partial)
    if (hit) {
      if (options.flipNegate) return true
      return !this.negate
    }
  }

  // didn't get any hits.  this is success if it's a negative
  // pattern, failure otherwise.
  if (options.flipNegate) return false
  return this.negate
}

// set partial to true to test if, for example,
// "/a/b" matches the start of "/*/b/*/d"
// Partial means, if you run out of file before you run
// out of pattern, then that's fine, as long as all
// the parts match.
Minimatch.prototype.matchOne = function (file, pattern, partial) {
  var options = this.options

  this.debug('matchOne',
    { 'this': this, file: file, pattern: pattern })

  this.debug('matchOne', file.length, pattern.length)

  for (var fi = 0,
      pi = 0,
      fl = file.length,
      pl = pattern.length
      ; (fi < fl) && (pi < pl)
      ; fi++, pi++) {
    this.debug('matchOne loop')
    var p = pattern[pi]
    var f = file[fi]

    this.debug(pattern, p, f)

    // should be impossible.
    // some invalid regexp stuff in the set.
    if (p === false) return false

    if (p === GLOBSTAR) {
      this.debug('GLOBSTAR', [pattern, p, f])

      // "**"
      // a/**/b/**/c would match the following:
      // a/b/x/y/z/c
      // a/x/y/z/b/c
      // a/b/x/b/x/c
      // a/b/c
      // To do this, take the rest of the pattern after
      // the **, and see if it would match the file remainder.
      // If so, return success.
      // If not, the ** "swallows" a segment, and try again.
      // This is recursively awful.
      //
      // a/**/b/**/c matching a/b/x/y/z/c
      // - a matches a
      // - doublestar
      //   - matchOne(b/x/y/z/c, b/**/c)
      //     - b matches b
      //     - doublestar
      //       - matchOne(x/y/z/c, c) -> no
      //       - matchOne(y/z/c, c) -> no
      //       - matchOne(z/c, c) -> no
      //       - matchOne(c, c) yes, hit
      var fr = fi
      var pr = pi + 1
      if (pr === pl) {
        this.debug('** at the end')
        // a ** at the end will just swallow the rest.
        // We have found a match.
        // however, it will not swallow /.x, unless
        // options.dot is set.
        // . and .. are *never* matched by **, for explosively
        // exponential reasons.
        for (; fi < fl; fi++) {
          if (file[fi] === '.' || file[fi] === '..' ||
            (!options.dot && file[fi].charAt(0) === '.')) return false
        }
        return true
      }

      // ok, let's see if we can swallow whatever we can.
      while (fr < fl) {
        var swallowee = file[fr]

        this.debug('\nglobstar while', file, fr, pattern, pr, swallowee)

        // XXX remove this slice.  Just pass the start index.
        if (this.matchOne(file.slice(fr), pattern.slice(pr), partial)) {
          this.debug('globstar found match!', fr, fl, swallowee)
          // found a match.
          return true
        } else {
          // can't swallow "." or ".." ever.
          // can only swallow ".foo" when explicitly asked.
          if (swallowee === '.' || swallowee === '..' ||
            (!options.dot && swallowee.charAt(0) === '.')) {
            this.debug('dot detected!', file, fr, pattern, pr)
            break
          }

          // ** swallows a segment, and continue.
          this.debug('globstar swallow a segment, and continue')
          fr++
        }
      }

      // no match was found.
      // However, in partial mode, we can't say this is necessarily over.
      // If there's more *pattern* left, then
      if (partial) {
        // ran out of file
        this.debug('\n>>> no match, partial?', file, fr, pattern, pr)
        if (fr === fl) return true
      }
      return false
    }

    // something other than **
    // non-magic patterns just have to match exactly
    // patterns with magic have been turned into regexps.
    var hit
    if (typeof p === 'string') {
      if (options.nocase) {
        hit = f.toLowerCase() === p.toLowerCase()
      } else {
        hit = f === p
      }
      this.debug('string match', p, f, hit)
    } else {
      hit = f.match(p)
      this.debug('pattern match', p, f, hit)
    }

    if (!hit) return false
  }

  // Note: ending in / means that we'll get a final ""
  // at the end of the pattern.  This can only match a
  // corresponding "" at the end of the file.
  // If the file ends in /, then it can only match a
  // a pattern that ends in /, unless the pattern just
  // doesn't have any more for it. But, a/b/ should *not*
  // match "a/b/*", even though "" matches against the
  // [^/]*? pattern, except in partial mode, where it might
  // simply not be reached yet.
  // However, a/b/ should still satisfy a/*

  // now either we fell off the end of the pattern, or we're done.
  if (fi === fl && pi === pl) {
    // ran out of pattern and filename at the same time.
    // an exact hit!
    return true
  } else if (fi === fl) {
    // ran out of file, but still had pattern left.
    // this is ok if we're doing the match as part of
    // a glob fs traversal.
    return partial
  } else if (pi === pl) {
    // ran out of pattern, still have file left.
    // this is only acceptable if we're on the very last
    // empty segment of a file with a trailing slash.
    // a/* should match a/b/
    var emptyFileEnd = (fi === fl - 1) && (file[fi] === '')
    return emptyFileEnd
  }

  // should be unreachable.
  throw new Error('wtf?')
}

// replace stuff like \* with *
function globUnescape (s) {
  return s.replace(/\\(.)/g, '$1')
}

function regExpEscape (s) {
  return s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
}


/***/ }),

/***/ 6178:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const singleLineComment = __nccwpck_require__(998)
const multiLineComment = __nccwpck_require__(2245)
const findLowerCodeBlock = __nccwpck_require__(5131)
const findUpperCodeBlock = __nccwpck_require__(3819)
const comments = __nccwpck_require__(156)

function extractComments(data) {

    let result = {'comments': {}}

    result.comments['lineComments'] = singleLineComment(data)

    result.comments['blockComments'] = multiLineComment(data)

    let pcomment = findProblematicComments(result)

    for(let i = 0 ; i < pcomment.length; i++){
        //expand to upper
        let upper = pcomment[i].loc.start.line
        for(let j = pcomment[i].loc.start.line - 2; j > 0; j--){

            let blankLine = data[j].replace(/\sg/, '').length === 0
            let singleComment = result.comments.lineComments.filter(single => j + 1 === single.loc.start.line).length > 0
            if(singleComment){
                if(data[j].split('//').length > 1 && data[j].split('//')[0].replace(/\s/g, '').length > 0){
                    singleComment = false
                }
            }
            let multiLineComment = result.comments.blockComments.filter(single => j + 1 >= single.loc.start.line && j + 1 <= single.loc.end.line).length > 0
            if(multiLineComment){
                if(data[j].split('/*').length > 1 && data[j].split('/*')[0].replace(/\s/g, '').length > 0){
                    multiLineComment = false
                }
            }
            /*
            console.log(
                j,
                blankLine,
                singleComment,
                multiLineComment,
                data[j],
                (blankLine || singleComment || multiLineComment)
            )
             */
            if(blankLine || singleComment || multiLineComment) {
                upper = j + 1
            } else {
                break;
            }
        }
        //expand to lower
        let lower = pcomment[i].loc.end.line
        for(let j = pcomment[i].loc.end.line; j < data.length; j++){
            let blankLine = data[j].replace(/\sg/, '').length === 0
            let singleComment = result.comments.lineComments.filter(single => j + 1 === single.loc.start.line).length > 0
            if(singleComment){
                if(data[j].split('//').length > 1 && data[j].split('//')[0].replace(/\s/g, '').length > 0){
                    singleComment = false
                }
            }
            //line >= blockComments[i].loc.start.line && line <= blockComments[i].loc.end.line
            let multiLineComment = result.comments.blockComments.filter(single => j + 1 >= single.loc.start.line && j + 1 <= single.loc.end.line).length > 0
            if(multiLineComment){
                if(data[j].split('/*').length > 1 && data[j].split('/*')[0].replace(/\s/g, '').length > 0){
                    multiLineComment = false
                }
            }
            /*
            console.log(
                j,
                blankLine,
                singleComment,
                multiLineComment,
                data[j],
                (blankLine || singleComment || multiLineComment)
            )
            */
            if(blankLine || singleComment || multiLineComment) {
                lower = j + 1
            } else {
                break;
            }
        }
        pcomment[i].loc = {
            start:{
                line: upper
            },
            end:{
                line: lower
            }
        }
        pcomment[i].codeBlock.lower = findLowerCodeBlock(lower, data)
        pcomment[i].codeBlock.upper = findUpperCodeBlock(upper, data)
    }

    pcomment = pcomment.filter((single, index) => pcomment.findIndex((t) => t.loc.start.line === single.loc.start.line) === index)

    //pcomment.map(single => console.log(single))

    result.comments['problematicComments'] = pcomment


    return result

}

/*
*
* @input: 2-dimensional array for the raw comment lines
* @output: Array of a comments which could indicated a problematic code segment, with the corresponding line in the file
*
* */
function findProblematicComments(data) {
    const blockComments = data.comments.blockComments
    const lineComments = data.comments.lineComments

    let result = []
    // eslint-disable-next-line
    blockComments.filter(single => {
        if(matchComments(single).length > 0) {
            result.push({
                commentsFound: matchComments(single),
                loc: single.loc,
                codeBlock: single.codeBlock
            })
        }
    })
    // eslint-disable-next-line
    lineComments.filter(single => {
        if(matchComments(single).length > 0) {
            result.push({
                commentsFound: matchComments(single),
                loc: single.loc,
                codeBlock: single.codeBlock
            })
        }
    })

    return result
}

/*
*
* @input: object, result of extract
* @output: list of possible words or phrases which indicate a problem
*
* */
function matchComments(data) {
    let value = data.value.replace("\n", "").toLowerCase()

    let result = comments.filter(single => value.includes(single))
    return result
}

module.exports = extractComments

/***/ }),

/***/ 5131:
/***/ ((module) => {

/*
* INPUT:
* @startingPoint: line number where the comment was found
* @data: content of the file, split by \n
*
* OUTPUT:
* JSON-object with starting and ending line of the code block
*
* if no match was possible for both values -1 will be returned
* */

const findLowerCodeBlock = (startingPoint, data) => {

    let interimResult = {
        start: -1,
        end: -1
    }

    let result = {
        start: -1,
        end: -1
    }
    let reducedData = data
        .filter((_, index) => index >= startingPoint)
        .join("")
        .split("")


    let count = 0
    let countString = 0
    for (let i = 0; i < reducedData.length; ++i) {
        if(countString === 0 && reducedData[i] === '"') {
            countString++
        }
        else if(countString === 1 && reducedData[i] === '"'){
            countString--
        }
        else if (interimResult.start < 0 && reducedData[i] === '{' && countString === 0) {
            interimResult.start = i;
            count++;
        } //first opening bracket found, set start-index of the code block; count is set to one
        else if (interimResult.start >= 0 && reducedData[i] === '{' && countString === 0) {
            count++;
        } //if there are any more nested brackets count will be increased
        else if (interimResult.start >= 0 && count === 1 && reducedData[i] === '}' && countString === 0) {
            interimResult.end = i;
            break;
        } //the final closing bracket was found
        else if (interimResult.start >= 0 && count > 1 && reducedData[i] === '}' && countString === 0) {
            count--;
        } //a nested code block was found
        else if (interimResult.start < 0 && reducedData[i] === '}' && countString === 0) {
            break
        } //the first bracket what was found was a closing one, that indicates that there was no code block below the given starting point
    }
    if (interimResult.start >= 0) {
        let diff = interimResult.start
        let codeBlockLength = interimResult.end - interimResult.start
        let lineCount = startingPoint
        while (codeBlockLength >= 0) {
            while (diff >= 0) {
                diff = diff - data[lineCount].split('').length
                if (diff <= 0) {
                    codeBlockLength = codeBlockLength - Math.abs(diff)
                    result.start = lineCount + 1
                }
                ++lineCount
            }
            codeBlockLength = codeBlockLength - data[lineCount].split('').length
            if (codeBlockLength < 0) {
                result.end = lineCount + 1
            }
            ++lineCount
        }
    }
    return result
}



module.exports = findLowerCodeBlock

/***/ }),

/***/ 3819:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const findLowerCodeBlock = __nccwpck_require__(5131)

/*
* INPUT:
* @startingPoint: line number where the comment was found
* @data: content of the file, split by \n
*
* OUTPUT:
* JSON-object with starting and ending line of the code block
*
* if no match was possible for both values -1 will be returned
* */


const findUpperCodeBlock = (startingPoint, data) => {
    let result = {
        start: -1,
        end: -1
    }
    let interimResult = {
        start: -1,
        end: -1
    }
    let findUpperStartingPoint = data.filter((_, index) => index < startingPoint).join("").split('')
    let count = 0
    let countString = 0
    for (let i = findUpperStartingPoint.length - 1; i >= 0; --i) {
        if(countString === 0 && findUpperStartingPoint[i] === '"') {
            countString++
        }
        else if(countString === 1 && findUpperStartingPoint[i] === '"'){
            countString--
        }
        else if (count === 0 && findUpperStartingPoint[i] === '{' && countString === 0) {
            interimResult.start = i;
            break;
        } else if (findUpperStartingPoint[i] === '}' && countString === 0) {
            count++
        } else if (count > 0 && findUpperStartingPoint[i] === '{' && countString === 0) {
            count--
        }
    }
    if (interimResult.start >= 0) {
        let diff = findUpperStartingPoint.length - interimResult.start
        let lineCount = startingPoint - 1
        while (diff > 0) {
            diff = diff - data[lineCount].split('').length
            --lineCount

            if (diff <= 0) {
                result.start = lineCount
            }


        }
        result = findLowerCodeBlock(result.start, data)
    }

    return result
}


module.exports = findUpperCodeBlock

/***/ }),

/***/ 3275:
/***/ ((module) => {

const isComment = (line, lineComments = [], blockComments = []) => {

    for(let i = 0 ; i < lineComments.length ; ++i){
        if(lineComments[i].loc.start.line === line){
            return true
        }
    }

    for(let i = 0 ; i < blockComments.length ; ++i){
        if(line >= blockComments[i].loc.start.line && line <= blockComments[i].loc.end.line ){
            return true
        }
    }



    return false
}

module.exports = isComment

/***/ }),

/***/ 586:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

// eslint-disable-next-line
const isComment = __nccwpck_require__(3275)

/*
* input: comments and issues with their corresponding occurrences
* output: list of matched comments and issues
* desc: returns also a lost of comments with no match
* */
function matchCodeAndComments(data, file) {
    //default case, no problematic comments where found
    if (data[0].comments.problematicComments.length === 0) return data

    let commentLines = data[0].comments.problematicComments.map(single => {
        return {endLineComment: single.loc.end.line, codeBlock: single.codeBlock}
    })
    data[0].comments.matchedCommets = data
        // eslint-disable-next-line
        .map((single, index) => {if (index > 0) return matchCode(commentLines, single.lineNumbers, index, file)})
        .filter(single => single) //filters out the undefined for the position 0
        .flat()

    data
        // eslint-disable-next-line
        .map((single, index) => {
            if (index > 0) return matchThem(commentLines, single.lineNumbers, index, file)
        })
        .filter(single => single) //filters out the undefined for the position 0
        .flat()
        .map(single => data[0].comments.matchedCommets.push(single))


    data[0].comments.matchedCommets = data[0].comments.matchedCommets
        .filter((elem, index, self) => index === self.findIndex((t => t.commentLine === elem.commentLine))) // removed duplicates found in the same block

    let matchedCommentLines = data[0].comments.matchedCommets
        .map(single => single.commentLine)
    matchedCommentLines = matchedCommentLines.filter((single, index) => matchedCommentLines.indexOf(single) === index)


    let notMatchedCommentLines = commentLines
        .filter(single => matchedCommentLines.includes(single.endLineComment) === false)
        .map(single => {
            return {'commentLine': single.endLineComment}
        })


    data[0].comments.notMatchedComments = notMatchedCommentLines
    return data
}

function matchCode(commentLines, codeLines, errorNumber, file)  {
    let result = []
    for(let i = 0 ; i < commentLines.length; ++i){
        let start = commentLines[i].endLineComment
        let end = commentLines[i].codeBlock.lower.start
        let diff = end - start
        diff = diff > 9 ? 9 : diff
        if(diff < 0){
            diff = file.length - start > 9 ? file.length - start : 9
            end = file.length - start > 9 ? file.length - start : start + 9
        }
        if(diff > 0){
            for(let j = start + 1; j < end; ++j){
                if(codeLines.includes(j)){
                    result.push({
                        'commentLine': commentLines[i].endLineComment,
                        'codeLine': j,
                        'errorNumber': errorNumber,
                    })
                }
            }
        }
    }
    return result
}


/*
* input: comments and issues, n times m check for connection
* output: list of connected code and comment
* desc:
* */
function matchThem(commentLines, codeLines, errorNumber, file) {
    let result = []
    for (let i = 0; i < commentLines.length; ++i) {
        for (let j = 0; j < codeLines.length; ++j) {
            let result2 = checkConnection(commentLines[i].endLineComment, codeLines[j], errorNumber, commentLines[i].codeBlock, file)
            if (result2) {
                result.push(result2)
            }
        }
    }
    return result
}

/*
* input: single comment and code element
* output: false for mo match, object with the matching pairs
* desc:
* */
function checkConnection(commentline, codeLine, errorNumber, codeBlock, file) {
    //console.log('-----------------------------------')
    let result = {
        'commentLine': commentline,
        'codeLine': codeLine,
        'errorNumber': errorNumber,
        codeBlock
    }
    let start = commentline
    let checkRange = codeLine >= codeBlock.lower.start && codeLine <= codeBlock.lower.end

    if(checkRange && codeBlock.lower.start - commentline <= 3){
        return result
    }
    else if(checkRange && codeBlock.lower.start - commentline <= 9){
        let end = codeBlock.lower.start - 1
        return checkForIF(file, start, end, result, result)
    }
    else if(checkRange){
        let end = commentline + 9
        return checkForIF(file, start, end, result)
    }

    return false
}

function checkForIF(file, start, end, result, defaultResult = false){
    for(let i = start;i<end;++i){
        if(file[i].match(`if`)){
            result.codeLine = i + 1
            return result
        }
    }
    return defaultResult
}

module.exports = matchCodeAndComments

/***/ }),

/***/ 2245:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const findLowerCodeBlock = __nccwpck_require__(5131)
const findUpperCodeBlock = __nccwpck_require__(3819)

const multiLineComment = (data) => {
    let result = []
    let start = -1
    for (let i = 0; i < data.length; ++i) {
        if (start < 0 && data[i].split('/*').length > 1) {
            start = i
            --i //is needed to detect multiline comments over one line ex.: /* multiline comment in a single line */
        } else if (start >= 0 && data[i].split('*/').length > 1) {
            result.push({
                loc: {
                    start: {line: start + 1},
                    end: {line: i + 1}
                },
                // eslint-disable-next-line
                value: data.filter((single, index) => (index >= start && index <= i)).join(" "),
                codeBlock: {
                    lower: findLowerCodeBlock(i, data),
                    upper: findUpperCodeBlock(i, data)
                }
            })
            start = -1
        }
    }
    return result
}

module.exports = multiLineComment

/***/ }),

/***/ 156:
/***/ ((module) => {

let listOfComments = ["hack",
    "retarded",
    "at a loss",
    "stupid",
    "remove this code",
    "ugly",
    "take care",
    "something's gone wrong",
    "nuke",
    "is problematic",
    "may cause problem",
    "hacky",
    "unknown why we ever experience this",
    "treat this as a soft error",
    "silly",
    "workaround for bug",
    "kludge",
    "fixme",
    "this isn't quite right",
    "trial and error",
    "give up",
    "this is wrong",
    "hang our heads in shame",
    "temporary solution",
    "causes issue",
    "something bad is going on",
    "cause for issue",
    "this doesn't look right",
    "is this next line safe",
    "this indicates a more fundamental problem",
    "temporary crutch",
    "this can be a mess",
    "this isn't very solid",
    "this is temporary and will go away",
    "is this line really safe",
    "there is a problem",
    "some fatal error",
    "something serious is wrong",
    "don't use this",
    "get rid of this",
    "doubt that this would work",
    "this is bs",
    "give up and go away",
    "risk of this blowing up",
    "just abandon it",
    "prolly a bug",
    "probably a bug",
    "hope everything will work",
    "toss it",
    "barf",
    "something bad happened",
    "fix this crap",
    "yuck",
    "certainly buggy",
    "remove me before production",
    "you can be unhappy now",
    "this is uncool",
    "bail out",
    "it doesn't work yet",
    "crap",
    "inconsistency",
    "abandon all hope",
    "kaboom"]


module.exports = listOfComments

/***/ }),

/***/ 998:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const findLowerCodeBlock =  __nccwpck_require__(5131)
const findUpperCodeBlock =  __nccwpck_require__(5131)


const singleLineComment = (data) => {
    let result = []
    for (let i = 0; i < data.length; ++i) {
        if (data[i].split('//').length > 1) {
            result.push({
                loc: {
                    start: {line: i + 1},
                    end: {line: i + 1}
                },
                value: data[i],
                codeBlock: {
                    lower: findLowerCodeBlock(i, data),
                    upper: findUpperCodeBlock(i, data)
                }
            })
        }
    }
    return result
}


module.exports = singleLineComment

/***/ }),

/***/ 1374:
/***/ ((module) => {

const alignPotentialMitigations = (mitigations) => mitigations.map(mitigation => `${mitigation.phase}\n${mitigation.description}`).join("\n\n")

module.exports = alignPotentialMitigations

/***/ }),

/***/ 6471:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

//https://cwe.mitre.org/data/definitions/14.html

const getPotentialMitigations = __nccwpck_require__(7604)
const findFunctions = __nccwpck_require__(698)

let issueNumber = 14

const cwe_14 = (data) => {

    let errorsFound = findFunctions(data, ['memset'])

    let errors = {
        "mitigation": getPotentialMitigations(issueNumber),
        "text": `In the following line the command chroot was used: ${errorsFound.map(single => `in line ${single.lineNumber}`).join(", ")}`,
        "lineNumbers": errorsFound.map(single => single.lineNumber),
        "issueNumber": issueNumber
    }

    return errors
}

module.exports = cwe_14

/***/ }),

/***/ 9387:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

//https://cwe.mitre.org/data/definitions/135.html
const getPotentialMitigations = __nccwpck_require__(7604)
const findFunctions = __nccwpck_require__(698)
const isComment = __nccwpck_require__(3275)

let issueNumber = 135

const cwe_135 = (data, comments) => {

    let errorsFound = findFunctions(data, ['strlen', 'wcslen'])
        .filter(single => !isComment(single.lineNumber, comments.comments.lineComments, comments.comments.blockComments))


    let errors = {
        "mitigation": getPotentialMitigations(issueNumber),
        "text": `In the following line the command strlen or wcslen was used: ${errorsFound.map(single => `in line ${single.lineNumber}`).join(", ")}`,
        "lineNumbers": errorsFound.map(single => single.lineNumber),
        "issueNumber": issueNumber
    }

    return errors
}

module.exports = cwe_135

/***/ }),

/***/ 6913:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

//https://cwe.mitre.org/data/definitions/188.html

const getPotentialMitigations = __nccwpck_require__(7604)
const isComment = __nccwpck_require__(3275)

let issueNumber = 188

const cwe_188 = (data, comments) => {

    let errorsFound = findErrors(data, comments)

    let errors = {
        "mitigation": getPotentialMitigations(issueNumber),
        "text": `In the following lines a violation on reliance on data/memory layout was detected: ${errorsFound.map(single => `on line ${single}`).join(', ')}`,
        "lineNumbers": errorsFound,
        "issueNumber": issueNumber
    }

    return errors
}

const findErrors = (data, comment) => {
    let result = [] //numbers
    let regex = new RegExp('\\*\\(&[a-zA-Z0-9]*\\s*[+|-]\\s[a-zA-Z0-9]*\\s*\\)\\s*=\\s*[a-zA-Z0-9]*;an', 'g')
    for(let line in data){
        if(!isComment(line, comment.comments.lineComments, comment.comments.blockComments)){
            let match = regex.exec(data[line])
            if ( match ) {
                result.push(line + 1)
            }
        }
    }
    return result
}

module.exports = cwe_188

/***/ }),

/***/ 2231:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const getPotentialMitigations = __nccwpck_require__(7604);
const dataTypes = __nccwpck_require__(8445)
const findVariableDeclarations = __nccwpck_require__(3338)
const findErrorsSignAndUnsignConversionError = __nccwpck_require__(1768)

let issueNumber = 195

const cwe_195 = (data, comment) => {


    let errorsFound = findErrorsSignAndUnsignConversionError(data, comment, findVariableDeclarations(data, dataTypes, {start: -1, end: -1}))
    let lineNumbers = []
    for(let i = 0 ; i < errorsFound.length ; ++i) {
        if(errorsFound[i].dest.includes('unsigned')){
            if(Array.isArray(errorsFound[i].source)){
                if(errorsFound[i].source.filter(single => single.includes('unsigned')).length === 0){
                    lineNumbers.push(errorsFound[i])
                }
            }
            else {
                if(!errorsFound[i].source.includes('unsigned')){
                    lineNumbers.push(errorsFound[i])
                }
            }
        }
    }
    let errors = {
        "mitigation": getPotentialMitigations(issueNumber),
        "text": `In the following lines a conversions error from signed to unsigned was detected: ${lineNumbers.map(single => `in line ${single.lineNumber}`).join(', ')}`,
        "lineNumbers": lineNumbers.map(single => single.lineNumber),
        "issueNumber": issueNumber
    }
    return errors
}

module.exports = cwe_195

/***/ }),

/***/ 598:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const getPotentialMitigations = __nccwpck_require__(7604);
const dataTypes = __nccwpck_require__(8445)
const findVariableDeclarations = __nccwpck_require__(3338)
const findErrorsSignAndUnsignConversionError = __nccwpck_require__(1768)

const issueNumber = 196

const cwe_196 = (data, comment) => {
    let errorsFound = findErrorsSignAndUnsignConversionError(data, comment, findVariableDeclarations(data, dataTypes, {start: -1, end: -1}))
    let lineNumbers = []
    for(let i = 0 ; i < errorsFound.length ; ++i) {
        if(!errorsFound[i].dest.includes('unsigned')){
            if(Array.isArray(errorsFound[i].source)){
                if(errorsFound[i].source.filter(single => !single.includes('unsigned')).length === 0){
                    lineNumbers.push(errorsFound[i])
                }
            }
            else {
                if(errorsFound[i].source.includes('unsigned')){
                    lineNumbers.push(errorsFound[i])
                }
            }
        }
    }

    let errors = {
        "mitigation": getPotentialMitigations(issueNumber),
        "text": `In the following lines a conversions error from unsigned to signed was detected: ${lineNumbers.map(single => `in line ${single.lineNumber}`).join(', ')}`,
        "lineNumbers": lineNumbers.map(single => single.lineNumber),
        "issueNumber": issueNumber
    }

    return errors
}

module.exports = cwe_196

/***/ }),

/***/ 8980:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

//https://cwe.mitre.org/data/definitions/243.html
const getPotentialMitigations = __nccwpck_require__(7604)
const findFunctions = __nccwpck_require__(698)
const isComment = __nccwpck_require__(3275)

let issueNumber = 243

const cwe_243 = (data, comment) => {

    let errorsFound = findFunctions(data, ['chroot'])
        .filter(single => !isComment(single.lineNumber, comment.comments.lineComments, comment.comments.blockComments))

    let errors = {
        "mitigation": getPotentialMitigations(issueNumber),
        "text": `In the following line the command chroot was used: ${errorsFound.map(single => `in line ${single.lineNumber}`).join(", ")}`,
        "lineNumbers": errorsFound.map(single => single.lineNumber),
        "issueNumber": issueNumber
    }

    return errors
}

module.exports = cwe_243

/***/ }),

/***/ 5294:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

//https://cwe.mitre.org/data/definitions/244.html
const getPotentialMitigations = __nccwpck_require__(7604)
const findFunctions = __nccwpck_require__(698)
const isComment = __nccwpck_require__(3275)

let issueNumber = 244

const cwe_244 = (data, comment) => {

    let errorsFound = findFunctions(data, ['realloc', 'vfork', 'fork'])
        .filter(single => !isComment(single.lineNumber, comment.comments.lineComments, comment.comments.blockComments))

    let errors = {
        "mitigation": getPotentialMitigations(issueNumber),
        "text": `In the following line the command chroot was used: ${errorsFound.map(single => `in line ${single.lineNumber}`).join(", ")}`,
        "lineNumbers": errorsFound.map(single => single.lineNumber),
        "issueNumber": issueNumber
    }

    return errors
}

module.exports = cwe_244

/***/ }),

/***/ 2938:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

//https://cwe.mitre.org/data/definitions/375.html

const isComment = __nccwpck_require__(3275)
const getPotentialMitigations = __nccwpck_require__(7604)
const findPrivateVars = __nccwpck_require__(7637)

let issueNumber = 374

const cwe_374 = (data, comment) => {

    let pVars = findPrivateVars(data)
        .filter(single => !isComment(single.lineNumber, comment.comments.lineComments, comment.comments.blockComments))

    let usage = findUsage(data, pVars)
    let errors = {
        "mitigation": getPotentialMitigations(issueNumber),
        "text": `In the following lines a private variable is passed to an untrusted caller: ${usage.map(single => single).join(", ")}`,
        "lineNumbers": usage,
        "issueNumber": issueNumber
    }
    return errors
}

const findUsage = (data, pVars) => {
    let result = []
    for(let i in pVars) {
        for(let key in data){
            if(data[key].includes(pVars[i].varName) && data[key].match(`.*\\(.*${pVars[i].varName}.*\\)`)){
                let before = data[key][data[key].indexOf(pVars[i].varName) - 1]
                let after = data[key][data[key].indexOf(pVars[i].varName) + pVars[i].varName.length]
                let regex = new RegExp('[^a-zA-Z0-9]')
                if(before.match(regex) && after.match(regex)){
                    result.push( parseInt(key) + 1)
                }
            }
        }
    }
    return result
}

module.exports = cwe_374

/***/ }),

/***/ 3779:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const isComment = __nccwpck_require__(3275)
const getPotentialMitigations = __nccwpck_require__(7604)
const findPrivateVars = __nccwpck_require__(7637)

let issueNumber = 375

const cwe_375 = (data, comment) => {

    let pvars = findPrivateVars(data)
        .filter(single => !isComment(single.lineNumber, comment.comments.lineComments, comment.comments.blockComments))

    let weaknesses = findErrors(data, pvars)
        .filter(single => !isComment(single.lineNumber, comment.comments.lineComments, comment.comments.blockComments))

    let errors = {
        "mitigation": getPotentialMitigations(issueNumber),
        "text": `In the following line(s) a mutable data was returned to an untrusted caller: ${weaknesses.map(single => `in line ${single.lineNumber}`).join(", ")}`,
        "lineNumbers": weaknesses.map(single => single.lineNumber),
        "issueNumber": issueNumber
    }

    return errors
}

module.exports = cwe_375

const findErrors = (data, pvars) => {
    let result = [] //varname and lineNumber
    for(let key in data){
        if(data[key].match(/return\s/)){
            let split = data[key]
                .replace(';', '')
                .split(/\s/)
                .filter(single => single !== '')
            if(pvars.filter(single => single.varName === split[1]).length > 0){
                result.push({
                    'varname': split[1],
                    'lineNumber': key + 1
                })
            }
        }
    }
    return result
}

/***/ }),

/***/ 9706:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const getPotentialMitigations = __nccwpck_require__(7604);
const findFunctions = __nccwpck_require__(698);
const findUpperCodeBlock = __nccwpck_require__(3819);
const isComment = __nccwpck_require__(3275);

let issueNumber = 401

const cwe_401 = (data, comment) => {


    let errors = {
        "mitigation": 'Phase: Implementation\n' +
            'Choose a language or tool that provides automatic memory management, or makes manual memory management less error-prone.\n' +
            'For example, glibc in Linux provides protection against free of invalid pointers.\n' +
            'When using Xcode to target OS X or iOS, enable automatic reference counting (ARC) [REF-391].\n' +
            'To help correctly and consistently manage memory when programming in C++, consider using a smart pointer class such as std::auto_ptr (defined by ISO/IEC ISO/IEC 14882:2003), std::shared_ptr and std::unique_ptr (specified by an upcoming revision of the C++ standard, informally referred to as C++ 1x), or equivalent solutions such as Boost.\n' +
            '\n' +
            'Phase: Architecture and Design\n' +
            'Use an abstraction library to abstract away risky APIs. Not a complete solution.\n' +
            '\n' +
            'Phases: Architecture and Design; Build and Compilation\n' +
            'The Boehm-Demers-Weiser Garbage Collector or valgrind can be used to detect leaks in code.',
        "text": "",
        "lineNumbers": [],
        "issueNumber": issueNumber
    }

    let mallocUsed = findFunctions(data, ['malloc'])
    //finds the corresponding upper (outer) code block to the line where the malloc function was used
    mallocUsed.map(single => single.codeBlock = findUpperCodeBlock(single.lineNumber, data))

    for (let i = 0; i < mallocUsed.length; ++i) {
        if (mallocUsed[i].codeBlock.start === -1) mallocUsed[i].codeBlock.start = 0
        if (mallocUsed[i].codeBlock.end === -1) mallocUsed[i].codeBlock.end = data.length
    }

    let pointer = mallocUsed.map(single => findPointer(data, single.lineNumber - 1))

    let freeUsed = findFunctions(data, ['free'])
    
    errors.lineNumbers = mallocUsed
        .map(single => single.lineNumber)
        .filter(single => !isComment(single, comment.comments.lineComments, comment.comments.blockComments))
    errors.text = `In the following line memory was allocated but never freed: ${mallocUsed.map(single => `in line ${single.lineNumber}`).join(', ')}`
    return errors
}

const findVarName = (data, lineNumber) => {
    let line = data[lineNumber]

    console.log(line)

    return
}

const findPointer = (data, lineNumber) => {
    let line = data[lineNumber]
    return line.split('=')[0].split('*')[1] && line.split('=')[0].split('*')[1].replace(' ', '')
}

module.exports = cwe_401

/***/ }),

/***/ 4690:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

//https://cwe.mitre.org/data/definitions/415.html

const getPotentialMitigations = __nccwpck_require__(7604);
const findFunctions = __nccwpck_require__(698);
const isComment = __nccwpck_require__(3275);
const determinePotentialErrors = __nccwpck_require__(6355)

let issueNumber = 415

const cwe_415 = (data, comments) => {
    let potentialErrors = findFunctions(data, ['free'])
    let errors = {
        "mitigation": getPotentialMitigations(issueNumber),
        "text": '',
        "lineNumbers": [],
        "issueNumber": issueNumber
    }
    //checks if a line where free is in use is a comment.
    //and simplifies the structure, the indicator gets lost but as it is only free it does not matter
    potentialErrors = potentialErrors
        .filter(single => !isComment(single.lineNumber, comments.comments.lineComments, comments.comments.blockComments))
        .map(single => {return {lineNumber:single.lineNumber - 1, indicator: single.indicator}})


    for(let i=0;i<potentialErrors.length;++i){
        potentialErrors[i] = determinePotentialErrors(data, i, potentialErrors)
    }
    try {
        for (let i = 0; i < potentialErrors.length; ++i) {
            for (let j = 0; j < potentialErrors.length; ++j) {
                if (j !== i) {
                    if (
                        potentialErrors[i].varName === potentialErrors[j].varName
                        &&
                        potentialErrors[j].lineNumber >= potentialErrors[i].start
                        &&
                        potentialErrors[j].lineNumber <= potentialErrors[i].end
                    ) {
                        errors.lineNumbers.push({
                            free: potentialErrors[i].lineNumber,
                            freeSecond: potentialErrors[j].lineNumber
                        })
                        potentialErrors.splice(i, 1)
                        potentialErrors.splice(j - 1, 1)
                    }
                }
            }
        }
    } catch (e) {}

    errors.text = `In the following lines an error occurred: ${errors.lineNumbers.map(single => `free in line ${single.free} and in line ${single.freeSecond} the variable was freed again`).join()}`

    return errors
}

module.exports = cwe_415

/***/ }),

/***/ 4567:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

//https://cwe.mitre.org/data/definitions/416.html

const getPotentialMitigations = __nccwpck_require__(7604);
const findFunctions = __nccwpck_require__(698);
const isComment = __nccwpck_require__(3275);
const determinePotentialErrors = __nccwpck_require__(6355)

let issueNumber = 416
const storeForRemove = []
const checkForReassignment = (single, data) => {
    const regex = new RegExp(`${single.varName}\\s*=[a-zA-Z0-9\\s]`)
    if(data[single.usage - 1].match(regex)){
        storeForRemove.push(single)
        return false
    }
    return true
}

const cwe_416 = (data, comments) => {
    let potentialErrors = findFunctions(data, ['free'])
    let errors = {
        "mitigation": getPotentialMitigations(issueNumber),
        "text": '',
        "lineNumbers": [],
        "issueNumber": issueNumber
    }
    //checks if a line where free is in use is a comment.
    //and simplifies the structure, the indicator gets lost but as it is only free it does not matter
    potentialErrors = potentialErrors
        .filter(single => !isComment(single.lineNumber, comments.comments.lineComments, comments.comments.blockComments))
        .map(single => {return {lineNumber:single.lineNumber - 1, indicator: single.indicator}})


    errors.lineNumbers = findErrors(potentialErrors, data)
        .filter(single => checkForReassignment(single, data)) //checks if a variable was re-assigned and if so, the line with the initial free will be stored

    for(let i = 0;i < storeForRemove.length;++i){
        for(let j = 0 ; j < errors.lineNumbers.length; ++j){
            if(storeForRemove[i].free === errors.lineNumbers[j].free && storeForRemove[i].usage < errors.lineNumbers[j].usage){
                errors.lineNumbers.splice(j, 1)
                j--
            }
        }
    }
    errors.text = `In the following lines an error occurred: ${errors.lineNumbers.map(single => `free in line ${single.free} and the variable was reused in line ${single.usage}`).join()}`


    return errors
}

const findErrors = (potentialErrors, data) => {
    let result = []
    let regexp = /[A-Za-z0-9_]/gi;
    for(let i=0;i<potentialErrors.length;++i){
        potentialErrors[i] = determinePotentialErrors(data, i, potentialErrors)
        for(let j = potentialErrors[i].lineNumber + 1;j<potentialErrors[i].end;++j){
            try {
                let regex = new RegExp(`${potentialErrors[i].varName}`, 'g')
                if (data[j].match(regex)) {
                    let start = regex.exec(data[j])
                    let end = start.index + potentialErrors[i].varName.length
                    let indexBefore = data[j][start.index - 1]
                    let indexAfter = data[j][end]
                    if (((indexBefore !== undefined && !indexBefore.match(regexp)) || indexBefore === undefined) && ((indexAfter !== undefined && !indexAfter.match(regexp)) || indexAfter === undefined)) {
                        result.push({free: potentialErrors[i].lineNumber + 1, usage: j + 1, varName: potentialErrors[i].varName})
                    }
                }
            } catch (e){
                console.log(potentialErrors[i].varName)
            }
        }
    }
    return result
}

module.exports = cwe_416

/***/ }),

/***/ 5764:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const getPotentialMitigations = __nccwpck_require__(7604);
const findFunctions = __nccwpck_require__(698);
const dataTypes = __nccwpck_require__(8445)
const findUpperCodeBlock = __nccwpck_require__(3819)
const isComment = __nccwpck_require__(3275);
const findVariableDeclarations = __nccwpck_require__(3338)

let issueNumber = 467


const cwe_467 = (data, comment) => {

    let errors = {
        "mitigation": getPotentialMitigations(issueNumber),
        "text": "",
        "lineNumbers": [],
        "issueNumber": issueNumber
    }

    let possibleProblems = findFunctions(data, ['sizeof']).map(single => single.lineNumber - 1) //subtract 1, because the result is not in the corresponding array entry
    let result = []
    for (let i = 0; i < possibleProblems.length; ++i) {
        let codeBlock = findUpperCodeBlock(possibleProblems[i], data)

        let variableDeclarations = findVariableDeclarations(data, dataTypes, codeBlock)
        let line = data[possibleProblems[i]]
        result.push(matchFunctionAndVariable(line, possibleProblems[i], variableDeclarations))
        //console.log(result)

    }


    errors.lineNumbers = result
        .filter(single => single.length > 0)
        .flat()
        .map(single => single.lineNumber)
        .filter(single => !isComment(single, comment.comments.lineComments, comment.comments.blockComments))

    let text = result
        .filter(single => single.length > 0)
        .flat()
        .map(single => `in line ${single.lineNumber} the variable ${single.varName}`)
        .join(', ')

    errors.text = `In the following lines the sizeof function was male used: ${text}`


    return errors
}

const matchFunctionAndVariable = (line, lineNumber, vars) => {
    let result = []//{lineNumber: number, dataType: string}


    let after = line.split('sizeof')[1]
    let end
    for (let i = 1; i < after.split('').length; ++i) {
        if (after[i] === ')') {
            end = i
            break
        }
    }


    let varName = after.split('').filter((single, index) => index >= 1 && index < end).join('')
    if (vars.filter(single => single.variable === varName).length === 0 && !varName.includes('*')) {
        result.push({
            lineNumber: lineNumber + 1,
            varName
        })
    }

    return result
}

module.exports = cwe_467

/***/ }),

/***/ 8445:
/***/ ((module) => {

let dataTypes = ['unsigned character', 'unsigned int', 'unsigned short', 'unsigned long', 'char', 'int', 'short', 'long', 'float', 'double']


module.exports = dataTypes

/***/ }),

/***/ 3230:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

//https://cwe.mitre.org/data/definitions/468.html

const getPotentialMitigations = __nccwpck_require__(7604);
const dataTypes = __nccwpck_require__(8445)
const isComment = __nccwpck_require__(3275);
const findVariableDeclarations = __nccwpck_require__(3338)

let issueNumber = 468

const cwe_468 = (data, comments) => {
    let errors = {
        "mitigation": getPotentialMitigations(issueNumber),
        "text": '',
        "lineNumbers": [],
        "issueNumber": issueNumber
    }

    let variables = findVariableDeclarations(data, dataTypes, {start: 0, end: data.length -1} )
    let regexForPointerSpace = /\s*\(\s*.*\s*\*\)\(.*\s*\+\s*.*\)/g
    for(let i = 0; i < variables.length;++i){
        let line = data[variables[i].lineNumber - 1]
        let assignedValue = line.split("=")[1]
        if(assignedValue && doesNotContain(assignedValue , ['malloc'])){
            if(assignedValue.match(regexForPointerSpace) && !isComment(variables[i].lineNumbers, comments.comments.lineComments, comments.comments.blockComments)){
                errors.lineNumbers.push(variables[i].lineNumber)
            }
        }
    }

    errors.text = `In the following lines an error occurred: ${errors.lineNumbers.map(single => `in line ${single} the pointer was addressed wrongly`).join()}`

    return errors
}

const doesNotContain = (assignedValue, functionList) =>{
    return functionList.filter(single => assignedValue.includes(single)).length === 0
}

module.exports = cwe_468

/***/ }),

/***/ 5956:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

// https://cwe.mitre.org/data/definitions/478.html
const isComment = __nccwpck_require__(3275)
const getPotentialMitigations = __nccwpck_require__(7604)
const findSwitch = __nccwpck_require__(238)

const issueNumber = 478

const cwe_478 = (data, comment) => {
    let possibleError = findSwitch(data)

    let errors = {
        "mitigation": getPotentialMitigations(issueNumber),
        "text": "",
        "lineNumbers": [],
        "issueNumber": issueNumber
    }
    if (possibleError.length > 0) {
        for (let i = 0; i < possibleError.length; ++i) {
            let index = possibleError[i] - 1
            let indexNext = i < possibleError.length - 1 ? possibleError[i + 1] : data.length - 1
            let join = data
                .slice(index, indexNext)
                .join('')
            if (join.match(/(switch\s*\(\s*.*\s*\)\s*{.*default:.*(\s*.*{(\s*|.*){(.*)}(\s*|.*)})?})/g) === null) {
                //wrong switch found
                if(!isComment(possibleError[i], comment.comments.lineComments, comment.comments.blockComments)) {
                    errors.lineNumbers.push(possibleError[i])
                }
            }
        }
    }

    errors.text = `In the following lines ${errors.lineNumbers.join(', ')} the error was detected!`

    return errors
}

module.exports = cwe_478

/***/ }),

/***/ 8580:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {


//https://cwe.mitre.org/data/definitions/481.html

const getPotentialMitigations = __nccwpck_require__(7604);
const findIndicators = __nccwpck_require__(3524);
const indicators = __nccwpck_require__(5843);

let issueNumber = 481

const cwe_481 = (data, comments) => {

    let errors = {
        "mitigation": getPotentialMitigations(issueNumber),
        "text": "In the following lines was an incorrect block delimitation found:",
        "lineNumbers": [],
        "issueNumber": issueNumber
    }
    let possibleErrors = findIndicators(data, comments, indicators)

    for (let i = 0; i < possibleErrors.length; ++i) {
        //calculates the indexes which are interesting to scan
        let index = possibleErrors[i].lineNumber - 1
        let indexNext = i < possibleErrors.length - 1 ? possibleErrors[i + 1].lineNumber : data.length - 1
        let join = data
            .slice(index, indexNext)
            .join('')
        //finds the start of the sacn
        let regex = new RegExp(`${possibleErrors[i].indicator}\\s*\\(`, 'g')
        let start = regex.exec(join)
        let end
        join = join.slice(start.index, join.length)
        let joinSplit = join.split('')
        let count = 0
        //finds the end of the condition block example: if(condition)
        for(let k = 0;k < joinSplit.length;++k){
            if(count === 0 && joinSplit[k] === '(') { count++; start = k + 1 }
            else if(count > 0 && joinSplit[k] === '(') { count++ }
            else if(count > 1 && joinSplit[k] === ')') { count-- }
            else if(count === 1 && joinSplit[k] === ')') { //found last closing braked
                count--
                end = k
                break
            }
        }

        let condition = joinSplit.splice(start, end - start).join('')
        let conditionAndSplit = condition.split(`/[&&||]/`)
        for(let k = 0 ; k < conditionAndSplit.length; ++k){
            if(possibleErrors[i].indicator === 'for' && conditionAndSplit[k].split(';').length === 3){
                conditionAndSplit[k] = conditionAndSplit[k].split(';')[1]
            }
            let regex = new RegExp(`[^=!]=[^=]`)
            if(conditionAndSplit[k].match(regex)){
                regex = new RegExp(`(?:!=|==|<=|>=)`)
                if(!conditionAndSplit[k].match(regex)){
                    errors.lineNumbers.push(possibleErrors[i])
                }
            }
        }
    }

    for(let key in data){
        if(data[key].includes('return')){
            let regex = new RegExp(`return\\s.*=.*;`)
            if(data[key].match('return.*;') && data[key].match(regex) && data[key].split('=').length === 2){
                errors.lineNumbers.push({lineNumber: parseInt(key) + 1, indicator: 'return'})
            }
        }
        if(data[key].match(`.*=.*=.*;$`)){
            let split = data[key]
                .split('=')
                .filter(single => single !== '')
            if(split.length === 3){
                errors.lineNumbers.push({lineNumber: parseInt(key) + 1, indicator: 'assignment'})
            }
        }
    }
    errors.lineNumbers.sort(function (a, b){return a.lineNumber - b.lineNumber})
    errors.text += errors.lineNumbers.map(single => ` in line ${single.lineNumber} and the indicator was ${single.indicator}`).join(', ')
    errors.lineNumbers = errors.lineNumbers.map(single => single.lineNumber)
    return errors
}

module.exports = cwe_481

/***/ }),

/***/ 8743:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

//https://cwe.mitre.org/data/definitions/482.html

const getPotentialMitigations = __nccwpck_require__(7604);
const findIndicators = __nccwpck_require__(3524);
const indicators = __nccwpck_require__(5843);
const isComment =__nccwpck_require__(3275);

let issueNumber = 482

const checkForAssigment = (single, data) => {
    let regex = new RegExp(`=.*${single.sign}`)
    return data[single.lineNumber - 1].match(regex) ? false : true
}

const checkForReturn = (single, data) => {
    return !data[single.lineNumber - 1].includes("return")
}
const cwe_482 = (data, comments) => {

    let errors = {
        "mitigation": getPotentialMitigations(issueNumber),
        "text": "In the following lines was an comparing instead of assigning found:",
        "lineNumbers": [],
        "issueNumber": issueNumber
    }
    let possibleErrors481 = findIndicators(data, comments, indicators)
    let possibleErrors = findSigns(data, ['=='])

    for(let j = 0 ; j < possibleErrors481.length; ++j){
        for(let i = 0 ; i < possibleErrors.length ; ++i){
            if(possibleErrors[i].lineNumber === possibleErrors481[j].lineNumber){
                possibleErrors.splice(i, 1)
                i -= 1
            }
        }
    }
    errors.lineNumbers = possibleErrors
        .filter(single => !isComment(single.lineNumber, comments.comments.lineComments, comments.comments.blockComments))
        .filter(single => checkForAssigment(single, data))
        .filter(single => checkForReturn(single, data))

    errors.text += errors.lineNumbers.map(single => ` in line ${single.lineNumber}`).join(', ')
    errors.lineNumbers = errors.lineNumbers.map(single => single.lineNumber)

    return errors
}

const findSigns = (data, indicator) => {
    let result = []//{lineNumber: number, sign: string}
    for(let i = 0;i<data.length;++i){
        for(let j=0;j < indicator.length;++j){
            if(data[i].includes(indicator[j])){
                result.push({
                    lineNumber: i + 1,
                    sign: indicator[j]
                })
            }
        }
    }
    return result
}

module.exports = cwe_482

/***/ }),

/***/ 255:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {


//https://cwe.mitre.org/data/definitions/467.html

const getPotentialMitigations = __nccwpck_require__(7604);
const findIndicators = __nccwpck_require__(3524);
const indicators = __nccwpck_require__(5843);
const isComment = __nccwpck_require__(3275);

let issueNumber = 483

const cwe_483 = (data, comments) => {
    let errors = {
        "mitigation": getPotentialMitigations(issueNumber),
        "text": "In the following lines was an incorrect block Delimitation found:",
        "lineNumbers": [],
        "issueNumber": issueNumber
    }
    let possibleError = findIndicators(data, comments, indicators)

    //deletes if indicators for the list if in the same line is an else if
    for(let i = 1;i<possibleError.length;++i){
        if(possibleError[i-1].lineNumber === possibleError[i].lineNumber){
            possibleError.splice(i, 1)
        }
    }

    let possibleErrorForElse = findElse(data, comments, possibleError)

    for (let i = 0; i < possibleError.length; ++i) {
        //calculates the indexes which are interesting to scan
        let index = possibleError[i].lineNumber - 1
        let indexNext = i < possibleError.length - 1 ? possibleError[i + 1].lineNumber : data.length - 1
        let join = data
            .slice(index, indexNext)
            .join('')
        //finds the start of the sacn
        let regex = new RegExp(`${possibleError[i].indicator}`, 'g')
        let start = regex.exec(join)
        join = join.slice(start.index, join.length)
        let joinSplit = join.split('')
        let count = 0
        //finds the end of the condition block example: if(condition)
        for(let k = 0;k < joinSplit.length;++k){
            if(count === 0 && joinSplit[k] === '(') { count++ }
            else if(count > 0 && joinSplit[k] === '(') { count++ }
            else if(count > 1 && joinSplit[k] === ')') { count-- }
            else if(count === 1 && joinSplit[k] === ')') { //found last closing braked
                count--
                start = k + 1
                break
            }
        }
        //generates a new list with the updated starting point
        join = join.slice(start, join.length)
        joinSplit = join.split('')
        //scans for the first non whitespace
        //if it is an opening curly braked all is fine
        //if it is not an opening curly braked or a whitespace it can be added to the list
        for(let j = 0; j < joinSplit.length;++j){
            if(joinSplit[j] === '{'){ break }
            else if(/\S/.test(joinSplit[j])){
                errors.lineNumbers.push(possibleError[i])
                break
            }
        }
    }

    //does the same but only for else
    //this step was mandatory because else as indicator has no condition block
    for(let i = 0 ; i < possibleErrorForElse.length ; ++i) {
        //calculates the indexes which are interesting to scan
        let index = possibleErrorForElse[i] - 1
        let indexNext = i < possibleErrorForElse.length - 1 ? possibleErrorForElse[i + 1] : data.length - 1
        let join = data
            .slice(index, indexNext)
            .join('')
        //finds the start of the sacn
        let regex = new RegExp(`else`, 'g')
        let start = regex.exec(join)
        join = join.slice(start.index + 4, join.length)
        let joinSplit = join.split('')
        //scans for the first non whitespace
        //if it is an opening curly braked all is fine
        //if it is not an opening curly braked or a whitespace it can be added to the list
        for(let j = 0; j < joinSplit.length;++j){
            if(joinSplit[j] === '{'){ break }
            else if(/\S/.test(joinSplit[j])){
                errors.lineNumbers.push({lineNumber:possibleErrorForElse[i], indicator: 'else'})
                break
            }
        }
    }
    //sorts the lineNumbers, due the later calculation of else the order got disturbed
    errors.lineNumbers.sort(function (a, b){return a.lineNumber - b.lineNumber})
    errors.lineNumbers = errors.lineNumbers.filter(single => checkForDowhile(single, data[single.lineNumber - 1]))
    errors.text += errors.lineNumbers.map(single => ` in line ${single.lineNumber} and the indicator was ${single.indicator}`).join(', ')
    errors.lineNumbers = errors.lineNumbers.map(single => single.lineNumber)

    return errors
}

const checkForDowhile = (single, line) => {
    if(single.indicator !== "while"){
        return true
    }
    return !line.includes(';')
}

const findElse = (data, comments, possibleErrors) => {
    let result = [] //lineNumber eq.:[1, 3, 5, 32]
    for(let i = 0 ; i < data.length ; ++i){
        if(data[i].toLowerCase().split(' ').includes('else')){
            //checks if a line is a comment and if a line was found as else if
            if(
                !isComment(i + 1, comments.comments.lineComments, comments.comments.blockComments)
                &&
                !possibleErrors.filter(single => single.lineNumber === i + 1 && single.indicator === 'else if').length > 0
            ){
                result.push(i + 1)
            }
        }
    }
    return result
}

module.exports = cwe_483



/***/ }),

/***/ 5843:
/***/ ((__unused_webpack_module, __webpack_exports__, __nccwpck_require__) => {

"use strict";
__nccwpck_require__.r(__webpack_exports__);
/* harmony export */ __nccwpck_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
let indicators = ['else if','if', 'while', 'for']


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (indicators);

/***/ }),

/***/ 1330:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

// https://cwe.mitre.org/data/definitions/484.html

const getPotentialMitigations = __nccwpck_require__(7604);
const findSwitch = __nccwpck_require__(238);
const isComment = __nccwpck_require__(3275);

const issueNumber = 484

const cwe_484 = (data, comment) => {
    let possibleError = findSwitch(data)

    let errors = {
        "mitigation": getPotentialMitigations(issueNumber),
        "text": "",
        "lineNumbersInformation": [],
        "lineNumbers": [],
        "issueNumber": issueNumber
    }
    if (possibleError.length > 0) {
        for (let i = 0; i < possibleError.length; ++i) {
            let index = possibleError[i] - 1
            let indexNext = i < possibleError.length - 1 ? possibleError[i + 1] : data.length - 1
            let join = data
                .slice(index, indexNext)
                .join('')
            let defaultCase = join.split('default')[1]
            let cases = join.split('default')[0].split('case')

            if (defaultCase !== undefined) cases.push(defaultCase)
            let count = 0
            for (let j = 1; j < cases.length; ++j) {
                if (!cases[j].includes('break;')) {
                    ++count;
                }
            }
            if (count > 0 && !isComment(possibleError[i], comment.comments.lineComments, comment.comments.blockComments)) {
                errors.lineNumbersInformation.push({
                    "switchLine": possibleError[i],
                    "breakCount": count
                })
                errors.lineNumbers.push(possibleError[i])
            }
        }
    }

    errors.text = `In the following lines (switch statements) where found one or more error ${errors.lineNumbersInformation.map(single => `${single.switchLine} (${single.breakCount} error${single.breakCount > 0 ? 's' : ''})`).join(', ')}`

    return errors
}

module.exports = cwe_484

/***/ }),

/***/ 8457:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const getPotentialMitigations = __nccwpck_require__(7604);
const findFunctions = __nccwpck_require__(698);
const functionArguments = __nccwpck_require__(8022);


let issueNumber = 560

const cwe_560 = (data, comments) => {

    let errorsFound = findErrors(data, comments, findFunctions(data, ['umask']))

    let errors = {
        "mitigation": getPotentialMitigations(issueNumber),
        "text": `In the following line the function umask was with chmod-style argument used: ${errorsFound.map(single => `in line ${single}`).join(", ")}`,
        "lineNumbers": errorsFound.map(single => single.lineNumber),
        "issueNumber": issueNumber
    }

    return errors
}

const findErrors = (data, comments, umasks) => {
    let result = []
    for(let i = 0 ; i < umasks.length; ++i){
        let fArguments = functionArguments(data[umasks[i].lineNumber - 1], 'umask').join('')
        if(fArguments.split(',').length > 1){
            result.push(umasks[i].lineNumber)
        }
    }
    return result
}

module.exports = cwe_560

/***/ }),

/***/ 8119:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

//https://cwe.mitre.org/data/definitions/587.html

const getPotentialMitigations = __nccwpck_require__(7604);
const findVariableDeclarations = __nccwpck_require__(3338);
const dataTypes = __nccwpck_require__(8445);
const isComment = __nccwpck_require__(3275);


let issueNumber = 587

const cwe_587 = (data, comment) => {
    let errorsFound = findErrors(data, comment, findVariableDeclarations(data, dataTypes, {end: -1, start: -1}))

    let errors = {
        "mitigation": getPotentialMitigations(issueNumber),
        "text": `In the following line a fixed address was assignt to a point: ${errorsFound.map(single => `in line ${single}`).join(", ")}`,
        "lineNumbers": errorsFound,
        "issueNumber": issueNumber
    }

    return errors
}
const findErrors = (data, comment, variables) => {
    let result = []
    for(let i = 0 ; i < variables.length; ++i){
        let line = data[variables[i].lineNumber - 1]
        if(!isComment(variables[i].lineNumber -1, comment.comments.lineComments, comment.comments.blockComments) && line.split('=')[1] !== undefined){
            let assignedValue = line.split('=')[1].replace(/\s/g, '').replace(';', '')
            let regex = new RegExp('[0-9][a-x0-9]+')
            let match = assignedValue.match(regex)
            if(match !== null && match[0].length === assignedValue.length && assignedValue.match('[a-z]+')){
                result.push(variables[i].lineNumber)
            }
        }
    }


    return result
}

module.exports = cwe_587

/***/ }),

/***/ 1435:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

//https://cwe.mitre.org/data/definitions/558.html
const getPotentialMitigations = __nccwpck_require__(7604)
const findFunctions = __nccwpck_require__(698)
const isComment = __nccwpck_require__(3275)

let issueNumber = 558

const cwe_588 = (data, comment) => {

    let errorsFound = findFunctions(data, ['getlogin'])
        .filter(single => !isComment(single.lineNumber, comment.comments.lineComments, comment.comments.blockComments))

    let errors = {
        "mitigation": getPotentialMitigations(issueNumber),
        "text": `In the following line the command chroot was used: ${errorsFound.map(single => `in line ${single.lineNumber}`).join(", ")}`,
        "lineNumbers": errorsFound.map(single => single.lineNumber),
        "issueNumber": issueNumber
    }

    return errors
}

module.exports = cwe_588

/***/ }),

/***/ 632:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

//https://cwe.mitre.org/data/definitions/242.html
//https://cwe.mitre.org/data/definitions/676.html

const getPotentialMitigations = __nccwpck_require__(7604)
const cwe676242WordList = __nccwpck_require__(6543)
const isComment = __nccwpck_require__(3275)
const findFunctions = __nccwpck_require__(698)

const issueNumber = 676
const issueNumberMerge = 242


const cwe_676_242 = (data, comment) => {
    let errors = {
        "mitigation": getPotentialMitigations(issueNumber),
        "text": "",
        "lineNumbers": [],
        "issueNumber": `${issueNumber} and ${issueNumberMerge}`
    }

    errors.mitigation.push(getPotentialMitigations(issueNumberMerge))
    errors.mitigation = errors.mitigation.flat()


    let prohibitedFunctions = findFunctions(data, cwe676242WordList)
        .filter(single => !isComment(single.lineNumber, comment.comments.lineComments, comment.comments.blockComments))

    errors.text = `In the following lines was one or more prohibited functions found: ${prohibitedFunctions.map(single => `in line: ${single.lineNumber} function: ${single.functionName}`).join(', ')}`

    errors.lineNumbers = prohibitedFunctions.map(single => single.lineNumber)


    return errors
}


module.exports = cwe_676_242

/***/ }),

/***/ 6543:
/***/ ((module) => {

let cwe676242WordList = ['strcpy', "strcpyA", "strcpyW", "wcscpy", "_tcscpy", "_mbscpy", "StrCpy", "StrCpyA", "StrCpyW", "lstrcpy", "lstrcpyA", "lstrcpyW", "_tccpy", "_mbccpy", "_ftcscpy", "strcpyA", "strcpyW", "wcscpy", "_tcscpy", "_mbscpy", "StrCpy", "StrCpyA", "StrCpyW", "lstrcpy", "lstrcpyA", "lstrcpyW", "_tccpy", "_mbccpy", "_ftcscpy", "strcat", "strcatA", "strcatW", "wcscat", "_tcscat", "_mbscat", "StrCat", "StrCatA", "StrCatW", "lstrcat", "lstrcatA", "lstrcatW", "StrCatBuff", "StrCatBuffA", "StrCatBuffW", "StrCatChainW", "_tccat", "_mbccat", "_ftcscat", "sprintfW", "sprintfA", "wsprintf", "wsprintfW", "wsprintfA", "sprintf", "swprintf", "_stprintf", "wvsprintf", "wvsprintfA", "wvsprintfW", "vsprintf", "_vstprintf", "vswprintf", "strncpy", "wcsncpy", "_tcsncpy", "_mbsncpy", "_mbsnbcpy", "StrCpyN", "StrCpyNA", "StrCpyNW", "StrNCpy", "strcpynA", "StrNCpyA", "StrNCpyW", "lstrcpyn", "lstrcpynA", "lstrcpynW", "strncat", "wcsncat", "_tcsncat", "_mbsncat", "_mbsnbcat", "StrCatN", "StrCatNA", "StrCatNW", "StrNCat", "StrNCatA", "StrNCatW", "lstrncat", "lstrcatnA", "lstrcatnW", "lstrcatn", "gets", "_getts", "_gettws", "IsBadWritePtr", "IsBadHugeWritePtr", "IsBadReadPtr", "IsBadHugeReadPtr", "IsBadCodePtr", "IsBadStringPtr", "memcpy", "RtlCopyMemory", "CopyMemory", "wmemcpy", "lstrlen"
    , "wnsprintf", "wnsprintfA", "wnsprintfW", "_snwprintf", "_snprintf", "_sntprintf", "_vsnprintf", "vsnprintf", "_vsnwprintf", "_vsntprintf", "wvnsprintf", "wvnsprintfA", "wvnsprintfW", "strtok", "_tcstok", "wcstok", "_mbstok", "makepath", "_tmakepath", "_makepath", "_wmakepath", "_splitpath", "_tsplitpath", "_wsplitpath", "scanf", "wscanf", "_tscanf", "sscanf", "swscanf", "_stscanf", "snscanf", "snwscanf", "_sntscanf", "_itoa", "_itow", "_i64toa", "_i64tow", "_ui64toa", "_ui64tot", "_ui64tow", "_ultoa", "_ultot", "_ultow", "CharToOem", "CharToOemA", "CharToOemW", "OemToChar", "OemToCharA", "OemToCharW", "CharToOemBuffA", "CharToOemBuffW", "alloca", "_alloca", "ChangeWindowMessageFilter"]


module.exports = cwe676242WordList

/***/ }),

/***/ 6355:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const findUpperCodeBlock = __nccwpck_require__(3819)

const determinePotentialErrors = (data, i, potentialErrors) => {
    let index = potentialErrors[i].lineNumber
    let indexNext = i < potentialErrors.length - 1 ? potentialErrors[i + 1].lineNumber : data.length - 1
    let join = data
        .slice(index, indexNext)
        .join('')
    let regex = new RegExp(`free\\s*\\(.*`, 'g')
    let start = regex.exec(data[potentialErrors[i].lineNumber])
    let end
    join = join.slice(start.index, join.length)
    let count = 0
    let joinSplit = join.split('')
    //finds the end of the condition block example: if(condition)
    for(let k = 0;k < joinSplit.length;++k){
        if(count === 0 && joinSplit[k] === '(') { count++; start = k + 1 }
        else if(count > 0 && joinSplit[k] === '(') { count++ }
        else if(count > 1 && joinSplit[k] === ')') { count-- }
        else if(count === 1 && joinSplit[k] === ')') { //found last closing braked
            count--
            end = k
            break
        }
    }
    potentialErrors[i].varName = joinSplit.slice('free('.length, end).join('')
    let upperCodeBlock = findUpperCodeBlock(potentialErrors[i].lineNumber, data)
    potentialErrors[i].end = upperCodeBlock.end === -1 ? data.length : upperCodeBlock.end
    potentialErrors[i].start = upperCodeBlock.start === -1 ? 1 : upperCodeBlock.start
    delete potentialErrors[i].indicator
    return potentialErrors[i]
}

module.exports = determinePotentialErrors

/***/ }),

/***/ 1768:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const isComment = __nccwpck_require__(3275);

const findErrorsSignAndUnsignConversionError = (data, comment, vars) => {
    let result = []
    vars = vars
        .filter(single =>
            (single.variable[0] && single.variable[0].match(/[a-zA-Z]/))
            &&
            !isComment(single.lineNumber, comment.comments.lineComments, comment.comments.blockComments)
            &&
            !single.variable.includes('(')
            &&
            !single.variable.includes('}')
            &&
            !single.variable.includes(')')
            &&
            !single.variable.includes('{')
        )

    let dest
    let source
    for(let i = 0; i < data.length;++i){
        let match = data[i].match('=')
        dest = null
        source = null
        if(match && data[i][match.index+1] !== '='){
            let split = data[i].split('=')
            dest = matchVarLeft(split[0], vars)
            if(split.length > 1){
                source = matchVarRight(split[1], vars)
            }
            if(dest !== null && source !== null && dest !== source){
                result.push({
                    dest,
                    source,
                    lineNumber: i + 1
                })
            }
        }
    }

    return result
}

// returns the datatype
const matchVarLeft = (left, vars) => {
    for(let i = 0 ; i < vars.length; ++i){
        try {
            let regex = new RegExp(`(?![a-zA-Z0-9])\\s*${vars[i].variable}\\s*(?![a-zA-Z0-9])`)
            let match = regex.exec(left)
            if (match) {
                let before = left[match.index] ? left[match.index] : ' '
                let next = left[match.index + 1 + vars[i].variable.length] ? left[match.index + 1 + vars[i].variable.length] : ' '
                if (before.match('\\s') && next.match('[\\s\\=]')) {
                    return vars[i].dataType
                }
            }
        }catch (e) {}
    }
    return null
}

//returns array of possible datatype
const matchVarRight = (right, vars) => {
    for(let i = 0 ; i < vars.length; ++i){
        try {
            let regex = new RegExp(`\\s*${vars[i].variable}\\s*;`)
            let match = right.match(regex)
            if (match) {
                return vars[i].dataType
            }
            try {
                // eslint-disable-next-line
                let result = eval(right)
                if (result >= 0) {
                    if (result.toString().includes('.')) {
                        return ['unsigned float', 'unsigned double', "double", "float"]
                    }
                    return ['unsigned char','unsigned int', 'unsigned short', 'unsigned long', 'unsigned float', "unsigned double", 'char','int', 'short', 'long', 'float', 'double']
                } else {
                    if (result.toString().includes('.')) {
                        return ["double", "float"]
                    }
                    return ['char','int', 'short', 'long', 'float', 'double']
                }
            } catch (e) {
            }
            for (let j = 0; j < dataTypes.length; ++j) {
                regex = new RegExp(`\\(${dataTypes[j]}\\)\\s*[a-zA-Z0-9\\.\\-\\+\\/\\*]+;`)
                match = right.match(regex)
                if (match) {
                    return dataTypes[j]
                }
            }
        } catch (e){}
    }
    return null
}

module.exports = findErrorsSignAndUnsignConversionError

/***/ }),

/***/ 698:
/***/ ((module) => {



/*
* input:
* output:
* desc:
* */
const findFunctions = (data, cwe676242WordList) => {
    let result = [] //{line: number, functionName: string}
    let regexp = /[A-Za-z0-9_]/gi;
    for (let i = 0; i < data.length; ++i) {
        for (let j = 0; j < cwe676242WordList.length; j++) {
            let regex = new RegExp(`${cwe676242WordList[j]}\\s*\\(.*`, 'g')
            //matches the regex to a single data line
            if (data[i].match(regex)) {
                //checks of the capiatlization is also the as in the function from the list
                //this step is mandatory to reject false positives like StrCat instead of save_StrCat
                let indexBefore = data[i][regex.exec(data[i]).index - 1]
                if((indexBefore !== undefined && !indexBefore.match(regexp)) || indexBefore === undefined){ //indexBefore can also be undefined since there dose not needs to be a character before the regex
                    result.push({
                        lineNumber: i + 1, //because we start to count from 1 and not 0 in file lines
                        functionName: cwe676242WordList[j]
                    })
                }
            }
        }
    }
    return result
}

module.exports = findFunctions

/***/ }),

/***/ 3524:
/***/ ((module) => {

const findIndicators = (data, comments, indicators) => {

    let indicatorsFound = [] //{lineNumber: number, indicator:string}
    // eslint-disable-next-line
    data.map((single, i) => {
        // eslint-disable-next-line
        for(let j = 0 ; j < indicators.length; ++j) {
            let regex = new RegExp(`${indicators[j]}\\s*\\(`, 'g')
            if (single.match(regex) && !isComment(i + 1, comments.comments.lineComments, comments.comments.blockComments)) {
                indicatorsFound.push({lineNumber: i + 1, indicator: indicators[j]})
            }
        }
    })

    return indicatorsFound
}

module.exports = findIndicators

/***/ }),

/***/ 7637:
/***/ ((module) => {

const findPrivateVars = (data) => {
    let result = [] //var name and line
    for(let key = 0 ; key < data.length; ++key){
        if(data[key].includes('private')) {
            if(data[key].includes('private:')){ //multiple public var declaration
                let end = key
                for(let i = key + 1 ; i < data.length; ++i){
                    if(!data[i].match(/;/)){
                        end = i
                        break
                    } else if(data[i].match('public')){
                        end = i
                        break
                    }
                }
                for(let i = key + 1 ; i < end; ++i){
                    let split = data[i]
                        .replace(';', '')
                        .split(" ")
                        .filter(single => single !== '')
                    result.push({
                        'varName': split[1],
                        'lineNumber': i + 1
                    })
                }
            } else { // single public declaration
                //console.log(data[key])
                // eslint-disable-next-line
                let regex = new RegExp(`private\\s*[a-zA-Z\[\]\*]*\\s*[a-zA-Z]*[;|\\s=]+.*;`)
                //console.log(data[key].match(regex))
                if(data[key].match(regex)){ //ensuring it is not a function i.e. private int main(){...
                    let split = data[key].replace(';', '').split(/\s/)
                    result.push({
                        'varName':split[2],
                        'lineNumber': key + 1
                    })
                }
            }
        }
    }
    return result
}

module.exports = findPrivateVars

/***/ }),

/***/ 238:
/***/ ((module) => {

const findSwitch = (data) => {

    let switchFound = []
    // eslint-disable-next-line
    data.map((single, i) => {
        if (single.match(/switch\s*\(\s*.*\s*\)/g)) { //detects all switches
            switchFound.push((i + 1)) // array starts from 0 but the line count starts from 1
        }
    })

    return switchFound
}

module.exports = findSwitch

/***/ }),

/***/ 3338:
/***/ ((module) => {

const findVariableDeclarations = (data, dataTypes, codeBlock) => {
    let result = []//{lineNumber: number, dataTyp: string, variableName: string}
    let start = codeBlock.start === -1 ? 0 : codeBlock.start
    let end = codeBlock.end === -1 ? data.length - 1  : codeBlock.end -1
    for (let i = start; i <= end; ++i) {
        for (let j = 0; j < dataTypes.length; ++j) {
            try {
                if (data[i].includes(`${dataTypes[j]}`)) {
                    let variable = findVariable(data[i], dataTypes[j])
                    if (variable !== undefined) {
                        result.push({
                            lineNumber: i + 1,
                            dataType: dataTypes[j],
                            variable
                        })
                    }
                    break; // in order to not detect multiple times the same datatype (unsigned int and int) //TODO fix if in one line are more than one declarations
                }
            } catch (e){}
        }
    }

    return result
}

const findVariable = (line, variableTyp) => {
    let result

    let varName = line.split(variableTyp)[1]
    result = varName.toString().replace(/\s/g, '').replace(/;/g, '').replace(/\*/g, '').split('=')[0]
    return result.includes('(') ? undefined : result
}

module.exports = findVariableDeclarations

/***/ }),

/***/ 8022:
/***/ ((module) => {

const functionArguments = (line, functionName) => {
    line = line.replace(/\s/g, '')
    let match = line.match(functionName)
    let split = line.split('').slice(match.index + functionName.length, line.length)
    return split
}

module.exports = functionArguments

/***/ }),

/***/ 7604:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const data = __nccwpck_require__(1842)

const findIssueByID = (issueNumber) => {
    let issue = data.Weakness_Catalog.Weaknesses.Weakness.filter(single => issueNumber.toString() === single.ID)
    if (issue.length === 0) {
        throw new Error("ID not found")
    }
    return issue
}

const reducer = (phase) => { // converts the phase to a string if its an array
    let result = ''
    if (Array.isArray(phase)) { //true or false
        result = phase
            .map(single => `${single}`)  // flats the structure of the array and shapes the output of a single mitigation
            .join(", ") // joins multiple mitigation's, if there are more than one
    } else {
        result = phase
    }
    return result
}

const getPotentialMitigations = (issueNumber) => {
    let result = []

    try {
        let issue = findIssueByID(issueNumber)
        let mitigations = issue[0].Potential_Mitigations.Mitigation
        if (mitigations.length !== undefined) { //true or false (for array or object)
            mitigations
                .map(single => result.push({phase: reducer(single.Phase), description: single.Description})) // flats the structure of the array and shapes the output of a single mitigation
        } else {
            result.push({phase: reducer(mitigations.Phase), description: mitigations.Description})
        }
    } catch (e) {
        result = e.message
    }
    return result
}

module.exports = getPotentialMitigations

/***/ }),

/***/ 1842:
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"Weakness_Catalog":{"xmlns":"http://cwe.mitre.org/cwe-6","xmlns:xhtml":"http://www.w3.org/1999/xhtml","xmlns:xsi":"http://www.w3.org/2001/XMLSchema-instance","Name":"VIEW LIST: CWE-658: Weaknesses in Software Written in C","Version":"4.2","Date":"2020-08-20","xsi:schemaLocation":"http://cwe.mitre.org/cwe-6 http://cwe.mitre.org/data/xsd/cwe_schema_v6.3.xsd","Weaknesses":{"Weakness":[{"ID":"119","Name":"Improper Restriction of Operations within the Bounds of a Memory Buffer","Abstraction":"Class","Structure":"Simple","Status":"Stable","Description":"The software performs operations on a memory buffer, but it can read from or write to a memory location that is outside of the intended boundary of the buffer.","Extended_Description":{"xhtml:p":["Certain languages allow direct addressing of memory locations and do not automatically ensure that these locations are valid for the memory buffer that is being referenced. This can cause read or write operations to be performed on memory locations that may be associated with other variables, data structures, or internal program data.","As a result, an attacker may be able to execute arbitrary code, alter the intended control flow, read sensitive information, or cause the system to crash."]},"Related_Weaknesses":{"Related_Weakness":[{"Nature":"ChildOf","CWE_ID":"118","View_ID":"1000","Ordinal":"Primary"},{"Nature":"ChildOf","CWE_ID":"20","View_ID":"700","Ordinal":"Primary"}]},"Applicable_Platforms":{"Language":[{"Name":"C","Prevalence":"Often"},{"Name":"C++","Prevalence":"Often"},{"Class":"Assembly","Prevalence":"Undetermined"}]},"Alternate_Terms":{"Alternate_Term":[{"Term":"Buffer Overflow","Description":"The \\"buffer overflow\\" term has many different meanings to different audiences.  From a CWE mapping perspective, this term should be avoided where possible. Some researchers, developers, and tools intend for it to mean \\"write past the end of a buffer,\\" whereas other use the same term to mean \\"any read or write outside the boundaries of a buffer, whether before the beginning of the buffer or after the end of the buffer.\\"  Still others using the same term could mean \\"any action after the end of a buffer, whether it is a read or write.\\" Since the term is commonly used for exploitation and for vulnerabilities, it further confuses things."},{"Term":"buffer overrun","Description":"Some prominent vendors and researchers use the term \\"buffer overrun,\\" but most people use \\"buffer overflow.\\" See the alternate term for \\"buffer overflow\\" for context."}]},"Modes_Of_Introduction":{"Introduction":[{"Phase":"Architecture and Design"},{"Phase":"Implementation"}]},"Likelihood_Of_Exploit":"High","Common_Consequences":{"Consequence":[{"Scope":["Integrity","Confidentiality","Availability"],"Impact":["Execute Unauthorized Code or Commands","Modify Memory"],"Note":"If the memory accessible by the attacker can be effectively controlled, it may be possible to execute arbitrary code, as with a standard buffer overflow. If the attacker can overwrite a pointer\'s worth of memory (usually 32 or 64 bits), they can redirect a function pointer to their own malicious code. Even when the attacker can only modify a single byte arbitrary code execution can be possible. Sometimes this is because the same problem can be exploited repeatedly to the same effect. Other times it is because the attacker can overwrite security-critical application-specific data -- such as a flag indicating whether the user is an administrator."},{"Scope":["Availability","Confidentiality"],"Impact":["Read Memory","DoS: Crash, Exit, or Restart","DoS: Resource Consumption (CPU)","DoS: Resource Consumption (Memory)"],"Note":"Out of bounds memory access will very likely result in the corruption of relevant memory, and perhaps instructions, possibly leading to a crash. Other attacks leading to lack of availability are possible, including putting the program into an infinite loop."},{"Scope":"Confidentiality","Impact":"Read Memory","Note":"In the case of an out-of-bounds read, the attacker may have access to sensitive information. If the sensitive information contains system details, such as the current buffers position in memory, this knowledge can be used to craft further attacks, possibly with more severe consequences."}]},"Detection_Methods":{"Detection_Method":[{"Detection_Method_ID":"DM-1","Method":"Automated Static Analysis","Description":{"xhtml:p":["This weakness can often be detected using automated static analysis tools. Many modern tools use data flow analysis or constraint-based techniques to minimize the number of false positives.","Automated static analysis generally does not account for environmental considerations when reporting out-of-bounds memory operations. This can make it difficult for users to determine which warnings should be investigated first. For example, an analysis tool might report buffer overflows that originate from command line arguments in a program that is not expected to run with setuid or other special privileges."]},"Effectiveness":"High","Effectiveness_Notes":"Detection techniques for buffer-related errors are more mature than for most other weakness types."},{"Detection_Method_ID":"DM-2","Method":"Automated Dynamic Analysis","Description":"This weakness can be detected using dynamic tools and techniques that interact with the software using large test suites with many diverse inputs, such as fuzz testing (fuzzing), robustness testing, and fault injection. The software\'s operation may slow down, but it should not become unstable, crash, or generate incorrect results."},{"Method":"Automated Static Analysis - Binary or Bytecode","Description":{"xhtml:p":"According to SOAR, the following detection techniques may be useful:","xhtml:div":{"style":"margin-left:10px;","xhtml:div":["Cost effective for partial coverage:",{"style":"margin-left:10px;","xhtml:ul":{"xhtml:li":["Binary / Bytecode Quality Analysis","Bytecode Weakness Analysis - including disassembler + source code weakness analysis","Binary Weakness Analysis - including disassembler + source code weakness analysis"]}}]}},"Effectiveness":"SOAR Partial"},{"Method":"Manual Static Analysis - Binary or Bytecode","Description":{"xhtml:p":"According to SOAR, the following detection techniques may be useful:","xhtml:div":{"style":"margin-left:10px;","xhtml:div":["Cost effective for partial coverage:",{"style":"margin-left:10px;","xhtml:ul":{"xhtml:li":"Binary / Bytecode disassembler - then use manual analysis for vulnerabilities & anomalies"}}]}},"Effectiveness":"SOAR Partial"},{"Method":"Dynamic Analysis with Automated Results Interpretation","Description":{"xhtml:p":"According to SOAR, the following detection techniques may be useful:","xhtml:div":{"style":"margin-left:10px;","xhtml:div":["Cost effective for partial coverage:",{"style":"margin-left:10px;","xhtml:ul":{"xhtml:li":["Web Application Scanner","Web Services Scanner","Database Scanners"]}}]}},"Effectiveness":"SOAR Partial"},{"Method":"Dynamic Analysis with Manual Results Interpretation","Description":{"xhtml:p":"According to SOAR, the following detection techniques may be useful:","xhtml:div":{"style":"margin-left:10px;","xhtml:div":["Cost effective for partial coverage:",{"style":"margin-left:10px;","xhtml:ul":{"xhtml:li":["Fuzz Tester","Framework-based Fuzzer"]}}]}},"Effectiveness":"SOAR Partial"},{"Method":"Manual Static Analysis - Source Code","Description":{"xhtml:p":"According to SOAR, the following detection techniques may be useful:","xhtml:div":{"style":"margin-left:10px;","xhtml:div":["Cost effective for partial coverage:",{"style":"margin-left:10px;","xhtml:ul":{"xhtml:li":["Focused Manual Spotcheck - Focused manual analysis of source","Manual Source Code Review (not inspections)"]}}]}},"Effectiveness":"SOAR Partial"},{"Method":"Automated Static Analysis - Source Code","Description":{"xhtml:p":"According to SOAR, the following detection techniques may be useful:","xhtml:div":{"style":"margin-left:10px;","xhtml:div":["Highly cost effective:",{"style":"margin-left:10px;","xhtml:ul":{"xhtml:li":["Source code Weakness Analyzer","Context-configured Source Code Weakness Analyzer"]}},"Cost effective for partial coverage:",{"style":"margin-left:10px;","xhtml:ul":{"xhtml:li":"Source Code Quality Analyzer"}}]}},"Effectiveness":"High"},{"Method":"Architecture or Design Review","Description":{"xhtml:p":"According to SOAR, the following detection techniques may be useful:","xhtml:div":{"style":"margin-left:10px;","xhtml:div":["Highly cost effective:",{"style":"margin-left:10px;","xhtml:ul":{"xhtml:li":"Formal Methods / Correct-By-Construction"}},"Cost effective for partial coverage:",{"style":"margin-left:10px;","xhtml:ul":{"xhtml:li":"Inspection (IEEE 1028 standard) (can apply to requirements, design, source code, etc.)"}}]}},"Effectiveness":"High"}]},"Potential_Mitigations":{"Mitigation":[{"Mitigation_ID":"MIT-3","Phase":"Requirements","Strategy":"Language Selection","Description":{"xhtml:p":["Use a language that does not allow this weakness to occur or provides constructs that make this weakness easier to avoid.","For example, many languages that perform their own memory management, such as Java and Perl, are not subject to buffer overflows. Other languages, such as Ada and C#, typically provide overflow protection, but the protection can be disabled by the programmer.","Be wary that a language\'s interface to native code may still be subject to overflows, even if the language itself is theoretically safe."]}},{"Mitigation_ID":"MIT-4.1","Phase":"Architecture and Design","Strategy":"Libraries or Frameworks","Description":{"xhtml:p":["Use a vetted library or framework that does not allow this weakness to occur or provides constructs that make this weakness easier to avoid.","Examples include the Safe C String Library (SafeStr) by Messier and Viega [REF-57], and the Strsafe.h library from Microsoft [REF-56]. These libraries provide safer versions of overflow-prone string-handling functions."]},"Effectiveness_Notes":"This is not a complete solution, since many buffer overflows are not related to strings."},{"Mitigation_ID":"MIT-10","Phase":"Build and Compilation","Strategy":"Compilation or Build Hardening","Description":{"xhtml:p":["Run or compile the software using features or extensions that automatically provide a protection mechanism that mitigates or eliminates buffer overflows.","For example, certain compilers and extensions provide automatic buffer overflow detection mechanisms that are built into the compiled code. Examples include the Microsoft Visual Studio /GS flag, Fedora/Red Hat FORTIFY_SOURCE GCC flag, StackGuard, and ProPolice."]},"Effectiveness":"Defense in Depth","Effectiveness_Notes":"This is not necessarily a complete solution, since these mechanisms can only detect certain types of overflows. In addition, an attack could still cause a denial of service, since the typical response is to exit the application."},{"Mitigation_ID":"MIT-9","Phase":"Implementation","Description":{"xhtml:p":"Consider adhering to the following rules when allocating and managing an application\'s memory:","xhtml:div":{"style":"margin-left:10px;","xhtml:ul":{"xhtml:li":["Double check that your buffer is as large as you specify.","When using functions that accept a number of bytes to copy, such as strncpy(), be aware that if the destination buffer size is equal to the source buffer size, it may not NULL-terminate the string.","Check buffer boundaries if accessing the buffer in a loop and make sure you are not in danger of writing past the allocated space.","If necessary, truncate all input strings to a reasonable length before passing them to the copy and concatenation functions."]}}}},{"Mitigation_ID":"MIT-11","Phase":"Operation","Strategy":"Environment Hardening","Description":{"xhtml:p":["Run or compile the software using features or extensions that randomly arrange the positions of a program\'s executable and libraries in memory. Because this makes the addresses unpredictable, it can prevent an attacker from reliably jumping to exploitable code.","Examples include Address Space Layout Randomization (ASLR) [REF-58] [REF-60] and Position-Independent Executables (PIE) [REF-64]."]},"Effectiveness":"Defense in Depth","Effectiveness_Notes":"This is not a complete solution. However, it forces the attacker to guess an unknown value that changes every program execution. In addition, an attack could still cause a denial of service, since the typical response is to exit the application."},{"Mitigation_ID":"MIT-12","Phase":"Operation","Strategy":"Environment Hardening","Description":"Use a CPU and operating system that offers Data Execution Protection (NX) or its equivalent [REF-60] [REF-61].","Effectiveness":"Defense in Depth","Effectiveness_Notes":"This is not a complete solution, since buffer overflows could be used to overwrite nearby variables to modify the software\'s state in dangerous ways. In addition, it cannot be used in cases in which self-modifying code is required. Finally, an attack could still cause a denial of service, since the typical response is to exit the application."},{"Mitigation_ID":"MIT-13","Phase":"Implementation","Description":"Replace unbounded copy functions with analogous functions that support length arguments, such as strcpy with strncpy. Create these if they are not available.","Effectiveness":"Moderate","Effectiveness_Notes":"This approach is still susceptible to calculation errors, including issues such as off-by-one errors (CWE-193) and incorrectly calculating buffer lengths (CWE-131)."}]},"Demonstrative_Examples":{"Demonstrative_Example":[{"Demonstrative_Example_ID":"DX-1","Intro_Text":"This example takes an IP address from a user, verifies that it is well formed and then looks up the hostname and copies it into a buffer.","Example_Code":{"Nature":"bad","Language":"C","xhtml:div":{"xhtml:div":{"style":"margin-left:10px;","xhtml:div":{"xhtml:br":[{},{},{},{},{},{},{},{},{},{}],"xhtml:i":"/*routine that ensures user_supplied_addr is in the right format for conversion */"}}}},"Body_Text":["This function allocates a buffer of 64 bytes to store the hostname, however there is no guarantee that the hostname will not be larger than 64 bytes. If an attacker specifies an address which resolves to a very large hostname, then we may overwrite sensitive data or even relinquish control flow to the attacker.","Note that this example also contains an unchecked return value (CWE-252) that can lead to a NULL pointer dereference (CWE-476)."]},{"Demonstrative_Example_ID":"DX-19","Intro_Text":"This example applies an encoding procedure to an input string and stores it into a buffer.","Example_Code":{"Nature":"bad","Language":"C","xhtml:div":{"xhtml:div":{"style":"margin-left:10px;","xhtml:div":{"xhtml:br":[{},{},{},{},{}],"xhtml:div":[{"style":"margin-left:10px;","$t":"die(\\"user string too long, die evil hacker!\\");"},{"style":"margin-left:10px;","xhtml:div":{"xhtml:div":[{"style":"margin-left:10px;","xhtml:br":[{},{},{},{}]},{"style":"margin-left:10px;","xhtml:div":{"xhtml:br":[{},{}],"xhtml:i":"/* encode to &lt; */"}}],"xhtml:br":[{},{}]}}]}}}},"Body_Text":"The programmer attempts to encode the ampersand character in the user-controlled string, however the length of the string is validated before the encoding procedure is applied. Furthermore, the programmer assumes encoding expansion will only expand a given character by a factor of 4, while the encoding of the ampersand expands by 5. As a result, when the encoding procedure expands the string it is possible to overflow the destination buffer if the attacker provides a string of many ampersands."},{"Demonstrative_Example_ID":"DX-90","Intro_Text":"The following example asks a user for an offset into an array to select an item.","Example_Code":{"Nature":"bad","Language":"C","xhtml:div":{"xhtml:br":{},"xhtml:div":{"style":"margin-left:10px;","xhtml:br":[{},{}]}}},"Body_Text":"The programmer allows the user to specify which element in the list to select, however an attacker can provide an out-of-bounds offset, resulting in a buffer over-read (CWE-126)."},{"Demonstrative_Example_ID":"DX-100","Intro_Text":"In the following code, the method retrieves a value from an array at a specific array index location that is given as an input parameter to the method","Example_Code":[{"Nature":"bad","Language":"C","xhtml:div":{"xhtml:div":{"style":"margin-left:10px;","xhtml:div":{"xhtml:br":[{},{},{},{},{},{},{},{},{},{},{},{}],"xhtml:i":["// check that the array index is less than the maximum","// length of the array","// if array index is invalid then output error message","// and return value indicating error"],"xhtml:div":[{"style":"margin-left:10px;","xhtml:div":{"xhtml:br":[{},{}],"xhtml:i":"// get the value at the specified index of the array"}},{"style":"margin-left:10px;","xhtml:br":{}}]}}}},{"Nature":"good","Language":"C","xhtml:div":{"xhtml:br":[{},{},{},{},{},{},{},{}],"xhtml:i":["// check that the array index is within the correct","// range of values for the array"]}}],"Body_Text":"However, this method only verifies that the given array index is less than the maximum length of the array but does not check for the minimum value (CWE-839). This will allow a negative value to be accepted as the input array index, which will result in a out of bounds read (CWE-125) and may allow access to sensitive memory. The input array index should be checked to verify that is within the maximum and minimum range required for the array (CWE-129). In this example the if statement should be modified to include a minimum range check, as shown below."},{"Intro_Text":"Windows provides the _mbs family of functions to perform various operations on multibyte strings. When these functions are passed a malformed multibyte string, such as a string containing a valid leading byte followed by a single null byte, they can read or write past the end of the string buffer causing a buffer overflow. The following functions all pose a risk of buffer overflow: _mbsinc _mbsdec _mbsncat _mbsncpy _mbsnextc _mbsnset _mbsrev _mbsset _mbsstr _mbstok _mbccpy _mbslen"}]},"Observed_Examples":{"Observed_Example":[{"Reference":"CVE-2009-2550","Description":"Classic stack-based buffer overflow in media player using a long entry in a playlist","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2009-2550"},{"Reference":"CVE-2009-2403","Description":"Heap-based buffer overflow in media player using a long entry in a playlist","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2009-2403"},{"Reference":"CVE-2009-0689","Description":"large precision value in a format string triggers overflow","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2009-0689"},{"Reference":"CVE-2009-0690","Description":"negative offset value leads to out-of-bounds read","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2009-0690"},{"Reference":"CVE-2009-1532","Description":"malformed inputs cause accesses of uninitialized or previously-deleted objects, leading to memory corruption","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2009-1532"},{"Reference":"CVE-2009-1528","Description":"chain: lack of synchronization leads to memory corruption","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2009-1528"},{"Reference":"CVE-2009-0558","Description":"attacker-controlled array index leads to code execution","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2009-0558"},{"Reference":"CVE-2009-0269","Description":"chain: -1 value from a function call was intended to indicate an error, but is used as an array index instead.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2009-0269"},{"Reference":"CVE-2009-0566","Description":"chain: incorrect calculations lead to incorrect pointer dereference and memory corruption","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2009-0566"},{"Reference":"CVE-2009-1350","Description":"product accepts crafted messages that lead to a dereference of an arbitrary pointer","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2009-1350"},{"Reference":"CVE-2009-0191","Description":"chain: malformed input causes dereference of uninitialized memory","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2009-0191"},{"Reference":"CVE-2008-4113","Description":"OS kernel trusts userland-supplied length value, allowing reading of sensitive information","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2008-4113"},{"Reference":"CVE-2003-0542","Description":"buffer overflow involving a regular expression with a large number of captures","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2003-0542"},{"Reference":"CVE-2017-1000121","Description":"chain: unchecked message size metadata allows integer overflow (CWE-190) leading to buffer overflow (CWE-119).","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2017-1000121"}]},"Affected_Resources":{"Affected_Resource":"Memory"},"Taxonomy_Mappings":{"Taxonomy_Mapping":[{"Taxonomy_Name":"OWASP Top Ten 2004","Entry_ID":"A5","Entry_Name":"Buffer Overflows","Mapping_Fit":"Exact"},{"Taxonomy_Name":"CERT C Secure Coding","Entry_ID":"ARR00-C","Entry_Name":"Understand how arrays work"},{"Taxonomy_Name":"CERT C Secure Coding","Entry_ID":"ARR30-C","Entry_Name":"Do not form or use out-of-bounds pointers or array subscripts","Mapping_Fit":"CWE More Abstract"},{"Taxonomy_Name":"CERT C Secure Coding","Entry_ID":"ARR38-C","Entry_Name":"Guarantee that library functions do not form invalid pointers","Mapping_Fit":"CWE More Abstract"},{"Taxonomy_Name":"CERT C Secure Coding","Entry_ID":"ENV01-C","Entry_Name":"Do not make assumptions about the size of an environment variable"},{"Taxonomy_Name":"CERT C Secure Coding","Entry_ID":"EXP39-C","Entry_Name":"Do not access a variable through a pointer of an incompatible type","Mapping_Fit":"Imprecise"},{"Taxonomy_Name":"CERT C Secure Coding","Entry_ID":"FIO37-C","Entry_Name":"Do not assume character data has been read"},{"Taxonomy_Name":"CERT C Secure Coding","Entry_ID":"STR31-C","Entry_Name":"Guarantee that storage for strings has sufficient space for character data and the null terminator","Mapping_Fit":"CWE More Abstract"},{"Taxonomy_Name":"CERT C Secure Coding","Entry_ID":"STR32-C","Entry_Name":"Do not pass a non-null-terminated character sequence to a library function that expects a string","Mapping_Fit":"CWE More Abstract"},{"Taxonomy_Name":"WASC","Entry_ID":"7","Entry_Name":"Buffer Overflow"}]},"Related_Attack_Patterns":{"Related_Attack_Pattern":[{"CAPEC_ID":"10"},{"CAPEC_ID":"100"},{"CAPEC_ID":"123"},{"CAPEC_ID":"14"},{"CAPEC_ID":"24"},{"CAPEC_ID":"42"},{"CAPEC_ID":"44"},{"CAPEC_ID":"45"},{"CAPEC_ID":"46"},{"CAPEC_ID":"47"},{"CAPEC_ID":"8"},{"CAPEC_ID":"9"}]},"References":{"Reference":[{"External_Reference_ID":"REF-1029"},{"External_Reference_ID":"REF-7","Section":"Chapter 5, \\"Public Enemy #1: The Buffer Overrun\\" Page 127; Chapter 14, \\"Prevent I18N Buffer Overruns\\" Page 441"},{"External_Reference_ID":"REF-56"},{"External_Reference_ID":"REF-57"},{"External_Reference_ID":"REF-58"},{"External_Reference_ID":"REF-59"},{"External_Reference_ID":"REF-60"},{"External_Reference_ID":"REF-61"},{"External_Reference_ID":"REF-62","Section":"Chapter 5, \\"Memory Corruption\\", Page 167"},{"External_Reference_ID":"REF-64"}]},"Notes":{"Note":{"Type":"Applicable Platform","xhtml:p":"It is possible in any programming languages without memory management support to attempt an operation outside of the bounds of a memory buffer, but the consequences will vary widely depending on the language, platform, and chip architecture."}},"Content_History":{"Submission":{"Submission_Name":"PLOVER","Submission_Date":"2006-07-19"},"Modification":[{"Modification_Name":"Eric Dalci","Modification_Organization":"Cigital","Modification_Date":"2008-07-01","Modification_Comment":"updated Time_of_Introduction"},{"Modification_Organization":"Veracode","Modification_Date":"2008-08-15","Modification_Comment":"Suggested OWASP Top Ten 2004 mapping"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2008-09-08","Modification_Comment":"updated Description, Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2008-10-14","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2008-11-24","Modification_Comment":"updated Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2009-01-12","Modification_Comment":"updated Applicable_Platforms, Common_Consequences, Demonstrative_Examples, Likelihood_of_Exploit, Name, Potential_Mitigations, References, Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2009-03-10","Modification_Comment":"updated Potential_Mitigations"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2009-05-27","Modification_Comment":"updated Demonstrative_Examples"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2009-07-27","Modification_Comment":"updated Observed_Examples"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2009-10-29","Modification_Comment":"updated Applicable_Platforms, Common_Consequences, Demonstrative_Examples, Description, Relationships, Time_of_Introduction"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2009-12-28","Modification_Comment":"updated Common_Consequences, Demonstrative_Examples, Detection_Factors, Observed_Examples"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2010-02-16","Modification_Comment":"updated Alternate_Terms, Applicable_Platforms, Demonstrative_Examples, Detection_Factors, Potential_Mitigations, References, Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2010-06-21","Modification_Comment":"updated Potential_Mitigations"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2010-09-27","Modification_Comment":"updated Potential_Mitigations, Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2010-12-13","Modification_Comment":"updated Name"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-03-29","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-06-01","Modification_Comment":"updated Common_Consequences, Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-09-13","Modification_Comment":"updated Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2012-05-11","Modification_Comment":"updated Demonstrative_Examples, Potential_Mitigations, References, Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2012-10-30","Modification_Comment":"updated Potential_Mitigations"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2013-02-21","Modification_Comment":"updated Demonstrative_Examples"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2014-02-18","Modification_Comment":"updated Potential_Mitigations, References"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2014-07-30","Modification_Comment":"updated Detection_Factors, Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2015-12-07","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2017-01-19","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2017-05-03","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2017-11-08","Modification_Comment":"updated Applicable_Platforms, Common_Consequences, Demonstrative_Examples, Observed_Examples, References, Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2018-03-27","Modification_Comment":"updated References"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2019-01-03","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2019-06-20","Modification_Comment":"updated Related_Attack_Patterns, Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2019-09-19","Modification_Comment":"updated References, Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-02-24","Modification_Comment":"updated Relationships, Taxonomy_Mappings, Time_of_Introduction"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-06-25","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-08-20","Modification_Comment":"updated Alternate_Terms, Relationships"}],"Previous_Entry_Name":[{"Date":"2008-04-11","$t":"Buffer Errors"},{"Date":"2009-01-12","$t":"Failure to Constrain Operations within the Bounds of an Allocated Memory Buffer"},{"Date":"2010-12-13","$t":"Failure to Constrain Operations within the Bounds of a Memory Buffer"}]}},{"ID":"120","Name":"Buffer Copy without Checking Size of Input (\'Classic Buffer Overflow\')","Abstraction":"Base","Structure":"Simple","Status":"Incomplete","Description":"The program copies an input buffer to an output buffer without verifying that the size of the input buffer is less than the size of the output buffer, leading to a buffer overflow.","Extended_Description":"A buffer overflow condition exists when a program attempts to put more data in a buffer than it can hold, or when a program attempts to put data in a memory area outside of the boundaries of a buffer. The simplest type of error, and the most common cause of buffer overflows, is the \\"classic\\" case in which the program copies the buffer without restricting how much is copied. Other variants exist, but the existence of a classic overflow strongly suggests that the programmer is not considering even the most basic of security protections.","Related_Weaknesses":{"Related_Weakness":[{"Nature":"ChildOf","CWE_ID":"119","View_ID":"1000","Ordinal":"Primary"},{"Nature":"ChildOf","CWE_ID":"119","View_ID":"1003","Ordinal":"Primary"},{"Nature":"ChildOf","CWE_ID":"119","View_ID":"1305","Ordinal":"Primary"},{"Nature":"CanPrecede","CWE_ID":"123","View_ID":"1000"},{"Nature":"ChildOf","CWE_ID":"20","View_ID":"700","Ordinal":"Primary"}]},"Weakness_Ordinalities":{"Weakness_Ordinality":[{"Ordinality":"Resultant"},{"Ordinality":"Primary"}]},"Applicable_Platforms":{"Language":[{"Name":"C","Prevalence":"Undetermined"},{"Name":"C++","Prevalence":"Undetermined"},{"Class":"Assembly","Prevalence":"Undetermined"}]},"Alternate_Terms":{"Alternate_Term":[{"Term":"Classic Buffer Overflow","Description":"This term was frequently used by vulnerability researchers during approximately 1995 to 2005 to differentiate buffer copies without length checks (which had been known about for decades) from other emerging weaknesses that still involved invalid accesses of buffers, as vulnerability researchers began to develop advanced exploitation techniques."},{"Term":"Unbounded Transfer"}]},"Modes_Of_Introduction":{"Introduction":{"Phase":"Implementation"}},"Likelihood_Of_Exploit":"High","Common_Consequences":{"Consequence":[{"Scope":["Integrity","Confidentiality","Availability"],"Impact":["Modify Memory","Execute Unauthorized Code or Commands"],"Note":"Buffer overflows often can be used to execute arbitrary code, which is usually outside the scope of a program\'s implicit security policy. This can often be used to subvert any other security service."},{"Scope":"Availability","Impact":["Modify Memory","DoS: Crash, Exit, or Restart","DoS: Resource Consumption (CPU)"],"Note":"Buffer overflows generally lead to crashes. Other attacks leading to lack of availability are possible, including putting the program into an infinite loop."}]},"Detection_Methods":{"Detection_Method":[{"Detection_Method_ID":"DM-1","Method":"Automated Static Analysis","Description":{"xhtml:p":["This weakness can often be detected using automated static analysis tools. Many modern tools use data flow analysis or constraint-based techniques to minimize the number of false positives.","Automated static analysis generally does not account for environmental considerations when reporting out-of-bounds memory operations. This can make it difficult for users to determine which warnings should be investigated first. For example, an analysis tool might report buffer overflows that originate from command line arguments in a program that is not expected to run with setuid or other special privileges."]},"Effectiveness":"High","Effectiveness_Notes":"Detection techniques for buffer-related errors are more mature than for most other weakness types."},{"Detection_Method_ID":"DM-2","Method":"Automated Dynamic Analysis","Description":"This weakness can be detected using dynamic tools and techniques that interact with the software using large test suites with many diverse inputs, such as fuzz testing (fuzzing), robustness testing, and fault injection. The software\'s operation may slow down, but it should not become unstable, crash, or generate incorrect results."},{"Detection_Method_ID":"DM-9","Method":"Manual Analysis","Description":"Manual analysis can be useful for finding this weakness, but it might not achieve desired code coverage within limited time constraints. This becomes difficult for weaknesses that must be considered for all inputs, since the attack surface can be too large."},{"Method":"Automated Static Analysis - Binary or Bytecode","Description":{"xhtml:p":"According to SOAR, the following detection techniques may be useful:","xhtml:div":{"style":"margin-left:10px;","xhtml:div":["Highly cost effective:",{"style":"margin-left:10px;","xhtml:ul":{"xhtml:li":["Bytecode Weakness Analysis - including disassembler + source code weakness analysis","Binary Weakness Analysis - including disassembler + source code weakness analysis"]}}]}},"Effectiveness":"High"},{"Method":"Manual Static Analysis - Binary or Bytecode","Description":{"xhtml:p":"According to SOAR, the following detection techniques may be useful:","xhtml:div":{"style":"margin-left:10px;","xhtml:div":["Cost effective for partial coverage:",{"style":"margin-left:10px;","xhtml:ul":{"xhtml:li":"Binary / Bytecode disassembler - then use manual analysis for vulnerabilities & anomalies"}}]}},"Effectiveness":"SOAR Partial"},{"Method":"Dynamic Analysis with Automated Results Interpretation","Description":{"xhtml:p":"According to SOAR, the following detection techniques may be useful:","xhtml:div":{"style":"margin-left:10px;","xhtml:div":["Cost effective for partial coverage:",{"style":"margin-left:10px;","xhtml:ul":{"xhtml:li":["Web Application Scanner","Web Services Scanner","Database Scanners"]}}]}},"Effectiveness":"SOAR Partial"},{"Method":"Dynamic Analysis with Manual Results Interpretation","Description":{"xhtml:p":"According to SOAR, the following detection techniques may be useful:","xhtml:div":{"style":"margin-left:10px;","xhtml:div":["Cost effective for partial coverage:",{"style":"margin-left:10px;","xhtml:ul":{"xhtml:li":["Fuzz Tester","Framework-based Fuzzer"]}}]}},"Effectiveness":"SOAR Partial"},{"Method":"Manual Static Analysis - Source Code","Description":{"xhtml:p":"According to SOAR, the following detection techniques may be useful:","xhtml:div":{"style":"margin-left:10px;","xhtml:div":["Cost effective for partial coverage:",{"style":"margin-left:10px;","xhtml:ul":{"xhtml:li":["Focused Manual Spotcheck - Focused manual analysis of source","Manual Source Code Review (not inspections)"]}}]}},"Effectiveness":"SOAR Partial"},{"Method":"Automated Static Analysis - Source Code","Description":{"xhtml:p":"According to SOAR, the following detection techniques may be useful:","xhtml:div":{"style":"margin-left:10px;","xhtml:div":["Highly cost effective:",{"style":"margin-left:10px;","xhtml:ul":{"xhtml:li":["Source code Weakness Analyzer","Context-configured Source Code Weakness Analyzer"]}}]}},"Effectiveness":"High"},{"Method":"Architecture or Design Review","Description":{"xhtml:p":"According to SOAR, the following detection techniques may be useful:","xhtml:div":{"style":"margin-left:10px;","xhtml:div":["Highly cost effective:",{"style":"margin-left:10px;","xhtml:ul":{"xhtml:li":"Formal Methods / Correct-By-Construction"}},"Cost effective for partial coverage:",{"style":"margin-left:10px;","xhtml:ul":{"xhtml:li":"Inspection (IEEE 1028 standard) (can apply to requirements, design, source code, etc.)"}}]}},"Effectiveness":"High"}]},"Potential_Mitigations":{"Mitigation":[{"Mitigation_ID":"MIT-3","Phase":"Requirements","Strategy":"Language Selection","Description":{"xhtml:p":["Use a language that does not allow this weakness to occur or provides constructs that make this weakness easier to avoid.","For example, many languages that perform their own memory management, such as Java and Perl, are not subject to buffer overflows. Other languages, such as Ada and C#, typically provide overflow protection, but the protection can be disabled by the programmer.","Be wary that a language\'s interface to native code may still be subject to overflows, even if the language itself is theoretically safe."]}},{"Mitigation_ID":"MIT-4.1","Phase":"Architecture and Design","Strategy":"Libraries or Frameworks","Description":{"xhtml:p":["Use a vetted library or framework that does not allow this weakness to occur or provides constructs that make this weakness easier to avoid.","Examples include the Safe C String Library (SafeStr) by Messier and Viega [REF-57], and the Strsafe.h library from Microsoft [REF-56]. These libraries provide safer versions of overflow-prone string-handling functions."]},"Effectiveness_Notes":"This is not a complete solution, since many buffer overflows are not related to strings."},{"Mitigation_ID":"MIT-10","Phase":"Build and Compilation","Strategy":"Compilation or Build Hardening","Description":{"xhtml:p":["Run or compile the software using features or extensions that automatically provide a protection mechanism that mitigates or eliminates buffer overflows.","For example, certain compilers and extensions provide automatic buffer overflow detection mechanisms that are built into the compiled code. Examples include the Microsoft Visual Studio /GS flag, Fedora/Red Hat FORTIFY_SOURCE GCC flag, StackGuard, and ProPolice."]},"Effectiveness":"Defense in Depth","Effectiveness_Notes":"This is not necessarily a complete solution, since these mechanisms can only detect certain types of overflows. In addition, an attack could still cause a denial of service, since the typical response is to exit the application."},{"Mitigation_ID":"MIT-9","Phase":"Implementation","Description":{"xhtml:p":"Consider adhering to the following rules when allocating and managing an application\'s memory:","xhtml:div":{"style":"margin-left:10px;","xhtml:ul":{"xhtml:li":["Double check that your buffer is as large as you specify.","When using functions that accept a number of bytes to copy, such as strncpy(), be aware that if the destination buffer size is equal to the source buffer size, it may not NULL-terminate the string.","Check buffer boundaries if accessing the buffer in a loop and make sure you are not in danger of writing past the allocated space.","If necessary, truncate all input strings to a reasonable length before passing them to the copy and concatenation functions."]}}}},{"Mitigation_ID":"MIT-5","Phase":"Implementation","Strategy":"Input Validation","Description":{"xhtml:p":["Assume all input is malicious. Use an \\"accept known good\\" input validation strategy, i.e., use a list of acceptable inputs that strictly conform to specifications. Reject any input that does not strictly conform to specifications, or transform it into something that does.","When performing input validation, consider all potentially relevant properties, including length, type of input, the full range of acceptable values, missing or extra inputs, syntax, consistency across related fields, and conformance to business rules. As an example of business rule logic, \\"boat\\" may be syntactically valid because it only contains alphanumeric characters, but it is not valid if the input is only expected to contain colors such as \\"red\\" or \\"blue.\\"","Do not rely exclusively on looking for malicious or malformed inputs.  This is likely to miss at least one undesirable input, especially if the code\'s environment changes. This can give attackers enough room to bypass the intended validation. However, denylists can be useful for detecting potential attacks or determining which inputs are so malformed that they should be rejected outright."]}},{"Mitigation_ID":"MIT-15","Phase":"Architecture and Design","Description":"For any security checks that are performed on the client side, ensure that these checks are duplicated on the server side, in order to avoid CWE-602. Attackers can bypass the client-side checks by modifying values after the checks have been performed, or by changing the client to remove the client-side checks entirely. Then, these modified values would be submitted to the server."},{"Mitigation_ID":"MIT-11","Phase":"Operation","Strategy":"Environment Hardening","Description":{"xhtml:p":["Run or compile the software using features or extensions that randomly arrange the positions of a program\'s executable and libraries in memory. Because this makes the addresses unpredictable, it can prevent an attacker from reliably jumping to exploitable code.","Examples include Address Space Layout Randomization (ASLR) [REF-58] [REF-60] and Position-Independent Executables (PIE) [REF-64]."]},"Effectiveness":"Defense in Depth","Effectiveness_Notes":"This is not a complete solution. However, it forces the attacker to guess an unknown value that changes every program execution. In addition, an attack could still cause a denial of service, since the typical response is to exit the application."},{"Mitigation_ID":"MIT-12","Phase":"Operation","Strategy":"Environment Hardening","Description":"Use a CPU and operating system that offers Data Execution Protection (NX) or its equivalent [REF-60] [REF-61].","Effectiveness":"Defense in Depth","Effectiveness_Notes":"This is not a complete solution, since buffer overflows could be used to overwrite nearby variables to modify the software\'s state in dangerous ways. In addition, it cannot be used in cases in which self-modifying code is required. Finally, an attack could still cause a denial of service, since the typical response is to exit the application."},{"Phase":["Build and Compilation","Operation"],"Description":"Most mitigating technologies at the compiler or OS level to date address only a subset of buffer overflow problems and rarely provide complete protection against even that subset. It is good practice to implement strategies to increase the workload of an attacker, such as leaving the attacker to guess an unknown value that changes every program execution."},{"Mitigation_ID":"MIT-13","Phase":"Implementation","Description":"Replace unbounded copy functions with analogous functions that support length arguments, such as strcpy with strncpy. Create these if they are not available.","Effectiveness":"Moderate","Effectiveness_Notes":"This approach is still susceptible to calculation errors, including issues such as off-by-one errors (CWE-193) and incorrectly calculating buffer lengths (CWE-131)."},{"Mitigation_ID":"MIT-21","Phase":"Architecture and Design","Strategy":"Enforcement by Conversion","Description":"When the set of acceptable objects, such as filenames or URLs, is limited or known, create a mapping from a set of fixed input values (such as numeric IDs) to the actual filenames or URLs, and reject all other inputs."},{"Mitigation_ID":"MIT-17","Phase":["Architecture and Design","Operation"],"Strategy":"Environment Hardening","Description":"Run your code using the lowest privileges that are required to accomplish the necessary tasks [REF-76]. If possible, create isolated accounts with limited privileges that are only used for a single task. That way, a successful attack will not immediately give the attacker access to the rest of the software or its environment. For example, database applications rarely need to run as the database administrator, especially in day-to-day operations."},{"Mitigation_ID":"MIT-22","Phase":["Architecture and Design","Operation"],"Strategy":"Sandbox or Jail","Description":{"xhtml:p":["Run the code in a \\"jail\\" or similar sandbox environment that enforces strict boundaries between the process and the operating system. This may effectively restrict which files can be accessed in a particular directory or which commands can be executed by the software.","OS-level examples include the Unix chroot jail, AppArmor, and SELinux. In general, managed code may provide some protection. For example, java.io.FilePermission in the Java SecurityManager allows the software to specify restrictions on file operations.","This may not be a feasible solution, and it only limits the impact to the operating system; the rest of the application may still be subject to compromise.","Be careful to avoid CWE-243 and other weaknesses related to jails."]},"Effectiveness":"Limited","Effectiveness_Notes":"The effectiveness of this mitigation depends on the prevention capabilities of the specific sandbox or jail being used and might only help to reduce the scope of an attack, such as restricting the attacker to certain system calls or limiting the portion of the file system that can be accessed."}]},"Demonstrative_Examples":{"Demonstrative_Example":[{"Intro_Text":"The following code asks the user to enter their last name and then attempts to store the value entered in the last_name array.","Example_Code":{"Nature":"bad","Language":"C","xhtml:div":{"xhtml:br":[{},{}]}},"Body_Text":"The problem with the code above is that it does not restrict or limit the size of the name entered by the user. If the user enters \\"Very_very_long_last_name\\" which is 24 characters long, then a buffer overflow will occur since the array can only hold 20 characters total."},{"Demonstrative_Example_ID":"DX-6","Intro_Text":"The following code attempts to create a local copy of a buffer to perform some manipulations to the data.","Example_Code":{"Nature":"bad","Language":"C","xhtml:div":{"xhtml:div":{"style":"margin-left:10px;","xhtml:br":[{},{}]}}},"Body_Text":"However, the programmer does not ensure that the size of the data pointed to by string will fit in the local buffer and blindly copies the data with the potentially dangerous strcpy() function. This may result in a buffer overflow condition if an attacker can influence the contents of the string parameter."},{"Demonstrative_Example_ID":"DX-5","Intro_Text":"The excerpt below calls the gets() function in C, which is inherently unsafe.","Example_Code":{"Nature":"bad","Language":"C","xhtml:div":{"xhtml:div":{"style":"margin-left:10px;","xhtml:br":[{},{},{}]}}},"Body_Text":"However, the programmer uses the function gets() which is inherently unsafe because it blindly copies all input from STDIN to the buffer without restricting how much is copied. This allows the user to provide a string that is larger than the buffer size, resulting in an overflow condition."},{"Intro_Text":"In the following example, a server accepts connections from a client and processes the client request. After accepting a client connection, the program will obtain client information using the gethostbyaddr method, copy the hostname of the client that connected to a local variable and output the hostname of the client to a log file.","Example_Code":{"Nature":"bad","Language":"C","xhtml:div":{"xhtml:div":{"style":"margin-left:10px;","xhtml:div":{"xhtml:br":[{},{},{},{},{},{},{},{},{}],"xhtml:div":{"style":"margin-left:10px;","xhtml:div":{"xhtml:br":[{},{},{},{}],"xhtml:div":{"style":"margin-left:10px;","xhtml:div":{"xhtml:br":[{},{},{},{},{},{}]}}}}}},"xhtml:br":{}}},"Body_Text":"However, the hostname of the client that connected may be longer than the allocated size for the local hostname variable. This will result in a buffer overflow when copying the client hostname to the local variable using the strcpy method."}]},"Observed_Examples":{"Observed_Example":[{"Reference":"CVE-2000-1094","Description":"buffer overflow using command with long argument","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2000-1094"},{"Reference":"CVE-1999-0046","Description":"buffer overflow in local program using long environment variable","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-1999-0046"},{"Reference":"CVE-2002-1337","Description":"buffer overflow in comment characters, when product increments a counter for a \\">\\" but does not decrement for \\"<\\"","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2002-1337"},{"Reference":"CVE-2003-0595","Description":"By replacing a valid cookie value with an extremely long string of characters, an attacker may overflow the application\'s buffers.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2003-0595"},{"Reference":"CVE-2001-0191","Description":"By replacing a valid cookie value with an extremely long string of characters, an attacker may overflow the application\'s buffers.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2001-0191"}]},"Functional_Areas":{"Functional_Area":"Memory Management"},"Affected_Resources":{"Affected_Resource":"Memory"},"Taxonomy_Mappings":{"Taxonomy_Mapping":[{"Taxonomy_Name":"PLOVER","Entry_Name":"Unbounded Transfer (\'classic overflow\')"},{"Taxonomy_Name":"7 Pernicious Kingdoms","Entry_Name":"Buffer Overflow"},{"Taxonomy_Name":"CLASP","Entry_Name":"Buffer overflow"},{"Taxonomy_Name":"OWASP Top Ten 2004","Entry_ID":"A1","Entry_Name":"Unvalidated Input","Mapping_Fit":"CWE More Specific"},{"Taxonomy_Name":"OWASP Top Ten 2004","Entry_ID":"A5","Entry_Name":"Buffer Overflows","Mapping_Fit":"CWE More Specific"},{"Taxonomy_Name":"CERT C Secure Coding","Entry_ID":"STR31-C","Entry_Name":"Guarantee that storage for strings has sufficient space for character data and the null terminator","Mapping_Fit":"Exact"},{"Taxonomy_Name":"WASC","Entry_ID":"7","Entry_Name":"Buffer Overflow"},{"Taxonomy_Name":"Software Fault Patterns","Entry_ID":"SFP8","Entry_Name":"Faulty Buffer Access"},{"Taxonomy_Name":"OMG ASCSM","Entry_ID":"ASCSM-CWE-120"},{"Taxonomy_Name":"OMG ASCRM","Entry_ID":"ASCRM-CWE-120"}]},"Related_Attack_Patterns":{"Related_Attack_Pattern":[{"CAPEC_ID":"10"},{"CAPEC_ID":"100"},{"CAPEC_ID":"14"},{"CAPEC_ID":"24"},{"CAPEC_ID":"42"},{"CAPEC_ID":"44"},{"CAPEC_ID":"45"},{"CAPEC_ID":"46"},{"CAPEC_ID":"47"},{"CAPEC_ID":"67"},{"CAPEC_ID":"8"},{"CAPEC_ID":"9"},{"CAPEC_ID":"92"}]},"References":{"Reference":[{"External_Reference_ID":"REF-7","Section":"Chapter 5, \\"Public Enemy #1: The Buffer Overrun\\" Page 127"},{"External_Reference_ID":"REF-44","Section":"\\"Sin 5: Buffer Overruns.\\" Page 89"},{"External_Reference_ID":"REF-56"},{"External_Reference_ID":"REF-57"},{"External_Reference_ID":"REF-58"},{"External_Reference_ID":"REF-59"},{"External_Reference_ID":"REF-60"},{"External_Reference_ID":"REF-74"},{"External_Reference_ID":"REF-61"},{"External_Reference_ID":"REF-76"},{"External_Reference_ID":"REF-62","Section":"Chapter 3, \\"Nonexecutable Stack\\", Page 76"},{"External_Reference_ID":"REF-62","Section":"Chapter 5, \\"Protection Mechanisms\\", Page 189"},{"External_Reference_ID":"REF-62","Section":"Chapter 8, \\"C String Handling\\", Page 388"},{"External_Reference_ID":"REF-64"},{"External_Reference_ID":"REF-961","Section":"ASCRM-CWE-120"},{"External_Reference_ID":"REF-962","Section":"ASCSM-CWE-120"}]},"Notes":{"Note":[{"Type":"Relationship","$t":"At the code level, stack-based and heap-based overflows do not differ significantly, so there usually is not a need to distinguish them. From the attacker perspective, they can be quite different, since different techniques are required to exploit them."},{"Type":"Terminology","$t":"Many issues that are now called \\"buffer overflows\\" are substantively different than the \\"classic\\" overflow, including entirely different bug types that rely on overflow exploit techniques, such as integer signedness errors, integer overflows, and format string bugs. This imprecise terminology can make it difficult to determine which variant is being reported."}]},"Content_History":{"Submission":{"Submission_Name":"PLOVER","Submission_Date":"2006-07-19"},"Modification":[{"Modification_Name":"Eric Dalci","Modification_Organization":"Cigital","Modification_Date":"2008-07-01","Modification_Comment":"updated Time_of_Introduction"},{"Modification_Organization":"KDM Analytics","Modification_Date":"2008-08-01","Modification_Comment":"added/updated white box definitions"},{"Modification_Organization":"Veracode","Modification_Date":"2008-08-15","Modification_Comment":"Suggested OWASP Top Ten 2004 mapping"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2008-09-08","Modification_Comment":"updated Alternate_Terms, Applicable_Platforms, Common_Consequences, Relationships, Observed_Example, Other_Notes, Taxonomy_Mappings, Weakness_Ordinalities"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2008-10-10","Modification_Comment":"Changed name and description to more clearly emphasize the \\"classic\\" nature of the overflow."},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2008-10-14","Modification_Comment":"updated Alternate_Terms, Description, Name, Other_Notes, Terminology_Notes"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2008-11-24","Modification_Comment":"updated Other_Notes, Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2009-01-12","Modification_Comment":"updated Common_Consequences, Other_Notes, Potential_Mitigations, References, Relationship_Notes, Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2009-07-27","Modification_Comment":"updated Other_Notes, Potential_Mitigations, Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2009-10-29","Modification_Comment":"updated Common_Consequences, Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2010-02-16","Modification_Comment":"updated Applicable_Platforms, Common_Consequences, Demonstrative_Examples, Detection_Factors, Potential_Mitigations, References, Related_Attack_Patterns, Relationships, Taxonomy_Mappings, Time_of_Introduction, Type"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2010-04-05","Modification_Comment":"updated Demonstrative_Examples, Related_Attack_Patterns"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2010-06-21","Modification_Comment":"updated Common_Consequences, Potential_Mitigations, References"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2010-09-27","Modification_Comment":"updated Potential_Mitigations"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2010-12-13","Modification_Comment":"updated Potential_Mitigations"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-03-29","Modification_Comment":"updated Demonstrative_Examples, Description"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-06-01","Modification_Comment":"updated Common_Consequences"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-06-27","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-09-13","Modification_Comment":"updated Potential_Mitigations, References, Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2012-05-11","Modification_Comment":"updated References, Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2012-10-30","Modification_Comment":"updated Potential_Mitigations"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2014-02-18","Modification_Comment":"updated Potential_Mitigations, References"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2014-07-30","Modification_Comment":"updated Detection_Factors, Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2017-11-08","Modification_Comment":"updated Applicable_Platforms, Causal_Nature, Demonstrative_Examples, Likelihood_of_Exploit, References, Relationships, Taxonomy_Mappings, White_Box_Definitions"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2018-03-27","Modification_Comment":"updated References"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2019-01-03","Modification_Comment":"updated References, Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2019-06-20","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-02-24","Modification_Comment":"updated Potential_Mitigations, Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-06-25","Modification_Comment":"updated Common_Consequences, Potential_Mitigations"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-08-20","Modification_Comment":"updated Alternate_Terms, Relationships"}],"Previous_Entry_Name":{"Date":"2008-10-14","$t":"Unbounded Transfer (\'Classic Buffer Overflow\')"}}},{"ID":"121","Name":"Stack-based Buffer Overflow","Abstraction":"Variant","Structure":"Simple","Status":"Draft","Description":"A stack-based buffer overflow condition is a condition where the buffer being overwritten is allocated on the stack (i.e., is a local variable or, rarely, a parameter to a function).","Related_Weaknesses":{"Related_Weakness":[{"Nature":"ChildOf","CWE_ID":"788","View_ID":"1000","Ordinal":"Primary"},{"Nature":"ChildOf","CWE_ID":"787","View_ID":"1000"}]},"Weakness_Ordinalities":{"Weakness_Ordinality":{"Ordinality":"Primary"}},"Applicable_Platforms":{"Language":[{"Name":"C","Prevalence":"Undetermined"},{"Name":"C++","Prevalence":"Undetermined"}]},"Background_Details":{"Background_Detail":"There are generally several security-critical data on an execution stack that can lead to arbitrary code execution. The most prominent is the stored return address, the memory address at which execution should continue once the current function is finished executing. The attacker can overwrite this value with some memory address to which the attacker also has write access, into which they place arbitrary code to be run with the full privileges of the vulnerable program. Alternately, the attacker can supply the address of an important call, for instance the POSIX system() call, leaving arguments to the call on the stack. This is often called a return into libc exploit, since the attacker generally forces the program to jump at return time into an interesting routine in the C standard library (libc). Other important data commonly on the stack include the stack pointer and frame pointer, two values that indicate offsets for computing memory addresses. Modifying those values can often be leveraged into a \\"write-what-where\\" condition."},"Alternate_Terms":{"Alternate_Term":{"Term":"Stack Overflow","Description":"\\"Stack Overflow\\" is often used to mean the same thing as stack-based buffer overflow, however it is also used on occasion to mean stack exhaustion, usually a result from an excessively recursive function call. Due to the ambiguity of the term, use of stack overflow to describe either circumstance is discouraged."}},"Modes_Of_Introduction":{"Introduction":[{"Phase":"Architecture and Design"},{"Phase":"Implementation"}]},"Likelihood_Of_Exploit":"High","Common_Consequences":{"Consequence":[{"Scope":"Availability","Impact":["Modify Memory","DoS: Crash, Exit, or Restart","DoS: Resource Consumption (CPU)","DoS: Resource Consumption (Memory)"],"Note":"Buffer overflows generally lead to crashes. Other attacks leading to lack of availability are possible, including putting the program into an infinite loop."},{"Scope":["Integrity","Confidentiality","Availability","Access Control"],"Impact":["Modify Memory","Execute Unauthorized Code or Commands","Bypass Protection Mechanism"],"Note":"Buffer overflows often can be used to execute arbitrary code, which is usually outside the scope of a program\'s implicit security policy."},{"Scope":["Integrity","Confidentiality","Availability","Access Control","Other"],"Impact":["Modify Memory","Execute Unauthorized Code or Commands","Bypass Protection Mechanism","Other"],"Note":"When the consequence is arbitrary code execution, this can often be used to subvert any other security service."}]},"Potential_Mitigations":{"Mitigation":[{"Mitigation_ID":"MIT-10","Phase":"Build and Compilation","Strategy":"Compilation or Build Hardening","Description":{"xhtml:p":["Run or compile the software using features or extensions that automatically provide a protection mechanism that mitigates or eliminates buffer overflows.","For example, certain compilers and extensions provide automatic buffer overflow detection mechanisms that are built into the compiled code. Examples include the Microsoft Visual Studio /GS flag, Fedora/Red Hat FORTIFY_SOURCE GCC flag, StackGuard, and ProPolice."]},"Effectiveness":"Defense in Depth","Effectiveness_Notes":"This is not necessarily a complete solution, since these mechanisms can only detect certain types of overflows. In addition, an attack could still cause a denial of service, since the typical response is to exit the application."},{"Phase":"Architecture and Design","Description":"Use an abstraction library to abstract away risky APIs. Not a complete solution."},{"Phase":"Build and Compilation","Description":"Compiler-based canary mechanisms such as StackGuard, ProPolice and the Microsoft Visual Studio /GS flag. Unless this provides automatic bounds checking, it is not a complete solution."},{"Phase":"Implementation","Description":"Implement and perform bounds checking on input."},{"Phase":"Implementation","Description":"Do not use dangerous functions such as gets. Use safer, equivalent functions which check for boundary errors."},{"Phase":"Operation","Description":"Use OS-level preventative functionality, such as ASLR. This is not a complete solution."}]},"Demonstrative_Examples":{"Demonstrative_Example":[{"Demonstrative_Example_ID":"DX-89","Intro_Text":"While buffer overflow examples can be rather complex, it is possible to have very simple, yet still exploitable, stack-based buffer overflows:","Example_Code":{"Nature":"bad","Language":"C","xhtml:div":{"xhtml:br":{},"xhtml:div":{"style":"margin-left:10px;","xhtml:br":{}}}},"Body_Text":"The buffer size is fixed, but there is no guarantee the string in argv[1] will not exceed this size and cause an overflow."},{"Demonstrative_Example_ID":"DX-1","Intro_Text":"This example takes an IP address from a user, verifies that it is well formed and then looks up the hostname and copies it into a buffer.","Example_Code":{"Nature":"bad","Language":"C","xhtml:div":{"xhtml:div":{"style":"margin-left:10px;","xhtml:div":{"xhtml:br":[{},{},{},{},{},{},{},{},{},{}],"xhtml:i":"/*routine that ensures user_supplied_addr is in the right format for conversion */"}}}},"Body_Text":["This function allocates a buffer of 64 bytes to store the hostname, however there is no guarantee that the hostname will not be larger than 64 bytes. If an attacker specifies an address which resolves to a very large hostname, then we may overwrite sensitive data or even relinquish control flow to the attacker.","Note that this example also contains an unchecked return value (CWE-252) that can lead to a NULL pointer dereference (CWE-476)."]}]},"Taxonomy_Mappings":{"Taxonomy_Mapping":[{"Taxonomy_Name":"CLASP","Entry_Name":"Stack overflow"},{"Taxonomy_Name":"Software Fault Patterns","Entry_ID":"SFP8","Entry_Name":"Faulty Buffer Access"},{"Taxonomy_Name":"CERT C Secure Coding","Entry_ID":"ARR38-C","Entry_Name":"Guarantee that library functions do not form invalid pointers","Mapping_Fit":"Imprecise"},{"Taxonomy_Name":"CERT C Secure Coding","Entry_ID":"STR31-C","Entry_Name":"Guarantee that storage for strings has sufficient space for character data and the null terminator","Mapping_Fit":"CWE More Specific"}]},"References":{"Reference":[{"External_Reference_ID":"REF-1029"},{"External_Reference_ID":"REF-7","Section":"Chapter 5, \\"Stack Overruns\\" Page 129"},{"External_Reference_ID":"REF-44","Section":"\\"Sin 5: Buffer Overruns.\\" Page 89"},{"External_Reference_ID":"REF-62","Section":"Chapter 3, \\"Nonexecutable Stack\\", Page 76"},{"External_Reference_ID":"REF-62","Section":"Chapter 5, \\"Protection Mechanisms\\", Page 189"}]},"Notes":{"Note":{"Type":"Other","$t":"Stack-based buffer overflows can instantiate in return address overwrites, stack pointer overwrites or frame pointer overwrites. They can also be considered function pointer overwrites, array indexer overwrites or write-what-where condition, etc."}},"Content_History":{"Submission":{"Submission_Name":"CLASP","Submission_Date":"2006-07-19"},"Modification":[{"Modification_Name":"Eric Dalci","Modification_Organization":"Cigital","Modification_Date":"2008-07-01","Modification_Comment":"updated Potential_Mitigations, Time_of_Introduction"},{"Modification_Organization":"KDM Analytics","Modification_Date":"2008-08-01","Modification_Comment":"added/updated white box definitions"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2008-09-08","Modification_Comment":"updated Alternate_Terms, Applicable_Platforms, Background_Details, Common_Consequences, Relationships, Other_Notes, Taxonomy_Mappings, Weakness_Ordinalities"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2009-01-12","Modification_Comment":"updated Common_Consequences, Relationships"},{"Modification_Name":"KDM Analytics","Modification_Date":"2009-07-17","Modification_Comment":"Improved the White_Box_Definition"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2009-07-27","Modification_Comment":"updated Potential_Mitigations, White_Box_Definitions"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2009-10-29","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2010-02-16","Modification_Comment":"updated References"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-06-01","Modification_Comment":"updated Common_Consequences"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2012-05-11","Modification_Comment":"updated Demonstrative_Examples, References, Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2012-10-30","Modification_Comment":"updated Demonstrative_Examples, Potential_Mitigations"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2014-07-30","Modification_Comment":"updated Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2017-11-08","Modification_Comment":"updated Background_Details, Causal_Nature, Likelihood_of_Exploit, References, Relationships, Taxonomy_Mappings, White_Box_Definitions"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2018-03-27","Modification_Comment":"updated References"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2019-01-03","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2019-09-19","Modification_Comment":"updated References"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-02-24","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-06-25","Modification_Comment":"updated Common_Consequences"}]}},{"ID":"122","Name":"Heap-based Buffer Overflow","Abstraction":"Variant","Structure":"Simple","Status":"Draft","Description":"A heap overflow condition is a buffer overflow, where the buffer that can be overwritten is allocated in the heap portion of memory, generally meaning that the buffer was allocated using a routine such as malloc().","Related_Weaknesses":{"Related_Weakness":[{"Nature":"ChildOf","CWE_ID":"788","View_ID":"1000","Ordinal":"Primary"},{"Nature":"ChildOf","CWE_ID":"787","View_ID":"1000"}]},"Weakness_Ordinalities":{"Weakness_Ordinality":{"Ordinality":"Primary"}},"Applicable_Platforms":{"Language":[{"Name":"C","Prevalence":"Undetermined"},{"Name":"C++","Prevalence":"Undetermined"}]},"Modes_Of_Introduction":{"Introduction":[{"Phase":"Architecture and Design"},{"Phase":"Implementation"}]},"Likelihood_Of_Exploit":"High","Common_Consequences":{"Consequence":[{"Scope":"Availability","Impact":["DoS: Crash, Exit, or Restart","DoS: Resource Consumption (CPU)","DoS: Resource Consumption (Memory)"],"Note":"Buffer overflows generally lead to crashes. Other attacks leading to lack of availability are possible, including putting the program into an infinite loop."},{"Scope":["Integrity","Confidentiality","Availability","Access Control"],"Impact":["Execute Unauthorized Code or Commands","Bypass Protection Mechanism","Modify Memory"],"Note":"Buffer overflows often can be used to execute arbitrary code, which is usually outside the scope of a program\'s implicit security policy. Besides important user data, heap-based overflows can be used to overwrite function pointers that may be living in memory, pointing it to the attacker\'s code. Even in applications that do not explicitly use function pointers, the run-time will usually leave many in memory. For example, object methods in C++ are generally implemented using function pointers. Even in C programs, there is often a global offset table used by the underlying runtime."},{"Scope":["Integrity","Confidentiality","Availability","Access Control","Other"],"Impact":["Execute Unauthorized Code or Commands","Bypass Protection Mechanism","Other"],"Note":"When the consequence is arbitrary code execution, this can often be used to subvert any other security service."}]},"Potential_Mitigations":{"Mitigation":[{"Description":"Pre-design: Use a language or compiler that performs automatic bounds checking."},{"Phase":"Architecture and Design","Description":"Use an abstraction library to abstract away risky APIs. Not a complete solution."},{"Phase":"Build and Compilation","Description":"Pre-design through Build: Canary style bounds checking, library changes which ensure the validity of chunk data, and other such fixes are possible, but should not be relied upon."},{"Phase":"Implementation","Description":"Implement and perform bounds checking on input."},{"Phase":"Implementation","Strategy":"Libraries or Frameworks","Description":"Do not use dangerous functions such as gets. Look for their safe equivalent, which checks for the boundary."},{"Phase":"Operation","Description":"Use OS-level preventative functionality. This is not a complete solution, but it provides some defense in depth."}]},"Demonstrative_Examples":{"Demonstrative_Example":[{"Intro_Text":"While buffer overflow examples can be rather complex, it is possible to have very simple, yet still exploitable, heap-based buffer overflows:","Example_Code":{"Nature":"bad","Language":"C","xhtml:div":{"xhtml:br":{},"xhtml:div":{"style":"margin-left:10px;","xhtml:br":[{},{}]}}},"Body_Text":"The buffer is allocated heap memory with a fixed size, but there is no guarantee the string in argv[1] will not exceed this size and cause an overflow."},{"Demonstrative_Example_ID":"DX-19","Intro_Text":"This example applies an encoding procedure to an input string and stores it into a buffer.","Example_Code":{"Nature":"bad","Language":"C","xhtml:div":{"xhtml:div":{"style":"margin-left:10px;","xhtml:div":{"xhtml:br":[{},{},{},{},{}],"xhtml:div":[{"style":"margin-left:10px;","$t":"die(\\"user string too long, die evil hacker!\\");"},{"style":"margin-left:10px;","xhtml:div":{"xhtml:div":[{"style":"margin-left:10px;","xhtml:br":[{},{},{},{}]},{"style":"margin-left:10px;","xhtml:div":{"xhtml:br":[{},{}],"xhtml:i":"/* encode to &lt; */"}}],"xhtml:br":[{},{}]}}]}}}},"Body_Text":"The programmer attempts to encode the ampersand character in the user-controlled string, however the length of the string is validated before the encoding procedure is applied. Furthermore, the programmer assumes encoding expansion will only expand a given character by a factor of 4, while the encoding of the ampersand expands by 5. As a result, when the encoding procedure expands the string it is possible to overflow the destination buffer if the attacker provides a string of many ampersands."}]},"Observed_Examples":{"Observed_Example":[{"Reference":"CVE-2007-4268","Description":"Chain: integer signedness error (CWE-195) passes signed comparison, leading to heap overflow (CWE-122)","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2007-4268"},{"Reference":"CVE-2009-2523","Description":"Chain: product does not handle when an input string is not NULL terminated (CWE-170), leading to buffer over-read (CWE-125) or heap-based buffer overflow (CWE-122).","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2009-2523"}]},"Affected_Resources":{"Affected_Resource":"Memory"},"Taxonomy_Mappings":{"Taxonomy_Mapping":[{"Taxonomy_Name":"CLASP","Entry_Name":"Heap overflow"},{"Taxonomy_Name":"Software Fault Patterns","Entry_ID":"SFP8","Entry_Name":"Faulty Buffer Access"},{"Taxonomy_Name":"CERT C Secure Coding","Entry_ID":"STR31-C","Entry_Name":"Guarantee that storage for strings has sufficient space for character data and the null terminator","Mapping_Fit":"CWE More Specific"}]},"Related_Attack_Patterns":{"Related_Attack_Pattern":{"CAPEC_ID":"92"}},"References":{"Reference":[{"External_Reference_ID":"REF-7","Section":"Chapter 5, \\"Heap Overruns\\" Page 138"},{"External_Reference_ID":"REF-44","Section":"\\"Sin 5: Buffer Overruns.\\" Page 89"},{"External_Reference_ID":"REF-62","Section":"Chapter 3, \\"Nonexecutable Stack\\", Page 76"},{"External_Reference_ID":"REF-62","Section":"Chapter 5, \\"Protection Mechanisms\\", Page 189"}]},"Notes":{"Note":{"Type":"Relationship","$t":"Heap-based buffer overflows are usually just as dangerous as stack-based buffer overflows."}},"Content_History":{"Submission":{"Submission_Name":"CLASP","Submission_Date":"2006-07-19"},"Modification":[{"Modification_Name":"Eric Dalci","Modification_Organization":"Cigital","Modification_Date":"2008-07-01","Modification_Comment":"updated Potential_Mitigations, Time_of_Introduction"},{"Modification_Organization":"KDM Analytics","Modification_Date":"2008-08-01","Modification_Comment":"added/updated white box definitions"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2008-09-08","Modification_Comment":"updated Applicable_Platforms, Common_Consequences, Relationships, Other_Notes, Taxonomy_Mappings, Weakness_Ordinalities"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2008-11-24","Modification_Comment":"updated Common_Consequences, Other_Notes, Relationship_Notes"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2009-01-12","Modification_Comment":"updated Common_Consequences, Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2009-10-29","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2010-02-16","Modification_Comment":"updated References"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-06-01","Modification_Comment":"updated Common_Consequences"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2012-05-11","Modification_Comment":"updated Demonstrative_Examples, References, Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2012-10-30","Modification_Comment":"updated Demonstrative_Examples"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2013-02-21","Modification_Comment":"updated Demonstrative_Examples, Potential_Mitigations"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2014-06-23","Modification_Comment":"updated Observed_Examples"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2014-07-30","Modification_Comment":"updated Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2017-11-08","Modification_Comment":"updated Causal_Nature, Likelihood_of_Exploit, Observed_Examples, References, Relationships, Taxonomy_Mappings, White_Box_Definitions"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2018-03-27","Modification_Comment":"updated References"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2019-01-03","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-02-24","Modification_Comment":"updated Relationships"}]}},{"ID":"123","Name":"Write-what-where Condition","Abstraction":"Base","Structure":"Simple","Status":"Draft","Description":"Any condition where the attacker has the ability to write an arbitrary value to an arbitrary location, often as the result of a buffer overflow.","Related_Weaknesses":{"Related_Weakness":[{"Nature":"ChildOf","CWE_ID":"787","View_ID":"1000","Ordinal":"Primary"},{"Nature":"ChildOf","CWE_ID":"119","View_ID":"1305","Ordinal":"Primary"}]},"Weakness_Ordinalities":{"Weakness_Ordinality":{"Ordinality":"Resultant"}},"Applicable_Platforms":{"Language":[{"Name":"C","Prevalence":"Undetermined"},{"Name":"C++","Prevalence":"Undetermined"}]},"Modes_Of_Introduction":{"Introduction":{"Phase":"Implementation"}},"Likelihood_Of_Exploit":"High","Common_Consequences":{"Consequence":[{"Scope":["Integrity","Confidentiality","Availability","Access Control"],"Impact":["Modify Memory","Execute Unauthorized Code or Commands","Gain Privileges or Assume Identity","DoS: Crash, Exit, or Restart","Bypass Protection Mechanism"],"Note":"Clearly, write-what-where conditions can be used to write data to areas of memory outside the scope of a policy. Also, they almost invariably can be used to execute arbitrary code, which is usually outside the scope of a program\'s implicit security policy. If the attacker can overwrite a pointer\'s worth of memory (usually 32 or 64 bits), they can redirect a function pointer to their own malicious code. Even when the attacker can only modify a single byte arbitrary code execution can be possible. Sometimes this is because the same problem can be exploited repeatedly to the same effect. Other times it is because the attacker can overwrite security-critical application-specific data -- such as a flag indicating whether the user is an administrator."},{"Scope":["Integrity","Availability"],"Impact":["DoS: Crash, Exit, or Restart","Modify Memory"],"Note":"Many memory accesses can lead to program termination, such as when writing to addresses that are invalid for the current process."},{"Scope":["Access Control","Other"],"Impact":["Bypass Protection Mechanism","Other"],"Note":"When the consequence is arbitrary code execution, this can often be used to subvert any other security service."}]},"Potential_Mitigations":{"Mitigation":[{"Phase":"Architecture and Design","Strategy":"Language Selection","Description":"Use a language that provides appropriate memory abstractions."},{"Phase":"Operation","Description":"Use OS-level preventative functionality integrated after the fact. Not a complete solution."}]},"Demonstrative_Examples":{"Demonstrative_Example":{"Intro_Text":"The classic example of a write-what-where condition occurs when the accounting information for memory allocations is overwritten in a particular fashion. Here is an example of potentially vulnerable code:","Example_Code":{"Nature":"bad","Language":"C","xhtml:div":{"xhtml:br":{},"xhtml:div":{"style":"margin-left:10px;","xhtml:br":[{},{},{}]}}},"Body_Text":["Vulnerability in this case is dependent on memory layout. The call to strcpy() can be used to write past the end of buf1, and, with a typical layout, can overwrite the accounting information that the system keeps for buf2 when it is allocated. Note that if the allocation header for buf2 can be overwritten, buf2 itself can be overwritten as well.","The allocation header will generally keep a linked list of memory \\"chunks\\". Particularly, there may be a \\"previous\\" chunk and a \\"next\\" chunk. Here, the previous chunk for buf2 will probably be buf1, and the next chunk may be null. When the free() occurs, most memory allocators will rewrite the linked list using data from buf2. Particularly, the \\"next\\" chunk for buf1 will be updated and the \\"previous\\" chunk for any subsequent chunk will be updated. The attacker can insert a memory address for the \\"next\\" chunk and a value to write into that memory address for the \\"previous\\" chunk.","This could be used to overwrite a function pointer that gets dereferenced later, replacing it with a memory address that the attacker has legitimate access to, where they have placed malicious code, resulting in arbitrary code execution."]}},"Taxonomy_Mappings":{"Taxonomy_Mapping":[{"Taxonomy_Name":"CLASP","Entry_Name":"Write-what-where condition"},{"Taxonomy_Name":"CERT C Secure Coding","Entry_ID":"ARR30-C","Entry_Name":"Do not form or use out-of-bounds pointers or array subscripts","Mapping_Fit":"Imprecise"},{"Taxonomy_Name":"CERT C Secure Coding","Entry_ID":"ARR38-C","Entry_Name":"Guarantee that library functions do not form invalid pointers","Mapping_Fit":"Imprecise"},{"Taxonomy_Name":"CERT C Secure Coding","Entry_ID":"STR31-C","Entry_Name":"Guarantee that storage for strings has sufficient space for character data and the null terminator","Mapping_Fit":"Imprecise"},{"Taxonomy_Name":"CERT C Secure Coding","Entry_ID":"STR32-C","Entry_Name":"Do not pass a non-null-terminated character sequence to a library function that expects a string","Mapping_Fit":"Imprecise"}]},"References":{"Reference":{"External_Reference_ID":"REF-44","Section":"\\"Sin 5: Buffer Overruns.\\" Page 89"}},"Content_History":{"Submission":{"Submission_Name":"CLASP","Submission_Date":"2006-07-19"},"Modification":[{"Modification_Name":"Eric Dalci","Modification_Organization":"Cigital","Modification_Date":"2008-07-01","Modification_Comment":"updated Time_of_Introduction"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2008-09-08","Modification_Comment":"updated Applicable_Platforms, Common_Consequences, Relationships, Other_Notes, Taxonomy_Mappings, Weakness_Ordinalities"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2008-11-24","Modification_Comment":"updated Common_Consequences, Other_Notes"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2009-01-12","Modification_Comment":"updated Common_Consequences"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2009-05-27","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2010-12-13","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-06-01","Modification_Comment":"updated Common_Consequences"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2012-05-11","Modification_Comment":"updated Common_Consequences, References, Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2012-10-30","Modification_Comment":"updated Demonstrative_Examples"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2013-02-21","Modification_Comment":"updated Potential_Mitigations"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2014-07-30","Modification_Comment":"updated Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2015-12-07","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2017-11-08","Modification_Comment":"updated Causal_Nature, Common_Consequences, Demonstrative_Examples, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2019-01-03","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2019-06-20","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2019-09-19","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-02-24","Modification_Comment":"updated Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-08-20","Modification_Comment":"updated Relationships"}]}},{"ID":"124","Name":"Buffer Underwrite (\'Buffer Underflow\')","Abstraction":"Base","Structure":"Simple","Status":"Incomplete","Description":"The software writes to a buffer using an index or pointer that references a memory location prior to the beginning of the buffer.","Extended_Description":"This typically occurs when a pointer or its index is decremented to a position before the buffer, when pointer arithmetic results in a position before the beginning of the valid memory location, or when a negative index is used.","Related_Weaknesses":{"Related_Weakness":[{"Nature":"ChildOf","CWE_ID":"786","View_ID":"1000","Ordinal":"Primary"},{"Nature":"ChildOf","CWE_ID":"787","View_ID":"1000"}]},"Weakness_Ordinalities":{"Weakness_Ordinality":{"Ordinality":"Primary"}},"Applicable_Platforms":{"Language":[{"Name":"C","Prevalence":"Undetermined"},{"Name":"C++","Prevalence":"Undetermined"}]},"Alternate_Terms":{"Alternate_Term":{"Term":"buffer underrun","Description":"Some prominent vendors and researchers use the term \\"buffer underrun\\". \\"Buffer underflow\\" is more commonly used, although both terms are also sometimes used to describe a buffer under-read (CWE-127)."}},"Modes_Of_Introduction":{"Introduction":[{"Phase":"Architecture and Design"},{"Phase":"Implementation"}]},"Likelihood_Of_Exploit":"Medium","Common_Consequences":{"Consequence":[{"Scope":["Integrity","Availability"],"Impact":["Modify Memory","DoS: Crash, Exit, or Restart"],"Note":"Out of bounds memory access will very likely result in the corruption of relevant memory, and perhaps instructions, possibly leading to a crash."},{"Scope":["Integrity","Confidentiality","Availability","Access Control","Other"],"Impact":["Execute Unauthorized Code or Commands","Modify Memory","Bypass Protection Mechanism","Other"],"Note":"If the corrupted memory can be effectively controlled, it may be possible to execute arbitrary code. If the corrupted memory is data rather than instructions, the system will continue to function with improper changes, possibly in violation of an implicit or explicit policy. The consequences would only be limited by how the affected data is used, such as an adjacent memory location that is used to specify whether the user has special privileges."},{"Scope":["Access Control","Other"],"Impact":["Bypass Protection Mechanism","Other"],"Note":"When the consequence is arbitrary code execution, this can often be used to subvert any other security service."}]},"Potential_Mitigations":{"Mitigation":[{"Description":"Requirements specification: The choice could be made to use a language that is not susceptible to these issues."},{"Phase":"Implementation","Description":"Sanity checks should be performed on all calculated values used as index or for pointer arithmetic."}]},"Demonstrative_Examples":{"Demonstrative_Example":[{"Demonstrative_Example_ID":"DX-87","Intro_Text":"In the following C/C++ example, a utility function is used to trim trailing whitespace from a character string. The function copies the input string to a local character string and uses a while statement to remove the trailing whitespace by moving backward through the string and overwriting whitespace with a NUL character.","Example_Code":{"Nature":"bad","Language":"C","xhtml:div":{"xhtml:div":{"style":"margin-left:10px;","xhtml:div":{"xhtml:br":[{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}],"xhtml:i":["// copy input string to a temporary string","// trim trailing whitespace","// return string without trailing whitespace"],"xhtml:div":[{"style":"margin-left:10px;","$t":"message[index] = strMessage[index];"},{"style":"margin-left:10px;","xhtml:br":{}}]}}}},"Body_Text":"However, this function can cause a buffer underwrite if the input character string contains all whitespace. On some systems the while statement will move backwards past the beginning of a character string and will call the isspace() function on an address outside of the bounds of the local buffer."},{"Demonstrative_Example_ID":"DX-88","Intro_Text":"The following is an example of code that may result in a buffer underwrite, if find() returns a negative value to indicate that ch is not found in srcBuf:","Example_Code":{"Nature":"bad","Language":"C","xhtml:div":{"xhtml:div":{"style":"margin-left:10px;","xhtml:br":[{},{}]}}},"Body_Text":"If the index to srcBuf is somehow under user control, this is an arbitrary write-what-where condition."}]},"Observed_Examples":{"Observed_Example":[{"Reference":"CVE-2002-2227","Description":"Unchecked length of SSLv2 challenge value leads to buffer underflow.","Link":"http://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2002-2227"},{"Reference":"CVE-2007-4580","Description":"Buffer underflow from a small size value with a large buffer (length parameter inconsistency, CWE-130)","Link":"http://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2007-4580"},{"Reference":"CVE-2007-1584","Description":"Buffer underflow from an all-whitespace string, which causes a counter to be decremented before the buffer while looking for a non-whitespace character.","Link":"http://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2007-1584"},{"Reference":"CVE-2007-0886","Description":"Buffer underflow resultant from encoded data that triggers an integer overflow.","Link":"http://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2007-0886"},{"Reference":"CVE-2006-6171","Description":"Product sets an incorrect buffer size limit, leading to \\"off-by-two\\" buffer underflow.","Link":"http://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2006-6171"},{"Reference":"CVE-2006-4024","Description":"Negative value is used in a memcpy() operation, leading to buffer underflow.","Link":"http://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2006-4024"},{"Reference":"CVE-2004-2620","Description":"Buffer underflow due to mishandled special characters","Link":"http://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2004-2620"}]},"Taxonomy_Mappings":{"Taxonomy_Mapping":[{"Taxonomy_Name":"PLOVER","Entry_Name":"UNDER - Boundary beginning violation (\'buffer underflow\'?)"},{"Taxonomy_Name":"CLASP","Entry_Name":"Buffer underwrite"},{"Taxonomy_Name":"Software Fault Patterns","Entry_ID":"SFP8","Entry_Name":"Faulty Buffer Access"}]},"References":{"Reference":[{"External_Reference_ID":"REF-90"},{"External_Reference_ID":"REF-44","Section":"\\"Sin 5: Buffer Overruns.\\" Page 89"}]},"Notes":{"Note":[{"Type":"Relationship","$t":"This could be resultant from several errors, including a bad offset or an array index that decrements before the beginning of the buffer (see CWE-129)."},{"Type":"Research Gap","$t":"Much attention has been paid to buffer overflows, but \\"underflows\\" sometimes exist in products that are relatively free of overflows, so it is likely that this variant has been under-studied."}]},"Content_History":{"Submission":{"Submission_Name":"PLOVER","Submission_Date":"2006-07-19"},"Modification":[{"Modification_Name":"Eric Dalci","Modification_Organization":"Cigital","Modification_Date":"2008-07-01","Modification_Comment":"updated Time_of_Introduction"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2008-09-08","Modification_Comment":"updated Alternate_Terms, Applicable_Platforms, Common_Consequences, Description, Relationships, Relationship_Notes, Taxonomy_Mappings, Weakness_Ordinalities"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2009-01-12","Modification_Comment":"updated Common_Consequences"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2009-10-29","Modification_Comment":"updated Description, Name, Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-03-29","Modification_Comment":"updated Demonstrative_Examples, Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-06-01","Modification_Comment":"updated Common_Consequences"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2012-05-11","Modification_Comment":"updated Demonstrative_Examples, References, Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2014-07-30","Modification_Comment":"updated Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2017-11-08","Modification_Comment":"updated Causal_Nature, Demonstrative_Examples, References"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-02-24","Modification_Comment":"updated Relationships"}],"Previous_Entry_Name":{"Date":"2009-10-29","$t":"Boundary Beginning Violation (\'Buffer Underwrite\')"}}},{"ID":"125","Name":"Out-of-bounds Read","Abstraction":"Base","Structure":"Simple","Status":"Draft","Description":"The software reads data past the end, or before the beginning, of the intended buffer.","Extended_Description":"Typically, this can allow attackers to read sensitive information from other memory locations or cause a crash.  A crash can occur when the code reads a variable amount of data and assumes that a sentinel exists to stop the read operation, such as a NUL in a string.  The expected sentinel might not be located in the out-of-bounds memory, causing excessive data to be read, leading to a segmentation fault or a buffer overflow.  The software may modify an index or perform pointer arithmetic that references a memory location that is outside of the boundaries of the buffer.  A subsequent read operation then produces undefined or unexpected results.","Related_Weaknesses":{"Related_Weakness":[{"Nature":"ChildOf","CWE_ID":"119","View_ID":"1000","Ordinal":"Primary"},{"Nature":"ChildOf","CWE_ID":"119","View_ID":"1003","Ordinal":"Primary"},{"Nature":"ChildOf","CWE_ID":"119","View_ID":"1305","Ordinal":"Primary"}]},"Weakness_Ordinalities":{"Weakness_Ordinality":{"Ordinality":"Primary"}},"Applicable_Platforms":{"Language":[{"Name":"C","Prevalence":"Undetermined"},{"Name":"C++","Prevalence":"Undetermined"}]},"Modes_Of_Introduction":{"Introduction":{"Phase":"Implementation"}},"Common_Consequences":{"Consequence":[{"Scope":"Confidentiality","Impact":"Read Memory"},{"Scope":"Confidentiality","Impact":"Bypass Protection Mechanism","Note":"By reading out-of-bounds memory, an attacker might be able to get secret values, such as memory addresses, which can be bypass protection mechanisms such as ASLR in order to improve the reliability and likelihood of exploiting a separate weakness to achieve code execution instead of just denial of service."}]},"Potential_Mitigations":{"Mitigation":[{"Mitigation_ID":"MIT-5","Phase":"Implementation","Strategy":"Input Validation","Description":{"xhtml:p":["Assume all input is malicious. Use an \\"accept known good\\" input validation strategy, i.e., use a list of acceptable inputs that strictly conform to specifications. Reject any input that does not strictly conform to specifications, or transform it into something that does.","When performing input validation, consider all potentially relevant properties, including length, type of input, the full range of acceptable values, missing or extra inputs, syntax, consistency across related fields, and conformance to business rules. As an example of business rule logic, \\"boat\\" may be syntactically valid because it only contains alphanumeric characters, but it is not valid if the input is only expected to contain colors such as \\"red\\" or \\"blue.\\"","Do not rely exclusively on looking for malicious or malformed inputs.  This is likely to miss at least one undesirable input, especially if the code\'s environment changes. This can give attackers enough room to bypass the intended validation. However, denylists can be useful for detecting potential attacks or determining which inputs are so malformed that they should be rejected outright.","To reduce the likelihood of introducing an out-of-bounds read, ensure that you validate and ensure correct calculations for any length argument, buffer size calculation, or offset. Be especially careful of relying on a sentinel (i.e. special character such as NUL) in untrusted inputs."]}},{"Phase":"Architecture and Design","Strategy":"Language Selection","Description":"Use a language that provides appropriate memory abstractions."}]},"Demonstrative_Examples":{"Demonstrative_Example":{"Demonstrative_Example_ID":"DX-100","Intro_Text":"In the following code, the method retrieves a value from an array at a specific array index location that is given as an input parameter to the method","Example_Code":[{"Nature":"bad","Language":"C","xhtml:div":{"xhtml:div":{"style":"margin-left:10px;","xhtml:div":{"xhtml:br":[{},{},{},{},{},{},{},{},{},{},{},{}],"xhtml:i":["// check that the array index is less than the maximum","// length of the array","// if array index is invalid then output error message","// and return value indicating error"],"xhtml:div":[{"style":"margin-left:10px;","xhtml:div":{"xhtml:br":[{},{}],"xhtml:i":"// get the value at the specified index of the array"}},{"style":"margin-left:10px;","xhtml:br":{}}]}}}},{"Nature":"good","Language":"C","xhtml:div":{"xhtml:br":[{},{},{},{},{},{},{},{}],"xhtml:i":["// check that the array index is within the correct","// range of values for the array"]}}],"Body_Text":"However, this method only verifies that the given array index is less than the maximum length of the array but does not check for the minimum value (CWE-839). This will allow a negative value to be accepted as the input array index, which will result in a out of bounds read (CWE-125) and may allow access to sensitive memory. The input array index should be checked to verify that is within the maximum and minimum range required for the array (CWE-129). In this example the if statement should be modified to include a minimum range check, as shown below."}},"Observed_Examples":{"Observed_Example":[{"Reference":"CVE-2014-0160","Description":"Chain: \\"Heartbleed\\" bug receives an inconsistent length parameter (CWE-130) enabling an out-of-bounds read (CWE-126), returning memory that could include private cryptographic keys and other sensitive data.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2014-0160"},{"Reference":"CVE-2018-10887","Description":"Chain: unexpected sign extension (CWE-194) leads to integer overflow (CWE-190), causing an out-of-bounds read (CWE-125)","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2018-10887"},{"Reference":"CVE-2009-2523","Description":"Chain: product does not handle when an input string is not NULL terminated (CWE-170), leading to buffer over-read (CWE-125) or heap-based buffer overflow (CWE-122).","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2009-2523"},{"Reference":"CVE-2004-0112","Description":"out-of-bounds read due to improper length check","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2004-0112"},{"Reference":"CVE-2004-0183","Description":"packet with large number of specified elements cause out-of-bounds read.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2004-0183"},{"Reference":"CVE-2004-0221","Description":"packet with large number of specified elements cause out-of-bounds read.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2004-0221"},{"Reference":"CVE-2004-0184","Description":"out-of-bounds read, resultant from integer underflow","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2004-0184"},{"Reference":"CVE-2004-1940","Description":"large length value causes out-of-bounds read","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2004-1940"},{"Reference":"CVE-2004-0421","Description":"malformed image causes out-of-bounds read","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2004-0421"},{"Reference":"CVE-2008-4113","Description":"OS kernel trusts userland-supplied length value, allowing reading of sensitive information","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2008-4113"}]},"Taxonomy_Mappings":{"Taxonomy_Mapping":[{"Taxonomy_Name":"PLOVER","Entry_Name":"Out-of-bounds Read"},{"Taxonomy_Name":"CERT C Secure Coding","Entry_ID":"ARR30-C","Entry_Name":"Do not form or use out-of-bounds pointers or array subscripts","Mapping_Fit":"Imprecise"},{"Taxonomy_Name":"CERT C Secure Coding","Entry_ID":"ARR38-C","Entry_Name":"Guarantee that library functions do not form invalid pointers","Mapping_Fit":"Imprecise"},{"Taxonomy_Name":"CERT C Secure Coding","Entry_ID":"EXP39-C","Entry_Name":"Do not access a variable through a pointer of an incompatible type","Mapping_Fit":"Imprecise"},{"Taxonomy_Name":"CERT C Secure Coding","Entry_ID":"STR31-C","Entry_Name":"Guarantee that storage for strings has sufficient space for character data and the null terminator","Mapping_Fit":"Imprecise"},{"Taxonomy_Name":"CERT C Secure Coding","Entry_ID":"STR32-C","Entry_Name":"Do not pass a non-null-terminated character sequence to a library function that expects a string","Mapping_Fit":"CWE More Abstract"}]},"Related_Attack_Patterns":{"Related_Attack_Pattern":[{"CAPEC_ID":"537"},{"CAPEC_ID":"540"}]},"References":{"Reference":[{"External_Reference_ID":"REF-1034"},{"External_Reference_ID":"REF-1035"},{"External_Reference_ID":"REF-44","Section":"\\"Sin 5: Buffer Overruns.\\" Page 89"}]},"Notes":{"Note":{"Type":"Research Gap","$t":"Under-studied and under-reported. Most issues are probably labeled as buffer overflows."}},"Content_History":{"Submission":{"Submission_Name":"PLOVER","Submission_Date":"2006-07-19"},"Modification":[{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2008-09-08","Modification_Comment":"updated Applicable_Platforms, Relationships, Taxonomy_Mappings, Weakness_Ordinalities"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2009-10-29","Modification_Comment":"updated Description"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2010-09-27","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-06-01","Modification_Comment":"updated Common_Consequences"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2012-05-11","Modification_Comment":"updated Demonstrative_Examples, References, Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2014-06-23","Modification_Comment":"updated Related_Attack_Patterns"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2014-07-30","Modification_Comment":"updated Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2015-12-07","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2017-11-08","Modification_Comment":"updated Causal_Nature, Observed_Examples, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2018-03-27","Modification_Comment":"updated Description"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2019-01-03","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2019-06-20","Modification_Comment":"updated Description, Related_Attack_Patterns"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2019-09-19","Modification_Comment":"updated Common_Consequences, Observed_Examples, Potential_Mitigations, References, Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-02-24","Modification_Comment":"updated Potential_Mitigations, Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-06-25","Modification_Comment":"updated Observed_Examples, Potential_Mitigations"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-08-20","Modification_Comment":"updated Observed_Examples, Potential_Mitigations, Relationships"}]}},{"ID":"126","Name":"Buffer Over-read","Abstraction":"Variant","Structure":"Simple","Status":"Draft","Description":"The software reads from a buffer using buffer access mechanisms such as indexes or pointers that reference memory locations after the targeted buffer.","Extended_Description":"This typically occurs when the pointer or its index is incremented to a position beyond the bounds of the buffer or when pointer arithmetic results in a position outside of the valid memory location to name a few. This may result in exposure of sensitive information or possibly a crash.","Related_Weaknesses":{"Related_Weakness":[{"Nature":"ChildOf","CWE_ID":"125","View_ID":"1000"},{"Nature":"ChildOf","CWE_ID":"788","View_ID":"1000","Ordinal":"Primary"}]},"Weakness_Ordinalities":{"Weakness_Ordinality":{"Ordinality":"Primary"}},"Applicable_Platforms":{"Language":[{"Name":"C","Prevalence":"Undetermined"},{"Name":"C++","Prevalence":"Undetermined"}]},"Modes_Of_Introduction":{"Introduction":{"Phase":"Implementation"}},"Common_Consequences":{"Consequence":[{"Scope":"Confidentiality","Impact":"Read Memory"},{"Scope":"Confidentiality","Impact":"Bypass Protection Mechanism","Note":"By reading out-of-bounds memory, an attacker might be able to get secret values, such as memory addresses, which can be bypass protection mechanisms such as ASLR in order to improve the reliability and likelihood of exploiting a separate weakness to achieve code execution instead of just denial of service."}]},"Demonstrative_Examples":{"Demonstrative_Example":[{"Demonstrative_Example_ID":"DX-91","Intro_Text":"In the following C/C++ example the method processMessageFromSocket() will get a message from a socket, placed into a buffer, and will parse the contents of the buffer into a structure that contains the message length and the message body. A for loop is used to copy the message body into a local character string which will be passed to another method for processing.","Example_Code":{"Nature":"bad","Language":"C","xhtml:div":{"xhtml:div":{"style":"margin-left:10px;","xhtml:div":{"xhtml:br":[{},{},{},{},{},{},{},{},{}],"xhtml:i":["// get message from socket and store into buffer","//Ignoring possibliity that buffer > BUFFER_SIZE"],"xhtml:div":{"style":"margin-left:10px;","xhtml:div":{"xhtml:br":[{},{},{},{},{},{},{},{},{},{}],"xhtml:i":["// place contents of the buffer into message structure","// copy message body into string for processing","// process message"],"xhtml:div":{"style":"margin-left:10px;","$t":"message[index] = msg->msgBody[index];"}}}}}}},"Body_Text":"However, the message length variable from the structure is used as the condition for ending the for loop without validating that the message length variable accurately reflects the length of the message body (CWE-606). This can result in a buffer over-read (CWE-125) by reading from memory beyond the bounds of the buffer if the message length variable indicates a length that is longer than the size of a message body (CWE-130)."},{"Intro_Text":"The following C/C++ example demonstrates a buffer over-read due to a missing NULL terminator. The main method of a pattern matching utility that looks for a specific pattern within a specific file uses the string strncopy() method to copy the command line user input file name and pattern to the Filename and Pattern character arrays respectively.","Example_Code":[{"Nature":"bad","Language":"C","xhtml:div":{"xhtml:br":[{},{}],"xhtml:div":{"style":"margin-left:10px;","xhtml:br":[{},{},{},{},{},{},{},{},{},{},{},{},{}],"xhtml:i":["/* Validate number of parameters and ensure valid content */","/* copy filename parameter to variable, may cause off-by-one overflow */","/* copy pattern parameter to variable, may cause off-by-one overflow */"]}}},{"Nature":"good","Language":"C","xhtml:div":{"xhtml:i":["/* copy filename parameter to variable, no off-by-one overflow */","/* copy pattern parameter to variable, no off-by-one overflow */"],"xhtml:br":[{},{},{},{},{}]},"xhtml:br":{}}],"Body_Text":["However, the code do not take into account that strncpy() will not add a NULL terminator when the source buffer is equal in length of longer than that provide size attribute. Therefore if a user enters a filename or pattern that are the same size as (or larger than) their respective character arrays, a NULL terminator will not be added (CWE-170) which leads to the printf() read beyond the expected end of the Filename and Pattern buffers.","To fix this problem, be sure to subtract 1 from the sizeof() call to allow room for the null byte to be added."]}]},"Observed_Examples":{"Observed_Example":[{"Reference":"CVE-2014-0160","Description":"Chain: \\"Heartbleed\\" bug receives an inconsistent length parameter (CWE-130) enabling an out-of-bounds read (CWE-126), returning memory that could include private cryptographic keys and other sensitive data.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2014-0160"},{"Reference":"CVE-2009-2523","Description":"Chain: product does not handle when an input string is not NULL terminated, leading to buffer over-read or heap-based buffer overflow.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2009-2523"}]},"Taxonomy_Mappings":{"Taxonomy_Mapping":[{"Taxonomy_Name":"PLOVER","Entry_Name":"Buffer over-read"},{"Taxonomy_Name":"Software Fault Patterns","Entry_ID":"SFP8","Entry_Name":"Faulty Buffer Access"}]},"References":{"Reference":[{"External_Reference_ID":"REF-1034"},{"External_Reference_ID":"REF-1035"},{"External_Reference_ID":"REF-44","Section":"\\"Sin 5: Buffer Overruns.\\" Page 89"}]},"Notes":{"Note":{"Type":"Relationship","$t":"These problems may be resultant from missing sentinel values (CWE-463) or trusting a user-influenced input length variable."}},"Content_History":{"Submission":{"Submission_Name":"PLOVER","Submission_Date":"2006-07-19"},"Modification":[{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2008-09-08","Modification_Comment":"updated Applicable_Platforms, Relationships, Taxonomy_Mappings, Weakness_Ordinalities"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2009-10-29","Modification_Comment":"updated Description, Relationship_Notes, Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-03-29","Modification_Comment":"updated Demonstrative_Examples"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-06-01","Modification_Comment":"updated Common_Consequences"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2012-05-11","Modification_Comment":"updated Demonstrative_Examples, Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2014-06-23","Modification_Comment":"updated Observed_Examples"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2014-07-30","Modification_Comment":"updated Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2017-11-08","Modification_Comment":"updated Causal_Nature, Demonstrative_Examples"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2018-03-27","Modification_Comment":"updated Demonstrative_Examples"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2019-09-19","Modification_Comment":"updated Common_Consequences, References"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-02-24","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-06-25","Modification_Comment":"updated Demonstrative_Examples"}]}},{"ID":"127","Name":"Buffer Under-read","Abstraction":"Variant","Structure":"Simple","Status":"Draft","Description":"The software reads from a buffer using buffer access mechanisms such as indexes or pointers that reference memory locations prior to the targeted buffer.","Extended_Description":"This typically occurs when the pointer or its index is decremented to a position before the buffer, when pointer arithmetic results in a position before the beginning of the valid memory location, or when a negative index is used. This may result in exposure of sensitive information or possibly a crash.","Related_Weaknesses":{"Related_Weakness":[{"Nature":"ChildOf","CWE_ID":"125","View_ID":"1000"},{"Nature":"ChildOf","CWE_ID":"786","View_ID":"1000","Ordinal":"Primary"}]},"Weakness_Ordinalities":{"Weakness_Ordinality":{"Ordinality":"Primary"}},"Applicable_Platforms":{"Language":[{"Name":"C","Prevalence":"Undetermined"},{"Name":"C++","Prevalence":"Undetermined"}]},"Modes_Of_Introduction":{"Introduction":{"Phase":"Implementation"}},"Common_Consequences":{"Consequence":[{"Scope":"Confidentiality","Impact":"Read Memory"},{"Scope":"Confidentiality","Impact":"Bypass Protection Mechanism","Note":"By reading out-of-bounds memory, an attacker might be able to get secret values, such as memory addresses, which can be bypass protection mechanisms such as ASLR in order to improve the reliability and likelihood of exploiting a separate weakness to achieve code execution instead of just denial of service."}]},"Taxonomy_Mappings":{"Taxonomy_Mapping":[{"Taxonomy_Name":"PLOVER","Entry_Name":"Buffer under-read"},{"Taxonomy_Name":"Software Fault Patterns","Entry_ID":"SFP8","Entry_Name":"Faulty Buffer Access"}]},"References":{"Reference":[{"External_Reference_ID":"REF-1034"},{"External_Reference_ID":"REF-1035"},{"External_Reference_ID":"REF-44","Section":"\\"Sin 5: Buffer Overruns.\\" Page 89"}]},"Notes":{"Note":{"Type":"Research Gap","$t":"Under-studied."}},"Content_History":{"Submission":{"Submission_Name":"PLOVER","Submission_Date":"2006-07-19"},"Modification":[{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2008-09-08","Modification_Comment":"updated Applicable_Platforms, Relationships, Taxonomy_Mappings, Weakness_Ordinalities"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2009-10-29","Modification_Comment":"updated Description, Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-06-01","Modification_Comment":"updated Common_Consequences"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2012-05-11","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2014-07-30","Modification_Comment":"updated Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2017-11-08","Modification_Comment":"updated Causal_Nature"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2019-09-19","Modification_Comment":"updated Common_Consequences, References"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-02-24","Modification_Comment":"updated Relationships"}]}},{"ID":"128","Name":"Wrap-around Error","Abstraction":"Base","Structure":"Simple","Status":"Incomplete","Description":"Wrap around errors occur whenever a value is incremented past the maximum value for its type and therefore \\"wraps around\\" to a very small, negative, or undefined value.","Related_Weaknesses":{"Related_Weakness":[{"Nature":"ChildOf","CWE_ID":"682","View_ID":"1000","Ordinal":"Primary"},{"Nature":"CanPrecede","CWE_ID":"119","View_ID":"1000"},{"Nature":"PeerOf","CWE_ID":"190","View_ID":"1000"}]},"Weakness_Ordinalities":{"Weakness_Ordinality":{"Ordinality":"Primary"}},"Applicable_Platforms":{"Language":[{"Name":"C","Prevalence":"Often"},{"Name":"C++","Prevalence":"Often"}]},"Background_Details":{"Background_Detail":"Due to how addition is performed by computers, if a primitive is incremented past the maximum value possible for its storage space, the system will not recognize this, and therefore increment each bit as if it still had extra space. Because of how negative numbers are represented in binary, primitives interpreted as signed may \\"wrap\\" to very large negative values."},"Modes_Of_Introduction":{"Introduction":{"Phase":"Implementation"}},"Likelihood_Of_Exploit":"Medium","Common_Consequences":{"Consequence":[{"Scope":"Availability","Impact":["DoS: Crash, Exit, or Restart","DoS: Resource Consumption (CPU)","DoS: Resource Consumption (Memory)","DoS: Instability"],"Note":"This weakness will generally lead to undefined behavior and therefore crashes. In the case of overflows involving loop index variables, the likelihood of infinite loops is also high."},{"Scope":"Integrity","Impact":"Modify Memory","Note":"If the value in question is important to data (as opposed to flow), simple data corruption has occurred. Also, if the wrap around results in other conditions such as buffer overflows, further memory corruption may occur."},{"Scope":["Confidentiality","Availability","Access Control"],"Impact":["Execute Unauthorized Code or Commands","Bypass Protection Mechanism"],"Note":"This weakness can sometimes trigger buffer overflows which can be used to execute arbitrary code. This is usually outside the scope of a program\'s implicit security policy."}]},"Potential_Mitigations":{"Mitigation":[{"Description":"Requirements specification: The choice could be made to use a language that is not susceptible to these issues."},{"Phase":"Architecture and Design","Description":"Provide clear upper and lower bounds on the scale of any protocols designed."},{"Phase":"Implementation","Description":"Place sanity checks on all incremented variables to ensure that they remain within reasonable bounds."}]},"Demonstrative_Examples":{"Demonstrative_Example":{"Demonstrative_Example_ID":"DX-33","Intro_Text":"The following image processing code allocates a table for images.","Example_Code":{"Nature":"bad","Language":"C","xhtml:div":{"xhtml:br":[{},{},{},{},{}]}},"Body_Text":"This code intends to allocate a table of size num_imgs, however as num_imgs grows large, the calculation determining the size of the list will eventually overflow (CWE-190). This will result in a very small list to be allocated instead. If the subsequent code operates on the list as if it were num_imgs long, it may result in many types of out-of-bounds problems (CWE-119)."}},"Taxonomy_Mappings":{"Taxonomy_Mapping":[{"Taxonomy_Name":"CLASP","Entry_Name":"Wrap-around error"},{"Taxonomy_Name":"CERT C Secure Coding","Entry_ID":"MEM07-C","Entry_Name":"Ensure that the arguments to calloc(), when multiplied, can be represented as a size_t"},{"Taxonomy_Name":"Software Fault Patterns","Entry_ID":"SFP1","Entry_Name":"Glitch in computation"}]},"Related_Attack_Patterns":{"Related_Attack_Pattern":{"CAPEC_ID":"92"}},"References":{"Reference":[{"External_Reference_ID":"REF-44","Section":"\\"Sin 5: Buffer Overruns.\\" Page 89"},{"External_Reference_ID":"REF-62","Section":"Chapter 6, \\"Signed Integer Boundaries\\", Page 220"}]},"Notes":{"Note":{"Type":"Relationship","$t":"The relationship between overflow and wrap-around needs to be examined more closely, since several entries (including CWE-190) are closely related."}},"Content_History":{"Submission":{"Submission_Name":"CLASP","Submission_Date":"2006-07-19"},"Modification":[{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2008-09-08","Modification_Comment":"updated Applicable_Platforms, Background_Details, Common_Consequences, Relationships, Relationship_Notes, Taxonomy_Mappings, Weakness_Ordinalities"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2008-11-24","Modification_Comment":"updated Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2009-10-29","Modification_Comment":"updated Common_Consequences, Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2010-12-13","Modification_Comment":"updated Background_Details"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-06-01","Modification_Comment":"updated Common_Consequences"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-09-13","Modification_Comment":"updated Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2012-05-11","Modification_Comment":"updated Common_Consequences, Demonstrative_Examples, References, Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2014-07-30","Modification_Comment":"updated Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2017-01-19","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2017-11-08","Modification_Comment":"updated Causal_Nature, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-02-24","Modification_Comment":"updated Relationships"}]}},{"ID":"129","Name":"Improper Validation of Array Index","Abstraction":"Variant","Structure":"Simple","Status":"Draft","Description":"The product uses untrusted input when calculating or using an array index, but the product does not validate or incorrectly validates the index to ensure the index references a valid position within the array.","Related_Weaknesses":{"Related_Weakness":[{"Nature":"ChildOf","CWE_ID":"1285","View_ID":"1000","Ordinal":"Primary"},{"Nature":"ChildOf","CWE_ID":"20","View_ID":"1003","Ordinal":"Primary"},{"Nature":"CanPrecede","CWE_ID":"119","View_ID":"1000"},{"Nature":"CanPrecede","CWE_ID":"823","View_ID":"1000"},{"Nature":"CanPrecede","CWE_ID":"789","View_ID":"1000"}]},"Weakness_Ordinalities":{"Weakness_Ordinality":{"Ordinality":"Resultant","Description":"The most common condition situation leading to an out-of-bounds array index is the use of loop index variables as buffer indexes. If the end condition for the loop is subject to a flaw, the index can grow or shrink unbounded, therefore causing a buffer overflow or underflow. Another common situation leading to this condition is the use of a function\'s return value, or the resulting value of a calculation directly as an index in to a buffer."}},"Applicable_Platforms":{"Language":[{"Name":"C","Prevalence":"Often"},{"Name":"C++","Prevalence":"Often"},{"Class":"Language-Independent","Prevalence":"Undetermined"}]},"Alternate_Terms":{"Alternate_Term":[{"Term":"out-of-bounds array index"},{"Term":"index-out-of-range"},{"Term":"array index underflow"}]},"Modes_Of_Introduction":{"Introduction":{"Phase":"Implementation"}},"Likelihood_Of_Exploit":"High","Common_Consequences":{"Consequence":[{"Scope":["Integrity","Availability"],"Impact":"DoS: Crash, Exit, or Restart","Note":"Use of an index that is outside the bounds of an array will very likely result in the corruption of relevant memory and perhaps instructions, leading to a crash, if the values are outside of the valid memory area."},{"Scope":"Integrity","Impact":"Modify Memory","Note":"If the memory corrupted is data, rather than instructions, the system will continue to function with improper values."},{"Scope":["Confidentiality","Integrity"],"Impact":["Modify Memory","Read Memory"],"Note":"Use of an index that is outside the bounds of an array can also trigger out-of-bounds read or write operations, or operations on the wrong objects; i.e., \\"buffer overflows\\" are not always the result. This may result in the exposure or modification of sensitive data."},{"Scope":["Integrity","Confidentiality","Availability"],"Impact":"Execute Unauthorized Code or Commands","Note":"If the memory accessible by the attacker can be effectively controlled, it may be possible to execute arbitrary code, as with a standard buffer overflow and possibly without the use of large inputs if a precise index can be controlled."},{"Scope":["Integrity","Availability","Confidentiality"],"Impact":["DoS: Crash, Exit, or Restart","Execute Unauthorized Code or Commands","Read Memory","Modify Memory"],"Note":"A single fault could allow either an overflow (CWE-788) or underflow (CWE-786) of the array index. What happens next will depend on the type of operation being performed out of bounds, but can expose sensitive information, cause a system crash, or possibly lead to arbitrary code execution."}]},"Detection_Methods":{"Detection_Method":[{"Detection_Method_ID":"DM-1","Method":"Automated Static Analysis","Description":{"xhtml:p":["This weakness can often be detected using automated static analysis tools. Many modern tools use data flow analysis or constraint-based techniques to minimize the number of false positives.","Automated static analysis generally does not account for environmental considerations when reporting out-of-bounds memory operations. This can make it difficult for users to determine which warnings should be investigated first. For example, an analysis tool might report array index errors that originate from command line arguments in a program that is not expected to run with setuid or other special privileges."]},"Effectiveness":"High","Effectiveness_Notes":"This is not a perfect solution, since 100% accuracy and coverage are not feasible."},{"Detection_Method_ID":"DM-2","Method":"Automated Dynamic Analysis","Description":"This weakness can be detected using dynamic tools and techniques that interact with the software using large test suites with many diverse inputs, such as fuzz testing (fuzzing), robustness testing, and fault injection. The software\'s operation may slow down, but it should not become unstable, crash, or generate incorrect results."},{"Method":"Black Box","Description":"Black box methods might not get the needed code coverage within limited time constraints, and a dynamic test might not produce any noticeable side effects even if it is successful."}]},"Potential_Mitigations":{"Mitigation":[{"Mitigation_ID":"MIT-7","Phase":"Architecture and Design","Strategy":"Input Validation","Description":"Use an input validation framework such as Struts or the OWASP ESAPI Validation API. Note that using a framework does not automatically address all input validation problems; be mindful of weaknesses that could arise from misusing the framework itself (CWE-1173)."},{"Mitigation_ID":"MIT-15","Phase":"Architecture and Design","Description":{"xhtml:p":["For any security checks that are performed on the client side, ensure that these checks are duplicated on the server side, in order to avoid CWE-602. Attackers can bypass the client-side checks by modifying values after the checks have been performed, or by changing the client to remove the client-side checks entirely. Then, these modified values would be submitted to the server.","Even though client-side checks provide minimal benefits with respect to server-side security, they are still useful. First, they can support intrusion detection. If the server receives input that should have been rejected by the client, then it may be an indication of an attack. Second, client-side error-checking can provide helpful feedback to the user about the expectations for valid input. Third, there may be a reduction in server-side processing time for accidental input errors, although this is typically a small savings."]}},{"Mitigation_ID":"MIT-3","Phase":"Requirements","Strategy":"Language Selection","Description":{"xhtml:p":["Use a language that does not allow this weakness to occur or provides constructs that make this weakness easier to avoid.","For example, Ada allows the programmer to constrain the values of a variable and languages such as Java and Ruby will allow the programmer to handle exceptions when an out-of-bounds index is accessed."]}},{"Mitigation_ID":"MIT-11","Phase":"Operation","Strategy":"Environment Hardening","Description":{"xhtml:p":["Run or compile the software using features or extensions that randomly arrange the positions of a program\'s executable and libraries in memory. Because this makes the addresses unpredictable, it can prevent an attacker from reliably jumping to exploitable code.","Examples include Address Space Layout Randomization (ASLR) [REF-58] [REF-60] and Position-Independent Executables (PIE) [REF-64]."]},"Effectiveness":"Defense in Depth","Effectiveness_Notes":"This is not a complete solution. However, it forces the attacker to guess an unknown value that changes every program execution. In addition, an attack could still cause a denial of service, since the typical response is to exit the application."},{"Mitigation_ID":"MIT-12","Phase":"Operation","Strategy":"Environment Hardening","Description":"Use a CPU and operating system that offers Data Execution Protection (NX) or its equivalent [REF-60] [REF-61].","Effectiveness":"Defense in Depth","Effectiveness_Notes":"This is not a complete solution, since buffer overflows could be used to overwrite nearby variables to modify the software\'s state in dangerous ways. In addition, it cannot be used in cases in which self-modifying code is required. Finally, an attack could still cause a denial of service, since the typical response is to exit the application."},{"Mitigation_ID":"MIT-5","Phase":"Implementation","Strategy":"Input Validation","Description":{"xhtml:p":["Assume all input is malicious. Use an \\"accept known good\\" input validation strategy, i.e., use a list of acceptable inputs that strictly conform to specifications. Reject any input that does not strictly conform to specifications, or transform it into something that does.","When performing input validation, consider all potentially relevant properties, including length, type of input, the full range of acceptable values, missing or extra inputs, syntax, consistency across related fields, and conformance to business rules. As an example of business rule logic, \\"boat\\" may be syntactically valid because it only contains alphanumeric characters, but it is not valid if the input is only expected to contain colors such as \\"red\\" or \\"blue.\\"","Do not rely exclusively on looking for malicious or malformed inputs.  This is likely to miss at least one undesirable input, especially if the code\'s environment changes. This can give attackers enough room to bypass the intended validation. However, denylists can be useful for detecting potential attacks or determining which inputs are so malformed that they should be rejected outright.","When accessing a user-controlled array index, use a stringent range of values that are within the target array. Make sure that you do not allow negative values to be used. That is, verify the minimum as well as the maximum of the range of acceptable values."]}},{"Mitigation_ID":"MIT-35","Phase":"Implementation","Description":"Be especially careful to validate all input when invoking code that crosses language boundaries, such as from an interpreted language to native code. This could create an unexpected interaction between the language boundaries. Ensure that you are not violating any of the expectations of the language with which you are interfacing. For example, even though Java may not be susceptible to buffer overflows, providing a large argument in a call to native code might trigger an overflow."},{"Mitigation_ID":"MIT-17","Phase":["Architecture and Design","Operation"],"Strategy":"Environment Hardening","Description":"Run your code using the lowest privileges that are required to accomplish the necessary tasks [REF-76]. If possible, create isolated accounts with limited privileges that are only used for a single task. That way, a successful attack will not immediately give the attacker access to the rest of the software or its environment. For example, database applications rarely need to run as the database administrator, especially in day-to-day operations."},{"Mitigation_ID":"MIT-22","Phase":["Architecture and Design","Operation"],"Strategy":"Sandbox or Jail","Description":{"xhtml:p":["Run the code in a \\"jail\\" or similar sandbox environment that enforces strict boundaries between the process and the operating system. This may effectively restrict which files can be accessed in a particular directory or which commands can be executed by the software.","OS-level examples include the Unix chroot jail, AppArmor, and SELinux. In general, managed code may provide some protection. For example, java.io.FilePermission in the Java SecurityManager allows the software to specify restrictions on file operations.","This may not be a feasible solution, and it only limits the impact to the operating system; the rest of the application may still be subject to compromise.","Be careful to avoid CWE-243 and other weaknesses related to jails."]},"Effectiveness":"Limited","Effectiveness_Notes":"The effectiveness of this mitigation depends on the prevention capabilities of the specific sandbox or jail being used and might only help to reduce the scope of an attack, such as restricting the attacker to certain system calls or limiting the portion of the file system that can be accessed."}]},"Demonstrative_Examples":{"Demonstrative_Example":[{"Intro_Text":"In the code snippet below, an untrusted integer value is used to reference an object in an array.","Example_Code":{"Nature":"bad","Language":"Java","xhtml:div":{"$t":"public String getValue(int index) {}","xhtml:div":{"style":"margin-left:10px;","$t":"return array[index];"}}},"Body_Text":"If index is outside of the range of the array, this may result in an ArrayIndexOutOfBounds Exception being raised."},{"Demonstrative_Example_ID":"DX-34","Intro_Text":"The following example takes a user-supplied value to allocate an array of objects and then operates on the array.","Example_Code":{"Nature":"bad","Language":"Java","xhtml:div":{"xhtml:div":{"style":"margin-left:10px;","xhtml:div":{"style":"margin-left:10px;","$t":"die(\\"Negative value supplied for list size, die evil hacker!\\");"},"xhtml:br":[{},{}]}}},"Body_Text":"This example attempts to build a list from a user-specified value, and even checks to ensure a non-negative value is supplied. If, however, a 0 value is provided, the code will build an array of size 0 and then try to store a new Widget in the first location, causing an exception to be thrown."},{"Demonstrative_Example_ID":"DX-100","Intro_Text":"In the following code, the method retrieves a value from an array at a specific array index location that is given as an input parameter to the method","Example_Code":[{"Nature":"bad","Language":"C","xhtml:div":{"xhtml:div":{"style":"margin-left:10px;","xhtml:div":{"xhtml:br":[{},{},{},{},{},{},{},{},{},{},{},{}],"xhtml:i":["// check that the array index is less than the maximum","// length of the array","// if array index is invalid then output error message","// and return value indicating error"],"xhtml:div":[{"style":"margin-left:10px;","xhtml:div":{"xhtml:br":[{},{}],"xhtml:i":"// get the value at the specified index of the array"}},{"style":"margin-left:10px;","xhtml:br":{}}]}}}},{"Nature":"good","Language":"C","xhtml:div":{"xhtml:br":[{},{},{},{},{},{},{},{}],"xhtml:i":["// check that the array index is within the correct","// range of values for the array"]}}],"Body_Text":"However, this method only verifies that the given array index is less than the maximum length of the array but does not check for the minimum value (CWE-839). This will allow a negative value to be accepted as the input array index, which will result in a out of bounds read (CWE-125) and may allow access to sensitive memory. The input array index should be checked to verify that is within the maximum and minimum range required for the array (CWE-129). In this example the if statement should be modified to include a minimum range check, as shown below."},{"Demonstrative_Example_ID":"DX-134","Intro_Text":"The following example retrieves the sizes of messages for a pop3 mail server. The message sizes are retrieved from a socket that returns in a buffer the message number and the message size, the message number (num) and size (size) are extracted from the buffer and the message size is placed into an array using the message number for the array index.","Example_Code":[{"Nature":"bad","Language":"C","xhtml:div":{"$t":"int getsizes(int sock, int count, int *sizes) {}","xhtml:br":[{},{}],"xhtml:i":"/* capture the sizes of all messages */","xhtml:div":{"style":"margin-left:10px;","$t":"","xhtml:div":{"$t":"...char buf[BUFFER_SIZE];int ok;int num, size;\\n                           \\n                           \\n                           while ((ok = gen_recv(sock, buf, sizeof(buf))) == 0){}","xhtml:br":[{},{},{},{},{},{},{}],"xhtml:i":"// read values from socket and added to sizes array","xhtml:div":[{"style":"margin-left:10px;","$t":"","xhtml:div":{"$t":"if (DOTLINE(buf))\\n                                 else if (sscanf(buf, \\"%d %d\\", &num, &size) == 2)","xhtml:br":[{},{},{}],"xhtml:i":"// continue read from socket until buf only contains \'.\'","xhtml:div":[{"style":"margin-left:10px;","$t":"break;"},{"style":"margin-left:10px;","$t":"sizes[num - 1] = size;"}]}},{"style":"margin-left:10px;","$t":"..."}]}}}},{"Nature":"good","Language":"C","xhtml:div":{"$t":"int getsizes(int sock, int count, int *sizes) {}","xhtml:br":[{},{}],"xhtml:i":"/* capture the sizes of all messages */","xhtml:div":{"style":"margin-left:10px;","$t":"","xhtml:div":{"$t":"...char buf[BUFFER_SIZE];int ok;int num, size;\\n                           \\n                           \\n                           while ((ok = gen_recv(sock, buf, sizeof(buf))) == 0){}","xhtml:br":[{},{},{},{},{},{},{}],"xhtml:i":"// read values from socket and added to sizes array","xhtml:div":[{"style":"margin-left:10px;","xhtml:div":{"xhtml:br":[{},{},{}],"xhtml:i":"// continue read from socket until buf only contains \'.\'","xhtml:div":[{"style":"margin-left:10px;","$t":"break;"},{"style":"margin-left:10px;","xhtml:div":{"xhtml:div":[{"style":"margin-left:10px;","$t":"sizes[num - 1] = size;"},{"style":"margin-left:10px;","xhtml:div":{"xhtml:br":[{},{}],"xhtml:i":"/* warn about possible attempt to induce buffer overflow */"}}],"xhtml:br":{}}}]}},{"style":"margin-left:10px;","$t":"..."}]}}}}],"Body_Text":"In this example the message number retrieved from the buffer could be a value that is outside the allowable range of indices for the array and could possibly be a negative number. Without proper validation of the value to be used for the array index an array overflow could occur and could potentially lead to unauthorized access to memory addresses and system crashes. The value of the array index should be validated to ensure that it is within the allowable range of indices for the array as in the following code."},{"Demonstrative_Example_ID":"DX-133","Intro_Text":"In the following example the method displayProductSummary is called from a Web service servlet to retrieve product summary information for display to the user. The servlet obtains the integer value of the product number from the user and passes it to the displayProductSummary method. The displayProductSummary method passes the integer value of the product number to the getProductSummary method which obtains the product summary from the array object containing the project summaries using the integer value of the product number as the array index.","Example_Code":[{"Nature":"bad","Language":"Java","xhtml:div":{"$t":"public String displayProductSummary(int index) {\\n                     }\\n                     public String getProductSummary(int index) {}","xhtml:br":[{},{},{},{},{}],"xhtml:i":"// Method called from servlet to obtain product information","xhtml:div":[{"style":"margin-left:10px;","xhtml:div":{"xhtml:br":[{},{},{},{},{},{}],"xhtml:div":{"style":"margin-left:10px;","$t":"String productSummary = getProductSummary(index);"}}},{"style":"margin-left:10px;","$t":"return products[index];"}]}},{"Nature":"good","Language":"Java","xhtml:div":{"xhtml:br":[{},{},{},{},{}],"xhtml:i":"// Method called from servlet to obtain product information","xhtml:div":[{"style":"margin-left:10px;","xhtml:div":{"xhtml:br":[{},{},{},{},{},{}],"xhtml:div":{"style":"margin-left:10px;","$t":"String productSummary = getProductSummary(index);"}}},{"style":"margin-left:10px;","xhtml:div":{"xhtml:br":[{},{},{},{},{}],"xhtml:div":[{"style":"margin-left:10px;","$t":"productSummary = products[index];"},{"style":"margin-left:10px;","xhtml:br":{}}]}}]}},{"Nature":"good","Language":"Java","xhtml:div":{"$t":"ArrayList productArray = new ArrayList(MAX_PRODUCTS);...try {} catch (IndexOutOfBoundsException ex) {...}","xhtml:br":[{},{}],"xhtml:div":{"style":"margin-left:10px;","$t":"productSummary = (String) productArray.get(index);"}}}],"Body_Text":["In this example the integer value used as the array index that is provided by the user may be outside the allowable range of indices for the array which may provide unexpected results or cause the application to fail. The integer value used for the array index should be validated to ensure that it is within the allowable range of indices for the array as in the following code.","An alternative in Java would be to use one of the collection objects such as ArrayList that will automatically generate an exception if an attempt is made to access an array index that is out of bounds."]},{"Demonstrative_Example_ID":"DX-90","Intro_Text":"The following example asks a user for an offset into an array to select an item.","Example_Code":{"Nature":"bad","Language":"C","xhtml:div":{"xhtml:br":{},"xhtml:div":{"style":"margin-left:10px;","xhtml:br":[{},{}]}}},"Body_Text":"The programmer allows the user to specify which element in the list to select, however an attacker can provide an out-of-bounds offset, resulting in a buffer over-read (CWE-126)."}]},"Observed_Examples":{"Observed_Example":[{"Reference":"CVE-2005-0369","Description":"large ID in packet used as array index","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2005-0369"},{"Reference":"CVE-2001-1009","Description":"negative array index as argument to POP LIST command","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2001-1009"},{"Reference":"CVE-2003-0721","Description":"Integer signedness error leads to negative array index","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2003-0721"},{"Reference":"CVE-2004-1189","Description":"product does not properly track a count and a maximum number, which can lead to resultant array index overflow.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2004-1189"},{"Reference":"CVE-2007-5756","Description":"Chain: device driver for packet-capturing software allows access to an unintended IOCTL with resultant array index error.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2007-5756"},{"Reference":"CVE-2005-2456","Description":"Chain: array index error (CWE-129) leads to deadlock (CWE-833)","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2005-2456"}]},"Affected_Resources":{"Affected_Resource":"Memory"},"Taxonomy_Mappings":{"Taxonomy_Mapping":[{"Taxonomy_Name":"CLASP","Entry_Name":"Unchecked array indexing"},{"Taxonomy_Name":"PLOVER","Entry_Name":"INDEX - Array index overflow"},{"Taxonomy_Name":"CERT C Secure Coding","Entry_ID":"ARR00-C","Entry_Name":"Understand how arrays work"},{"Taxonomy_Name":"CERT C Secure Coding","Entry_ID":"ARR30-C","Entry_Name":"Do not form or use out-of-bounds pointers or array subscripts","Mapping_Fit":"CWE More Specific"},{"Taxonomy_Name":"CERT C Secure Coding","Entry_ID":"ARR38-C","Entry_Name":"Do not add or subtract an integer to a pointer if the resulting value does not refer to a valid array element"},{"Taxonomy_Name":"CERT C Secure Coding","Entry_ID":"INT32-C","Entry_Name":"Ensure that operations on signed integers do not result in overflow"},{"Taxonomy_Name":"SEI CERT Perl Coding Standard","Entry_ID":"IDS32-PL","Entry_Name":"Validate any integer that is used as an array index","Mapping_Fit":"Imprecise"},{"Taxonomy_Name":"OMG ASCSM","Entry_ID":"ASCSM-CWE-129"}]},"Related_Attack_Patterns":{"Related_Attack_Pattern":{"CAPEC_ID":"100"}},"References":{"Reference":[{"External_Reference_ID":"REF-7","Section":"Chapter 5, \\"Array Indexing Errors\\" Page 144"},{"External_Reference_ID":"REF-96"},{"External_Reference_ID":"REF-58"},{"External_Reference_ID":"REF-60"},{"External_Reference_ID":"REF-61"},{"External_Reference_ID":"REF-76"},{"External_Reference_ID":"REF-44","Section":"\\"Sin 5: Buffer Overruns.\\" Page 89"},{"External_Reference_ID":"REF-64"},{"External_Reference_ID":"REF-962","Section":"ASCSM-CWE-129"}]},"Notes":{"Note":[{"Type":"Relationship","$t":"This weakness can precede uncontrolled memory allocation (CWE-789) in languages that automatically expand an array when an index is used that is larger than the size of the array, such as JavaScript."},{"Type":"Theoretical","$t":"An improperly validated array index might lead directly to the always-incorrect behavior of \\"access of array using out-of-bounds index.\\""}]},"Content_History":{"Submission":{"Submission_Name":"CLASP","Submission_Date":"2006-07-19"},"Modification":[{"Modification_Name":"Sean Eidemiller","Modification_Organization":"Cigital","Modification_Date":"2008-07-01","Modification_Comment":"added/updated demonstrative examples"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2008-09-08","Modification_Comment":"updated Alternate_Terms, Applicable_Platforms, Common_Consequences, Relationships, Other_Notes, Taxonomy_Mappings, Weakness_Ordinalities"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2008-11-24","Modification_Comment":"updated Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2009-01-12","Modification_Comment":"updated Common_Consequences"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2009-10-29","Modification_Comment":"updated Description, Name, Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2009-12-28","Modification_Comment":"updated Applicable_Platforms, Common_Consequences, Observed_Examples, Other_Notes, Potential_Mitigations, Theoretical_Notes, Weakness_Ordinalities"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2010-02-16","Modification_Comment":"updated Applicable_Platforms, Demonstrative_Examples, Detection_Factors, Likelihood_of_Exploit, Potential_Mitigations, References, Related_Attack_Patterns, Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2010-04-05","Modification_Comment":"updated Related_Attack_Patterns"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2010-06-21","Modification_Comment":"updated Common_Consequences, Potential_Mitigations, References"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2010-09-27","Modification_Comment":"updated Potential_Mitigations, Relationship_Notes, Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2010-12-13","Modification_Comment":"updated Demonstrative_Examples, Observed_Examples, Potential_Mitigations"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-03-29","Modification_Comment":"updated Common_Consequences, Demonstrative_Examples, Weakness_Ordinalities"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-06-01","Modification_Comment":"updated Common_Consequences"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-06-27","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-09-13","Modification_Comment":"updated Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2012-05-11","Modification_Comment":"updated Demonstrative_Examples, Potential_Mitigations, References, Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2012-10-30","Modification_Comment":"updated Potential_Mitigations"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2014-02-18","Modification_Comment":"updated Potential_Mitigations, References"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2014-07-30","Modification_Comment":"updated Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2015-12-07","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2017-11-08","Modification_Comment":"updated Causal_Nature, References, Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2018-03-27","Modification_Comment":"updated References"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2019-01-03","Modification_Comment":"updated References, Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2019-09-19","Modification_Comment":"updated Potential_Mitigations"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-02-24","Modification_Comment":"updated Potential_Mitigations, Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-06-25","Modification_Comment":"updated Demonstrative_Examples, Potential_Mitigations, Relationships, Type"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-08-20","Modification_Comment":"updated Potential_Mitigations, Relationships"}],"Previous_Entry_Name":{"Date":"2009-10-29","$t":"Unchecked Array Indexing"}}},{"ID":"130","Name":"Improper Handling of Length Parameter Inconsistency","Abstraction":"Base","Structure":"Simple","Status":"Incomplete","Description":"The software parses a formatted message or structure, but it does not handle or incorrectly handles a length field that is inconsistent with the actual length of the associated data.","Extended_Description":"If an attacker can manipulate the length parameter associated with an input such that it is inconsistent with the actual length of the input, this can be leveraged to cause the target application to behave in unexpected, and possibly, malicious ways. One of the possible motives for doing so is to pass in arbitrarily large input to the application. Another possible motivation is the modification of application state by including invalid data for subsequent properties of the application. Such weaknesses commonly lead to attacks such as buffer overflows and execution of arbitrary code.","Related_Weaknesses":{"Related_Weakness":[{"Nature":"ChildOf","CWE_ID":"240","View_ID":"1000","Ordinal":"Primary"},{"Nature":"ChildOf","CWE_ID":"119","View_ID":"1305","Ordinal":"Primary"},{"Nature":"CanPrecede","CWE_ID":"805","View_ID":"1000"}]},"Weakness_Ordinalities":{"Weakness_Ordinality":{"Ordinality":"Primary"}},"Applicable_Platforms":{"Language":[{"Name":"C","Prevalence":"Sometimes"},{"Name":"C++","Prevalence":"Sometimes"},{"Class":"Language-Independent","Prevalence":"Undetermined"}]},"Alternate_Terms":{"Alternate_Term":[{"Term":"length manipulation"},{"Term":"length tampering"}]},"Modes_Of_Introduction":{"Introduction":[{"Phase":"Architecture and Design"},{"Phase":"Implementation"}]},"Common_Consequences":{"Consequence":{"Scope":["Confidentiality","Integrity"],"Impact":["Read Memory","Modify Memory","Varies by Context"]}},"Potential_Mitigations":{"Mitigation":[{"Phase":"Implementation","Description":"When processing structured incoming data containing a size field followed by raw data, ensure that you identify and resolve any inconsistencies between the size field and the actual size of the data."},{"Phase":"Implementation","Description":"Do not let the user control the size of the buffer."},{"Phase":"Implementation","Description":"Validate that the length of the user-supplied data is consistent with the buffer size."}]},"Demonstrative_Examples":{"Demonstrative_Example":{"Demonstrative_Example_ID":"DX-91","Intro_Text":"In the following C/C++ example the method processMessageFromSocket() will get a message from a socket, placed into a buffer, and will parse the contents of the buffer into a structure that contains the message length and the message body. A for loop is used to copy the message body into a local character string which will be passed to another method for processing.","Example_Code":{"Nature":"bad","Language":"C","xhtml:div":{"xhtml:div":{"style":"margin-left:10px;","xhtml:div":{"xhtml:br":[{},{},{},{},{},{},{},{},{}],"xhtml:i":["// get message from socket and store into buffer","//Ignoring possibliity that buffer > BUFFER_SIZE"],"xhtml:div":{"style":"margin-left:10px;","xhtml:div":{"xhtml:br":[{},{},{},{},{},{},{},{},{},{}],"xhtml:i":["// place contents of the buffer into message structure","// copy message body into string for processing","// process message"],"xhtml:div":{"style":"margin-left:10px;","$t":"message[index] = msg->msgBody[index];"}}}}}}},"Body_Text":"However, the message length variable from the structure is used as the condition for ending the for loop without validating that the message length variable accurately reflects the length of the message body (CWE-606). This can result in a buffer over-read (CWE-125) by reading from memory beyond the bounds of the buffer if the message length variable indicates a length that is longer than the size of a message body (CWE-130)."}},"Observed_Examples":{"Observed_Example":[{"Reference":"CVE-2014-0160","Description":"Chain: \\"Heartbleed\\" bug receives an inconsistent length parameter (CWE-130) enabling an out-of-bounds read (CWE-126), returning memory that could include private cryptographic keys and other sensitive data.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2014-0160"},{"Reference":"CVE-2009-2299","Description":"Web application firewall consumes excessive memory when an HTTP request contains a large Content-Length value but no POST data.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2009-2299"},{"Reference":"CVE-2001-0825","Description":"Buffer overflow in internal string handling routine allows remote attackers to execute arbitrary commands via a length argument of zero or less, which disables the length check.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2001-0825"},{"Reference":"CVE-2001-1186","Description":"Web server allows remote attackers to cause a denial of service via an HTTP request with a content-length value that is larger than the size of the request, which prevents server from timing out the connection.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2001-1186"},{"Reference":"CVE-2001-0191","Description":"Service does not properly check the specified length of a cookie, which allows remote attackers to execute arbitrary commands via a buffer overflow, or brute force authentication by using a short cookie length.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2001-0191"},{"Reference":"CVE-2003-0429","Description":"Traffic analyzer allows remote attackers to cause a denial of service and possibly execute arbitrary code via invalid IPv4 or IPv6 prefix lengths, possibly triggering a buffer overflow.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2003-0429"},{"Reference":"CVE-2000-0655","Description":"Chat client allows remote attackers to cause a denial of service or execute arbitrary commands via a JPEG image containing a comment with an illegal field length of 1.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2000-0655"},{"Reference":"CVE-2004-0492","Description":"Server allows remote attackers to cause a denial of service and possibly execute arbitrary code via a negative Content-Length HTTP header field causing a heap-based buffer overflow.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2004-0492"},{"Reference":"CVE-2004-0201","Description":"Help program allows remote attackers to execute arbitrary commands via a heap-based buffer overflow caused by a .CHM file with a large length field","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2004-0201"},{"Reference":"CVE-2003-0825","Description":"Name services does not properly validate the length of certain packets, which allows attackers to cause a denial of service and possibly execute arbitrary code. Can overlap zero-length issues","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2003-0825"},{"Reference":"CVE-2004-0095","Description":"Policy manager allows remote attackers to cause a denial of service (memory consumption and crash) and possibly execute arbitrary code via an HTTP POST request with an invalid Content-Length value.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2004-0095"},{"Reference":"CVE-2004-0826","Description":"Heap-based buffer overflow in library allows remote attackers to execute arbitrary code via a modified record length field in an SSLv2 client hello message.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2004-0826"},{"Reference":"CVE-2004-0808","Description":"When domain logons are enabled, server allows remote attackers to cause a denial of service via a SAM_UAS_CHANGE request with a length value that is larger than the number of structures that are provided.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2004-0808"},{"Reference":"CVE-2002-1357","Description":"Multiple SSH2 servers and clients do not properly handle packets or data elements with incorrect length specifiers, which may allow remote attackers to cause a denial of service or possibly execute arbitrary code.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2002-1357"},{"Reference":"CVE-2004-0774","Description":"Server allows remote attackers to cause a denial of service (CPU and memory exhaustion) via a POST request with a Content-Length header set to -1.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2004-0774"},{"Reference":"CVE-2004-0989","Description":"Multiple buffer overflows in xml library that may allow remote attackers to execute arbitrary code via long URLs.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2004-0989"},{"Reference":"CVE-2004-0568","Description":"Application does not properly validate the length of a value that is saved in a session file, which allows remote attackers to execute arbitrary code via a malicious session file (.ht), web site, or Telnet URL contained in an e-mail message, triggering a buffer overflow.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2004-0568"},{"Reference":"CVE-2003-0327","Description":"Server allows remote attackers to cause a denial of service via a remote password array with an invalid length, which triggers a heap-based buffer overflow.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2003-0327"},{"Reference":"CVE-2003-0345","Description":"Product allows remote attackers to cause a denial of service and possibly execute arbitrary code via an SMB packet that specifies a smaller buffer length than is required.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2003-0345"},{"Reference":"CVE-2004-0430","Description":"Server allows remote attackers to execute arbitrary code via a LoginExt packet for a Cleartext Password User Authentication Method (UAM) request with a PathName argument that includes an AFPName type string that is longer than the associated length field.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2004-0430"},{"Reference":"CVE-2005-0064","Description":"PDF viewer allows remote attackers to execute arbitrary code via a PDF file with a large /Encrypt /Length keyLength value.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2005-0064"},{"Reference":"CVE-2004-0413","Description":"SVN client trusts the length field of SVN protocol URL strings, which allows remote attackers to cause a denial of service and possibly execute arbitrary code via an integer overflow that leads to a heap-based buffer overflow.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2004-0413"},{"Reference":"CVE-2004-0940","Description":"Is effectively an accidental double increment of a counter that prevents a length check conditional from exiting a loop.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2004-0940"},{"Reference":"CVE-2002-1235","Description":"Length field of a request not verified.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2002-1235"},{"Reference":"CVE-2005-3184","Description":"Buffer overflow by modifying a length value.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2005-3184"},{"Reference":"SECUNIA:18747","Description":"Length field inconsistency crashes cell phone.","Link":"http://secunia.com/advisories/18747/"}]},"Taxonomy_Mappings":{"Taxonomy_Mapping":{"Taxonomy_Name":"PLOVER","Entry_Name":"Length Parameter Inconsistency"}},"Related_Attack_Patterns":{"Related_Attack_Pattern":{"CAPEC_ID":"47"}},"Notes":{"Note":{"Type":"Relationship","$t":"This probably overlaps other categories including zero-length issues."}},"Content_History":{"Submission":{"Submission_Name":"PLOVER","Submission_Date":"2006-07-19"},"Modification":[{"Modification_Name":"Eric Dalci","Modification_Organization":"Cigital","Modification_Date":"2008-07-01","Modification_Comment":"updated Potential_Mitigations, Time_of_Introduction"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2008-09-08","Modification_Comment":"updated Applicable_Platforms, Description, Name, Relationships, Observed_Example, Relationship_Notes, Taxonomy_Mappings, Weakness_Ordinalities"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2009-03-10","Modification_Comment":"updated Description, Name"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2009-12-28","Modification_Comment":"updated Observed_Examples"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2010-02-16","Modification_Comment":"updated Description, Potential_Mitigations, Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2010-12-13","Modification_Comment":"updated Potential_Mitigations"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-03-29","Modification_Comment":"updated Demonstrative_Examples"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-06-01","Modification_Comment":"updated Common_Consequences"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-06-27","Modification_Comment":"updated Common_Consequences"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2012-05-11","Modification_Comment":"updated Observed_Examples, Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2012-10-30","Modification_Comment":"updated Potential_Mitigations"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2013-07-17","Modification_Comment":"updated Type"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2014-06-23","Modification_Comment":"updated Observed_Examples"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2014-07-30","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2017-01-19","Modification_Comment":"updated Type"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2017-11-08","Modification_Comment":"updated Applicable_Platforms, Causal_Nature, Demonstrative_Examples"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-02-24","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-06-25","Modification_Comment":"updated Common_Consequences, Demonstrative_Examples"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-08-20","Modification_Comment":"updated Relationships"}],"Previous_Entry_Name":[{"Date":"2008-09-09","$t":"Length Parameter Inconsistency"},{"Date":"2009-03-10","$t":"Failure to Handle Length Parameter Inconsistency"}]}},{"ID":"131","Name":"Incorrect Calculation of Buffer Size","Abstraction":"Base","Structure":"Simple","Status":"Draft","Description":"The software does not correctly calculate the size to be used when allocating a buffer, which could lead to a buffer overflow.","Related_Weaknesses":{"Related_Weakness":[{"Nature":"ChildOf","CWE_ID":"682","View_ID":"1000","Ordinal":"Primary"},{"Nature":"ChildOf","CWE_ID":"682","View_ID":"1003","Ordinal":"Primary"},{"Nature":"ChildOf","CWE_ID":"682","View_ID":"1305","Ordinal":"Primary"},{"Nature":"CanPrecede","CWE_ID":"119","View_ID":"1000"}]},"Applicable_Platforms":{"Language":[{"Name":"C","Prevalence":"Undetermined"},{"Name":"C++","Prevalence":"Undetermined"}]},"Modes_Of_Introduction":{"Introduction":{"Phase":"Implementation"}},"Likelihood_Of_Exploit":"High","Common_Consequences":{"Consequence":{"Scope":["Integrity","Availability","Confidentiality"],"Impact":["DoS: Crash, Exit, or Restart","Execute Unauthorized Code or Commands","Read Memory","Modify Memory"],"Note":"If the incorrect calculation is used in the context of memory allocation, then the software may create a buffer that is smaller or larger than expected. If the allocated buffer is smaller than expected, this could lead to an out-of-bounds read or write (CWE-119), possibly causing a crash, allowing arbitrary code execution, or exposing sensitive data."}},"Detection_Methods":{"Detection_Method":[{"Detection_Method_ID":"DM-1","Method":"Automated Static Analysis","Description":{"xhtml:p":["This weakness can often be detected using automated static analysis tools. Many modern tools use data flow analysis or constraint-based techniques to minimize the number of false positives.","Automated static analysis generally does not account for environmental considerations when reporting potential errors in buffer calculations. This can make it difficult for users to determine which warnings should be investigated first. For example, an analysis tool might report buffer overflows that originate from command line arguments in a program that is not expected to run with setuid or other special privileges."]},"Effectiveness":"High","Effectiveness_Notes":"Detection techniques for buffer-related errors are more mature than for most other weakness types."},{"Detection_Method_ID":"DM-2","Method":"Automated Dynamic Analysis","Description":"This weakness can be detected using dynamic tools and techniques that interact with the software using large test suites with many diverse inputs, such as fuzz testing (fuzzing), robustness testing, and fault injection. The software\'s operation may slow down, but it should not become unstable, crash, or generate incorrect results.","Effectiveness":"Moderate","Effectiveness_Notes":"Without visibility into the code, black box methods may not be able to sufficiently distinguish this weakness from others, requiring follow-up manual methods to diagnose the underlying problem."},{"Detection_Method_ID":"DM-9","Method":"Manual Analysis","Description":"Manual analysis can be useful for finding this weakness, but it might not achieve desired code coverage within limited time constraints. This becomes difficult for weaknesses that must be considered for all inputs, since the attack surface can be too large."},{"Detection_Method_ID":"DM-7","Method":"Manual Analysis","Description":{"xhtml:p":["This weakness can be detected using tools and techniques that require manual (human) analysis, such as penetration testing, threat modeling, and interactive tools that allow the tester to record and modify an active session.","Specifically, manual static analysis is useful for evaluating the correctness of allocation calculations. This can be useful for detecting overflow conditions (CWE-190) or similar weaknesses that might have serious security impacts on the program."]},"Effectiveness":"High","Effectiveness_Notes":"These may be more effective than strictly automated techniques. This is especially the case with weaknesses that are related to design and business rules."},{"Method":"Automated Static Analysis - Binary or Bytecode","Description":{"xhtml:p":"According to SOAR, the following detection techniques may be useful:","xhtml:div":{"style":"margin-left:10px;","xhtml:div":["Highly cost effective:",{"style":"margin-left:10px;","xhtml:ul":{"xhtml:li":["Bytecode Weakness Analysis - including disassembler + source code weakness analysis","Binary Weakness Analysis - including disassembler + source code weakness analysis"]}}]}},"Effectiveness":"High"},{"Method":"Manual Static Analysis - Binary or Bytecode","Description":{"xhtml:p":"According to SOAR, the following detection techniques may be useful:","xhtml:div":{"style":"margin-left:10px;","xhtml:div":["Cost effective for partial coverage:",{"style":"margin-left:10px;","xhtml:ul":{"xhtml:li":"Binary / Bytecode disassembler - then use manual analysis for vulnerabilities & anomalies"}}]}},"Effectiveness":"SOAR Partial"},{"Method":"Manual Static Analysis - Source Code","Description":{"xhtml:p":"According to SOAR, the following detection techniques may be useful:","xhtml:div":{"style":"margin-left:10px;","xhtml:div":["Cost effective for partial coverage:",{"style":"margin-left:10px;","xhtml:ul":{"xhtml:li":["Focused Manual Spotcheck - Focused manual analysis of source","Manual Source Code Review (not inspections)"]}}]}},"Effectiveness":"SOAR Partial"},{"Method":"Automated Static Analysis - Source Code","Description":{"xhtml:p":"According to SOAR, the following detection techniques may be useful:","xhtml:div":{"style":"margin-left:10px;","xhtml:div":["Highly cost effective:",{"style":"margin-left:10px;","xhtml:ul":{"xhtml:li":["Source code Weakness Analyzer","Context-configured Source Code Weakness Analyzer"]}},"Cost effective for partial coverage:",{"style":"margin-left:10px;","xhtml:ul":{"xhtml:li":"Source Code Quality Analyzer"}}]}},"Effectiveness":"High"},{"Method":"Architecture or Design Review","Description":{"xhtml:p":"According to SOAR, the following detection techniques may be useful:","xhtml:div":{"style":"margin-left:10px;","xhtml:div":["Highly cost effective:",{"style":"margin-left:10px;","xhtml:ul":{"xhtml:li":"Formal Methods / Correct-By-Construction"}},"Cost effective for partial coverage:",{"style":"margin-left:10px;","xhtml:ul":{"xhtml:li":"Inspection (IEEE 1028 standard) (can apply to requirements, design, source code, etc.)"}}]}},"Effectiveness":"High"}]},"Potential_Mitigations":{"Mitigation":[{"Phase":"Implementation","Description":"When allocating a buffer for the purpose of transforming, converting, or encoding an input, allocate enough memory to handle the largest possible encoding. For example, in a routine that converts \\"&\\" characters to \\"&amp;\\" for HTML entity encoding, the output buffer needs to be at least 5 times as large as the input buffer."},{"Mitigation_ID":"MIT-36","Phase":"Implementation","Description":{"xhtml:p":["Understand the programming language\'s underlying representation and how it interacts with numeric calculation (CWE-681). Pay close attention to byte size discrepancies, precision, signed/unsigned distinctions, truncation, conversion and casting between types, \\"not-a-number\\" calculations, and how the language handles numbers that are too large or too small for its underlying representation. [REF-7]","Also be careful to account for 32-bit, 64-bit, and other potential differences that may affect the numeric representation."]}},{"Mitigation_ID":"MIT-8","Phase":"Implementation","Strategy":"Input Validation","Description":"Perform input validation on any numeric input by ensuring that it is within the expected range. Enforce that the input meets both the minimum and maximum requirements for the expected range."},{"Mitigation_ID":"MIT-15","Phase":"Architecture and Design","Description":"For any security checks that are performed on the client side, ensure that these checks are duplicated on the server side, in order to avoid CWE-602. Attackers can bypass the client-side checks by modifying values after the checks have been performed, or by changing the client to remove the client-side checks entirely. Then, these modified values would be submitted to the server."},{"Phase":"Implementation","Description":"When processing structured incoming data containing a size field followed by raw data, identify and resolve any inconsistencies between the size field and the actual size of the data (CWE-130)."},{"Phase":"Implementation","Description":"When allocating memory that uses sentinels to mark the end of a data structure - such as NUL bytes in strings - make sure you also include the sentinel in your calculation of the total amount of memory that must be allocated."},{"Mitigation_ID":"MIT-13","Phase":"Implementation","Description":"Replace unbounded copy functions with analogous functions that support length arguments, such as strcpy with strncpy. Create these if they are not available.","Effectiveness":"Moderate","Effectiveness_Notes":"This approach is still susceptible to calculation errors, including issues such as off-by-one errors (CWE-193) and incorrectly calculating buffer lengths (CWE-131). Additionally, this only addresses potential overflow issues. Resource consumption / exhaustion issues are still possible."},{"Phase":"Implementation","Description":"Use sizeof() on the appropriate data type to avoid CWE-467."},{"Phase":"Implementation","Description":"Use the appropriate type for the desired action. For example, in C/C++, only use unsigned types for values that could never be negative, such as height, width, or other numbers related to quantity. This will simplify sanity checks and will reduce surprises related to unexpected casting."},{"Mitigation_ID":"MIT-4","Phase":"Architecture and Design","Strategy":"Libraries or Frameworks","Description":{"xhtml:p":["Use a vetted library or framework that does not allow this weakness to occur or provides constructs that make this weakness easier to avoid.","Use libraries or frameworks that make it easier to handle numbers without unexpected consequences, or buffer allocation routines that automatically track buffer size.","Examples include safe integer handling packages such as SafeInt (C++) or IntegerLib (C or C++). [REF-106]"]}},{"Mitigation_ID":"MIT-10","Phase":"Build and Compilation","Strategy":"Compilation or Build Hardening","Description":{"xhtml:p":["Run or compile the software using features or extensions that automatically provide a protection mechanism that mitigates or eliminates buffer overflows.","For example, certain compilers and extensions provide automatic buffer overflow detection mechanisms that are built into the compiled code. Examples include the Microsoft Visual Studio /GS flag, Fedora/Red Hat FORTIFY_SOURCE GCC flag, StackGuard, and ProPolice."]},"Effectiveness":"Defense in Depth","Effectiveness_Notes":"This is not necessarily a complete solution, since these mechanisms can only detect certain types of overflows. In addition, an attack could still cause a denial of service, since the typical response is to exit the application."},{"Mitigation_ID":"MIT-11","Phase":"Operation","Strategy":"Environment Hardening","Description":{"xhtml:p":["Run or compile the software using features or extensions that randomly arrange the positions of a program\'s executable and libraries in memory. Because this makes the addresses unpredictable, it can prevent an attacker from reliably jumping to exploitable code.","Examples include Address Space Layout Randomization (ASLR) [REF-58] [REF-60] and Position-Independent Executables (PIE) [REF-64]."]},"Effectiveness":"Defense in Depth","Effectiveness_Notes":"This is not a complete solution. However, it forces the attacker to guess an unknown value that changes every program execution. In addition, an attack could still cause a denial of service, since the typical response is to exit the application."},{"Mitigation_ID":"MIT-12","Phase":"Operation","Strategy":"Environment Hardening","Description":"Use a CPU and operating system that offers Data Execution Protection (NX) or its equivalent [REF-61] [REF-60].","Effectiveness":"Defense in Depth","Effectiveness_Notes":"This is not a complete solution, since buffer overflows could be used to overwrite nearby variables to modify the software\'s state in dangerous ways. In addition, it cannot be used in cases in which self-modifying code is required. Finally, an attack could still cause a denial of service, since the typical response is to exit the application."},{"Mitigation_ID":"MIT-26","Phase":"Implementation","Strategy":"Compilation or Build Hardening","Description":"Examine compiler warnings closely and eliminate problems with potential security implications, such as signed / unsigned mismatch in memory operations, or use of uninitialized variables. Even if the weakness is rarely exploitable, a single failure may lead to the compromise of the entire system."},{"Mitigation_ID":"MIT-17","Phase":["Architecture and Design","Operation"],"Strategy":"Environment Hardening","Description":"Run your code using the lowest privileges that are required to accomplish the necessary tasks [REF-76]. If possible, create isolated accounts with limited privileges that are only used for a single task. That way, a successful attack will not immediately give the attacker access to the rest of the software or its environment. For example, database applications rarely need to run as the database administrator, especially in day-to-day operations."},{"Mitigation_ID":"MIT-22","Phase":["Architecture and Design","Operation"],"Strategy":"Sandbox or Jail","Description":{"xhtml:p":["Run the code in a \\"jail\\" or similar sandbox environment that enforces strict boundaries between the process and the operating system. This may effectively restrict which files can be accessed in a particular directory or which commands can be executed by the software.","OS-level examples include the Unix chroot jail, AppArmor, and SELinux. In general, managed code may provide some protection. For example, java.io.FilePermission in the Java SecurityManager allows the software to specify restrictions on file operations.","This may not be a feasible solution, and it only limits the impact to the operating system; the rest of the application may still be subject to compromise.","Be careful to avoid CWE-243 and other weaknesses related to jails."]},"Effectiveness":"Limited","Effectiveness_Notes":"The effectiveness of this mitigation depends on the prevention capabilities of the specific sandbox or jail being used and might only help to reduce the scope of an attack, such as restricting the attacker to certain system calls or limiting the portion of the file system that can be accessed."}]},"Demonstrative_Examples":{"Demonstrative_Example":[{"Demonstrative_Example_ID":"DX-20","Intro_Text":"The following code allocates memory for a maximum number of widgets. It then gets a user-specified number of widgets, making sure that the user does not request too many. It then initializes the elements of the array using InitializeWidget(). Because the number of widgets can vary for each request, the code inserts a NULL pointer to signify the location of the last widget.","Example_Code":{"Nature":"bad","Language":"C","xhtml:div":{"xhtml:br":[{},{},{},{},{},{},{},{},{},{}],"xhtml:div":[{"style":"margin-left:10px;","$t":"ExitError(\\"Incorrect number of widgets requested!\\");"},{"style":"margin-left:10px;","$t":"WidgetList[i] = InitializeWidget();"}]}},"Body_Text":"However, this code contains an off-by-one calculation error. It allocates exactly enough space to contain the specified number of widgets, but it does not include the space for the NULL pointer. As a result, the allocated buffer is smaller than it is supposed to be. So if the user ever requests MAX_NUM_WIDGETS, there is an off-by-one buffer overflow (CWE-193) when the NULL is assigned. Depending on the environment and compilation settings, this could cause memory corruption."},{"Demonstrative_Example_ID":"DX-33","Intro_Text":"The following image processing code allocates a table for images.","Example_Code":{"Nature":"bad","Language":"C","xhtml:div":{"xhtml:br":[{},{},{},{},{}]}},"Body_Text":"This code intends to allocate a table of size num_imgs, however as num_imgs grows large, the calculation determining the size of the list will eventually overflow (CWE-190). This will result in a very small list to be allocated instead. If the subsequent code operates on the list as if it were num_imgs long, it may result in many types of out-of-bounds problems (CWE-119)."},{"Demonstrative_Example_ID":"DX-19","Intro_Text":"This example applies an encoding procedure to an input string and stores it into a buffer.","Example_Code":{"Nature":"bad","Language":"C","xhtml:div":{"xhtml:div":{"style":"margin-left:10px;","xhtml:div":{"xhtml:br":[{},{},{},{},{}],"xhtml:div":[{"style":"margin-left:10px;","$t":"die(\\"user string too long, die evil hacker!\\");"},{"style":"margin-left:10px;","xhtml:div":{"xhtml:div":[{"style":"margin-left:10px;","xhtml:br":[{},{},{},{}]},{"style":"margin-left:10px;","xhtml:div":{"xhtml:br":[{},{}],"xhtml:i":"/* encode to &lt; */"}}],"xhtml:br":[{},{}]}}]}}}},"Body_Text":"The programmer attempts to encode the ampersand character in the user-controlled string, however the length of the string is validated before the encoding procedure is applied. Furthermore, the programmer assumes encoding expansion will only expand a given character by a factor of 4, while the encoding of the ampersand expands by 5. As a result, when the encoding procedure expands the string it is possible to overflow the destination buffer if the attacker provides a string of many ampersands."},{"Demonstrative_Example_ID":"DX-21","Intro_Text":"The following code is intended to read an incoming packet from a socket and extract one or more headers.","Example_Code":{"Nature":"bad","Language":"C","xhtml:div":{"xhtml:br":[{},{},{},{},{},{},{},{},{},{}],"xhtml:div":{"style":"margin-left:10px;","$t":"ExitError(\\"too many headers!\\");"}}},"Body_Text":"The code performs a check to make sure that the packet does not contain too many headers. However, numHeaders is defined as a signed int, so it could be negative. If the incoming packet specifies a value such as -3, then the malloc calculation will generate a negative number (say, -300 if each header can be a maximum of 100 bytes). When this result is provided to malloc(), it is first converted to a size_t type. This conversion then produces a large value such as 4294966996, which may cause malloc() to fail or to allocate an extremely large amount of memory (CWE-195). With the appropriate negative numbers, an attacker could trick malloc() into using a very small positive number, which then allocates a buffer that is much smaller than expected, potentially leading to a buffer overflow."},{"Intro_Text":"The following code attempts to save three different identification numbers into an array. The array is allocated from memory using a call to malloc().","Example_Code":{"Nature":"bad","Language":"C","xhtml:div":{"xhtml:br":[{},{},{},{},{},{},{},{},{},{},{},{},{}],"xhtml:i":["/* Allocate space for an array of three ids. */","/* Populate the id array. */"]}},"Body_Text":["The problem with the code above is the value of the size parameter used during the malloc() call. It uses a value of \'3\' which by definition results in a buffer of three bytes to be created. However the intention was to create a buffer that holds three ints, and in C, each int requires 4 bytes worth of memory, so an array of 12 bytes is needed, 4 bytes for each int. Executing the above code could result in a buffer overflow as 12 bytes of data is being saved into 3 bytes worth of allocated space. The overflow would occur during the assignment of id_sequence[0] and would continue with the assignment of id_sequence[1] and id_sequence[2].","The malloc() call could have used \'3*sizeof(int)\' as the value for the size parameter in order to allocate the correct amount of space required to store the three ints."]}]},"Observed_Examples":{"Observed_Example":[{"Reference":"CVE-2004-1363","Description":"substitution overflow: buffer overflow using environment variables that are expanded after the length check is performed","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2004-1363"},{"Reference":"CVE-2004-0747","Description":"substitution overflow: buffer overflow using expansion of environment variables","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2004-0747"},{"Reference":"CVE-2005-2103","Description":"substitution overflow: buffer overflow using a large number of substitution strings","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2005-2103"},{"Reference":"CVE-2005-3120","Description":"transformation overflow: product adds extra escape characters to incoming data, but does not account for them in the buffer length","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2005-3120"},{"Reference":"CVE-2003-0899","Description":"transformation overflow: buffer overflow when expanding \\">\\" to \\"&gt;\\", etc.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2003-0899"},{"Reference":"CVE-2001-0334","Description":"expansion overflow: buffer overflow using wildcards","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2001-0334"},{"Reference":"CVE-2001-0248","Description":"expansion overflow: long pathname + glob = overflow","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2001-0248"},{"Reference":"CVE-2001-0249","Description":"expansion overflow: long pathname + glob = overflow","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2001-0249"},{"Reference":"CVE-2002-0184","Description":"special characters in argument are not properly expanded","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2002-0184"},{"Reference":"CVE-2004-0434","Description":"small length value leads to heap overflow","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2004-0434"},{"Reference":"CVE-2002-1347","Description":"multiple variants","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2002-1347"},{"Reference":"CVE-2005-0490","Description":"needs closer investigation, but probably expansion-based","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2005-0490"},{"Reference":"CVE-2004-0940","Description":"needs closer investigation, but probably expansion-based","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2004-0940"},{"Reference":"CVE-2008-0599","Description":"Chain: Language interpreter calculates wrong buffer size (CWE-131) by using \\"size = ptr ? X : Y\\" instead of \\"size = (ptr ? X : Y)\\" expression.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2008-0599"}]},"Taxonomy_Mappings":{"Taxonomy_Mapping":[{"Taxonomy_Name":"PLOVER","Entry_Name":"Other length calculation error"},{"Taxonomy_Name":"CERT C Secure Coding","Entry_ID":"INT30-C","Entry_Name":"Ensure that unsigned integer operations do not wrap","Mapping_Fit":"Imprecise"},{"Taxonomy_Name":"CERT C Secure Coding","Entry_ID":"MEM35-C","Entry_Name":"Allocate sufficient memory for an object","Mapping_Fit":"CWE More Abstract"}]},"Related_Attack_Patterns":{"Related_Attack_Pattern":[{"CAPEC_ID":"100"},{"CAPEC_ID":"47"}]},"References":{"Reference":[{"External_Reference_ID":"REF-106"},{"External_Reference_ID":"REF-107"},{"External_Reference_ID":"REF-58"},{"External_Reference_ID":"REF-61"},{"External_Reference_ID":"REF-60"},{"External_Reference_ID":"REF-76"},{"External_Reference_ID":"REF-7","Section":"Chapter 20, \\"Integer Overflows\\" Page 620"},{"External_Reference_ID":"REF-44","Section":"\\"Sin 5: Buffer Overruns.\\" Page 89"},{"External_Reference_ID":"REF-62","Section":"Chapter 8, \\"Incrementing Pointers Incorrectly\\", Page 401"},{"External_Reference_ID":"REF-64"}]},"Notes":{"Note":[{"Type":"Maintenance","xhtml:p":["This is a broad category. Some examples include:","This level of detail is rarely available in public reports, so it is difficult to find good examples."],"xhtml:div":{"style":"margin-left:10px;","xhtml:ol":{"xhtml:li":["simple math errors,","incorrectly updating parallel counters,","not accounting for size differences when \\"transforming\\" one input to another format (e.g. URL canonicalization or other transformation that can generate a result that\'s larger than the original input, i.e. \\"expansion\\")."]}}},{"Type":"Maintenance","xhtml:p":["This weakness may be a composite or a chain. It also may contain layering or perspective differences.","This issue may be associated with many different types of incorrect calculations (CWE-682), although the integer overflow (CWE-190) is probably the most prevalent. This can be primary to resource consumption problems (CWE-400), including uncontrolled memory allocation (CWE-789). However, its relationship with out-of-bounds buffer access (CWE-119) must also be considered."]}]},"Content_History":{"Submission":{"Submission_Name":"PLOVER","Submission_Date":"2006-07-19"},"Modification":[{"Modification_Name":"Eric Dalci","Modification_Organization":"Cigital","Modification_Date":"2008-07-01","Modification_Comment":"updated Potential_Mitigations, Time_of_Introduction"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2008-09-08","Modification_Comment":"updated Applicable_Platforms, Maintenance_Notes, Relationships, Taxonomy_Mappings, Type"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2008-10-14","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2008-11-24","Modification_Comment":"updated Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2009-12-28","Modification_Comment":"updated Demonstrative_Examples, Likelihood_of_Exploit, Observed_Examples, Potential_Mitigations"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2010-02-16","Modification_Comment":"updated Common_Consequences, Demonstrative_Examples, Detection_Factors, Maintenance_Notes, Potential_Mitigations, Related_Attack_Patterns, Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2010-04-05","Modification_Comment":"updated Detection_Factors, Potential_Mitigations, References, Related_Attack_Patterns"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2010-06-21","Modification_Comment":"updated Common_Consequences, Detection_Factors, Potential_Mitigations, References"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2010-09-27","Modification_Comment":"updated Potential_Mitigations"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2010-12-13","Modification_Comment":"updated Potential_Mitigations"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-03-29","Modification_Comment":"updated Maintenance_Notes"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-06-01","Modification_Comment":"updated Common_Consequences"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-06-27","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-09-13","Modification_Comment":"updated Potential_Mitigations, References, Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2012-05-11","Modification_Comment":"updated Demonstrative_Examples, Potential_Mitigations, References, Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2012-10-30","Modification_Comment":"updated Potential_Mitigations"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2013-02-21","Modification_Comment":"updated Demonstrative_Examples"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2013-07-17","Modification_Comment":"updated References"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2014-02-18","Modification_Comment":"updated Potential_Mitigations, References"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2014-07-30","Modification_Comment":"updated Detection_Factors, Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2017-11-08","Modification_Comment":"updated Likelihood_of_Exploit, References, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2018-03-27","Modification_Comment":"updated References"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2019-01-03","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2019-06-20","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-02-24","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-08-20","Modification_Comment":"updated Relationships"}],"Previous_Entry_Name":{"Date":"2008-01-30","$t":"Other Length Calculation Error"}}},{"ID":"134","Name":"Use of Externally-Controlled Format String","Abstraction":"Base","Structure":"Simple","Status":"Draft","Description":"The software uses a function that accepts a format string as an argument, but the format string originates from an external source.","Extended_Description":{"xhtml:p":["When an attacker can modify an externally-controlled format string, this can lead to buffer overflows, denial of service, or data representation problems.","It should be noted that in some circumstances, such as internationalization, the set of format strings is externally controlled by design. If the source of these format strings is trusted (e.g. only contained in library files that are only modifiable by the system administrator), then the external control might not itself pose a vulnerability."]},"Related_Weaknesses":{"Related_Weakness":[{"Nature":"ChildOf","CWE_ID":"668","View_ID":"1000","Ordinal":"Primary"},{"Nature":"ChildOf","CWE_ID":"668","View_ID":"1003","Ordinal":"Primary"},{"Nature":"CanPrecede","CWE_ID":"123","View_ID":"1000"},{"Nature":"ChildOf","CWE_ID":"20","View_ID":"700","Ordinal":"Primary"}]},"Weakness_Ordinalities":{"Weakness_Ordinality":{"Ordinality":"Primary"}},"Applicable_Platforms":{"Language":[{"Name":"C","Prevalence":"Often"},{"Name":"C++","Prevalence":"Often"},{"Name":"Perl","Prevalence":"Rarely"}]},"Modes_Of_Introduction":{"Introduction":[{"Phase":"Implementation","Note":"The programmer rarely intends for a format string to be externally-controlled at all. This weakness is frequently introduced in code that constructs log messages, where a constant format string is omitted."},{"Phase":"Implementation","Note":"In cases such as localization and internationalization, the language-specific message repositories could be an avenue for exploitation, but the format string issue would be resultant, since attacker control of those repositories would also allow modification of message length, format, and content."}]},"Likelihood_Of_Exploit":"High","Common_Consequences":{"Consequence":[{"Scope":"Confidentiality","Impact":"Read Memory","Note":"Format string problems allow for information disclosure which can severely simplify exploitation of the program."},{"Scope":["Integrity","Confidentiality","Availability"],"Impact":"Execute Unauthorized Code or Commands","Note":"Format string problems can result in the execution of arbitrary code."}]},"Detection_Methods":{"Detection_Method":[{"Detection_Method_ID":"DM-1","Method":"Automated Static Analysis","Description":"This weakness can often be detected using automated static analysis tools. Many modern tools use data flow analysis or constraint-based techniques to minimize the number of false positives."},{"Method":"Black Box","Description":"Since format strings often occur in rarely-occurring erroneous conditions (e.g. for error message logging), they can be difficult to detect using black box methods. It is highly likely that many latent issues exist in executables that do not have associated source code (or equivalent source.","Effectiveness":"Limited"},{"Method":"Automated Static Analysis - Binary or Bytecode","Description":{"xhtml:p":"According to SOAR, the following detection techniques may be useful:","xhtml:div":{"style":"margin-left:10px;","xhtml:div":["Highly cost effective:",{"style":"margin-left:10px;","xhtml:ul":{"xhtml:li":["Bytecode Weakness Analysis - including disassembler + source code weakness analysis","Binary Weakness Analysis - including disassembler + source code weakness analysis"]}},"Cost effective for partial coverage:",{"style":"margin-left:10px;","xhtml:ul":{"xhtml:li":"Binary / Bytecode simple extractor - strings, ELF readers, etc."}}]}},"Effectiveness":"High"},{"Method":"Manual Static Analysis - Binary or Bytecode","Description":{"xhtml:p":"According to SOAR, the following detection techniques may be useful:","xhtml:div":{"style":"margin-left:10px;","xhtml:div":["Cost effective for partial coverage:",{"style":"margin-left:10px;","xhtml:ul":{"xhtml:li":"Binary / Bytecode disassembler - then use manual analysis for vulnerabilities & anomalies"}}]}},"Effectiveness":"SOAR Partial"},{"Method":"Dynamic Analysis with Automated Results Interpretation","Description":{"xhtml:p":"According to SOAR, the following detection techniques may be useful:","xhtml:div":{"style":"margin-left:10px;","xhtml:div":["Cost effective for partial coverage:",{"style":"margin-left:10px;","xhtml:ul":{"xhtml:li":["Web Application Scanner","Web Services Scanner","Database Scanners"]}}]}},"Effectiveness":"SOAR Partial"},{"Method":"Dynamic Analysis with Manual Results Interpretation","Description":{"xhtml:p":"According to SOAR, the following detection techniques may be useful:","xhtml:div":{"style":"margin-left:10px;","xhtml:div":["Cost effective for partial coverage:",{"style":"margin-left:10px;","xhtml:ul":{"xhtml:li":["Fuzz Tester","Framework-based Fuzzer"]}}]}},"Effectiveness":"SOAR Partial"},{"Method":"Manual Static Analysis - Source Code","Description":{"xhtml:p":"According to SOAR, the following detection techniques may be useful:","xhtml:div":{"style":"margin-left:10px;","xhtml:div":["Highly cost effective:",{"style":"margin-left:10px;","xhtml:ul":{"xhtml:li":"Manual Source Code Review (not inspections)"}},"Cost effective for partial coverage:",{"style":"margin-left:10px;","xhtml:ul":{"xhtml:li":"Focused Manual Spotcheck - Focused manual analysis of source"}}]}},"Effectiveness":"High"},{"Method":"Automated Static Analysis - Source Code","Description":{"xhtml:p":"According to SOAR, the following detection techniques may be useful:","xhtml:div":{"style":"margin-left:10px;","xhtml:div":["Highly cost effective:",{"style":"margin-left:10px;","xhtml:ul":{"xhtml:li":["Source code Weakness Analyzer","Context-configured Source Code Weakness Analyzer"]}},"Cost effective for partial coverage:",{"style":"margin-left:10px;","xhtml:ul":{"xhtml:li":"Warning Flags"}}]}},"Effectiveness":"High"},{"Method":"Architecture or Design Review","Description":{"xhtml:p":"According to SOAR, the following detection techniques may be useful:","xhtml:div":{"style":"margin-left:10px;","xhtml:div":["Highly cost effective:",{"style":"margin-left:10px;","xhtml:ul":{"xhtml:li":"Formal Methods / Correct-By-Construction"}},"Cost effective for partial coverage:",{"style":"margin-left:10px;","xhtml:ul":{"xhtml:li":"Inspection (IEEE 1028 standard) (can apply to requirements, design, source code, etc.)"}}]}},"Effectiveness":"High"}]},"Potential_Mitigations":{"Mitigation":[{"Phase":"Requirements","Description":"Choose a language that is not subject to this flaw."},{"Phase":"Implementation","Description":"Ensure that all format string functions are passed a static string which cannot be controlled by the user and that the proper number of arguments are always sent to that function as well. If at all possible, use functions that do not support the %n operator in format strings. [REF-116] [REF-117]"},{"Phase":"Build and Compilation","Description":"Heed the warnings of compilers and linkers, since they may alert you to improper usage."}]},"Demonstrative_Examples":{"Demonstrative_Example":[{"Intro_Text":"The following program prints a string provided as an argument.","Example_Code":{"Nature":"bad","Language":"C","xhtml:div":{"xhtml:br":[{},{},{},{}],"xhtml:div":[{"style":"margin-left:10px;","xhtml:div":{"xhtml:br":{}}},{"style":"margin-left:10px;","xhtml:div":{"xhtml:br":[{},{},{},{}]}}]}},"Body_Text":"The example is exploitable, because of the call to printf() in the printWrapper() function. Note: The stack buffer was added to make exploitation more simple."},{"Intro_Text":"The following code copies a command line argument into a buffer using snprintf().","Example_Code":{"Nature":"bad","Language":"C","xhtml:div":{"xhtml:div":{"style":"margin-left:10px;","xhtml:br":[{},{}]}}},"Body_Text":"This code allows an attacker to view the contents of the stack and write to the stack using a command line argument containing a sequence of formatting directives. The attacker can read from the stack by providing more formatting directives, such as %x, than the function takes as arguments to be formatted. (In this example, the function takes no arguments to be formatted.) By using the %n formatting directive, the attacker can write to the stack, causing snprintf() to write the number of bytes output thus far to the specified argument (rather than reading a value from the argument, which is the intended behavior). A sophisticated version of this attack will use four staggered writes to completely control the value of a pointer on the stack."},{"Intro_Text":"Certain implementations make more advanced attacks even easier by providing format directives that control the location in memory to read from or write to. An example of these directives is shown in the following code, written for glibc:","Example_Code":{"Nature":"bad","Language":"C","xhtml:div":"printf(\\"%d %d %1$d %1$d\\\\n\\", 5, 9);"},"Body_Text":"This code produces the following output: 5 9 5 5 It is also possible to use half-writes (%hn) to accurately control arbitrary DWORDS in memory, which greatly reduces the complexity needed to execute an attack that would otherwise require four staggered writes, such as the one mentioned in the first example."}]},"Observed_Examples":{"Observed_Example":[{"Reference":"CVE-2002-1825","Description":"format string in Perl program","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2002-1825"},{"Reference":"CVE-2001-0717","Description":"format string in bad call to syslog function","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2001-0717"},{"Reference":"CVE-2002-0573","Description":"format string in bad call to syslog function","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2002-0573"},{"Reference":"CVE-2002-1788","Description":"format strings in NNTP server responses","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2002-1788"},{"Reference":"CVE-2006-2480","Description":"Format string vulnerability exploited by triggering errors or warnings, as demonstrated via format string specifiers in a .bmp filename.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2006-2480"},{"Reference":"CVE-2007-2027","Description":"Chain: untrusted search path enabling resultant format string by loading malicious internationalization messages","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2007-2027"}]},"Functional_Areas":{"Functional_Area":["Logging","Error Handling","String Processing"]},"Affected_Resources":{"Affected_Resource":"Memory"},"Taxonomy_Mappings":{"Taxonomy_Mapping":[{"Taxonomy_Name":"PLOVER","Entry_Name":"Format string vulnerability"},{"Taxonomy_Name":"7 Pernicious Kingdoms","Entry_Name":"Format String"},{"Taxonomy_Name":"CLASP","Entry_Name":"Format string problem"},{"Taxonomy_Name":"CERT C Secure Coding","Entry_ID":"FIO30-C","Entry_Name":"Exclude user input from format strings","Mapping_Fit":"Exact"},{"Taxonomy_Name":"CERT C Secure Coding","Entry_ID":"FIO47-C","Entry_Name":"Use valid format strings","Mapping_Fit":"CWE More Specific"},{"Taxonomy_Name":"OWASP Top Ten 2004","Entry_ID":"A1","Entry_Name":"Unvalidated Input","Mapping_Fit":"CWE More Specific"},{"Taxonomy_Name":"WASC","Entry_ID":"6","Entry_Name":"Format String"},{"Taxonomy_Name":"The CERT Oracle Secure Coding Standard for Java (2011)","Entry_ID":"IDS06-J","Entry_Name":"Exclude user input from format strings"},{"Taxonomy_Name":"SEI CERT Perl Coding Standard","Entry_ID":"IDS30-PL","Entry_Name":"Exclude user input from format strings","Mapping_Fit":"Exact"},{"Taxonomy_Name":"Software Fault Patterns","Entry_ID":"SFP24","Entry_Name":"Tainted input to command"},{"Taxonomy_Name":"OMG ASCSM","Entry_ID":"ASCSM-CWE-134"}]},"Related_Attack_Patterns":{"Related_Attack_Pattern":[{"CAPEC_ID":"135"},{"CAPEC_ID":"67"}]},"References":{"Reference":[{"External_Reference_ID":"REF-116"},{"External_Reference_ID":"REF-117"},{"External_Reference_ID":"REF-118"},{"External_Reference_ID":"REF-7","Section":"Chapter 5, \\"Format String Bugs\\" Page 147"},{"External_Reference_ID":"REF-44","Section":"\\"Sin 6: Format String Problems.\\" Page 109"},{"External_Reference_ID":"REF-62","Section":"Chapter 8, \\"C Format Strings\\", Page 422"},{"External_Reference_ID":"REF-962","Section":"ASCSM-CWE-134"}]},"Notes":{"Note":[{"Type":"Applicable Platform","xhtml:p":"This weakness is possible in any programming language that support format strings."},{"Type":"Other","xhtml:p":["While Format String vulnerabilities typically fall under the Buffer Overflow category, technically they are not overflowed buffers. The Format String vulnerability is fairly new (circa 1999) and stems from the fact that there is no realistic way for a function that takes a variable number of arguments to determine just how many arguments were passed in. The most common functions that take a variable number of arguments, including C-runtime functions, are the printf() family of calls. The Format String problem appears in a number of ways. A *printf() call without a format specifier is dangerous and can be exploited. For example, printf(input); is exploitable, while printf(y, input); is not exploitable in that context. The result of the first call, used incorrectly, allows for an attacker to be able to peek at stack memory since the input string will be used as the format specifier. The attacker can stuff the input string with format specifiers and begin reading stack values, since the remaining parameters will be pulled from the stack. Worst case, this improper use may give away enough control to allow an arbitrary value (or values in the case of an exploit program) to be written into the memory of the running program.","Frequently targeted entities are file names, process names, identifiers.","Format string problems are a classic C/C++ issue that are now rare due to the ease of discovery. One main reason format string vulnerabilities can be exploited is due to the %n operator. The %n operator will write the number of characters, which have been printed by the format string therefore far, to the memory pointed to by its argument. Through skilled creation of a format string, a malicious user may use values on the stack to create a write-what-where condition. Once this is achieved, they can execute arbitrary code. Other operators can be used as well; for example, a %9999s operator could also trigger a buffer overflow, or when used in file-formatting functions like fprintf, it can generate a much larger output than intended."]},{"Type":"Research Gap","$t":"Format string issues are under-studied for languages other than C. Memory or disk consumption, control flow or variable alteration, and data corruption may result from format string exploitation in applications written in other languages such as Perl, PHP, Python, etc."}]},"Content_History":{"Submission":{"Submission_Name":"PLOVER","Submission_Date":"2006-07-19"},"Modification":[{"Modification_Organization":"KDM Analytics","Modification_Date":"2008-08-01","Modification_Comment":"added/updated white box definitions"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2008-09-08","Modification_Comment":"updated Applicable_Platforms, Common_Consequences, Detection_Factors, Modes_of_Introduction, Relationships, Other_Notes, Research_Gaps, Taxonomy_Mappings, Weakness_Ordinalities"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2008-11-24","Modification_Comment":"updated Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2009-03-10","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2009-05-27","Modification_Comment":"updated Demonstrative_Examples"},{"Modification_Name":"KDM Analytics","Modification_Date":"2009-07-17","Modification_Comment":"Improved the White_Box_Definition"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2009-07-27","Modification_Comment":"updated White_Box_Definitions"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2010-02-16","Modification_Comment":"updated Detection_Factors, References, Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-06-01","Modification_Comment":"updated Common_Consequences, Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-06-27","Modification_Comment":"updated Modes_of_Introduction, Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-09-13","Modification_Comment":"updated Potential_Mitigations, References, Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2012-05-11","Modification_Comment":"updated Observed_Examples, References, Related_Attack_Patterns, Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2014-07-30","Modification_Comment":"updated Demonstrative_Examples, Detection_Factors, Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2015-12-07","Modification_Comment":"updated Description, Modes_of_Introduction, Name, Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2017-11-08","Modification_Comment":"updated Applicable_Platforms, Causal_Nature, Functional_Areas, Likelihood_of_Exploit, Other_Notes, References, Relationships, Taxonomy_Mappings, White_Box_Definitions"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2018-03-27","Modification_Comment":"updated References"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2019-01-03","Modification_Comment":"updated References, Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2019-06-20","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2019-09-19","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-02-24","Modification_Comment":"updated Detection_Factors, Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-08-20","Modification_Comment":"updated Relationships"}],"Previous_Entry_Name":{"Date":"2015-12-07","$t":"Uncontrolled Format String"}}},{"ID":"135","Name":"Incorrect Calculation of Multi-Byte String Length","Abstraction":"Base","Structure":"Simple","Status":"Draft","Description":"The software does not correctly calculate the length of strings that can contain wide or multi-byte characters.","Related_Weaknesses":{"Related_Weakness":{"Nature":"ChildOf","CWE_ID":"682","View_ID":"1000","Ordinal":"Primary"}},"Applicable_Platforms":{"Language":[{"Name":"C","Prevalence":"Undetermined"},{"Name":"C++","Prevalence":"Undetermined"}]},"Modes_Of_Introduction":{"Introduction":{"Phase":"Implementation","Note":{"xhtml:p":["There are several ways in which improper string length checking may result in an exploitable condition. All of these, however, involve the introduction of buffer overflow conditions in order to reach an exploitable state.","The first of these issues takes place when the output of a wide or multi-byte character string, string-length function is used as a size for the allocation of memory. While this will result in an output of the number of characters in the string, note that the characters are most likely not a single byte, as they are with standard character strings. So, using the size returned as the size sent to new or malloc and copying the string to this newly allocated memory will result in a buffer overflow.","Another common way these strings are misused involves the mixing of standard string and wide or multi-byte string functions on a single string. Invariably, this mismatched information will result in the creation of a possibly exploitable buffer overflow condition."]}}},"Common_Consequences":{"Consequence":[{"Scope":["Integrity","Confidentiality","Availability"],"Impact":"Execute Unauthorized Code or Commands","Note":"This weakness may lead to a buffer overflow. Buffer overflows often can be used to execute arbitrary code, which is usually outside the scope of a program\'s implicit security policy. This can often be used to subvert any other security service."},{"Scope":["Availability","Confidentiality"],"Impact":["Read Memory","DoS: Crash, Exit, or Restart","DoS: Resource Consumption (CPU)","DoS: Resource Consumption (Memory)"],"Note":"Out of bounds memory access will very likely result in the corruption of relevant memory, and perhaps instructions, possibly leading to a crash. Other attacks leading to lack of availability are possible, including putting the program into an infinite loop."},{"Scope":"Confidentiality","Impact":"Read Memory","Note":"In the case of an out-of-bounds read, the attacker may have access to sensitive information. If the sensitive information contains system details, such as the current buffers position in memory, this knowledge can be used to craft further attacks, possibly with more severe consequences."}]},"Potential_Mitigations":{"Mitigation":[{"Phase":"Implementation","Strategy":"Input Validation","Description":"Always verify the length of the string unit character."},{"Phase":"Implementation","Strategy":"Libraries or Frameworks","Description":"Use length computing functions (e.g. strlen, wcslen, etc.) appropriately with their equivalent type (e.g.: byte, wchar_t, etc.)"}]},"Demonstrative_Examples":{"Demonstrative_Example":{"Intro_Text":"The following example would be exploitable if any of the commented incorrect malloc calls were used.","Example_Code":[{"Nature":"bad","Language":"C","xhtml:div":{"xhtml:br":[{},{},{},{}],"xhtml:div":{"style":"margin-left:10px;","xhtml:div":{"xhtml:br":[{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}]}}}},{"Nature":"result","xhtml:div":{"xhtml:br":{}}}],"Body_Text":"The output from the printf() statement would be:"}},"Taxonomy_Mappings":{"Taxonomy_Mapping":[{"Taxonomy_Name":"CLASP","Entry_Name":"Improper string length checking"},{"Taxonomy_Name":"The CERT Oracle Secure Coding Standard for Java (2011)","Entry_ID":"FIO10-J","Entry_Name":"Ensure the array is filled when using read() to fill an array"},{"Taxonomy_Name":"Software Fault Patterns","Entry_ID":"SFP10","Entry_Name":"Incorrect Buffer Length Computation"}]},"References":{"Reference":{"External_Reference_ID":"REF-7","Section":"Chapter 5, \\"Unicode and ANSI Buffer Size Mismatches\\" Page 153"}},"Content_History":{"Submission":{"Submission_Name":"CLASP","Submission_Date":"2006-07-19"},"Modification":[{"Modification_Name":"Eric Dalci","Modification_Organization":"Cigital","Modification_Date":"2008-07-01","Modification_Comment":"updated Potential_Mitigations, Time_of_Introduction"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2008-09-08","Modification_Comment":"updated Applicable_Platforms, Relationships, Other_Notes, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2008-11-24","Modification_Comment":"updated Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2009-05-27","Modification_Comment":"updated Description"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2010-02-16","Modification_Comment":"updated Demonstrative_Examples, References"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-06-01","Modification_Comment":"updated Common_Consequences, Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-06-27","Modification_Comment":"updated Common_Consequences"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2012-05-11","Modification_Comment":"updated Common_Consequences, Demonstrative_Examples, Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2012-10-30","Modification_Comment":"updated Potential_Mitigations"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2014-06-23","Modification_Comment":"updated Enabling_Factors_for_Exploitation, Other_Notes"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2014-07-30","Modification_Comment":"updated Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2017-11-08","Modification_Comment":"updated Enabling_Factors_for_Exploitation, Modes_of_Introduction, References, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2018-03-27","Modification_Comment":"updated References"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2019-01-03","Modification_Comment":"updated Taxonomy_Mappings"}],"Contribution":{"Type":"Feedback","Contribution_Name":"Gregory Padgett","Contribution_Organization":"Unitrends","Contribution_Date":"2010-01-11","Contribution_Comment":"correction to Demonstrative_Example"},"Previous_Entry_Name":{"Date":"2008-04-11","$t":"Improper String Length Checking"}}},{"ID":"14","Name":"Compiler Removal of Code to Clear Buffers","Abstraction":"Variant","Structure":"Simple","Status":"Draft","Description":"Sensitive memory is cleared according to the source code, but compiler optimizations leave the memory untouched when it is not read from again, aka \\"dead store removal.\\"","Extended_Description":{"xhtml:p":"This compiler optimization error occurs when:","xhtml:ul":{"xhtml:li":["1. Secret data are stored in memory.","2. The secret data are scrubbed from memory by overwriting its contents.","3. The source code is compiled using an optimizing compiler, which identifies and removes the function that overwrites the contents as a dead store because the memory is not used subsequently."]}},"Related_Weaknesses":{"Related_Weakness":{"Nature":"ChildOf","CWE_ID":"733","View_ID":"1000","Ordinal":"Primary"}},"Applicable_Platforms":{"Language":[{"Name":"C","Prevalence":"Undetermined"},{"Name":"C++","Prevalence":"Undetermined"}]},"Modes_Of_Introduction":{"Introduction":[{"Phase":"Implementation"},{"Phase":"Build and Compilation"}]},"Common_Consequences":{"Consequence":{"Scope":["Confidentiality","Access Control"],"Impact":["Read Memory","Bypass Protection Mechanism"],"Note":"This weakness will allow data that has not been cleared from memory to be read. If this data contains sensitive password information, then an attacker can read the password and use the information to bypass protection mechanisms."}},"Detection_Methods":{"Detection_Method":[{"Method":"Black Box","Description":"This specific weakness is impossible to detect using black box methods. While an analyst could examine memory to see that it has not been scrubbed, an analysis of the executable would not be successful. This is because the compiler has already removed the relevant code. Only the source code shows whether the programmer intended to clear the memory or not, so this weakness is indistinguishable from others."},{"Method":"White Box","Description":"This weakness is only detectable using white box methods (see black box detection factor). Careful analysis is required to determine if the code is likely to be removed by the compiler."}]},"Potential_Mitigations":{"Mitigation":[{"Phase":"Implementation","Description":"Store the sensitive data in a \\"volatile\\" memory location if available."},{"Phase":"Build and Compilation","Description":"If possible, configure your compiler so that it does not remove dead stores."},{"Phase":"Architecture and Design","Description":"Where possible, encrypt sensitive data that are used by a software system."}]},"Demonstrative_Examples":{"Demonstrative_Example":{"Intro_Text":"The following code reads a password from the user, uses the password to connect to a back-end mainframe and then attempts to scrub the password from memory using memset().","Example_Code":{"Nature":"bad","Language":"C","xhtml:div":{"xhtml:div":{"style":"margin-left:10px;","xhtml:div":{"xhtml:br":[{},{}],"xhtml:div":{"style":"margin-left:10px;","xhtml:div":{"xhtml:br":{},"xhtml:div":{"style":"margin-left:10px;","xhtml:div":{"xhtml:br":[{},{}],"xhtml:i":"// Interaction with mainframe"}}}}}}}},"Body_Text":["The code in the example will behave correctly if it is executed verbatim, but if the code is compiled using an optimizing compiler, such as Microsoft Visual C++ .NET or GCC 3.x, then the call to memset() will be removed as a dead store because the buffer pwd is not used after its value is overwritten [18]. Because the buffer pwd contains a sensitive value, the application may be vulnerable to attack if the data are left memory resident. If attackers are able to access the correct region of memory, they may use the recovered password to gain control of the system.","It is common practice to overwrite sensitive data manipulated in memory, such as passwords or cryptographic keys, in order to prevent attackers from learning system secrets. However, with the advent of optimizing compilers, programs do not always behave as their source code alone would suggest. In the example, the compiler interprets the call to memset() as dead code because the memory being written to is not subsequently used, despite the fact that there is clearly a security motivation for the operation to occur. The problem here is that many compilers, and in fact many programming languages, do not take this and other security concerns into consideration in their efforts to improve efficiency.","Attackers typically exploit this type of vulnerability by using a core dump or runtime mechanism to access the memory used by a particular application and recover the secret information. Once an attacker has access to the secret information, it is relatively straightforward to further exploit the system and possibly compromise other resources with which the application interacts."]}},"Affected_Resources":{"Affected_Resource":"Memory"},"Taxonomy_Mappings":{"Taxonomy_Mapping":[{"Taxonomy_Name":"7 Pernicious Kingdoms","Entry_Name":"Insecure Compiler Optimization"},{"Taxonomy_Name":"PLOVER","Entry_Name":"Sensitive memory uncleared by compiler optimization"},{"Taxonomy_Name":"OWASP Top Ten 2004","Entry_ID":"A8","Entry_Name":"Insecure Storage","Mapping_Fit":"CWE More Specific"},{"Taxonomy_Name":"CERT C Secure Coding","Entry_ID":"MSC06-C","Entry_Name":"Be aware of compiler optimization when dealing with sensitive data"},{"Taxonomy_Name":"Software Fault Patterns","Entry_ID":"SFP23","Entry_Name":"Exposed Data"}]},"References":{"Reference":[{"External_Reference_ID":"REF-6"},{"External_Reference_ID":"REF-7","Section":"Chapter 9, \\"A Compiler Optimization Caveat\\" Page 322"},{"External_Reference_ID":"REF-124"},{"External_Reference_ID":"REF-125"},{"External_Reference_ID":"REF-126"}]},"Content_History":{"Submission":{"Submission_Name":"7 Pernicious Kingdoms","Submission_Date":"2006-07-19"},"Modification":[{"Modification_Name":"Eric Dalci","Modification_Organization":"Cigital","Modification_Date":"2008-07-01","Modification_Comment":"updated Time_of_Introduction"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2008-09-08","Modification_Comment":"updated Relationships, Other_Notes, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2008-10-14","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2008-11-24","Modification_Comment":"updated Applicable_Platforms, Description, Detection_Factors, Other_Notes, Potential_Mitigations, Relationships, Taxonomy_Mappings, Time_of_Introduction"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2009-05-27","Modification_Comment":"updated Demonstrative_Examples"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2010-02-16","Modification_Comment":"updated References"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-06-01","Modification_Comment":"updated Common_Consequences"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-09-13","Modification_Comment":"updated Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2012-05-11","Modification_Comment":"updated Common_Consequences, References, Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2014-07-30","Modification_Comment":"updated Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2017-01-19","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2017-11-08","Modification_Comment":"updated References, Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2018-03-27","Modification_Comment":"updated References, Type"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-02-24","Modification_Comment":"updated References, Relationships"}],"Previous_Entry_Name":{"Date":"2008-04-11","$t":"Insecure Compiler Optimization"}}},{"ID":"170","Name":"Improper Null Termination","Abstraction":"Base","Structure":"Simple","Status":"Incomplete","Description":"The software does not terminate or incorrectly terminates a string or array with a null character or equivalent terminator.","Extended_Description":"Null termination errors frequently occur in two different ways. An off-by-one error could cause a null to be written out of bounds, leading to an overflow. Or, a program could use a strncpy() function call incorrectly, which prevents a null terminator from being added at all. Other scenarios are possible.","Related_Weaknesses":{"Related_Weakness":[{"Nature":"ChildOf","CWE_ID":"707","View_ID":"1000","Ordinal":"Primary"},{"Nature":"CanPrecede","CWE_ID":"120","View_ID":"1000"},{"Nature":"CanPrecede","CWE_ID":"126","View_ID":"1000"},{"Nature":"CanAlsoBe","CWE_ID":"147","View_ID":"1000"},{"Nature":"PeerOf","CWE_ID":"464","View_ID":"1000"},{"Nature":"PeerOf","CWE_ID":"463","View_ID":"1000"},{"Nature":"ChildOf","CWE_ID":"20","View_ID":"700","Ordinal":"Primary"}]},"Weakness_Ordinalities":{"Weakness_Ordinality":{"Ordinality":"Resultant"}},"Applicable_Platforms":{"Language":[{"Name":"C","Prevalence":"Undetermined"},{"Name":"C++","Prevalence":"Undetermined"}]},"Modes_Of_Introduction":{"Introduction":{"Phase":"Implementation"}},"Likelihood_Of_Exploit":"Medium","Common_Consequences":{"Consequence":[{"Scope":["Confidentiality","Integrity","Availability"],"Impact":["Read Memory","Execute Unauthorized Code or Commands"],"Note":"The case of an omitted null character is the most dangerous of the possible issues. This will almost certainly result in information disclosure, and possibly a buffer overflow condition, which may be exploited to execute arbitrary code."},{"Scope":["Confidentiality","Integrity","Availability"],"Impact":["DoS: Crash, Exit, or Restart","Read Memory","DoS: Resource Consumption (CPU)","DoS: Resource Consumption (Memory)"],"Note":"If a null character is omitted from a string, then most string-copying functions will read data until they locate a null character, even outside of the intended boundaries of the string. This could: cause a crash due to a segmentation fault cause sensitive adjacent memory to be copied and sent to an outsider trigger a buffer overflow when the copy is being written to a fixed-size buffer."},{"Scope":["Integrity","Availability"],"Impact":["Modify Memory","DoS: Crash, Exit, or Restart"],"Note":"Misplaced null characters may result in any number of security problems. The biggest issue is a subset of buffer overflow, and write-what-where conditions, where data corruption occurs from the writing of a null character over valid data, or even instructions. A randomly placed null character may put the system into an undefined state, and therefore make it prone to crashing. A misplaced null character may corrupt other data in memory."},{"Scope":["Integrity","Confidentiality","Availability","Access Control","Other"],"Impact":["Alter Execution Logic","Execute Unauthorized Code or Commands"],"Note":"Should the null character corrupt the process flow, or affect a flag controlling access, it may lead to logical errors which allow for the execution of arbitrary code."}]},"Potential_Mitigations":{"Mitigation":[{"Phase":"Requirements","Description":"Use a language that is not susceptible to these issues. However, be careful of null byte interaction errors (CWE-626) with lower-level constructs that may be written in a language that is susceptible."},{"Phase":"Implementation","Description":"Ensure that all string functions used are understood fully as to how they append null characters. Also, be wary of off-by-one errors when appending nulls to the end of strings."},{"Phase":"Implementation","Description":"If performance constraints permit, special code can be added that validates null-termination of string buffers, this is a rather naive and error-prone solution."},{"Phase":"Implementation","Description":"Switch to bounded string manipulation functions. Inspect buffer lengths involved in the buffer overrun trace reported with the defect."},{"Phase":"Implementation","Description":"Add code that fills buffers with nulls (however, the length of buffers still needs to be inspected, to ensure that the non null-terminated string is not written at the physical end of the buffer)."}]},"Demonstrative_Examples":{"Demonstrative_Example":[{"Intro_Text":"The following code reads from cfgfile and copies the input into inputbuf using strcpy(). The code mistakenly assumes that inputbuf will always contain a NULL terminator.","Example_Code":{"Nature":"bad","Language":"C","xhtml:div":{"xhtml:br":[{},{},{},{},{},{}]}},"Body_Text":"The code above will behave correctly if the data read from cfgfile is null terminated on disk as expected. But if an attacker is able to modify this input so that it does not contain the expected NULL character, the call to strcpy() will continue copying from memory until it encounters an arbitrary NULL character. This will likely overflow the destination buffer and, if the attacker can control the contents of memory immediately following inputbuf, can leave the application susceptible to a buffer overflow attack."},{"Intro_Text":"In the following code, readlink() expands the name of a symbolic link stored in pathname and puts the absolute path into buf. The length of the resulting value is then calculated using strlen().","Example_Code":{"Nature":"bad","Language":"C","xhtml:div":{"xhtml:br":[{},{},{},{}]}},"Body_Text":"The code above will not always behave correctly as readlink() does not append a NULL byte to buf. Readlink() will stop copying characters once the maximum size of buf has been reached to avoid overflowing the buffer, this will leave the value buf not NULL terminated. In this situation, strlen() will continue traversing memory until it encounters an arbitrary NULL character further on down the stack, resulting in a length value that is much larger than the size of string. Readlink() does return the number of bytes copied, but when this return value is the same as stated buf size (in this case MAXPATH), it is impossible to know whether the pathname is precisely that many bytes long, or whether readlink() has truncated the name to avoid overrunning the buffer. In testing, vulnerabilities like this one might not be caught because the unused contents of buf and the memory immediately following it may be NULL, thereby causing strlen() to appear as if it is behaving correctly."},{"Intro_Text":"While the following example is not exploitable, it provides a good example of how nulls can be omitted or misplaced, even when \\"safe\\" functions are used:","Example_Code":{"Nature":"bad","Language":"C","xhtml:div":{"xhtml:br":[{},{},{}],"xhtml:div":{"style":"margin-left:10px;","xhtml:div":{"xhtml:br":[{},{},{},{},{},{}]}}}},"Body_Text":"The above code gives the following output: \\"The last character in shortString is: n (6e)\\". So, the shortString array does not end in a NULL character, even though the \\"safe\\" string function strncpy() was used. The reason is that strncpy() does not impliciitly add a NULL character at the end of the string when the source is equal in length or longer than the provided size."}]},"Observed_Examples":{"Observed_Example":[{"Reference":"CVE-2000-0312","Description":"Attacker does not null-terminate argv[] when invoking another program.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2000-0312"},{"Reference":"CVE-2003-0777","Description":"Interrupted step causes resultant lack of null termination.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2003-0777"},{"Reference":"CVE-2004-1072","Description":"Fault causes resultant lack of null termination, leading to buffer expansion.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2004-1072"},{"Reference":"CVE-2001-1389","Description":"Multiple vulnerabilities related to improper null termination.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2001-1389"},{"Reference":"CVE-2003-0143","Description":"Product does not null terminate a message buffer after snprintf-like call, leading to overflow.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2003-0143"},{"Reference":"CVE-2009-2523","Description":"Chain: product does not handle when an input string is not NULL terminated (CWE-170), leading to buffer over-read (CWE-125) or heap-based buffer overflow (CWE-122).","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2009-2523"}]},"Taxonomy_Mappings":{"Taxonomy_Mapping":[{"Taxonomy_Name":"PLOVER","Entry_Name":"Improper Null Termination"},{"Taxonomy_Name":"7 Pernicious Kingdoms","Entry_Name":"String Termination Error"},{"Taxonomy_Name":"CLASP","Entry_Name":"Miscalculated null termination"},{"Taxonomy_Name":"OWASP Top Ten 2004","Entry_ID":"A9","Entry_Name":"Denial of Service","Mapping_Fit":"CWE More Specific"},{"Taxonomy_Name":"CERT C Secure Coding","Entry_ID":"POS30-C","Entry_Name":"Use the readlink() function properly","Mapping_Fit":"CWE More Abstract"},{"Taxonomy_Name":"CERT C Secure Coding","Entry_ID":"STR03-C","Entry_Name":"Do not inadvertently truncate a null-terminated byte string"},{"Taxonomy_Name":"CERT C Secure Coding","Entry_ID":"STR32-C","Entry_Name":"Do not pass a non-null-terminated character sequence to a library function that expects a string","Mapping_Fit":"Exact"},{"Taxonomy_Name":"Software Fault Patterns","Entry_ID":"SFP11","Entry_Name":"Improper Null Termination"}]},"Notes":{"Note":[{"Type":"Relationship","$t":"Factors: this is usually resultant from other weaknesses such as off-by-one errors, but it can be primary to boundary condition violations such as buffer overflows. In buffer overflows, it can act as an expander for assumed-immutable data."},{"Type":"Relationship","$t":"Overlaps missing input terminator."},{"Type":"Applicable Platform","xhtml:p":"Conceptually, this does not just apply to the C language; any language or representation that involves a terminator could have this type of problem."},{"Type":"Maintenance","$t":"As currently described, this entry is more like a category than a weakness."}]},"Content_History":{"Submission":{"Submission_Name":"PLOVER","Submission_Date":"2006-07-19"},"Modification":[{"Modification_Name":"Eric Dalci","Modification_Organization":"Cigital","Modification_Date":"2008-07-01","Modification_Comment":"updated Time_of_Introduction"},{"Modification_Organization":"KDM Analytics","Modification_Date":"2008-08-01","Modification_Comment":"added/updated white box definitions"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2008-09-08","Modification_Comment":"updated Applicable_Platforms, Causal_Nature, Common_Consequences, Description, Likelihood_of_Exploit, Maintenance_Notes, Relationships, Other_Notes, Relationship_Notes, Taxonomy_Mappings, Weakness_Ordinalities"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2008-11-24","Modification_Comment":"updated Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2009-03-10","Modification_Comment":"updated Common_Consequences"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2009-05-27","Modification_Comment":"updated Demonstrative_Examples"},{"Modification_Name":"KDM Analytics","Modification_Date":"2009-07-17","Modification_Comment":"Improved the White_Box_Definition"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2009-07-27","Modification_Comment":"updated Common_Consequences, Other_Notes, Potential_Mitigations, White_Box_Definitions"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2009-10-29","Modification_Comment":"updated Description"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-03-29","Modification_Comment":"updated Common_Consequences"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-06-01","Modification_Comment":"updated Common_Consequences"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-09-13","Modification_Comment":"updated Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2012-05-11","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2014-06-23","Modification_Comment":"updated Observed_Examples"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2014-07-30","Modification_Comment":"updated Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2017-11-08","Modification_Comment":"updated Causal_Nature, Observed_Examples, Relationships, Taxonomy_Mappings, White_Box_Definitions"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2018-03-27","Modification_Comment":"updated Demonstrative_Examples"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2019-01-03","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-02-24","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-08-20","Modification_Comment":"updated Relationships"}]}},{"ID":"188","Name":"Reliance on Data/Memory Layout","Abstraction":"Base","Structure":"Simple","Status":"Draft","Description":"The software makes invalid assumptions about how protocol data or memory is organized at a lower level, resulting in unintended program behavior.","Extended_Description":{"xhtml:p":["When changing platforms or protocol versions, in-memory organization of data may change in unintended ways. For example, some architectures may place local variables A and B right next to each other with A on top; some may place them next to each other with B on top; and others may add some padding to each. The padding size may vary to ensure that each variable is aligned to a proper word size.","In protocol implementations, it is common to calculate an offset relative to another field to pick out a specific piece of data. Exceptional conditions, often involving new protocol versions, may add corner cases that change the data layout in an unusual way. The result can be that an implementation accesses an unintended field in the packet, treating data of one type as data of another type."]},"Related_Weaknesses":{"Related_Weakness":[{"Nature":"ChildOf","CWE_ID":"1105","View_ID":"1000","Ordinal":"Primary"},{"Nature":"ChildOf","CWE_ID":"435","View_ID":"1000"}]},"Applicable_Platforms":{"Language":[{"Name":"C","Prevalence":"Undetermined"},{"Name":"C++","Prevalence":"Undetermined"}]},"Modes_Of_Introduction":{"Introduction":[{"Phase":"Architecture and Design"},{"Phase":"Implementation"}]},"Likelihood_Of_Exploit":"Low","Common_Consequences":{"Consequence":{"Scope":["Integrity","Confidentiality"],"Impact":["Modify Memory","Read Memory"],"Note":"Can result in unintended modifications or exposure of sensitive memory."}},"Potential_Mitigations":{"Mitigation":[{"Phase":["Implementation","Architecture and Design"],"Description":"In flat address space situations, never allow computing memory addresses as offsets from another memory address."},{"Phase":"Architecture and Design","Description":"Fully specify protocol layout unambiguously, providing a structured grammar (e.g., a compilable yacc grammar)."},{"Phase":"Testing","Description":"Testing: Test that the implementation properly handles each case in the protocol grammar."}]},"Demonstrative_Examples":{"Demonstrative_Example":{"Intro_Text":"In this example function, the memory address of variable b is derived by adding 1 to the address of variable a. This derived address is then used to assign the value 0 to b.","Example_Code":{"Nature":"bad","Language":"C","xhtml:div":{"xhtml:div":{"style":"margin-left:10px;","xhtml:br":[{},{}]}}},"Body_Text":"Here, b may not be one byte past a. It may be one byte in front of a. Or, they may have three bytes between them because they are aligned on 32-bit boundaries."}},"Taxonomy_Mappings":{"Taxonomy_Mapping":{"Taxonomy_Name":"CLASP","Entry_Name":"Reliance on data layout"}},"References":{"Reference":{"External_Reference_ID":"REF-62","Section":"Chapter 6, \\"Structure Padding\\", Page 284"}},"Content_History":{"Submission":{"Submission_Name":"CLASP","Submission_Date":"2006-07-19"},"Modification":[{"Modification_Name":"Eric Dalci","Modification_Organization":"Cigital","Modification_Date":"2008-07-01","Modification_Comment":"updated Time_of_Introduction"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2008-09-08","Modification_Comment":"updated Applicable_Platforms, Common_Consequences, Relationships, Other_Notes, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2009-03-10","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2009-10-29","Modification_Comment":"updated Common_Consequences"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-03-29","Modification_Comment":"updated Common_Consequences"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-06-01","Modification_Comment":"updated Common_Consequences"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2012-05-11","Modification_Comment":"updated References, Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2012-10-30","Modification_Comment":"updated Potential_Mitigations"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2014-06-23","Modification_Comment":"updated Description, Other_Notes"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2014-07-30","Modification_Comment":"updated Demonstrative_Examples, Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2019-01-03","Modification_Comment":"updated Description, Relationships"}],"Previous_Entry_Name":{"Date":"2008-04-11","$t":"Reliance on Data Layout"}}},{"ID":"191","Name":"Integer Underflow (Wrap or Wraparound)","Abstraction":"Base","Structure":"Simple","Status":"Draft","Description":"The product subtracts one value from another, such that the result is less than the minimum allowable integer value, which produces a value that is not equal to the correct result.","Extended_Description":"This can happen in signed and unsigned cases.","Related_Weaknesses":{"Related_Weakness":[{"Nature":"ChildOf","CWE_ID":"682","View_ID":"1000","Ordinal":"Primary"},{"Nature":"ChildOf","CWE_ID":"682","View_ID":"1003","Ordinal":"Primary"}]},"Applicable_Platforms":{"Language":[{"Name":"C","Prevalence":"Undetermined"},{"Name":"C++","Prevalence":"Undetermined"},{"Name":"Java","Prevalence":"Undetermined"},{"Name":"C#","Prevalence":"Undetermined"}]},"Alternate_Terms":{"Alternate_Term":{"Term":"Integer underflow","Description":{"xhtml:p":["\\"Integer underflow\\" is sometimes used to identify signedness errors in which an originally positive number becomes negative as a result of subtraction. However, there are cases of bad subtraction in which unsigned integers are involved, so it\'s not always a signedness issue.","\\"Integer underflow\\" is occasionally used to describe array index errors in which the index is negative."]}}},"Modes_Of_Introduction":{"Introduction":{"Phase":"Implementation"}},"Common_Consequences":{"Consequence":[{"Scope":"Availability","Impact":["DoS: Crash, Exit, or Restart","DoS: Resource Consumption (CPU)","DoS: Resource Consumption (Memory)","DoS: Instability"],"Note":"This weakness will generally lead to undefined behavior and therefore crashes. In the case of overflows involving loop index variables, the likelihood of infinite loops is also high."},{"Scope":"Integrity","Impact":"Modify Memory","Note":"If the value in question is important to data (as opposed to flow), simple data corruption has occurred. Also, if the wrap around results in other conditions such as buffer overflows, further memory corruption may occur."},{"Scope":["Confidentiality","Availability","Access Control"],"Impact":["Execute Unauthorized Code or Commands","Bypass Protection Mechanism"],"Note":"This weakness can sometimes trigger buffer overflows which can be used to execute arbitrary code. This is usually outside the scope of a program\'s implicit security policy."}]},"Demonstrative_Examples":{"Demonstrative_Example":{"Intro_Text":"The following example subtracts from a 32 bit signed integer.","Example_Code":{"Nature":"bad","Language":"C","xhtml:div":{"xhtml:br":[{},{},{},{}],"xhtml:div":{"style":"margin-left:10px;","xhtml:br":[{},{},{}]}}},"Body_Text":"The example has an integer underflow. The value of i is already at the lowest negative value possible, so after subtracting 1, the new value of i is 2147483647."}},"Observed_Examples":{"Observed_Example":[{"Reference":"CVE-2004-0816","Description":"Integer underflow in firewall via malformed packet.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2004-0816"},{"Reference":"CVE-2004-1002","Description":"Integer underflow by packet with invalid length.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2004-1002"},{"Reference":"CVE-2005-0199","Description":"Long input causes incorrect length calculation.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2005-0199"},{"Reference":"CVE-2005-1891","Description":"Malformed icon causes integer underflow in loop counter variable.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2005-1891"}]},"Taxonomy_Mappings":{"Taxonomy_Mapping":[{"Taxonomy_Name":"PLOVER","Entry_Name":"Integer underflow (wrap or wraparound)"},{"Taxonomy_Name":"Software Fault Patterns","Entry_ID":"SFP1","Entry_Name":"Glitch in computation"},{"Taxonomy_Name":"CERT C Secure Coding","Entry_ID":"INT30-C","Entry_Name":"Ensure that unsigned integer operations do not wrap","Mapping_Fit":"Imprecise"},{"Taxonomy_Name":"CERT C Secure Coding","Entry_ID":"INT32-C","Entry_Name":"Ensure that operations on signed integers do not result in overflow","Mapping_Fit":"Imprecise"}]},"References":{"Reference":{"External_Reference_ID":"REF-44","Section":"\\"Sin 7: Integer Overflows.\\" Page 119"}},"Notes":{"Note":{"Type":"Research Gap","$t":"Under-studied."}},"Content_History":{"Submission":{"Submission_Name":"PLOVER","Submission_Date":"2006-07-19"},"Modification":[{"Modification_Name":"Eric Dalci","Modification_Organization":"Cigital","Modification_Date":"2008-07-01","Modification_Comment":"updated Demonstrative_Example"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2008-09-08","Modification_Comment":"updated Alternate_Terms, Applicable_Platforms, Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2008-10-14","Modification_Comment":"updated Description"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2009-05-27","Modification_Comment":"updated Demonstrative_Examples"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-06-01","Modification_Comment":"updated Common_Consequences"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-06-27","Modification_Comment":"updated Common_Consequences"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2012-05-11","Modification_Comment":"updated Common_Consequences, References, Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2014-07-30","Modification_Comment":"updated Demonstrative_Examples, Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2015-12-07","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2017-11-08","Modification_Comment":"updated Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2019-01-03","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-02-24","Modification_Comment":"updated Relationships"}]}},{"ID":"192","Name":"Integer Coercion Error","Abstraction":"Variant","Structure":"Simple","Status":"Incomplete","Description":"Integer coercion refers to a set of flaws pertaining to the type casting, extension, or truncation of primitive data types.","Extended_Description":"Several flaws fall under the category of integer coercion errors. For the most part, these errors in and of themselves result only in availability and data integrity issues. However, in some circumstances, they may result in other, more complicated security related flaws, such as buffer overflow conditions.","Related_Weaknesses":{"Related_Weakness":{"Nature":"ChildOf","CWE_ID":"681","View_ID":"1000","Ordinal":"Primary"}},"Applicable_Platforms":{"Language":[{"Name":"C","Prevalence":"Undetermined"},{"Name":"C++","Prevalence":"Undetermined"},{"Name":"Java","Prevalence":"Undetermined"},{"Name":"C#","Prevalence":"Undetermined"}]},"Modes_Of_Introduction":{"Introduction":{"Phase":"Implementation"}},"Likelihood_Of_Exploit":"Medium","Common_Consequences":{"Consequence":[{"Scope":"Availability","Impact":["DoS: Resource Consumption (CPU)","DoS: Resource Consumption (Memory)","DoS: Crash, Exit, or Restart"],"Note":"Integer coercion often leads to undefined states of execution resulting in infinite loops or crashes."},{"Scope":["Integrity","Confidentiality","Availability"],"Impact":"Execute Unauthorized Code or Commands","Note":"In some cases, integer coercion errors can lead to exploitable buffer overflow conditions, resulting in the execution of arbitrary code."},{"Scope":["Integrity","Other"],"Impact":"Other","Note":"Integer coercion errors result in an incorrect value being stored for the variable in question."}]},"Potential_Mitigations":{"Mitigation":[{"Phase":"Requirements","Description":"A language which throws exceptions on ambiguous data casts might be chosen."},{"Phase":"Architecture and Design","Description":"Design objects and program flow such that multiple or complex casts are unnecessary"},{"Phase":"Implementation","Description":"Ensure that any data type casting that you must used is entirely understood in order to reduce the plausibility of error in use."}]},"Demonstrative_Examples":{"Demonstrative_Example":[{"Demonstrative_Example_ID":"DX-21","Intro_Text":"The following code is intended to read an incoming packet from a socket and extract one or more headers.","Example_Code":{"Nature":"bad","Language":"C","xhtml:div":{"xhtml:br":[{},{},{},{},{},{},{},{},{},{}],"xhtml:div":{"style":"margin-left:10px;","$t":"ExitError(\\"too many headers!\\");"}}},"Body_Text":"The code performs a check to make sure that the packet does not contain too many headers. However, numHeaders is defined as a signed int, so it could be negative. If the incoming packet specifies a value such as -3, then the malloc calculation will generate a negative number (say, -300 if each header can be a maximum of 100 bytes). When this result is provided to malloc(), it is first converted to a size_t type. This conversion then produces a large value such as 4294966996, which may cause malloc() to fail or to allocate an extremely large amount of memory (CWE-195). With the appropriate negative numbers, an attacker could trick malloc() into using a very small positive number, which then allocates a buffer that is much smaller than expected, potentially leading to a buffer overflow."},{"Demonstrative_Example_ID":"DX-23","Intro_Text":"The following code reads a maximum size and performs a sanity check on that size. It then performs a strncpy, assuming it will not exceed the boundaries of the array. While the use of \\"short s\\" is forced in this particular example, short int\'s are frequently used within real-world code, such as code that processes structured data.","Example_Code":{"Nature":"bad","Language":"C","xhtml:div":{"xhtml:div":[{"style":"margin-left:10px;","$t":"return(0x0000FFFF);"},{"style":"margin-left:10px;","xhtml:div":{"xhtml:br":[{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}],"xhtml:div":{"style":"margin-left:10px;","$t":"DiePainfully(\\"go away!\\\\n\\");"}}}],"xhtml:br":[{},{}]}},"Body_Text":"This code first exhibits an example of CWE-839, allowing \\"s\\" to be a negative number. When the negative short \\"s\\" is converted to an unsigned integer, it becomes an extremely large positive integer. When this converted integer is used by strncpy() it will lead to a buffer overflow (CWE-119)."}]},"Taxonomy_Mappings":{"Taxonomy_Mapping":[{"Taxonomy_Name":"CLASP","Entry_Name":"Integer coercion error"},{"Taxonomy_Name":"CERT C Secure Coding","Entry_ID":"INT02-C","Entry_Name":"Understand integer conversion rules"},{"Taxonomy_Name":"CERT C Secure Coding","Entry_ID":"INT05-C","Entry_Name":"Do not use input functions to convert character data if they cannot handle all possible inputs"},{"Taxonomy_Name":"CERT C Secure Coding","Entry_ID":"INT31-C","Entry_Name":"Ensure that integer conversions do not result in lost or misinterpreted data","Mapping_Fit":"Exact"}]},"References":{"Reference":[{"External_Reference_ID":"REF-44","Section":"\\"Sin 7: Integer Overflows.\\" Page 119"},{"External_Reference_ID":"REF-62","Section":"Chapter 6, \\"Sign Extension\\", Page 248"}]},"Notes":{"Note":{"Type":"Maintenance","$t":"Within C, it might be that \\"coercion\\" is semantically different than \\"casting\\", possibly depending on whether the programmer directly specifies the conversion, or if the compiler does it implicitly. This has implications for the presentation of this node and others, such as CWE-681, and whether there is enough of a difference for these nodes to be split."}},"Content_History":{"Submission":{"Submission_Name":"CLASP","Submission_Date":"2006-07-19"},"Modification":[{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2008-09-08","Modification_Comment":"updated Applicable_Platforms, Common_Consequences, Maintenance_Notes, Relationships, Other_Notes, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2008-11-24","Modification_Comment":"updated Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2009-12-28","Modification_Comment":"updated Description, Other_Notes"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2010-04-05","Modification_Comment":"updated Demonstrative_Examples"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-06-01","Modification_Comment":"updated Common_Consequences"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-09-13","Modification_Comment":"updated Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2012-05-11","Modification_Comment":"updated Demonstrative_Examples, References"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2012-10-30","Modification_Comment":"updated Potential_Mitigations"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2017-11-08","Modification_Comment":"updated Relationships, Taxonomy_Mappings, Type"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2019-01-03","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-02-24","Modification_Comment":"updated Relationships"}]}},{"ID":"194","Name":"Unexpected Sign Extension","Abstraction":"Variant","Structure":"Simple","Status":"Incomplete","Description":"The software performs an operation on a number that causes it to be sign extended when it is transformed into a larger data type. When the original number is negative, this can produce unexpected values that lead to resultant weaknesses.","Related_Weaknesses":{"Related_Weakness":[{"Nature":"ChildOf","CWE_ID":"681","View_ID":"1000","Ordinal":"Primary"},{"Nature":"ChildOf","CWE_ID":"681","View_ID":"1305","Ordinal":"Primary"}]},"Applicable_Platforms":{"Language":[{"Name":"C","Prevalence":"Undetermined"},{"Name":"C++","Prevalence":"Undetermined"}]},"Modes_Of_Introduction":{"Introduction":{"Phase":"Implementation"}},"Likelihood_Of_Exploit":"High","Common_Consequences":{"Consequence":{"Scope":["Integrity","Confidentiality","Availability","Other"],"Impact":["Read Memory","Modify Memory","Other"],"Note":"When an unexpected sign extension occurs in code that operates directly on memory buffers, such as a size value or a memory index, then it could cause the program to write or read outside the boundaries of the intended buffer. If the numeric value is associated with an application-level resource, such as a quantity or price for a product in an e-commerce site, then the sign extension could produce a value that is much higher (or lower) than the application\'s allowable range."}},"Potential_Mitigations":{"Mitigation":{"Phase":"Implementation","Description":"Avoid using signed variables if you don\'t need to represent negative values. When negative values are needed, perform sanity checks after you save those values to larger data types, or before passing them to functions that are expecting unsigned values."}},"Demonstrative_Examples":{"Demonstrative_Example":{"Demonstrative_Example_ID":"DX-23","Intro_Text":"The following code reads a maximum size and performs a sanity check on that size. It then performs a strncpy, assuming it will not exceed the boundaries of the array. While the use of \\"short s\\" is forced in this particular example, short int\'s are frequently used within real-world code, such as code that processes structured data.","Example_Code":{"Nature":"bad","Language":"C","xhtml:div":{"xhtml:div":[{"style":"margin-left:10px;","$t":"return(0x0000FFFF);"},{"style":"margin-left:10px;","xhtml:div":{"xhtml:br":[{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}],"xhtml:div":{"style":"margin-left:10px;","$t":"DiePainfully(\\"go away!\\\\n\\");"}}}],"xhtml:br":[{},{}]}},"Body_Text":"This code first exhibits an example of CWE-839, allowing \\"s\\" to be a negative number. When the negative short \\"s\\" is converted to an unsigned integer, it becomes an extremely large positive integer. When this converted integer is used by strncpy() it will lead to a buffer overflow (CWE-119)."}},"Observed_Examples":{"Observed_Example":[{"Reference":"CVE-2018-10887","Description":"Chain: unexpected sign extension (CWE-194) leads to integer overflow (CWE-190), causing an out-of-bounds read (CWE-125)","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2018-10887"},{"Reference":"CVE-1999-0234","Description":"Sign extension error produces -1 value that is treated as a command separator, enabling OS command injection.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-1999-0234"},{"Reference":"CVE-2003-0161","Description":"Product uses \\"char\\" type for input character. When char is implemented as a signed type, ASCII value 0xFF (255), a sign extension produces a -1 value that is treated as a program-specific separator value, effectively disabling a length check and leading to a buffer overflow. This is also a multiple interpretation error.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2003-0161"},{"Reference":"CVE-2007-4988","Description":"chain: signed short width value in image processor is sign extended during conversion to unsigned int, which leads to integer overflow and heap-based buffer overflow.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2007-4988"},{"Reference":"CVE-2006-1834","Description":"chain: signedness error allows bypass of a length check; later sign extension makes exploitation easier.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2006-1834"},{"Reference":"CVE-2005-2753","Description":"Sign extension when manipulating Pascal-style strings leads to integer overflow and improper memory copy.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2005-2753"}]},"Taxonomy_Mappings":{"Taxonomy_Mapping":[{"Taxonomy_Name":"CLASP","Entry_Name":"Sign extension error"},{"Taxonomy_Name":"Software Fault Patterns","Entry_ID":"SFP1","Entry_Name":"Glitch in computation"},{"Taxonomy_Name":"CERT C Secure Coding","Entry_ID":"INT31-C","Entry_Name":"Ensure that integer conversions do not result in lost or misinterpreted data","Mapping_Fit":"CWE More Specific"}]},"References":{"Reference":[{"External_Reference_ID":"REF-161"},{"External_Reference_ID":"REF-162"}]},"Notes":{"Note":[{"Type":"Relationship","$t":"Sign extension errors can lead to buffer overflows and other memory-based problems. They are also likely to be factors in other weaknesses that are not based on memory operations, but rely on numeric calculation."},{"Type":"Maintenance","$t":"This entry is closely associated with signed-to-unsigned conversion errors (CWE-195) and other numeric errors. These relationships need to be more closely examined within CWE."}]},"Content_History":{"Submission":{"Submission_Name":"CLASP","Submission_Date":"2006-07-19"},"Modification":[{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2008-09-08","Modification_Comment":"updated Applicable_Platforms, Common_Consequences, Description, Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2008-11-05","Modification_Comment":"complete rewrite of the entire entry"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2008-11-24","Modification_Comment":"updated Common_Consequences, Demonstrative_Examples, Description, Maintenance_Notes, Name, Observed_Examples, Potential_Mitigations, References, Relationship_Notes, Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2009-05-27","Modification_Comment":"updated Demonstrative_Examples"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2009-10-29","Modification_Comment":"updated Demonstrative_Examples"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2010-04-05","Modification_Comment":"updated Demonstrative_Examples"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2010-12-13","Modification_Comment":"updated Applicable_Platforms"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-06-01","Modification_Comment":"updated Common_Consequences"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2012-05-11","Modification_Comment":"updated Demonstrative_Examples, Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2014-07-30","Modification_Comment":"updated Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2017-11-08","Modification_Comment":"updated References, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2019-01-03","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-02-24","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-06-25","Modification_Comment":"updated Observed_Examples"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-08-20","Modification_Comment":"updated Relationships"}],"Previous_Entry_Name":[{"Date":"2008-04-11","$t":"Sign Extension Error"},{"Date":"2008-11-24","$t":"Incorrect Sign Extension"}]}},{"ID":"195","Name":"Signed to Unsigned Conversion Error","Abstraction":"Variant","Structure":"Simple","Status":"Draft","Description":"The software uses a signed primitive and performs a cast to an unsigned primitive, which can produce an unexpected value if the value of the signed primitive can not be represented using an unsigned primitive.","Extended_Description":{"xhtml:p":["It is dangerous to rely on implicit casts between signed and unsigned numbers because the result can take on an unexpected value and violate assumptions made by the program.","Often, functions will return negative values to indicate a failure. When the result of a function is to be used as a size parameter, using these negative return values can have unexpected results. For example, if negative size values are passed to the standard memory copy or allocation functions they will be implicitly cast to a large unsigned value. This may lead to an exploitable buffer overflow or underflow condition."]},"Related_Weaknesses":{"Related_Weakness":[{"Nature":"ChildOf","CWE_ID":"681","View_ID":"1000","Ordinal":"Primary"},{"Nature":"ChildOf","CWE_ID":"681","View_ID":"1305","Ordinal":"Primary"},{"Nature":"CanPrecede","CWE_ID":"119","View_ID":"1000"}]},"Applicable_Platforms":{"Language":[{"Name":"C","Prevalence":"Undetermined"},{"Name":"C++","Prevalence":"Undetermined"}]},"Modes_Of_Introduction":{"Introduction":{"Phase":"Implementation"}},"Common_Consequences":{"Consequence":{"Scope":"Integrity","Impact":"Unexpected State","Note":"Conversion between signed and unsigned values can lead to a variety of errors, but from a security standpoint is most commonly associated with integer overflow and buffer overflow vulnerabilities."}},"Demonstrative_Examples":{"Demonstrative_Example":[{"Demonstrative_Example_ID":"DX-73","Intro_Text":"In this example the variable amount can hold a negative value when it is returned. Because the function is declared to return an unsigned int, amount will be implicitly converted to unsigned.","Example_Code":{"Nature":"bad","Language":"C","xhtml:div":{"xhtml:div":{"style":"margin-left:10px;","xhtml:br":[{},{},{},{},{}]}}},"Body_Text":"If the error condition in the code above is met, then the return value of readdata() will be 4,294,967,295 on a system that uses 32-bit integers."},{"Demonstrative_Example_ID":"DX-74","Intro_Text":"In this example, depending on the return value of accecssmainframe(), the variable amount can hold a negative value when it is returned. Because the function is declared to return an unsigned value, amount will be implicitly cast to an unsigned number.","Example_Code":{"Nature":"bad","Language":"C","xhtml:div":{"xhtml:div":{"style":"margin-left:10px;","xhtml:br":[{},{},{},{}]}}},"Body_Text":"If the return value of accessmainframe() is -1, then the return value of readdata() will be 4,294,967,295 on a system that uses 32-bit integers."},{"Demonstrative_Example_ID":"DX-21","Intro_Text":"The following code is intended to read an incoming packet from a socket and extract one or more headers.","Example_Code":{"Nature":"bad","Language":"C","xhtml:div":{"xhtml:br":[{},{},{},{},{},{},{},{},{},{}],"xhtml:div":{"style":"margin-left:10px;","$t":"ExitError(\\"too many headers!\\");"}}},"Body_Text":"The code performs a check to make sure that the packet does not contain too many headers. However, numHeaders is defined as a signed int, so it could be negative. If the incoming packet specifies a value such as -3, then the malloc calculation will generate a negative number (say, -300 if each header can be a maximum of 100 bytes). When this result is provided to malloc(), it is first converted to a size_t type. This conversion then produces a large value such as 4294966996, which may cause malloc() to fail or to allocate an extremely large amount of memory (CWE-195). With the appropriate negative numbers, an attacker could trick malloc() into using a very small positive number, which then allocates a buffer that is much smaller than expected, potentially leading to a buffer overflow."},{"Intro_Text":"This example processes user input comprised of a series of variable-length structures. The first 2 bytes of input dictate the size of the structure to be processed.","Example_Code":{"Nature":"bad","Language":"C","xhtml:div":{"$t":"char* processNext(char* strm) {}","xhtml:div":{"style":"margin-left:10px;","$t":"char buf[512];short len = *(short*) strm;strm += sizeof(len);if (len <= 512) {}else {}","xhtml:br":[{},{},{},{}],"xhtml:div":[{"style":"margin-left:10px;","xhtml:br":[{},{}]},{"style":"margin-left:10px;","$t":"return -1;"}]}}},"Body_Text":"The programmer has set an upper bound on the structure size: if it is larger than 512, the input will not be processed. The problem is that len is a signed short, so the check against the maximum structure length is done with signed values, but len is converted to an unsigned integer for the call to memcpy() and the negative bit will be extended to result in a huge value for the unsigned integer. If len is negative, then it will appear that the structure has an appropriate size (the if branch will be taken), but the amount of memory copied by memcpy() will be quite large, and the attacker will be able to overflow the stack with data in strm."},{"Demonstrative_Example_ID":"DX-114","Intro_Text":"In the following example, it is possible to request that memcpy move a much larger segment of memory than assumed:","Example_Code":{"Nature":"bad","Language":"C","xhtml:div":{"xhtml:div":[{"style":"margin-left:10px;","xhtml:div":{"xhtml:br":[{},{},{},{},{},{}],"xhtml:i":["/* if chunk info is valid, return the size of usable memory,","* else, return -1 to indicate an error","*/"]}},{"style":"margin-left:10px;","xhtml:br":[{},{}]}],"xhtml:br":{}}},"Body_Text":"If returnChunkSize() happens to encounter an error it will return -1. Notice that the return value is not checked before the memcpy operation (CWE-252), so -1 can be passed as the size argument to memcpy() (CWE-805). Because memcpy() assumes that the value is unsigned, it will be interpreted as MAXINT-1 (CWE-195), and therefore will copy far more memory than is likely available to the destination buffer (CWE-787, CWE-788)."}]},"Observed_Examples":{"Observed_Example":{"Reference":"CVE-2007-4268","Description":"Chain: integer signedness error (CWE-195) passes signed comparison, leading to heap overflow (CWE-122)","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2007-4268"}},"Taxonomy_Mappings":{"Taxonomy_Mapping":[{"Taxonomy_Name":"CLASP","Entry_Name":"Signed to unsigned conversion error"},{"Taxonomy_Name":"Software Fault Patterns","Entry_ID":"SFP1","Entry_Name":"Glitch in computation"},{"Taxonomy_Name":"CERT C Secure Coding","Entry_ID":"INT31-C","Entry_Name":"Ensure that integer conversions do not result in lost or misinterpreted data","Mapping_Fit":"CWE More Specific"}]},"References":{"Reference":{"External_Reference_ID":"REF-62","Section":"Chapter 6, \\"Type Conversions\\", Page 223"}},"Content_History":{"Submission":{"Submission_Name":"CLASP","Submission_Date":"2006-07-19"},"Modification":[{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2008-09-08","Modification_Comment":"updated Applicable_Platforms, Common_Consequences, Relationships, Other_Notes, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2009-05-27","Modification_Comment":"updated Demonstrative_Examples"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2009-10-29","Modification_Comment":"updated Common_Consequences, Description, Other_Notes, Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2010-02-16","Modification_Comment":"updated Demonstrative_Examples"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2010-04-05","Modification_Comment":"updated Demonstrative_Examples"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-03-29","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-06-01","Modification_Comment":"updated Common_Consequences"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-06-27","Modification_Comment":"updated Common_Consequences"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2012-05-11","Modification_Comment":"updated Demonstrative_Examples, References, Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2014-06-23","Modification_Comment":"updated Demonstrative_Examples, Description"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2014-07-30","Modification_Comment":"updated Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2017-01-19","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2017-11-08","Modification_Comment":"updated Observed_Examples, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2019-01-03","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-02-24","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-08-20","Modification_Comment":"updated Relationships"}]}},{"ID":"196","Name":"Unsigned to Signed Conversion Error","Abstraction":"Variant","Structure":"Simple","Status":"Draft","Description":"The software uses an unsigned primitive and performs a cast to a signed primitive, which can produce an unexpected value if the value of the unsigned primitive can not be represented using a signed primitive.","Extended_Description":"Although less frequent an issue than signed-to-unsigned conversion, unsigned-to-signed conversion can be the perfect precursor to dangerous buffer underwrite conditions that allow attackers to move down the stack where they otherwise might not have access in a normal buffer overflow condition. Buffer underwrites occur frequently when large unsigned values are cast to signed values, and then used as indexes into a buffer or for pointer arithmetic.","Related_Weaknesses":{"Related_Weakness":[{"Nature":"ChildOf","CWE_ID":"681","View_ID":"1000","Ordinal":"Primary"},{"Nature":"ChildOf","CWE_ID":"681","View_ID":"1305","Ordinal":"Primary"},{"Nature":"CanAlsoBe","CWE_ID":"124","View_ID":"1000"},{"Nature":"CanAlsoBe","CWE_ID":"120","View_ID":"1000"}]},"Applicable_Platforms":{"Language":[{"Name":"C","Prevalence":"Undetermined"},{"Name":"C++","Prevalence":"Undetermined"}]},"Modes_Of_Introduction":{"Introduction":{"Phase":"Implementation"}},"Likelihood_Of_Exploit":"Medium","Common_Consequences":{"Consequence":[{"Scope":"Availability","Impact":"DoS: Crash, Exit, or Restart","Note":"Incorrect sign conversions generally lead to undefined behavior, and therefore crashes."},{"Scope":"Integrity","Impact":"Modify Memory","Note":"If a poor cast lead to a buffer overflow or similar condition, data integrity may be affected."},{"Scope":["Integrity","Confidentiality","Availability","Access Control"],"Impact":["Execute Unauthorized Code or Commands","Bypass Protection Mechanism"],"Note":"Improper signed-to-unsigned conversions without proper checking can sometimes trigger buffer overflows which can be used to execute arbitrary code. This is usually outside the scope of a program\'s implicit security policy."}]},"Potential_Mitigations":{"Mitigation":[{"Phase":"Requirements","Description":"Choose a language which is not subject to these casting flaws."},{"Phase":"Architecture and Design","Description":"Design object accessor functions to implicitly check values for valid sizes. Ensure that all functions which will be used as a size are checked previous to use as a size. If the language permits, throw exceptions rather than using in-band errors."},{"Phase":"Implementation","Description":"Error check the return values of all functions. Be aware of implicit casts made, and use unsigned variables for sizes if at all possible."}]},"Taxonomy_Mappings":{"Taxonomy_Mapping":[{"Taxonomy_Name":"CLASP","Entry_Name":"Unsigned to signed conversion error"},{"Taxonomy_Name":"Software Fault Patterns","Entry_ID":"SFP1","Entry_Name":"Glitch in computation"}]},"Related_Attack_Patterns":{"Related_Attack_Pattern":{"CAPEC_ID":"92"}},"References":{"Reference":{"External_Reference_ID":"REF-62","Section":"Chapter 6, \\"Type Conversions\\", Page 223"}},"Content_History":{"Submission":{"Submission_Name":"CLASP","Submission_Date":"2006-07-19"},"Modification":[{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2008-09-08","Modification_Comment":"updated Applicable_Platforms, Common_Consequences, Relationships, Other_Notes, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2009-05-27","Modification_Comment":"updated Demonstrative_Examples"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2009-10-29","Modification_Comment":"updated Common_Consequences"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2010-12-13","Modification_Comment":"updated Other_Notes"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-06-01","Modification_Comment":"updated Common_Consequences"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2012-05-11","Modification_Comment":"updated References, Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2012-10-30","Modification_Comment":"updated Potential_Mitigations"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2014-06-23","Modification_Comment":"updated Demonstrative_Examples, Description, Other_Notes"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2014-07-30","Modification_Comment":"updated Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-02-24","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-08-20","Modification_Comment":"updated Relationships"}]}},{"ID":"197","Name":"Numeric Truncation Error","Abstraction":"Base","Structure":"Simple","Status":"Incomplete","Description":"Truncation errors occur when a primitive is cast to a primitive of a smaller size and data is lost in the conversion.","Extended_Description":"When a primitive is cast to a smaller primitive, the high order bits of the large value are lost in the conversion, potentially resulting in an unexpected value that is not equal to the original value. This value may be required as an index into a buffer, a loop iterator, or simply necessary state data. In any case, the value cannot be trusted and the system will be in an undefined state. While this method may be employed viably to isolate the low bits of a value, this usage is rare, and truncation usually implies that an implementation error has occurred.","Related_Weaknesses":{"Related_Weakness":[{"Nature":"ChildOf","CWE_ID":"681","View_ID":"1000","Ordinal":"Primary"},{"Nature":"ChildOf","CWE_ID":"681","View_ID":"1305","Ordinal":"Primary"},{"Nature":"CanAlsoBe","CWE_ID":"195","View_ID":"1000"},{"Nature":"CanAlsoBe","CWE_ID":"196","View_ID":"1000"},{"Nature":"CanAlsoBe","CWE_ID":"192","View_ID":"1000"},{"Nature":"CanAlsoBe","CWE_ID":"194","View_ID":"1000"}]},"Applicable_Platforms":{"Language":[{"Name":"C","Prevalence":"Undetermined"},{"Name":"C++","Prevalence":"Undetermined"},{"Name":"Java","Prevalence":"Undetermined"},{"Name":"C#","Prevalence":"Undetermined"}]},"Modes_Of_Introduction":{"Introduction":{"Phase":"Implementation"}},"Likelihood_Of_Exploit":"Low","Common_Consequences":{"Consequence":{"Scope":"Integrity","Impact":"Modify Memory","Note":"The true value of the data is lost and corrupted data is used."}},"Potential_Mitigations":{"Mitigation":{"Phase":"Implementation","Description":"Ensure that no casts, implicit or explicit, take place that move from a larger size primitive or a smaller size primitive."}},"Demonstrative_Examples":{"Demonstrative_Example":[{"Intro_Text":"This example, while not exploitable, shows the possible mangling of values associated with truncation errors:","Example_Code":[{"Nature":"bad","Language":"C","xhtml:div":{"xhtml:br":[{},{},{},{}]}},{"Nature":"result","xhtml:div":{"xhtml:br":{}}}],"Body_Text":["The above code, when compiled and run on certain systems, returns the following output:","This problem may be exploitable when the truncated value is used as an array index, which can happen implicitly when 64-bit values are used as indexes, as they are truncated to 32 bits."]},{"Intro_Text":"In the following Java example, the method updateSalesForProduct is part of a business application class that updates the sales information for a particular product. The method receives as arguments the product ID and the integer amount sold. The product ID is used to retrieve the total product count from an inventory object which returns the count as an integer. Before calling the method of the sales object to update the sales count the integer values are converted to The primitive type short since the method requires short type for the method arguments.","Example_Code":[{"Nature":"bad","Language":"Java","xhtml:div":{"xhtml:br":[{},{},{}],"xhtml:i":"// update sales database for number of product sold with product ID","xhtml:div":{"style":"margin-left:10px;","xhtml:div":{"xhtml:br":[{},{},{},{},{},{},{},{},{}],"xhtml:i":["// get the total number of products in inventory database","// convert integer values to short, the method for the","// sales object requires the parameters to be of type short","// update sales database for product"]}}}},{"Nature":"good","Language":"Java","xhtml:div":{"xhtml:br":[{},{},{}],"xhtml:i":"// update sales database for number of product sold with product ID","xhtml:div":{"style":"margin-left:10px;","$t":"","xhtml:div":{"$t":"int productCount = inventory.getProductCount(productID);\\n                           \\n                           \\n                           \\n                           \\n                           if ((productCount < Short.MAX_VALUE) && (amountSold < Short.MAX_VALUE)) {\\n                           else {\\n                           \\n                           \\n                           }","xhtml:br":[{},{},{},{},{},{},{},{},{}],"xhtml:i":["// get the total number of products in inventory database","// make sure that integer numbers are not greater than","// maximum value for type short before converting","// throw exception or perform other processing"],"xhtml:div":[{"style":"margin-left:10px;","xhtml:div":{"xhtml:br":[{},{},{},{},{},{},{}],"xhtml:i":["// convert integer values to short, the method for the","// sales object requires the parameters to be of type short","// update sales database for product"]}},{"style":"margin-left:10px;","$t":"..."}]}}}}],"Body_Text":"However, a numeric truncation error can occur if the integer values are higher than the maximum value allowed for the primitive type short. This can cause unexpected results or loss or corruption of data. In this case the sales database may be corrupted with incorrect data. Explicit casting from a from a larger size primitive type to a smaller size primitive type should be prevented. The following example an if statement is added to validate that the integer values less than the maximum value for the primitive type short before the explicit cast and the call to the sales method."}]},"Observed_Examples":{"Observed_Example":[{"Reference":"CVE-2009-0231","Description":"Integer truncation of length value leads to heap-based buffer overflow.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2009-0231"},{"Reference":"CVE-2008-3282","Description":"Size of a particular type changes for 64-bit platforms, leading to an integer truncation in document processor causes incorrect index to be generated.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2008-3282"}]},"Taxonomy_Mappings":{"Taxonomy_Mapping":[{"Taxonomy_Name":"PLOVER","Entry_Name":"Numeric truncation error"},{"Taxonomy_Name":"CLASP","Entry_Name":"Truncation error"},{"Taxonomy_Name":"CERT C Secure Coding","Entry_ID":"FIO34-C","Entry_Name":"Distinguish between characters read from a file and EOF or WEOF","Mapping_Fit":"CWE More Abstract"},{"Taxonomy_Name":"CERT C Secure Coding","Entry_ID":"FLP34-C","Entry_Name":"Ensure that floating point conversions are within range of the new type","Mapping_Fit":"CWE More Abstract"},{"Taxonomy_Name":"CERT C Secure Coding","Entry_ID":"INT02-C","Entry_Name":"Understand integer conversion rules"},{"Taxonomy_Name":"CERT C Secure Coding","Entry_ID":"INT05-C","Entry_Name":"Do not use input functions to convert character data if they cannot handle all possible inputs"},{"Taxonomy_Name":"CERT C Secure Coding","Entry_ID":"INT31-C","Entry_Name":"Ensure that integer conversions do not result in lost or misinterpreted data","Mapping_Fit":"CWE More Abstract"},{"Taxonomy_Name":"The CERT Oracle Secure Coding Standard for Java (2011)","Entry_ID":"NUM12-J","Entry_Name":"Ensure conversions of numeric types to narrower types do not result in lost or misinterpreted data"},{"Taxonomy_Name":"Software Fault Patterns","Entry_ID":"SFP1","Entry_Name":"Glitch in computation"}]},"References":{"Reference":{"External_Reference_ID":"REF-62","Section":"Chapter 6, \\"Truncation\\", Page 259"}},"Notes":{"Note":{"Type":"Research Gap","$t":"This weakness has traditionally been under-studied and under-reported, although vulnerabilities in popular software have been published in 2008 and 2009."}},"Content_History":{"Submission":{"Submission_Name":"PLOVER","Submission_Date":"2006-07-19"},"Modification":[{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2008-09-08","Modification_Comment":"updated Applicable_Platforms, Common_Consequences, Relationships, Other_Notes, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2008-11-24","Modification_Comment":"updated Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2009-05-27","Modification_Comment":"updated Demonstrative_Examples"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2009-07-27","Modification_Comment":"updated Description, Observed_Examples, Other_Notes, Research_Gaps"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2010-12-13","Modification_Comment":"updated Demonstrative_Examples"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-06-01","Modification_Comment":"updated Common_Consequences, Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-09-13","Modification_Comment":"updated Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2012-05-11","Modification_Comment":"updated References, Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2014-07-30","Modification_Comment":"updated Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2017-11-08","Modification_Comment":"updated Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2019-01-03","Modification_Comment":"updated Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-02-24","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-08-20","Modification_Comment":"updated Relationships"}]}},{"ID":"242","Name":"Use of Inherently Dangerous Function","Abstraction":"Base","Structure":"Simple","Status":"Draft","Description":"The program calls a function that can never be guaranteed to work safely.","Extended_Description":"Certain functions behave in dangerous ways regardless of how they are used. Functions in this category were often implemented without taking security concerns into account. The gets() function is unsafe because it does not perform bounds checking on the size of its input. An attacker can easily send arbitrarily-sized input to gets() and overflow the destination buffer. Similarly, the >> operator is unsafe to use when reading into a statically-allocated character array because it does not perform bounds checking on the size of its input. An attacker can easily send arbitrarily-sized input to the >> operator and overflow the destination buffer.","Related_Weaknesses":{"Related_Weakness":{"Nature":"ChildOf","CWE_ID":"1177","View_ID":"1000","Ordinal":"Primary"}},"Weakness_Ordinalities":{"Weakness_Ordinality":{"Ordinality":"Primary"}},"Applicable_Platforms":{"Language":[{"Name":"C","Prevalence":"Undetermined"},{"Name":"C++","Prevalence":"Undetermined"}]},"Modes_Of_Introduction":{"Introduction":{"Phase":"Implementation"}},"Likelihood_Of_Exploit":"High","Common_Consequences":{"Consequence":{"Scope":"Other","Impact":"Varies by Context"}},"Potential_Mitigations":{"Mitigation":[{"Phase":["Implementation","Requirements"],"Description":"Ban the use of dangerous functions. Use their safe equivalent."},{"Phase":"Testing","Description":"Use grep or static analysis tools to spot usage of dangerous functions."}]},"Demonstrative_Examples":{"Demonstrative_Example":[{"Intro_Text":"The code below calls gets() to read information into a buffer.","Example_Code":{"Nature":"bad","Language":"C","xhtml:div":{"xhtml:br":{}}},"Body_Text":"The gets() function in C is inherently unsafe."},{"Demonstrative_Example_ID":"DX-5","Intro_Text":"The code below calls the gets() function to read in data from the command line.","Example_Code":{"Nature":"bad","Language":"C","xhtml:div":{"xhtml:div":{"style":"margin-left:10px;","xhtml:br":[{},{},{}]}}},"Body_Text":"However, the programmer uses the function gets() which is inherently unsafe because it blindly copies all input from STDIN to the buffer without checking size. This allows the user to provide a string that is larger than the buffer size, resulting in an overflow condition."}]},"Taxonomy_Mappings":{"Taxonomy_Mapping":[{"Taxonomy_Name":"7 Pernicious Kingdoms","Entry_Name":"Dangerous Functions"},{"Taxonomy_Name":"CERT C Secure Coding","Entry_ID":"POS33-C","Entry_Name":"Do not use vfork()","Mapping_Fit":"CWE More Abstract"},{"Taxonomy_Name":"Software Fault Patterns","Entry_ID":"SFP3","Entry_Name":"Use of an improper API"}]},"References":{"Reference":[{"External_Reference_ID":"REF-6"},{"External_Reference_ID":"REF-194","Section":"Chapter 5. Working with I/O"},{"External_Reference_ID":"REF-7","Section":"Chapter 5, \\"gets and fgets\\" Page 163"}]},"Content_History":{"Submission":{"Submission_Name":"7 Pernicious Kingdoms","Submission_Date":"2006-07-19"},"Modification":[{"Modification_Name":"Sean Eidemiller","Modification_Organization":"Cigital","Modification_Date":"2008-07-01","Modification_Comment":"added/updated demonstrative examples"},{"Modification_Name":"Eric Dalci","Modification_Organization":"Cigital","Modification_Date":"2008-07-01","Modification_Comment":"updated Potential_Mitigations"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2008-09-08","Modification_Comment":"updated Applicable_Platforms, Relationships, Other_Notes, Taxonomy_Mappings, Type, Weakness_Ordinalities"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2008-11-24","Modification_Comment":"updated Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2009-10-29","Modification_Comment":"updated Description, Other_Notes, References"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2010-02-16","Modification_Comment":"updated Demonstrative_Examples, References, Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2010-04-05","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-06-01","Modification_Comment":"updated Common_Consequences"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-06-27","Modification_Comment":"updated Common_Consequences"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2012-05-11","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2012-10-30","Modification_Comment":"updated Potential_Mitigations"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2014-07-30","Modification_Comment":"updated Demonstrative_Examples, Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2017-11-08","Modification_Comment":"updated Causal_Nature, References, Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2018-03-27","Modification_Comment":"updated References"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2019-01-03","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-02-24","Modification_Comment":"updated References, Relationships"}],"Previous_Entry_Name":[{"Date":"2008-01-30","$t":"Dangerous Functions"},{"Date":"2008-04-11","$t":"Use of Inherently Dangerous Functions"}]}},{"ID":"243","Name":"Creation of chroot Jail Without Changing Working Directory","Abstraction":"Variant","Structure":"Simple","Status":"Draft","Description":"The program uses the chroot() system call to create a jail, but does not change the working directory afterward. This does not prevent access to files outside of the jail.","Extended_Description":"Improper use of chroot() may allow attackers to escape from the chroot jail. The chroot() function call does not change the process\'s current working directory, so relative paths may still refer to file system resources outside of the chroot jail after chroot() has been called.","Related_Weaknesses":{"Related_Weakness":[{"Nature":"ChildOf","CWE_ID":"573","View_ID":"1000"},{"Nature":"ChildOf","CWE_ID":"669","View_ID":"1000","Ordinal":"Primary"}]},"Weakness_Ordinalities":{"Weakness_Ordinality":{"Ordinality":"Resultant"}},"Applicable_Platforms":{"Language":[{"Name":"C","Prevalence":"Undetermined"},{"Name":"C++","Prevalence":"Undetermined"}],"Operating_System":{"Class":"Unix","Prevalence":"Undetermined"}},"Background_Details":{"Background_Detail":"The chroot() system call allows a process to change its perception of the root directory of the file system. After properly invoking chroot(), a process cannot access any files outside the directory tree defined by the new root directory. Such an environment is called a chroot jail and is commonly used to prevent the possibility that a processes could be subverted and used to access unauthorized files. For instance, many FTP servers run in chroot jails to prevent an attacker who discovers a new vulnerability in the server from being able to download the password file or other sensitive files on the system."},"Modes_Of_Introduction":{"Introduction":{"Phase":"Implementation","Note":"REALIZATION: This weakness is caused during implementation of an architectural security tactic."}},"Likelihood_Of_Exploit":"High","Common_Consequences":{"Consequence":{"Scope":"Confidentiality","Impact":"Read Files or Directories"}},"Demonstrative_Examples":{"Demonstrative_Example":{"Intro_Text":"Consider the following source code from a (hypothetical) FTP server:","Example_Code":{"Nature":"bad","Language":"C","xhtml:div":{"xhtml:br":[{},{},{},{},{}],"xhtml:div":{"style":"margin-left:10px;","$t":"fwrite(buf, 1, sizeof(buf), network);"}}},"Body_Text":"This code is responsible for reading a filename from the network, opening the corresponding file on the local machine, and sending the contents over the network. This code could be used to implement the FTP GET command. The FTP server calls chroot() in its initialization routines in an attempt to prevent access to files outside of /var/ftproot. But because the server does not change the current working directory by calling chdir(\\"/\\"), an attacker could request the file \\"../../../../../etc/passwd\\" and obtain a copy of the system password file."}},"Affected_Resources":{"Affected_Resource":"File or Directory"},"Taxonomy_Mappings":{"Taxonomy_Mapping":[{"Taxonomy_Name":"7 Pernicious Kingdoms","Entry_Name":"Directory Restriction"},{"Taxonomy_Name":"Software Fault Patterns","Entry_ID":"SFP17","Entry_Name":"Failed chroot jail"}]},"References":{"Reference":{"External_Reference_ID":"REF-6"}},"Content_History":{"Submission":{"Submission_Name":"7 Pernicious Kingdoms","Submission_Date":"2006-07-19"},"Modification":[{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2008-09-08","Modification_Comment":"updated Applicable_Platforms, Background_Details, Description, Relationships, Taxonomy_Mappings, Weakness_Ordinalities"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2008-10-14","Modification_Comment":"updated Description"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2009-03-10","Modification_Comment":"updated Demonstrative_Examples"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2009-05-27","Modification_Comment":"updated Demonstrative_Examples"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2010-12-13","Modification_Comment":"updated Demonstrative_Examples, Name"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-06-01","Modification_Comment":"updated Common_Consequences"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2012-05-11","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2014-07-30","Modification_Comment":"updated Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2017-11-08","Modification_Comment":"updated Affected_Resources, Causal_Nature, Modes_of_Introduction, Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-02-24","Modification_Comment":"updated References"}],"Previous_Entry_Name":[{"Date":"2008-01-30","$t":"Directory Restriction"},{"Date":"2010-12-13","$t":"Failure to Change Working Directory in chroot Jail"}]}},{"ID":"244","Name":"Improper Clearing of Heap Memory Before Release (\'Heap Inspection\')","Abstraction":"Variant","Structure":"Simple","Status":"Draft","Description":"Using realloc() to resize buffers that store sensitive information can leave the sensitive information exposed to attack, because it is not removed from memory.","Extended_Description":"When sensitive data such as a password or an encryption key is not removed from memory, it could be exposed to an attacker using a \\"heap inspection\\" attack that reads the sensitive data using memory dumps or other methods. The realloc() function is commonly used to increase the size of a block of allocated memory. This operation often requires copying the contents of the old memory block into a new and larger block. This operation leaves the contents of the original block intact but inaccessible to the program, preventing the program from being able to scrub sensitive data from memory. If an attacker can later examine the contents of a memory dump, the sensitive data could be exposed.","Related_Weaknesses":{"Related_Weakness":[{"Nature":"ChildOf","CWE_ID":"226","View_ID":"1000","Ordinal":"Primary"},{"Nature":"CanPrecede","CWE_ID":"669","View_ID":"1000"}]},"Applicable_Platforms":{"Language":[{"Name":"C","Prevalence":"Undetermined"},{"Name":"C++","Prevalence":"Undetermined"}]},"Modes_Of_Introduction":{"Introduction":{"Phase":"Implementation"}},"Common_Consequences":{"Consequence":{"Scope":["Confidentiality","Other"],"Impact":["Read Memory","Other"],"Note":"Be careful using vfork() and fork() in security sensitive code. The process state will not be cleaned up and will contain traces of data from past use."}},"Demonstrative_Examples":{"Demonstrative_Example":{"Intro_Text":"The following code calls realloc() on a buffer containing sensitive data:","Example_Code":{"Nature":"bad","Language":"C","xhtml:div":{"xhtml:br":[{},{},{}]}},"Body_Text":"There is an attempt to scrub the sensitive data from memory, but realloc() is used, so a copy of the data can still be exposed in the memory originally allocated for cleartext_buffer."}},"Affected_Resources":{"Affected_Resource":"Memory"},"Taxonomy_Mappings":{"Taxonomy_Mapping":[{"Taxonomy_Name":"7 Pernicious Kingdoms","Entry_Name":"Heap Inspection"},{"Taxonomy_Name":"CERT C Secure Coding","Entry_ID":"MEM03-C","Entry_Name":"Clear sensitive information stored in reusable resources returned for reuse"},{"Taxonomy_Name":"Software Fault Patterns","Entry_ID":"SFP23","Entry_Name":"Exposed Data"}]},"References":{"Reference":{"External_Reference_ID":"REF-6"}},"Content_History":{"Submission":{"Submission_Name":"7 Pernicious Kingdoms","Submission_Date":"2006-07-19"},"Modification":[{"Modification_Organization":"KDM Analytics","Modification_Date":"2008-08-01","Modification_Comment":"added/updated white box definitions"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2008-09-08","Modification_Comment":"updated Applicable_Platforms, Name, Relationships, Other_Notes, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2008-10-14","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2008-11-24","Modification_Comment":"updated Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2009-05-27","Modification_Comment":"updated Demonstrative_Examples, Name"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2009-10-29","Modification_Comment":"updated Common_Consequences, Description, Other_Notes"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2010-12-13","Modification_Comment":"updated Name"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-06-01","Modification_Comment":"updated Common_Consequences"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-09-13","Modification_Comment":"updated Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2012-05-11","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2014-07-30","Modification_Comment":"updated Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2017-11-08","Modification_Comment":"updated Relationships, Taxonomy_Mappings, White_Box_Definitions"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-02-24","Modification_Comment":"updated References, Relationships"}],"Previous_Entry_Name":[{"Date":"2008-04-11","$t":"Heap Inspection"},{"Date":"2008-09-09","$t":"Failure to Clear Heap Memory Before Release"},{"Date":"2009-05-27","$t":"Failure to Clear Heap Memory Before Release (aka \'Heap Inspection\')"},{"Date":"2010-12-13","$t":"Failure to Clear Heap Memory Before Release (\'Heap Inspection\')"}]}},{"ID":"362","Name":"Concurrent Execution using Shared Resource with Improper Synchronization (\'Race Condition\')","Abstraction":"Class","Structure":"Simple","Status":"Draft","Description":"The program contains a code sequence that can run concurrently with other code, and the code sequence requires temporary, exclusive access to a shared resource, but a timing window exists in which the shared resource can be modified by another code sequence that is operating concurrently.","Extended_Description":{"xhtml:p":["This can have security implications when the expected synchronization is in security-critical code, such as recording whether a user is authenticated or modifying important state information that should not be influenced by an outsider.","A race condition occurs within concurrent environments, and is effectively a property of a code sequence. Depending on the context, a code sequence may be in the form of a function call, a small number of instructions, a series of program invocations, etc.","A race condition violates these properties, which are closely related:","A race condition exists when an \\"interfering code sequence\\" can still access the shared resource, violating exclusivity. Programmers may assume that certain code sequences execute too quickly to be affected by an interfering code sequence; when they are not, this violates atomicity. For example, the single \\"x++\\" statement may appear atomic at the code layer, but it is actually non-atomic at the instruction layer, since it involves a read (the original value of x), followed by a computation (x+1), followed by a write (save the result to x).","The interfering code sequence could be \\"trusted\\" or \\"untrusted.\\" A trusted interfering code sequence occurs within the program; it cannot be modified by the attacker, and it can only be invoked indirectly. An untrusted interfering code sequence can be authored directly by the attacker, and typically it is external to the vulnerable program."],"xhtml:div":{"style":"margin-left:10px;","xhtml:ul":{"xhtml:li":["Exclusivity - the code sequence is given exclusive access to the shared resource, i.e., no other code sequence can modify properties of the shared resource before the original sequence has completed execution.","Atomicity - the code sequence is behaviorally atomic, i.e., no other thread or process can concurrently execute the same sequence of instructions (or a subset) against the same resource."]}}},"Related_Weaknesses":{"Related_Weakness":{"Nature":"ChildOf","CWE_ID":"691","View_ID":"1000","Ordinal":"Primary"}},"Applicable_Platforms":{"Language":[{"Name":"C","Prevalence":"Sometimes"},{"Name":"C++","Prevalence":"Sometimes"},{"Name":"Java","Prevalence":"Sometimes"}],"Technology":{"Class":"Mobile","Prevalence":"Undetermined"}},"Modes_Of_Introduction":{"Introduction":[{"Phase":"Architecture and Design"},{"Phase":"Implementation"}]},"Likelihood_Of_Exploit":"Medium","Common_Consequences":{"Consequence":[{"Scope":"Availability","Impact":["DoS: Resource Consumption (CPU)","DoS: Resource Consumption (Memory)","DoS: Resource Consumption (Other)"],"Note":"When a race condition makes it possible to bypass a resource cleanup routine or trigger multiple initialization routines, it may lead to resource exhaustion (CWE-400)."},{"Scope":"Availability","Impact":["DoS: Crash, Exit, or Restart","DoS: Instability"],"Note":"When a race condition allows multiple control flows to access a resource simultaneously, it might lead the program(s) into unexpected states, possibly resulting in a crash."},{"Scope":["Confidentiality","Integrity"],"Impact":["Read Files or Directories","Read Application Data"],"Note":"When a race condition is combined with predictable resource names and loose permissions, it may be possible for an attacker to overwrite or access confidential data (CWE-59)."}]},"Detection_Methods":{"Detection_Method":[{"Method":"Black Box","Description":"Black box methods may be able to identify evidence of race conditions via methods such as multiple simultaneous connections, which may cause the software to become instable or crash. However, race conditions with very narrow timing windows would not be detectable."},{"Method":"White Box","Description":"Common idioms are detectable in white box analysis, such as time-of-check-time-of-use (TOCTOU) file operations (CWE-367), or double-checked locking (CWE-609)."},{"Detection_Method_ID":"DM-2","Method":"Automated Dynamic Analysis","Description":{"xhtml:p":["This weakness can be detected using dynamic tools and techniques that interact with the software using large test suites with many diverse inputs, such as fuzz testing (fuzzing), robustness testing, and fault injection. The software\'s operation may slow down, but it should not become unstable, crash, or generate incorrect results.","Race conditions may be detected with a stress-test by calling the software simultaneously from a large number of threads or processes, and look for evidence of any unexpected behavior.","Insert breakpoints or delays in between relevant code statements to artificially expand the race window so that it will be easier to detect."]},"Effectiveness":"Moderate"},{"Method":"Automated Static Analysis - Binary or Bytecode","Description":{"xhtml:p":"According to SOAR, the following detection techniques may be useful:","xhtml:div":{"style":"margin-left:10px;","xhtml:div":["Highly cost effective:",{"style":"margin-left:10px;","xhtml:ul":{"xhtml:li":"Bytecode Weakness Analysis - including disassembler + source code weakness analysis"}},"Cost effective for partial coverage:",{"style":"margin-left:10px;","xhtml:ul":{"xhtml:li":"Binary Weakness Analysis - including disassembler + source code weakness analysis"}}]}},"Effectiveness":"High"},{"Method":"Dynamic Analysis with Automated Results Interpretation","Description":{"xhtml:p":"According to SOAR, the following detection techniques may be useful:","xhtml:div":{"style":"margin-left:10px;","xhtml:div":["Cost effective for partial coverage:",{"style":"margin-left:10px;","xhtml:ul":{"xhtml:li":["Web Application Scanner","Web Services Scanner","Database Scanners"]}}]}},"Effectiveness":"SOAR Partial"},{"Method":"Dynamic Analysis with Manual Results Interpretation","Description":{"xhtml:p":"According to SOAR, the following detection techniques may be useful:","xhtml:div":{"style":"margin-left:10px;","xhtml:div":["Highly cost effective:",{"style":"margin-left:10px;","xhtml:ul":{"xhtml:li":"Framework-based Fuzzer"}},"Cost effective for partial coverage:",{"style":"margin-left:10px;","xhtml:ul":{"xhtml:li":["Fuzz Tester","Monitored Virtual Environment - run potentially malicious code in sandbox / wrapper / virtual machine, see if it does anything suspicious"]}}]}},"Effectiveness":"High"},{"Method":"Manual Static Analysis - Source Code","Description":{"xhtml:p":"According to SOAR, the following detection techniques may be useful:","xhtml:div":{"style":"margin-left:10px;","xhtml:div":["Highly cost effective:",{"style":"margin-left:10px;","xhtml:ul":{"xhtml:li":"Manual Source Code Review (not inspections)"}},"Cost effective for partial coverage:",{"style":"margin-left:10px;","xhtml:ul":{"xhtml:li":"Focused Manual Spotcheck - Focused manual analysis of source"}}]}},"Effectiveness":"High"},{"Method":"Automated Static Analysis - Source Code","Description":{"xhtml:p":"According to SOAR, the following detection techniques may be useful:","xhtml:div":{"style":"margin-left:10px;","xhtml:div":["Highly cost effective:",{"style":"margin-left:10px;","xhtml:ul":{"xhtml:li":["Source code Weakness Analyzer","Context-configured Source Code Weakness Analyzer"]}}]}},"Effectiveness":"High"},{"Method":"Architecture or Design Review","Description":{"xhtml:p":"According to SOAR, the following detection techniques may be useful:","xhtml:div":{"style":"margin-left:10px;","xhtml:div":["Highly cost effective:",{"style":"margin-left:10px;","xhtml:ul":{"xhtml:li":"Formal Methods / Correct-By-Construction"}},"Cost effective for partial coverage:",{"style":"margin-left:10px;","xhtml:ul":{"xhtml:li":"Inspection (IEEE 1028 standard) (can apply to requirements, design, source code, etc.)"}}]}},"Effectiveness":"High"}]},"Potential_Mitigations":{"Mitigation":[{"Phase":"Architecture and Design","Description":"In languages that support it, use synchronization primitives. Only wrap these around critical code to minimize the impact on performance."},{"Phase":"Architecture and Design","Description":"Use thread-safe capabilities such as the data access abstraction in Spring."},{"Phase":"Architecture and Design","Description":{"xhtml:p":["Minimize the usage of shared resources in order to remove as much complexity as possible from the control flow and to reduce the likelihood of unexpected conditions occurring.","Additionally, this will minimize the amount of synchronization necessary and may even help to reduce the likelihood of a denial of service where an attacker may be able to repeatedly trigger a critical section (CWE-400)."]}},{"Phase":"Implementation","Description":"When using multithreading and operating on shared variables, only use thread-safe functions."},{"Phase":"Implementation","Description":"Use atomic operations on shared variables. Be wary of innocent-looking constructs such as \\"x++\\". This may appear atomic at the code layer, but it is actually non-atomic at the instruction layer, since it involves a read, followed by a computation, followed by a write."},{"Phase":"Implementation","Description":"Use a mutex if available, but be sure to avoid related weaknesses such as CWE-412."},{"Phase":"Implementation","Description":"Avoid double-checked locking (CWE-609) and other implementation errors that arise when trying to avoid the overhead of synchronization."},{"Phase":"Implementation","Description":"Disable interrupts or signals over critical parts of the code, but also make sure that the code does not go into a large or infinite loop."},{"Phase":"Implementation","Description":"Use the volatile type modifier for critical variables to avoid unexpected compiler optimization or reordering. This does not necessarily solve the synchronization problem, but it can help."},{"Mitigation_ID":"MIT-17","Phase":["Architecture and Design","Operation"],"Strategy":"Environment Hardening","Description":"Run your code using the lowest privileges that are required to accomplish the necessary tasks [REF-76]. If possible, create isolated accounts with limited privileges that are only used for a single task. That way, a successful attack will not immediately give the attacker access to the rest of the software or its environment. For example, database applications rarely need to run as the database administrator, especially in day-to-day operations."}]},"Demonstrative_Examples":{"Demonstrative_Example":[{"Intro_Text":"This code could be used in an e-commerce application that supports transfers between accounts. It takes the total amount of the transfer, sends it to the new account, and deducts the amount from the original account.","Example_Code":[{"Nature":"bad","Language":"Perl","xhtml:div":{"xhtml:br":[{},{},{},{},{},{},{},{}],"xhtml:div":[{"style":"margin-left:10px;","$t":"FatalError(\\"Bad Transfer Amount\\");"},{"style":"margin-left:10px;","$t":"FatalError(\\"Insufficient Funds\\");"}]}},{"Nature":"attack","Language":"Other","xhtml:div":{"xhtml:br":[{},{},{},{},{},{},{},{},{},{}]}}],"Body_Text":["A race condition could occur between the calls to GetBalanceFromDatabase() and SendNewBalanceToDatabase().","Suppose the balance is initially 100.00. An attack could be constructed as follows:","At this stage, the attacker should have a balance of 19.00 (due to 81.00 worth of transfers), but the balance is 99.00, as recorded in the database.","To prevent this weakness, the programmer has several options, including using a lock to prevent multiple simultaneous requests to the web application, or using a synchronization mechanism that includes all the code between GetBalanceFromDatabase() and SendNewBalanceToDatabase()."]},{"Demonstrative_Example_ID":"DX-24","Intro_Text":"The following function attempts to acquire a lock in order to perform operations on a shared resource.","Example_Code":[{"Nature":"bad","Language":"C","xhtml:div":{"xhtml:div":{"style":"margin-left:10px;","xhtml:div":{"xhtml:br":[{},{},{},{},{}],"xhtml:i":"/* access shared resource */"}}}},{"Nature":"good","xhtml:div":{"xhtml:div":{"style":"margin-left:10px;","xhtml:div":{"xhtml:br":[{},{},{},{},{},{},{},{}],"xhtml:div":{"style":"margin-left:10px;","$t":"return result;"},"xhtml:i":"/* access shared resource */"}}}}],"Body_Text":["However, the code does not check the value returned by pthread_mutex_lock() for errors. If pthread_mutex_lock() cannot acquire the mutex for any reason, the function may introduce a race condition into the program and result in undefined behavior.","In order to avoid data races, correctly written programs must check the result of thread synchronization functions and appropriately handle all errors, either by attempting to recover from them or reporting it to higher levels."]},{"Demonstrative_Example_ID":"DX-132","Intro_Text":"Suppose a processor\'s Memory Management Unit (MMU) has 5 other shadow MMUs to distribute its workload for its various cores. Each MMU has the start address and end address of \\"accessible\\" memory. Any time this accessible range changes (as per the processor\'s boot status), the main MMU sends an update message to all the shadow MMUs.","Body_Text":"Suppose the interconnect fabric does not prioritize such \\"update\\" packets over other general traffic packets. This introduces a race condition. If an attacker can flood the target with enough messages so that some of those attack packets reach the target before the new access ranges gets updated, then the attacker can leverage this scenario."}]},"Observed_Examples":{"Observed_Example":[{"Reference":"CVE-2019-18827","Description":"chain: JTAG interface is not disabled (CWE-1191) during ROM code execution, introducing a race condition (CWE-362) to extract encryption keys","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2019-18827"},{"Reference":"CVE-2008-5044","Description":"Race condition leading to a crash by calling a hook removal procedure while other activities are occurring at the same time.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2008-5044"},{"Reference":"CVE-2008-2958","Description":"chain: time-of-check time-of-use (TOCTOU) race condition in program allows bypass of protection mechanism that was designed to prevent symlink attacks.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2008-2958"},{"Reference":"CVE-2008-1570","Description":"chain: time-of-check time-of-use (TOCTOU) race condition in program allows bypass of protection mechanism that was designed to prevent symlink attacks.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2008-1570"},{"Reference":"CVE-2008-0058","Description":"Unsynchronized caching operation enables a race condition that causes messages to be sent to a deallocated object.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2008-0058"},{"Reference":"CVE-2008-0379","Description":"Race condition during initialization triggers a buffer overflow.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2008-0379"},{"Reference":"CVE-2007-6599","Description":"Daemon crash by quickly performing operations and undoing them, which eventually leads to an operation that does not acquire a lock.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2007-6599"},{"Reference":"CVE-2007-6180","Description":"chain: race condition triggers NULL pointer dereference","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2007-6180"},{"Reference":"CVE-2007-5794","Description":"Race condition in library function could cause data to be sent to the wrong process.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2007-5794"},{"Reference":"CVE-2007-3970","Description":"Race condition in file parser leads to heap corruption.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2007-3970"},{"Reference":"CVE-2008-5021","Description":"chain: race condition allows attacker to access an object while it is still being initialized, causing software to access uninitialized memory.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2008-5021"},{"Reference":"CVE-2009-4895","Description":"chain: race condition for an argument value, possibly resulting in NULL dereference","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2009-4895"},{"Reference":"CVE-2009-3547","Description":"chain: race condition might allow resource to be released before operating on it, leading to NULL dereference","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2009-3547"}]},"Taxonomy_Mappings":{"Taxonomy_Mapping":[{"Taxonomy_Name":"PLOVER","Entry_Name":"Race Conditions"},{"Taxonomy_Name":"The CERT Oracle Secure Coding Standard for Java (2011)","Entry_ID":"VNA03-J","Entry_Name":"Do not assume that a group of calls to independently atomic methods is atomic"}]},"Related_Attack_Patterns":{"Related_Attack_Pattern":[{"CAPEC_ID":"26"},{"CAPEC_ID":"29"}]},"References":{"Reference":[{"External_Reference_ID":"REF-44","Section":"\\"Sin 13: Race Conditions.\\" Page 205"},{"External_Reference_ID":"REF-349"},{"External_Reference_ID":"REF-350"},{"External_Reference_ID":"REF-351"},{"External_Reference_ID":"REF-352"},{"External_Reference_ID":"REF-353"},{"External_Reference_ID":"REF-354"},{"External_Reference_ID":"REF-355"},{"External_Reference_ID":"REF-356"},{"External_Reference_ID":"REF-357"},{"External_Reference_ID":"REF-76"}]},"Notes":{"Note":[{"Type":"Maintenance","$t":"The relationship between race conditions and synchronization problems (CWE-662) needs to be further developed. They are not necessarily two perspectives of the same core concept, since synchronization is only one technique for avoiding race conditions, and synchronization can be used for other purposes besides race condition prevention."},{"Type":"Research Gap","$t":"Race conditions in web applications are under-studied and probably under-reported. However, in 2008 there has been growing interest in this area."},{"Type":"Research Gap","$t":"Much of the focus of race condition research has been in Time-of-check Time-of-use (TOCTOU) variants (CWE-367), but many race conditions are related to synchronization problems that do not necessarily require a time-of-check."},{"Type":"Research Gap","$t":"From a classification/taxonomy perspective, the relationships between concurrency and program state need closer investigation and may be useful in organizing related issues."}]},"Content_History":{"Submission":{"Submission_Name":"PLOVER","Submission_Date":"2006-07-19"},"Modification":[{"Modification_Name":"Eric Dalci","Modification_Organization":"Cigital","Modification_Date":"2008-07-01","Modification_Comment":"updated Time_of_Introduction"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2008-09-08","Modification_Comment":"updated Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2008-10-14","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2008-11-24","Modification_Comment":"updated Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2009-01-12","Modification_Comment":"updated Applicable_Platforms, Common_Consequences, Demonstrative_Examples, Description, Likelihood_of_Exploit, Maintenance_Notes, Observed_Examples, Potential_Mitigations, References, Relationships, Research_Gaps"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2009-03-10","Modification_Comment":"updated Demonstrative_Examples, Potential_Mitigations"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2009-05-27","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2010-02-16","Modification_Comment":"updated Detection_Factors, References, Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2010-06-21","Modification_Comment":"updated Common_Consequences, Demonstrative_Examples, Detection_Factors, Potential_Mitigations, References"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2010-09-27","Modification_Comment":"updated Observed_Examples, Potential_Mitigations, Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2010-12-13","Modification_Comment":"updated Applicable_Platforms, Demonstrative_Examples, Description, Name, Potential_Mitigations, Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-06-01","Modification_Comment":"updated Common_Consequences, Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-06-27","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-09-13","Modification_Comment":"updated Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2012-05-11","Modification_Comment":"updated Potential_Mitigations, References, Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2014-07-30","Modification_Comment":"updated Detection_Factors, Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2015-12-07","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2017-11-08","Modification_Comment":"updated Demonstrative_Examples, References, Research_Gaps, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2019-01-03","Modification_Comment":"updated Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2019-06-20","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-02-24","Modification_Comment":"updated Applicable_Platforms, Demonstrative_Examples, Observed_Examples, Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-08-20","Modification_Comment":"updated Relationships"}],"Contribution":{"Type":"Content","Contribution_Name":"Martin Sebor","Contribution_Organization":"Cisco Systems, Inc.","Contribution_Date":"2010-04-30","Contribution_Comment":"Provided Demonstrative Example"},"Previous_Entry_Name":[{"Date":"2008-04-11","$t":"Race Conditions"},{"Date":"2010-12-13","$t":"Race Condition"}]}},{"ID":"364","Name":"Signal Handler Race Condition","Abstraction":"Base","Structure":"Simple","Status":"Incomplete","Description":"The software uses a signal handler that introduces a race condition.","Extended_Description":{"xhtml:p":["Race conditions frequently occur in signal handlers, since signal handlers support asynchronous actions. These race conditions have a variety of root causes and symptoms. Attackers may be able to exploit a signal handler race condition to cause the software state to be corrupted, possibly leading to a denial of service or even code execution.","These issues occur when non-reentrant functions, or state-sensitive actions occur in the signal handler, where they may be called at any time. These behaviors can violate assumptions being made by the \\"regular\\" code that is interrupted, or by other signal handlers that may also be invoked. If these functions are called at an inopportune moment - such as while a non-reentrant function is already running - memory corruption could occur that may be exploitable for code execution. Another signal race condition commonly found occurs when free is called within a signal handler, resulting in a double free and therefore a write-what-where condition. Even if a given pointer is set to NULL after it has been freed, a race condition still exists between the time the memory was freed and the pointer was set to NULL. This is especially problematic if the same signal handler has been set for more than one signal -- since it means that the signal handler itself may be reentered.","There are several known behaviors related to signal handlers that have received the label of \\"signal handler race condition\\":","Signal handler vulnerabilities are often classified based on the absence of a specific protection mechanism, although this style of classification is discouraged in CWE because programmers often have a choice of several different mechanisms for addressing the weakness. Such protection mechanisms may preserve exclusivity of access to the shared resource, and behavioral atomicity for the relevant code:"],"xhtml:div":[{"style":"margin-left:10px;","xhtml:ul":{"xhtml:li":["Shared state (e.g. global data or static variables) that are accessible to both a signal handler and \\"regular\\" code","Shared state between a signal handler and other signal handlers","Use of non-reentrant functionality within a signal handler - which generally implies that shared state is being used. For example, malloc() and free() are non-reentrant because they may use global or static data structures for managing memory, and they are indirectly used by innocent-seeming functions such as syslog(); these functions could be exploited for memory corruption and, possibly, code execution.","Association of the same signal handler function with multiple signals - which might imply shared state, since the same code and resources are accessed. For example, this can be a source of double-free and use-after-free weaknesses.","Use of setjmp and longjmp, or other mechanisms that prevent a signal handler from returning control back to the original functionality","While not technically a race condition, some signal handlers are designed to be called at most once, and being called more than once can introduce security problems, even when there are not any concurrent calls to the signal handler. This can be a source of double-free and use-after-free weaknesses."]}},{"style":"margin-left:10px;","xhtml:ul":{"xhtml:li":["Avoiding shared state","Using synchronization in the signal handler","Using synchronization in the regular code","Disabling or masking other signals, which provides atomicity (which effectively ensures exclusivity)"]}}]},"Related_Weaknesses":{"Related_Weakness":[{"Nature":"ChildOf","CWE_ID":"362","View_ID":"1000","Ordinal":"Primary"},{"Nature":"CanPrecede","CWE_ID":"415","View_ID":"1000"},{"Nature":"CanPrecede","CWE_ID":"416","View_ID":"1000"},{"Nature":"CanPrecede","CWE_ID":"123","View_ID":"1000"}]},"Applicable_Platforms":{"Language":[{"Name":"C","Prevalence":"Sometimes"},{"Name":"C++","Prevalence":"Sometimes"}]},"Modes_Of_Introduction":{"Introduction":[{"Phase":"Architecture and Design"},{"Phase":"Implementation"}]},"Likelihood_Of_Exploit":"Medium","Common_Consequences":{"Consequence":[{"Scope":["Integrity","Confidentiality","Availability"],"Impact":["Modify Application Data","Modify Memory","DoS: Crash, Exit, or Restart","Execute Unauthorized Code or Commands"],"Note":"It may be possible to cause data corruption and possibly execute arbitrary code by modifying global variables or data structures at unexpected times, violating the assumptions of code that uses this global data."},{"Scope":"Access Control","Impact":"Gain Privileges or Assume Identity","Note":"If a signal handler interrupts code that is executing with privileges, it may be possible that the signal handler will also be executed with elevated privileges, possibly making subsequent exploits more severe."}]},"Potential_Mitigations":{"Mitigation":[{"Mitigation_ID":"MIT-3","Phase":"Requirements","Strategy":"Language Selection","Description":"Use a language that does not allow this weakness to occur or provides constructs that make this weakness easier to avoid."},{"Phase":"Architecture and Design","Description":"Design signal handlers to only set flags, rather than perform complex functionality. These flags can then be checked and acted upon within the main program loop."},{"Phase":"Implementation","Description":"Only use reentrant functions within signal handlers. Also, use sanity checks to ensure that state is consistent while performing asynchronous actions that affect the state of execution."}]},"Demonstrative_Examples":{"Demonstrative_Example":[{"Demonstrative_Example_ID":"DX-26","Intro_Text":"This code registers the same signal handler function with two different signals (CWE-831). If those signals are sent to the process, the handler creates a log message (specified in the first argument to the program) and exits.","Example_Code":{"Nature":"bad","Language":"C","xhtml:div":{"xhtml:br":[{},{},{},{}],"xhtml:div":[{"style":"margin-left:10px;","xhtml:div":{"xhtml:br":[{},{},{},{},{}],"xhtml:i":"/* artificially increase the size of the timing window to make demonstration of this weakness easier. */"}},{"style":"margin-left:10px;","xhtml:div":{"xhtml:br":[{},{},{},{},{},{},{}],"xhtml:i":["/* Register signal handlers. */","/* artificially increase the size of the timing window to make demonstration of this weakness easier. */"]}}]}},"Body_Text":["The handler function uses global state (globalVar and logMessage), and it can be called by both the SIGHUP and SIGTERM signals. An attack scenario might follow these lines:",{"xhtml:ul":{"xhtml:li":[{"xhtml:div":"The program begins execution, initializes logMessage, and registers the signal handlers for SIGHUP and SIGTERM."},{"xhtml:div":"The program begins its \\"normal\\" functionality, which is simplified as sleep(), but could be any functionality that consumes some time."},{"xhtml:div":"The attacker sends SIGHUP, which invokes handler (call this \\"SIGHUP-handler\\")."},{"xhtml:div":"SIGHUP-handler begins to execute, calling syslog()."},{"xhtml:div":"syslog() calls malloc(), which is non-reentrant. malloc() begins to modify metadata to manage the heap."},{"xhtml:div":"The attacker then sends SIGTERM."},{"xhtml:div":"SIGHUP-handler is interrupted, but syslog\'s malloc call is still executing and has not finished modifying its metadata."},{"xhtml:div":"The SIGTERM handler is invoked."},{"xhtml:div":"SIGTERM-handler records the log message using syslog(), then frees the logMessage variable."}]}},"At this point, the state of the heap is uncertain, because malloc is still modifying the metadata for the heap; the metadata might be in an inconsistent state. The SIGTERM-handler call to free() is assuming that the metadata is inconsistent, possibly causing it to write data to the wrong location while managing the heap. The result is memory corruption, which could lead to a crash or even code execution, depending on the circumstances under which the code is running.","Note that this is an adaptation of a classic example as originally presented by Michal Zalewski [REF-360]; the original example was shown to be exploitable for code execution.","Also note that the strdup(argv[1]) call contains a potential buffer over-read (CWE-126) if the program is called without any arguments, because argc would be 0, and argv[1] would point outside the bounds of the array."]},{"Demonstrative_Example_ID":"DX-48","Intro_Text":"The following code registers a signal handler with multiple signals in order to log when a specific event occurs and to free associated memory before exiting.","Example_Code":{"Nature":"bad","Language":"C","xhtml:div":{"xhtml:br":[{},{},{},{},{},{},{},{},{}],"xhtml:div":[{"style":"margin-left:10px;","xhtml:div":{"xhtml:br":[{},{},{},{},{},{}],"xhtml:i":"/* Sleep statements added to expand timing window for race condition */"}},{"style":"margin-left:10px;","xhtml:div":{"xhtml:br":[{},{},{},{},{},{},{},{}],"xhtml:i":"/* Sleep statements added to expand timing window for race condition */"}}]}},"Body_Text":["However, the following sequence of events may result in a double-free (CWE-415):",{"xhtml:ol":{"xhtml:li":[{"xhtml:div":"a SIGHUP is delivered to the process"},{"xhtml:div":"sh() is invoked to process the SIGHUP"},{"xhtml:div":"This first invocation of sh() reaches the point where global1 is freed"},{"xhtml:div":"At this point, a SIGTERM is sent to the process"},{"xhtml:div":"the second invocation of sh() might do another free of global1"},{"xhtml:div":"this results in a double-free (CWE-415)"}]}},"This is just one possible exploitation of the above code. As another example, the syslog call may use malloc calls which are not async-signal safe. This could cause corruption of the heap management structures. For more details, consult the example within \\"Delivering Signals for Fun and Profit\\" [REF-360]."]}]},"Observed_Examples":{"Observed_Example":[{"Reference":"CVE-1999-0035","Description":"Signal handler does not disable other signal handlers, allowing it to be interrupted, causing other functionality to access files/etc. with raised privileges","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-1999-0035"},{"Reference":"CVE-2001-0905","Description":"Attacker can send a signal while another signal handler is already running, leading to crash or execution with root privileges","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2001-0905"},{"Reference":"CVE-2001-1349","Description":"unsafe calls to library functions from signal handler","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2001-1349"},{"Reference":"CVE-2004-0794","Description":"SIGURG can be used to remotely interrupt signal handler; other variants exist","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2004-0794"},{"Reference":"CVE-2004-2259","Description":"SIGCHLD signal to FTP server can cause crash under heavy load while executing non-reentrant functions like malloc/free.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2004-2259"}]},"Functional_Areas":{"Functional_Area":["Signals","Interprocess Communication"]},"Affected_Resources":{"Affected_Resource":"System Process"},"Taxonomy_Mappings":{"Taxonomy_Mapping":[{"Taxonomy_Name":"PLOVER","Entry_Name":"Signal handler race condition"},{"Taxonomy_Name":"7 Pernicious Kingdoms","Entry_Name":"Signal Handling Race Conditions"},{"Taxonomy_Name":"CLASP","Entry_Name":"Race condition in signal handler"},{"Taxonomy_Name":"Software Fault Patterns","Entry_ID":"SFP19","Entry_Name":"Missing Lock"}]},"References":{"Reference":[{"External_Reference_ID":"REF-18"},{"External_Reference_ID":"REF-360"},{"External_Reference_ID":"REF-361"},{"External_Reference_ID":"REF-44","Section":"\\"Sin 13: Race Conditions.\\" Page 205"},{"External_Reference_ID":"REF-62","Section":"Chapter 13, \\"Signal Vulnerabilities\\", Page 791"}]},"Notes":{"Note":{"Type":"Research Gap","$t":"Probably under-studied."}},"Content_History":{"Submission":{"Submission_Name":"PLOVER","Submission_Date":"2006-07-19"},"Modification":[{"Modification_Name":"Eric Dalci","Modification_Organization":"Cigital","Modification_Date":"2008-07-01","Modification_Comment":"updated Time_of_Introduction"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2008-09-08","Modification_Comment":"updated Applicable_Platforms, Common_Consequences, Relationships, Other_Notes, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2010-09-27","Modification_Comment":"updated Observed_Examples, References"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2010-12-13","Modification_Comment":"updated Common_Consequences, Demonstrative_Examples, Description, Observed_Examples, Other_Notes, Potential_Mitigations, Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-06-01","Modification_Comment":"updated Common_Consequences"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2012-05-11","Modification_Comment":"updated Demonstrative_Examples, References, Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2014-06-23","Modification_Comment":"updated Demonstrative_Examples, References"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2014-07-30","Modification_Comment":"updated Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2017-11-08","Modification_Comment":"updated Observed_Examples, Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-02-24","Modification_Comment":"updated References, Relationships"}]}},{"ID":"365","Name":"Race Condition in Switch","Abstraction":"Base","Structure":"Simple","Status":"Draft","Description":"The code contains a switch statement in which the switched variable can be modified while the switch is still executing, resulting in unexpected behavior.","Extended_Description":"This issue is particularly important in the case of switch statements that involve fall-through style case statements - i.e., those which do not end with break. If the variable being tested by the switch changes in the course of execution, this could change the intended logic of the switch so much that it places the process in a contradictory state and in some cases could even result in memory corruption.","Related_Weaknesses":{"Related_Weakness":[{"Nature":"ChildOf","CWE_ID":"367","View_ID":"1000","Ordinal":"Primary"},{"Nature":"PeerOf","CWE_ID":"364","View_ID":"1000"},{"Nature":"PeerOf","CWE_ID":"366","View_ID":"1000"}]},"Applicable_Platforms":{"Language":[{"Name":"C","Prevalence":"Undetermined"},{"Name":"C++","Prevalence":"Undetermined"},{"Name":"Java","Prevalence":"Undetermined"},{"Name":"C#","Prevalence":"Undetermined"}]},"Modes_Of_Introduction":{"Introduction":{"Phase":"Implementation"}},"Likelihood_Of_Exploit":"Medium","Common_Consequences":{"Consequence":{"Scope":["Integrity","Other"],"Impact":["Alter Execution Logic","Unexpected State"],"Note":"This weakness may lead to unexpected system state, resulting in unpredictable behavior."}},"Potential_Mitigations":{"Mitigation":{"Phase":"Implementation","Description":"Variables that may be subject to race conditions should be locked before the switch statement starts and only unlocked after the statement ends."}},"Demonstrative_Examples":{"Demonstrative_Example":{"Intro_Text":"This example has a switch statement that executes different code depending on the current time.","Example_Code":{"Nature":"bad","Language":"C","xhtml:div":{"xhtml:br":[{},{}],"xhtml:div":{"style":"margin-left:10px;","xhtml:br":[{},{},{},{},{}],"xhtml:div":{"style":"margin-left:10px;","xhtml:br":[{},{},{},{},{}]}}}},"Body_Text":"It seems that the default case of the switch statement should never be reached, as st_ctime % 2 should always be 0 or 1. However, if st_ctime % 2 is 1 when the first case is evaluated, the time may change and st_ctime % 2 may be equal to 0 when the second case is evaluated. The result is that neither case 1 or case 2 execute, and the default option is chosen."}},"Taxonomy_Mappings":{"Taxonomy_Mapping":[{"Taxonomy_Name":"CLASP","Entry_Name":"Race condition in switch"},{"Taxonomy_Name":"Software Fault Patterns","Entry_ID":"SFP19","Entry_Name":"Missing Lock"}]},"References":{"Reference":[{"External_Reference_ID":"REF-18"},{"External_Reference_ID":"REF-44","Section":"\\"Sin 13: Race Conditions.\\" Page 205"}]},"Content_History":{"Submission":{"Submission_Name":"CLASP","Submission_Date":"2006-07-19"},"Modification":[{"Modification_Name":"Eric Dalci","Modification_Organization":"Cigital","Modification_Date":"2008-07-01","Modification_Comment":"updated Time_of_Introduction"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2008-09-08","Modification_Comment":"updated Applicable_Platforms, Common_Consequences, Relationships, Other_Notes, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2008-11-24","Modification_Comment":"updated Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2010-09-27","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-06-01","Modification_Comment":"updated Common_Consequences"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-06-27","Modification_Comment":"updated Common_Consequences"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2012-05-11","Modification_Comment":"updated Demonstrative_Examples, References, Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2014-06-23","Modification_Comment":"updated Common_Consequences, Description, Other_Notes, Potential_Mitigations"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2014-07-30","Modification_Comment":"updated Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2017-11-08","Modification_Comment":"updated Demonstrative_Examples"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2019-01-03","Modification_Comment":"updated Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-02-24","Modification_Comment":"updated Description, References, Relationships"}]}},{"ID":"366","Name":"Race Condition within a Thread","Abstraction":"Base","Structure":"Simple","Status":"Draft","Description":"If two threads of execution use a resource simultaneously, there exists the possibility that resources may be used while invalid, in turn making the state of execution undefined.","Related_Weaknesses":{"Related_Weakness":[{"Nature":"ChildOf","CWE_ID":"362","View_ID":"1000","Ordinal":"Primary"},{"Nature":"ChildOf","CWE_ID":"662","View_ID":"1305","Ordinal":"Primary"}]},"Applicable_Platforms":{"Language":[{"Name":"C","Prevalence":"Undetermined"},{"Name":"C++","Prevalence":"Undetermined"},{"Name":"Java","Prevalence":"Undetermined"},{"Name":"C#","Prevalence":"Undetermined"}]},"Modes_Of_Introduction":{"Introduction":[{"Phase":"Architecture and Design"},{"Phase":"Implementation"}]},"Likelihood_Of_Exploit":"Medium","Common_Consequences":{"Consequence":{"Scope":["Integrity","Other"],"Impact":["Alter Execution Logic","Unexpected State"],"Note":"The main problem is that -- if a lock is overcome -- data could be altered in a bad state."}},"Potential_Mitigations":{"Mitigation":[{"Phase":"Architecture and Design","Description":"Use locking functionality. This is the recommended solution. Implement some form of locking mechanism around code which alters or reads persistent data in a multithreaded environment."},{"Phase":"Architecture and Design","Description":"Create resource-locking sanity checks. If no inherent locking mechanisms exist, use flags and signals to enforce your own blocking scheme when resources are being used by other threads of execution."}]},"Demonstrative_Examples":{"Demonstrative_Example":{"Intro_Text":"The following example demonstrates the weakness.","Example_Code":[{"Nature":"bad","Language":"C","xhtml:div":{"xhtml:br":{},"xhtml:div":{"style":"margin-left:10px;","xhtml:br":[{},{},{}]}}},{"Nature":"bad","Language":"Java","xhtml:div":{"$t":"public classRace {}","xhtml:div":{"style":"margin-left:10px;","$t":"","xhtml:div":{"$t":"static int foo = 0;public static void main() {}public static class Threader extends Thread {}","xhtml:br":[{},{}],"xhtml:div":[{"style":"margin-left:10px;","xhtml:div":{"xhtml:br":[{},{}]}},{"style":"margin-left:10px;","$t":"","xhtml:div":{"$t":"public void run() {}","xhtml:br":{},"xhtml:div":{"style":"margin-left:10px;","$t":"System.out.println(foo);"}}}]}}}}]}},"Affected_Resources":{"Affected_Resource":"System Process"},"Taxonomy_Mappings":{"Taxonomy_Mapping":[{"Taxonomy_Name":"CLASP","Entry_Name":"Race condition within a thread"},{"Taxonomy_Name":"CERT C Secure Coding","Entry_ID":"CON32-C","Entry_Name":"Prevent data races when accessing bit-fields from multiple threads","Mapping_Fit":"CWE More Abstract"},{"Taxonomy_Name":"CERT C Secure Coding","Entry_ID":"CON40-C","Entry_Name":"Do not refer to an atomic variable twice in an expression","Mapping_Fit":"CWE More Abstract"},{"Taxonomy_Name":"CERT C Secure Coding","Entry_ID":"CON43-C","Entry_Name":"Do not allow data races in multithreaded code","Mapping_Fit":"Exact"},{"Taxonomy_Name":"The CERT Oracle Secure Coding Standard for Java (2011)","Entry_ID":"VNA02-J","Entry_Name":"Ensure that compound operations on shared variables are atomic"},{"Taxonomy_Name":"The CERT Oracle Secure Coding Standard for Java (2011)","Entry_ID":"VNA03-J","Entry_Name":"Do not assume that a group of calls to independently atomic methods is atomic"},{"Taxonomy_Name":"Software Fault Patterns","Entry_ID":"SFP19","Entry_Name":"Missing Lock"}]},"Related_Attack_Patterns":{"Related_Attack_Pattern":[{"CAPEC_ID":"26"},{"CAPEC_ID":"29"}]},"References":{"Reference":[{"External_Reference_ID":"REF-18"},{"External_Reference_ID":"REF-44","Section":"\\"Sin 13: Race Conditions.\\" Page 205"},{"External_Reference_ID":"REF-62","Section":"Chapter 13, \\"Race Conditions\\", Page 759"}]},"Content_History":{"Submission":{"Submission_Name":"CLASP","Submission_Date":"2006-07-19"},"Modification":[{"Modification_Name":"Eric Dalci","Modification_Organization":"Cigital","Modification_Date":"2008-07-01","Modification_Comment":"updated Time_of_Introduction"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2008-09-08","Modification_Comment":"updated Applicable_Platforms, Common_Consequences, Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2008-11-24","Modification_Comment":"updated Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2010-09-27","Modification_Comment":"updated Potential_Mitigations, Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-06-01","Modification_Comment":"updated Common_Consequences, Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-06-27","Modification_Comment":"updated Common_Consequences"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-09-13","Modification_Comment":"updated Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2012-05-11","Modification_Comment":"updated References, Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2014-07-30","Modification_Comment":"updated Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2017-11-08","Modification_Comment":"updated Demonstrative_Examples, Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2019-01-03","Modification_Comment":"updated Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-02-24","Modification_Comment":"updated References, Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-08-20","Modification_Comment":"updated Relationships"}]}},{"ID":"374","Name":"Passing Mutable Objects to an Untrusted Method","Abstraction":"Base","Structure":"Simple","Status":"Draft","Description":"The program sends non-cloned mutable data as an argument to a method or function.","Extended_Description":"The function or method that has been called can alter or delete the mutable data. This could violate assumptions that the calling function has made about its state. In situations where unknown code is called with references to mutable data, this external code could make changes to the data sent. If this data was not previously cloned, the modified data might not be valid in the context of execution.","Related_Weaknesses":{"Related_Weakness":{"Nature":"ChildOf","CWE_ID":"668","View_ID":"1000","Ordinal":"Primary"}},"Applicable_Platforms":{"Language":[{"Name":"C","Prevalence":"Undetermined"},{"Name":"C++","Prevalence":"Undetermined"},{"Name":"Java","Prevalence":"Undetermined"},{"Name":"C#","Prevalence":"Undetermined"}]},"Modes_Of_Introduction":{"Introduction":{"Phase":"Implementation"}},"Likelihood_Of_Exploit":"Medium","Common_Consequences":{"Consequence":{"Scope":"Integrity","Impact":"Modify Memory","Note":"Potentially data could be tampered with by another function which should not have been tampered with."}},"Potential_Mitigations":{"Mitigation":[{"Phase":"Implementation","Description":"Pass in data which should not be altered as constant or immutable."},{"Phase":"Implementation","Description":"Clone all mutable data before passing it into an external function . This is the preferred mitigation. This way, regardless of what changes are made to the data, a valid copy is retained for use by the class."}]},"Demonstrative_Examples":{"Demonstrative_Example":[{"Intro_Text":"The following example demonstrates the weakness.","Example_Code":{"Nature":"bad","Language":"C","xhtml:div":{"$t":"private:\\n                     \\n                     public:","xhtml:div":[{"style":"margin-left:10px;","xhtml:br":[{},{},{}]},{"style":"margin-left:10px;","$t":"void doStuff() {}","xhtml:div":{"style":"margin-left:10px;","$t":"externalClass.doOtherStuff(foo, bar, baz)"}}],"xhtml:br":[{},{}]}},"Body_Text":"In this example, bar and baz will be passed by reference to doOtherStuff() which may change them."},{"Intro_Text":"In the following Java example, the BookStore class manages the sale of books in a bookstore, this class includes the member objects for the bookstore inventory and sales database manager classes. The BookStore class includes a method for updating the sales database and inventory when a book is sold. This method retrieves a Book object from the bookstore inventory object using the supplied ISBN number for the book class, then calls a method for the sales object to update the sales information and then calls a method for the inventory object to update inventory for the BookStore.","Example_Code":[{"Nature":"bad","Language":"Java","xhtml:div":{"xhtml:div":[{"style":"margin-left:10px;","xhtml:div":{"xhtml:br":[{},{},{},{},{},{},{}],"xhtml:i":["// constructor for BookStore","// other BookStore methods"],"xhtml:div":[{"style":"margin-left:10px;","xhtml:br":[{},{}]},{"style":"margin-left:10px;","xhtml:div":{"xhtml:br":[{},{},{},{},{},{}],"xhtml:i":["// Get book object from inventory using ISBN","// update sales information for book sold","// update inventory"]}}]}},{"style":"margin-left:10px;","xhtml:br":[{},{},{},{}],"xhtml:i":"// Book object constructors and get/set methods"}],"xhtml:br":{}}},{"Nature":"good","Language":"Java","xhtml:div":{"xhtml:br":[{},{}],"xhtml:div":{"style":"margin-left:10px;","xhtml:div":{"xhtml:br":[{},{},{},{},{},{},{},{}],"xhtml:i":["// Get book object from inventory using ISBN","// Create copy of book object to make sure contents are not changed","// update sales information for book sold","// update inventory"]}}}}],"Body_Text":["However, in this example the Book object that is retrieved and passed to the method of the sales object could have its contents modified by the method. This could cause unexpected results when the book object is sent to the method for the inventory object to update the inventory.","In the Java programming language arguments to methods are passed by value, however in the case of objects a reference to the object is passed by value to the method. When an object reference is passed as a method argument a copy of the object reference is made within the method and therefore both references point to the same object. This allows the contents of the object to be modified by the method that holds the copy of the object reference. [REF-374]","In this case the contents of the Book object could be modified by the method of the sales object prior to the call to update the inventory.","To prevent the contents of the Book object from being modified, a copy of the Book object should be made before the method call to the sales object. In the following example a copy of the Book object is made using the clone() method and the copy of the Book object is passed to the method of the sales object. This will prevent any changes being made to the original Book object."]}]},"Taxonomy_Mappings":{"Taxonomy_Mapping":[{"Taxonomy_Name":"CLASP","Entry_Name":"Passing mutable objects to an untrusted method"},{"Taxonomy_Name":"The CERT Oracle Secure Coding Standard for Java (2011)","Entry_ID":"OBJ04-J","Entry_Name":"Provide mutable classes with copy functionality to safely allow passing instances to untrusted code"},{"Taxonomy_Name":"Software Fault Patterns","Entry_ID":"SFP23","Entry_Name":"Exposed Data"}]},"References":{"Reference":[{"External_Reference_ID":"REF-18"},{"External_Reference_ID":"REF-374"},{"External_Reference_ID":"REF-375"}]},"Content_History":{"Submission":{"Submission_Name":"CLASP","Submission_Date":"2006-07-19"},"Modification":[{"Modification_Name":"Eric Dalci","Modification_Organization":"Cigital","Modification_Date":"2008-07-01","Modification_Comment":"updated Time_of_Introduction"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2008-09-08","Modification_Comment":"updated Applicable_Platforms, Common_Consequences, Relationships, Other_Notes, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2010-06-21","Modification_Comment":"updated Name, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2010-12-13","Modification_Comment":"updated Demonstrative_Examples"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-06-01","Modification_Comment":"updated Common_Consequences, Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2012-05-11","Modification_Comment":"updated Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2014-06-23","Modification_Comment":"updated Demonstrative_Examples, Description, Other_Notes, Potential_Mitigations, References"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2014-07-30","Modification_Comment":"updated Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2017-11-08","Modification_Comment":"updated Demonstrative_Examples"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2019-01-03","Modification_Comment":"updated Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-02-24","Modification_Comment":"updated References"}],"Previous_Entry_Name":{"Date":"2010-06-21","$t":"Mutable Objects Passed by Reference"}}},{"ID":"375","Name":"Returning a Mutable Object to an Untrusted Caller","Abstraction":"Base","Structure":"Simple","Status":"Draft","Description":"Sending non-cloned mutable data as a return value may result in that data being altered or deleted by the calling function.","Extended_Description":"In situations where functions return references to mutable data, it is possible that the external code which called the function may make changes to the data sent. If this data was not previously cloned, the class will then be using modified data which may violate assumptions about its internal state.","Related_Weaknesses":{"Related_Weakness":{"Nature":"ChildOf","CWE_ID":"668","View_ID":"1000","Ordinal":"Primary"}},"Applicable_Platforms":{"Language":[{"Name":"C","Prevalence":"Undetermined"},{"Name":"C++","Prevalence":"Undetermined"},{"Name":"Java","Prevalence":"Undetermined"},{"Name":"C#","Prevalence":"Undetermined"}]},"Modes_Of_Introduction":{"Introduction":{"Phase":"Implementation"}},"Likelihood_Of_Exploit":"Medium","Common_Consequences":{"Consequence":{"Scope":["Access Control","Integrity"],"Impact":"Modify Memory","Note":"Potentially data could be tampered with by another function which should not have been tampered with."}},"Potential_Mitigations":{"Mitigation":[{"Phase":"Implementation","Description":"Declare returned data which should not be altered as constant or immutable."},{"Phase":"Implementation","Description":"Clone all mutable data before returning references to it. This is the preferred mitigation. This way, regardless of what changes are made to the data, a valid copy is retained for use by the class."}]},"Demonstrative_Examples":{"Demonstrative_Example":{"Intro_Text":"This class has a private list of patients, but provides a way to see the list :","Example_Code":{"Nature":"bad","Language":"Java","xhtml:div":{"$t":"public class ClinicalTrial {}","xhtml:div":{"style":"margin-left:10px;","$t":"private PatientClass[] patientList = new PatientClass[50];public getPatients(...){}","xhtml:br":{},"xhtml:div":{"style":"margin-left:10px;","$t":"return patientList;"}}}},"Body_Text":"While this code only means to allow reading of the patient list, the getPatients() method returns a reference to the class\'s original patient list instead of a reference to a copy of the list. Any caller of this method can arbitrarily modify the contents of the patient list even though it is a private member of the class."}},"Taxonomy_Mappings":{"Taxonomy_Mapping":[{"Taxonomy_Name":"CLASP","Entry_Name":"Mutable object returned"},{"Taxonomy_Name":"The CERT Oracle Secure Coding Standard for Java (2011)","Entry_ID":"OBJ04-J","Entry_Name":"Provide mutable classes with copy functionality to safely allow passing instances to untrusted code"},{"Taxonomy_Name":"The CERT Oracle Secure Coding Standard for Java (2011)","Entry_ID":"OBJ05-J","Entry_Name":"Defensively copy private mutable class members before returning their references"},{"Taxonomy_Name":"SEI CERT Perl Coding Standard","Entry_ID":"EXP34-PL","Entry_Name":"Do not modify $_ in list or sorting functions","Mapping_Fit":"Imprecise"},{"Taxonomy_Name":"Software Fault Patterns","Entry_ID":"SFP23","Entry_Name":"Exposed Data"}]},"References":{"Reference":{"External_Reference_ID":"REF-18"}},"Content_History":{"Submission":{"Submission_Name":"CLASP","Submission_Date":"2006-07-19"},"Modification":[{"Modification_Name":"Eric Dalci","Modification_Organization":"Cigital","Modification_Date":"2008-07-01","Modification_Comment":"updated Time_of_Introduction"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2008-09-08","Modification_Comment":"updated Applicable_Platforms, Common_Consequences, Relationships, Other_Notes, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2010-09-27","Modification_Comment":"updated Name, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-06-01","Modification_Comment":"updated Common_Consequences, Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2012-05-11","Modification_Comment":"updated Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2012-10-30","Modification_Comment":"updated Demonstrative_Examples"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2014-06-23","Modification_Comment":"updated Description, Other_Notes, Potential_Mitigations"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2014-07-30","Modification_Comment":"updated Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2017-11-08","Modification_Comment":"updated Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2019-01-03","Modification_Comment":"updated Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-02-24","Modification_Comment":"updated References"}],"Previous_Entry_Name":{"Date":"2010-09-27","$t":"Passing Mutable Objects to an Untrusted Method"}}},{"ID":"401","Name":"Missing Release of Memory after Effective Lifetime","Abstraction":"Variant","Structure":"Simple","Status":"Draft","Description":"The software does not sufficiently track and release allocated memory after it has been used, which slowly consumes remaining memory.","Extended_Description":"This is often triggered by improper handling of malformed data or unexpectedly interrupted sessions.  In some languages, developers are responsible for tracking memory allocation and releasing the memory.  If there are no more pointers or references to the memory, then it can no longer be tracked and identified for release.","Related_Weaknesses":{"Related_Weakness":[{"Nature":"ChildOf","CWE_ID":"772","View_ID":"1000","Ordinal":"Primary"},{"Nature":"ChildOf","CWE_ID":"404","View_ID":"1003","Ordinal":"Primary"},{"Nature":"ChildOf","CWE_ID":"404","View_ID":"1305","Ordinal":"Primary"}]},"Weakness_Ordinalities":{"Weakness_Ordinality":{"Ordinality":"Resultant"}},"Applicable_Platforms":{"Language":[{"Name":"C","Prevalence":"Undetermined"},{"Name":"C++","Prevalence":"Undetermined"}]},"Alternate_Terms":{"Alternate_Term":{"Term":"Memory Leak"}},"Modes_Of_Introduction":{"Introduction":[{"Phase":"Architecture and Design"},{"Phase":"Implementation","Note":{"xhtml:p":"Memory leaks have two common and sometimes overlapping causes:","xhtml:div":{"style":"margin-left:10px;","xhtml:ul":{"xhtml:li":["Error conditions and other exceptional circumstances","Confusion over which part of the program is responsible for freeing the memory"]}}}}]},"Likelihood_Of_Exploit":"Medium","Common_Consequences":{"Consequence":[{"Scope":"Availability","Impact":["DoS: Crash, Exit, or Restart","DoS: Instability","DoS: Resource Consumption (CPU)","DoS: Resource Consumption (Memory)"],"Note":"Most memory leaks result in general software reliability problems, but if an attacker can intentionally trigger a memory leak, the attacker might be able to launch a denial of service attack (by crashing or hanging the program) or take advantage of other unexpected program behavior resulting from a low memory condition."},{"Scope":"Other","Impact":"Reduce Performance"}]},"Potential_Mitigations":{"Mitigation":[{"Mitigation_ID":"MIT-41","Phase":"Implementation","Strategy":"Libraries or Frameworks","Description":{"xhtml:p":["Choose a language or tool that provides automatic memory management, or makes manual memory management less error-prone.","For example, glibc in Linux provides protection against free of invalid pointers.","When using Xcode to target OS X or iOS, enable automatic reference counting (ARC) [REF-391].","To help correctly and consistently manage memory when programming in C++, consider using a smart pointer class such as std::auto_ptr (defined by ISO/IEC ISO/IEC 14882:2003), std::shared_ptr and std::unique_ptr (specified by an upcoming revision of the C++ standard, informally referred to as C++ 1x), or equivalent solutions such as Boost."]}},{"Phase":"Architecture and Design","Description":"Use an abstraction library to abstract away risky APIs. Not a complete solution."},{"Phase":["Architecture and Design","Build and Compilation"],"Description":"The Boehm-Demers-Weiser Garbage Collector or valgrind can be used to detect leaks in code.","Effectiveness_Notes":"This is not a complete solution as it is not 100% effective."}]},"Demonstrative_Examples":{"Demonstrative_Example":{"Intro_Text":"The following C function leaks a block of allocated memory if the call to read() does not return the expected number of bytes:","Example_Code":{"Nature":"bad","Language":"C","xhtml:div":{"xhtml:div":{"style":"margin-left:10px;","xhtml:div":{"xhtml:br":[{},{},{}],"xhtml:div":[{"style":"margin-left:10px;","$t":"return NULL;"},{"style":"margin-left:10px;","xhtml:div":{"xhtml:br":{}}}]}}}}}},"Observed_Examples":{"Observed_Example":[{"Reference":"CVE-2005-3119","Description":"Memory leak because function does not free() an element of a data structure.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2005-3119"},{"Reference":"CVE-2004-0427","Description":"Memory leak when counter variable is not decremented.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2004-0427"},{"Reference":"CVE-2002-0574","Description":"chain: reference count is not decremented, leading to memory leak in OS by sending ICMP packets.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2002-0574"},{"Reference":"CVE-2005-3181","Description":"Kernel uses wrong function to release a data structure, preventing data from being properly tracked by other code.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2005-3181"},{"Reference":"CVE-2004-0222","Description":"Memory leak via unknown manipulations as part of protocol test suite.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2004-0222"},{"Reference":"CVE-2001-0136","Description":"Memory leak via a series of the same command.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2001-0136"}]},"Functional_Areas":{"Functional_Area":"Memory Management"},"Affected_Resources":{"Affected_Resource":"Memory"},"Taxonomy_Mappings":{"Taxonomy_Mapping":[{"Taxonomy_Name":"PLOVER","Entry_Name":"Memory leak"},{"Taxonomy_Name":"7 Pernicious Kingdoms","Entry_Name":"Memory Leak"},{"Taxonomy_Name":"CLASP","Entry_Name":"Failure to deallocate data"},{"Taxonomy_Name":"OWASP Top Ten 2004","Entry_ID":"A9","Entry_Name":"Denial of Service","Mapping_Fit":"CWE More Specific"},{"Taxonomy_Name":"CERT C Secure Coding","Entry_ID":"MEM31-C","Entry_Name":"Free dynamically allocated memory when no longer needed","Mapping_Fit":"Exact"},{"Taxonomy_Name":"The CERT Oracle Secure Coding Standard for Java (2011)","Entry_ID":"MSC04-J","Entry_Name":"Do not leak memory"},{"Taxonomy_Name":"Software Fault Patterns","Entry_ID":"SFP38","Entry_Name":"Failure to Release Memory"},{"Taxonomy_Name":"OMG ASCPEM","Entry_ID":"ASCPEM-PRF-14"}]},"References":{"Reference":[{"External_Reference_ID":"REF-18"},{"External_Reference_ID":"REF-390"},{"External_Reference_ID":"REF-391"},{"External_Reference_ID":"REF-959","Section":"ASCPEM-PRF-14"}]},"Notes":{"Note":[{"Type":"Relationship","$t":"This is often a resultant weakness due to improper handling of malformed data or early termination of sessions."},{"Type":"Terminology","$t":"\\"memory leak\\" has sometimes been used to describe other kinds of issues, e.g. for information leaks in which the contents of memory are inadvertently leaked (CVE-2003-0400 is one such example of this terminology conflict)."}]},"Content_History":{"Submission":{"Submission_Name":"PLOVER","Submission_Date":"2006-07-19"},"Modification":[{"Modification_Name":"Eric Dalci","Modification_Organization":"Cigital","Modification_Date":"2008-07-01","Modification_Comment":"updated Time_of_Introduction"},{"Modification_Organization":"KDM Analytics","Modification_Date":"2008-08-01","Modification_Comment":"added/updated white box definitions"},{"Modification_Organization":"Veracode","Modification_Date":"2008-08-15","Modification_Comment":"Suggested OWASP Top Ten 2004 mapping"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2008-09-08","Modification_Comment":"updated Applicable_Platforms, Common_Consequences, Relationships, Other_Notes, References, Relationship_Notes, Taxonomy_Mappings, Terminology_Notes"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2008-10-14","Modification_Comment":"updated Description"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2009-03-10","Modification_Comment":"updated Other_Notes"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2009-05-27","Modification_Comment":"updated Name"},{"Modification_Name":"KDM Analytics","Modification_Date":"2009-07-17","Modification_Comment":"Improved the White_Box_Definition"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2009-07-27","Modification_Comment":"updated White_Box_Definitions"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2009-10-29","Modification_Comment":"updated Modes_of_Introduction, Other_Notes"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2010-02-16","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2010-06-21","Modification_Comment":"updated Other_Notes, Potential_Mitigations"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2010-12-13","Modification_Comment":"updated Demonstrative_Examples, Name"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-03-29","Modification_Comment":"updated Alternate_Terms"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-06-01","Modification_Comment":"updated Common_Consequences, Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2012-05-11","Modification_Comment":"updated Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2012-10-30","Modification_Comment":"updated Potential_Mitigations"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2013-02-21","Modification_Comment":"updated Observed_Examples"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2014-02-18","Modification_Comment":"updated Potential_Mitigations, References"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2014-07-30","Modification_Comment":"updated Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2017-11-08","Modification_Comment":"updated References, Relationships, Taxonomy_Mappings, White_Box_Definitions"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2019-01-03","Modification_Comment":"updated Common_Consequences, Demonstrative_Examples, Name, References, Relationships, Taxonomy_Mappings, Type, Weakness_Ordinalities"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2019-06-20","Modification_Comment":"updated Description, Name"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-02-24","Modification_Comment":"updated References, Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-08-20","Modification_Comment":"updated Relationships"}],"Previous_Entry_Name":[{"Date":"2008-04-11","$t":"Memory Leak"},{"Date":"2009-05-27","$t":"Failure to Release Memory Before Removing Last Reference (aka \'Memory Leak\')"},{"Date":"2010-12-13","$t":"Failure to Release Memory Before Removing Last Reference (\'Memory Leak\')"},{"Date":"2019-01-03","$t":"Improper Release of Memory Before Removing Last Reference (\'Memory Leak\')"},{"Date":"2019-06-20","$t":"Improper Release of Memory Before Removing Last Reference"}]}},{"ID":"415","Name":"Double Free","Abstraction":"Variant","Structure":"Simple","Status":"Draft","Description":"The product calls free() twice on the same memory address, potentially leading to modification of unexpected memory locations.","Extended_Description":"When a program calls free() twice with the same argument, the program\'s memory management data structures become corrupted. This corruption can cause the program to crash or, in some circumstances, cause two later calls to malloc() to return the same pointer. If malloc() returns the same value twice and the program later gives the attacker control over the data that is written into this doubly-allocated memory, the program becomes vulnerable to a buffer overflow attack.","Related_Weaknesses":{"Related_Weakness":[{"Nature":"ChildOf","CWE_ID":"825","View_ID":"1000","Ordinal":"Primary"},{"Nature":"ChildOf","CWE_ID":"672","View_ID":"1003","Ordinal":"Primary"},{"Nature":"ChildOf","CWE_ID":"672","View_ID":"1305","Ordinal":"Primary"},{"Nature":"ChildOf","CWE_ID":"666","View_ID":"1000"},{"Nature":"ChildOf","CWE_ID":"675","View_ID":"1000"},{"Nature":"PeerOf","CWE_ID":"416","View_ID":"1000"},{"Nature":"PeerOf","CWE_ID":"123","View_ID":"1000"}]},"Applicable_Platforms":{"Language":[{"Name":"C","Prevalence":"Undetermined"},{"Name":"C++","Prevalence":"Undetermined"}]},"Alternate_Terms":{"Alternate_Term":{"Term":"Double-free"}},"Modes_Of_Introduction":{"Introduction":[{"Phase":"Architecture and Design"},{"Phase":"Implementation"}]},"Likelihood_Of_Exploit":"High","Common_Consequences":{"Consequence":{"Scope":["Integrity","Confidentiality","Availability"],"Impact":["Modify Memory","Execute Unauthorized Code or Commands"],"Note":"Doubly freeing memory may result in a write-what-where condition, allowing an attacker to execute arbitrary code."}},"Potential_Mitigations":{"Mitigation":[{"Phase":"Architecture and Design","Description":"Choose a language that provides automatic memory management."},{"Phase":"Implementation","Description":"Ensure that each allocation is freed only once. After freeing a chunk, set the pointer to NULL to ensure the pointer cannot be freed again. In complicated error conditions, be sure that clean-up routines respect the state of allocation properly. If the language is object oriented, ensure that object destructors delete each chunk of memory only once."},{"Phase":"Implementation","Description":"Use a static analysis tool to find double free instances."}]},"Demonstrative_Examples":{"Demonstrative_Example":[{"Intro_Text":"The following code shows a simple example of a double free vulnerability.","Example_Code":{"Nature":"bad","Language":"C","xhtml:div":{"xhtml:br":[{},{},{},{}],"xhtml:div":{"style":"margin-left:10px;","$t":"free(ptr);"}}},"Body_Text":["Double free vulnerabilities have two common (and sometimes overlapping) causes:",{"xhtml:ul":{"xhtml:li":[{"xhtml:div":"Error conditions and other exceptional circumstances"},{"xhtml:div":"Confusion over which part of the program is responsible for freeing the memory"}]}},"Although some double free vulnerabilities are not much more complicated than the previous example, most are spread out across hundreds of lines of code or even different files. Programmers seem particularly susceptible to freeing global variables more than once."]},{"Intro_Text":"While contrived, this code should be exploitable on Linux distributions which do not ship with heap-chunk check summing turned on.","Example_Code":{"Nature":"bad","Language":"C","xhtml:div":{"xhtml:br":[{},{},{},{},{}],"xhtml:div":{"style":"margin-left:10px;","xhtml:br":[{},{},{},{},{},{},{},{},{},{}]}}}}]},"Observed_Examples":{"Observed_Example":[{"Reference":"CVE-2006-5051","Description":"Chain: Signal handler contains too much functionality (CWE-828), introducing a race condition that leads to a double free (CWE-415).","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2006-5051"},{"Reference":"CVE-2004-0642","Description":"Double free resultant from certain error conditions.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2004-0642"},{"Reference":"CVE-2004-0772","Description":"Double free resultant from certain error conditions.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2004-0772"},{"Reference":"CVE-2005-1689","Description":"Double free resultant from certain error conditions.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2005-1689"},{"Reference":"CVE-2003-0545","Description":"Double free from invalid ASN.1 encoding.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2003-0545"},{"Reference":"CVE-2003-1048","Description":"Double free from malformed GIF.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2003-1048"},{"Reference":"CVE-2005-0891","Description":"Double free from malformed GIF.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2005-0891"},{"Reference":"CVE-2002-0059","Description":"Double free from malformed compressed data.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2002-0059"}]},"Affected_Resources":{"Affected_Resource":"Memory"},"Taxonomy_Mappings":{"Taxonomy_Mapping":[{"Taxonomy_Name":"PLOVER","Entry_Name":"DFREE - Double-Free Vulnerability"},{"Taxonomy_Name":"7 Pernicious Kingdoms","Entry_Name":"Double Free"},{"Taxonomy_Name":"CLASP","Entry_Name":"Doubly freeing memory"},{"Taxonomy_Name":"CERT C Secure Coding","Entry_ID":"MEM00-C","Entry_Name":"Allocate and free memory in the same module, at the same level of abstraction"},{"Taxonomy_Name":"CERT C Secure Coding","Entry_ID":"MEM01-C","Entry_Name":"Store a new value in pointers immediately after free()"},{"Taxonomy_Name":"CERT C Secure Coding","Entry_ID":"MEM30-C","Entry_Name":"Do not access freed memory","Mapping_Fit":"CWE More Specific"},{"Taxonomy_Name":"CERT C Secure Coding","Entry_ID":"MEM31-C","Entry_Name":"Free dynamically allocated memory exactly once"},{"Taxonomy_Name":"Software Fault Patterns","Entry_ID":"SFP12","Entry_Name":"Faulty Memory Release"}]},"References":{"Reference":[{"External_Reference_ID":"REF-44","Section":"\\"Sin 8: C++ Catastrophes.\\" Page 143"},{"External_Reference_ID":"REF-62","Section":"Chapter 7, \\"Double Frees\\", Page 379"},{"External_Reference_ID":"REF-18"}]},"Notes":{"Note":[{"Type":"Relationship","$t":"This is usually resultant from another weakness, such as an unhandled error or race condition between threads. It could also be primary to weaknesses such as buffer overflows."},{"Type":"Maintenance","$t":"It could be argued that Double Free would be most appropriately located as a child of \\"Use after Free\\", but \\"Use\\" and \\"Release\\" are considered to be distinct operations within vulnerability theory, therefore this is more accurately \\"Release of a Resource after Expiration or Release\\", which doesn\'t exist yet."}]},"Content_History":{"Submission":{"Submission_Name":"PLOVER","Submission_Date":"2006-07-19"},"Modification":[{"Modification_Name":"Eric Dalci","Modification_Organization":"Cigital","Modification_Date":"2008-07-01","Modification_Comment":"updated Potential_Mitigations, Time_of_Introduction"},{"Modification_Organization":"KDM Analytics","Modification_Date":"2008-08-01","Modification_Comment":"added/updated white box definitions"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2008-09-08","Modification_Comment":"updated Applicable_Platforms, Common_Consequences, Description, Maintenance_Notes, Relationships, Other_Notes, Relationship_Notes, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2008-11-24","Modification_Comment":"updated Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2009-05-27","Modification_Comment":"updated Demonstrative_Examples"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2009-10-29","Modification_Comment":"updated Other_Notes"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2010-09-27","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2010-12-13","Modification_Comment":"updated Observed_Examples, Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-06-01","Modification_Comment":"updated Common_Consequences"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-09-13","Modification_Comment":"updated Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2012-05-11","Modification_Comment":"updated References, Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2014-07-30","Modification_Comment":"updated Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2015-12-07","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2017-11-08","Modification_Comment":"updated Likelihood_of_Exploit, Relationships, Taxonomy_Mappings, White_Box_Definitions"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2019-01-03","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2019-06-20","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-02-24","Modification_Comment":"updated References, Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-06-25","Modification_Comment":"updated Common_Consequences"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-08-20","Modification_Comment":"updated Relationships"}]}},{"ID":"416","Name":"Use After Free","Abstraction":"Variant","Structure":"Simple","Status":"Stable","Description":"Referencing memory after it has been freed can cause a program to crash, use unexpected values, or execute code.","Extended_Description":{"xhtml:p":["The use of previously-freed memory can have any number of adverse consequences, ranging from the corruption of valid data to the execution of arbitrary code, depending on the instantiation and timing of the flaw. The simplest way data corruption may occur involves the system\'s reuse of the freed memory. Use-after-free errors have two common and sometimes overlapping causes:","In this scenario, the memory in question is allocated to another pointer validly at some point after it has been freed. The original pointer to the freed memory is used again and points to somewhere within the new allocation. As the data is changed, it corrupts the validly used memory; this induces undefined behavior in the process.","If the newly allocated data chances to hold a class, in C++ for example, various function pointers may be scattered within the heap data. If one of these function pointers is overwritten with an address to valid shellcode, execution of arbitrary code can be achieved."],"xhtml:div":{"style":"margin-left:10px;","xhtml:ul":{"xhtml:li":["Error conditions and other exceptional circumstances.","Confusion over which part of the program is responsible for freeing the memory."]}}},"Related_Weaknesses":{"Related_Weakness":[{"Nature":"ChildOf","CWE_ID":"825","View_ID":"1000","Ordinal":"Primary"},{"Nature":"ChildOf","CWE_ID":"672","View_ID":"1003","Ordinal":"Primary"},{"Nature":"ChildOf","CWE_ID":"672","View_ID":"1305","Ordinal":"Primary"},{"Nature":"CanPrecede","CWE_ID":"120","View_ID":"1000"},{"Nature":"CanPrecede","CWE_ID":"123","View_ID":"1000"}]},"Applicable_Platforms":{"Language":[{"Name":"C","Prevalence":"Undetermined"},{"Name":"C++","Prevalence":"Undetermined"}]},"Alternate_Terms":{"Alternate_Term":[{"Term":"Dangling pointer"},{"Term":"Use-After-Free"}]},"Modes_Of_Introduction":{"Introduction":[{"Phase":"Architecture and Design"},{"Phase":"Implementation"}]},"Likelihood_Of_Exploit":"High","Common_Consequences":{"Consequence":[{"Scope":"Integrity","Impact":"Modify Memory","Note":"The use of previously freed memory may corrupt valid data, if the memory area in question has been allocated and used properly elsewhere."},{"Scope":"Availability","Impact":"DoS: Crash, Exit, or Restart","Note":"If chunk consolidation occurs after the use of previously freed data, the process may crash when invalid data is used as chunk information."},{"Scope":["Integrity","Confidentiality","Availability"],"Impact":"Execute Unauthorized Code or Commands","Note":"If malicious data is entered before chunk consolidation can take place, it may be possible to take advantage of a write-what-where primitive to execute arbitrary code."}]},"Potential_Mitigations":{"Mitigation":[{"Phase":"Architecture and Design","Description":"Choose a language that provides automatic memory management."},{"Phase":"Implementation","Description":"When freeing pointers, be sure to set them to NULL once they are freed. However, the utilization of multiple or complex data structures may lower the usefulness of this strategy."}]},"Demonstrative_Examples":{"Demonstrative_Example":[{"Intro_Text":"The following example demonstrates the weakness.","Example_Code":{"Nature":"bad","Language":"C","xhtml:div":{"xhtml:br":[{},{},{},{}],"xhtml:div":{"style":"margin-left:10px;","xhtml:br":[{},{},{},{},{},{},{},{},{},{},{},{}]}}}},{"Intro_Text":"The following code illustrates a use after free error:","Example_Code":{"Nature":"bad","Language":"C","xhtml:div":{"$t":"char* ptr = (char*)malloc (SIZE);if (err) {}...if (abrt) {}","xhtml:br":[{},{},{}],"xhtml:div":[{"style":"margin-left:10px;","xhtml:br":{}},{"style":"margin-left:10px;","$t":"logError(\\"operation aborted before commit\\", ptr);"}]}},"Body_Text":"When an error occurs, the pointer is immediately freed. However, this pointer is later incorrectly used in the logError function."}]},"Observed_Examples":{"Observed_Example":[{"Reference":"CVE-2010-4168","Description":"Use-after-free triggered by closing a connection while data is still being transmitted.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2010-4168"},{"Reference":"CVE-2010-2941","Description":"Improper allocation for invalid data leads to use-after-free.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2010-2941"},{"Reference":"CVE-2010-2547","Description":"certificate with a large number of Subject Alternate Names not properly handled in realloc, leading to use-after-free","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2010-2547"},{"Reference":"CVE-2010-1772","Description":"Timers are not disabled when a related object is deleted","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2010-1772"},{"Reference":"CVE-2010-1437","Description":"Access to a \\"dead\\" object that is being cleaned up","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2010-1437"},{"Reference":"CVE-2010-1208","Description":"object is deleted even with a non-zero reference count, and later accessed","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2010-1208"},{"Reference":"CVE-2010-0629","Description":"use-after-free involving request containing an invalid version number","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2010-0629"},{"Reference":"CVE-2010-0378","Description":"unload of an object that is currently being accessed by other functionality","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2010-0378"},{"Reference":"CVE-2010-0302","Description":"incorrectly tracking a reference count leads to use-after-free","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2010-0302"},{"Reference":"CVE-2010-0249","Description":"use-after-free related to use of uninitialized memory","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2010-0249"},{"Reference":"CVE-2010-0050","Description":"HTML document with incorrectly-nested tags","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2010-0050"},{"Reference":"CVE-2009-3658","Description":"Use after free in ActiveX object by providing a malformed argument to a method","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2009-3658"},{"Reference":"CVE-2009-3616","Description":"use-after-free by disconnecting during data transfer, or a message containing incorrect data types","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2009-3616"},{"Reference":"CVE-2009-3553","Description":"disconnect during a large data transfer causes incorrect reference count, leading to use-after-free","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2009-3553"},{"Reference":"CVE-2009-2416","Description":"use-after-free found by fuzzing","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2009-2416"},{"Reference":"CVE-2009-1837","Description":"Chain: race condition (CWE-362) from improper handling of a page transition in web client while an applet is loading (CWE-368) leads to use after free (CWE-416)","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2009-1837"},{"Reference":"CVE-2009-0749","Description":"realloc generates new buffer and pointer, but previous pointer is still retained, leading to use after free","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2009-0749"},{"Reference":"CVE-2010-3328","Description":"Use-after-free in web browser, probably resultant from not initializing memory.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2010-3328"},{"Reference":"CVE-2008-5038","Description":"use-after-free when one thread accessed memory that was freed by another thread","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2008-5038"},{"Reference":"CVE-2008-0077","Description":"assignment of malformed values to certain properties triggers use after free","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2008-0077"},{"Reference":"CVE-2006-4434","Description":"mail server does not properly handle a long header.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2006-4434"},{"Reference":"CVE-2010-2753","Description":"chain: integer overflow leads to use-after-free","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2010-2753"},{"Reference":"CVE-2006-4997","Description":"freed pointer dereference","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2006-4997"}]},"Affected_Resources":{"Affected_Resource":"Memory"},"Taxonomy_Mappings":{"Taxonomy_Mapping":[{"Taxonomy_Name":"7 Pernicious Kingdoms","Entry_Name":"Use After Free"},{"Taxonomy_Name":"CLASP","Entry_Name":"Using freed memory"},{"Taxonomy_Name":"CERT C Secure Coding","Entry_ID":"MEM00-C","Entry_Name":"Allocate and free memory in the same module, at the same level of abstraction"},{"Taxonomy_Name":"CERT C Secure Coding","Entry_ID":"MEM01-C","Entry_Name":"Store a new value in pointers immediately after free()"},{"Taxonomy_Name":"CERT C Secure Coding","Entry_ID":"MEM30-C","Entry_Name":"Do not access freed memory","Mapping_Fit":"Exact"},{"Taxonomy_Name":"Software Fault Patterns","Entry_ID":"SFP7","Entry_Name":"Faulty Pointer Use"}]},"References":{"Reference":[{"External_Reference_ID":"REF-6"},{"External_Reference_ID":"REF-18"},{"External_Reference_ID":"REF-44","Section":"\\"Sin 8: C++ Catastrophes.\\" Page 143"}]},"Content_History":{"Submission":{"Submission_Name":"7 Pernicious Kingdoms","Submission_Date":"2006-07-19"},"Modification":[{"Modification_Name":"Eric Dalci","Modification_Organization":"Cigital","Modification_Date":"2008-07-01","Modification_Comment":"updated Potential_Mitigations, Time_of_Introduction"},{"Modification_Organization":"KDM Analytics","Modification_Date":"2008-08-01","Modification_Comment":"added/updated white box definitions"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2008-09-08","Modification_Comment":"updated Applicable_Platforms, Common_Consequences, Relationships, Observed_Example, Other_Notes, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2008-11-24","Modification_Comment":"updated Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2009-03-10","Modification_Comment":"updated Demonstrative_Examples"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2009-05-27","Modification_Comment":"updated Demonstrative_Examples"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2009-10-29","Modification_Comment":"updated Common_Consequences"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2010-02-16","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2010-06-21","Modification_Comment":"updated Potential_Mitigations"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2010-09-27","Modification_Comment":"updated Observed_Examples, Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2010-12-13","Modification_Comment":"updated Alternate_Terms, Common_Consequences, Description, Observed_Examples, Other_Notes, Potential_Mitigations, Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-03-29","Modification_Comment":"updated Description"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-06-01","Modification_Comment":"updated Common_Consequences"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-06-27","Modification_Comment":"updated Demonstrative_Examples"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-09-13","Modification_Comment":"updated Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2012-05-11","Modification_Comment":"updated References, Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2014-07-30","Modification_Comment":"updated Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2015-12-07","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2017-11-08","Modification_Comment":"updated Demonstrative_Examples, Relationships, Taxonomy_Mappings, White_Box_Definitions"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2019-01-03","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2019-06-20","Modification_Comment":"updated Relationships, Type"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2019-09-19","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-02-24","Modification_Comment":"updated References, Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-06-25","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-08-20","Modification_Comment":"updated Relationships"}]}},{"ID":"457","Name":"Use of Uninitialized Variable","Abstraction":"Variant","Structure":"Simple","Status":"Draft","Description":"The code uses a variable that has not been initialized, leading to unpredictable or unintended results.","Extended_Description":"In some languages such as C and C++, stack variables are not initialized by default. They generally contain junk data with the contents of stack memory before the function was invoked. An attacker can sometimes control or read these contents. In other languages or conditions, a variable that is not explicitly initialized can be given a default value that has security implications, depending on the logic of the program. The presence of an uninitialized variable can sometimes indicate a typographic error in the code.","Related_Weaknesses":{"Related_Weakness":[{"Nature":"ChildOf","CWE_ID":"908","View_ID":"1000","Ordinal":"Primary"},{"Nature":"ChildOf","CWE_ID":"665","View_ID":"1305","Ordinal":"Primary"}]},"Applicable_Platforms":{"Language":[{"Name":"C","Prevalence":"Sometimes"},{"Name":"C++","Prevalence":"Sometimes"},{"Name":"Perl","Prevalence":"Often"},{"Name":"PHP","Prevalence":"Often"},{"Class":"Language-Independent","Prevalence":"Undetermined"}]},"Modes_Of_Introduction":{"Introduction":{"Phase":"Implementation","Note":"In C, using an uninitialized char * in some string libraries will return incorrect results, as the libraries expect the null terminator to always be at the end of a string, even if the string is empty."}},"Likelihood_Of_Exploit":"High","Common_Consequences":{"Consequence":[{"Scope":["Availability","Integrity","Other"],"Impact":"Other","Note":"Initial variables usually contain junk, which can not be trusted for consistency. This can lead to denial of service conditions, or modify control flow in unexpected ways. In some cases, an attacker can \\"pre-initialize\\" the variable using previous actions, which might enable code execution. This can cause a race condition if a lock variable check passes when it should not."},{"Scope":["Authorization","Other"],"Impact":"Other","Note":"Strings that are not initialized are especially dangerous, since many functions expect a null at the end -- and only at the end -- of a string."}]},"Potential_Mitigations":{"Mitigation":[{"Phase":"Implementation","Strategy":"Attack Surface Reduction","Description":"Assign all variables to an initial value."},{"Phase":"Build and Compilation","Strategy":"Compilation or Build Hardening","Description":"Most compilers will complain about the use of uninitialized variables if warnings are turned on."},{"Phase":["Implementation","Operation"],"Description":"When using a language that does not require explicit declaration of variables, run or compile the software in a mode that reports undeclared or unknown variables. This may indicate the presence of a typographic error in the variable\'s name."},{"Phase":"Requirements","Description":"The choice could be made to use a language that is not susceptible to these issues."},{"Phase":"Architecture and Design","Description":"Mitigating technologies such as safe string libraries and container abstractions could be introduced."}]},"Demonstrative_Examples":{"Demonstrative_Example":[{"Intro_Text":"This code prints a greeting using information stored in a POST request:","Example_Code":{"Nature":"bad","Language":"PHP","xhtml:div":{"xhtml:div":{"style":"margin-left:10px;","$t":"$nameArray = $_POST[\'names\'];"},"xhtml:br":{}}},"Body_Text":"This code checks if the POST array \'names\' is set before assigning it to the $nameArray variable. However, if the array is not in the POST request, $nameArray will remain uninitialized. This will cause an error when the array is accessed to print the greeting message, which could lead to further exploit."},{"Intro_Text":"The following switch statement is intended to set the values of the variables aN and bN before they are used:","Example_Code":{"Nature":"bad","Language":"C","xhtml:div":{"xhtml:br":[{},{}],"xhtml:div":{"style":"margin-left:10px;","xhtml:div":{"xhtml:div":[{"style":"margin-left:10px;","xhtml:br":[{},{}]},{"style":"margin-left:10px;","xhtml:br":[{},{}]},{"style":"margin-left:10px;","xhtml:br":[{},{}]},{"style":"margin-left:10px;","xhtml:br":[{},{}]}],"xhtml:br":[{},{},{}]}}}},"Body_Text":"In the default case of the switch statement, the programmer has accidentally set the value of aN twice. As a result, bN will have an undefined value. Most uninitialized variable issues result in general software reliability problems, but if attackers can intentionally trigger the use of an uninitialized variable, they might be able to launch a denial of service attack by crashing the program. Under the right circumstances, an attacker may be able to control the value of an uninitialized variable by affecting the values on the stack prior to the invocation of the function."}]},"Observed_Examples":{"Observed_Example":[{"Reference":"CVE-2008-0081","Description":"Uninitialized variable leads to code execution in popular desktop application.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2008-0081"},{"Reference":"CVE-2007-4682","Description":"Crafted input triggers dereference of an uninitialized object pointer.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2007-4682"},{"Reference":"CVE-2007-3468","Description":"Crafted audio file triggers crash when an uninitialized variable is used.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2007-3468"},{"Reference":"CVE-2007-2728","Description":"Uninitialized random seed variable used.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2007-2728"}]},"Taxonomy_Mappings":{"Taxonomy_Mapping":[{"Taxonomy_Name":"CLASP","Entry_Name":"Uninitialized variable"},{"Taxonomy_Name":"7 Pernicious Kingdoms","Entry_Name":"Uninitialized Variable"},{"Taxonomy_Name":"Software Fault Patterns","Entry_ID":"SFP1","Entry_Name":"Glitch in computation"},{"Taxonomy_Name":"SEI CERT Perl Coding Standard","Entry_ID":"DCL33-PL","Entry_Name":"Declare identifiers before using them","Mapping_Fit":"Imprecise"}]},"References":{"Reference":[{"External_Reference_ID":"REF-18"},{"External_Reference_ID":"REF-436"},{"External_Reference_ID":"REF-437"},{"External_Reference_ID":"REF-44","Section":"\\"Sin 8: C++ Catastrophes.\\" Page 143"},{"External_Reference_ID":"REF-62","Section":"Chapter 7, \\"Variable Initialization\\", Page 312"}]},"Content_History":{"Submission":{"Submission_Name":"CLASP","Submission_Date":"2006-07-19"},"Modification":[{"Modification_Name":"Eric Dalci","Modification_Organization":"Cigital","Modification_Date":"2008-07-01","Modification_Comment":"updated Time_of_Introduction"},{"Modification_Organization":"KDM Analytics","Modification_Date":"2008-08-01","Modification_Comment":"added/updated white box definitions"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2008-09-08","Modification_Comment":"updated Applicable_Platforms, Common_Consequences, Description, Relationships, Observed_Example, Other_Notes, References, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2009-01-12","Modification_Comment":"updated Common_Consequences, Demonstrative_Examples, Potential_Mitigations"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2009-03-10","Modification_Comment":"updated Demonstrative_Examples"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2009-05-27","Modification_Comment":"updated Demonstrative_Examples"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-06-01","Modification_Comment":"updated Common_Consequences"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2012-05-11","Modification_Comment":"updated References, Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2012-10-30","Modification_Comment":"updated Demonstrative_Examples"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2013-02-21","Modification_Comment":"updated Applicable_Platforms, Description, Other_Notes, Potential_Mitigations, Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2014-06-23","Modification_Comment":"updated Modes_of_Introduction, Other_Notes"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2014-07-30","Modification_Comment":"updated Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2017-11-08","Modification_Comment":"updated References, Relationships, Taxonomy_Mappings, White_Box_Definitions"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2019-01-03","Modification_Comment":"updated Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2019-06-20","Modification_Comment":"updated Relationships, Type"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-02-24","Modification_Comment":"updated References, Relationships, Type"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-08-20","Modification_Comment":"updated Relationships"}],"Previous_Entry_Name":{"Date":"2008-04-11","$t":"Uninitialized Variable"}}},{"ID":"460","Name":"Improper Cleanup on Thrown Exception","Abstraction":"Base","Structure":"Simple","Status":"Draft","Description":"The product does not clean up its state or incorrectly cleans up its state when an exception is thrown, leading to unexpected state or control flow.","Extended_Description":"Often, when functions or loops become complicated, some level of resource cleanup is needed throughout execution. Exceptions can disturb the flow of the code and prevent the necessary cleanup from happening.","Related_Weaknesses":{"Related_Weakness":[{"Nature":"ChildOf","CWE_ID":"459","View_ID":"1000","Ordinal":"Primary"},{"Nature":"ChildOf","CWE_ID":"755","View_ID":"1000"}]},"Applicable_Platforms":{"Language":[{"Name":"C","Prevalence":"Undetermined"},{"Name":"C++","Prevalence":"Undetermined"},{"Name":"Java","Prevalence":"Undetermined"},{"Name":"C#","Prevalence":"Undetermined"}]},"Modes_Of_Introduction":{"Introduction":{"Phase":"Implementation","Note":"REALIZATION: This weakness is caused during implementation of an architectural security tactic."}},"Likelihood_Of_Exploit":"Medium","Common_Consequences":{"Consequence":{"Scope":"Other","Impact":"Varies by Context","Note":"The code could be left in a bad state."}},"Potential_Mitigations":{"Mitigation":{"Phase":"Implementation","Description":"If one breaks from a loop or function by throwing an exception, make sure that cleanup happens or that you should exit the program. Use throwing exceptions sparsely."}},"Demonstrative_Examples":{"Demonstrative_Example":{"Intro_Text":"The following example demonstrates the weakness.","Example_Code":{"Nature":"bad","Language":"Java","xhtml:div":{"xhtml:div":{"style":"margin-left:10px;","xhtml:div":{"xhtml:div":[{"style":"margin-left:10px;","xhtml:div":{"xhtml:br":[{},{}]}},{"style":"margin-left:10px;","xhtml:div":{"xhtml:br":[{},{},{},{},{}],"xhtml:div":[{"style":"margin-left:10px;","xhtml:div":{"xhtml:br":[{},{},{}],"xhtml:i":"//check some condition","xhtml:div":{"style":"margin-left:10px;","xhtml:div":{"xhtml:br":[{},{}]}}}},{"style":"margin-left:10px;","xhtml:div":{"xhtml:br":[{},{}]}}]}}],"xhtml:br":{}}}}},"Body_Text":"In this case, you may leave a thread locked accidentally."}},"Taxonomy_Mappings":{"Taxonomy_Mapping":[{"Taxonomy_Name":"CLASP","Entry_Name":"Improper cleanup on thrown exception"},{"Taxonomy_Name":"The CERT Oracle Secure Coding Standard for Java (2011)","Entry_ID":"ERR03-J","Entry_Name":"Restore prior object state on method failure"},{"Taxonomy_Name":"The CERT Oracle Secure Coding Standard for Java (2011)","Entry_ID":"ERR05-J","Entry_Name":"Do not let checked exceptions escape from a finally block"},{"Taxonomy_Name":"SEI CERT Perl Coding Standard","Entry_ID":"EXP31-PL","Entry_Name":"Do not suppress or ignore exceptions","Mapping_Fit":"Imprecise"}]},"References":{"Reference":{"External_Reference_ID":"REF-18"}},"Content_History":{"Submission":{"Submission_Name":"CLASP","Submission_Date":"2006-07-19"},"Modification":[{"Modification_Name":"Eric Dalci","Modification_Organization":"Cigital","Modification_Date":"2008-07-01","Modification_Comment":"updated Time_of_Introduction"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2008-09-08","Modification_Comment":"updated Applicable_Platforms, Common_Consequences, Relationships, Other_Notes, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2009-03-10","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2009-05-27","Modification_Comment":"updated Description"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-06-01","Modification_Comment":"updated Common_Consequences, Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-06-27","Modification_Comment":"updated Common_Consequences"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-09-13","Modification_Comment":"updated Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2012-05-11","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2014-06-23","Modification_Comment":"updated Description, Other_Notes"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2014-07-30","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2017-11-08","Modification_Comment":"updated Demonstrative_Examples, Modes_of_Introduction, Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2019-01-03","Modification_Comment":"updated Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-02-24","Modification_Comment":"updated References, Type"}]}},{"ID":"462","Name":"Duplicate Key in Associative List (Alist)","Abstraction":"Base","Structure":"Simple","Status":"Incomplete","Description":"Duplicate keys in associative lists can lead to non-unique keys being mistaken for an error.","Extended_Description":"A duplicate key entry -- if the alist is designed properly -- could be used as a constant time replace function. However, duplicate key entries could be inserted by mistake. Because of this ambiguity, duplicate key entries in an association list are not recommended and should not be allowed.","Related_Weaknesses":{"Related_Weakness":{"Nature":"ChildOf","CWE_ID":"694","View_ID":"1000","Ordinal":"Primary"}},"Applicable_Platforms":{"Language":[{"Name":"C","Prevalence":"Undetermined"},{"Name":"C++","Prevalence":"Undetermined"},{"Name":"Java","Prevalence":"Undetermined"},{"Name":"C#","Prevalence":"Undetermined"}]},"Modes_Of_Introduction":{"Introduction":[{"Phase":"Architecture and Design"},{"Phase":"Implementation"}]},"Likelihood_Of_Exploit":"Low","Common_Consequences":{"Consequence":{"Scope":"Other","Impact":["Quality Degradation","Varies by Context"]}},"Potential_Mitigations":{"Mitigation":[{"Phase":"Architecture and Design","Description":"Use a hash table instead of an alist."},{"Phase":"Architecture and Design","Description":"Use an alist which checks the uniqueness of hash keys with each entry before inserting the entry."}]},"Demonstrative_Examples":{"Demonstrative_Example":{"Intro_Text":"The following code adds data to a list and then attempts to sort the data.","Example_Code":{"Nature":"bad","Language":"Python","xhtml:div":{"xhtml:br":{},"xhtml:div":{"style":"margin-left:10px;","xhtml:br":{}}}},"Body_Text":"Since basename is not necessarily unique, this may not sort how one would like it to be."}},"Taxonomy_Mappings":{"Taxonomy_Mapping":[{"Taxonomy_Name":"CLASP","Entry_Name":"Duplicate key in associative list (alist)"},{"Taxonomy_Name":"CERT C Secure Coding","Entry_ID":"ENV02-C","Entry_Name":"Beware of multiple environment variables with the same effective name"}]},"References":{"Reference":{"External_Reference_ID":"REF-18"}},"Content_History":{"Submission":{"Submission_Name":"CLASP","Submission_Date":"2006-07-19"},"Modification":[{"Modification_Name":"Eric Dalci","Modification_Organization":"Cigital","Modification_Date":"2008-07-01","Modification_Comment":"updated Time_of_Introduction"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2008-09-08","Modification_Comment":"updated Applicable_Platforms, Relationships, Other_Notes, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2008-11-24","Modification_Comment":"updated Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2009-10-29","Modification_Comment":"updated Demonstrative_Examples, Description, Other_Notes"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-06-01","Modification_Comment":"updated Common_Consequences"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-06-27","Modification_Comment":"updated Common_Consequences"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-09-13","Modification_Comment":"updated Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2012-05-11","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2014-07-30","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2017-11-08","Modification_Comment":"updated Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-02-24","Modification_Comment":"updated References, Relationships"}]}},{"ID":"463","Name":"Deletion of Data Structure Sentinel","Abstraction":"Base","Structure":"Simple","Status":"Incomplete","Description":"The accidental deletion of a data-structure sentinel can cause serious programming logic problems.","Extended_Description":"Often times data-structure sentinels are used to mark structure of the data structure. A common example of this is the null character at the end of strings. Another common example is linked lists which may contain a sentinel to mark the end of the list. It is dangerous to allow this type of control data to be easily accessible. Therefore, it is important to protect from the deletion or modification outside of some wrapper interface which provides safety.","Related_Weaknesses":{"Related_Weakness":[{"Nature":"ChildOf","CWE_ID":"707","View_ID":"1000","Ordinal":"Primary"},{"Nature":"PeerOf","CWE_ID":"464","View_ID":"1000"}]},"Applicable_Platforms":{"Language":[{"Name":"C","Prevalence":"Undetermined"},{"Name":"C++","Prevalence":"Undetermined"}]},"Modes_Of_Introduction":{"Introduction":[{"Phase":"Architecture and Design"},{"Phase":"Implementation"}]},"Common_Consequences":{"Consequence":[{"Scope":["Availability","Other"],"Impact":"Other","Note":"Generally this error will cause the data structure to not work properly."},{"Scope":["Authorization","Other"],"Impact":"Other","Note":"If a control character, such as NULL is removed, one may cause resource access control problems."}]},"Potential_Mitigations":{"Mitigation":[{"Phase":"Architecture and Design","Description":"Use an abstraction library to abstract away risky APIs. Not a complete solution."},{"Mitigation_ID":"MIT-10","Phase":"Build and Compilation","Strategy":"Compilation or Build Hardening","Description":{"xhtml:p":["Run or compile the software using features or extensions that automatically provide a protection mechanism that mitigates or eliminates buffer overflows.","For example, certain compilers and extensions provide automatic buffer overflow detection mechanisms that are built into the compiled code. Examples include the Microsoft Visual Studio /GS flag, Fedora/Red Hat FORTIFY_SOURCE GCC flag, StackGuard, and ProPolice."]},"Effectiveness":"Defense in Depth","Effectiveness_Notes":"This is not necessarily a complete solution, since these mechanisms can only detect certain types of overflows. In addition, an attack could still cause a denial of service, since the typical response is to exit the application."},{"Phase":"Operation","Description":"Use OS-level preventative functionality. Not a complete solution."}]},"Demonstrative_Examples":{"Demonstrative_Example":{"Intro_Text":"This example creates a null terminated string and prints it contents.","Example_Code":{"Nature":"bad","Language":"C","xhtml:div":{"xhtml:br":[{},{},{},{},{},{}],"xhtml:div":{"style":"margin-left:10px;","$t":"foo[counter]=\'a\';"}}},"Body_Text":"The string foo has space for 9 characters and a null terminator, but 10 characters are written to it. As a result, the string foo is not null terminated and calling printf() on it will have unpredictable and possibly dangerous results."}},"Taxonomy_Mappings":{"Taxonomy_Mapping":{"Taxonomy_Name":"CLASP","Entry_Name":"Deletion of data-structure sentinel"}},"References":{"Reference":[{"External_Reference_ID":"REF-18"},{"External_Reference_ID":"REF-62","Section":"Chapter 8, \\"NUL-Termination Problems\\", Page 452"}]},"Content_History":{"Submission":{"Submission_Name":"CLASP","Submission_Date":"2006-07-19"},"Modification":[{"Modification_Name":"Eric Dalci","Modification_Organization":"Cigital","Modification_Date":"2008-07-01","Modification_Comment":"updated Time_of_Introduction"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2008-09-08","Modification_Comment":"updated Applicable_Platforms, Common_Consequences, Relationships, Other_Notes, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2009-07-27","Modification_Comment":"updated Potential_Mitigations"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2009-10-29","Modification_Comment":"updated Description, Other_Notes"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-06-01","Modification_Comment":"updated Common_Consequences, Demonstrative_Examples"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2012-05-11","Modification_Comment":"updated References, Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2012-10-30","Modification_Comment":"updated Potential_Mitigations"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2014-07-30","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2017-11-08","Modification_Comment":"updated Demonstrative_Examples"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-02-24","Modification_Comment":"updated References, Relationships"}],"Previous_Entry_Name":{"Date":"2008-04-11","$t":"Deletion of Data-structure Sentinel"}}},{"ID":"464","Name":"Addition of Data Structure Sentinel","Abstraction":"Base","Structure":"Simple","Status":"Incomplete","Description":"The accidental addition of a data-structure sentinel can cause serious programming logic problems.","Extended_Description":"Data-structure sentinels are often used to mark the structure of data. A common example of this is the null character at the end of strings or a special sentinel to mark the end of a linked list. It is dangerous to allow this type of control data to be easily accessible. Therefore, it is important to protect from the addition or modification of sentinels.","Related_Weaknesses":{"Related_Weakness":{"Nature":"ChildOf","CWE_ID":"138","View_ID":"1000","Ordinal":"Primary"}},"Applicable_Platforms":{"Language":[{"Name":"C","Prevalence":"Undetermined"},{"Name":"C++","Prevalence":"Undetermined"}]},"Modes_Of_Introduction":{"Introduction":[{"Phase":"Architecture and Design"},{"Phase":"Implementation"}]},"Likelihood_Of_Exploit":"High","Common_Consequences":{"Consequence":{"Scope":"Integrity","Impact":"Modify Application Data","Note":"Generally this error will cause the data structure to not work properly by truncating the data."}},"Potential_Mitigations":{"Mitigation":[{"Phase":["Implementation","Architecture and Design"],"Description":"Encapsulate the user from interacting with data sentinels. Validate user input to verify that sentinels are not present."},{"Phase":"Implementation","Description":"Proper error checking can reduce the risk of inadvertently introducing sentinel values into data. For example, if a parsing function fails or encounters an error, it might return a value that is the same as the sentinel."},{"Phase":"Architecture and Design","Description":"Use an abstraction library to abstract away risky APIs. This is not a complete solution."},{"Phase":"Operation","Description":"Use OS-level preventative functionality. This is not a complete solution."}]},"Demonstrative_Examples":{"Demonstrative_Example":{"Intro_Text":"The following example assigns some character values to a list of characters and prints them each individually, and then as a string. The third character value is intended to be an integer taken from user input and converted to an int.","Example_Code":{"Nature":"bad","Language":"C","xhtml:div":{"xhtml:br":[{},{},{},{},{},{},{},{}]}},"Body_Text":"The first print statement will print each character separated by a space. However, if a non-integer is read from stdin by getc, then atoi will not make a conversion and return 0. When foo is printed as a string, the 0 at character foo[2] will act as a NULL terminator and foo[3] will never be printed."}},"Taxonomy_Mappings":{"Taxonomy_Mapping":[{"Taxonomy_Name":"CLASP","Entry_Name":"Addition of data-structure sentinel"},{"Taxonomy_Name":"CERT C Secure Coding","Entry_ID":"STR03-C","Entry_Name":"Do not inadvertently truncate a null-terminated byte string"},{"Taxonomy_Name":"CERT C Secure Coding","Entry_ID":"STR06-C","Entry_Name":"Do not assume that strtok() leaves the parse string unchanged"}]},"References":{"Reference":{"External_Reference_ID":"REF-18"}},"Content_History":{"Submission":{"Submission_Name":"CLASP","Submission_Date":"2006-07-19"},"Modification":[{"Modification_Name":"Eric Dalci","Modification_Organization":"Cigital","Modification_Date":"2008-07-01","Modification_Comment":"updated Time_of_Introduction"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2008-09-08","Modification_Comment":"updated Applicable_Platforms, Common_Consequences, Relationships, Other_Notes, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2008-11-24","Modification_Comment":"updated Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2009-07-27","Modification_Comment":"updated Demonstrative_Examples, Description, Other_Notes, Potential_Mitigations, Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-06-01","Modification_Comment":"updated Common_Consequences"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-06-27","Modification_Comment":"updated Common_Consequences"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-09-13","Modification_Comment":"updated Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2012-05-11","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2012-10-30","Modification_Comment":"updated Potential_Mitigations"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2014-07-30","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2017-11-08","Modification_Comment":"updated Demonstrative_Examples, Likelihood_of_Exploit, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-02-24","Modification_Comment":"updated References, Relationships"}],"Previous_Entry_Name":{"Date":"2008-04-11","$t":"Addition of Data-structure Sentinel"}}},{"ID":"466","Name":"Return of Pointer Value Outside of Expected Range","Abstraction":"Base","Structure":"Simple","Status":"Draft","Description":"A function can return a pointer to memory that is outside of the buffer that the pointer is expected to reference.","Related_Weaknesses":{"Related_Weakness":[{"Nature":"ChildOf","CWE_ID":"119","View_ID":"1000","Ordinal":"Primary"},{"Nature":"ChildOf","CWE_ID":"20","View_ID":"700","Ordinal":"Primary"}]},"Applicable_Platforms":{"Language":[{"Name":"C","Prevalence":"Undetermined"},{"Name":"C++","Prevalence":"Undetermined"}]},"Modes_Of_Introduction":{"Introduction":[{"Phase":"Architecture and Design"},{"Phase":"Implementation"}]},"Common_Consequences":{"Consequence":{"Scope":["Confidentiality","Integrity"],"Impact":["Read Memory","Modify Memory"]}},"Taxonomy_Mappings":{"Taxonomy_Mapping":[{"Taxonomy_Name":"7 Pernicious Kingdoms","Entry_Name":"Illegal Pointer Value"},{"Taxonomy_Name":"Software Fault Patterns","Entry_ID":"SFP1","Entry_Name":"Glitch in computation"}]},"References":{"Reference":[{"External_Reference_ID":"REF-6"},{"External_Reference_ID":"REF-44","Section":"\\"Sin 5: Buffer Overruns.\\" Page 89"}]},"Notes":{"Note":{"Type":"Maintenance","$t":"This entry should have a chaining relationship with CWE-119 instead of a parent / child relationship, however the focus of this weakness does not map cleanly to any existing entries in CWE. A new parent is being considered which covers the more generic problem of incorrect return values. There is also an abstract relationship to weaknesses in which one component sends incorrect messages to another component; in this case, one routine is sending an incorrect value to another."}},"Content_History":{"Submission":{"Submission_Name":"7 Pernicious Kingdoms","Submission_Date":"2006-07-19"},"Modification":[{"Modification_Name":"Eric Dalci","Modification_Organization":"Cigital","Modification_Date":"2008-07-01","Modification_Comment":"updated Potential_Mitigations, Time_of_Introduction"},{"Modification_Organization":"KDM Analytics","Modification_Date":"2008-08-01","Modification_Comment":"added/updated white box definitions"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2008-09-08","Modification_Comment":"updated Applicable_Platforms, Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2008-11-24","Modification_Comment":"updated Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2009-10-29","Modification_Comment":"updated Maintenance_Notes"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-06-01","Modification_Comment":"updated Common_Consequences"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-09-13","Modification_Comment":"updated Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2012-05-11","Modification_Comment":"updated Potential_Mitigations, References, Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2012-10-30","Modification_Comment":"updated Potential_Mitigations"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2014-07-30","Modification_Comment":"updated Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2017-11-08","Modification_Comment":"updated Taxonomy_Mappings, White_Box_Definitions"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-02-24","Modification_Comment":"updated References"}],"Previous_Entry_Name":{"Date":"2008-04-11","$t":"Illegal Pointer Value"}}},{"ID":"467","Name":"Use of sizeof() on a Pointer Type","Abstraction":"Variant","Structure":"Simple","Status":"Draft","Description":"The code calls sizeof() on a malloced pointer type, which always returns the wordsize/8. This can produce an unexpected result if the programmer intended to determine how much memory has been allocated.","Extended_Description":"The use of sizeof() on a pointer can sometimes generate useful information. An obvious case is to find out the wordsize on a platform. More often than not, the appearance of sizeof(pointer) indicates a bug.","Related_Weaknesses":{"Related_Weakness":[{"Nature":"ChildOf","CWE_ID":"682","View_ID":"1000","Ordinal":"Primary"},{"Nature":"CanPrecede","CWE_ID":"131","View_ID":"1000"}]},"Weakness_Ordinalities":{"Weakness_Ordinality":{"Ordinality":"Primary"}},"Applicable_Platforms":{"Language":[{"Name":"C","Prevalence":"Undetermined"},{"Name":"C++","Prevalence":"Undetermined"}]},"Modes_Of_Introduction":{"Introduction":{"Phase":"Implementation"}},"Likelihood_Of_Exploit":"High","Common_Consequences":{"Consequence":{"Scope":["Integrity","Confidentiality"],"Impact":["Modify Memory","Read Memory"],"Note":"This error can often cause one to allocate a buffer that is much smaller than what is needed, leading to resultant weaknesses such as buffer overflows."}},"Potential_Mitigations":{"Mitigation":{"Phase":"Implementation","Description":"Use expressions such as \\"sizeof(*pointer)\\" instead of \\"sizeof(pointer)\\", unless you intend to run sizeof() on a pointer type to gain some platform independence or if you are allocating a variable on the stack."}},"Demonstrative_Examples":{"Demonstrative_Example":[{"Intro_Text":"Care should be taken to ensure sizeof returns the size of the data structure itself, and not the size of the pointer to the data structure.","Body_Text":["In this example, sizeof(foo) returns the size of the pointer.","In this example, sizeof(*foo) returns the size of the data structure and not the size of the pointer."],"Example_Code":[{"Nature":"bad","Language":"C","xhtml:div":{"xhtml:br":[{},{}]}},{"Nature":"good","Language":"C","xhtml:div":{"xhtml:br":[{},{}]}}]},{"Intro_Text":"This example defines a fixed username and password. The AuthenticateUser() function is intended to accept a username and a password from an untrusted user, and check to ensure that it matches the username and password. If the username and password match, AuthenticateUser() is intended to indicate that authentication succeeded.","Example_Code":[{"Nature":"bad","xhtml:div":{"$t":"char *username = \\"admin\\";char *pass = \\"password\\";\\n                     int AuthenticateUser(char *inUser, char *inPass) {}\\n                     int main (int argc, char **argv){}","xhtml:br":[{},{},{},{},{},{},{},{},{}],"xhtml:i":"/* Ignore CWE-259 (hard-coded password) and CWE-309 (use of password system for authentication) for this example. */","xhtml:div":[{"style":"margin-left:10px;","xhtml:div":{"xhtml:br":[{},{},{},{},{},{},{}],"xhtml:div":[{"style":"margin-left:10px;","xhtml:br":{}},{"style":"margin-left:10px;","xhtml:br":{}},{"style":"margin-left:10px;","xhtml:br":{}}],"xhtml:i":"/* Because of CWE-467, the sizeof returns 4 on many platforms and architectures. */"}},{"style":"margin-left:10px;","$t":"","xhtml:div":{"$t":"int authResult;\\n                           if (argc < 3) {}authResult = AuthenticateUser(argv[1], argv[2]);if (authResult != AUTH_SUCCESS) {}else {}","xhtml:br":[{},{},{},{},{}],"xhtml:div":[{"style":"margin-left:10px;","$t":"ExitError(\\"Usage: Provide a username and password\\");"},{"style":"margin-left:10px;","$t":"ExitError(\\"Authentication failed\\");"},{"style":"margin-left:10px;","$t":"DoAuthenticatedTask(argv[1]);"}]}}]}},{"Nature":"attack","xhtml:div":{"xhtml:br":[{},{}]}}],"Body_Text":["In AuthenticateUser(), because sizeof() is applied to a parameter with an array type, the sizeof() call might return 4 on many modern architectures. As a result, the strncmp() call only checks the first four characters of the input password, resulting in a partial comparison (CWE-187), leading to improper authentication (CWE-287).","Because of the partial comparison, any of these passwords would still cause authentication to succeed for the \\"admin\\" user:","Because only 4 characters are checked, this significantly reduces the search space for an attacker, making brute force attacks more feasible.","The same problem also applies to the username, so values such as \\"adminXYZ\\" and \\"administrator\\" will succeed for the username."]}]},"Taxonomy_Mappings":{"Taxonomy_Mapping":[{"Taxonomy_Name":"CLASP","Entry_Name":"Use of sizeof() on a pointer type"},{"Taxonomy_Name":"CERT C Secure Coding","Entry_ID":"ARR01-C","Entry_Name":"Do not apply the sizeof operator to a pointer when taking the size of an array"},{"Taxonomy_Name":"CERT C Secure Coding","Entry_ID":"MEM35-C","Entry_Name":"Allocate sufficient memory for an object","Mapping_Fit":"CWE More Abstract"},{"Taxonomy_Name":"Software Fault Patterns","Entry_ID":"SFP10","Entry_Name":"Incorrect Buffer Length Computation"}]},"References":{"Reference":[{"External_Reference_ID":"REF-18"},{"External_Reference_ID":"REF-442"}]},"Content_History":{"Submission":{"Submission_Name":"CLASP","Submission_Date":"2006-07-19"},"Modification":[{"Modification_Name":"Eric Dalci","Modification_Organization":"Cigital","Modification_Date":"2008-07-01","Modification_Comment":"updated Time_of_Introduction"},{"Modification_Organization":"KDM Analytics","Modification_Date":"2008-08-01","Modification_Comment":"added/updated white box definitions"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2008-09-08","Modification_Comment":"updated Applicable_Platforms, Common_Consequences, Relationships, Other_Notes, Taxonomy_Mappings, Weakness_Ordinalities"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2008-11-24","Modification_Comment":"updated Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2009-03-10","Modification_Comment":"updated Demonstrative_Examples"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2009-12-28","Modification_Comment":"updated Demonstrative_Examples"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2010-02-16","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-06-01","Modification_Comment":"updated Common_Consequences"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-06-27","Modification_Comment":"updated Common_Consequences"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-09-13","Modification_Comment":"updated Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2012-05-11","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2014-06-23","Modification_Comment":"updated Description, Other_Notes"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2014-07-30","Modification_Comment":"updated Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2017-11-08","Modification_Comment":"updated Demonstrative_Examples, Taxonomy_Mappings, White_Box_Definitions"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2019-01-03","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-02-24","Modification_Comment":"updated References"}]}},{"ID":"468","Name":"Incorrect Pointer Scaling","Abstraction":"Base","Structure":"Simple","Status":"Incomplete","Description":"In C and C++, one may often accidentally refer to the wrong memory due to the semantics of when math operations are implicitly scaled.","Related_Weaknesses":{"Related_Weakness":{"Nature":"ChildOf","CWE_ID":"682","View_ID":"1000","Ordinal":"Primary"}},"Applicable_Platforms":{"Language":[{"Name":"C","Prevalence":"Undetermined"},{"Name":"C++","Prevalence":"Undetermined"}]},"Modes_Of_Introduction":{"Introduction":{"Phase":"Implementation","Note":"Programmers may try to index from a pointer by adding a number of bytes. This is incorrect because C and C++ implicitly scale the operand by the size of the data type."}},"Likelihood_Of_Exploit":"Medium","Common_Consequences":{"Consequence":{"Scope":["Confidentiality","Integrity"],"Impact":["Read Memory","Modify Memory"],"Note":"Incorrect pointer scaling will often result in buffer overflow conditions. Confidentiality can be compromised if the weakness is in the context of a buffer over-read or under-read."}},"Potential_Mitigations":{"Mitigation":[{"Phase":"Architecture and Design","Description":"Use a platform with high-level memory abstractions."},{"Phase":"Implementation","Description":"Always use array indexing instead of direct pointer manipulation."},{"Phase":"Architecture and Design","Description":"Use technologies for preventing buffer overflows."}]},"Demonstrative_Examples":{"Demonstrative_Example":{"Demonstrative_Example_ID":"DX-55","Intro_Text":"This example attempts to calculate the position of the second byte of a pointer.","Example_Code":{"Nature":"bad","Language":"C","xhtml:div":{"xhtml:br":{}}},"Body_Text":"In this example, second_char is intended to point to the second byte of p. But, adding 1 to p actually adds sizeof(int) to p, giving a result that is incorrect (3 bytes off on 32-bit platforms). If the resulting memory address is read, this could potentially be an information leak. If it is a write, it could be a security-critical write to unauthorized memory-- whether or not it is a buffer overflow. Note that the above code may also be wrong in other ways, particularly in a little endian environment."}},"Taxonomy_Mappings":{"Taxonomy_Mapping":[{"Taxonomy_Name":"CLASP","Entry_Name":"Unintentional pointer scaling"},{"Taxonomy_Name":"CERT C Secure Coding","Entry_ID":"ARR39-C","Entry_Name":"Do not add or subtract a scaled integer to a pointer","Mapping_Fit":"Exact"},{"Taxonomy_Name":"CERT C Secure Coding","Entry_ID":"EXP08-C","Entry_Name":"Ensure pointer arithmetic is used correctly"},{"Taxonomy_Name":"Software Fault Patterns","Entry_ID":"SFP1","Entry_Name":"Glitch in computation"}]},"References":{"Reference":[{"External_Reference_ID":"REF-18"},{"External_Reference_ID":"REF-62","Section":"Chapter 6, \\"Pointer Arithmetic\\", Page 277"}]},"Content_History":{"Submission":{"Submission_Name":"CLASP","Submission_Date":"2006-07-19"},"Modification":[{"Modification_Name":"Eric Dalci","Modification_Organization":"Cigital","Modification_Date":"2008-07-01","Modification_Comment":"updated Time_of_Introduction"},{"Modification_Organization":"KDM Analytics","Modification_Date":"2008-08-01","Modification_Comment":"added/updated white box definitions"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2008-09-08","Modification_Comment":"updated Applicable_Platforms, Common_Consequences, Relationships, Other_Notes, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2008-11-24","Modification_Comment":"updated Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2009-05-27","Modification_Comment":"updated Demonstrative_Examples"},{"Modification_Name":"KDM Analytics","Modification_Date":"2009-07-17","Modification_Comment":"Improved the White_Box_Definition"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2009-07-27","Modification_Comment":"updated White_Box_Definitions"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2009-10-29","Modification_Comment":"updated Common_Consequences"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-06-01","Modification_Comment":"updated Common_Consequences"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-06-27","Modification_Comment":"updated Common_Consequences"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2012-05-11","Modification_Comment":"updated Demonstrative_Examples, References, Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2012-10-30","Modification_Comment":"updated Potential_Mitigations"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2014-06-23","Modification_Comment":"updated Modes_of_Introduction, Other_Notes"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2014-07-30","Modification_Comment":"updated Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2017-11-08","Modification_Comment":"updated Relationships, Taxonomy_Mappings, White_Box_Definitions"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2019-01-03","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-02-24","Modification_Comment":"updated References"}],"Previous_Entry_Name":{"Date":"2008-04-11","$t":"Unintentional Pointer Scaling"}}},{"ID":"469","Name":"Use of Pointer Subtraction to Determine Size","Abstraction":"Base","Structure":"Simple","Status":"Draft","Description":"The application subtracts one pointer from another in order to determine size, but this calculation can be incorrect if the pointers do not exist in the same memory chunk.","Related_Weaknesses":{"Related_Weakness":{"Nature":"ChildOf","CWE_ID":"682","View_ID":"1000","Ordinal":"Primary"}},"Applicable_Platforms":{"Language":[{"Name":"C","Prevalence":"Undetermined"},{"Name":"C++","Prevalence":"Undetermined"}]},"Modes_Of_Introduction":{"Introduction":{"Phase":"Implementation"}},"Likelihood_Of_Exploit":"Medium","Common_Consequences":{"Consequence":{"Scope":["Access Control","Integrity","Confidentiality","Availability"],"Impact":["Modify Memory","Read Memory","Execute Unauthorized Code or Commands","Gain Privileges or Assume Identity"],"Note":"There is the potential for arbitrary code execution with privileges of the vulnerable program."}},"Potential_Mitigations":{"Mitigation":{"Phase":"Implementation","Description":"Save an index variable. This is the recommended solution. Rather than subtract pointers from one another, use an index variable of the same size as the pointers in question. Use this variable to \\"walk\\" from one pointer to the other and calculate the difference. Always sanity check this number."}},"Demonstrative_Examples":{"Demonstrative_Example":{"Intro_Text":"The following example contains the method size that is used to determine the number of nodes in a linked list. The method is passed a pointer to the head of the linked list.","Example_Code":[{"Nature":"bad","Language":"C","xhtml:div":{"xhtml:div":[{"style":"margin-left:10px;","xhtml:br":{}},{"style":"margin-left:10px;","xhtml:br":[{},{},{}],"xhtml:div":{"style":"margin-left:10px;","xhtml:br":{}}}],"xhtml:br":[{},{},{},{},{},{},{},{},{}],"xhtml:i":["// Returns the number of nodes in a linked list from","// the given pointer to the head of the list.","// other methods for manipulating the list"]}},{"Nature":"good","Language":"C","xhtml:div":{"xhtml:br":[{},{},{}],"xhtml:div":{"style":"margin-left:10px;","xhtml:br":[{},{},{}],"xhtml:div":{"style":"margin-left:10px;","xhtml:br":{}}}}}],"Body_Text":"However, the method creates a pointer that points to the end of the list and uses pointer subtraction to determine the number of nodes in the list by subtracting the tail pointer from the head pointer. There no guarantee that the pointers exist in the same memory area, therefore using pointer subtraction in this way could return incorrect results and allow other unintended behavior. In this example a counter should be used to determine the number of nodes in the list, as shown in the following code."}},"Taxonomy_Mappings":{"Taxonomy_Mapping":[{"Taxonomy_Name":"CLASP","Entry_Name":"Improper pointer subtraction"},{"Taxonomy_Name":"CERT C Secure Coding","Entry_ID":"ARR36-C","Entry_Name":"Do not subtract or compare two pointers that do not refer to the same array","Mapping_Fit":"Exact"},{"Taxonomy_Name":"Software Fault Patterns","Entry_ID":"SFP1","Entry_Name":"Glitch in Computation"}]},"References":{"Reference":{"External_Reference_ID":"REF-18"}},"Content_History":{"Submission":{"Submission_Name":"CLASP","Submission_Date":"2006-07-19"},"Modification":[{"Modification_Name":"Eric Dalci","Modification_Organization":"Cigital","Modification_Date":"2008-07-01","Modification_Comment":"updated Time_of_Introduction"},{"Modification_Organization":"KDM Analytics","Modification_Date":"2008-08-01","Modification_Comment":"added/updated white box definitions"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2008-09-08","Modification_Comment":"updated Applicable_Platforms, Common_Consequences, Relationships, Other_Notes, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2008-11-24","Modification_Comment":"updated Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-06-01","Modification_Comment":"updated Common_Consequences"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-09-13","Modification_Comment":"updated Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2012-05-11","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2012-10-30","Modification_Comment":"updated Demonstrative_Examples, Potential_Mitigations"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2014-02-18","Modification_Comment":"updated Potential_Mitigations"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2014-06-23","Modification_Comment":"updated Other_Notes"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2014-07-30","Modification_Comment":"updated Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2017-11-08","Modification_Comment":"updated Demonstrative_Examples, Taxonomy_Mappings, White_Box_Definitions"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2019-01-03","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-02-24","Modification_Comment":"updated References, Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-06-25","Modification_Comment":"updated Common_Consequences"}],"Previous_Entry_Name":{"Date":"2008-04-11","$t":"Improper Pointer Subtraction"}}},{"ID":"474","Name":"Use of Function with Inconsistent Implementations","Abstraction":"Base","Structure":"Simple","Status":"Draft","Description":"The code uses a function that has inconsistent implementations across operating systems and versions.","Extended_Description":{"xhtml:p":["The use of inconsistent implementations can cause changes in behavior when the code is ported or built under a different environment than the programmer expects, which can lead to security problems in some cases.","The implementation of many functions varies by platform, and at times, even by different versions of the same platform. Implementation differences can include:"],"xhtml:div":{"style":"margin-left:10px;","xhtml:ul":{"xhtml:li":["Slight differences in the way parameters are interpreted leading to inconsistent results.","Some implementations of the function carry significant security risks.","The function might not be defined on all platforms.","The function might change which return codes it can provide, or change the meaning of its return codes."]}}},"Related_Weaknesses":{"Related_Weakness":{"Nature":"ChildOf","CWE_ID":"758","View_ID":"1000","Ordinal":"Primary"}},"Weakness_Ordinalities":{"Weakness_Ordinality":[{"Ordinality":"Primary"},{"Ordinality":"Indirect"}]},"Applicable_Platforms":{"Language":[{"Name":"C","Prevalence":"Often"},{"Name":"PHP","Prevalence":"Often"},{"Class":"Language-Independent","Prevalence":"Undetermined"}]},"Modes_Of_Introduction":{"Introduction":[{"Phase":"Architecture and Design"},{"Phase":"Implementation"}]},"Common_Consequences":{"Consequence":{"Scope":"Other","Impact":["Quality Degradation","Varies by Context"]}},"Potential_Mitigations":{"Mitigation":{"Phase":["Architecture and Design","Requirements"],"Description":"Do not accept inconsistent behavior from the API specifications when the deviant behavior increase the risk level."}},"Taxonomy_Mappings":{"Taxonomy_Mapping":[{"Taxonomy_Name":"7 Pernicious Kingdoms","Entry_Name":"Inconsistent Implementations"},{"Taxonomy_Name":"Software Fault Patterns","Entry_ID":"SFP3","Entry_Name":"Use of an improper API"}]},"References":{"Reference":{"External_Reference_ID":"REF-6"}},"Content_History":{"Submission":{"Submission_Name":"7 Pernicious Kingdoms","Submission_Date":"2006-07-19"},"Modification":[{"Modification_Name":"Eric Dalci","Modification_Organization":"Cigital","Modification_Date":"2008-07-01","Modification_Comment":"updated Potential_Mitigations, Time_of_Introduction"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2008-09-08","Modification_Comment":"updated Applicable_Platforms, Relationships, Other_Notes, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-06-01","Modification_Comment":"updated Common_Consequences, Other_Notes"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-06-27","Modification_Comment":"updated Common_Consequences"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2012-05-11","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2012-10-30","Modification_Comment":"updated Potential_Mitigations"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2014-06-23","Modification_Comment":"updated Applicable_Platforms, Description, Other_Notes"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2014-07-30","Modification_Comment":"updated Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2017-11-08","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2019-01-03","Modification_Comment":"updated Relationships, Weakness_Ordinalities"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-02-24","Modification_Comment":"updated References, Relationships"}],"Previous_Entry_Name":{"Date":"2008-04-11","$t":"Inconsistent Implementations"}}},{"ID":"476","Name":"NULL Pointer Dereference","Abstraction":"Base","Structure":"Simple","Status":"Stable","Description":"A NULL pointer dereference occurs when the application dereferences a pointer that it expects to be valid, but is NULL, typically causing a crash or exit.","Extended_Description":"NULL pointer dereference issues can occur through a number of flaws, including race conditions, and simple programming omissions.","Related_Weaknesses":{"Related_Weakness":[{"Nature":"ChildOf","CWE_ID":"710","View_ID":"1000","Ordinal":"Primary"},{"Nature":"ChildOf","CWE_ID":"754","View_ID":"1000"},{"Nature":"ChildOf","CWE_ID":"754","View_ID":"1003","Ordinal":"Primary"}]},"Weakness_Ordinalities":{"Weakness_Ordinality":{"Ordinality":"Resultant","Description":"NULL pointer dereferences are frequently resultant from rarely encountered error conditions, since these are most likely to escape detection during the testing phases."}},"Applicable_Platforms":{"Language":[{"Name":"C","Prevalence":"Undetermined"},{"Name":"C++","Prevalence":"Undetermined"},{"Name":"Java","Prevalence":"Undetermined"},{"Name":"C#","Prevalence":"Undetermined"}]},"Modes_Of_Introduction":{"Introduction":{"Phase":"Implementation"}},"Likelihood_Of_Exploit":"Medium","Common_Consequences":{"Consequence":[{"Scope":"Availability","Impact":"DoS: Crash, Exit, or Restart","Note":"NULL pointer dereferences usually result in the failure of the process unless exception handling (on some platforms) is available and implemented. Even when exception handling is being used, it can still be very difficult to return the software to a safe state of operation."},{"Scope":["Integrity","Confidentiality","Availability"],"Impact":["Execute Unauthorized Code or Commands","Read Memory","Modify Memory"],"Note":"In rare circumstances, when NULL is equivalent to the 0x0 memory address and privileged code can access it, then writing or reading memory is possible, which may lead to code execution."}]},"Detection_Methods":{"Detection_Method":[{"Detection_Method_ID":"DM-2","Method":"Automated Dynamic Analysis","Description":"This weakness can be detected using dynamic tools and techniques that interact with the software using large test suites with many diverse inputs, such as fuzz testing (fuzzing), robustness testing, and fault injection. The software\'s operation may slow down, but it should not become unstable, crash, or generate incorrect results.","Effectiveness":"Moderate"},{"Detection_Method_ID":"DM-12","Method":"Manual Dynamic Analysis","Description":"Identify error conditions that are not likely to occur during normal usage and trigger them. For example, run the program under low memory conditions, run with insufficient privileges or permissions, interrupt a transaction before it is completed, or disable connectivity to basic network services such as DNS. Monitor the software for any unexpected behavior. If you trigger an unhandled exception or similar error that was discovered and handled by the application\'s environment, it may still indicate unexpected conditions that were not handled by the application itself."}]},"Potential_Mitigations":{"Mitigation":[{"Phase":"Implementation","Description":"If all pointers that could have been modified are sanity-checked previous to use, nearly all NULL pointer dereferences can be prevented."},{"Phase":"Requirements","Description":"The choice could be made to use a language that is not susceptible to these issues."},{"Phase":"Implementation","Description":"Check the results of all functions that return a value and verify that the value is non-null before acting upon it.","Effectiveness":"Moderate","Effectiveness_Notes":"Checking the return value of the function will typically be sufficient, however beware of race conditions (CWE-362) in a concurrent environment. This solution does not handle the use of improperly initialized variables (CWE-665)."},{"Phase":"Architecture and Design","Description":"Identify all variables and data stores that receive information from external sources, and apply input validation to make sure that they are only initialized to expected values."},{"Phase":"Implementation","Description":"Explicitly initialize all your variables and other data stores, either during declaration or just before the first usage."},{"Phase":"Testing","Description":"Use automated static analysis tools that target this type of weakness. Many modern techniques use data flow analysis to minimize the number of false positives. This is not a perfect solution, since 100% accuracy and coverage are not feasible."}]},"Demonstrative_Examples":{"Demonstrative_Example":[{"Intro_Text":"While there are no complete fixes aside from conscientious programming, the following steps will go a long way to ensure that NULL pointer dereferences do not occur.","Example_Code":{"Nature":"good","xhtml:div":{"xhtml:div":{"style":"margin-left:10px;","xhtml:div":{"xhtml:br":[{},{},{},{}],"xhtml:i":["/* make use of pointer1 */","/* ... */"]}}}},"Body_Text":"If you are working with a multithreaded or otherwise asynchronous environment, ensure that proper locking APIs are used to lock before the if statement; and unlock when it has finished."},{"Demonstrative_Example_ID":"DX-1","Intro_Text":"This example takes an IP address from a user, verifies that it is well formed and then looks up the hostname and copies it into a buffer.","Example_Code":{"Nature":"bad","Language":"C","xhtml:div":{"xhtml:div":{"style":"margin-left:10px;","xhtml:div":{"xhtml:br":[{},{},{},{},{},{},{},{},{},{}],"xhtml:i":"/*routine that ensures user_supplied_addr is in the right format for conversion */"}}}},"Body_Text":["If an attacker provides an address that appears to be well-formed, but the address does not resolve to a hostname, then the call to gethostbyaddr() will return NULL. Since the code does not check the return value from gethostbyaddr (CWE-252), a NULL pointer dereference would then occur in the call to strcpy().","Note that this example is also vulnerable to a buffer overflow (see CWE-119)."]},{"Intro_Text":"In the following code, the programmer assumes that the system always has a property named \\"cmd\\" defined. If an attacker can control the program\'s environment so that \\"cmd\\" is not defined, the program throws a NULL pointer exception when it attempts to call the trim() method.","Example_Code":{"Nature":"bad","Language":"Java","xhtml:div":{"xhtml:br":{}}}},{"Demonstrative_Example_ID":"DX-110","Intro_Text":"This application has registered to handle a URL when sent an intent:","Example_Code":{"Nature":"bad","Language":"Java","xhtml:div":{"xhtml:br":[{},{},{},{},{},{},{}],"xhtml:i":["...","..."],"xhtml:div":{"style":"margin-left:10px;","xhtml:div":{"xhtml:br":{},"xhtml:div":{"style":"margin-left:10px;","xhtml:div":{"xhtml:div":{"style":"margin-left:10px;","xhtml:br":{}},"xhtml:br":[{},{}],"xhtml:i":"..."}}}}}},"Body_Text":"The application assumes the URL will always be included in the intent. When the URL is not present, the call to getStringExtra() will return null, thus causing a null pointer exception when length() is called."}]},"Observed_Examples":{"Observed_Example":[{"Reference":"CVE-2005-3274","Description":"race condition causes a table to be corrupted if a timer activates while it is being modified, leading to resultant NULL dereference; also involves locking.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2005-3274"},{"Reference":"CVE-2002-1912","Description":"large number of packets leads to NULL dereference","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2002-1912"},{"Reference":"CVE-2005-0772","Description":"packet with invalid error status value triggers NULL dereference","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2005-0772"},{"Reference":"CVE-2009-4895","Description":"chain: race condition for an argument value, possibly resulting in NULL dereference","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2009-4895"},{"Reference":"CVE-2009-3547","Description":"chain: race condition might allow resource to be released before operating on it, leading to NULL dereference","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2009-3547"},{"Reference":"CVE-2009-3620","Description":"chain: some unprivileged ioctls do not verify that a structure has been initialized before invocation, leading to NULL dereference","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2009-3620"},{"Reference":"CVE-2009-2698","Description":"chain: IP and UDP layers each track the same value with different mechanisms that can get out of sync, possibly resulting in a NULL dereference","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2009-2698"},{"Reference":"CVE-2009-2692","Description":"chain: uninitialized function pointers can be dereferenced allowing code execution","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2009-2692"},{"Reference":"CVE-2009-0949","Description":"chain: improper initialization of memory can lead to NULL dereference","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2009-0949"},{"Reference":"CVE-2008-3597","Description":"chain: game server can access player data structures before initialization has happened leading to NULL dereference","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2008-3597"},{"Reference":"CVE-2008-5183","Description":"chain: unchecked return value can lead to NULL dereference","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2008-5183"},{"Reference":"CVE-2004-0079","Description":"SSL software allows remote attackers to cause a denial of service (crash) via a crafted SSL/TLS handshake that triggers a null dereference.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2004-0079"},{"Reference":"CVE-2004-0365","Description":"Network monitor allows remote attackers to cause a denial of service (crash) via a malformed RADIUS packet that triggers a null dereference.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2004-0365"},{"Reference":"CVE-2003-1013","Description":"Network monitor allows remote attackers to cause a denial of service (crash) via a malformed Q.931, which triggers a null dereference.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2003-1013"},{"Reference":"CVE-2003-1000","Description":"Chat client allows remote attackers to cause a denial of service (crash) via a passive DCC request with an invalid ID number, which causes a null dereference.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2003-1000"},{"Reference":"CVE-2004-0389","Description":"Server allows remote attackers to cause a denial of service (crash) via malformed requests that trigger a null dereference.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2004-0389"},{"Reference":"CVE-2004-0119","Description":"OS allows remote attackers to cause a denial of service (crash from null dereference) or execute arbitrary code via a crafted request during authentication protocol selection.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2004-0119"},{"Reference":"CVE-2004-0458","Description":"Game allows remote attackers to cause a denial of service (server crash) via a missing argument, which triggers a null pointer dereference.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2004-0458"},{"Reference":"CVE-2002-0401","Description":"Network monitor allows remote attackers to cause a denial of service (crash) or execute arbitrary code via malformed packets that cause a NULL pointer dereference.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2002-0401"}]},"Taxonomy_Mappings":{"Taxonomy_Mapping":[{"Taxonomy_Name":"7 Pernicious Kingdoms","Entry_Name":"Null Dereference"},{"Taxonomy_Name":"CLASP","Entry_Name":"Null-pointer dereference"},{"Taxonomy_Name":"PLOVER","Entry_Name":"Null Dereference (Null Pointer Dereference)"},{"Taxonomy_Name":"OWASP Top Ten 2004","Entry_ID":"A9","Entry_Name":"Denial of Service","Mapping_Fit":"CWE More Specific"},{"Taxonomy_Name":"CERT C Secure Coding","Entry_ID":"EXP34-C","Entry_Name":"Do not dereference null pointers","Mapping_Fit":"Exact"},{"Taxonomy_Name":"Software Fault Patterns","Entry_ID":"SFP7","Entry_Name":"Faulty Pointer Use"}]},"References":{"Reference":[{"External_Reference_ID":"REF-6"},{"External_Reference_ID":"REF-18"},{"External_Reference_ID":"REF-1031"},{"External_Reference_ID":"REF-1032"},{"External_Reference_ID":"REF-1033"}]},"Content_History":{"Submission":{"Submission_Name":"7 Pernicious Kingdoms","Submission_Date":"2006-07-19"},"Modification":[{"Modification_Name":"Eric Dalci","Modification_Organization":"Cigital","Modification_Date":"2008-07-01","Modification_Comment":"updated Time_of_Introduction"},{"Modification_Organization":"KDM Analytics","Modification_Date":"2008-08-01","Modification_Comment":"added/updated white box definitions"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2008-09-08","Modification_Comment":"updated Applicable_Platforms, Common_Consequences, Relationships, Other_Notes, Taxonomy_Mappings, Weakness_Ordinalities"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2008-11-24","Modification_Comment":"updated Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2009-05-27","Modification_Comment":"updated Demonstrative_Examples"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2009-10-29","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2009-12-28","Modification_Comment":"updated Common_Consequences, Demonstrative_Examples, Other_Notes, Potential_Mitigations, Weakness_Ordinalities"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2010-02-16","Modification_Comment":"updated Potential_Mitigations, Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2010-06-21","Modification_Comment":"updated Demonstrative_Examples, Description, Detection_Factors, Potential_Mitigations"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2010-09-27","Modification_Comment":"updated Demonstrative_Examples, Observed_Examples, Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2010-12-13","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-06-01","Modification_Comment":"updated Common_Consequences"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-06-27","Modification_Comment":"updated Related_Attack_Patterns, Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-09-13","Modification_Comment":"updated Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2012-05-11","Modification_Comment":"updated Observed_Examples, Related_Attack_Patterns, Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2014-02-18","Modification_Comment":"updated Demonstrative_Examples"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2014-07-30","Modification_Comment":"updated Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2015-12-07","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2017-01-19","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2017-11-08","Modification_Comment":"updated Relationships, Taxonomy_Mappings, White_Box_Definitions"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2019-01-03","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2019-06-20","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2019-09-19","Modification_Comment":"updated References, Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-02-24","Modification_Comment":"updated References"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-06-25","Modification_Comment":"updated Common_Consequences"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-08-20","Modification_Comment":"updated Relationships"}]}},{"ID":"478","Name":"Missing Default Case in Switch Statement","Abstraction":"Base","Structure":"Simple","Status":"Draft","Description":"The code does not have a default case in a switch statement, which might lead to complex logical errors and resultant weaknesses.","Extended_Description":"This flaw represents a common problem in software development, in which not all possible values for a variable are considered or handled by a given process. Because of this, further decisions are made based on poor information, and cascading failure results. This cascading failure may result in any number of security issues, and constitutes a significant failure in the system.","Related_Weaknesses":{"Related_Weakness":{"Nature":"ChildOf","CWE_ID":"1023","View_ID":"1000","Ordinal":"Primary"}},"Weakness_Ordinalities":{"Weakness_Ordinality":{"Ordinality":"Primary"}},"Applicable_Platforms":{"Language":[{"Name":"C","Prevalence":"Undetermined"},{"Name":"C++","Prevalence":"Undetermined"},{"Name":"Java","Prevalence":"Undetermined"},{"Name":"C#","Prevalence":"Undetermined"}]},"Modes_Of_Introduction":{"Introduction":{"Phase":"Implementation"}},"Common_Consequences":{"Consequence":{"Scope":"Integrity","Impact":["Varies by Context","Alter Execution Logic"],"Note":"Depending on the logical circumstances involved, any consequences may result: e.g., issues of confidentiality, authentication, authorization, availability, integrity, accountability, or non-repudiation."}},"Potential_Mitigations":{"Mitigation":[{"Phase":"Implementation","Description":"Ensure that there are no unaccounted for cases, when adjusting flow or values based on the value of a given variable. In switch statements, this can be accomplished through the use of the default label."},{"Phase":"Implementation","Description":"In the case of switch style statements, the very simple act of creating a default case can mitigate this situation, if done correctly. Often however, the default case is used simply to represent an assumed option, as opposed to working as a check for invalid input. This is poor practice and in some cases is as bad as omitting a default case entirely."}]},"Demonstrative_Examples":{"Demonstrative_Example":[{"Intro_Text":"The following does not properly check the return code in the case where the security_check function returns a -1 value when an error occurs. If an attacker can supply data that will invoke an error, the attacker can bypass the security check:","Example_Code":[{"Nature":"bad","Language":"C","xhtml:div":{"xhtml:br":[{},{},{},{},{},{},{}],"xhtml:div":{"style":"margin-left:10px;","xhtml:div":{"xhtml:div":[{"style":"margin-left:10px;","xhtml:br":[{},{},{}],"xhtml:i":"//Break never reached because of exit()"},{"style":"margin-left:10px;","xhtml:br":{}}],"xhtml:br":{}}},"xhtml:i":"// program execution continues..."}},{"Nature":"good","Language":"C","xhtml:div":{"xhtml:br":[{},{},{},{},{}],"xhtml:div":{"style":"margin-left:10px;","xhtml:div":{"xhtml:div":[{"style":"margin-left:10px;","xhtml:br":[{},{},{}],"xhtml:i":"//Break never reached because of exit()"},{"style":"margin-left:10px;","xhtml:br":{}},{"style":"margin-left:10px;","xhtml:br":{}}],"xhtml:br":[{},{}]}}}}],"Body_Text":["Instead a default label should be used for unaccounted conditions:","This label is used because the assumption cannot be made that all possible cases are accounted for. A good practice is to reserve the default case for error handling."]},{"Intro_Text":"In the following Java example the method getInterestRate retrieves the interest rate for the number of points for a mortgage. The number of points is provided within the input parameter and a switch statement will set the interest rate value to be returned based on the number of points.","Example_Code":[{"Nature":"bad","Language":"Java","xhtml:div":{"xhtml:br":[{},{},{},{}],"xhtml:div":{"style":"margin-left:10px;","xhtml:div":{"xhtml:br":[{},{},{}],"xhtml:div":{"style":"margin-left:10px;","xhtml:div":{"xhtml:div":[{"style":"margin-left:10px;","xhtml:br":{}},{"style":"margin-left:10px;","xhtml:br":{}},{"style":"margin-left:10px;","xhtml:br":{}}],"xhtml:br":[{},{}]}}}}}},{"Nature":"good","Language":"Java","xhtml:div":{"xhtml:br":[{},{},{},{}],"xhtml:div":{"style":"margin-left:10px;","xhtml:div":{"xhtml:br":[{},{},{},{}],"xhtml:div":{"style":"margin-left:10px;","xhtml:div":{"xhtml:div":[{"style":"margin-left:10px;","xhtml:br":{}},{"style":"margin-left:10px;","xhtml:br":{}},{"style":"margin-left:10px;","xhtml:br":{}},{"style":"margin-left:10px;","xhtml:br":[{},{}]}],"xhtml:br":[{},{},{}]}}}}}}],"Body_Text":"However, this code assumes that the value of the points input parameter will always be 0, 1 or 2 and does not check for other incorrect values passed to the method. This can be easily accomplished by providing a default label in the switch statement that outputs an error message indicating an invalid value for the points input parameter and returning a null value."}]},"Taxonomy_Mappings":{"Taxonomy_Mapping":[{"Taxonomy_Name":"CLASP","Entry_Name":"Failure to account for default case in switch"},{"Taxonomy_Name":"Software Fault Patterns","Entry_ID":"SFP4","Entry_Name":"Unchecked Status Condition"}]},"References":{"Reference":[{"External_Reference_ID":"REF-18"},{"External_Reference_ID":"REF-62","Section":"Chapter 7, \\"Switch Statements\\", Page 337"}]},"Content_History":{"Submission":{"Submission_Name":"CLASP","Submission_Date":"2006-07-19"},"Modification":[{"Modification_Name":"Eric Dalci","Modification_Organization":"Cigital","Modification_Date":"2008-07-01","Modification_Comment":"updated Time_of_Introduction"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2008-09-08","Modification_Comment":"updated Applicable_Platforms, Common_Consequences, Description, Relationships, Other_Notes, Taxonomy_Mappings, Weakness_Ordinalities"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2009-05-27","Modification_Comment":"updated Description, Name"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2010-06-21","Modification_Comment":"updated Demonstrative_Examples"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-03-29","Modification_Comment":"updated Demonstrative_Examples"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-06-01","Modification_Comment":"updated Common_Consequences"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-06-27","Modification_Comment":"updated Common_Consequences"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2012-05-11","Modification_Comment":"updated References, Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2014-06-23","Modification_Comment":"updated Description, Other_Notes, Potential_Mitigations"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2014-07-30","Modification_Comment":"updated Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2017-11-08","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2018-03-27","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2019-01-03","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-02-24","Modification_Comment":"updated References, Relationships, Type"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-08-20","Modification_Comment":"updated Relationships"}],"Previous_Entry_Name":[{"Date":"2008-04-11","$t":"Failure to Account for Default Case in Switch"},{"Date":"2009-05-27","$t":"Failure to Use Default Case in Switch"}]}},{"ID":"479","Name":"Signal Handler Use of a Non-reentrant Function","Abstraction":"Variant","Structure":"Simple","Status":"Draft","Description":"The program defines a signal handler that calls a non-reentrant function.","Extended_Description":{"xhtml:p":["Non-reentrant functions are functions that cannot safely be called, interrupted, and then recalled before the first call has finished without resulting in memory corruption. This can lead to an unexpected system state and unpredictable results with a variety of potential consequences depending on context, including denial of service and code execution.","Many functions are not reentrant, but some of them can result in the corruption of memory if they are used in a signal handler. The function call syslog() is an example of this. In order to perform its functionality, it allocates a small amount of memory as \\"scratch space.\\" If syslog() is suspended by a signal call and the signal handler calls syslog(), the memory used by both of these functions enters an undefined, and possibly, exploitable state. Implementations of malloc() and free() manage metadata in global structures in order to track which memory is allocated versus which memory is available, but they are non-reentrant. Simultaneous calls to these functions can cause corruption of the metadata."]},"Related_Weaknesses":{"Related_Weakness":[{"Nature":"ChildOf","CWE_ID":"828","View_ID":"1000","Ordinal":"Primary"},{"Nature":"ChildOf","CWE_ID":"663","View_ID":"1000"},{"Nature":"CanPrecede","CWE_ID":"123","View_ID":"1000"}]},"Applicable_Platforms":{"Language":[{"Name":"C","Prevalence":"Undetermined"},{"Name":"C++","Prevalence":"Undetermined"}]},"Modes_Of_Introduction":{"Introduction":[{"Phase":"Architecture and Design"},{"Phase":"Implementation"}]},"Likelihood_Of_Exploit":"Low","Common_Consequences":{"Consequence":[{"Scope":["Integrity","Confidentiality","Availability"],"Impact":"Execute Unauthorized Code or Commands","Note":"It may be possible to execute arbitrary code through the use of a write-what-where condition."},{"Scope":"Integrity","Impact":"Modify Application Data","Note":"Signal race conditions often result in data corruption."}]},"Potential_Mitigations":{"Mitigation":[{"Phase":"Requirements","Description":"Require languages or libraries that provide reentrant functionality, or otherwise make it easier to avoid this weakness."},{"Phase":"Architecture and Design","Description":"Design signal handlers to only set flags rather than perform complex functionality."},{"Phase":"Implementation","Description":"Ensure that non-reentrant functions are not found in signal handlers."},{"Phase":"Implementation","Description":"Use sanity checks to reduce the timing window for exploitation of race conditions. This is only a partial solution, since many attacks might fail, but other attacks still might work within the narrower window, even accidentally.","Effectiveness":"Defense in Depth"}]},"Demonstrative_Examples":{"Demonstrative_Example":{"Intro_Text":"In this example, a signal handler uses syslog() to log a message:","Example_Code":{"Nature":"bad","xhtml:div":{"$t":"char *message;void sh(int dummy) {}int main(int argc,char* argv[]) {}","xhtml:br":[{},{}],"xhtml:div":[{"style":"margin-left:10px;","xhtml:br":[{},{}]},{"style":"margin-left:10px;","xhtml:br":[{},{},{},{}]},"If the execution of the first call to the signal handler is suspended after invoking syslog(), and the signal handler is called a second time, the memory allocated by syslog() enters an undefined, and possibly, exploitable state."]}}}},"Observed_Examples":{"Observed_Example":[{"Reference":"CVE-2005-0893","Description":"signal handler calls function that ultimately uses malloc()","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2005-0893"},{"Reference":"CVE-2004-2259","Description":"SIGCHLD signal to FTP server can cause crash under heavy load while executing non-reentrant functions like malloc/free.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2004-2259"}]},"Affected_Resources":{"Affected_Resource":"System Process"},"Taxonomy_Mappings":{"Taxonomy_Mapping":[{"Taxonomy_Name":"CLASP","Entry_Name":"Unsafe function call from a signal handler"},{"Taxonomy_Name":"CERT C Secure Coding","Entry_ID":"SIG30-C","Entry_Name":"Call only asynchronous-safe functions within signal handlers","Mapping_Fit":"Exact"},{"Taxonomy_Name":"CERT C Secure Coding","Entry_ID":"SIG34-C","Entry_Name":"Do not call signal() from within interruptible signal handlers"},{"Taxonomy_Name":"The CERT Oracle Secure Coding Standard for Java (2011)","Entry_ID":"EXP01-J","Entry_Name":"Never dereference null pointers"},{"Taxonomy_Name":"Software Fault Patterns","Entry_ID":"SFP3","Entry_Name":"Use of an improper API"}]},"References":{"Reference":[{"External_Reference_ID":"REF-18"},{"External_Reference_ID":"REF-62","Section":"Chapter 13, \\"Signal Vulnerabilities\\", Page 791"}]},"Content_History":{"Submission":{"Submission_Name":"CLASP","Submission_Date":"2006-07-19"},"Modification":[{"Modification_Name":"Eric Dalci","Modification_Organization":"Cigital","Modification_Date":"2008-07-01","Modification_Comment":"updated Time_of_Introduction"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2008-09-08","Modification_Comment":"updated Applicable_Platforms, Common_Consequences, Description, Relationships, Other_Notes, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2008-11-24","Modification_Comment":"updated Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2010-09-27","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2010-12-13","Modification_Comment":"updated Demonstrative_Examples, Description, Name, Observed_Examples, Other_Notes, Potential_Mitigations, Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-06-01","Modification_Comment":"updated Common_Consequences, Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-06-27","Modification_Comment":"updated Common_Consequences"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-09-13","Modification_Comment":"updated Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2012-05-11","Modification_Comment":"updated References, Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2012-10-30","Modification_Comment":"updated Demonstrative_Examples"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2014-07-30","Modification_Comment":"updated Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2017-11-08","Modification_Comment":"updated Observed_Examples, Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2019-01-03","Modification_Comment":"updated Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-02-24","Modification_Comment":"updated Description, References, Relationships"}],"Previous_Entry_Name":{"Date":"2010-12-13","$t":"Unsafe Function Call from a Signal Handler"}}},{"ID":"480","Name":"Use of Incorrect Operator","Abstraction":"Base","Structure":"Simple","Status":"Draft","Description":"The programmer accidentally uses the wrong operator, which changes the application logic in security-relevant ways.","Extended_Description":"These types of errors are generally the result of a typo.","Related_Weaknesses":{"Related_Weakness":{"Nature":"ChildOf","CWE_ID":"670","View_ID":"1000","Ordinal":"Primary"}},"Applicable_Platforms":{"Language":[{"Name":"C","Prevalence":"Sometimes"},{"Name":"C++","Prevalence":"Sometimes"},{"Name":"Perl","Prevalence":"Sometimes"},{"Class":"Language-Independent","Prevalence":"Undetermined"}]},"Modes_Of_Introduction":{"Introduction":{"Phase":"Implementation"}},"Likelihood_Of_Exploit":"Low","Common_Consequences":{"Consequence":{"Scope":"Other","Impact":"Alter Execution Logic","Note":"This weakness can cause unintended logic to be executed and other unexpected application behavior."}},"Detection_Methods":{"Detection_Method":[{"Method":"Automated Static Analysis","Description":"This weakness can be found easily using static analysis. However in some cases an operator might appear to be incorrect, but is actually correct and reflects unusual logic within the program."},{"Method":"Manual Static Analysis","Description":"This weakness can be found easily using static analysis. However in some cases an operator might appear to be incorrect, but is actually correct and reflects unusual logic within the program."}]},"Demonstrative_Examples":{"Demonstrative_Example":[{"Demonstrative_Example_ID":"DX-102","Intro_Text":"The following C/C++ and C# examples attempt to validate an int input parameter against the integer value 100.","Example_Code":[{"Nature":"bad","Language":"C","xhtml:div":{"xhtml:div":{"style":"margin-left:10px;","xhtml:div":{"style":"margin-left:10px;","xhtml:br":{}},"xhtml:br":[{},{}]}}},{"Nature":"bad","Language":"C#","xhtml:div":{"xhtml:div":{"style":"margin-left:10px;","xhtml:div":{"style":"margin-left:10px;","xhtml:br":{}},"xhtml:br":[{},{}]}}}],"Body_Text":"However, the expression to be evaluated in the if statement uses the assignment operator \\"=\\" rather than the comparison operator \\"==\\". The result of using the assignment operator instead of the comparison operator causes the int variable to be reassigned locally and the expression in the if statement will always evaluate to the value on the right hand side of the expression. This will result in the input value not being properly validated, which can cause unexpected results."},{"Demonstrative_Example_ID":"DX-103","Intro_Text":"The following C/C++ example shows a simple implementation of a stack that includes methods for adding and removing integer values from the stack. The example uses pointers to add and remove integer values to the stack array variable.","Example_Code":{"Nature":"bad","Language":"C","xhtml:div":{"xhtml:br":[{},{},{},{},{},{},{}],"xhtml:div":[{"style":"margin-left:10px;","xhtml:div":{"xhtml:br":[{},{}],"xhtml:div":{"style":"margin-left:10px;","xhtml:div":{"xhtml:br":[{},{}],"xhtml:i":"// Print stack overflow error message and exit"}}}},{"style":"margin-left:10px;","xhtml:div":{"xhtml:div":{"style":"margin-left:10px;","xhtml:div":{"xhtml:br":[{},{}],"xhtml:i":"// Print stack underflow error message and exit"}},"xhtml:br":[{},{}]}},{"style":"margin-left:10px;","xhtml:div":{"xhtml:br":[{},{},{},{},{},{}],"xhtml:i":["// initialize tos and p1 to point to the top of stack","// code to add and remove items from stack"]}}]}},"Body_Text":["The push method includes an expression to assign the integer value to the location in the stack pointed to by the pointer variable.","However, this expression uses the comparison operator \\"==\\" rather than the assignment operator \\"=\\". The result of using the comparison operator instead of the assignment operator causes erroneous values to be entered into the stack and can cause unexpected results."]}]},"Taxonomy_Mappings":{"Taxonomy_Mapping":[{"Taxonomy_Name":"CLASP","Entry_Name":"Using the wrong operator"},{"Taxonomy_Name":"CERT C Secure Coding","Entry_ID":"EXP45-C","Entry_Name":"Do not perform assignments in selection statements","Mapping_Fit":"CWE More Abstract"},{"Taxonomy_Name":"CERT C Secure Coding","Entry_ID":"EXP46-C","Entry_Name":"Do not use a bitwise operator with a Boolean-like operand","Mapping_Fit":"CWE More Abstract"},{"Taxonomy_Name":"Software Fault Patterns","Entry_ID":"SFP1","Entry_Name":"Glitch in Computation"}]},"References":{"Reference":[{"External_Reference_ID":"REF-18"},{"External_Reference_ID":"REF-62","Section":"Chapter 6, \\"Typos\\", Page 289"}]},"Content_History":{"Submission":{"Submission_Name":"CLASP","Submission_Date":"2006-07-19"},"Modification":[{"Modification_Name":"Eric Dalci","Modification_Organization":"Cigital","Modification_Date":"2008-07-01","Modification_Comment":"updated Time_of_Introduction"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2008-09-08","Modification_Comment":"updated Applicable_Platforms, Relationships, Other_Notes, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2008-10-14","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2008-11-24","Modification_Comment":"updated Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-06-01","Modification_Comment":"updated Common_Consequences, Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-09-13","Modification_Comment":"updated Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2012-05-11","Modification_Comment":"updated Common_Consequences, References, Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2012-10-30","Modification_Comment":"updated Demonstrative_Examples, Potential_Mitigations"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2014-06-23","Modification_Comment":"updated Applicable_Platforms, Description, Detection_Factors, Other_Notes"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2014-07-30","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2017-11-08","Modification_Comment":"updated Demonstrative_Examples, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2019-01-03","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-02-24","Modification_Comment":"updated References, Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-08-20","Modification_Comment":"updated Relationships"}],"Previous_Entry_Name":{"Date":"2008-04-11","$t":"Using the Wrong Operator"}}},{"ID":"481","Name":"Assigning instead of Comparing","Abstraction":"Variant","Structure":"Simple","Status":"Draft","Description":"The code uses an operator for assignment when the intention was to perform a comparison.","Extended_Description":"In many languages the compare statement is very close in appearance to the assignment statement and are often confused. This bug is generally the result of a typo and usually causes obvious problems with program execution. If the comparison is in an if statement, the if statement will usually evaluate the value of the right-hand side of the predicate.","Related_Weaknesses":{"Related_Weakness":[{"Nature":"ChildOf","CWE_ID":"480","View_ID":"1000","Ordinal":"Primary"},{"Nature":"CanPrecede","CWE_ID":"697","View_ID":"1000"}]},"Applicable_Platforms":{"Language":[{"Name":"C","Prevalence":"Undetermined"},{"Name":"C++","Prevalence":"Undetermined"},{"Name":"Java","Prevalence":"Undetermined"},{"Name":"C#","Prevalence":"Undetermined"}]},"Modes_Of_Introduction":{"Introduction":{"Phase":"Implementation"}},"Likelihood_Of_Exploit":"Low","Common_Consequences":{"Consequence":{"Scope":"Other","Impact":"Alter Execution Logic"}},"Potential_Mitigations":{"Mitigation":[{"Phase":"Testing","Description":"Many IDEs and static analysis products will detect this problem."},{"Phase":"Implementation","Description":"Place constants on the left. If one attempts to assign a constant with a variable, the compiler will of course produce an error."}]},"Demonstrative_Examples":{"Demonstrative_Example":[{"Demonstrative_Example_ID":"DX-102","Intro_Text":"The following C/C++ and C# examples attempt to validate an int input parameter against the integer value 100.","Example_Code":[{"Nature":"bad","Language":"C","xhtml:div":{"xhtml:div":{"style":"margin-left:10px;","xhtml:div":{"style":"margin-left:10px;","xhtml:br":{}},"xhtml:br":[{},{}]}}},{"Nature":"bad","Language":"C#","xhtml:div":{"xhtml:div":{"style":"margin-left:10px;","xhtml:div":{"style":"margin-left:10px;","xhtml:br":{}},"xhtml:br":[{},{}]}}}],"Body_Text":"However, the expression to be evaluated in the if statement uses the assignment operator \\"=\\" rather than the comparison operator \\"==\\". The result of using the assignment operator instead of the comparison operator causes the int variable to be reassigned locally and the expression in the if statement will always evaluate to the value on the right hand side of the expression. This will result in the input value not being properly validated, which can cause unexpected results."},{"Intro_Text":"In this example, we show how assigning instead of comparing can impact code when values are being passed by reference instead of by value. Consider a scenario in which a string is being processed from user input. Assume the string has already been formatted such that different user inputs are concatenated with the colon character. When the processString function is called, the test for the colon character will result in an insertion of the colon character instead, adding new input separators. Since the string was passed by reference, the data sentinels will be inserted in the original string (CWE-464), and further processing of the inputs will be altered, possibly malformed..","Example_Code":{"Nature":"bad","Language":"C","xhtml:div":{"$t":"void processString (char *str) {}","xhtml:div":{"style":"margin-left:10px;","$t":"","xhtml:div":{"$t":"int i;\\n                           for(i=0; i<strlen(str); i++) {}","xhtml:br":[{},{}],"xhtml:div":{"style":"margin-left:10px;","$t":"if (isalnum(str[i])){}else if (str[i] = \':\') {}","xhtml:div":[{"style":"margin-left:10px;","$t":"processChar(str[i]);"},{"style":"margin-left:10px;","$t":"movingToNewInput();}"}],"xhtml:br":{}}}}}}},{"Intro_Text":"The following Java example attempts to perform some processing based on the boolean value of the input parameter. However, the expression to be evaluated in the if statement uses the assignment operator \\"=\\" rather than the comparison operator \\"==\\". As with the previous examples, the variable will be reassigned locally and the expression in the if statement will evaluate to true and unintended processing may occur.","Example_Code":[{"Nature":"bad","Language":"Java","xhtml:div":{"xhtml:div":{"style":"margin-left:10px;","xhtml:div":[{"style":"margin-left:10px;","xhtml:br":{}},{"style":"margin-left:10px;","xhtml:br":{}}],"xhtml:br":{}}}},{"Nature":"good","Language":"Java","xhtml:div":{"xhtml:div":{"style":"margin-left:10px;","xhtml:div":[{"style":"margin-left:10px;","xhtml:br":{}},{"style":"margin-left:10px;","xhtml:br":{}}],"xhtml:br":{}}}},{"Nature":"good","Language":"Java","xhtml:div":{"xhtml:div":{"style":"margin-left:10px;","xhtml:div":{"style":"margin-left:10px;","xhtml:br":{}},"xhtml:br":[{},{}]}}}],"Body_Text":["While most Java compilers will catch the use of an assignment operator when a comparison operator is required, for boolean variables in Java the use of the assignment operator within an expression is allowed. If possible, try to avoid using comparison operators on boolean variables in java. Instead, let the values of the variables stand for themselves, as in the following code.","Alternatively, to test for false, just use the boolean NOT operator."]},{"Intro_Text":"The following example demonstrates the weakness.","Example_Code":{"Nature":"bad","Language":"C","xhtml:div":{"xhtml:div":[{"style":"margin-left:10px;","$t":"if (foo=1) printf(\\"foo\\\\n\\");"},{"style":"margin-left:10px;","xhtml:div":{"xhtml:br":[{},{}]}}],"xhtml:br":{}}}}]},"Taxonomy_Mappings":{"Taxonomy_Mapping":[{"Taxonomy_Name":"CLASP","Entry_Name":"Assigning instead of comparing"},{"Taxonomy_Name":"Software Fault Patterns","Entry_ID":"SFP1","Entry_Name":"Glitch in computation"},{"Taxonomy_Name":"CERT C Secure Coding","Entry_ID":"EXP45-C","Entry_Name":"Do not perform assignments in selection statements","Mapping_Fit":"CWE More Abstract"}]},"References":{"Reference":[{"External_Reference_ID":"REF-18"},{"External_Reference_ID":"REF-62","Section":"Chapter 6, \\"Typos\\", Page 289"}]},"Content_History":{"Submission":{"Submission_Name":"CLASP","Submission_Date":"2006-07-19"},"Modification":[{"Modification_Name":"Eric Dalci","Modification_Organization":"Cigital","Modification_Date":"2008-07-01","Modification_Comment":"updated Time_of_Introduction"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2008-09-08","Modification_Comment":"updated Applicable_Platforms, Description, Relationships, Other_Notes, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2009-05-27","Modification_Comment":"updated Demonstrative_Examples"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2009-07-27","Modification_Comment":"updated Description, Other_Notes"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-06-01","Modification_Comment":"updated Common_Consequences"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2012-05-11","Modification_Comment":"updated References, Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2012-10-30","Modification_Comment":"updated Demonstrative_Examples, Potential_Mitigations"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2014-07-30","Modification_Comment":"updated Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2017-01-19","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2017-11-08","Modification_Comment":"updated Demonstrative_Examples, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2019-01-03","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-02-24","Modification_Comment":"updated References, Relationships"}]}},{"ID":"482","Name":"Comparing instead of Assigning","Abstraction":"Variant","Structure":"Simple","Status":"Draft","Description":"The code uses an operator for comparison when the intention was to perform an assignment.","Extended_Description":"In many languages, the compare statement is very close in appearance to the assignment statement; they are often confused.","Related_Weaknesses":{"Related_Weakness":{"Nature":"ChildOf","CWE_ID":"480","View_ID":"1000","Ordinal":"Primary"}},"Applicable_Platforms":{"Language":[{"Name":"C","Prevalence":"Undetermined"},{"Name":"C++","Prevalence":"Undetermined"}]},"Modes_Of_Introduction":{"Introduction":{"Phase":"Implementation","Note":"This bug primarily originates from a typo."}},"Likelihood_Of_Exploit":"Low","Common_Consequences":{"Consequence":{"Scope":["Availability","Integrity"],"Impact":"Unexpected State","Note":"The assignment will not take place, which should cause obvious program execution problems."}},"Potential_Mitigations":{"Mitigation":{"Phase":"Testing","Description":"Many IDEs and static analysis products will detect this problem."}},"Demonstrative_Examples":{"Demonstrative_Example":[{"Intro_Text":"The following example demonstrates the weakness.","Example_Code":{"Nature":"bad","Language":"Java","xhtml:div":{"xhtml:div":[{"style":"margin-left:10px;","xhtml:br":{}},{"style":"margin-left:10px;","xhtml:div":{"xhtml:br":[{},{}]}}],"xhtml:br":{}}}},{"Demonstrative_Example_ID":"DX-103","Intro_Text":"The following C/C++ example shows a simple implementation of a stack that includes methods for adding and removing integer values from the stack. The example uses pointers to add and remove integer values to the stack array variable.","Example_Code":{"Nature":"bad","Language":"C","xhtml:div":{"xhtml:br":[{},{},{},{},{},{},{}],"xhtml:div":[{"style":"margin-left:10px;","xhtml:div":{"xhtml:br":[{},{}],"xhtml:div":{"style":"margin-left:10px;","xhtml:div":{"xhtml:br":[{},{}],"xhtml:i":"// Print stack overflow error message and exit"}}}},{"style":"margin-left:10px;","xhtml:div":{"xhtml:div":{"style":"margin-left:10px;","xhtml:div":{"xhtml:br":[{},{}],"xhtml:i":"// Print stack underflow error message and exit"}},"xhtml:br":[{},{}]}},{"style":"margin-left:10px;","xhtml:div":{"xhtml:br":[{},{},{},{},{},{}],"xhtml:i":["// initialize tos and p1 to point to the top of stack","// code to add and remove items from stack"]}}]}},"Body_Text":["The push method includes an expression to assign the integer value to the location in the stack pointed to by the pointer variable.","However, this expression uses the comparison operator \\"==\\" rather than the assignment operator \\"=\\". The result of using the comparison operator instead of the assignment operator causes erroneous values to be entered into the stack and can cause unexpected results."]}]},"Taxonomy_Mappings":{"Taxonomy_Mapping":[{"Taxonomy_Name":"CLASP","Entry_Name":"Comparing instead of assigning"},{"Taxonomy_Name":"Software Fault Patterns","Entry_ID":"SFP2","Entry_Name":"Unused Entities"}]},"References":{"Reference":[{"External_Reference_ID":"REF-18"},{"External_Reference_ID":"REF-62","Section":"Chapter 6, \\"Typos\\", Page 289"}]},"Content_History":{"Submission":{"Submission_Name":"CLASP","Submission_Date":"2006-07-19"},"Modification":[{"Modification_Name":"Eric Dalci","Modification_Organization":"Cigital","Modification_Date":"2008-07-01","Modification_Comment":"updated Time_of_Introduction"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2008-09-08","Modification_Comment":"updated Applicable_Platforms, Description, Relationships, Other_Notes, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2008-11-24","Modification_Comment":"updated Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2009-07-27","Modification_Comment":"updated Common_Consequences, Modes_of_Introduction"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2009-10-29","Modification_Comment":"updated Other_Notes"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-06-01","Modification_Comment":"updated Common_Consequences"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-06-27","Modification_Comment":"updated Common_Consequences"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-09-13","Modification_Comment":"updated Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2012-05-11","Modification_Comment":"updated References, Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2012-10-30","Modification_Comment":"updated Demonstrative_Examples, Potential_Mitigations"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2014-07-30","Modification_Comment":"updated Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2017-01-19","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2017-11-08","Modification_Comment":"updated Demonstrative_Examples, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-02-24","Modification_Comment":"updated References, Relationships"}]}},{"ID":"483","Name":"Incorrect Block Delimitation","Abstraction":"Base","Structure":"Simple","Status":"Draft","Description":"The code does not explicitly delimit a block that is intended to contain 2 or more statements, creating a logic error.","Extended_Description":"In some languages, braces (or other delimiters) are optional for blocks. When the delimiter is omitted, it is possible to insert a logic error in which a statement is thought to be in a block but is not. In some cases, the logic error can have security implications.","Related_Weaknesses":{"Related_Weakness":{"Nature":"ChildOf","CWE_ID":"670","View_ID":"1000","Ordinal":"Primary"}},"Weakness_Ordinalities":{"Weakness_Ordinality":[{"Ordinality":"Primary"},{"Ordinality":"Indirect"}]},"Applicable_Platforms":{"Language":[{"Name":"C","Prevalence":"Sometimes"},{"Name":"C++","Prevalence":"Sometimes"}]},"Modes_Of_Introduction":{"Introduction":{"Phase":"Implementation"}},"Likelihood_Of_Exploit":"Low","Common_Consequences":{"Consequence":{"Scope":["Confidentiality","Integrity","Availability"],"Impact":"Alter Execution Logic","Note":"This is a general logic error which will often lead to obviously-incorrect behaviors that are quickly noticed and fixed. In lightly tested or untested code, this error may be introduced it into a production environment and provide additional attack vectors by creating a control flow path leading to an unexpected state in the application. The consequences will depend on the types of behaviors that are being incorrectly executed."}},"Potential_Mitigations":{"Mitigation":{"Phase":"Implementation","Description":"Always use explicit block delimitation and use static-analysis technologies to enforce this practice."}},"Demonstrative_Examples":{"Demonstrative_Example":[{"Intro_Text":"In this example, the programmer has indented the statements to call Do_X() and Do_Y(), as if the intention is that these functions are only called when the condition is true. However, because there are no braces to signify the block, Do_Y() will always be executed, even if the condition is false.","Example_Code":{"Nature":"bad","Language":"C","xhtml:div":{"xhtml:div":{"style":"margin-left:10px;","xhtml:br":{}}}},"Body_Text":"This might not be what the programmer intended. When the condition is critical for security, such as in making a security decision or detecting a critical error, this may produce a vulnerability."},{"Intro_Text":"In this example, the programmer has indented the Do_Y() statement as if the intention is that the function should be associated with the preceding conditional and should only be called when the condition is true. However, because Do_X() was called on the same line as the conditional and there are no braces to signify the block, Do_Y() will always be executed, even if the condition is false.","Example_Code":{"Nature":"bad","Language":"C","xhtml:div":{"$t":"if (condition==true) Do_X();","xhtml:div":{"style":"margin-left:10px;","$t":"Do_Y();"}}},"Body_Text":"This might not be what the programmer intended. When the condition is critical for security, such as in making a security decision or detecting a critical error, this may produce a vulnerability."}]},"Observed_Examples":{"Observed_Example":{"Reference":"CVE-2014-1266","Description":"incorrect indentation of \\"goto\\" statement makes it more difficult to detect an incorrect goto (Apple\'s \\"goto fail\\")","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2014-1266"}},"Taxonomy_Mappings":{"Taxonomy_Mapping":{"Taxonomy_Name":"CLASP","Entry_Name":"Incorrect block delimitation"}},"References":{"Reference":{"External_Reference_ID":"REF-18"}},"Content_History":{"Submission":{"Submission_Name":"CLASP","Submission_Date":"2006-07-19"},"Modification":[{"Modification_Name":"Eric Dalci","Modification_Organization":"Cigital","Modification_Date":"2008-07-01","Modification_Comment":"updated Time_of_Introduction"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2008-09-08","Modification_Comment":"updated Applicable_Platforms, Common_Consequences, Description, Relationships, Other_Notes, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2009-05-27","Modification_Comment":"updated Demonstrative_Examples"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2009-10-29","Modification_Comment":"updated Common_Consequences"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2010-06-21","Modification_Comment":"updated Demonstrative_Examples, Description, Other_Notes"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-06-01","Modification_Comment":"updated Common_Consequences"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-06-27","Modification_Comment":"updated Common_Consequences"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2012-05-11","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2014-06-23","Modification_Comment":"updated Observed_Examples"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2014-07-30","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2017-11-08","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2019-01-03","Modification_Comment":"updated Weakness_Ordinalities"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-02-24","Modification_Comment":"updated References, Relationships, Type"}],"Contribution":{"Type":"Feedback","Contribution_Name":"Michael Koo and Paul Black","Contribution_Organization":"NIST","Contribution_Date":"2010-04-28","Contribution_Comment":"Correction to Demonstrative Examples"}}},{"ID":"484","Name":"Omitted Break Statement in Switch","Abstraction":"Base","Structure":"Simple","Status":"Draft","Description":"The program omits a break statement within a switch or similar construct, causing code associated with multiple conditions to execute. This can cause problems when the programmer only intended to execute code associated with one condition.","Extended_Description":"This can lead to critical code executing in situations where it should not.","Related_Weaknesses":{"Related_Weakness":[{"Nature":"ChildOf","CWE_ID":"710","View_ID":"1000","Ordinal":"Primary"},{"Nature":"ChildOf","CWE_ID":"670","View_ID":"1000"}]},"Weakness_Ordinalities":{"Weakness_Ordinality":[{"Ordinality":"Primary"},{"Ordinality":"Indirect"}]},"Applicable_Platforms":{"Language":[{"Name":"C","Prevalence":"Undetermined"},{"Name":"C++","Prevalence":"Undetermined"},{"Name":"Java","Prevalence":"Undetermined"},{"Name":"C#","Prevalence":"Undetermined"},{"Name":"PHP","Prevalence":"Undetermined"}]},"Modes_Of_Introduction":{"Introduction":{"Phase":"Implementation"}},"Likelihood_Of_Exploit":"Medium","Common_Consequences":{"Consequence":{"Scope":"Other","Impact":"Alter Execution Logic","Note":"This weakness can cause unintended logic to be executed and other unexpected application behavior."}},"Detection_Methods":{"Detection_Method":[{"Method":"White Box","Description":"Omission of a break statement might be intentional, in order to support fallthrough. Automated detection methods might therefore be erroneous. Semantic understanding of expected program behavior is required to interpret whether the code is correct."},{"Method":"Black Box","Description":"Since this weakness is associated with a code construct, it would be indistinguishable from other errors that produce the same behavior."}]},"Potential_Mitigations":{"Mitigation":[{"Phase":"Implementation","Description":"Omitting a break statement so that one may fall through is often indistinguishable from an error, and therefore should be avoided. If you need to use fall-through capabilities, make sure that you have clearly documented this within the switch statement, and ensure that you have examined all the logical possibilities."},{"Phase":"Implementation","Description":"The functionality of omitting a break statement could be clarified with an if statement. This method is much safer."}]},"Demonstrative_Examples":{"Demonstrative_Example":{"Intro_Text":"In both of these examples, a message is printed based on the month passed into the function:","Example_Code":[{"Nature":"bad","Language":"Java","xhtml:div":{"xhtml:div":{"style":"margin-left:10px;","xhtml:div":{"xhtml:div":{"style":"margin-left:10px;","xhtml:div":{"xhtml:br":[{},{},{},{},{},{},{},{},{},{},{},{}]}},"xhtml:br":{}}}}},{"Nature":"bad","Language":"C","xhtml:div":{"xhtml:div":{"style":"margin-left:10px;","xhtml:div":{"xhtml:div":{"style":"margin-left:10px;","xhtml:div":{"xhtml:br":[{},{},{},{},{},{},{},{},{},{},{},{}]}},"xhtml:br":{}}}}}],"Body_Text":"Both examples do not use a break statement after each case, which leads to unintended fall-through behavior. For example, calling \\"printMessage(10)\\" will result in the text \\"OctoberNovemberDecember is a great month\\" being printed."}},"Taxonomy_Mappings":{"Taxonomy_Mapping":[{"Taxonomy_Name":"CLASP","Entry_Name":"Omitted break statement"},{"Taxonomy_Name":"Software Fault Patterns","Entry_ID":"SFP4","Entry_Name":"Unchecked Status Condition"}]},"References":{"Reference":[{"External_Reference_ID":"REF-18"},{"External_Reference_ID":"REF-62","Section":"Chapter 7, \\"Switch Statements\\", Page 337"}]},"Content_History":{"Submission":{"Submission_Name":"CLASP","Submission_Date":"2006-07-19"},"Modification":[{"Modification_Name":"Eric Dalci","Modification_Organization":"Cigital","Modification_Date":"2008-07-01","Modification_Comment":"updated Time_of_Introduction"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2008-09-08","Modification_Comment":"updated Applicable_Platforms, Description, Detection_Factors, Relationships, Other_Notes, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2008-11-24","Modification_Comment":"updated Applicable_Platforms, Demonstrative_Examples, Description, Detection_Factors, Name, Other_Notes, Potential_Mitigations, Weakness_Ordinalities"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-06-01","Modification_Comment":"updated Common_Consequences, Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2012-05-11","Modification_Comment":"updated Common_Consequences, References, Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2012-10-30","Modification_Comment":"updated Demonstrative_Examples"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2014-07-30","Modification_Comment":"updated Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2017-11-08","Modification_Comment":"updated Demonstrative_Examples, Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2019-01-03","Modification_Comment":"updated Weakness_Ordinalities"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-02-24","Modification_Comment":"updated References, Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-08-20","Modification_Comment":"updated Relationships"}],"Previous_Entry_Name":{"Date":"2008-11-24","$t":"Omitted Break Statement"}}},{"ID":"495","Name":"Private Data Structure Returned From A Public Method","Abstraction":"Variant","Structure":"Simple","Status":"Draft","Description":"The product has a method that is declared public, but returns a reference to a private data structure, which could then be modified in unexpected ways.","Related_Weaknesses":{"Related_Weakness":{"Nature":"ChildOf","CWE_ID":"664","View_ID":"1000","Ordinal":"Primary"}},"Applicable_Platforms":{"Language":[{"Name":"C","Prevalence":"Undetermined"},{"Name":"C++","Prevalence":"Undetermined"},{"Name":"Java","Prevalence":"Undetermined"},{"Name":"C#","Prevalence":"Undetermined"}]},"Modes_Of_Introduction":{"Introduction":{"Phase":"Implementation"}},"Common_Consequences":{"Consequence":{"Scope":"Integrity","Impact":"Modify Application Data","Note":"The contents of the data structure can be modified from outside the intended scope."}},"Potential_Mitigations":{"Mitigation":[{"Phase":"Implementation","Description":"Declare the method private."},{"Phase":"Implementation","Description":"Clone the member data and keep an unmodified version of the data private to the object."},{"Phase":"Implementation","Description":"Use public setter methods that govern how a private member can be modified."}]},"Demonstrative_Examples":{"Demonstrative_Example":[{"Intro_Text":"Here, a public method in a Java class returns a reference to a private array. Given that arrays in Java are mutable, any modifications made to the returned reference would be reflected in the original private array.","Example_Code":{"Nature":"bad","Language":"Java","xhtml:div":{"$t":"private String[] colors;public String[] getColors() {}","xhtml:br":{},"xhtml:div":{"style":"margin-left:10px;","$t":"return colors;"}}}},{"Intro_Text":"In this example, the Color class defines functions that return non-const references to private members (an array type and an integer type), which are then arbitrarily altered from outside the control of the class.","Example_Code":{"Nature":"bad","Language":"C++","xhtml:div":{"xhtml:br":[{},{},{},{}],"xhtml:div":[{"style":"margin-left:10px;","xhtml:div":[{"style":"margin-left:10px;","xhtml:br":{}},{"style":"margin-left:10px;","xhtml:br":[{},{}],"xhtml:i":["// return reference to private array","// return reference to private integer"]}]},{"style":"margin-left:10px;","xhtml:br":[{},{},{},{},{}],"xhtml:i":["// modifies private array element","// modifies private int"]}]}}}]},"Taxonomy_Mappings":{"Taxonomy_Mapping":[{"Taxonomy_Name":"7 Pernicious Kingdoms","Entry_Name":"Private Array-Typed Field Returned From A Public Method"},{"Taxonomy_Name":"Software Fault Patterns","Entry_ID":"SFP23","Entry_Name":"Exposed Data"}]},"References":{"Reference":{"External_Reference_ID":"REF-6"}},"Content_History":{"Submission":{"Submission_Name":"7 Pernicious Kingdoms","Submission_Date":"2006-07-19"},"Modification":[{"Modification_Name":"Sean Eidemiller","Modification_Organization":"Cigital","Modification_Date":"2008-07-01","Modification_Comment":"added/updated demonstrative examples"},{"Modification_Name":"Eric Dalci","Modification_Organization":"Cigital","Modification_Date":"2008-07-01","Modification_Comment":"updated Time_of_Introduction"},{"Modification_Organization":"KDM Analytics","Modification_Date":"2008-08-01","Modification_Comment":"added/updated white box definitions"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2008-09-08","Modification_Comment":"updated Applicable_Platforms, Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-06-01","Modification_Comment":"updated Common_Consequences"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2012-05-11","Modification_Comment":"updated Common_Consequences, Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2012-10-30","Modification_Comment":"updated Potential_Mitigations"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2014-07-30","Modification_Comment":"updated Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2017-11-08","Modification_Comment":"updated Relationships, White_Box_Definitions"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2019-01-03","Modification_Comment":"updated Common_Consequences, Demonstrative_Examples, Description, Name, Potential_Mitigations"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-02-24","Modification_Comment":"updated References, Relationships"}],"Previous_Entry_Name":{"Date":"2019-01-03","$t":"Private Array-Typed Field Returned From A Public Method"}}},{"ID":"496","Name":"Public Data Assigned to Private Array-Typed Field","Abstraction":"Variant","Structure":"Simple","Status":"Incomplete","Description":"Assigning public data to a private array is equivalent to giving public access to the array.","Related_Weaknesses":{"Related_Weakness":{"Nature":"ChildOf","CWE_ID":"664","View_ID":"1000","Ordinal":"Primary"}},"Applicable_Platforms":{"Language":[{"Name":"C","Prevalence":"Undetermined"},{"Name":"C++","Prevalence":"Undetermined"},{"Name":"Java","Prevalence":"Undetermined"},{"Name":"C#","Prevalence":"Undetermined"}]},"Modes_Of_Introduction":{"Introduction":{"Phase":"Implementation"}},"Common_Consequences":{"Consequence":{"Scope":"Integrity","Impact":"Modify Application Data","Note":"The contents of the array can be modified from outside the intended scope."}},"Potential_Mitigations":{"Mitigation":{"Phase":"Implementation","Description":"Do not allow objects to modify private members of a class."}},"Demonstrative_Examples":{"Demonstrative_Example":{"Intro_Text":"In the example below, the setRoles() method assigns a publically-controllable array to a private field, thus allowing the caller to modify the private array directly by virtue of the fact that arrays in Java are mutable.","Example_Code":{"Nature":"bad","Language":"Java","xhtml:div":{"$t":"private String[] userRoles;public void setUserRoles(String[] userRoles) {}","xhtml:br":{},"xhtml:div":{"style":"margin-left:10px;","$t":"this.userRoles = userRoles;"}}}}},"Taxonomy_Mappings":{"Taxonomy_Mapping":[{"Taxonomy_Name":"7 Pernicious Kingdoms","Entry_Name":"Public Data Assigned to Private Array-Typed Field"},{"Taxonomy_Name":"Software Fault Patterns","Entry_ID":"SFP25","Entry_Name":"Tainted input to variable"}]},"References":{"Reference":{"External_Reference_ID":"REF-6"}},"Content_History":{"Submission":{"Submission_Name":"7 Pernicious Kingdoms","Submission_Date":"2006-07-19"},"Modification":[{"Modification_Name":"Sean Eidemiller","Modification_Organization":"Cigital","Modification_Date":"2008-07-01","Modification_Comment":"added/updated demonstrative examples"},{"Modification_Name":"Eric Dalci","Modification_Organization":"Cigital","Modification_Date":"2008-07-01","Modification_Comment":"updated Time_of_Introduction"},{"Modification_Organization":"KDM Analytics","Modification_Date":"2008-08-01","Modification_Comment":"added/updated white box definitions"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2008-09-08","Modification_Comment":"updated Applicable_Platforms, Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-06-01","Modification_Comment":"updated Common_Consequences"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2012-05-11","Modification_Comment":"updated Common_Consequences, Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2012-10-30","Modification_Comment":"updated Potential_Mitigations"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2014-07-30","Modification_Comment":"updated Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2017-11-08","Modification_Comment":"updated Relationships, White_Box_Definitions"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-02-24","Modification_Comment":"updated References, Relationships"}]}},{"ID":"558","Name":"Use of getlogin() in Multithreaded Application","Abstraction":"Variant","Structure":"Simple","Status":"Draft","Description":"The application uses the getlogin() function in a multithreaded context, potentially causing it to return incorrect values.","Extended_Description":"The getlogin() function returns a pointer to a string that contains the name of the user associated with the calling process. The function is not reentrant, meaning that if it is called from another process, the contents are not locked out and the value of the string can be changed by another process. This makes it very risky to use because the username can be changed by other processes, so the results of the function cannot be trusted.","Related_Weaknesses":{"Related_Weakness":{"Nature":"ChildOf","CWE_ID":"663","View_ID":"1000","Ordinal":"Primary"}},"Applicable_Platforms":{"Language":[{"Name":"C","Prevalence":"Undetermined"},{"Name":"C++","Prevalence":"Undetermined"}]},"Modes_Of_Introduction":{"Introduction":{"Phase":"Implementation"}},"Common_Consequences":{"Consequence":{"Scope":["Integrity","Access Control","Other"],"Impact":["Modify Application Data","Bypass Protection Mechanism","Other"]}},"Potential_Mitigations":{"Mitigation":[{"Phase":"Architecture and Design","Description":"Using names for security purposes is not advised. Names are easy to forge and can have overlapping user IDs, potentially causing confusion or impersonation."},{"Phase":"Implementation","Description":"Use getlogin_r() instead, which is reentrant, meaning that other processes are locked out from changing the username."}]},"Demonstrative_Examples":{"Demonstrative_Example":{"Intro_Text":"The following code relies on getlogin() to determine whether or not a user is trusted. It is easily subverted.","Example_Code":{"Nature":"bad","Language":"C","xhtml:div":{"$t":"pwd = getpwnam(getlogin());if (isTrustedGroup(pwd->pw_gid)) {} else {}","xhtml:br":{},"xhtml:div":[{"style":"margin-left:10px;","$t":"allow();"},{"style":"margin-left:10px;","$t":"deny();"}]}}}},"Taxonomy_Mappings":{"Taxonomy_Mapping":[{"Taxonomy_Name":"7 Pernicious Kingdoms","Entry_Name":"Often Misused: Authentication"},{"Taxonomy_Name":"Software Fault Patterns","Entry_ID":"SFP3","Entry_Name":"Use of an improper API"}]},"Content_History":{"Submission":{"Submission_Name":"Anonymous Tool Vendor (under NDA)","Submission_Date":"2006-07-19"},"Modification":[{"Modification_Name":"Eric Dalci","Modification_Organization":"Cigital","Modification_Date":"2008-07-01","Modification_Comment":"updated Time_of_Introduction"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2008-09-08","Modification_Comment":"updated Applicable_Platforms, Description, Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2009-05-27","Modification_Comment":"updated Demonstrative_Examples, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-06-01","Modification_Comment":"updated Common_Consequences"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2012-05-11","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2012-10-30","Modification_Comment":"updated Potential_Mitigations"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2014-07-30","Modification_Comment":"updated Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-02-24","Modification_Comment":"updated Relationships"}],"Previous_Entry_Name":{"Date":"2008-04-11","$t":"Misused Authentication: getlogin()"}}},{"ID":"560","Name":"Use of umask() with chmod-style Argument","Abstraction":"Variant","Structure":"Simple","Status":"Draft","Description":"The product calls umask() with an incorrect argument that is specified as if it is an argument to chmod().","Related_Weaknesses":{"Related_Weakness":{"Nature":"ChildOf","CWE_ID":"687","View_ID":"1000","Ordinal":"Primary"}},"Applicable_Platforms":{"Language":{"Name":"C","Prevalence":"Undetermined"}},"Modes_Of_Introduction":{"Introduction":{"Phase":"Implementation"}},"Common_Consequences":{"Consequence":{"Scope":["Confidentiality","Integrity","Access Control"],"Impact":["Read Files or Directories","Modify Files or Directories","Bypass Protection Mechanism"]}},"Potential_Mitigations":{"Mitigation":[{"Phase":"Implementation","Description":"Use umask() with the correct argument."},{"Phase":"Testing","Description":"If you suspect misuse of umask(), you can use grep to spot call instances of umask()."}]},"Notes":{"Note":{"Type":"Other","$t":"The umask() man page begins with the false statement: \\"umask sets the umask to mask & 0777\\" Although this behavior would better align with the usage of chmod(), where the user provided argument specifies the bits to enable on the specified file, the behavior of umask() is in fact opposite: umask() sets the umask to ~mask & 0777. The umask() man page goes on to describe the correct usage of umask(): \\"The umask is used by open() to set initial file permissions on a newly-created file. Specifically, permissions in the umask are turned off from the mode argument to open(2) (so, for example, the common umask default value of 022 results in new files being created with permissions 0666 & ~022 = 0644 = rw-r--r-- in the usual case where the mode is specified as 0666).\\""}},"Content_History":{"Submission":{"Submission_Name":"Anonymous Tool Vendor (under NDA)","Submission_Date":"2006-07-19"},"Modification":[{"Modification_Name":"Eric Dalci","Modification_Organization":"Cigital","Modification_Date":"2008-07-01","Modification_Comment":"updated Potential_Mitigations"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2008-09-08","Modification_Comment":"updated Relationships, Other_Notes, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-06-01","Modification_Comment":"updated Common_Consequences"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2012-05-11","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2012-10-30","Modification_Comment":"updated Potential_Mitigations"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2014-07-30","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2017-11-08","Modification_Comment":"updated Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-02-24","Modification_Comment":"updated Relationships"}],"Previous_Entry_Name":{"Date":"2008-04-11","$t":"Often Misused: umask()"}}},{"ID":"562","Name":"Return of Stack Variable Address","Abstraction":"Base","Structure":"Simple","Status":"Draft","Description":"A function returns the address of a stack variable, which will cause unintended program behavior, typically in the form of a crash.","Extended_Description":"Because local variables are allocated on the stack, when a program returns a pointer to a local variable, it is returning a stack address. A subsequent function call is likely to re-use this same stack address, thereby overwriting the value of the pointer, which no longer corresponds to the same variable since a function\'s stack frame is invalidated when it returns. At best this will cause the value of the pointer to change unexpectedly. In many cases it causes the program to crash the next time the pointer is dereferenced.","Related_Weaknesses":{"Related_Weakness":[{"Nature":"ChildOf","CWE_ID":"758","View_ID":"1000","Ordinal":"Primary"},{"Nature":"CanPrecede","CWE_ID":"672","View_ID":"1000"},{"Nature":"CanPrecede","CWE_ID":"825","View_ID":"1000"}]},"Weakness_Ordinalities":{"Weakness_Ordinality":[{"Ordinality":"Indirect"},{"Ordinality":"Primary"}]},"Applicable_Platforms":{"Language":[{"Name":"C","Prevalence":"Undetermined"},{"Name":"C++","Prevalence":"Undetermined"}]},"Modes_Of_Introduction":{"Introduction":{"Phase":"Implementation"}},"Common_Consequences":{"Consequence":{"Scope":["Availability","Integrity","Confidentiality"],"Impact":["Read Memory","Modify Memory","Execute Unauthorized Code or Commands","DoS: Crash, Exit, or Restart"],"Note":"If the returned stack buffer address is dereferenced after the return, then an attacker may be able to modify or read memory, depending on how the address is used.  If the address is used for reading, then the address itself may be exposed, or the contents that the address points to.  If the address is used for writing, this can lead to a crash and possibly code execution."}},"Potential_Mitigations":{"Mitigation":{"Phase":"Testing","Description":"Use static analysis tools to spot return of the address of a stack variable."}},"Demonstrative_Examples":{"Demonstrative_Example":{"Intro_Text":"The following function returns a stack address.","Example_Code":{"Nature":"bad","Language":"C","xhtml:div":{"xhtml:div":{"style":"margin-left:10px;","xhtml:br":[{},{}]}}}}},"Taxonomy_Mappings":{"Taxonomy_Mapping":[{"Taxonomy_Name":"CERT C Secure Coding","Entry_ID":"DCL30-C","Entry_Name":"Declare objects with appropriate storage durations","Mapping_Fit":"CWE More Specific"},{"Taxonomy_Name":"CERT C Secure Coding","Entry_ID":"POS34-C","Entry_Name":"Do not call putenv() with a pointer to an automatic variable as the argument"},{"Taxonomy_Name":"Software Fault Patterns","Entry_ID":"SFP1","Entry_Name":"Glitch in computation"}]},"Content_History":{"Submission":{"Submission_Name":"Anonymous Tool Vendor (under NDA)","Submission_Date":"2006-07-19"},"Modification":[{"Modification_Name":"Eric Dalci","Modification_Organization":"Cigital","Modification_Date":"2008-07-01","Modification_Comment":"updated Potential_Mitigations, Time_of_Introduction"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2008-09-08","Modification_Comment":"updated Applicable_Platforms, Relationships, Other_Notes, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2008-11-24","Modification_Comment":"updated Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2009-05-27","Modification_Comment":"updated Demonstrative_Examples"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2010-09-27","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-06-01","Modification_Comment":"updated Common_Consequences"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2012-05-11","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2012-10-30","Modification_Comment":"updated Potential_Mitigations"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2014-06-23","Modification_Comment":"updated Description, Other_Notes"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2014-07-30","Modification_Comment":"updated Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2017-11-08","Modification_Comment":"updated Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2019-01-03","Modification_Comment":"updated Relationships, Weakness_Ordinalities"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-02-24","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-06-25","Modification_Comment":"updated Common_Consequences"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-08-20","Modification_Comment":"updated Relationships"}],"Previous_Entry_Name":{"Date":"2008-04-11","$t":"Stack Address Returned"}}},{"ID":"587","Name":"Assignment of a Fixed Address to a Pointer","Abstraction":"Base","Structure":"Simple","Status":"Draft","Description":"The software sets a pointer to a specific address other than NULL or 0.","Extended_Description":"Using a fixed address is not portable because that address will probably not be valid in all environments or platforms.","Related_Weaknesses":{"Related_Weakness":[{"Nature":"ChildOf","CWE_ID":"344","View_ID":"1000","Ordinal":"Primary"},{"Nature":"ChildOf","CWE_ID":"758","View_ID":"1000"}]},"Weakness_Ordinalities":{"Weakness_Ordinality":{"Ordinality":"Primary"}},"Applicable_Platforms":{"Language":[{"Name":"C","Prevalence":"Undetermined"},{"Name":"C++","Prevalence":"Undetermined"},{"Name":"C#","Prevalence":"Undetermined"},{"Class":"Assembly","Prevalence":"Undetermined"}]},"Modes_Of_Introduction":{"Introduction":[{"Phase":"Architecture and Design"},{"Phase":"Implementation"}]},"Common_Consequences":{"Consequence":[{"Scope":["Integrity","Confidentiality","Availability"],"Impact":"Execute Unauthorized Code or Commands","Note":"If one executes code at a known location, an attacker might be able to inject code there beforehand."},{"Scope":"Availability","Impact":"DoS: Crash, Exit, or Restart","Note":"If the code is ported to another platform or environment, the pointer is likely to be invalid and cause a crash."},{"Scope":["Confidentiality","Integrity"],"Impact":["Read Memory","Modify Memory"],"Note":"The data at a known pointer location can be easily read or influenced by an attacker."}]},"Potential_Mitigations":{"Mitigation":{"Phase":"Implementation","Description":"Never set a pointer to a fixed address."}},"Demonstrative_Examples":{"Demonstrative_Example":{"Intro_Text":"This code assumes a particular function will always be found at a particular address. It assigns a pointer to that address and calls the function.","Example_Code":{"Nature":"bad","Language":"C","xhtml:div":{"xhtml:br":[{},{},{}],"xhtml:i":"// Here we can inject code to execute."}},"Body_Text":"The same function may not always be found at the same memory address. This could lead to a crash, or an attacker may alter the memory at the expected address, leading to arbitrary code execution."}},"Taxonomy_Mappings":{"Taxonomy_Mapping":[{"Taxonomy_Name":"CERT C Secure Coding","Entry_ID":"INT36-C","Entry_Name":"Converting a pointer to integer or integer to pointer","Mapping_Fit":"Imprecise"},{"Taxonomy_Name":"Software Fault Patterns","Entry_ID":"SFP1","Entry_Name":"Glitch in computation"}]},"Content_History":{"Submission":{"Submission_Name":"CWE Content Team","Submission_Organization":"MITRE","Submission_Date":"2006-12-15"},"Modification":[{"Modification_Name":"Eric Dalci","Modification_Organization":"Cigital","Modification_Date":"2008-07-01","Modification_Comment":"updated Time_of_Introduction"},{"Modification_Organization":"KDM Analytics","Modification_Date":"2008-08-01","Modification_Comment":"added/updated white box definitions"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2008-09-08","Modification_Comment":"updated Applicable_Platforms, Description, Relationships, Other_Notes, Weakness_Ordinalities"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2008-11-24","Modification_Comment":"updated Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2009-03-10","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2009-07-27","Modification_Comment":"updated Common_Consequences, Description, Other_Notes"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-06-01","Modification_Comment":"updated Common_Consequences"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-09-13","Modification_Comment":"updated Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2012-05-11","Modification_Comment":"updated Demonstrative_Examples, Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2014-07-30","Modification_Comment":"updated Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2017-11-08","Modification_Comment":"updated Applicable_Platforms, Taxonomy_Mappings, White_Box_Definitions"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2019-01-03","Modification_Comment":"updated Relationships"}]}},{"ID":"676","Name":"Use of Potentially Dangerous Function","Abstraction":"Base","Structure":"Simple","Status":"Draft","Description":"The program invokes a potentially dangerous function that could introduce a vulnerability if it is used incorrectly, but the function can also be used safely.","Related_Weaknesses":{"Related_Weakness":{"Nature":"ChildOf","CWE_ID":"1177","View_ID":"1000","Ordinal":"Primary"}},"Weakness_Ordinalities":{"Weakness_Ordinality":[{"Ordinality":"Primary"},{"Ordinality":"Indirect"}]},"Applicable_Platforms":{"Language":[{"Name":"C","Prevalence":"Undetermined"},{"Name":"C++","Prevalence":"Undetermined"}]},"Modes_Of_Introduction":{"Introduction":[{"Phase":"Architecture and Design"},{"Phase":"Implementation"}]},"Likelihood_Of_Exploit":"High","Common_Consequences":{"Consequence":{"Scope":"Other","Impact":["Varies by Context","Quality Degradation","Unexpected State"],"Note":"If the function is used incorrectly, then it could result in security problems."}},"Detection_Methods":{"Detection_Method":[{"Method":"Automated Static Analysis - Binary or Bytecode","Description":{"xhtml:p":"According to SOAR, the following detection techniques may be useful:","xhtml:div":{"style":"margin-left:10px;","xhtml:div":["Highly cost effective:",{"style":"margin-left:10px;","xhtml:ul":{"xhtml:li":["Bytecode Weakness Analysis - including disassembler + source code weakness analysis","Binary Weakness Analysis - including disassembler + source code weakness analysis"]}},"Cost effective for partial coverage:",{"style":"margin-left:10px;","xhtml:ul":{"xhtml:li":["Binary / Bytecode Quality Analysis","Binary / Bytecode simple extractor - strings, ELF readers, etc."]}}]}},"Effectiveness":"High"},{"Method":"Manual Static Analysis - Binary or Bytecode","Description":{"xhtml:p":"According to SOAR, the following detection techniques may be useful:","xhtml:div":{"style":"margin-left:10px;","xhtml:div":["Cost effective for partial coverage:",{"style":"margin-left:10px;","xhtml:ul":{"xhtml:li":"Binary / Bytecode disassembler - then use manual analysis for vulnerabilities & anomalies"}}]}},"Effectiveness":"SOAR Partial"},{"Method":"Dynamic Analysis with Manual Results Interpretation","Description":{"xhtml:p":"According to SOAR, the following detection techniques may be useful:","xhtml:div":{"style":"margin-left:10px;","xhtml:div":["Highly cost effective:",{"style":"margin-left:10px;","xhtml:ul":{"xhtml:li":"Debugger"}},"Cost effective for partial coverage:",{"style":"margin-left:10px;","xhtml:ul":{"xhtml:li":"Monitored Virtual Environment - run potentially malicious code in sandbox / wrapper / virtual machine, see if it does anything suspicious"}}]}},"Effectiveness":"High"},{"Method":"Manual Static Analysis - Source Code","Description":{"xhtml:p":"According to SOAR, the following detection techniques may be useful:","xhtml:div":{"style":"margin-left:10px;","xhtml:div":["Highly cost effective:",{"style":"margin-left:10px;","xhtml:ul":{"xhtml:li":"Manual Source Code Review (not inspections)"}},"Cost effective for partial coverage:",{"style":"margin-left:10px;","xhtml:ul":{"xhtml:li":"Focused Manual Spotcheck - Focused manual analysis of source"}}]}},"Effectiveness":"High"},{"Method":"Automated Static Analysis - Source Code","Description":{"xhtml:p":"According to SOAR, the following detection techniques may be useful:","xhtml:div":{"style":"margin-left:10px;","xhtml:div":["Highly cost effective:",{"style":"margin-left:10px;","xhtml:ul":{"xhtml:li":["Source code Weakness Analyzer","Context-configured Source Code Weakness Analyzer"]}},"Cost effective for partial coverage:",{"style":"margin-left:10px;","xhtml:ul":{"xhtml:li":["Warning Flags","Source Code Quality Analyzer"]}}]}},"Effectiveness":"High"},{"Method":"Automated Static Analysis","Description":{"xhtml:p":"According to SOAR, the following detection techniques may be useful:","xhtml:div":{"style":"margin-left:10px;","xhtml:div":["Cost effective for partial coverage:",{"style":"margin-left:10px;","xhtml:ul":{"xhtml:li":"Origin Analysis"}}]}},"Effectiveness":"SOAR Partial"},{"Method":"Architecture or Design Review","Description":{"xhtml:p":"According to SOAR, the following detection techniques may be useful:","xhtml:div":{"style":"margin-left:10px;","xhtml:div":["Highly cost effective:",{"style":"margin-left:10px;","xhtml:ul":{"xhtml:li":["Formal Methods / Correct-By-Construction","Inspection (IEEE 1028 standard) (can apply to requirements, design, source code, etc.)"]}}]}},"Effectiveness":"High"}]},"Potential_Mitigations":{"Mitigation":{"Phase":["Build and Compilation","Implementation"],"Description":"Identify a list of prohibited API functions and prohibit developers from using these functions, providing safer alternatives. In some cases, automatic code analysis tools or the compiler can be instructed to spot use of prohibited functions, such as the \\"banned.h\\" include file from Microsoft\'s SDL. [REF-554] [REF-7]"}},"Demonstrative_Examples":{"Demonstrative_Example":{"Demonstrative_Example_ID":"DX-6","Intro_Text":"The following code attempts to create a local copy of a buffer to perform some manipulations to the data.","Example_Code":{"Nature":"bad","Language":"C","xhtml:div":{"xhtml:div":{"style":"margin-left:10px;","xhtml:br":[{},{}]}}},"Body_Text":"However, the programmer does not ensure that the size of the data pointed to by string will fit in the local buffer and blindly copies the data with the potentially dangerous strcpy() function. This may result in a buffer overflow condition if an attacker can influence the contents of the string parameter."}},"Observed_Examples":{"Observed_Example":[{"Reference":"CVE-2007-1470","Description":"Library has multiple buffer overflows using sprintf() and strcpy()","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2007-1470"},{"Reference":"CVE-2009-3849","Description":"Buffer overflow using strcat()","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2009-3849"},{"Reference":"CVE-2006-2114","Description":"Buffer overflow using strcpy()","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2006-2114"},{"Reference":"CVE-2006-0963","Description":"Buffer overflow using strcpy()","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2006-0963"},{"Reference":"CVE-2011-0712","Description":"Vulnerable use of strcpy() changed to use safer strlcpy()","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2011-0712"},{"Reference":"CVE-2008-5005","Description":"Buffer overflow using strcpy()","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2008-5005"}]},"Taxonomy_Mappings":{"Taxonomy_Mapping":[{"Taxonomy_Name":"7 Pernicious Kingdoms","Entry_Name":"Dangerous Functions"},{"Taxonomy_Name":"CERT C Secure Coding","Entry_ID":"CON33-C","Entry_Name":"Avoid race conditions when using library functions","Mapping_Fit":"CWE More Abstract"},{"Taxonomy_Name":"CERT C Secure Coding","Entry_ID":"ENV33-C","Entry_Name":"Do not call system()","Mapping_Fit":"CWE More Abstract"},{"Taxonomy_Name":"CERT C Secure Coding","Entry_ID":"ERR07-C","Entry_Name":"Prefer functions that support error checking over equivalent functions that don\'t"},{"Taxonomy_Name":"CERT C Secure Coding","Entry_ID":"ERR34-C","Entry_Name":"Detect errors when converting a string to a number","Mapping_Fit":"CWE More Abstract"},{"Taxonomy_Name":"CERT C Secure Coding","Entry_ID":"FIO01-C","Entry_Name":"Be careful using functions that use file names for identification"},{"Taxonomy_Name":"CERT C Secure Coding","Entry_ID":"MSC30-C","Entry_Name":"Do not use the rand() function for generating pseudorandom numbers","Mapping_Fit":"CWE More Abstract"},{"Taxonomy_Name":"CERT C Secure Coding","Entry_ID":"STR31-C","Entry_Name":"Guarantee that storage for strings has sufficient space for character data and the null terminator","Mapping_Fit":"Imprecise"},{"Taxonomy_Name":"Software Fault Patterns","Entry_ID":"SFP3","Entry_Name":"Use of an improper API"}]},"References":{"Reference":[{"External_Reference_ID":"REF-6"},{"External_Reference_ID":"REF-554"},{"External_Reference_ID":"REF-7","Section":"Chapter 5, \\"Safe String Handling\\" Page 156, 160"},{"External_Reference_ID":"REF-62","Section":"Chapter 8, \\"C String Handling\\", Page 388"}]},"Notes":{"Note":{"Type":"Relationship","$t":"This weakness is different than CWE-242 (Use of Inherently Dangerous Function). CWE-242 covers functions with such significant security problems that they can never be guaranteed to be safe. Some functions, if used properly, do not directly pose a security risk, but can introduce a weakness if not called correctly. These are regarded as potentially dangerous. A well-known example is the strcpy() function. When provided with a destination buffer that is larger than its source, strcpy() will not overflow. However, it is so often misused that some developers prohibit strcpy() entirely."}},"Content_History":{"Submission":{"Submission_Name":"7 Pernicious Kingdoms","Submission_Date":"2008-04-11"},"Modification":[{"Modification_Name":"Sean Eidemiller","Modification_Organization":"Cigital","Modification_Date":"2008-07-01","Modification_Comment":"added/updated demonstrative examples"},{"Modification_Name":"Eric Dalci","Modification_Organization":"Cigital","Modification_Date":"2008-07-01","Modification_Comment":"updated Potential_Mitigations, Time_of_Introduction"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2008-09-08","Modification_Comment":"updated Applicable_Platforms, Relationships, Other_Notes, Taxonomy_Mappings, Weakness_Ordinalities"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2008-11-24","Modification_Comment":"updated Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2009-07-27","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2010-02-16","Modification_Comment":"updated Demonstrative_Examples, Other_Notes, References, Relationship_Notes"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-06-01","Modification_Comment":"updated Common_Consequences"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-06-27","Modification_Comment":"updated Common_Consequences, Observed_Examples, Potential_Mitigations, References, Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-09-13","Modification_Comment":"updated Potential_Mitigations, Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2012-05-11","Modification_Comment":"updated References, Related_Attack_Patterns, Relationships, Weakness_Ordinalities"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2014-07-30","Modification_Comment":"updated Detection_Factors, Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2017-05-03","Modification_Comment":"updated Related_Attack_Patterns"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2017-11-08","Modification_Comment":"updated Causal_Nature, References, Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2018-03-27","Modification_Comment":"updated References"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2019-01-03","Modification_Comment":"updated Relationships, Weakness_Ordinalities"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-02-24","Modification_Comment":"updated Detection_Factors, References, Relationships"}]}},{"ID":"685","Name":"Function Call With Incorrect Number of Arguments","Abstraction":"Variant","Structure":"Simple","Status":"Draft","Description":"The software calls a function, procedure, or routine, but the caller specifies too many arguments, or too few arguments, which may lead to undefined behavior and resultant weaknesses.","Related_Weaknesses":{"Related_Weakness":{"Nature":"ChildOf","CWE_ID":"628","View_ID":"1000","Ordinal":"Primary"}},"Weakness_Ordinalities":{"Weakness_Ordinality":{"Ordinality":"Primary"}},"Applicable_Platforms":{"Language":[{"Name":"C","Prevalence":"Undetermined"},{"Name":"Perl","Prevalence":"Undetermined"}]},"Modes_Of_Introduction":{"Introduction":{"Phase":"Implementation","Note":"This problem typically occurs when the programmer makes a typo, or copy and paste errors."}},"Common_Consequences":{"Consequence":{"Scope":"Other","Impact":"Quality Degradation"}},"Detection_Methods":{"Detection_Method":{"Method":"Other","Description":"While this weakness might be caught by the compiler in some languages, it can occur more frequently in cases in which the called function accepts variable numbers of arguments, such as format strings in C. It also can occur in languages or environments that do not require that functions always be called with the correct number of arguments, such as Perl."}},"Potential_Mitigations":{"Mitigation":{"Phase":"Testing","Description":"Because this function call often produces incorrect behavior it will usually be detected during testing or normal operation of the software. During testing exercise all possible control paths will typically expose this weakness except in rare cases when the incorrect function call accidentally produces the correct results or if the provided argument type is very similar to the expected argument type."}},"Taxonomy_Mappings":{"Taxonomy_Mapping":[{"Taxonomy_Name":"Software Fault Patterns","Entry_ID":"SFP1","Entry_Name":"Glitch in computation"},{"Taxonomy_Name":"CERT C Secure Coding","Entry_ID":"EXP37-C","Entry_Name":"Call functions with the correct number and type of arguments","Mapping_Fit":"CWE More Specific"},{"Taxonomy_Name":"CERT C Secure Coding","Entry_ID":"FIO47-C","Entry_Name":"Use valid format strings","Mapping_Fit":"Imprecise"}]},"Content_History":{"Submission":{"Submission_Name":"CWE Content Team","Submission_Organization":"MITRE","Submission_Date":"2008-04-11"},"Modification":[{"Modification_Name":"Eric Dalci","Modification_Organization":"Cigital","Modification_Date":"2008-07-01","Modification_Comment":"updated Potential_Mitigations"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2008-09-08","Modification_Comment":"updated Applicable_Platforms, Detection_Factors, Relationships, Other_Notes, Weakness_Ordinalities"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2009-05-27","Modification_Comment":"updated Description"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2009-10-29","Modification_Comment":"updated Modes_of_Introduction, Other_Notes, Potential_Mitigations"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2010-02-16","Modification_Comment":"updated Detection_Factors"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-06-01","Modification_Comment":"updated Common_Consequences"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-06-27","Modification_Comment":"updated Common_Consequences"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2012-05-11","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2012-10-30","Modification_Comment":"updated Potential_Mitigations"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2014-07-30","Modification_Comment":"updated Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2017-11-08","Modification_Comment":"updated Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2019-01-03","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-02-24","Modification_Comment":"updated Relationships"}]}},{"ID":"688","Name":"Function Call With Incorrect Variable or Reference as Argument","Abstraction":"Variant","Structure":"Simple","Status":"Draft","Description":"The software calls a function, procedure, or routine, but the caller specifies the wrong variable or reference as one of the arguments, which may lead to undefined behavior and resultant weaknesses.","Related_Weaknesses":{"Related_Weakness":{"Nature":"ChildOf","CWE_ID":"628","View_ID":"1000","Ordinal":"Primary"}},"Weakness_Ordinalities":{"Weakness_Ordinality":{"Ordinality":"Primary"}},"Applicable_Platforms":{"Language":[{"Name":"C","Prevalence":"Undetermined"},{"Name":"Perl","Prevalence":"Undetermined"}]},"Modes_Of_Introduction":{"Introduction":{"Phase":"Implementation","Note":"This problem typically occurs when the programmer makes a typo, or copy and paste errors."}},"Common_Consequences":{"Consequence":{"Scope":"Other","Impact":"Quality Degradation"}},"Detection_Methods":{"Detection_Method":{"Method":"Other","Description":"While this weakness might be caught by the compiler in some languages, it can occur more frequently in cases in which the called function accepts variable numbers of arguments, such as format strings in C. It also can occur in loosely typed languages or environments. This might require an understanding of intended program behavior or design to determine whether the value is incorrect."}},"Potential_Mitigations":{"Mitigation":{"Phase":"Testing","Description":"Because this function call often produces incorrect behavior it will usually be detected during testing or normal operation of the software. During testing exercise all possible control paths will typically expose this weakness except in rare cases when the incorrect function call accidentally produces the correct results or if the provided argument type is very similar to the expected argument type."}},"Demonstrative_Examples":{"Demonstrative_Example":{"Demonstrative_Example_ID":"DX-64","Intro_Text":"In the following Java snippet, the accessGranted() method is accidentally called with the static ADMIN_ROLES array rather than the user roles.","Example_Code":{"Nature":"bad","Language":"Java","xhtml:div":{"xhtml:br":[{},{},{}],"xhtml:div":[{"style":"margin-left:10px;","xhtml:br":{}},{"style":"margin-left:10px;","xhtml:div":{"xhtml:br":[{},{}],"xhtml:i":"// grant or deny access based on user roles"}}]}}}},"Observed_Examples":{"Observed_Example":{"Reference":"CVE-2005-2548","Description":"Kernel code specifies the wrong variable in first argument, leading to resultant NULL pointer dereference.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2005-2548"}},"Content_History":{"Submission":{"Submission_Name":"CWE Content Team","Submission_Organization":"MITRE","Submission_Date":"2008-04-11"},"Modification":[{"Modification_Name":"Sean Eidemiller","Modification_Organization":"Cigital","Modification_Date":"2008-07-01","Modification_Comment":"added/updated demonstrative examples"},{"Modification_Name":"Eric Dalci","Modification_Organization":"Cigital","Modification_Date":"2008-07-01","Modification_Comment":"updated Potential_Mitigations"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2008-09-08","Modification_Comment":"updated Applicable_Platforms, Detection_Factors, Relationships, Other_Notes, Weakness_Ordinalities"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2009-05-27","Modification_Comment":"updated Description"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2009-10-29","Modification_Comment":"updated Modes_of_Introduction, Other_Notes, Potential_Mitigations"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2010-02-16","Modification_Comment":"updated Detection_Factors"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-06-01","Modification_Comment":"updated Common_Consequences"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-06-27","Modification_Comment":"updated Common_Consequences"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2012-05-11","Modification_Comment":"updated Demonstrative_Examples, Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2012-10-30","Modification_Comment":"updated Potential_Mitigations"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2014-07-30","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-02-24","Modification_Comment":"updated Relationships"}]}},{"ID":"689","Name":"Permission Race Condition During Resource Copy","Abstraction":"Compound","Structure":"Composite","Status":"Draft","Description":"The product, while copying or cloning a resource, does not set the resource\'s permissions or access control until the copy is complete, leaving the resource exposed to other spheres while the copy is taking place.","Related_Weaknesses":{"Related_Weakness":[{"Nature":"ChildOf","CWE_ID":"362","View_ID":"1000"},{"Nature":"Requires","CWE_ID":"362","View_ID":"1000"},{"Nature":"Requires","CWE_ID":"732","View_ID":"1000"}]},"Weakness_Ordinalities":{"Weakness_Ordinality":{"Ordinality":"Primary"}},"Applicable_Platforms":{"Language":[{"Name":"C","Prevalence":"Undetermined"},{"Name":"Perl","Prevalence":"Undetermined"}]},"Modes_Of_Introduction":{"Introduction":{"Phase":"Implementation","Note":{"xhtml:p":["Common examples occur in file archive extraction, in which the product begins the extraction with insecure default permissions, then only sets the final permissions (as specified in the archive) once the copy is complete. The larger the archive, the larger the timing window for the race condition.","This weakness has also occurred in some operating system utilities that perform copies of deeply nested directories containing a large number of files.","This weakness can occur in any type of functionality that involves copying objects or resources in a multi-user environment, including at the application level. For example, a document management system might allow a user to copy a private document, but if it does not set the new copy to be private as soon as the copy begins, then other users might be able to view the document while the copy is still taking place."]}}},"Common_Consequences":{"Consequence":{"Scope":["Confidentiality","Integrity"],"Impact":["Read Application Data","Modify Application Data"]}},"Observed_Examples":{"Observed_Example":[{"Reference":"CVE-2002-0760","Description":"Archive extractor decompresses files with world-readable permissions, then later sets permissions to what the archive specified.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2002-0760"},{"Reference":"CVE-2005-2174","Description":"Product inserts a new object into database before setting the object\'s permissions, introducing a race condition.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2005-2174"},{"Reference":"CVE-2006-5214","Description":"Error file has weak permissions before a chmod is performed.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2006-5214"},{"Reference":"CVE-2005-2475","Description":"Archive permissions issue using hard link.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2005-2475"},{"Reference":"CVE-2003-0265","Description":"Database product creates files world-writable before initializing the setuid bits, leading to modification of executables.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2003-0265"}]},"Related_Attack_Patterns":{"Related_Attack_Pattern":[{"CAPEC_ID":"26"},{"CAPEC_ID":"27"}]},"References":{"Reference":{"External_Reference_ID":"REF-62","Section":"Chapter 9, \\"Permission Races\\", Page 533"}},"Notes":{"Note":{"Type":"Research Gap","$t":"Under-studied. It seems likely that this weakness could occur in any situation in which a complex or large copy operation occurs, when the resource can be made available to other spheres as soon as it is created, but before its initialization is complete."}},"Content_History":{"Submission":{"Submission_Name":"CWE Content Team","Submission_Organization":"MITRE","Submission_Date":"2008-04-11"},"Modification":[{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2008-09-08","Modification_Comment":"updated Applicable_Platforms, Relationships, Other_Notes, Weakness_Ordinalities"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2009-03-10","Modification_Comment":"updated Related_Attack_Patterns"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2010-09-27","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-06-01","Modification_Comment":"updated Common_Consequences"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2012-05-11","Modification_Comment":"updated References"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2014-06-23","Modification_Comment":"updated Modes_of_Introduction, Other_Notes"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2017-11-08","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-02-24","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-08-20","Modification_Comment":"updated Relationships"}]}},{"ID":"690","Name":"Unchecked Return Value to NULL Pointer Dereference","Abstraction":"Compound","Structure":"Chain","Status":"Draft","Description":"The product does not check for an error after calling a function that can return with a NULL pointer if the function fails, which leads to a resultant NULL pointer dereference.","Extended_Description":"While unchecked return value weaknesses are not limited to returns of NULL pointers (see the examples in CWE-252), functions often return NULL to indicate an error status. When this error condition is not checked, a NULL pointer dereference can occur.","Related_Weaknesses":{"Related_Weakness":[{"Nature":"StartsWith","CWE_ID":"252","View_ID":"709","Chain_ID":"690"},{"Nature":"ChildOf","CWE_ID":"476","View_ID":"1000","Ordinal":"Primary"}]},"Applicable_Platforms":{"Language":[{"Name":"C","Prevalence":"Undetermined"},{"Name":"C++","Prevalence":"Undetermined"}]},"Modes_Of_Introduction":{"Introduction":{"Phase":"Implementation","Note":"A typical occurrence of this weakness occurs when an application includes user-controlled input to a malloc() call. The related code might be correct with respect to preventing buffer overflows, but if a large value is provided, the malloc() will fail due to insufficient memory. This problem also frequently occurs when a parsing routine expects that certain elements will always be present. If malformed input is provided, the parser might return NULL. For example, strtok() can return NULL."}},"Common_Consequences":{"Consequence":[{"Scope":"Availability","Impact":"DoS: Crash, Exit, or Restart"},{"Scope":["Integrity","Confidentiality","Availability"],"Impact":["Execute Unauthorized Code or Commands","Read Memory","Modify Memory"],"Note":"In rare circumstances, when NULL is equivalent to the 0x0 memory address and privileged code can access it, then writing or reading memory is possible, which may lead to code execution."}]},"Detection_Methods":{"Detection_Method":[{"Method":"Black Box","Description":"This typically occurs in rarely-triggered error conditions, reducing the chances of detection during black box testing."},{"Method":"White Box","Description":"Code analysis can require knowledge of API behaviors for library functions that might return NULL, reducing the chances of detection when unknown libraries are used."}]},"Demonstrative_Examples":{"Demonstrative_Example":[{"Intro_Text":"The code below makes a call to the getUserName() function but doesn\'t check the return value before dereferencing (which may cause a NullPointerException).","Example_Code":{"Nature":"bad","Language":"Java","xhtml:div":{"$t":"String username = getUserName();if (username.equals(ADMIN_USER)) {}","xhtml:br":{},"xhtml:div":{"style":"margin-left:10px;","$t":"..."}}}},{"Demonstrative_Example_ID":"DX-1","Intro_Text":"This example takes an IP address from a user, verifies that it is well formed and then looks up the hostname and copies it into a buffer.","Example_Code":{"Nature":"bad","Language":"C","xhtml:div":{"xhtml:div":{"style":"margin-left:10px;","xhtml:div":{"xhtml:br":[{},{},{},{},{},{},{},{},{},{}],"xhtml:i":"/*routine that ensures user_supplied_addr is in the right format for conversion */"}}}},"Body_Text":["If an attacker provides an address that appears to be well-formed, but the address does not resolve to a hostname, then the call to gethostbyaddr() will return NULL. Since the code does not check the return value from gethostbyaddr (CWE-252), a NULL pointer dereference (CWE-476) would then occur in the call to strcpy().","Note that this example is also vulnerable to a buffer overflow (see CWE-119)."]}]},"Observed_Examples":{"Observed_Example":[{"Reference":"CVE-2008-1052","Description":"Large Content-Length value leads to NULL pointer dereference when malloc fails.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2008-1052"},{"Reference":"CVE-2006-6227","Description":"Large message length field leads to NULL pointer dereference when malloc fails.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2006-6227"},{"Reference":"CVE-2006-2555","Description":"Parsing routine encounters NULL dereference when input is missing a colon separator.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2006-2555"},{"Reference":"CVE-2003-1054","Description":"URI parsing API sets argument to NULL when a parsing failure occurs, such as when the Referer header is missing a hostname, leading to NULL dereference.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2003-1054"},{"Reference":"CVE-2008-5183","Description":"chain: unchecked return value can lead to NULL dereference","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2008-5183"}]},"Taxonomy_Mappings":{"Taxonomy_Mapping":[{"Taxonomy_Name":"CERT C Secure Coding","Entry_ID":"EXP34-C","Entry_Name":"Do not dereference null pointers","Mapping_Fit":"CWE More Specific"},{"Taxonomy_Name":"The CERT Oracle Secure Coding Standard for Java (2011)","Entry_ID":"ERR08-J","Entry_Name":"Do not catch NullPointerException or any of its ancestors"},{"Taxonomy_Name":"SEI CERT Perl Coding Standard","Entry_ID":"EXP32-PL","Entry_Name":"Do not ignore function return values","Mapping_Fit":"CWE More Specific"}]},"Content_History":{"Submission":{"Submission_Name":"CWE Content Team","Submission_Organization":"MITRE","Submission_Date":"2008-04-11"},"Modification":[{"Modification_Name":"Sean Eidemiller","Modification_Organization":"Cigital","Modification_Date":"2008-07-01","Modification_Comment":"added/updated demonstrative examples"},{"Modification_Name":"Eric Dalci","Modification_Organization":"Cigital","Modification_Date":"2008-07-01","Modification_Comment":"updated Time_of_Introduction"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2008-09-08","Modification_Comment":"updated Applicable_Platforms, Description, Detection_Factors, Relationships, Other_Notes"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2009-12-28","Modification_Comment":"updated Demonstrative_Examples"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2010-09-27","Modification_Comment":"updated Observed_Examples"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-06-01","Modification_Comment":"updated Common_Consequences, Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-09-13","Modification_Comment":"updated Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2014-06-23","Modification_Comment":"updated Modes_of_Introduction, Other_Notes"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2017-01-19","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2017-11-08","Modification_Comment":"updated Relationships, Relevant_Properties, Taxonomy_Mappings, Time_of_Introduction"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2019-01-03","Modification_Comment":"updated Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-06-25","Modification_Comment":"updated Common_Consequences"}]}},{"ID":"704","Name":"Incorrect Type Conversion or Cast","Abstraction":"Class","Structure":"Simple","Status":"Incomplete","Description":"The software does not correctly convert an object, resource, or structure from one type to a different type.","Related_Weaknesses":{"Related_Weakness":{"Nature":"ChildOf","CWE_ID":"664","View_ID":"1000","Ordinal":"Primary"}},"Applicable_Platforms":{"Language":[{"Name":"C","Prevalence":"Often"},{"Name":"C++","Prevalence":"Often"},{"Class":"Language-Independent","Prevalence":"Undetermined"}]},"Modes_Of_Introduction":{"Introduction":[{"Phase":"Architecture and Design"},{"Phase":"Implementation"}]},"Common_Consequences":{"Consequence":{"Scope":"Other","Impact":"Other"}},"Taxonomy_Mappings":{"Taxonomy_Mapping":[{"Taxonomy_Name":"CERT C Secure Coding","Entry_ID":"EXP05-C","Entry_Name":"Do not cast away a const qualification"},{"Taxonomy_Name":"CERT C Secure Coding","Entry_ID":"EXP39-C","Entry_Name":"Do not access a variable through a pointer of an incompatible type","Mapping_Fit":"CWE More Abstract"},{"Taxonomy_Name":"CERT C Secure Coding","Entry_ID":"INT31-C","Entry_Name":"Ensure that integer conversions do not result in lost or misinterpreted data","Mapping_Fit":"CWE More Abstract"},{"Taxonomy_Name":"CERT C Secure Coding","Entry_ID":"INT36-C","Entry_Name":"Converting a pointer to integer or integer to pointer","Mapping_Fit":"CWE More Abstract"},{"Taxonomy_Name":"CERT C Secure Coding","Entry_ID":"STR34-C","Entry_Name":"Cast characters to unsigned types before converting to larger integer sizes","Mapping_Fit":"CWE More Abstract"},{"Taxonomy_Name":"CERT C Secure Coding","Entry_ID":"STR37-C","Entry_Name":"Arguments to character handling functions must be representable as an unsigned char","Mapping_Fit":"CWE More Abstract"},{"Taxonomy_Name":"Software Fault Patterns","Entry_ID":"SFP1","Entry_Name":"Glitch in computation"},{"Taxonomy_Name":"OMG ASCRM","Entry_ID":"ASCRM-CWE-704"}]},"References":{"Reference":{"External_Reference_ID":"REF-961","Section":"ASCRM-CWE-704"}},"Content_History":{"Submission":{"Submission_Name":"CWE Content Team","Submission_Organization":"MITRE","Submission_Date":"2008-09-09","Submission_Comment":"Note: this date reflects when the entry was first published. Draft versions of this entry were provided to members of the CWE community and modified between Draft 9 and 1.0."},"Modification":[{"Modification_Name":"Eric Dalci","Modification_Organization":"Cigital","Modification_Date":"2008-07-01","Modification_Comment":"updated Time_of_Introduction"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2008-11-24","Modification_Comment":"updated Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2009-05-27","Modification_Comment":"updated Description"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-06-01","Modification_Comment":"updated Common_Consequences, Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-09-13","Modification_Comment":"updated Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2012-05-11","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2014-07-30","Modification_Comment":"updated Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2015-12-07","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2017-01-19","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2017-11-08","Modification_Comment":"updated Applicable_Platforms, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2019-01-03","Modification_Comment":"updated References, Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2019-06-20","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-02-24","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-08-20","Modification_Comment":"updated Relationships"}]}},{"ID":"733","Name":"Compiler Optimization Removal or Modification of Security-critical Code","Abstraction":"Base","Structure":"Simple","Status":"Incomplete","Description":"The developer builds a security-critical protection mechanism into the software, but the compiler optimizes the program such that the mechanism is removed or modified.","Related_Weaknesses":{"Related_Weakness":{"Nature":"ChildOf","CWE_ID":"1038","View_ID":"1000","Ordinal":"Primary"}},"Applicable_Platforms":{"Language":[{"Name":"C","Prevalence":"Often"},{"Name":"C++","Prevalence":"Often"},{"Class":"Compiled","Prevalence":"Undetermined"}]},"Common_Consequences":{"Consequence":{"Scope":["Access Control","Other"],"Impact":["Bypass Protection Mechanism","Other"]}},"Detection_Methods":{"Detection_Method":[{"Method":"Black Box","Description":"This specific weakness is impossible to detect using black box methods. While an analyst could examine memory to see that it has not been scrubbed, an analysis of the executable would not be successful. This is because the compiler has already removed the relevant code. Only the source code shows whether the programmer intended to clear the memory or not, so this weakness is indistinguishable from others."},{"Method":"White Box","Description":"This weakness is only detectable using white box methods (see black box detection factor). Careful analysis is required to determine if the code is likely to be removed by the compiler."}]},"Observed_Examples":{"Observed_Example":[{"Reference":"CVE-2008-1685","Description":"C compiler optimization, as allowed by specifications, removes code that is used to perform checks to detect integer overflows.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2008-1685"},{"Reference":"CVE-2019-1010006","Description":"Chain: compiler optimization (CWE-733) removes or modifies code used to detect integer overflow (CWE-190), allowing out-of-bounds write (CWE-787).","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2019-1010006"}]},"Related_Attack_Patterns":{"Related_Attack_Pattern":[{"CAPEC_ID":"10"},{"CAPEC_ID":"24"},{"CAPEC_ID":"46"},{"CAPEC_ID":"8"},{"CAPEC_ID":"9"}]},"References":{"Reference":{"External_Reference_ID":"REF-7","Section":"Chapter 9, \\"A Compiler Optimization Caveat\\" Page 322"}},"Content_History":{"Submission":{"Submission_Name":"CWE Content Team","Submission_Organization":"MITRE","Submission_Date":"2008-10-01","Submission_Comment":"new weakness-focused entry for Research view closes the gap between 14 and 435."},"Modification":[{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2008-11-24","Modification_Comment":"updated Detection_Factors"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2009-03-10","Modification_Comment":"updated Applicable_Platforms, Observed_Examples, Related_Attack_Patterns, Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2010-02-16","Modification_Comment":"updated References"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-06-01","Modification_Comment":"updated Common_Consequences"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2012-05-11","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2014-07-30","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2017-01-19","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2017-11-08","Modification_Comment":"updated References, Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2018-03-27","Modification_Comment":"updated References, Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-02-24","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-06-25","Modification_Comment":"updated Observed_Examples"}]}},{"ID":"762","Name":"Mismatched Memory Management Routines","Abstraction":"Variant","Structure":"Simple","Status":"Incomplete","Description":"The application attempts to return a memory resource to the system, but it calls a release function that is not compatible with the function that was originally used to allocate that resource.","Extended_Description":{"xhtml:p":["This weakness can be generally described as mismatching memory management routines, such as:","When the memory management functions are mismatched, the consequences may be as severe as code execution, memory corruption, or program crash. Consequences and ease of exploit will vary depending on the implementation of the routines and the object being managed."],"xhtml:div":{"style":"margin-left:10px;","xhtml:ul":{"xhtml:li":["The memory was allocated on the stack (automatically), but it was deallocated using the memory management routine free() (CWE-590), which is intended for explicitly allocated heap memory.","The memory was allocated explicitly using one set of memory management functions, and deallocated using a different set. For example, memory might be allocated with malloc() in C++ instead of the new operator, and then deallocated with the delete operator."]}}},"Related_Weaknesses":{"Related_Weakness":{"Nature":"ChildOf","CWE_ID":"763","View_ID":"1000","Ordinal":"Primary"}},"Applicable_Platforms":{"Language":[{"Name":"C","Prevalence":"Undetermined"},{"Name":"C++","Prevalence":"Undetermined"}]},"Modes_Of_Introduction":{"Introduction":{"Phase":"Implementation"}},"Likelihood_Of_Exploit":"Low","Common_Consequences":{"Consequence":{"Scope":["Integrity","Availability","Confidentiality"],"Impact":["Modify Memory","DoS: Crash, Exit, or Restart","Execute Unauthorized Code or Commands"]}},"Potential_Mitigations":{"Mitigation":[{"Phase":"Implementation","Description":"Only call matching memory management functions. Do not mix and match routines. For example, when you allocate a buffer with malloc(), dispose of the original pointer with free()."},{"Mitigation_ID":"MIT-41","Phase":"Implementation","Strategy":"Libraries or Frameworks","Description":{"xhtml:p":["Choose a language or tool that provides automatic memory management, or makes manual memory management less error-prone.","For example, glibc in Linux provides protection against free of invalid pointers.","When using Xcode to target OS X or iOS, enable automatic reference counting (ARC) [REF-391].","To help correctly and consistently manage memory when programming in C++, consider using a smart pointer class such as std::auto_ptr (defined by ISO/IEC ISO/IEC 14882:2003), std::shared_ptr and std::unique_ptr (specified by an upcoming revision of the C++ standard, informally referred to as C++ 1x), or equivalent solutions such as Boost."]}},{"Mitigation_ID":"MIT-4.6","Phase":"Architecture and Design","Strategy":"Libraries or Frameworks","Description":{"xhtml:p":["Use a vetted library or framework that does not allow this weakness to occur or provides constructs that make this weakness easier to avoid.","For example, glibc in Linux provides protection against free of invalid pointers."]}},{"Phase":"Architecture and Design","Description":"Use a language that provides abstractions for memory allocation and deallocation."},{"Phase":"Testing","Description":"Use a tool that dynamically detects memory management problems, such as valgrind."}]},"Demonstrative_Examples":{"Demonstrative_Example":[{"Demonstrative_Example_ID":"DX-80","Intro_Text":"This example allocates a BarObj object using the new operator in C++, however, the programmer then deallocates the object using free(), which may lead to unexpected behavior.","Example_Code":[{"Nature":"bad","Language":"C++","xhtml:div":{"xhtml:div":{"style":"margin-left:10px;","xhtml:div":{"xhtml:br":[{},{},{},{},{}],"xhtml:i":"/* do some work with ptr here */"}}}},{"Nature":"good","Language":"C++","xhtml:div":{"xhtml:div":{"style":"margin-left:10px;","xhtml:div":{"xhtml:br":[{},{},{},{},{}],"xhtml:i":"/* do some work with ptr here */"}}}}],"Body_Text":"Instead, the programmer should have either created the object with one of the malloc family functions, or else deleted the object with the delete operator."},{"Demonstrative_Example_ID":"DX-85","Intro_Text":"In this example, the program does not use matching functions such as malloc/free, new/delete, and new[]/delete[] to allocate/deallocate the resource.","Example_Code":{"Nature":"bad","Language":"C++","xhtml:div":{"xhtml:div":[{"style":"margin-left:10px;","$t":"void foo();"},{"style":"margin-left:10px;","xhtml:br":[{},{}]}],"xhtml:br":{}}}},{"Demonstrative_Example_ID":"DX-86","Intro_Text":"In this example, the program calls the delete[] function on non-heap memory.","Example_Code":{"Nature":"bad","Language":"C++","xhtml:div":{"xhtml:div":[{"style":"margin-left:10px;","$t":"void foo(bool);"},{"style":"margin-left:10px;","xhtml:div":[{"style":"margin-left:10px;","$t":"11,22"},{"style":"margin-left:10px;","$t":"p = new int[2];"}],"xhtml:br":[{},{},{}]}],"xhtml:br":{}}}}]},"Affected_Resources":{"Affected_Resource":"Memory"},"Taxonomy_Mappings":{"Taxonomy_Mapping":[{"Taxonomy_Name":"CERT C Secure Coding","Entry_ID":"WIN30-C","Entry_Name":"Properly pair allocation and deallocation functions","Mapping_Fit":"Exact"},{"Taxonomy_Name":"Software Fault Patterns","Entry_ID":"SFP12","Entry_Name":"Faulty Memory Release"}]},"References":{"Reference":[{"External_Reference_ID":"REF-657"},{"External_Reference_ID":"REF-480"},{"External_Reference_ID":"REF-391"}]},"Notes":{"Note":{"Type":"Applicable Platform","xhtml:p":"This weakness is possible in any programming language that allows manual management of memory."}},"Content_History":{"Submission":{"Submission_Name":"CWE Content Team","Submission_Organization":"MITRE","Submission_Date":"2009-05-08"},"Modification":[{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2009-12-28","Modification_Comment":"updated Applicable_Platforms, Likelihood_of_Exploit"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2010-06-21","Modification_Comment":"updated Description, Potential_Mitigations"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-06-01","Modification_Comment":"updated Common_Consequences"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-09-13","Modification_Comment":"updated Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2012-05-11","Modification_Comment":"updated Demonstrative_Examples, Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2012-10-30","Modification_Comment":"updated Potential_Mitigations"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2014-02-18","Modification_Comment":"updated Demonstrative_Examples, Potential_Mitigations, References"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2014-07-30","Modification_Comment":"updated Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2017-11-08","Modification_Comment":"updated Applicable_Platforms, References, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2019-01-03","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-02-24","Modification_Comment":"updated Relationships"}],"Contribution":{"Type":"Feedback","Contribution_Name":"Martin Sebor","Contribution_Organization":"Cisco Systems, Inc.","Contribution_Date":"2010-04-30","Contribution_Comment":"Provided improvement to existing Mitigation"}}},{"ID":"781","Name":"Improper Address Validation in IOCTL with METHOD_NEITHER I/O Control Code","Abstraction":"Variant","Structure":"Simple","Status":"Draft","Description":"The software defines an IOCTL that uses METHOD_NEITHER for I/O, but it does not validate or incorrectly validates the addresses that are provided.","Extended_Description":"When an IOCTL uses the METHOD_NEITHER option for I/O control, it is the responsibility of the IOCTL to validate the addresses that have been supplied to it. If validation is missing or incorrect, attackers can supply arbitrary memory addresses, leading to code execution or a denial of service.","Related_Weaknesses":{"Related_Weakness":[{"Nature":"ChildOf","CWE_ID":"1285","View_ID":"1000","Ordinal":"Primary"},{"Nature":"CanPrecede","CWE_ID":"822","View_ID":"1000"}]},"Applicable_Platforms":{"Language":[{"Name":"C","Prevalence":"Often"},{"Name":"C++","Prevalence":"Often"}],"Operating_System":{"Name":"Windows NT","Prevalence":"Sometimes"}},"Modes_Of_Introduction":{"Introduction":[{"Phase":"Architecture and Design"},{"Phase":"Implementation"}]},"Common_Consequences":{"Consequence":{"Scope":["Integrity","Availability","Confidentiality"],"Impact":["Modify Memory","Read Memory","Execute Unauthorized Code or Commands","DoS: Crash, Exit, or Restart"],"Note":"An attacker may be able to access memory that belongs to another process or user. If the attacker can control the contents that the IOCTL writes, it may lead to code execution at high privilege levels. At the least, a crash can occur."}},"Potential_Mitigations":{"Mitigation":[{"Phase":"Implementation","Description":"If METHOD_NEITHER is required for the IOCTL, then ensure that all user-space addresses are properly validated before they are first accessed. The ProbeForRead and ProbeForWrite routines are available for this task. Also properly protect and manage the user-supplied buffers, since the I/O Manager does not do this when METHOD_NEITHER is being used. See References."},{"Phase":"Architecture and Design","Description":"If possible, avoid using METHOD_NEITHER in the IOCTL and select methods that effectively control the buffer size, such as METHOD_BUFFERED, METHOD_IN_DIRECT, or METHOD_OUT_DIRECT."},{"Phase":["Architecture and Design","Implementation"],"Description":"If the IOCTL is part of a driver that is only intended to be accessed by trusted users, then use proper access control for the associated device or device namespace. See References."}]},"Observed_Examples":{"Observed_Example":[{"Reference":"CVE-2006-2373","Description":"Driver for file-sharing and messaging protocol allows attackers to execute arbitrary code.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2006-2373"},{"Reference":"CVE-2009-0686","Description":"Anti-virus product does not validate addresses, allowing attackers to gain SYSTEM privileges.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2009-0686"},{"Reference":"CVE-2009-0824","Description":"DVD software allows attackers to cause a crash.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2009-0824"},{"Reference":"CVE-2008-5724","Description":"Personal firewall allows attackers to gain SYSTEM privileges.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2008-5724"},{"Reference":"CVE-2007-5756","Description":"chain: device driver for packet-capturing software allows access to an unintended IOCTL with resultant array index error.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2007-5756"}]},"References":{"Reference":[{"External_Reference_ID":"REF-696"},{"External_Reference_ID":"REF-697"},{"External_Reference_ID":"REF-698"},{"External_Reference_ID":"REF-699"},{"External_Reference_ID":"REF-700"},{"External_Reference_ID":"REF-701"},{"External_Reference_ID":"REF-702"}]},"Notes":{"Note":[{"Type":"Applicable Platform","xhtml:p":"Because IOCTL functionality is typically performing low-level actions and closely interacts with the operating system, this weakness may only appear in code that is written in low-level languages."},{"Type":"Research Gap","xhtml:p":["While this type of issue has been known since 2006, it is probably still under-studied and under-reported. Most of the focus has been on high-profile software and security products, but other kinds of system software also use drivers. Since exploitation requires the development of custom code, it requires some skill to find this weakness.","Because exploitation typically requires local privileges, it might not be a priority for active attackers. However, remote exploitation may be possible for software such as device drivers. Even when remote vectors are not available, it may be useful as the final privilege-escalation step in multi-stage remote attacks against application-layer software, or as the primary attack by a local user on a multi-user system."]}]},"Content_History":{"Submission":{"Submission_Name":"CWE Content Team","Submission_Organization":"MITRE","Submission_Date":"2009-07-15"},"Modification":[{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2009-12-28","Modification_Comment":"updated Common_Consequences, Potential_Mitigations, References, Time_of_Introduction"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2010-09-27","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-06-01","Modification_Comment":"updated Common_Consequences"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2017-11-08","Modification_Comment":"updated Applicable_Platforms, Likelihood_of_Exploit, References"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-02-24","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-06-25","Modification_Comment":"updated Relationships"}]}},{"ID":"782","Name":"Exposed IOCTL with Insufficient Access Control","Abstraction":"Variant","Structure":"Simple","Status":"Draft","Description":"The software implements an IOCTL with functionality that should be restricted, but it does not properly enforce access control for the IOCTL.","Extended_Description":{"xhtml:p":["When an IOCTL contains privileged functionality and is exposed unnecessarily, attackers may be able to access this functionality by invoking the IOCTL. Even if the functionality is benign, if the programmer has assumed that the IOCTL would only be accessed by a trusted process, there may be little or no validation of the incoming data, exposing weaknesses that would never be reachable if the attacker cannot call the IOCTL directly.","The implementations of IOCTLs will differ between operating system types and versions, so the methods of attack and prevention may vary widely."]},"Related_Weaknesses":{"Related_Weakness":[{"Nature":"ChildOf","CWE_ID":"749","View_ID":"1000","Ordinal":"Primary"},{"Nature":"CanPrecede","CWE_ID":"781","View_ID":"1000"}]},"Applicable_Platforms":{"Language":[{"Name":"C","Prevalence":"Often"},{"Name":"C++","Prevalence":"Often"}],"Operating_System":[{"Class":"Unix","Prevalence":"Undetermined"},{"Class":"Windows","Prevalence":"Undetermined"}]},"Modes_Of_Introduction":{"Introduction":[{"Phase":"Architecture and Design"},{"Phase":"Implementation","Note":"REALIZATION: This weakness is caused during implementation of an architectural security tactic."}]},"Common_Consequences":{"Consequence":{"Scope":["Integrity","Availability","Confidentiality"],"Note":"Attackers can invoke any functionality that the IOCTL offers. Depending on the functionality, the consequences may include code execution, denial-of-service, and theft of data."}},"Potential_Mitigations":{"Mitigation":{"Phase":"Architecture and Design","Description":"In Windows environments, use proper access control for the associated device or device namespace. See References."}},"Observed_Examples":{"Observed_Example":[{"Reference":"CVE-2009-2208","Description":"Operating system does not enforce permissions on an IOCTL that can be used to modify network settings.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2009-2208"},{"Reference":"CVE-2008-3831","Description":"Device driver does not restrict ioctl calls to its master.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2008-3831"},{"Reference":"CVE-2008-3525","Description":"ioctl does not check for a required capability before processing certain requests.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2008-3525"},{"Reference":"CVE-2008-0322","Description":"Chain: insecure device permissions allows access to an IOCTL, allowing arbitrary memory to be overwritten.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2008-0322"},{"Reference":"CVE-2007-4277","Description":"Chain: anti-virus product uses weak permissions for a device, leading to resultant buffer overflow in an exposed IOCTL.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2007-4277"},{"Reference":"CVE-2007-1400","Description":"Chain: sandbox allows opening of a TTY device, enabling shell commands through an exposed ioctl.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2007-1400"},{"Reference":"CVE-2006-4926","Description":"Anti-virus product uses insecure security descriptor for a device driver, allowing access to a privileged IOCTL.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2006-4926"},{"Reference":"CVE-1999-0728","Description":"Unauthorized user can disable keyboard or mouse by directly invoking a privileged IOCTL.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-1999-0728"}]},"References":{"Reference":{"External_Reference_ID":"REF-701"}},"Notes":{"Note":[{"Type":"Relationship","$t":"This can be primary to many other weaknesses when the programmer assumes that the IOCTL can only be accessed by trusted parties. For example, a program or driver might not validate incoming addresses in METHOD_NEITHER IOCTLs in Windows environments (CWE-781), which could allow buffer overflow and similar attacks to take place, even when the attacker never should have been able to access the IOCTL at all."},{"Type":"Applicable Platform","xhtml:p":"Because IOCTL functionality is typically performing low-level actions and closely interacts with the operating system, this weakness may only appear in code that is written in low-level languages."}]},"Content_History":{"Submission":{"Submission_Name":"CWE Content Team","Submission_Organization":"MITRE","Submission_Date":"2009-07-15"},"Modification":[{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2009-12-28","Modification_Comment":"updated Time_of_Introduction"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2017-11-08","Modification_Comment":"updated Likelihood_of_Exploit, Modes_of_Introduction, Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-02-24","Modification_Comment":"updated Relationships"}]}},{"ID":"783","Name":"Operator Precedence Logic Error","Abstraction":"Base","Structure":"Simple","Status":"Draft","Description":"The program uses an expression in which operator precedence causes incorrect logic to be used.","Extended_Description":"While often just a bug, operator precedence logic errors can have serious consequences if they are used in security-critical code, such as making an authentication decision.","Related_Weaknesses":{"Related_Weakness":{"Nature":"ChildOf","CWE_ID":"670","View_ID":"1000","Ordinal":"Primary"}},"Applicable_Platforms":{"Language":[{"Name":"C","Prevalence":"Rarely"},{"Name":"C++","Prevalence":"Rarely"},{"Class":"Language-Independent","Prevalence":"Rarely"}]},"Modes_Of_Introduction":{"Introduction":{"Phase":"Implementation","Note":"Logic errors related to operator precedence may cause problems even during normal operation, so they are probably discovered quickly during the testing phase. If testing is incomplete or there is a strong reliance on manual review of the code, then these errors may not be discovered before the software is deployed."}},"Likelihood_Of_Exploit":"Low","Common_Consequences":{"Consequence":{"Scope":["Confidentiality","Integrity","Availability"],"Impact":["Varies by Context","Unexpected State"],"Note":"The consequences will vary based on the context surrounding the incorrect precedence. In a security decision, integrity or confidentiality are the most likely results. Otherwise, a crash may occur due to the software reaching an unexpected state."}},"Potential_Mitigations":{"Mitigation":{"Phase":"Implementation","Description":"Regularly wrap sub-expressions in parentheses, especially in security-critical code."}},"Demonstrative_Examples":{"Demonstrative_Example":[{"Intro_Text":"In the following example, the method validateUser makes a call to another method to authenticate a username and password for a user and returns a success or failure code.","Example_Code":[{"Nature":"bad","Language":"C","xhtml:div":{"xhtml:br":[{},{},{},{},{}],"xhtml:div":{"style":"margin-left:10px;","xhtml:div":{"xhtml:br":[{},{},{},{},{},{},{},{},{}],"xhtml:i":["// call method to authenticate username and password","// if authentication fails then return failure otherwise return success"],"xhtml:div":[{"style":"margin-left:10px;","$t":"return isUser;"},{"style":"margin-left:10px;","$t":"isUser = SUCCESS;"}]}}}},{"Nature":"good","Language":"C","xhtml:div":{"xhtml:br":[{},{},{},{}]}}],"Body_Text":"However, the method that authenticates the username and password is called within an if statement with incorrect operator precedence logic. Because the comparison operator \\"==\\" has a higher precedence than the assignment operator \\"=\\", the comparison operator will be evaluated first and if the method returns FAIL then the comparison will be true, the return variable will be set to true and SUCCESS will be returned. This operator precedence logic error can be easily resolved by properly using parentheses within the expression of the if statement, as shown below."},{"Intro_Text":"In this example, the method calculates the return on investment for an accounting/financial application. The return on investment is calculated by subtracting the initial investment costs from the current value and then dividing by the initial investment costs.","Example_Code":[{"Nature":"bad","Language":"Java","xhtml:div":{"xhtml:div":{"style":"margin-left:10px;","xhtml:div":{"xhtml:br":[{},{},{},{},{},{}],"xhtml:i":"// calculate return on investment"}}}},{"Nature":"good","Language":"Java","xhtml:div":{"xhtml:br":[{},{},{},{}]}}],"Body_Text":["However, the return on investment calculation will not produce correct results because of the incorrect operator precedence logic in the equation. The divide operator has a higher precedence than the minus operator, therefore the equation will divide the initial investment costs by the initial investment costs which will only subtract one from the current value. Again this operator precedence logic error can be resolved by the correct use of parentheses within the equation, as shown below.","Note that the initialInvestment variable in this example should be validated to ensure that it is greater than zero to avoid a potential divide by zero error (CWE-369)."]}]},"Observed_Examples":{"Observed_Example":[{"Reference":"CVE-2008-2516","Description":"Authentication module allows authentication bypass because it uses \\"(x = call(args) == SUCCESS)\\" instead of \\"((x = call(args)) == SUCCESS)\\".","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2008-2516"},{"Reference":"CVE-2008-0599","Description":"Chain: Language interpreter calculates wrong buffer size (CWE-131) by using \\"size = ptr ? X : Y\\" instead of \\"size = (ptr ? X : Y)\\" expression.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2008-0599"},{"Reference":"CVE-2001-1155","Description":"Chain: product does not properly check the result of a reverse DNS lookup because of operator precedence (CWE-783), allowing bypass of DNS-based access restrictions.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2001-1155"}]},"Taxonomy_Mappings":{"Taxonomy_Mapping":[{"Taxonomy_Name":"CERT C Secure Coding","Entry_ID":"EXP00-C","Entry_Name":"Use parentheses for precedence of operation","Mapping_Fit":"Exact"},{"Taxonomy_Name":"SEI CERT Perl Coding Standard","Entry_ID":"EXP04-PL","Entry_Name":"Do not mix the early-precedence logical operators with late-precedence logical operators","Mapping_Fit":"CWE More Abstract"}]},"References":{"Reference":[{"External_Reference_ID":"REF-704"},{"External_Reference_ID":"REF-62","Section":"Chapter 6, \\"Precedence\\", Page 287"}]},"Content_History":{"Submission":{"Submission_Name":"CWE Content Team","Submission_Organization":"MITRE","Submission_Date":"2009-07-16"},"Modification":[{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2009-12-28","Modification_Comment":"updated Observed_Examples"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-06-27","Modification_Comment":"updated Common_Consequences"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2012-05-11","Modification_Comment":"updated Demonstrative_Examples, References, Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2017-11-08","Modification_Comment":"updated Taxonomy_Mappings, Time_of_Introduction"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2019-01-03","Modification_Comment":"updated Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2019-06-20","Modification_Comment":"updated Type"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-02-24","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-08-20","Modification_Comment":"updated Relationships"}]}},{"ID":"785","Name":"Use of Path Manipulation Function without Maximum-sized Buffer","Abstraction":"Variant","Structure":"Simple","Status":"Incomplete","Description":"The software invokes a function for normalizing paths or file names, but it provides an output buffer that is smaller than the maximum possible size, such as PATH_MAX.","Extended_Description":"Passing an inadequately-sized output buffer to a path manipulation function can result in a buffer overflow. Such functions include realpath(), readlink(), PathAppend(), and others.","Related_Weaknesses":{"Related_Weakness":[{"Nature":"ChildOf","CWE_ID":"676","View_ID":"1000","Ordinal":"Primary"},{"Nature":"ChildOf","CWE_ID":"120","View_ID":"1000"},{"Nature":"ChildOf","CWE_ID":"20","View_ID":"700","Ordinal":"Primary"}]},"Applicable_Platforms":{"Language":[{"Name":"C","Prevalence":"Undetermined"},{"Name":"C++","Prevalence":"Undetermined"}]},"Background_Details":{"Background_Detail":"Windows provides a large number of utility functions that manipulate buffers containing filenames. In most cases, the result is returned in a buffer that is passed in as input. (Usually the filename is modified in place.) Most functions require the buffer to be at least MAX_PATH bytes in length, but you should check the documentation for each function individually. If the buffer is not large enough to store the result of the manipulation, a buffer overflow can occur."},"Modes_Of_Introduction":{"Introduction":{"Phase":"Implementation"}},"Common_Consequences":{"Consequence":{"Scope":["Integrity","Confidentiality","Availability"],"Impact":["Modify Memory","Execute Unauthorized Code or Commands","DoS: Crash, Exit, or Restart"]}},"Potential_Mitigations":{"Mitigation":{"Phase":"Implementation","Description":"Always specify output buffers large enough to handle the maximum-size possible result from path manipulation functions."}},"Demonstrative_Examples":{"Demonstrative_Example":{"Intro_Text":"In this example the function creates a directory named \\"output\\\\<name>\\" in the current directory and returns a heap-allocated copy of its name.","Example_Code":{"Nature":"bad","Language":"C","xhtml:div":{"xhtml:div":{"style":"margin-left:10px;","xhtml:div":{"xhtml:br":[{},{},{},{},{}],"xhtml:div":[{"style":"margin-left:10px;","$t":"return null;"},{"style":"margin-left:10px;","$t":"return null;"},{"style":"margin-left:10px;","xhtml:div":{"xhtml:br":{}}},{"style":"margin-left:10px;","xhtml:div":{"xhtml:br":{}}}]}}}},"Body_Text":"For most values of the current directory and the name parameter, this function will work properly. However, if the name parameter is particularly long, then the second call to PathAppend() could overflow the outputDirectoryName buffer, which is smaller than MAX_PATH bytes."}},"Affected_Resources":{"Affected_Resource":["Memory","File or Directory"]},"Taxonomy_Mappings":{"Taxonomy_Mapping":[{"Taxonomy_Name":"7 Pernicious Kingdoms","Entry_Name":"Often Misused: File System"},{"Taxonomy_Name":"Software Fault Patterns","Entry_ID":"SFP9","Entry_Name":"Faulty String Expansion"}]},"References":{"Reference":{"External_Reference_ID":"REF-6"}},"Notes":{"Note":[{"Type":"Maintenance","$t":"Much of this entry was originally part of CWE-249, which was deprecated for several reasons."},{"Type":"Maintenance","$t":"This entry is at a much lower level of abstraction than most entries because it is function-specific. It also has significant overlap with other entries that can vary depending on the perspective. For example, incorrect usage could trigger either a stack-based overflow (CWE-121) or a heap-based overflow (CWE-122). The CWE team has not decided how to handle such entries."}]},"Content_History":{"Submission":{"Submission_Name":"7 Pernicious Kingdoms","Submission_Date":"2009-07-27","Submission_Comment":"Note: this date reflects when the entry was first published. Draft versions of this entry were provided to members of the CWE community and modified before initial publication."},"Modification":[{"Modification_Name":"Eric Dalci","Modification_Organization":"Cigital","Modification_Date":"2008-07-01","Modification_Comment":"updated Time_of_Introduction"},{"Modification_Organization":"KDM Analytics","Modification_Date":"2008-08-01","Modification_Comment":"added/updated white box definitions"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2008-09-08","Modification_Comment":"updated Applicable_Platforms, Relationships, Other_Notes, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2009-05-27","Modification_Comment":"updated Demonstrative_Examples"},{"Modification_Name":"KDM Analytics","Modification_Date":"2009-07-17","Modification_Comment":"Improved the White_Box_Definition"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-06-01","Modification_Comment":"updated Common_Consequences"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2012-05-11","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2014-07-30","Modification_Comment":"updated Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2017-11-08","Modification_Comment":"updated Affected_Resources, Demonstrative_Examples, Relationships, White_Box_Definitions"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-02-24","Modification_Comment":"updated References, Relationships"}]}},{"ID":"787","Name":"Out-of-bounds Write","Abstraction":"Base","Structure":"Simple","Status":"Draft","Description":"The software writes data past the end, or before the beginning, of the intended buffer.","Extended_Description":"Typically, this can result in corruption of data, a crash, or code execution.  The software may modify an index or perform pointer arithmetic that references a memory location that is outside of the boundaries of the buffer.  A subsequent write operation then produces undefined or unexpected results.","Related_Weaknesses":{"Related_Weakness":[{"Nature":"ChildOf","CWE_ID":"119","View_ID":"1000","Ordinal":"Primary"},{"Nature":"ChildOf","CWE_ID":"119","View_ID":"1003","Ordinal":"Primary"},{"Nature":"ChildOf","CWE_ID":"119","View_ID":"1305","Ordinal":"Primary"}]},"Applicable_Platforms":{"Language":[{"Name":"C","Prevalence":"Often"},{"Name":"C++","Prevalence":"Often"},{"Class":"Assembly","Prevalence":"Undetermined"}]},"Alternate_Terms":{"Alternate_Term":{"Term":"Memory Corruption","Description":"The generic term \\"memory corruption\\" is often used to describe the consequences of writing to memory outside the bounds of a buffer, or to memory that is invalid, when the root cause is something other than a sequential copy of excessive data from a fixed starting location. This may include issues such as incorrect pointer arithmetic, accessing invalid pointers due to incomplete initialization or memory release, etc."}},"Modes_Of_Introduction":{"Introduction":{"Phase":"Implementation"}},"Likelihood_Of_Exploit":"High","Common_Consequences":{"Consequence":{"Scope":["Integrity","Availability"],"Impact":["Modify Memory","DoS: Crash, Exit, or Restart","Execute Unauthorized Code or Commands"]}},"Detection_Methods":{"Detection_Method":[{"Detection_Method_ID":"DM-1","Method":"Automated Static Analysis","Description":{"xhtml:p":["This weakness can often be detected using automated static analysis tools. Many modern tools use data flow analysis or constraint-based techniques to minimize the number of false positives.","Automated static analysis generally does not account for environmental considerations when reporting out-of-bounds memory operations. This can make it difficult for users to determine which warnings should be investigated first. For example, an analysis tool might report buffer overflows that originate from command line arguments in a program that is not expected to run with setuid or other special privileges."]},"Effectiveness":"High","Effectiveness_Notes":"Detection techniques for buffer-related errors are more mature than for most other weakness types."},{"Detection_Method_ID":"DM-2","Method":"Automated Dynamic Analysis","Description":"This weakness can be detected using dynamic tools and techniques that interact with the software using large test suites with many diverse inputs, such as fuzz testing (fuzzing), robustness testing, and fault injection. The software\'s operation may slow down, but it should not become unstable, crash, or generate incorrect results."}]},"Potential_Mitigations":{"Mitigation":[{"Mitigation_ID":"MIT-3","Phase":"Requirements","Strategy":"Language Selection","Description":{"xhtml:p":["Use a language that does not allow this weakness to occur or provides constructs that make this weakness easier to avoid.","For example, many languages that perform their own memory management, such as Java and Perl, are not subject to buffer overflows. Other languages, such as Ada and C#, typically provide overflow protection, but the protection can be disabled by the programmer.","Be wary that a language\'s interface to native code may still be subject to overflows, even if the language itself is theoretically safe."]}},{"Mitigation_ID":"MIT-4.1","Phase":"Architecture and Design","Strategy":"Libraries or Frameworks","Description":{"xhtml:p":["Use a vetted library or framework that does not allow this weakness to occur or provides constructs that make this weakness easier to avoid.","Examples include the Safe C String Library (SafeStr) by Messier and Viega [REF-57], and the Strsafe.h library from Microsoft [REF-56]. These libraries provide safer versions of overflow-prone string-handling functions."]},"Effectiveness_Notes":"This is not a complete solution, since many buffer overflows are not related to strings."},{"Mitigation_ID":"MIT-10","Phase":"Build and Compilation","Strategy":"Compilation or Build Hardening","Description":{"xhtml:p":["Run or compile the software using features or extensions that automatically provide a protection mechanism that mitigates or eliminates buffer overflows.","For example, certain compilers and extensions provide automatic buffer overflow detection mechanisms that are built into the compiled code. Examples include the Microsoft Visual Studio /GS flag, Fedora/Red Hat FORTIFY_SOURCE GCC flag, StackGuard, and ProPolice."]},"Effectiveness":"Defense in Depth","Effectiveness_Notes":"This is not necessarily a complete solution, since these mechanisms can only detect certain types of overflows. In addition, an attack could still cause a denial of service, since the typical response is to exit the application."},{"Mitigation_ID":"MIT-9","Phase":"Implementation","Description":{"xhtml:p":"Consider adhering to the following rules when allocating and managing an application\'s memory:","xhtml:div":{"style":"margin-left:10px;","xhtml:ul":{"xhtml:li":["Double check that your buffer is as large as you specify.","When using functions that accept a number of bytes to copy, such as strncpy(), be aware that if the destination buffer size is equal to the source buffer size, it may not NULL-terminate the string.","Check buffer boundaries if accessing the buffer in a loop and make sure you are not in danger of writing past the allocated space.","If necessary, truncate all input strings to a reasonable length before passing them to the copy and concatenation functions."]}}}},{"Mitigation_ID":"MIT-11","Phase":"Operation","Strategy":"Environment Hardening","Description":{"xhtml:p":["Run or compile the software using features or extensions that randomly arrange the positions of a program\'s executable and libraries in memory. Because this makes the addresses unpredictable, it can prevent an attacker from reliably jumping to exploitable code.","Examples include Address Space Layout Randomization (ASLR) [REF-58] [REF-60] and Position-Independent Executables (PIE) [REF-64]."]},"Effectiveness":"Defense in Depth","Effectiveness_Notes":"This is not a complete solution. However, it forces the attacker to guess an unknown value that changes every program execution. In addition, an attack could still cause a denial of service, since the typical response is to exit the application."},{"Mitigation_ID":"MIT-12","Phase":"Operation","Strategy":"Environment Hardening","Description":"Use a CPU and operating system that offers Data Execution Protection (NX) or its equivalent [REF-60] [REF-61].","Effectiveness":"Defense in Depth","Effectiveness_Notes":"This is not a complete solution, since buffer overflows could be used to overwrite nearby variables to modify the software\'s state in dangerous ways. In addition, it cannot be used in cases in which self-modifying code is required. Finally, an attack could still cause a denial of service, since the typical response is to exit the application."},{"Mitigation_ID":"MIT-13","Phase":"Implementation","Description":"Replace unbounded copy functions with analogous functions that support length arguments, such as strcpy with strncpy. Create these if they are not available.","Effectiveness":"Moderate","Effectiveness_Notes":"This approach is still susceptible to calculation errors, including issues such as off-by-one errors (CWE-193) and incorrectly calculating buffer lengths (CWE-131)."}]},"Demonstrative_Examples":{"Demonstrative_Example":[{"Intro_Text":"The following code attempts to save four different identification numbers into an array.","Example_Code":{"Nature":"bad","Language":"C","xhtml:div":{"xhtml:br":[{},{},{},{},{},{},{}]}},"Body_Text":"Since the array is only allocated to hold three elements, the valid indices are 0 to 2; so, the assignment to id_sequence[3] is out of bounds."},{"Demonstrative_Example_ID":"DX-114","Intro_Text":"In the following example, it is possible to request that memcpy move a much larger segment of memory than assumed:","Example_Code":{"Nature":"bad","Language":"C","xhtml:div":{"xhtml:div":[{"style":"margin-left:10px;","xhtml:div":{"xhtml:br":[{},{},{},{},{},{}],"xhtml:i":["/* if chunk info is valid, return the size of usable memory,","* else, return -1 to indicate an error","*/"]}},{"style":"margin-left:10px;","xhtml:br":[{},{}]}],"xhtml:br":{}}},"Body_Text":"If returnChunkSize() happens to encounter an error it will return -1. Notice that the return value is not checked before the memcpy operation (CWE-252), so -1 can be passed as the size argument to memcpy() (CWE-805). Because memcpy() assumes that the value is unsigned, it will be interpreted as MAXINT-1 (CWE-195), and therefore will copy far more memory than is likely available to the destination buffer (CWE-787, CWE-788)."},{"Demonstrative_Example_ID":"DX-1","Intro_Text":"This example takes an IP address from a user, verifies that it is well formed and then looks up the hostname and copies it into a buffer.","Example_Code":{"Nature":"bad","Language":"C","xhtml:div":{"xhtml:div":{"style":"margin-left:10px;","xhtml:div":{"xhtml:br":[{},{},{},{},{},{},{},{},{},{}],"xhtml:i":"/*routine that ensures user_supplied_addr is in the right format for conversion */"}}}},"Body_Text":["This function allocates a buffer of 64 bytes to store the hostname, however there is no guarantee that the hostname will not be larger than 64 bytes. If an attacker specifies an address which resolves to a very large hostname, then we may overwrite sensitive data or even relinquish control flow to the attacker.","Note that this example also contains an unchecked return value (CWE-252) that can lead to a NULL pointer dereference (CWE-476)."]},{"Demonstrative_Example_ID":"DX-19","Intro_Text":"This example applies an encoding procedure to an input string and stores it into a buffer.","Example_Code":{"Nature":"bad","Language":"C","xhtml:div":{"xhtml:div":{"style":"margin-left:10px;","xhtml:div":{"xhtml:br":[{},{},{},{},{}],"xhtml:div":[{"style":"margin-left:10px;","$t":"die(\\"user string too long, die evil hacker!\\");"},{"style":"margin-left:10px;","xhtml:div":{"xhtml:div":[{"style":"margin-left:10px;","xhtml:br":[{},{},{},{}]},{"style":"margin-left:10px;","xhtml:div":{"xhtml:br":[{},{}],"xhtml:i":"/* encode to &lt; */"}}],"xhtml:br":[{},{}]}}]}}}},"Body_Text":"The programmer attempts to encode the ampersand character in the user-controlled string, however the length of the string is validated before the encoding procedure is applied. Furthermore, the programmer assumes encoding expansion will only expand a given character by a factor of 4, while the encoding of the ampersand expands by 5. As a result, when the encoding procedure expands the string it is possible to overflow the destination buffer if the attacker provides a string of many ampersands."},{"Demonstrative_Example_ID":"DX-87","Intro_Text":"In the following C/C++ example, a utility function is used to trim trailing whitespace from a character string. The function copies the input string to a local character string and uses a while statement to remove the trailing whitespace by moving backward through the string and overwriting whitespace with a NUL character.","Example_Code":{"Nature":"bad","Language":"C","xhtml:div":{"xhtml:div":{"style":"margin-left:10px;","xhtml:div":{"xhtml:br":[{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}],"xhtml:i":["// copy input string to a temporary string","// trim trailing whitespace","// return string without trailing whitespace"],"xhtml:div":[{"style":"margin-left:10px;","$t":"message[index] = strMessage[index];"},{"style":"margin-left:10px;","xhtml:br":{}}]}}}},"Body_Text":"However, this function can cause a buffer underwrite if the input character string contains all whitespace. On some systems the while statement will move backwards past the beginning of a character string and will call the isspace() function on an address outside of the bounds of the local buffer."},{"Demonstrative_Example_ID":"DX-88","Intro_Text":"The following is an example of code that may result in a buffer underwrite, if find() returns a negative value to indicate that ch is not found in srcBuf:","Example_Code":{"Nature":"bad","Language":"C","xhtml:div":{"xhtml:div":{"style":"margin-left:10px;","xhtml:br":[{},{}]}}},"Body_Text":"If the index to srcBuf is somehow under user control, this is an arbitrary write-what-where condition."}]},"Observed_Examples":{"Observed_Example":[{"Reference":"CVE-2020-0022","Description":"chain: mobile phone Bluetooth implementation does not include offset when calculating packet length (CWE-682), leading to out-of-bounds write (CWE-787)","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2004-1363"},{"Reference":"CVE-2019-1010006","Description":"Chain: compiler optimization (CWE-733) removes or modifies code used to detect integer overflow (CWE-190), allowing out-of-bounds write (CWE-787).","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2019-1010006"},{"Reference":"CVE-2009-1532","Description":"malformed inputs cause accesses of uninitialized or previously-deleted objects, leading to memory corruption","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2009-1532"},{"Reference":"CVE-2009-0269","Description":"chain: -1 value from a function call was intended to indicate an error, but is used as an array index instead.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2009-0269"},{"Reference":"CVE-2002-2227","Description":"Unchecked length of SSLv2 challenge value leads to buffer underflow.","Link":"http://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2002-2227"},{"Reference":"CVE-2007-4580","Description":"Buffer underflow from a small size value with a large buffer (length parameter inconsistency, CWE-130)","Link":"http://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2007-4580"},{"Reference":"CVE-2007-4268","Description":"Chain: integer signedness error (CWE-195) passes signed comparison, leading to heap overflow (CWE-122)","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2007-4268"},{"Reference":"CVE-2009-2550","Description":"Classic stack-based buffer overflow in media player using a long entry in a playlist","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2009-2550"},{"Reference":"CVE-2009-2403","Description":"Heap-based buffer overflow in media player using a long entry in a playlist","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2009-2403"}]},"References":{"Reference":[{"External_Reference_ID":"REF-1029"},{"External_Reference_ID":"REF-7","Section":"Chapter 5, \\"Stack Overruns\\" Page 129"},{"External_Reference_ID":"REF-7","Section":"Chapter 5, \\"Heap Overruns\\" Page 138"},{"External_Reference_ID":"REF-44","Section":"\\"Sin 5: Buffer Overruns.\\" Page 89"},{"External_Reference_ID":"REF-62","Section":"Chapter 3, \\"Nonexecutable Stack\\", Page 76"},{"External_Reference_ID":"REF-62","Section":"Chapter 5, \\"Protection Mechanisms\\", Page 189"},{"External_Reference_ID":"REF-90"},{"External_Reference_ID":"REF-56"},{"External_Reference_ID":"REF-57"},{"External_Reference_ID":"REF-58"},{"External_Reference_ID":"REF-60"},{"External_Reference_ID":"REF-61"},{"External_Reference_ID":"REF-64"}]},"Content_History":{"Submission":{"Submission_Name":"CWE Content Team","Submission_Organization":"MITRE","Submission_Date":"2009-10-21"},"Modification":[{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2010-02-16","Modification_Comment":"updated Demonstrative_Examples"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2010-09-27","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-06-01","Modification_Comment":"updated Common_Consequences"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2014-06-23","Modification_Comment":"updated Demonstrative_Examples"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2015-12-07","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2018-03-27","Modification_Comment":"updated Description"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2019-09-19","Modification_Comment":"updated Applicable_Platforms, Demonstrative_Examples, Detection_Factors, Likelihood_of_Exploit, Observed_Examples, Potential_Mitigations, References, Relationships, Time_of_Introduction"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-02-24","Modification_Comment":"updated Observed_Examples, Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-06-25","Modification_Comment":"updated Observed_Examples"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-08-20","Modification_Comment":"updated Alternate_Terms, Demonstrative_Examples, Observed_Examples, Relationships"}]}},{"ID":"789","Name":"Uncontrolled Memory Allocation","Abstraction":"Variant","Structure":"Simple","Status":"Draft","Description":"The product allocates memory based on an untrusted size value, but it does not validate or incorrectly validates the size, allowing arbitrary amounts of memory to be allocated.","Related_Weaknesses":{"Related_Weakness":[{"Nature":"ChildOf","CWE_ID":"770","View_ID":"1000","Ordinal":"Primary"},{"Nature":"ChildOf","CWE_ID":"1284","View_ID":"1000"},{"Nature":"CanPrecede","CWE_ID":"476","View_ID":"1000"}]},"Weakness_Ordinalities":{"Weakness_Ordinality":[{"Ordinality":"Primary"},{"Ordinality":"Resultant"}]},"Applicable_Platforms":{"Language":[{"Name":"C","Prevalence":"Undetermined"},{"Name":"C++","Prevalence":"Undetermined"},{"Class":"Language-Independent","Prevalence":"Undetermined"}]},"Modes_Of_Introduction":{"Introduction":[{"Phase":"Implementation"},{"Phase":"Architecture and Design"}]},"Likelihood_Of_Exploit":"Low","Common_Consequences":{"Consequence":{"Scope":"Availability","Impact":"DoS: Resource Consumption (Memory)","Note":"Not controlling memory allocation can result in a request for too much system memory, possibly leading to a crash of the application due to out-of-memory conditions, or the consumption of a large amount of memory on the system."}},"Potential_Mitigations":{"Mitigation":[{"Phase":["Implementation","Architecture and Design"],"Description":"Perform adequate input validation against any value that influences the amount of memory that is allocated. Define an appropriate strategy for handling requests that exceed the limit, and consider supporting a configuration option so that the administrator can extend the amount of memory to be used if necessary."},{"Phase":"Operation","Description":"Run your program using system-provided resource limits for memory. This might still cause the program to crash or exit, but the impact to the rest of the system will be minimized."}]},"Demonstrative_Examples":{"Demonstrative_Example":[{"Intro_Text":"Consider the following code, which accepts an untrusted size value and allocates a buffer to contain a string of the given size.","Example_Code":{"Nature":"bad","Language":"C","xhtml:div":{"xhtml:br":[{},{},{},{},{}],"xhtml:i":"/* ignore integer overflow (CWE-190) for this example */"}},"Body_Text":["Suppose an attacker provides a size value of:",{"xhtml:div":{"$t":"","xhtml:div":"12345678"}},"This will cause 305,419,896 bytes (over 291 megabytes) to be allocated for the string."]},{"Intro_Text":"Consider the following code, which accepts an untrusted size value and uses the size as an initial capacity for a HashMap.","Example_Code":{"Nature":"bad","Language":"Java","xhtml:div":{"xhtml:br":{}}},"Body_Text":"The HashMap constructor will verify that the initial capacity is not negative, however there is no check in place to verify that sufficient memory is present. If the attacker provides a large enough value, the application will run into an OutOfMemoryError."},{"Intro_Text":"The following code obtains an untrusted number that it used as an index into an array of messages.","Example_Code":{"Nature":"bad","Language":"Perl","xhtml:div":{"xhtml:br":[{},{},{}]}},"Body_Text":["The index is not validated at all (CWE-129), so it might be possible for an attacker to modify an element in @messages that was not intended. If an index is used that is larger than the current size of the array, the Perl interpreter automatically expands the array so that the large index works.","If $num is a large value such as 2147483648 (1<<31), then the assignment to $messages[$num] would attempt to create a very large array, then eventually produce an error message such as:","Out of memory during array extend","This memory exhaustion will cause the Perl program to exit, possibly a denial of service. In addition, the lack of memory could also prevent many other programs from successfully running on the system."]}]},"Observed_Examples":{"Observed_Example":[{"Reference":"CVE-2008-1708","Description":"memory consumption and daemon exit by specifying a large value in a length field","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2008-1708"},{"Reference":"CVE-2008-0977","Description":"large value in a length field leads to memory consumption and crash when no more memory is available","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2008-0977"},{"Reference":"CVE-2006-3791","Description":"large key size in game program triggers crash when a resizing function cannot allocate enough memory","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2006-3791"},{"Reference":"CVE-2004-2589","Description":"large Content-Length HTTP header value triggers application crash in instant messaging application due to failure in memory allocation","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2004-2589"}]},"Taxonomy_Mappings":{"Taxonomy_Mapping":[{"Taxonomy_Name":"WASC","Entry_ID":"35","Entry_Name":"SOAP Array Abuse"},{"Taxonomy_Name":"CERT C Secure Coding","Entry_ID":"MEM35-C","Entry_Name":"Allocate sufficient memory for an object","Mapping_Fit":"Imprecise"},{"Taxonomy_Name":"SEI CERT Perl Coding Standard","Entry_ID":"IDS32-PL","Entry_Name":"Validate any integer that is used as an array index","Mapping_Fit":"Imprecise"},{"Taxonomy_Name":"OMG ASCSM","Entry_ID":"ASCSM-CWE-789"}]},"References":{"Reference":[{"External_Reference_ID":"REF-62","Section":"Chapter 10, \\"Resource Limits\\", Page 574"},{"External_Reference_ID":"REF-962","Section":"ASCSM-CWE-789"}]},"Notes":{"Note":[{"Type":"Relationship","$t":"This weakness can be closely associated with integer overflows (CWE-190). Integer overflow attacks would concentrate on providing an extremely large number that triggers an overflow that causes less memory to be allocated than expected. By providing a large value that does not trigger an integer overflow, the attacker could still cause excessive amounts of memory to be allocated."},{"Type":"Applicable Platform","xhtml:p":"Uncontrolled memory allocation is possible in many languages, such as dynamic array allocation in perl or initial size parameters in Collections in Java. However, languages like C and C++ where programmers have the power to more directly control memory management will be more susceptible."}]},"Content_History":{"Submission":{"Submission_Name":"CWE Content Team","Submission_Organization":"MITRE","Submission_Date":"2009-10-21"},"Modification":[{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2010-02-16","Modification_Comment":"updated Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-03-29","Modification_Comment":"updated Common_Consequences, Observed_Examples"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-06-01","Modification_Comment":"updated Common_Consequences"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2012-05-11","Modification_Comment":"updated References"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2017-11-08","Modification_Comment":"updated Applicable_Platforms, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2019-01-03","Modification_Comment":"updated References, Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2019-06-20","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-02-24","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-06-25","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-08-20","Modification_Comment":"updated Relationships"}]}},{"ID":"805","Name":"Buffer Access with Incorrect Length Value","Abstraction":"Base","Structure":"Simple","Status":"Incomplete","Description":"The software uses a sequential operation to read or write a buffer, but it uses an incorrect length value that causes it to access memory that is outside of the bounds of the buffer.","Extended_Description":"When the length value exceeds the size of the destination, a buffer overflow could occur.","Related_Weaknesses":{"Related_Weakness":[{"Nature":"ChildOf","CWE_ID":"119","View_ID":"1000","Ordinal":"Primary"},{"Nature":"ChildOf","CWE_ID":"119","View_ID":"1305","Ordinal":"Primary"}]},"Weakness_Ordinalities":{"Weakness_Ordinality":[{"Ordinality":"Resultant"},{"Ordinality":"Primary"}]},"Applicable_Platforms":{"Language":[{"Name":"C","Prevalence":"Often"},{"Name":"C++","Prevalence":"Often"},{"Class":"Assembly","Prevalence":"Undetermined"}]},"Modes_Of_Introduction":{"Introduction":{"Phase":"Implementation"}},"Likelihood_Of_Exploit":"High","Common_Consequences":{"Consequence":[{"Scope":["Integrity","Confidentiality","Availability"],"Impact":["Read Memory","Modify Memory","Execute Unauthorized Code or Commands"],"Note":"Buffer overflows often can be used to execute arbitrary code, which is usually outside the scope of a program\'s implicit security policy. This can often be used to subvert any other security service."},{"Scope":"Availability","Impact":["Modify Memory","DoS: Crash, Exit, or Restart","DoS: Resource Consumption (CPU)"],"Note":"Buffer overflows generally lead to crashes. Other attacks leading to lack of availability are possible, including putting the program into an infinite loop."}]},"Detection_Methods":{"Detection_Method":[{"Detection_Method_ID":"DM-1","Method":"Automated Static Analysis","Description":{"xhtml:p":["This weakness can often be detected using automated static analysis tools. Many modern tools use data flow analysis or constraint-based techniques to minimize the number of false positives.","Automated static analysis generally does not account for environmental considerations when reporting out-of-bounds memory operations. This can make it difficult for users to determine which warnings should be investigated first. For example, an analysis tool might report buffer overflows that originate from command line arguments in a program that is not expected to run with setuid or other special privileges."]},"Effectiveness":"High","Effectiveness_Notes":"Detection techniques for buffer-related errors are more mature than for most other weakness types."},{"Detection_Method_ID":"DM-2","Method":"Automated Dynamic Analysis","Description":"This weakness can be detected using dynamic tools and techniques that interact with the software using large test suites with many diverse inputs, such as fuzz testing (fuzzing), robustness testing, and fault injection. The software\'s operation may slow down, but it should not become unstable, crash, or generate incorrect results.","Effectiveness":"Moderate","Effectiveness_Notes":"Without visibility into the code, black box methods may not be able to sufficiently distinguish this weakness from others, requiring manual methods to diagnose the underlying problem."},{"Detection_Method_ID":"DM-9","Method":"Manual Analysis","Description":"Manual analysis can be useful for finding this weakness, but it might not achieve desired code coverage within limited time constraints. This becomes difficult for weaknesses that must be considered for all inputs, since the attack surface can be too large."}]},"Potential_Mitigations":{"Mitigation":[{"Mitigation_ID":"MIT-3","Phase":"Requirements","Strategy":"Language Selection","Description":{"xhtml:p":["Use a language that does not allow this weakness to occur or provides constructs that make this weakness easier to avoid.","For example, many languages that perform their own memory management, such as Java and Perl, are not subject to buffer overflows. Other languages, such as Ada and C#, typically provide overflow protection, but the protection can be disabled by the programmer.","Be wary that a language\'s interface to native code may still be subject to overflows, even if the language itself is theoretically safe."]}},{"Mitigation_ID":"MIT-4.1","Phase":"Architecture and Design","Strategy":"Libraries or Frameworks","Description":{"xhtml:p":["Use a vetted library or framework that does not allow this weakness to occur or provides constructs that make this weakness easier to avoid.","Examples include the Safe C String Library (SafeStr) by Messier and Viega [REF-57], and the Strsafe.h library from Microsoft [REF-56]. These libraries provide safer versions of overflow-prone string-handling functions."]},"Effectiveness_Notes":"This is not a complete solution, since many buffer overflows are not related to strings."},{"Mitigation_ID":"MIT-10","Phase":"Build and Compilation","Strategy":"Compilation or Build Hardening","Description":{"xhtml:p":["Run or compile the software using features or extensions that automatically provide a protection mechanism that mitigates or eliminates buffer overflows.","For example, certain compilers and extensions provide automatic buffer overflow detection mechanisms that are built into the compiled code. Examples include the Microsoft Visual Studio /GS flag, Fedora/Red Hat FORTIFY_SOURCE GCC flag, StackGuard, and ProPolice."]},"Effectiveness":"Defense in Depth","Effectiveness_Notes":"This is not necessarily a complete solution, since these mechanisms can only detect certain types of overflows. In addition, an attack could still cause a denial of service, since the typical response is to exit the application."},{"Mitigation_ID":"MIT-9","Phase":"Implementation","Description":{"xhtml:p":"Consider adhering to the following rules when allocating and managing an application\'s memory:","xhtml:div":{"style":"margin-left:10px;","xhtml:ul":{"xhtml:li":["Double check that your buffer is as large as you specify.","When using functions that accept a number of bytes to copy, such as strncpy(), be aware that if the destination buffer size is equal to the source buffer size, it may not NULL-terminate the string.","Check buffer boundaries if accessing the buffer in a loop and make sure you are not in danger of writing past the allocated space.","If necessary, truncate all input strings to a reasonable length before passing them to the copy and concatenation functions."]}}}},{"Mitigation_ID":"MIT-15","Phase":"Architecture and Design","Description":"For any security checks that are performed on the client side, ensure that these checks are duplicated on the server side, in order to avoid CWE-602. Attackers can bypass the client-side checks by modifying values after the checks have been performed, or by changing the client to remove the client-side checks entirely. Then, these modified values would be submitted to the server."},{"Mitigation_ID":"MIT-11","Phase":"Operation","Strategy":"Environment Hardening","Description":{"xhtml:p":["Run or compile the software using features or extensions that randomly arrange the positions of a program\'s executable and libraries in memory. Because this makes the addresses unpredictable, it can prevent an attacker from reliably jumping to exploitable code.","Examples include Address Space Layout Randomization (ASLR) [REF-58] [REF-60] and Position-Independent Executables (PIE) [REF-64]."]},"Effectiveness":"Defense in Depth","Effectiveness_Notes":"This is not a complete solution. However, it forces the attacker to guess an unknown value that changes every program execution. In addition, an attack could still cause a denial of service, since the typical response is to exit the application."},{"Mitigation_ID":"MIT-12","Phase":"Operation","Strategy":"Environment Hardening","Description":"Use a CPU and operating system that offers Data Execution Protection (NX) or its equivalent [REF-59] [REF-57].","Effectiveness":"Defense in Depth","Effectiveness_Notes":"This is not a complete solution, since buffer overflows could be used to overwrite nearby variables to modify the software\'s state in dangerous ways. In addition, it cannot be used in cases in which self-modifying code is required. Finally, an attack could still cause a denial of service, since the typical response is to exit the application."},{"Mitigation_ID":"MIT-17","Phase":["Architecture and Design","Operation"],"Strategy":"Environment Hardening","Description":"Run your code using the lowest privileges that are required to accomplish the necessary tasks [REF-76]. If possible, create isolated accounts with limited privileges that are only used for a single task. That way, a successful attack will not immediately give the attacker access to the rest of the software or its environment. For example, database applications rarely need to run as the database administrator, especially in day-to-day operations."},{"Mitigation_ID":"MIT-22","Phase":["Architecture and Design","Operation"],"Strategy":"Sandbox or Jail","Description":{"xhtml:p":["Run the code in a \\"jail\\" or similar sandbox environment that enforces strict boundaries between the process and the operating system. This may effectively restrict which files can be accessed in a particular directory or which commands can be executed by the software.","OS-level examples include the Unix chroot jail, AppArmor, and SELinux. In general, managed code may provide some protection. For example, java.io.FilePermission in the Java SecurityManager allows the software to specify restrictions on file operations.","This may not be a feasible solution, and it only limits the impact to the operating system; the rest of the application may still be subject to compromise.","Be careful to avoid CWE-243 and other weaknesses related to jails."]},"Effectiveness":"Limited","Effectiveness_Notes":"The effectiveness of this mitigation depends on the prevention capabilities of the specific sandbox or jail being used and might only help to reduce the scope of an attack, such as restricting the attacker to certain system calls or limiting the portion of the file system that can be accessed."}]},"Demonstrative_Examples":{"Demonstrative_Example":[{"Demonstrative_Example_ID":"DX-1","Intro_Text":"This example takes an IP address from a user, verifies that it is well formed and then looks up the hostname and copies it into a buffer.","Example_Code":{"Nature":"bad","Language":"C","xhtml:div":{"xhtml:div":{"style":"margin-left:10px;","xhtml:div":{"xhtml:br":[{},{},{},{},{},{},{},{},{},{}],"xhtml:i":"/*routine that ensures user_supplied_addr is in the right format for conversion */"}}}},"Body_Text":["This function allocates a buffer of 64 bytes to store the hostname under the assumption that the maximum length value of hostname is 64 bytes, however there is no guarantee that the hostname will not be larger than 64 bytes. If an attacker specifies an address which resolves to a very large hostname, then we may overwrite sensitive data or even relinquish control flow to the attacker.","Note that this example also contains an unchecked return value (CWE-252) that can lead to a NULL pointer dereference (CWE-476)."]},{"Demonstrative_Example_ID":"DX-114","Intro_Text":"In the following example, it is possible to request that memcpy move a much larger segment of memory than assumed:","Example_Code":{"Nature":"bad","Language":"C","xhtml:div":{"xhtml:div":[{"style":"margin-left:10px;","xhtml:div":{"xhtml:br":[{},{},{},{},{},{}],"xhtml:i":["/* if chunk info is valid, return the size of usable memory,","* else, return -1 to indicate an error","*/"]}},{"style":"margin-left:10px;","xhtml:br":[{},{}]}],"xhtml:br":{}}},"Body_Text":"If returnChunkSize() happens to encounter an error it will return -1. Notice that the return value is not checked before the memcpy operation (CWE-252), so -1 can be passed as the size argument to memcpy() (CWE-805). Because memcpy() assumes that the value is unsigned, it will be interpreted as MAXINT-1 (CWE-195), and therefore will copy far more memory than is likely available to the destination buffer (CWE-787, CWE-788)."},{"Intro_Text":"In the following example, the source character string is copied to the dest character string using the method strncpy.","Example_Code":[{"Nature":"bad","Language":"C","xhtml:div":{"xhtml:br":[{},{},{},{}]}},{"Nature":"good","Language":"C","xhtml:div":{"xhtml:br":[{},{},{},{}]}}],"Body_Text":"However, in the call to strncpy the source character string is used within the sizeof call to determine the number of characters to copy. This will create a buffer overflow as the size of the source character string is greater than the dest character string. The dest character string should be used within the sizeof call to ensure that the correct number of characters are copied, as shown below."},{"Intro_Text":"In this example, the method outputFilenameToLog outputs a filename to a log file. The method arguments include a pointer to a character string containing the file name and an integer for the number of characters in the string. The filename is copied to a buffer where the buffer size is set to a maximum size for inputs to the log file. The method then calls another method to save the contents of the buffer to the log file.","Example_Code":[{"Nature":"bad","Language":"C","xhtml:div":{"xhtml:br":[{},{},{}],"xhtml:i":"// saves the file name to a log file","xhtml:div":{"style":"margin-left:10px;","xhtml:div":{"xhtml:br":[{},{},{},{},{},{},{},{},{},{},{}],"xhtml:i":["// buffer with size set to maximum size for input to log file","// copy filename to buffer","// save to log file"]}}}},{"Nature":"good","Language":"C","xhtml:div":{"xhtml:br":[{},{},{}],"xhtml:i":"// copy filename to buffer"}}],"Body_Text":"However, in this case the string copy method, strncpy, mistakenly uses the length method argument to determine the number of characters to copy rather than using the size of the local character string, buf. This can lead to a buffer overflow if the number of characters contained in character string pointed to by filename is larger then the number of characters allowed for the local character string. The string copy method should use the buf character string within a sizeof call to ensure that only characters up to the size of the buf array are copied to avoid a buffer overflow, as shown below."}]},"Observed_Examples":{"Observed_Example":[{"Reference":"CVE-2011-1959","Description":"Chain: large length value causes buffer over-read (CWE-126)","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2011-1959"},{"Reference":"CVE-2011-1848","Description":"Use of packet length field to make a calculation, then copy into a fixed-size buffer","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2011-1848"},{"Reference":"CVE-2011-0105","Description":"Chain: retrieval of length value from an uninitialized memory location","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2011-0105"},{"Reference":"CVE-2011-0606","Description":"Crafted length value in document reader leads to buffer overflow","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2011-0606"},{"Reference":"CVE-2011-0651","Description":"SSL server overflow when the sum of multiple length fields exceeds a given value","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2011-0651"},{"Reference":"CVE-2010-4156","Description":"Language interpreter API function doesn\'t validate length argument, leading to information exposure","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2010-4156"}]},"Affected_Resources":{"Affected_Resource":"Memory"},"Taxonomy_Mappings":{"Taxonomy_Mapping":{"Taxonomy_Name":"CERT C Secure Coding","Entry_ID":"ARR38-C","Entry_Name":"Guarantee that library functions do not form invalid pointers","Mapping_Fit":"Imprecise"}},"Related_Attack_Patterns":{"Related_Attack_Pattern":[{"CAPEC_ID":"100"},{"CAPEC_ID":"256"}]},"References":{"Reference":[{"External_Reference_ID":"REF-7","Section":"Chapter 6, \\"Why ACLs Are Important\\" Page 171"},{"External_Reference_ID":"REF-58"},{"External_Reference_ID":"REF-59"},{"External_Reference_ID":"REF-60"},{"External_Reference_ID":"REF-741"},{"External_Reference_ID":"REF-57"},{"External_Reference_ID":"REF-56"},{"External_Reference_ID":"REF-61"},{"External_Reference_ID":"REF-76"},{"External_Reference_ID":"REF-64"}]},"Content_History":{"Submission":{"Submission_Name":"CWE Content Team","Submission_Organization":"MITRE","Submission_Date":"2010-01-15"},"Modification":[{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2010-04-05","Modification_Comment":"updated Related_Attack_Patterns"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2010-06-21","Modification_Comment":"updated Common_Consequences, Potential_Mitigations, References"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2010-09-27","Modification_Comment":"updated Potential_Mitigations"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2010-12-13","Modification_Comment":"updated Potential_Mitigations"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-06-01","Modification_Comment":"updated Common_Consequences"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-06-27","Modification_Comment":"updated Demonstrative_Examples, Observed_Examples, Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-09-13","Modification_Comment":"updated Relationships, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2012-05-11","Modification_Comment":"updated Potential_Mitigations, References, Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2012-10-30","Modification_Comment":"updated Potential_Mitigations"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2014-02-18","Modification_Comment":"updated Potential_Mitigations, References"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2014-06-23","Modification_Comment":"updated Demonstrative_Examples"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2017-11-08","Modification_Comment":"updated Applicable_Platforms, Causal_Nature, Demonstrative_Examples, Likelihood_of_Exploit, References, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2018-03-27","Modification_Comment":"updated References"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2019-01-03","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2019-06-20","Modification_Comment":"updated Related_Attack_Patterns"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-02-24","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-06-25","Modification_Comment":"updated Common_Consequences"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-08-20","Modification_Comment":"updated Relationships"}]}},{"ID":"806","Name":"Buffer Access Using Size of Source Buffer","Abstraction":"Variant","Structure":"Simple","Status":"Incomplete","Description":"The software uses the size of a source buffer when reading from or writing to a destination buffer, which may cause it to access memory that is outside of the bounds of the buffer.","Extended_Description":"When the size of the destination is smaller than the size of the source, a buffer overflow could occur.","Related_Weaknesses":{"Related_Weakness":{"Nature":"ChildOf","CWE_ID":"805","View_ID":"1000","Ordinal":"Primary"}},"Weakness_Ordinalities":{"Weakness_Ordinality":[{"Ordinality":"Resultant"},{"Ordinality":"Primary"}]},"Applicable_Platforms":{"Language":[{"Name":"C","Prevalence":"Sometimes"},{"Name":"C++","Prevalence":"Sometimes"}]},"Modes_Of_Introduction":{"Introduction":{"Phase":"Implementation"}},"Common_Consequences":{"Consequence":[{"Scope":"Availability","Impact":["Modify Memory","DoS: Crash, Exit, or Restart","DoS: Resource Consumption (CPU)"],"Note":"Buffer overflows generally lead to crashes. Other attacks leading to lack of availability are possible, including putting the program into an infinite loop."},{"Scope":["Integrity","Confidentiality","Availability"],"Impact":["Read Memory","Modify Memory","Execute Unauthorized Code or Commands"],"Note":"Buffer overflows often can be used to execute arbitrary code, which is usually outside the scope of a program\'s implicit security policy."},{"Scope":"Access Control","Impact":"Bypass Protection Mechanism","Note":"When the consequence is arbitrary code execution, this can often be used to subvert any other security service."}]},"Potential_Mitigations":{"Mitigation":[{"Phase":"Architecture and Design","Description":"Use an abstraction library to abstract away risky APIs. Examples include the Safe C String Library (SafeStr) by Viega, and the Strsafe.h library from Microsoft. This is not a complete solution, since many buffer overflows are not related to strings."},{"Phase":"Build and Compilation","Description":"Use automatic buffer overflow detection mechanisms that are offered by certain compilers or compiler extensions. Examples include StackGuard, ProPolice and the Microsoft Visual Studio /GS flag. This is not necessarily a complete solution, since these canary-based mechanisms only detect certain types of overflows. In addition, the result is still a denial of service, since the typical response is to exit the application."},{"Phase":"Implementation","Description":"Programmers should adhere to the following rules when allocating and managing their applications memory: Double check that your buffer is as large as you specify. When using functions that accept a number of bytes to copy, such as strncpy(), be aware that if the destination buffer size is equal to the source buffer size, it may not NULL-terminate the string. Check buffer boundaries if calling this function in a loop and make sure you are not in danger of writing past the allocated space. Truncate all input strings to a reasonable length before passing them to the copy and concatenation functions"},{"Mitigation_ID":"MIT-11","Phase":"Operation","Strategy":"Environment Hardening","Description":{"xhtml:p":["Run or compile the software using features or extensions that randomly arrange the positions of a program\'s executable and libraries in memory. Because this makes the addresses unpredictable, it can prevent an attacker from reliably jumping to exploitable code.","Examples include Address Space Layout Randomization (ASLR) [REF-58] [REF-60] and Position-Independent Executables (PIE) [REF-64]."]},"Effectiveness":"Defense in Depth","Effectiveness_Notes":"This is not a complete solution. However, it forces the attacker to guess an unknown value that changes every program execution. In addition, an attack could still cause a denial of service, since the typical response is to exit the application."},{"Mitigation_ID":"MIT-12","Phase":"Operation","Strategy":"Environment Hardening","Description":"Use a CPU and operating system that offers Data Execution Protection (NX) or its equivalent [REF-60] [REF-61].","Effectiveness":"Defense in Depth","Effectiveness_Notes":"This is not a complete solution, since buffer overflows could be used to overwrite nearby variables to modify the software\'s state in dangerous ways. In addition, it cannot be used in cases in which self-modifying code is required. Finally, an attack could still cause a denial of service, since the typical response is to exit the application."},{"Phase":["Build and Compilation","Operation"],"Description":"Most mitigating technologies at the compiler or OS level to date address only a subset of buffer overflow problems and rarely provide complete protection against even that subset. It is good practice to implement strategies to increase the workload of an attacker, such as leaving the attacker to guess an unknown value that changes every program execution."}]},"Demonstrative_Examples":{"Demonstrative_Example":[{"Intro_Text":"In the following example, the source character string is copied to the dest character string using the method strncpy.","Example_Code":[{"Nature":"bad","Language":"C","xhtml:div":{"xhtml:br":[{},{},{},{}]}},{"Nature":"good","Language":"C","xhtml:div":{"xhtml:br":[{},{},{},{}]}}],"Body_Text":"However, in the call to strncpy the source character string is used within the sizeof call to determine the number of characters to copy. This will create a buffer overflow as the size of the source character string is greater than the dest character string. The dest character string should be used within the sizeof call to ensure that the correct number of characters are copied, as shown below."},{"Intro_Text":"In this example, the method outputFilenameToLog outputs a filename to a log file. The method arguments include a pointer to a character string containing the file name and an integer for the number of characters in the string. The filename is copied to a buffer where the buffer size is set to a maximum size for inputs to the log file. The method then calls another method to save the contents of the buffer to the log file.","Example_Code":[{"Nature":"bad","Language":"C","xhtml:div":{"xhtml:br":[{},{},{}],"xhtml:i":"// saves the file name to a log file","xhtml:div":{"style":"margin-left:10px;","xhtml:div":{"xhtml:br":[{},{},{},{},{},{},{},{},{},{},{}],"xhtml:i":["// buffer with size set to maximum size for input to log file","// copy filename to buffer","// save to log file"]}}}},{"Nature":"good","Language":"C","xhtml:div":{"xhtml:br":[{},{},{}],"xhtml:i":"// copy filename to buffer"}}],"Body_Text":"However, in this case the string copy method, strncpy, mistakenly uses the length method argument to determine the number of characters to copy rather than using the size of the local character string, buf. This can lead to a buffer overflow if the number of characters contained in character string pointed to by filename is larger then the number of characters allowed for the local character string. The string copy method should use the buf character string within a sizeof call to ensure that only characters up to the size of the buf array are copied to avoid a buffer overflow, as shown below."}]},"Affected_Resources":{"Affected_Resource":"Memory"},"References":{"Reference":[{"External_Reference_ID":"REF-56"},{"External_Reference_ID":"REF-57"},{"External_Reference_ID":"REF-58"},{"External_Reference_ID":"REF-59"},{"External_Reference_ID":"REF-60"},{"External_Reference_ID":"REF-61"},{"External_Reference_ID":"REF-64"}]},"Content_History":{"Submission":{"Submission_Name":"CWE Content Team","Submission_Organization":"MITRE","Submission_Date":"2010-01-15"},"Modification":[{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-03-29","Modification_Comment":"updated Demonstrative_Examples"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-06-01","Modification_Comment":"updated Common_Consequences"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2012-05-11","Modification_Comment":"updated Potential_Mitigations, References"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2014-02-18","Modification_Comment":"updated Potential_Mitigations, References"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2017-11-08","Modification_Comment":"updated Causal_Nature, Demonstrative_Examples, Likelihood_of_Exploit, References"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-02-24","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-06-25","Modification_Comment":"updated Common_Consequences"}]}},{"ID":"839","Name":"Numeric Range Comparison Without Minimum Check","Abstraction":"Base","Structure":"Simple","Status":"Incomplete","Description":"The program checks a value to ensure that it is less than or equal to a maximum, but it does not also verify that the value is greater than or equal to the minimum.","Extended_Description":{"xhtml:p":["Some programs use signed integers or floats even when their values are only expected to be positive or 0. An input validation check might assume that the value is positive, and only check for the maximum value. If the value is negative, but the code assumes that the value is positive, this can produce an error. The error may have security consequences if the negative value is used for memory allocation, array access, buffer access, etc. Ultimately, the error could lead to a buffer overflow or other type of memory corruption.","The use of a negative number in a positive-only context could have security implications for other types of resources. For example, a shopping cart might check that the user is not requesting more than 10 items, but a request for -3 items could cause the application to calculate a negative price and credit the attacker\'s account."]},"Related_Weaknesses":{"Related_Weakness":[{"Nature":"ChildOf","CWE_ID":"1023","View_ID":"1000","Ordinal":"Primary"},{"Nature":"CanPrecede","CWE_ID":"195","View_ID":"1000"},{"Nature":"CanPrecede","CWE_ID":"682","View_ID":"1000"},{"Nature":"CanPrecede","CWE_ID":"119","View_ID":"1000"},{"Nature":"CanPrecede","CWE_ID":"124","View_ID":"1000"}]},"Applicable_Platforms":{"Language":[{"Name":"C","Prevalence":"Often"},{"Name":"C++","Prevalence":"Often"}]},"Alternate_Terms":{"Alternate_Term":{"Term":"Signed comparison","Description":"The \\"signed comparison\\" term is often used to describe when the program uses a signed variable and checks it to ensure that it is less than a maximum value (typically a maximum buffer size), but does not verify that it is greater than 0."}},"Common_Consequences":{"Consequence":[{"Scope":["Integrity","Confidentiality","Availability"],"Impact":["Modify Application Data","Execute Unauthorized Code or Commands"],"Note":"An attacker could modify the structure of the message or data being sent to the downstream component, possibly injecting commands."},{"Scope":"Availability","Impact":"DoS: Resource Consumption (Other)","Note":"in some contexts, a negative value could lead to resource consumption."},{"Scope":["Confidentiality","Integrity"],"Impact":["Modify Memory","Read Memory"],"Note":"If a negative value is used to access memory, buffers, or other indexable structures, it could access memory outside the bounds of the buffer."}]},"Potential_Mitigations":{"Mitigation":[{"Phase":"Implementation","Strategy":"Enforcement by Conversion","Description":"If the number to be used is always expected to be positive, change the variable type from signed to unsigned or size_t."},{"Phase":"Implementation","Strategy":"Input Validation","Description":"If the number to be used could have a negative value based on the specification (thus requiring a signed value), but the number should only be positive to preserve code correctness, then include a check to ensure that the value is positive."}]},"Demonstrative_Examples":{"Demonstrative_Example":[{"Demonstrative_Example_ID":"DX-21","Intro_Text":"The following code is intended to read an incoming packet from a socket and extract one or more headers.","Example_Code":{"Nature":"bad","Language":"C","xhtml:div":{"xhtml:br":[{},{},{},{},{},{},{},{},{},{}],"xhtml:div":{"style":"margin-left:10px;","$t":"ExitError(\\"too many headers!\\");"}}},"Body_Text":"The code performs a check to make sure that the packet does not contain too many headers. However, numHeaders is defined as a signed int, so it could be negative. If the incoming packet specifies a value such as -3, then the malloc calculation will generate a negative number (say, -300 if each header can be a maximum of 100 bytes). When this result is provided to malloc(), it is first converted to a size_t type. This conversion then produces a large value such as 4294966996, which may cause malloc() to fail or to allocate an extremely large amount of memory (CWE-195). With the appropriate negative numbers, an attacker could trick malloc() into using a very small positive number, which then allocates a buffer that is much smaller than expected, potentially leading to a buffer overflow."},{"Demonstrative_Example_ID":"DX-23","Intro_Text":"The following code reads a maximum size and performs a sanity check on that size. It then performs a strncpy, assuming it will not exceed the boundaries of the array. While the use of \\"short s\\" is forced in this particular example, short int\'s are frequently used within real-world code, such as code that processes structured data.","Example_Code":{"Nature":"bad","Language":"C","xhtml:div":{"xhtml:div":[{"style":"margin-left:10px;","$t":"return(0x0000FFFF);"},{"style":"margin-left:10px;","xhtml:div":{"xhtml:br":[{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}],"xhtml:div":{"style":"margin-left:10px;","$t":"DiePainfully(\\"go away!\\\\n\\");"}}}],"xhtml:br":[{},{}]}},"Body_Text":"This code first exhibits an example of CWE-839, allowing \\"s\\" to be a negative number. When the negative short \\"s\\" is converted to an unsigned integer, it becomes an extremely large positive integer. When this converted integer is used by strncpy() it will lead to a buffer overflow (CWE-119)."},{"Demonstrative_Example_ID":"DX-100","Intro_Text":"In the following code, the method retrieves a value from an array at a specific array index location that is given as an input parameter to the method","Example_Code":[{"Nature":"bad","Language":"C","xhtml:div":{"xhtml:div":{"style":"margin-left:10px;","xhtml:div":{"xhtml:br":[{},{},{},{},{},{},{},{},{},{},{},{}],"xhtml:i":["// check that the array index is less than the maximum","// length of the array","// if array index is invalid then output error message","// and return value indicating error"],"xhtml:div":[{"style":"margin-left:10px;","xhtml:div":{"xhtml:br":[{},{}],"xhtml:i":"// get the value at the specified index of the array"}},{"style":"margin-left:10px;","xhtml:br":{}}]}}}},{"Nature":"good","Language":"C","xhtml:div":{"xhtml:br":[{},{},{},{},{},{},{},{}],"xhtml:i":["// check that the array index is within the correct","// range of values for the array"]}}],"Body_Text":"However, this method only verifies that the given array index is less than the maximum length of the array but does not check for the minimum value (CWE-839). This will allow a negative value to be accepted as the input array index, which will result in a out of bounds read (CWE-125) and may allow access to sensitive memory. The input array index should be checked to verify that is within the maximum and minimum range required for the array (CWE-129). In this example the if statement should be modified to include a minimum range check, as shown below."},{"Intro_Text":"The following code shows a simple BankAccount class with deposit and withdraw methods.","Example_Code":[{"Nature":"bad","Language":"Java","xhtml:div":{"xhtml:div":{"style":"margin-left:10px;","xhtml:div":{"xhtml:br":[{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}],"xhtml:i":["// variable for bank account balance","// constructor for BankAccount","// method to deposit amount into BankAccount","// method to withdraw amount from BankAccount","// other methods for accessing the BankAccount object"],"xhtml:div":[{"style":"margin-left:10px;","$t":"accountBalance = 0;"},{"style":"margin-left:10px;","xhtml:div":{"xhtml:br":[{},{}],"xhtml:div":[{"style":"margin-left:10px;","xhtml:div":{"xhtml:br":[{},{}]}},{"style":"margin-left:10px;","xhtml:br":{}}]}}]}}}},{"Nature":"good","Language":"Java","xhtml:div":{"xhtml:div":{"style":"margin-left:10px;","xhtml:div":{"xhtml:br":[{},{},{},{},{},{},{}],"xhtml:i":"// method to withdraw amount from BankAccount","xhtml:div":{"style":"margin-left:10px;","xhtml:div":{"xhtml:br":[{},{}],"xhtml:div":{"style":"margin-left:10px;","xhtml:div":{"xhtml:br":{}}}}}}}}}],"Body_Text":["The withdraw method includes a check to ensure that the withdrawal amount does not exceed the maximum limit allowed, however the method does not check to ensure that the withdrawal amount is greater than a minimum value (CWE-129). Performing a range check on a value that does not include a minimum check can have significant security implications, in this case not including a minimum range check can allow a negative value to be used which would cause the financial application using this class to deposit money into the user account rather than withdrawing. In this example the if statement should the modified to include a minimum range check, as shown below.","Note that this example does not protect against concurrent access to the BankAccount balance variable, see CWE-413 and CWE-362.","While it is out of scope for this example, note that the use of doubles or floats in financial calculations may be subject to certain kinds of attacks where attackers use rounding errors to steal money."]}]},"Observed_Examples":{"Observed_Example":[{"Reference":"CVE-2010-1866","Description":"Chain: integer overflow causes a negative signed value, which later bypasses a maximum-only check, leading to heap-based buffer overflow.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2010-1866"},{"Reference":"CVE-2009-1099","Description":"Chain: 16-bit counter can be interpreted as a negative value, compared to a 32-bit maximum value, leading to buffer under-write.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2009-1099"},{"Reference":"CVE-2011-0521","Description":"Chain: kernel\'s lack of a check for a negative value leads to memory corruption.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2011-0521"},{"Reference":"CVE-2010-3704","Description":"Chain: parser uses atoi() but does not check for a negative value, which can happen on some platforms, leading to buffer under-write.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2010-3704"},{"Reference":"CVE-2010-2530","Description":"Chain: Negative value stored in an int bypasses a size check and causes allocation of large amounts of memory.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2010-2530"},{"Reference":"CVE-2009-3080","Description":"Chain: negative offset value to IOCTL bypasses check for maximum index, then used as an array index for buffer under-read.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2009-3080"},{"Reference":"CVE-2008-6393","Description":"chain: file transfer client performs signed comparison, leading to integer overflow and heap-based buffer overflow.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2008-6393"},{"Reference":"CVE-2008-4558","Description":"chain: negative ID in media player bypasses check for maximum index, then used as an array index for buffer under-read.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2008-4558"}]},"References":{"Reference":[{"External_Reference_ID":"REF-62","Section":"Chapter 6, \\"Type Conversion Vulnerabilities\\" Page 246"},{"External_Reference_ID":"REF-62","Section":"Chapter 6, \\"Comparisons\\", Page 265"}]},"Content_History":{"Submission":{"Submission_Name":"CWE Content Team","Submission_Organization":"MITRE","Submission_Date":"2011-03-24"},"Modification":[{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2011-06-01","Modification_Comment":"updated Common_Consequences"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2012-05-11","Modification_Comment":"updated Demonstrative_Examples, References, Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2014-02-18","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2018-03-27","Modification_Comment":"updated Description"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2019-01-03","Modification_Comment":"updated Relationships"}]}},{"ID":"843","Name":"Access of Resource Using Incompatible Type (\'Type Confusion\')","Abstraction":"Base","Structure":"Simple","Status":"Incomplete","Description":"The program allocates or initializes a resource such as a pointer, object, or variable using one type, but it later accesses that resource using a type that is incompatible with the original type.","Extended_Description":{"xhtml:p":["When the program accesses the resource using an incompatible type, this could trigger logical errors because the resource does not have expected properties. In languages without memory safety, such as C and C++, type confusion can lead to out-of-bounds memory access.","While this weakness is frequently associated with unions when parsing data with many different embedded object types in C, it can be present in any application that can interpret the same variable or memory location in multiple ways.","This weakness is not unique to C and C++. For example, errors in PHP applications can be triggered by providing array parameters when scalars are expected, or vice versa. Languages such as Perl, which perform automatic conversion of a variable of one type when it is accessed as if it were another type, can also contain these issues."]},"Related_Weaknesses":{"Related_Weakness":[{"Nature":"ChildOf","CWE_ID":"704","View_ID":"1000","Ordinal":"Primary"},{"Nature":"ChildOf","CWE_ID":"704","View_ID":"1003","Ordinal":"Primary"},{"Nature":"CanPrecede","CWE_ID":"119","View_ID":"1000"}]},"Applicable_Platforms":{"Language":[{"Name":"C","Prevalence":"Undetermined"},{"Name":"C++","Prevalence":"Undetermined"}]},"Alternate_Terms":{"Alternate_Term":{"Term":"Object Type Confusion"}},"Modes_Of_Introduction":{"Introduction":{"Phase":"Implementation"}},"Common_Consequences":{"Consequence":{"Scope":["Availability","Integrity","Confidentiality"],"Impact":["Read Memory","Modify Memory","Execute Unauthorized Code or Commands","DoS: Crash, Exit, or Restart"],"Note":"When a memory buffer is accessed using the wrong type, it could read or write memory out of the bounds of the buffer, if the allocated buffer is smaller than the type that the code is attempting to access, leading to a crash and possibly code execution."}},"Demonstrative_Examples":{"Demonstrative_Example":[{"Intro_Text":"The following code uses a union to support the representation of different types of messages. It formats messages differently, depending on their type.","Example_Code":{"Nature":"bad","Language":"C","xhtml:div":{"$t":"#define NAME_TYPE 1#define ID_TYPE 2\\n                     struct MessageBuffer{};\\n                     \\n                     int main (int argc, char **argv) {}","xhtml:br":[{},{},{},{},{},{},{}],"xhtml:div":[{"style":"margin-left:10px;","xhtml:br":{},"xhtml:div":{"style":"margin-left:10px;","xhtml:br":{}}},{"style":"margin-left:10px;","$t":"","xhtml:div":{"$t":"struct MessageBuffer buf;char *defaultMessage = \\"Hello World\\";\\n                           buf.msgType = NAME_TYPE;buf.name = defaultMessage;printf(\\"Pointer of buf.name is %p\\\\n\\", buf.name);\\n                           \\n                           \\n                           buf.nameID = (int)(defaultMessage + 1);printf(\\"Pointer of buf.name is now %p\\\\n\\", buf.name);if (buf.msgType == NAME_TYPE) {}else {}","xhtml:br":[{},{},{},{},{},{},{},{},{},{},{}],"xhtml:i":"/* This particular value for nameID is used to make the code architecture-independent. If coming from untrusted input, it could be any value. */","xhtml:div":[{"style":"margin-left:10px;","$t":"printf(\\"Message: %s\\\\n\\", buf.name);"},{"style":"margin-left:10px;","$t":"printf(\\"Message: Use ID %d\\\\n\\", buf.nameID);"}]}}]}},"Body_Text":["The code intends to process the message as a NAME_TYPE, and sets the default message to \\"Hello World.\\" However, since both buf.name and buf.nameID are part of the same union, they can act as aliases for the same memory location, depending on memory layout after compilation.","As a result, modification of buf.nameID - an int - can effectively modify the pointer that is stored in buf.name - a string.","Execution of the program might generate output such as:",{"xhtml:div":{"$t":"","xhtml:div":["Pointer of name is 10830","Pointer of name is now 10831","Message: ello World"]}},"Notice how the pointer for buf.name was changed, even though buf.name was not explicitly modified.","In this case, the first \\"H\\" character of the message is omitted. However, if an attacker is able to fully control the value of buf.nameID, then buf.name could contain an arbitrary pointer, leading to out-of-bounds reads or writes."]},{"Intro_Text":"The following PHP code accepts a value, adds 5, and prints the sum.","Example_Code":{"Nature":"bad","Language":"PHP","xhtml:div":{"xhtml:br":[{},{},{}]}},"Body_Text":["When called with the following query string:",{"xhtml:div":{"$t":"","xhtml:div":"value=123"}},"the program calculates the sum and prints out:",{"xhtml:div":{"$t":"","xhtml:div":"SUM is 128"}},"However, the attacker could supply a query string such as:",{"xhtml:div":{"$t":"","xhtml:div":"value[]=123"}},"The \\"[]\\" array syntax causes $value to be treated as an array type, which then generates a fatal error when calculating $sum:",{"xhtml:div":{"$t":"","xhtml:div":"Fatal error: Unsupported operand types in program.php on line 2"}}]},{"Intro_Text":"The following Perl code is intended to look up the privileges for user ID\'s between 0 and 3, by performing an access of the $UserPrivilegeArray reference. It is expected that only userID 3 is an admin (since this is listed in the third element of the array).","Example_Code":{"Nature":"bad","Language":"Perl","xhtml:div":{"xhtml:br":[{},{},{},{},{},{},{}],"xhtml:div":[{"style":"margin-left:10px;","$t":"print \\"Regular user!\\\\n\\";"},{"style":"margin-left:10px;","$t":"print \\"Admin!\\\\n\\";"}]}},"Body_Text":["In this case, the programmer intended to use \\"$UserPrivilegeArray->{$userID}\\" to access the proper position in the array. But because the subscript was omitted, the \\"user\\" string was compared to the scalar representation of the $UserPrivilegeArray reference, which might be of the form \\"ARRAY(0x229e8)\\" or similar.","Since the logic also \\"fails open\\" (CWE-636), the result of this bug is that all users are assigned administrator privileges.","While this is a forced example, it demonstrates how type confusion can have security consequences, even in memory-safe languages."]}]},"Observed_Examples":{"Observed_Example":[{"Reference":"CVE-2010-4577","Description":"Type confusion in CSS sequence leads to out-of-bounds read.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2010-4577"},{"Reference":"CVE-2011-0611","Description":"Size inconsistency allows code execution, first discovered when it was actively exploited in-the-wild.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2011-0611"},{"Reference":"CVE-2010-0258","Description":"Improperly-parsed file containing records of different types leads to code execution when a memory location is interpreted as a different object than intended.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2010-0258"}]},"Taxonomy_Mappings":{"Taxonomy_Mapping":{"Taxonomy_Name":"CERT C Secure Coding","Entry_ID":"EXP39-C","Entry_Name":"Do not access a variable through a pointer of an incompatible type","Mapping_Fit":"Exact"}},"References":{"Reference":[{"External_Reference_ID":"REF-811","Section":"\\"Type Confusion Vulnerabilities,\\" page 59"},{"External_Reference_ID":"REF-62","Section":"Chapter 7, \\"Type Confusion\\", Page 319"}]},"Notes":{"Note":[{"Type":"Applicable Platform","xhtml:p":"This weakness is possible in any type-unsafe programming language."},{"Type":"Research Gap","xhtml:p":["Type confusion weaknesses have received some attention by applied researchers and major software vendors for C and C++ code. Some publicly-reported vulnerabilities probably have type confusion as a root-cause weakness, but these may be described as \\"memory corruption\\" instead. This weakness seems likely to gain prominence in upcoming years.","For other languages, there are very few public reports of type confusion weaknesses. These are probably under-studied. Since many programs rely directly or indirectly on loose typing, a potential \\"type confusion\\" behavior might be intentional, possibly requiring more manual analysis."]}]},"Content_History":{"Submission":{"Submission_Name":"CWE Content Team","Submission_Organization":"MITRE","Submission_Date":"2011-05-15"},"Modification":[{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2012-05-11","Modification_Comment":"updated References"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2017-11-08","Modification_Comment":"updated Applicable_Platforms, Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2019-01-03","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2019-06-20","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-02-24","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-06-25","Modification_Comment":"updated Common_Consequences, Relationships"}]}},{"ID":"910","Name":"Use of Expired File Descriptor","Abstraction":"Base","Structure":"Simple","Status":"Incomplete","Description":"The software uses or accesses a file descriptor after it has been closed.","Extended_Description":"After a file descriptor for a particular file or device has been released, it can be reused. The code might not write to the original file, since the reused file descriptor might reference a different file or device.","Related_Weaknesses":{"Related_Weakness":{"Nature":"ChildOf","CWE_ID":"672","View_ID":"1000","Ordinal":"Primary"}},"Weakness_Ordinalities":{"Weakness_Ordinality":[{"Ordinality":"Primary"},{"Ordinality":"Resultant"}]},"Applicable_Platforms":{"Language":[{"Name":"C","Prevalence":"Sometimes"},{"Name":"C++","Prevalence":"Sometimes"},{"Class":"Language-Independent","Prevalence":"Undetermined"}]},"Alternate_Terms":{"Alternate_Term":{"Term":"Stale file descriptor"}},"Modes_Of_Introduction":{"Introduction":{"Phase":"Implementation"}},"Likelihood_Of_Exploit":"Medium","Common_Consequences":{"Consequence":[{"Scope":"Confidentiality","Impact":"Read Files or Directories","Note":"The program could read data from the wrong file."},{"Scope":"Availability","Impact":"DoS: Crash, Exit, or Restart","Note":"Accessing a file descriptor that has been closed can cause a crash."}]},"Taxonomy_Mappings":{"Taxonomy_Mapping":{"Taxonomy_Name":"CERT C Secure Coding","Entry_ID":"FIO46-C","Entry_Name":"Do not access a closed file","Mapping_Fit":"Exact"}},"Content_History":{"Submission":{"Submission_Name":"CWE Content Team","Submission_Organization":"MITRE","Submission_Date":"2012-12-21","Submission_Comment":"New weakness based on discussion on the CWE research list in December 2012."},"Modification":[{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2017-11-08","Modification_Comment":"updated Taxonomy_Mappings"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2019-01-03","Modification_Comment":"updated Relationships"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-02-24","Modification_Comment":"updated Relationships"}]}},{"ID":"911","Name":"Improper Update of Reference Count","Abstraction":"Base","Structure":"Simple","Status":"Incomplete","Description":"The software uses a reference count to manage a resource, but it does not update or incorrectly updates the reference count.","Extended_Description":"Reference counts can be used when tracking how many objects contain a reference to a particular resource, such as in memory management or garbage collection. When the reference count reaches zero, the resource can be de-allocated or reused because there are no more objects that use it. If the reference count accidentally reaches zero, then the resource might be released too soon, even though it is still in use. If all objects no longer use the resource, but the reference count is not zero, then the resource might not ever be released.","Related_Weaknesses":{"Related_Weakness":[{"Nature":"ChildOf","CWE_ID":"664","View_ID":"1000","Ordinal":"Primary"},{"Nature":"CanPrecede","CWE_ID":"672","View_ID":"1000"},{"Nature":"CanPrecede","CWE_ID":"772","View_ID":"1000"}]},"Weakness_Ordinalities":{"Weakness_Ordinality":{"Ordinality":"Primary"}},"Applicable_Platforms":{"Language":[{"Name":"C","Prevalence":"Sometimes"},{"Name":"C++","Prevalence":"Sometimes"},{"Class":"Language-Independent","Prevalence":"Undetermined"}]},"Modes_Of_Introduction":{"Introduction":{"Phase":"Implementation"}},"Likelihood_Of_Exploit":"Medium","Observed_Examples":{"Observed_Example":[{"Reference":"CVE-2002-0574","Description":"chain: reference count is not decremented, leading to memory leak in OS by sending ICMP packets.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2002-0574"},{"Reference":"CVE-2004-0114","Description":"Reference count for shared memory not decremented when a function fails, potentially allowing unprivileged users to read kernel memory.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2004-0114"},{"Reference":"CVE-2006-3741","Description":"chain: improper reference count tracking leads to file descriptor consumption","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2006-3741"},{"Reference":"CVE-2007-1383","Description":"chain: integer overflow in reference counter causes the same variable to be destroyed twice.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2007-1383"},{"Reference":"CVE-2007-1700","Description":"Incorrect reference count calculation leads to improper object destruction and code execution.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2007-1700"},{"Reference":"CVE-2008-2136","Description":"chain: incorrect update of reference count leads to memory leak.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2008-2136"},{"Reference":"CVE-2008-2785","Description":"chain/composite: use of incorrect data type for a reference counter allows an overflow of the counter, leading to a free of memory that is still in use.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2008-2785"},{"Reference":"CVE-2008-5410","Description":"Improper reference counting leads to failure of cryptographic operations.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2008-5410"},{"Reference":"CVE-2009-1709","Description":"chain: improper reference counting in a garbage collection routine leads to use-after-free","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2009-1709"},{"Reference":"CVE-2009-3553","Description":"chain: reference count not correctly maintained when client disconnects during a large operation, leading to a use-after-free.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2009-3553"},{"Reference":"CVE-2009-3624","Description":"Reference count not always incremented, leading to crash or code execution.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2009-3624"},{"Reference":"CVE-2010-0176","Description":"improper reference counting leads to expired pointer dereference.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2010-0176"},{"Reference":"CVE-2010-0623","Description":"OS kernel increments reference count twice but only decrements once, leading to resource consumption and crash.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2010-0623"},{"Reference":"CVE-2010-2549","Description":"OS kernel driver allows code execution","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2010-2549"},{"Reference":"CVE-2010-4593","Description":"improper reference counting leads to exhaustion of IP addresses","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2010-4593"},{"Reference":"CVE-2011-0695","Description":"Race condition causes reference counter to be decremented prematurely, leading to the destruction of still-active object and an invalid pointer dereference.","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2011-0695"},{"Reference":"CVE-2012-4787","Description":"improper reference counting leads to use-after-free","Link":"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2012-4787"}]},"References":{"Reference":{"External_Reference_ID":"REF-884"}},"Content_History":{"Submission":{"Submission_Name":"CWE Content Team","Submission_Organization":"MITRE","Submission_Date":"2012-12-21"},"Modification":[{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2019-06-20","Modification_Comment":"updated Type"},{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2020-02-24","Modification_Comment":"updated Relationships, Type"}]}}]},"Views":{"View":{"ID":"658","Name":"Weaknesses in Software Written in C","Type":"Implicit","Status":"Draft","Objective":"This view (slice) covers issues that are found in C programs that are not common to all languages.","Filter":"/Weakness_Catalog/Weaknesses/Weakness[./Applicable_Platforms/Language/@Name=\'C\']","Content_History":{"Submission":{"Submission_Name":"CWE Content Team","Submission_Organization":"MITRE","Submission_Date":"2008-04-11"},"Modification":{"Modification_Name":"CWE Content Team","Modification_Organization":"MITRE","Modification_Date":"2008-09-08","Modification_Comment":"updated Description, Name, View_Filter, View_Structure"},"Previous_Entry_Name":{"Date":"2008-09-09","$t":"Weaknesses found in the C Language"}}}},"External_References":{"External_Reference":[{"Reference_ID":"REF-1029","Author":"Aleph One","Title":"Smashing The Stack For Fun And Profit","Publication_Year":"1996","Publication_Month":"--11","Publication_Day":"---08","URL":"http://phrack.org/issues/49/14.html"},{"Reference_ID":"REF-1031","Title":"Null pointer / Null dereferencing","Publication_Year":"2019","Publication_Month":"--07","Publication_Day":"---15","Publisher":"Wikipedia","URL":"https://en.wikipedia.org/wiki/Null_pointer#Null_dereferencing"},{"Reference_ID":"REF-1032","Title":"Null Reference Creation and Null Pointer Dereference","Publisher":"Apple","URL":"https://developer.apple.com/documentation/code_diagnostics/undefined_behavior_sanitizer/null_reference_creation_and_null_pointer_dereference"},{"Reference_ID":"REF-1033","Title":"NULL Pointer Dereference [CWE-476]","Publication_Year":"2012","Publication_Month":"--09","Publication_Day":"---11","Publisher":"ImmuniWeb","URL":"https://www.immuniweb.com/vulnerability/null-pointer-dereference.html"},{"Reference_ID":"REF-1034","Author":["Raoul Strackx","Yves Younan","Pieter Philippaerts","Frank Piessens","Sven Lachmund","Thomas Walter"],"Title":"Breaking the memory secrecy assumption","Publication_Year":"2009","Publication_Month":"--03","Publication_Day":"---31","Publisher":"ACM","URL":"https://dl.acm.org/citation.cfm?doid=1519144.1519145"},{"Reference_ID":"REF-1035","Author":"Fermin J. Serna","Title":"The info leak era on software exploitation","Publication_Year":"2012","Publication_Month":"--07","Publication_Day":"---25","URL":"https://media.blackhat.com/bh-us-12/Briefings/Serna/BH_US_12_Serna_Leak_Era_Slides.pdf"},{"Reference_ID":"REF-106","Author":["David LeBlanc","Niels Dekker"],"Title":"SafeInt","URL":"http://safeint.codeplex.com/"},{"Reference_ID":"REF-107","Author":"Jason Lam","Title":"Top 25 Series - Rank 18 - Incorrect Calculation of Buffer Size","Publication_Year":"2010","Publication_Month":"--03","Publication_Day":"---19","Publisher":"SANS Software Security Institute","URL":"http://software-security.sans.org/blog/2010/03/19/top-25-series-rank-18-incorrect-calculation-of-buffer-size"},{"Reference_ID":"REF-116","Author":"Steve Christey","Title":"Format String Vulnerabilities in Perl Programs","URL":"http://www.securityfocus.com/archive/1/418460/30/0/threaded"},{"Reference_ID":"REF-117","Author":["Hal Burch","Robert C. Seacord"],"Title":"Programming Language Format String Vulnerabilities","URL":"http://www.ddj.com/dept/security/197002914"},{"Reference_ID":"REF-118","Author":"Tim Newsham","Title":"Format String Attacks","Publication_Year":"2000","Publication_Month":"--09","Publication_Day":"---09","Publisher":"Guardent","URL":"http://www.thenewsh.com/~newsham/format-string-attacks.pdf"},{"Reference_ID":"REF-124","Author":"Michael Howard","Title":"When scrubbing secrets in memory doesn\'t work","Publication":"BugTraq","Publication_Year":"2002","Publication_Month":"--11","Publication_Day":"---05","URL":"http://cert.uni-stuttgart.de/archive/bugtraq/2002/11/msg00046.html"},{"Reference_ID":"REF-125","Author":"Michael Howard","Title":"Some Bad News and Some Good News","Publication_Year":"2002","Publication_Month":"--10","Publication_Day":"---21","Publisher":"Microsoft","URL":"http://msdn.microsoft.com/library/default.asp?url=/library/en-us/dncode/html/secure10102002.asp"},{"Reference_ID":"REF-126","Author":"Joseph Wagner","Title":"GNU GCC: Optimizer Removes Code Necessary for Security","Publication":"Bugtraq","Publication_Year":"2002","Publication_Month":"--11","Publication_Day":"---16","URL":"http://www.derkeiler.com/Mailing-Lists/securityfocus/bugtraq/2002-11/0257.html"},{"Reference_ID":"REF-161","Author":["John McDonald","Mark Dowd","Justin Schuh"],"Title":"C Language Issues for Application Security","Publication_Year":"2008","Publication_Month":"--01","Publication_Day":"---25","URL":"http://www.informit.com/articles/article.aspx?p=686170&seqNum=6"},{"Reference_ID":"REF-162","Author":"Robert Seacord","Title":"Integral Security","Publication_Year":"2006","Publication_Month":"--11","Publication_Day":"---03","URL":"http://www.ddj.com/security/193501774"},{"Reference_ID":"REF-18","Author":"Secure Software, Inc.","Title":"The CLASP Application Security Process","Publication_Year":"2005","URL":"https://cwe.mitre.org/documents/sources/TheCLASPApplicationSecurityProcess.pdf"},{"Reference_ID":"REF-194","Author":"Herbert Schildt","Title":"Herb Schildt\'s C++ Programming Cookbook","Publication_Year":"2008","Publication_Month":"--04","Publication_Day":"---28","Publisher":"McGraw-Hill Osborne Media"},{"Reference_ID":"REF-349","Author":"Andrei Alexandrescu","Title":"volatile - Multithreaded Programmer\'s Best Friend","Publication":"Dr. Dobb\'s","Publication_Year":"2008","Publication_Month":"--02","Publication_Day":"---01","URL":"http://www.ddj.com/cpp/184403766"},{"Reference_ID":"REF-350","Author":"Steven Devijver","Title":"Thread-safe webapps using Spring","URL":"http://www.javalobby.org/articles/thread-safe/index.jsp"},{"Reference_ID":"REF-351","Author":"David Wheeler","Title":"Prevent race conditions","Publication_Year":"2007","Publication_Month":"--10","Publication_Day":"---04","URL":"http://www.ibm.com/developerworks/library/l-sprace.html"},{"Reference_ID":"REF-352","Author":"Matt Bishop","Title":"Race Conditions, Files, and Security Flaws; or the Tortoise and the Hare Redux","Publication_Year":"1995","Publication_Month":"--09","URL":"http://www.cs.ucdavis.edu/research/tech-reports/1995/CSE-95-9.pdf"},{"Reference_ID":"REF-353","Author":"David Wheeler","Title":"Secure Programming for Linux and Unix HOWTO","Publication_Year":"2003","Publication_Month":"--03","Publication_Day":"---03","URL":"http://www.dwheeler.com/secure-programs/Secure-Programs-HOWTO/avoid-race.html"},{"Reference_ID":"REF-354","Author":"Blake Watts","Title":"Discovering and Exploiting Named Pipe Security Flaws for Fun and Profit","Publication_Year":"2002","Publication_Month":"--04","URL":"http://www.blakewatts.com/namedpipepaper.html"},{"Reference_ID":"REF-355","Author":["Roberto Paleari","Davide Marrone","Danilo Bruschi","Mattia Monga"],"Title":"On Race Vulnerabilities in Web Applications","URL":"http://security.dico.unimi.it/~roberto/pubs/dimva08-web.pdf"},{"Reference_ID":"REF-356","Title":"Avoiding Race Conditions and Insecure File Operations","Publication":"Apple Developer Connection","URL":"http://developer.apple.com/documentation/Security/Conceptual/SecureCodingGuide/Articles/RaceConditions.html"},{"Reference_ID":"REF-357","Author":"Johannes Ullrich","Title":"Top 25 Series - Rank 25 - Race Conditions","Publication_Year":"2010","Publication_Month":"--03","Publication_Day":"---26","Publisher":"SANS Software Security Institute","URL":"http://blogs.sans.org/appsecstreetfighter/2010/03/26/top-25-series-rank-25-race-conditions/"},{"Reference_ID":"REF-360","Author":"Michal Zalewski","Title":"Delivering Signals for Fun and Profit","URL":"http://lcamtuf.coredump.cx/signals.txt"},{"Reference_ID":"REF-361","Title":"Race Condition: Signal Handling","URL":"http://www.fortify.com/vulncat/en/vulncat/cpp/race_condition_signal_handling.html"},{"Reference_ID":"REF-374","Author":"Tony Sintes","Title":"Does Java pass by reference or pass by value?","Publication":"JavaWorld.com","Publication_Year":"2000","Publication_Month":"--05","Publication_Day":"---26","URL":"http://www.javaworld.com/javaworld/javaqa/2000-05/03-qa-0526-pass.html"},{"Reference_ID":"REF-375","Author":"Herbert Schildt","Title":"Java: The Complete Reference, J2SE 5th Edition"},{"Reference_ID":"REF-390","Author":["J. Whittaker","H. Thompson"],"Title":"How to Break Software Security","Publication_Year":"2003","Publisher":"Addison Wesley"},{"Reference_ID":"REF-391","Author":"iOS Developer Library","Title":"Transitioning to ARC Release Notes","Publication_Year":"2013","Publication_Month":"--08","Publication_Day":"---08","URL":"https://developer.apple.com/library/ios/releasenotes/ObjectiveC/RN-TransitioningToARC/Introduction/Introduction.html"},{"Reference_ID":"REF-436","Author":"mercy","Title":"Exploiting Uninitialized Data","Publication_Year":"2006","Publication_Month":"--01","URL":"http://www.felinemenace.org/~mercy/papers/UBehavior/UBehavior.zip"},{"Reference_ID":"REF-437","Author":"Microsoft Security Vulnerability Research & Defense","Title":"MS08-014 : The Case of the Uninitialized Stack Variable Vulnerability","Publication_Year":"2008","Publication_Month":"--03","Publication_Day":"---11","URL":"http://blogs.technet.com/swi/archive/2008/03/11/the-case-of-the-uninitialized-stack-variable-vulnerability.aspx"},{"Reference_ID":"REF-44","Author":["Michael Howard","David LeBlanc","John Viega"],"Title":"24 Deadly Sins of Software Security","Publication":"McGraw-Hill","Publication_Year":"2010"},{"Reference_ID":"REF-442","Author":"Robert Seacord","Title":"EXP01-A. Do not take the sizeof a pointer to determine the size of a type","URL":"https://www.securecoding.cert.org/confluence/display/seccode/EXP01-A.+Do+not+take+the+sizeof+a+pointer+to+determine+the+size+of+a+type"},{"Reference_ID":"REF-480","Title":"Valgrind","URL":"http://valgrind.org/"},{"Reference_ID":"REF-554","Author":"Michael Howard","Title":"Security Development Lifecycle (SDL) Banned Function Calls","URL":"http://msdn.microsoft.com/en-us/library/bb288454.aspx"},{"Reference_ID":"REF-56","Author":"Microsoft","Title":"Using the Strsafe.h Functions","URL":"http://msdn.microsoft.com/en-us/library/ms647466.aspx"},{"Reference_ID":"REF-57","Author":["Matt Messier","John Viega"],"Title":"Safe C String Library v1.0.3","URL":"http://www.zork.org/safestr/"},{"Reference_ID":"REF-58","Author":"Michael Howard","Title":"Address Space Layout Randomization in Windows Vista","URL":"http://blogs.msdn.com/michael_howard/archive/2006/05/26/address-space-layout-randomization-in-windows-vista.aspx"},{"Reference_ID":"REF-59","Author":"Arjan van de Ven","Title":"Limiting buffer overflows with ExecShield","URL":"http://www.redhat.com/magazine/009jul05/features/execshield/"},{"Reference_ID":"REF-6","Author":["Katrina Tsipenyuk","Brian Chess","Gary McGraw"],"Title":"Seven Pernicious Kingdoms: A Taxonomy of Software Security Errors","Publication":"NIST Workshop on Software Security Assurance Tools Techniques and Metrics","Publication_Year":"2005","Publication_Month":"--11","Publication_Day":"---07","Publisher":"NIST","URL":"https://samate.nist.gov/SSATTM_Content/papers/Seven%20Pernicious%20Kingdoms%20-%20Taxonomy%20of%20Sw%20Security%20Errors%20-%20Tsipenyuk%20-%20Chess%20-%20McGraw.pdf"},{"Reference_ID":"REF-60","Title":"PaX","URL":"http://en.wikipedia.org/wiki/PaX"},{"Reference_ID":"REF-61","Author":"Microsoft","Title":"Understanding DEP as a mitigation technology part 1","URL":"http://blogs.technet.com/b/srd/archive/2009/06/12/understanding-dep-as-a-mitigation-technology-part-1.aspx"},{"Reference_ID":"REF-62","Author":["Mark Dowd","John McDonald","Justin Schuh"],"Title":"The Art of Software Security Assessment","Edition":"1st Edition","Publication_Year":"2006","Publisher":"Addison Wesley"},{"Reference_ID":"REF-64","Author":"Grant Murphy","Title":"Position Independent Executables (PIE)","Publication_Year":"2012","Publication_Month":"--11","Publication_Day":"---28","Publisher":"Red Hat","URL":"https://securityblog.redhat.com/2012/11/28/position-independent-executables-pie/"},{"Reference_ID":"REF-657","Title":"boost C++ Library Smart Pointers","URL":"http://www.boost.org/doc/libs/1_38_0/libs/smart_ptr/smart_ptr.htm"},{"Reference_ID":"REF-696","Author":"Ruben Santamarta","Title":"Exploiting Common Flaws in Drivers","Publication_Year":"2007","Publication_Month":"--07","Publication_Day":"---11","URL":"http://reversemode.com/index.php?option=com_content&task=view&id=38&Itemid=1"},{"Reference_ID":"REF-697","Author":"Yuriy Bulygin","Title":"Remote and Local Exploitation of Network Drivers","Publication_Year":"2007","Publication_Month":"--08","Publication_Day":"---01","URL":"https://www.blackhat.com/presentations/bh-usa-07/Bulygin/Presentation/bh-usa-07-bulygin.pdf"},{"Reference_ID":"REF-698","Author":"Anibal Sacco","Title":"Windows driver vulnerabilities: the METHOD_NEITHER odyssey","Publication_Year":"2008","Publication_Month":"--10","URL":"http://www.net-security.org/dl/insecure/INSECURE-Mag-18.pdf"},{"Reference_ID":"REF-699","Author":"Microsoft","Title":"Buffer Descriptions for I/O Control Codes","URL":"http://msdn.microsoft.com/en-us/library/ms795857.aspx"},{"Reference_ID":"REF-7","Author":["Michael Howard","David LeBlanc"],"Title":"Writing Secure Code","Edition":"2nd Edition","Publication_Year":"2002","Publication_Month":"--12","Publication_Day":"---04","Publisher":"Microsoft Press","URL":"https://www.microsoftpressstore.com/store/writing-secure-code-9780735617223"},{"Reference_ID":"REF-700","Author":"Microsoft","Title":"Using Neither Buffered Nor Direct I/O","URL":"http://msdn.microsoft.com/en-us/library/cc264614.aspx"},{"Reference_ID":"REF-701","Author":"Microsoft","Title":"Securing Device Objects","URL":"http://msdn.microsoft.com/en-us/library/ms794722.aspx"},{"Reference_ID":"REF-702","Author":"Piotr Bania","Title":"Exploiting Windows Device Drivers","URL":"http://www.piotrbania.com/all/articles/ewdd.pdf"},{"Reference_ID":"REF-704","Author":"CERT","Title":"EXP00-C. Use parentheses for precedence of operation","URL":"https://www.securecoding.cert.org/confluence/display/seccode/EXP00-C.+Use+parentheses+for+precedence+of+operation"},{"Reference_ID":"REF-74","Author":"Jason Lam","Title":"Top 25 Series - Rank 3 - Classic Buffer Overflow","Publication_Year":"2010","Publication_Month":"--03","Publication_Day":"---02","Publisher":"SANS Software Security Institute","URL":"http://software-security.sans.org/blog/2010/03/02/top-25-series-rank-3-classic-buffer-overflow/"},{"Reference_ID":"REF-741","Author":"Jason Lam","Title":"Top 25 Series - Rank 12 - Buffer Access with Incorrect Length Value","Publication_Year":"2010","Publication_Month":"--03","Publication_Day":"---11","Publisher":"SANS Software Security Institute","URL":"http://blogs.sans.org/appsecstreetfighter/2010/03/11/top-25-series-rank-12-buffer-access-with-incorrect-length-value/"},{"Reference_ID":"REF-76","Author":["Sean Barnum","Michael Gegick"],"Title":"Least Privilege","Publication_Year":"2005","Publication_Month":"--09","Publication_Day":"---14","URL":"https://buildsecurityin.us-cert.gov/daisy/bsi/articles/knowledge/principles/351.html"},{"Reference_ID":"REF-811","Author":["Mark Dowd","Ryan Smith","David Dewey"],"Title":"Attacking Interoperability","Publication_Year":"2009","URL":"http://www.azimuthsecurity.com/resources/bh2009_dowd_smith_dewey.pdf"},{"Reference_ID":"REF-884","Author":"Mateusz \\"j00ru\\" Jurczyk","Title":"Windows Kernel Reference Count Vulnerabilities - Case Study","Publication_Year":"2012","Publication_Month":"--11","URL":"http://j00ru.vexillium.org/dump/zn_slides.pdf"},{"Reference_ID":"REF-90","Title":"Buffer UNDERFLOWS: What do you know about it?","Publication":"Vuln-Dev Mailing List","Publication_Year":"2004","Publication_Month":"--01","Publication_Day":"---10","URL":"http://seclists.org/vuln-dev/2004/Jan/0022.html"},{"Reference_ID":"REF-959","Author":"Object Management Group (OMG)","Title":"Automated Source Code Performance Efficiency Measure (ASCPEM)","Publication_Year":"2016","Publication_Month":"--01","URL":"http://www.omg.org/spec/ASCPEM/1.0"},{"Reference_ID":"REF-96","Author":"Jason Lam","Title":"Top 25 Series - Rank 14 - Improper Validation of Array Index","Publication_Year":"2010","Publication_Month":"--03","Publication_Day":"---12","Publisher":"SANS Software Security Institute","URL":"http://blogs.sans.org/appsecstreetfighter/2010/03/12/top-25-series-rank-14-improper-validation-of-array-index/"},{"Reference_ID":"REF-961","Author":"Object Management Group (OMG)","Title":"Automated Source Code Reliability Measure (ASCRM)","Publication_Year":"2016","Publication_Month":"--01","URL":"http://www.omg.org/spec/ASCRM/1.0/"},{"Reference_ID":"REF-962","Author":"Object Management Group (OMG)","Title":"Automated Source Code Security Measure (ASCSM)","Publication_Year":"2016","Publication_Month":"--01","URL":"http://www.omg.org/spec/ASCSM/1.0/"}]}}}');

/***/ }),

/***/ 2357:
/***/ ((module) => {

"use strict";
module.exports = require("assert");

/***/ }),

/***/ 5747:
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ 2087:
/***/ ((module) => {

"use strict";
module.exports = require("os");

/***/ }),

/***/ 5622:
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId].call(module.exports, module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__nccwpck_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__nccwpck_require__.o(definition, key) && !__nccwpck_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__nccwpck_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__nccwpck_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
const core = __nccwpck_require__(2186);
const glob = __nccwpck_require__(8090);
const fs = __nccwpck_require__(5747);
const extractComments = __nccwpck_require__(6178)
const cwe_14 = __nccwpck_require__(6471)
const cwe_135 = __nccwpck_require__(9387)
const cwe_188 = __nccwpck_require__(6913)
const cwe_195 = __nccwpck_require__(2231)
const cwe_196 = __nccwpck_require__(598)
const cwe_243 = __nccwpck_require__(8980)
const cwe_244 = __nccwpck_require__(5294)
const cwe_374 = __nccwpck_require__(2938)
const cwe_375 = __nccwpck_require__(3779)
const cwe_401 = __nccwpck_require__(9706)
const cwe_415 = __nccwpck_require__(4690)
const cwe_416 = __nccwpck_require__(4567)
const cwe_467 = __nccwpck_require__(5764)
const cwe_468 = __nccwpck_require__(3230)
const cwe_478 = __nccwpck_require__(5956)
const cwe_481 = __nccwpck_require__(8580)
const cwe_482 = __nccwpck_require__(8743)
const cwe_483 = __nccwpck_require__(255)
const cwe_484 = __nccwpck_require__(1330)
const cwe_588 = __nccwpck_require__(1435)
const cwe_560 = __nccwpck_require__(8457)
const cwe_587 = __nccwpck_require__(8119)
const cwe_242_676 = __nccwpck_require__(632)
const alignPotentialMitigations = __nccwpck_require__(1374)
const matchCodeAndComments = __nccwpck_require__(586)

const find = async () => {
    const globber = await glob.create('*')
    const issues = core.getInput('number-issues')
    let errorsGlobal = [] //all errors over all files

    for await (const filePath of globber.globGenerator()) {
        let path = filePath
        let ending = path.toString().split(".").pop()
        if (ending === "c" || ending === "h" || ending === "o") {
            await fs.readFile(filePath, 'utf8', (err, data) => {
                if(data !== undefined) {
                    const changedData = data.toString().replace('"', '').split('\n')
                    let errors = []

                    errors.push(extractComments(changedData))

                    const cwe_242_676_error = cwe_242_676(changedData, errors[0])
                    if(cwe_242_676_error.lineNumbers.length > 0) errors.push(cwe_242_676_error)

                    const cwe_14_error = cwe_14(changedData)
                    if(cwe_14_error.lineNumbers.length > 0) errors.push(cwe_14_error)

                    const cwe_135_error = cwe_135(changedData, errors[0])
                    if(cwe_135_error.lineNumbers.length > 0) errors.push(cwe_135_error)

                    const cwe_188_error = cwe_188(changedData, errors[0])
                    if(cwe_188_error.lineNumbers.length > 0) errors.push(cwe_188_error)

                    const cwe_195_error = cwe_195(changedData, errors[0])
                    if(cwe_195_error.lineNumbers.length > 0) errors.push(cwe_195_error)

                    const cwe_196_error = cwe_196(changedData, errors[0])
                    if(cwe_196_error.lineNumbers.length > 0) errors.push(cwe_196_error)

                    const cwe_243_error = cwe_243(changedData, errors[0])
                    if(cwe_243_error.lineNumbers.length > 0) errors.push(cwe_243_error)

                    const cwe_244_error = cwe_244(changedData, errors[0])
                    if(cwe_244_error.lineNumbers.length > 0) errors.push(cwe_244_error)

                    const cwe_374_error = cwe_374(changedData, errors[0])
                    if(cwe_374_error.lineNumbers.length > 0) errors.push(cwe_374_error)

                    const cwe_375_error = cwe_375(changedData, errors[0])
                    if(cwe_375_error.lineNumbers.length > 0) errors.push(cwe_375_error)

                    const cwe_401_error = cwe_401(changedData, errors[0])
                    if(cwe_401_error.lineNumbers.length > 0) errors.push(cwe_401_error)

                    const cwe_415_error = cwe_415(changedData, errors[0])
                    if(cwe_415_error.lineNumbers.length > 0) errors.push(cwe_415_error)

                    const cwe_416_error = cwe_416(changedData, errors[0])
                    if(cwe_416_error.lineNumbers.length > 0) errors.push(cwe_416_error)

                    const cwe_467_error = cwe_467(changedData, errors[0])
                    if(cwe_467_error.lineNumbers.length > 0) errors.push(cwe_467_error)

                    const cwe_468_error = cwe_468(changedData, errors[0])
                    if(cwe_468_error.lineNumbers.length > 0) errors.push(cwe_468_error)

                    const cwe_478_error = cwe_478(changedData, errors[0])
                    if(cwe_478_error.lineNumbers.length > 0) errors.push(cwe_478_error)

                    const cwe_481_error = cwe_481(changedData, errors[0])
                    if(cwe_481_error.lineNumbers.length > 0) errors.push(cwe_481_error)

                    const cwe_482_error = cwe_482(changedData, errors[0])
                    if(cwe_482_error.lineNumbers.length > 0) errors.push(cwe_482_error)

                    const cwe_483_error = cwe_483(changedData, errors[0])
                    if(cwe_483_error.lineNumbers.length > 0) errors.push(cwe_483_error)

                    const cwe_484_error = cwe_484(changedData, errors[0])
                    if(cwe_484_error.lineNumbers.length > 0) errors.push(cwe_484_error)

                    const cwe_588_error = cwe_588(changedData, errors[0])
                    if(cwe_588_error.lineNumbers.length > 0) errors.push(cwe_588_error)

                    const cwe_560_error = cwe_560(changedData, errors[0])
                    if(cwe_560_error.lineNumbers.length > 0) errors.push(cwe_560_error)

                    const cwe_587_error = cwe_587(changedData, errors[0])
                    if(cwe_587_error.lineNumbers.length > 0) errors.push(cwe_587_error)

                    errors.map((error, index) => {
                        if(index > 0) {
                            errorsGlobal.push(JSON.stringify({
                                filePath,
                                error
                            }))
                            core.setFailed(`CWE Weakness ${error.issueNumber} found in file ${filePath}, following lines are affected: ${error.lineNumbers.join(', ')}`)
                            core.info(alignPotentialMitigations(error.mitigation))
                        }
                    })

                    const satd = matchCodeAndComments(errors, data)

                    if(satd['0'].comments.matchedCommets && satd['0'].comments.matchedCommets.length > 0){
                        core.setFailed(`${satd['0'].comments.matchedCommets.length === 1 ? `One instance of SATD was found in the file ${filePath}:` : `Multiple instances of SATD were found in the file ${filePath}:` }`)
                        core.info(satd['0'].comments.matchedCommets.map(satd => `- Comment (line ${satd.commentLine}) and code (line ${satd.codeLine}) for the CWE issue ${errors[satd.errorNumber].issueNumber} were linked and identified as SATD`).join('\n'))
                    } else {
                        core.info(`No instance of satd was found in the ${filePath}\n\n`)
                    }

                } else {
                    console.log('Data was undefined')
                    console.log(filePath)
                }

            })
        }
    }
}

try{
    find()
} catch (err){
    core.setFailed('some strange error occurred, please re-run it!')
}
})();

module.exports = __webpack_exports__;
/******/ })()
;