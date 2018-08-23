## Modules

<dl>
<dt><a href="#module_json-reporter">json-reporter</a></dt>
<dd><p>Return a JSON valid representation of the todos.</p>
</dd>
<dt><a href="#module_markdown-reporter">markdown-reporter</a></dt>
<dd><p>Returns a markdown version of the todos.</p>
</dd>
<dt><a href="#module_raw-reporter">raw-reporter</a></dt>
<dd><p>Just returns the raw javascript todos</p>
</dd>
<dt><a href="#module_table-reporter">table-reporter</a></dt>
<dd><p>Returns a pretty formatted table of the todos.</p>
</dd>
<dt><a href="#module_vscode-reporter">vscode-reporter</a></dt>
<dd><p>Returns a markdown version of the todos customized for Visual Studio Code. The file names are
 transformed as URLs and the line numbers as anchors which makes them clickable when the markdown
 content produced with this reporter is opened on Visual Studio Code.</p>
</dd>
<dt><a href="#module_xml-reporter">xml-reporter</a></dt>
<dd><p>Return an unformatted XML valid representation of the todos.</p>
</dd>
</dl>

<a name="module_json-reporter"></a>

## json-reporter
Return a JSON valid representation of the todos.

<a name="exp_module_json-reporter--reporter"></a>

### reporter(todos, [config]) ⇒ <code>string</code> ⏏
**Kind**: Exported function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| todos | <code>Array.&lt;Object&gt;</code> |  | The parsed todos |
| [config] | <code>Object</code> |  | Config passed to this reporter |
| [config.spacing] | <code>number</code> | <code>2</code> | The amount of spacing for the json output |

<a name="module_markdown-reporter"></a>

## markdown-reporter
Returns a markdown version of the todos.


* [markdown-reporter](#module_markdown-reporter)
    * [reporter(todos, [config])](#exp_module_markdown-reporter--reporter) ⇒ <code>string</code> ⏏
        * [~transformComment(file, line, text, kind, ref)](#module_markdown-reporter--reporter..transformComment) ⇒ <code>string</code> \| <code>Array.&lt;string&gt;</code>
        * [~transformHeader(kind)](#module_markdown-reporter--reporter..transformHeader) ⇒ <code>string</code> \| <code>Array.&lt;string&gt;</code>

<a name="exp_module_markdown-reporter--reporter"></a>

### reporter(todos, [config]) ⇒ <code>string</code> ⏏
**Kind**: Exported function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| todos | <code>Array.&lt;Object&gt;</code> |  | The parsed todos |
| [config] | <code>Object</code> |  |  |
| [config.padding] | <code>number</code> | <code>2</code> | How many new lines should separate between comment type blocks. |
| [config.newLine] | <code>string</code> | <code>&quot;os.EOL&quot;</code> | How to separate lines in the output file. Defaults to your OS's default line separator. |
| [config.transformComment] | <code>function</code> | <code>transformComment</code> | Control the output for each comment. |
| [config.transformHeader] | <code>function</code> | <code>transformHeader</code> | Control the output of a header for each comment kind (i.e todo, fixme). |

<a name="module_markdown-reporter--reporter..transformComment"></a>

#### reporter~transformComment(file, line, text, kind, ref) ⇒ <code>string</code> \| <code>Array.&lt;string&gt;</code>
**Kind**: inner method of [<code>reporter</code>](#exp_module_markdown-reporter--reporter)  
**Returns**: <code>string</code> \| <code>Array.&lt;string&gt;</code> - If you return an array of strings they will be joined by newlines  

| Param | Type | Description |
| --- | --- | --- |
| file | <code>string</code> | Filename being reported |
| line | <code>number</code> | Line the comment appeared |
| text | <code>string</code> | Text of comment |
| kind | <code>string</code> | Kind of comment (todo/fixme) |
| ref | <code>string</code> | The reference found in comment |

<a name="module_markdown-reporter--reporter..transformHeader"></a>

#### reporter~transformHeader(kind) ⇒ <code>string</code> \| <code>Array.&lt;string&gt;</code>
**Kind**: inner method of [<code>reporter</code>](#exp_module_markdown-reporter--reporter)  
**Returns**: <code>string</code> \| <code>Array.&lt;string&gt;</code> - If you return an array of strings they will be joined by newlines  

| Param | Type | Description |
| --- | --- | --- |
| kind | <code>string</code> | The kind of todo/fixme |

<a name="module_raw-reporter"></a>

## raw-reporter
Just returns the raw javascript todos

<a name="exp_module_raw-reporter--reporter"></a>

### reporter(todos) ⇒ <code>Array.&lt;Object&gt;</code> ⏏
**Kind**: Exported function  

| Param | Type | Description |
| --- | --- | --- |
| todos | <code>Array.&lt;Object&gt;</code> | The parsed todos |

<a name="module_table-reporter"></a>

## table-reporter
Returns a pretty formatted table of the todos.

<a name="exp_module_table-reporter--reporter"></a>

### reporter(todos) ⇒ <code>string</code> ⏏
**Kind**: Exported function  

| Param | Type | Description |
| --- | --- | --- |
| todos | <code>Array.&lt;Object&gt;</code> | The parsed todos |

<a name="module_vscode-reporter"></a>

## vscode-reporter
Returns a markdown version of the todos customized for Visual Studio Code. The file names are
 transformed as URLs and the line numbers as anchors which makes them clickable when the markdown
 content produced with this reporter is opened on Visual Studio Code.


* [vscode-reporter](#module_vscode-reporter)
    * [reporter(todos, [config])](#exp_module_vscode-reporter--reporter) ⇒ <code>string</code> ⏏
        * [~transformComment(file, line, text, kind, ref)](#module_vscode-reporter--reporter..transformComment) ⇒ <code>string</code> \| <code>Array.&lt;string&gt;</code>
        * [~transformHeader(kind)](#module_vscode-reporter--reporter..transformHeader) ⇒ <code>string</code> \| <code>Array.&lt;string&gt;</code>

<a name="exp_module_vscode-reporter--reporter"></a>

### reporter(todos, [config]) ⇒ <code>string</code> ⏏
**Kind**: Exported function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| todos | <code>Array.&lt;Object&gt;</code> |  | The parsed todos |
| [config] | <code>Object</code> |  |  |
| [config.padding] | <code>number</code> | <code>2</code> | How many new lines should separate between comment type blocks. |
| [config.newLine] | <code>string</code> | <code>&quot;os.EOL&quot;</code> | How to separate lines in the output file. Defaults to your OS's default line separator. |
| [config.transformComment] | <code>function</code> | <code>transformComment</code> | Control the output for each comment. |
| [config.transformHeader] | <code>function</code> | <code>transformHeader</code> | Control the output of a header for each comment kind (i.e todo, fixme). |

<a name="module_vscode-reporter--reporter..transformComment"></a>

#### reporter~transformComment(file, line, text, kind, ref) ⇒ <code>string</code> \| <code>Array.&lt;string&gt;</code>
**Kind**: inner method of [<code>reporter</code>](#exp_module_vscode-reporter--reporter)  
**Returns**: <code>string</code> \| <code>Array.&lt;string&gt;</code> - If you return an array of strings they will be joined by newlines  

| Param | Type | Description |
| --- | --- | --- |
| file | <code>string</code> | Filename being reported |
| line | <code>number</code> | Line the comment appeared |
| text | <code>string</code> | Text of comment |
| kind | <code>string</code> | Kind of comment (todo/fixme) |
| ref | <code>string</code> | The reference found in comment |

<a name="module_vscode-reporter--reporter..transformHeader"></a>

#### reporter~transformHeader(kind) ⇒ <code>string</code> \| <code>Array.&lt;string&gt;</code>
**Kind**: inner method of [<code>reporter</code>](#exp_module_vscode-reporter--reporter)  
**Returns**: <code>string</code> \| <code>Array.&lt;string&gt;</code> - If you return an array of strings they will be joined by newlines  

| Param | Type | Description |
| --- | --- | --- |
| kind | <code>string</code> | The kind of todo/fixme |

<a name="module_xml-reporter"></a>

## xml-reporter
Return an unformatted XML valid representation of the todos.

<a name="exp_module_xml-reporter--reporter"></a>

### reporter(todos, [config]) ⇒ <code>string</code> ⏏
**Kind**: Exported function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| todos | <code>Array.&lt;Object&gt;</code> |  | The parsed todos |
| [config] | <code>Object</code> |  | the configuration object |
| [config.header] | <code>boolean</code> | <code>true</code> | Whether to include xml header |
| [config.attributes_key] | <code>boolean</code> |  | See https://github.com/estheban/node-json2xml#options--behaviour |

