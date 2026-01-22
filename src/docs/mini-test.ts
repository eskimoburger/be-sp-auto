export const MINI_TEST_HTML = `<!DOCTYPE html>
<html lang="th">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>SP Auto Service - API Tester</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
    <style>
        :root {
            --bg-primary: #0f172a;
            --bg-secondary: #1e293b;
            --bg-tertiary: #334155;
            --text-primary: #f1f5f9;
            --text-secondary: #94a3b8;
            --accent: #3b82f6;
            --accent-hover: #2563eb;
            --success: #22c55e;
            --warning: #f59e0b;
            --danger: #ef4444;
            --border: #475569;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', sans-serif;
            background: var(--bg-primary);
            color: var(--text-primary);
            min-height: 100vh;
            line-height: 1.6;
        }

        .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 1.5rem;
        }

        header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem 1.5rem;
            background: var(--bg-secondary);
            border-radius: 12px;
            margin-bottom: 1.5rem;
            border: 1px solid var(--border);
        }

        header h1 {
            font-size: 1.5rem;
            color: var(--accent);
        }

        .token-status {
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }

        .status-indicator {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: var(--danger);
        }

        .status-indicator.authenticated {
            background: var(--success);
        }

        .main-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1.5rem;
        }

        @media (max-width: 1024px) {
            .main-grid {
                grid-template-columns: 1fr;
            }
        }

        .panel {
            background: var(--bg-secondary);
            border-radius: 12px;
            padding: 1.5rem;
            border: 1px solid var(--border);
        }

        .panel h2 {
            font-size: 1.1rem;
            margin-bottom: 1rem;
            color: var(--accent);
            border-bottom: 1px solid var(--border);
            padding-bottom: 0.5rem;
        }

        .panel h3 {
            font-size: 0.95rem;
            margin: 1rem 0 0.5rem;
            color: var(--text-secondary);
        }

        .form-group {
            margin-bottom: 1rem;
        }

        label {
            display: block;
            margin-bottom: 0.4rem;
            color: var(--text-secondary);
            font-size: 0.85rem;
        }

        input,
        textarea,
        select {
            width: 100%;
            padding: 0.6rem 0.8rem;
            background: var(--bg-tertiary);
            border: 1px solid var(--border);
            border-radius: 6px;
            color: var(--text-primary);
            font-family: inherit;
            font-size: 0.9rem;
        }

        input:focus,
        textarea:focus,
        select:focus {
            outline: none;
            border-color: var(--accent);
        }

        textarea {
            min-height: 80px;
            resize: vertical;
        }

        button {
            padding: 0.6rem 1.2rem;
            background: var(--accent);
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 500;
            font-size: 0.9rem;
            transition: all 0.2s;
        }

        button:hover {
            background: var(--accent-hover);
        }

        button.danger {
            background: var(--danger);
        }

        button.success {
            background: var(--success);
        }

        button.warning {
            background: var(--warning);
            color: #000;
        }

        button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        .btn-group {
            display: flex;
            gap: 0.5rem;
            flex-wrap: wrap;
            margin-top: 0.5rem;
        }

        .btn-sm {
            padding: 0.4rem 0.8rem;
            font-size: 0.8rem;
        }

        .response-panel {
            background: var(--bg-tertiary);
            border-radius: 8px;
            padding: 1rem;
            margin-top: 1rem;
            max-height: 400px;
            overflow-y: auto;
        }

        .response-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 0.5rem;
        }

        .status-badge {
            padding: 0.2rem 0.6rem;
            border-radius: 4px;
            font-size: 0.75rem;
            font-weight: 600;
        }

        .status-2xx {
            background: var(--success);
            color: #fff;
        }

        .status-4xx {
            background: var(--warning);
            color: #000;
        }

        .status-5xx {
            background: var(--danger);
            color: #fff;
        }

        pre {
            font-family: 'Courier New', monospace;
            font-size: 0.8rem;
            white-space: pre-wrap;
            word-break: break-all;
            color: var(--text-secondary);
        }

        .json-key {
            color: #7dd3fc;
        }

        .json-string {
            color: #86efac;
        }

        .json-number {
            color: #fbbf24;
        }

        .json-boolean {
            color: #a78bfa;
        }

        .json-null {
            color: #94a3b8;
        }

        .workflow-steps {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }

        .step {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 0.5rem;
            background: var(--bg-tertiary);
            border-radius: 6px;
        }

        .step-indicator {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.75rem;
            font-weight: 600;
            background: var(--border);
        }

        .step-indicator.done {
            background: var(--success);
        }

        .step-indicator.error {
            background: var(--danger);
        }

        .step-indicator.running {
            background: var(--accent);
            animation: pulse 1s infinite;
        }

        @keyframes pulse {

            0%,
            100% {
                opacity: 1;
            }

            50% {
                opacity: 0.5;
            }
        }

        .tabs {
            display: flex;
            gap: 0.5rem;
            margin-bottom: 1rem;
            flex-wrap: wrap;
        }

        .tab {
            padding: 0.5rem 1rem;
            background: var(--bg-tertiary);
            border: 1px solid var(--border);
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.2s;
            font-size: 0.85rem;
        }

        .tab.active,
        .tab:hover {
            background: var(--accent);
            border-color: var(--accent);
        }

        .tab-content {
            display: none;
        }

        .tab-content.active {
            display: block;
        }

        .nav-links {
            display: flex;
            gap: 0.5rem;
            margin-bottom: 1rem;
        }

        .nav-link {
            color: var(--text-secondary);
            text-decoration: none;
            padding: 0.3rem 0.6rem;
            font-size: 0.85rem;
        }

        .nav-link:hover {
            color: var(--accent);
        }
    </style>
</head>

<body>
    <div class="container">
        <header>
            <div>
                <h1>SP Auto Service - API Tester</h1>
                <div class="nav-links">
                    <a href="/docs/th" class="nav-link">Thai Docs</a>
                    <a href="/ui" class="nav-link">Swagger UI</a>
                </div>
            </div>
            <div class="token-status">
                <span id="tokenLabel">Not Authenticated</span>
                <div class="status-indicator" id="statusIndicator"></div>
            </div>
        </header>

        <div class="main-grid">
            <!-- Left Column -->
            <div>
                <!-- Login Panel -->
                <div class="panel" id="loginPanel">
                    <h2>Authentication</h2>
                    <div class="form-group">
                        <label>Username</label>
                        <input type="text" id="username" value="admin" />
                    </div>
                    <div class="form-group">
                        <label>Password</label>
                        <input type="password" id="password" value="password123" />
                    </div>
                    <div class="btn-group">
                        <button onclick="doLogin()">Login</button>
                        <button onclick="doLogout()" class="danger">Logout</button>
                    </div>
                </div>

                <!-- Workflow Test Panel -->
                <div class="panel" style="margin-top: 1rem;">
                    <h2>Workflow Test (Customer → Vehicle → Job)</h2>
                    <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1rem;">
                        ทดสอบ flow การสร้างงาน: สร้างลูกค้า → สร้างรถ → สร้าง Job
                    </p>
                    <button onclick="runWorkflow()" id="workflowBtn" class="success">Run Workflow Test</button>

                    <div class="workflow-steps" id="workflowSteps" style="margin-top: 1rem;">
                        <div class="step">
                            <div class="step-indicator" id="step1">1</div>
                            <span>Create Customer</span>
                        </div>
                        <div class="step">
                            <div class="step-indicator" id="step2">2</div>
                            <span>Create Vehicle</span>
                        </div>
                        <div class="step">
                            <div class="step-indicator" id="step3">3</div>
                            <span>Create Job</span>
                        </div>
                        <div class="step">
                            <div class="step-indicator" id="step4">4</div>
                            <span>Get Job Details (with Stages)</span>
                        </div>
                    </div>
                </div>

                <!-- Module Testers -->
                <div class="panel" style="margin-top: 1rem;">
                    <h2>Module Testers</h2>
                    <div class="tabs">
                        <div class="tab active" onclick="showTab('customers')">Customers</div>
                        <div class="tab" onclick="showTab('vehicles')">Vehicles</div>
                        <div class="tab" onclick="showTab('jobs')">Jobs</div>
                        <div class="tab" onclick="showTab('employees')">Employees</div>
                        <div class="tab" onclick="showTab('insurances')">Insurance</div>
                    </div>

                    <!-- Customers Tab -->
                    <div class="tab-content active" id="customersTab">
                        <h3>Customers</h3>
                        <div class="btn-group">
                            <button class="btn-sm" onclick="callApi('GET', '/api/v1/private/customers')">Get
                                All</button>
                            <button class="btn-sm" onclick="callApi('GET', '/api/v1/private/customers/1')">Get
                                #1</button>
                        </div>
                        <h3>Create Customer</h3>
                        <div class="form-group">
                            <label>Name</label>
                            <input type="text" id="custName" placeholder="ชื่อลูกค้า" />
                        </div>
                        <div class="form-group">
                            <label>Phone</label>
                            <input type="text" id="custPhone" placeholder="0812345678" />
                        </div>
                        <button class="btn-sm success" onclick="createCustomer()">Create</button>
                    </div>

                    <!-- Vehicles Tab -->
                    <div class="tab-content" id="vehiclesTab">
                        <h3>Vehicles</h3>
                        <div class="btn-group">
                            <button class="btn-sm" onclick="callApi('GET', '/api/v1/private/vehicles')">Get All</button>
                            <button class="btn-sm"
                                onclick="callApi('GET', '/api/v1/private/vehicles/brands')">Brands</button>
                            <button class="btn-sm"
                                onclick="callApi('GET', '/api/v1/private/vehicles/types')">Types</button>
                        </div>
                        <h3>Create Vehicle</h3>
                        <div class="form-group">
                            <label>Registration</label>
                            <input type="text" id="vehReg" placeholder="1กข-1234" />
                        </div>
                        <div class="form-group">
                            <label>Brand</label>
                            <input type="text" id="vehBrand" placeholder="Toyota" />
                        </div>
                        <div class="form-group">
                            <label>Model</label>
                            <input type="text" id="vehModel" placeholder="Camry" />
                        </div>
                        <div class="form-group">
                            <label>Customer ID</label>
                            <input type="number" id="vehCustId" placeholder="1" />
                        </div>
                        <button class="btn-sm success" onclick="createVehicle()">Create</button>
                    </div>

                    <!-- Jobs Tab -->
                    <div class="tab-content" id="jobsTab">
                        <h3>Jobs</h3>
                        <div class="btn-group">
                            <button class="btn-sm" onclick="callApi('GET', '/api/v1/private/jobs')">Get All</button>
                            <button class="btn-sm"
                                onclick="callApi('GET', '/api/v1/private/jobs?status=claim')">Claim</button>
                            <button class="btn-sm"
                                onclick="callApi('GET', '/api/v1/private/jobs?status=repair')">Repair</button>
                            <button class="btn-sm"
                                onclick="callApi('GET', '/api/v1/private/jobs?status=billing')">Billing</button>
                        </div>
                        <h3>Get Job by ID</h3>
                        <div class="form-group">
                            <label>Job ID</label>
                            <input type="number" id="jobId" placeholder="1" />
                        </div>
                        <button class="btn-sm"
                            onclick="callApi('GET', '/api/v1/private/jobs/' + document.getElementById('jobId').value)">Get
                            Job</button>
                    </div>

                    <!-- Employees Tab -->
                    <div class="tab-content" id="employeesTab">
                        <h3>Employees</h3>
                        <div class="btn-group">
                            <button class="btn-sm" onclick="callApi('GET', '/api/v1/private/employees')">Get
                                All</button>
                            <button class="btn-sm" onclick="callApi('GET', '/api/v1/private/profile')">My
                                Profile</button>
                        </div>
                        <h3>Create Employee</h3>
                        <div class="form-group">
                            <label>Name</label>
                            <input type="text" id="empName" placeholder="ชื่อพนักงาน" />
                        </div>
                        <div class="form-group">
                            <label>Role</label>
                            <select id="empRole">
                                <option value="technician">Technician</option>
                                <option value="admin">Admin</option>
                                <option value="manager">Manager</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Username</label>
                            <input type="text" id="empUsername" placeholder="username" />
                        </div>
                        <div class="form-group">
                            <label>Password</label>
                            <input type="password" id="empPassword" placeholder="password" />
                        </div>
                        <button class="btn-sm success" onclick="createEmployee()">Create</button>
                    </div>

                    <!-- Insurance Tab -->
                    <div class="tab-content" id="insurancesTab">
                        <h3>Insurance Companies</h3>
                        <div class="btn-group">
                            <button class="btn-sm" onclick="callApi('GET', '/api/v1/private/insurances')">Get
                                All</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Right Column: Response Panel -->
            <div class="panel">
                <h2>API Response</h2>
                <div class="response-panel">
                    <div class="response-header">
                        <span id="responseMethod">-</span>
                        <span class="status-badge" id="responseStatus">-</span>
                    </div>
                    <pre id="responseBody">// Response will appear here...</pre>
                </div>
            </div>
        </div>
    </div>

    <script>
        const API_BASE = '';
        let token = localStorage.getItem('sp_token') || '';

        function updateAuthUI() {
            const indicator = document.getElementById('statusIndicator');
            const label = document.getElementById('tokenLabel');
            if (token) {
                indicator.classList.add('authenticated');
                label.textContent = 'Authenticated';
            } else {
                indicator.classList.remove('authenticated');
                label.textContent = 'Not Authenticated';
            }
        }

        function showResponse(method, url, status, body) {
            document.getElementById('responseMethod').textContent = \`\${method} \${url}\`;
            const statusEl = document.getElementById('responseStatus');
            statusEl.textContent = status;
            statusEl.className = 'status-badge';
            if (status >= 200 && status < 300) statusEl.classList.add('status-2xx');
            else if (status >= 400 && status < 500) statusEl.classList.add('status-4xx');
            else if (status >= 500) statusEl.classList.add('status-5xx');

            document.getElementById('responseBody').innerHTML = syntaxHighlight(body);
        }

        function syntaxHighlight(json) {
            if (typeof json !== 'string') {
                json = JSON.stringify(json, null, 2);
            }
            json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            return json.replace(/("(\\u[\da-fA-F]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
                let cls = 'json-number';
                if (/^"/.test(match)) {
                    if (/:$/.test(match)) {
                        cls = 'json-key';
                    } else {
                        cls = 'json-string';
                    }
                } else if (/true|false/.test(match)) {
                    cls = 'json-boolean';
                } else if (/null/.test(match)) {
                    cls = 'json-null';
                }
                return '<span class="' + cls + '">' + match + '</span>';
            });
        }

        async function callApi(method, url, body = null) {
            const headers = { 'Content-Type': 'application/json' };
            if (token) headers['Authorization'] = \`Bearer \${token}\`;

            const options = { method, headers };
            if (body) options.body = JSON.stringify(body);

            try {
                const res = await fetch(API_BASE + url, options);
                const data = await res.json();
                showResponse(method, url, res.status, data);
                return { status: res.status, data };
            } catch (err) {
                showResponse(method, url, 'ERR', { error: err.message });
                return { status: 0, data: null };
            }
        }

        async function doLogin() {
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const { status, data } = await callApi('POST', '/api/v1/public/auth/login', { username, password });
            if (status === 200 && data.token) {
                token = data.token;
                localStorage.setItem('sp_token', token);
                updateAuthUI();
            }
        }

        function doLogout() {
            token = '';
            localStorage.removeItem('sp_token');
            updateAuthUI();
            showResponse('POST', '/api/v1/public/auth/logout', 200, { message: 'Logged out (token cleared)' });
        }

        function showTab(tabName) {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            document.getElementById(tabName + 'Tab').classList.add('active');
            event.target.classList.add('active');
        }

        async function createCustomer() {
            const name = document.getElementById('custName').value;
            const phone = document.getElementById('custPhone').value;
            await callApi('POST', '/api/v1/private/customers', { name, phone });
        }

        async function createVehicle() {
            const registration = document.getElementById('vehReg').value;
            const brand = document.getElementById('vehBrand').value;
            const model = document.getElementById('vehModel').value;
            const customerId = parseInt(document.getElementById('vehCustId').value);
            await callApi('POST', '/api/v1/private/vehicles', { registration, brand, model, customerId });
        }

        async function createEmployee() {
            const name = document.getElementById('empName').value;
            const role = document.getElementById('empRole').value;
            const username = document.getElementById('empUsername').value;
            const password = document.getElementById('empPassword').value;
            await callApi('POST', '/api/v1/private/employees', { name, role, username, password });
        }

        function setStepStatus(stepId, status) {
            const el = document.getElementById(stepId);
            el.classList.remove('done', 'error', 'running');
            if (status) el.classList.add(status);
        }

        function resetSteps() {
            ['step1', 'step2', 'step3', 'step4'].forEach(s => setStepStatus(s, ''));
        }

        async function runWorkflow() {
            if (!token) {
                alert('Please login first!');
                return;
            }

            const btn = document.getElementById('workflowBtn');
            btn.disabled = true;
            resetSteps();

            const ts = Date.now();

            // Step 1: Create Customer
            setStepStatus('step1', 'running');
            const custRes = await callApi('POST', '/api/v1/private/customers', {
                name: \`Test Customer \${ts}\`,
                phone: '0812345678'
            });
            if (custRes.status !== 201) {
                setStepStatus('step1', 'error');
                btn.disabled = false;
                return;
            }
            setStepStatus('step1', 'done');
            const customerId = custRes.data.id;

            // Step 2: Create Vehicle
            setStepStatus('step2', 'running');
            const vehRes = await callApi('POST', '/api/v1/private/vehicles', {
                registration: \`TEST-\${ts}\`,
                brand: 'Toyota',
                model: 'Camry',
                customerId
            });
            if (vehRes.status !== 201) {
                setStepStatus('step2', 'error');
                btn.disabled = false;
                return;
            }
            setStepStatus('step2', 'done');
            const vehicleId = vehRes.data.id;

            // Step 3: Create Job
            setStepStatus('step3', 'running');
            const jobRes = await callApi('POST', '/api/v1/private/jobs', {
                jobNumber: \`JOB-\${ts}\`,
                vehicleId,
                customerId,
                startDate: new Date().toISOString()
            });
            if (jobRes.status !== 201) {
                setStepStatus('step3', 'error');
                btn.disabled = false;
                return;
            }
            setStepStatus('step3', 'done');
            const jobId = jobRes.data.id;

            // Step 4: Get Job Details
            setStepStatus('step4', 'running');
            const detailRes = await callApi('GET', \`/api/v1/private/jobs/\${jobId}\`);
            if (detailRes.status !== 200) {
                setStepStatus('step4', 'error');
                btn.disabled = false;
                return;
            }
            setStepStatus('step4', 'done');

            btn.disabled = false;
        }

        // Initialize
        updateAuthUI();
    </script>
</body>

</html>`;
