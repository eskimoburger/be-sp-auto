export const THAI_DOCS_HTML = `<!doctype html>
<html lang="th">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>คู่มือ API ระบบ SP Auto Service</title>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@300;400;500;600;700&display=swap"
        rel="stylesheet" />
    <script type="module">
        import mermaid from "https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs";
        mermaid.initialize({
            startOnLoad: true,
            theme: "default",
            flowchart: {
                curve: "basis",
                padding: 20
            }
        });
    </script>
    <style>
        :root {
            --primary: #2563eb;
            --primary-light: #3b82f6;
            --success: #22c55e;
            --warning: #f59e0b;
            --danger: #ef4444;
            --dark: #1e293b;
            --gray: #64748b;
            --light: #f8fafc;
            --white: #ffffff;
            --border: #e2e8f0;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family:
                "Noto Sans Thai",
                -apple-system,
                BlinkMacSystemFont,
                sans-serif;
            background: var(--light);
            min-height: 100vh;
            color: var(--dark);
            line-height: 1.6;
        }

        .container {
            max-width: 1100px;
            margin: 0 auto;
            padding: 1.5rem;
        }

        header {
            background: var(--white);
            border-radius: 12px;
            padding: 2rem;
            margin-bottom: 1.5rem;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            text-align: center;
            border: 1px solid var(--border);
        }

        header h1 {
            font-size: 2rem;
            color: var(--primary);
            margin-bottom: 0.5rem;
        }

        header p {
            color: var(--gray);
            font-size: 1rem;
        }

        .card {
            background: var(--white);
            border-radius: 12px;
            padding: 1.5rem;
            margin-bottom: 1.25rem;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
            border: 1px solid var(--border);
        }

        .card h2 {
            color: var(--primary);
            font-size: 1.35rem;
            margin-bottom: 1rem;
            padding-bottom: 0.75rem;
            border-bottom: 2px solid var(--border);
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .card h3 {
            color: var(--dark);
            font-size: 1.05rem;
            margin: 1.25rem 0 0.5rem;
        }

        .endpoint {
            background: var(--light);
            border-radius: 8px;
            padding: 0.875rem 1rem;
            margin: 0.625rem 0;
            border-left: 3px solid var(--primary);
        }

        .endpoint-header {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            flex-wrap: wrap;
        }

        .method {
            font-size: 0.7rem;
            font-weight: 700;
            padding: 0.2rem 0.6rem;
            border-radius: 4px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .method.get {
            background: #dcfce7;
            color: #166534;
        }

        .method.post {
            background: #dbeafe;
            color: #1e40af;
        }

        .method.patch {
            background: #fef3c7;
            color: #92400e;
        }

        .method.put {
            background: #fed7aa;
            color: #9a3412;
        }

        .method.delete {
            background: #fee2e2;
            color: #991b1b;
        }

        .url {
            font-family: "Courier New", monospace;
            color: var(--dark);
            font-weight: 500;
            font-size: 0.9rem;
        }

        .auth-badge {
            font-size: 0.65rem;
            background: var(--warning);
            color: white;
            padding: 0.15rem 0.4rem;
            border-radius: 3px;
        }

        .desc {
            color: var(--gray);
            margin-top: 0.4rem;
            font-size: 0.9rem;
        }

        .mermaid-container {
            background: var(--white);
            border-radius: 8px;
            padding: 1.5rem;
            margin: 1rem 0;
            border: 1px solid var(--border);
            overflow-x: auto;
        }

        .mermaid {
            display: flex;
            justify-content: center;
        }

        .code-block {
            background: var(--dark);
            color: #e2e8f0;
            border-radius: 8px;
            padding: 1rem;
            margin: 0.75rem 0;
            font-family: "Courier New", monospace;
            font-size: 0.85rem;
            overflow-x: auto;
        }

        .code-block .key {
            color: #7dd3fc;
        }

        .code-block .value {
            color: #86efac;
        }

        .code-block .comment {
            color: #94a3b8;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin: 1rem 0;
            font-size: 0.875rem;
        }

        th,
        td {
            padding: 0.625rem 0.875rem;
            text-align: left;
            border-bottom: 1px solid var(--border);
        }

        th {
            background: var(--light);
            font-weight: 600;
            color: var(--dark);
        }

        tr:hover {
            background: var(--light);
        }

        .nav-links {
            display: flex;
            gap: 0.625rem;
            justify-content: center;
            margin-bottom: 1.5rem;
            flex-wrap: wrap;
        }

        .nav-link {
            background: var(--white);
            padding: 0.5rem 1rem;
            border-radius: 6px;
            text-decoration: none;
            color: var(--dark);
            font-weight: 500;
            font-size: 0.875rem;
            transition: all 0.2s;
            border: 1px solid var(--border);
        }

        .nav-link:hover {
            background: var(--primary);
            color: white;
            border-color: var(--primary);
        }

        footer {
            text-align: center;
            padding: 2rem 1rem;
            color: var(--gray);
            font-size: 0.875rem;
        }

        @media (max-width: 768px) {
            .container {
                padding: 1rem;
            }

            header h1 {
                font-size: 1.5rem;
            }

            .card {
                padding: 1rem;
            }

            .endpoint-header {
                flex-direction: column;
                align-items: flex-start;
                gap: 0.4rem;
            }
        }
    </style>
</head>

<body>
    <div class="container">
        <header>
            <h1>SP Auto Service API</h1>
            <p>คู่มือการใช้งาน API ระบบจัดการอู่ซ่อมรถ - บริษัท เอส.พี.ออโต้เพ้นท์ เซอร์วิส จำกัด</p>
        </header>

        <nav class="nav-links">
            <a href="#overview" class="nav-link">ภาพรวม</a>
            <a href="#auth" class="nav-link">ยืนยันตัวตน</a>
            <a href="#profile" class="nav-link">โปรไฟล์</a>
            <a href="#employees" class="nav-link">พนักงาน</a>
            <a href="#customers" class="nav-link">ลูกค้า</a>
            <a href="#vehicles" class="nav-link">ยานพาหนะ</a>
            <a href="#insurances" class="nav-link">บริษัทประกัน</a>
            <a href="#jobs" class="nav-link">งานซ่อม</a>
            <a href="/ui" class="nav-link">Swagger UI</a>
        </nav>

        <!-- Overview Section -->
        <div class="card" id="overview">
            <h2>ภาพรวมระบบ</h2>
            <p>ระบบ SP Auto Service API เป็น RESTful API สำหรับจัดการข้อมูลอู่ซ่อมรถ ประกอบด้วยโมดูลหลักดังนี้:</p>

            <h3>Flow การใช้งาน API</h3>
            <div class="mermaid-container">
                <div class="mermaid">
                    flowchart LR
                    A["Client<br />App/Web"] --> B["Login<br />/api/v1/public/auth/login"]
                    B --> C["รับ JWT Token"]
                    C --> D["เรียก API<br />ต่างๆ"]
                    D --> E["Employees<br />/api/v1/private/employees"]
                    D --> F["Customers<br />/api/v1/private/customers"]
                    D --> G["Vehicles<br />/api/v1/private/vehicles"]
                    D --> H["Jobs<br />/api/v1/private/jobs"]
                </div>
            </div>

            <h3>โครงสร้างข้อมูลหลัก</h3>
            <table>
                <tr>
                    <th>โมดูล</th>
                    <th>รายละเอียด</th>
                    <th>Base URL</th>
                </tr>
                <tr>
                    <td>Authentication</td>
                    <td>ยืนยันตัวตน Login/Logout</td>
                    <td>/api/v1/public/auth</td>
                </tr>
                <tr>
                    <td>Profile</td>
                    <td>ข้อมูลโปรไฟล์ผู้ใช้</td>
                    <td>/api/v1/private/profile</td>
                </tr>
                <tr>
                    <td>Employees</td>
                    <td>จัดการข้อมูลพนักงาน</td>
                    <td>/api/v1/private/employees</td>
                </tr>
                <tr>
                    <td>Customers</td>
                    <td>จัดการข้อมูลลูกค้า</td>
                    <td>/api/v1/private/customers</td>
                </tr>
                <tr>
                    <td>Vehicles</td>
                    <td>จัดการข้อมูลรถ, ยี่ห้อ, ประเภท</td>
                    <td>/api/v1/private/vehicles</td>
                </tr>
                <tr>
                    <td>Jobs</td>
                    <td>จัดการงานซ่อม</td>
                    <td>/api/v1/private/jobs</td>
                </tr>
            </table>

            <h3>รูปแบบ Error Response</h3>
            <p>เมื่อเกิดข้อผิดพลาด API จะส่งค่ากลับมาในรูปแบบดังนี้:</p>
            <div class="code-block">
                {<br />
                <span class="key">"error"</span>: <span class="value">"รายละเอียดข้อผิดพลาด"</span><br />
                }
            </div>

            <h3>HTTP Status Codes ที่ใช้:</h3>
            <table>
                <tr>
                    <th>Code</th>
                    <th>ความหมาย</th>
                    <th>ตัวอย่าง</th>
                </tr>
                <tr>
                    <td><strong>200</strong></td>
                    <td>สำเร็จ</td>
                    <td>ดึงข้อมูลสำเร็จ, ลบข้อมูลสำเร็จ</td>
                </tr>
                <tr>
                    <td><strong>201</strong></td>
                    <td>สร้างสำเร็จ</td>
                    <td>เพิ่มข้อมูลใหม่สำเร็จ</td>
                </tr>
                <tr>
                    <td><strong>400</strong></td>
                    <td>คำขอไม่ถูกต้อง</td>
                    <td>ข้อมูลไม่ครบ, รูปแบบผิด</td>
                </tr>
                <tr>
                    <td><strong>401</strong></td>
                    <td>ยืนยันตัวตนไม่สำเร็จ</td>
                    <td>ไม่ได้ Login, Token หมดอายุ</td>
                </tr>
                <tr>
                    <td><strong>404</strong></td>
                    <td>ไม่พบข้อมูล</td>
                    <td>ID ไม่ถูกต้อง</td>
                </tr>
                <tr>
                    <td><strong>500</strong></td>
                    <td>เซิร์ฟเวอร์ผิดพลาด</td>
                    <td>ระบบขัดข้อง</td>
                </tr>
            </table>
        </div>

        <!-- Authentication Section -->
        <div class="card" id="auth">
            <h2>Authentication (การยืนยันตัวตน)</h2>
            <p>
                ระบบใช้ <strong>JWT (JSON Web Token)</strong> สำหรับยืนยันตัวตน ต้อง Login ก่อนเพื่อรับ Token แล้วนำ
                Token ไปใช้เรียก API อื่นๆ
            </p>

            <div class="endpoint">
                <div class="endpoint-header">
                    <span class="method post">POST</span>
                    <span class="url">/api/v1/public/auth/login</span>
                </div>
                <p class="desc">
                    <strong>ล็อกอินเข้าสู่ระบบ</strong> - ส่ง username และ password เพื่อรับ JWT Token
                </p>
            </div>

            <h3>ตัวอย่าง Request:</h3>
            <div class="code-block">
                {<br />
                <span class="key">"username"</span>: <span class="value">"admin"</span>,<br />
                <span class="key">"password"</span>: <span class="value">"password123"</span><br />
                }
            </div>

            <h3>ตัวอย่าง Response:</h3>
            <div class="code-block">
                {<br />
                <span class="key">"token"</span>:
                <span class="value">"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."</span>,<br />
                <span class="key">"user"</span>: { <span class="key">"id"</span>: <span class="value">1</span>,
                <span class="key">"name"</span>: <span class="value">"แอดมิน"</span>,
                <span class="key">"role"</span>: <span class="value">"admin"</span> }<br />
                }
            </div>

            <div class="endpoint">
                <div class="endpoint-header">
                    <span class="method post">POST</span>
                    <span class="url">/api/v1/public/auth/logout</span>
                    <span class="auth-badge">ต้อง Login</span>
                </div>
                <p class="desc"><strong>ออกจากระบบ</strong> - ฝั่ง Client ต้องลบ Token ออกจาก Storage</p>
            </div>

            <h3>วิธีใช้ Token เรียก API:</h3>
            <div class="code-block">
                <span class="comment">// ใส่ในส่วน Header ของ Request</span><br />
                <span class="key">Authorization</span>: Bearer
                <span class="value">eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...</span>
            </div>

            <h3>Token Expiration:</h3>
            <p>JWT Token มีอายุ 24 ชั่วโมง หลังจากหมดอายุต้อง Login ใหม่</p>
        </div>

        <!-- Profile Section -->
        <div class="card" id="profile">
            <h2>User Profile (โปรไฟล์ผู้ใช้)</h2>
            <p>ดึงข้อมูลผู้ใช้งานปัจจุบันจาก JWT Token</p>

            <div class="endpoint">
                <div class="endpoint-header">
                    <span class="method get">GET</span>
                    <span class="url">/api/v1/private/profile</span>
                    <span class="auth-badge">ต้อง Login</span>
                </div>
                <p class="desc"><strong>ดึงข้อมูลโปรไฟล์ผู้ใช้งานปัจจุบัน</strong> - ดึงข้อมูลจาก JWT Payload</p>
            </div>

            <h3>ตัวอย่าง Response:</h3>
            <div class="code-block">
                {<br />
                <span class="key">"message"</span>:
                <span class="value">"You are accessing a private route!"</span>,<br />
                <span class="key">"user"</span>: {<br />
                &nbsp;&nbsp;<span class="key">"id"</span>: <span class="value">1</span>,<br />
                &nbsp;&nbsp;<span class="key">"username"</span>: <span class="value">"admin"</span>,<br />
                &nbsp;&nbsp;<span class="key">"name"</span>: <span class="value">"แอดมิน"</span>,<br />
                &nbsp;&nbsp;<span class="key">"role"</span>: <span class="value">"admin"</span>,<br />
                &nbsp;&nbsp;<span class="key">"iat"</span>: <span class="value">1234567890</span>,<br />
                &nbsp;&nbsp;<span class="key">"exp"</span>: <span class="value">1234654290</span><br />
                }<br />
                }
            </div>
        </div>

        <!-- Employees Section -->
        <div class="card" id="employees">
            <h2>Employees (พนักงาน)</h2>
            <p>จัดการข้อมูลพนักงาน เช่น ช่างซ่อม, แอดมิน, ผู้จัดการ</p>

            <div class="endpoint">
                <div class="endpoint-header">
                    <span class="method get">GET</span>
                    <span class="url">/api/v1/private/employees</span>
                    <span class="auth-badge">ต้อง Login</span>
                </div>
                <p class="desc"><strong>ดึงรายการพนักงานทั้งหมด</strong> - รองรับ Pagination (?page=1&limit=10)</p>
            </div>

            <div class="endpoint">
                <div class="endpoint-header">
                    <span class="method post">POST</span>
                    <span class="url">/api/v1/private/employees</span>
                    <span class="auth-badge">ต้อง Login</span>
                </div>
                <p class="desc"><strong>เพิ่มพนักงานใหม่</strong> - ส่งข้อมูล name, role, username, password</p>
            </div>

            <div class="endpoint">
                <div class="endpoint-header">
                    <span class="method delete">DELETE</span>
                    <span class="url">/api/v1/private/employees/:id</span>
                    <span class="auth-badge">ต้อง Login</span>
                </div>
                <p class="desc"><strong>ลบพนักงาน</strong> - ระบุ ID ของพนักงานที่ต้องการลบ</p>
            </div>

            <h3>ข้อมูลพนักงาน:</h3>
            <table>
                <tr>
                    <th>Field</th>
                    <th>Type</th>
                    <th>คำอธิบาย</th>
                </tr>
                <tr>
                    <td>id</td>
                    <td>Integer</td>
                    <td>รหัสพนักงาน (Auto)</td>
                </tr>
                <tr>
                    <td>name</td>
                    <td>String</td>
                    <td>ชื่อ-นามสกุล</td>
                </tr>
                <tr>
                    <td>role</td>
                    <td>String</td>
                    <td>ตำแหน่ง (admin, technician, manager)</td>
                </tr>
                <tr>
                    <td>username</td>
                    <td>String</td>
                    <td>ชื่อผู้ใช้สำหรับ Login</td>
                </tr>
                <tr>
                    <td>isActive</td>
                    <td>Boolean</td>
                    <td>สถานะการใช้งาน</td>
                </tr>
            </table>
        </div>

        <!-- Customers Section -->
        <div class="card" id="customers">
            <h2>Customers (ลูกค้า)</h2>
            <p>จัดการข้อมูลลูกค้าที่มาใช้บริการซ่อมรถ</p>

            <div class="endpoint">
                <div class="endpoint-header">
                    <span class="method get">GET</span>
                    <span class="url">/api/v1/private/customers</span>
                    <span class="auth-badge">ต้อง Login</span>
                </div>
                <p class="desc"><strong>ดึงรายการลูกค้าทั้งหมด</strong> - รองรับ Pagination</p>
            </div>

            <div class="endpoint">
                <div class="endpoint-header">
                    <span class="method get">GET</span>
                    <span class="url">/api/v1/private/customers/:id</span>
                    <span class="auth-badge">ต้อง Login</span>
                </div>
                <p class="desc"><strong>ดึงข้อมูลลูกค้ารายบุคคล</strong></p>
            </div>

            <div class="endpoint">
                <div class="endpoint-header">
                    <span class="method post">POST</span>
                    <span class="url">/api/v1/private/customers</span>
                    <span class="auth-badge">ต้อง Login</span>
                </div>
                <p class="desc"><strong>เพิ่มลูกค้าใหม่</strong></p>
            </div>

            <div class="endpoint">
                <div class="endpoint-header">
                    <span class="method patch">PATCH</span>
                    <span class="url">/api/v1/private/customers/:id</span>
                    <span class="auth-badge">ต้อง Login</span>
                </div>
                <p class="desc"><strong>แก้ไขข้อมูลลูกค้า</strong></p>
            </div>

            <div class="endpoint">
                <div class="endpoint-header">
                    <span class="method delete">DELETE</span>
                    <span class="url">/api/v1/private/customers/:id</span>
                    <span class="auth-badge">ต้อง Login</span>
                </div>
                <p class="desc"><strong>ลบลูกค้า</strong></p>
            </div>

            <h3>ข้อมูลลูกค้า:</h3>
            <table>
                <tr>
                    <th>Field</th>
                    <th>Type</th>
                    <th>คำอธิบาย</th>
                </tr>
                <tr>
                    <td>id</td>
                    <td>Integer</td>
                    <td>รหัสลูกค้า (Auto)</td>
                </tr>
                <tr>
                    <td>name</td>
                    <td>String</td>
                    <td>ชื่อลูกค้า</td>
                </tr>
                <tr>
                    <td>phone</td>
                    <td>String</td>
                    <td>เบอร์โทรศัพท์</td>
                </tr>
                <tr>
                    <td>address</td>
                    <td>String</td>
                    <td>ที่อยู่</td>
                </tr>
            </table>
        </div>

        <!-- Vehicles Section -->
        <div class="card" id="vehicles">
            <h2>Vehicles (ยานพาหนะ)</h2>
            <p>จัดการข้อมูลรถของลูกค้า รวมถึงยี่ห้อรถและประเภทรถ</p>

            <h3>รถยนต์ (Vehicles)</h3>
            <div class="endpoint">
                <div class="endpoint-header">
                    <span class="method get">GET</span>
                    <span class="url">/api/v1/private/vehicles</span>
                    <span class="auth-badge">ต้อง Login</span>
                </div>
                <p class="desc"><strong>ดึงรายการรถทั้งหมด</strong> - รองรับ Pagination (?page=1&limit=10) และการค้นหา
                    (?q=คำค้นหา)</p>
            </div>

            <div class="endpoint">
                <div class="endpoint-header">
                    <span class="method get">GET</span>
                    <span class="url">/api/v1/private/vehicles/:id</span>
                    <span class="auth-badge">ต้อง Login</span>
                </div>
                <p class="desc"><strong>ดึงข้อมูลรถรายบุคคล</strong> - ระบุ ID ของรถ</p>
            </div>

            <div class="endpoint">
                <div class="endpoint-header">
                    <span class="method post">POST</span>
                    <span class="url">/api/v1/private/vehicles</span>
                    <span class="auth-badge">ต้อง Login</span>
                </div>
                <p class="desc"><strong>เพิ่มรถใหม่</strong> - ต้องระบุทะเบียน, ยี่ห้อ, และ customerId</p>
            </div>

            <div class="endpoint">
                <div class="endpoint-header">
                    <span class="method patch">PATCH</span>
                    <span class="url">/api/v1/private/vehicles/:id</span>
                    <span class="auth-badge">ต้อง Login</span>
                </div>
                <p class="desc"><strong>แก้ไขข้อมูลรถ</strong></p>
            </div>

            <div class="endpoint">
                <div class="endpoint-header">
                    <span class="method delete">DELETE</span>
                    <span class="url">/api/v1/private/vehicles/:id</span>
                    <span class="auth-badge">ต้อง Login</span>
                </div>
                <p class="desc"><strong>ลบรถ</strong></p>
            </div>

            <h3>ยี่ห้อรถ (Vehicle Brands)</h3>
            <div class="endpoint">
                <div class="endpoint-header">
                    <span class="method get">GET</span>
                    <span class="url">/api/v1/private/vehicles/brands</span>
                    <span class="auth-badge">ต้อง Login</span>
                </div>
                <p class="desc"><strong>ดึงรายการยี่ห้อรถทั้งหมด</strong></p>
            </div>

            <div class="endpoint">
                <div class="endpoint-header">
                    <span class="method get">GET</span>
                    <span class="url">/api/v1/private/vehicles/brands/:id</span>
                    <span class="auth-badge">ต้อง Login</span>
                </div>
                <p class="desc"><strong>ดึงข้อมูลยี่ห้อรถรายบุคคล</strong> - ระบุ ID ของยี่ห้อรถ</p>
            </div>

            <div class="endpoint">
                <div class="endpoint-header">
                    <span class="method post">POST</span>
                    <span class="url">/api/v1/private/vehicles/brands</span>
                    <span class="auth-badge">ต้อง Login</span>
                </div>
                <p class="desc"><strong>เพิ่มยี่ห้อรถใหม่</strong> - ต้องระบุ code, name, nameEn, country</p>
            </div>

            <div class="endpoint">
                <div class="endpoint-header">
                    <span class="method patch">PATCH</span>
                    <span class="url">/api/v1/private/vehicles/brands/:id</span>
                    <span class="auth-badge">ต้อง Login</span>
                </div>
                <p class="desc"><strong>แก้ไขยี่ห้อรถ</strong></p>
            </div>

            <div class="endpoint">
                <div class="endpoint-header">
                    <span class="method delete">DELETE</span>
                    <span class="url">/api/v1/private/vehicles/brands/:id</span>
                    <span class="auth-badge">ต้อง Login</span>
                </div>
                <p class="desc"><strong>ลบยี่ห้อรถ</strong></p>
            </div>

            <h3>ประเภทรถ (Vehicle Types)</h3>
            <div class="endpoint">
                <div class="endpoint-header">
                    <span class="method get">GET</span>
                    <span class="url">/api/v1/private/vehicles/types</span>
                    <span class="auth-badge">ต้อง Login</span>
                </div>
                <p class="desc"><strong>ดึงรายการประเภทรถ</strong> - เช่น SUV, Sedan, Pickup</p>
            </div>

            <div class="endpoint">
                <div class="endpoint-header">
                    <span class="method get">GET</span>
                    <span class="url">/api/v1/private/vehicles/types/:id</span>
                    <span class="auth-badge">ต้อง Login</span>
                </div>
                <p class="desc"><strong>ดึงข้อมูลประเภทรถรายบุคคล</strong> - ระบุ ID ของประเภทรถ</p>
            </div>

            <div class="endpoint">
                <div class="endpoint-header">
                    <span class="method post">POST</span>
                    <span class="url">/api/v1/private/vehicles/types</span>
                    <span class="auth-badge">ต้อง Login</span>
                </div>
                <p class="desc"><strong>เพิ่มประเภทรถใหม่</strong> - ต้องระบุ code, name, nameEn</p>
            </div>

            <div class="endpoint">
                <div class="endpoint-header">
                    <span class="method patch">PATCH</span>
                    <span class="url">/api/v1/private/vehicles/types/:id</span>
                    <span class="auth-badge">ต้อง Login</span>
                </div>
                <p class="desc"><strong>แก้ไขประเภทรถ</strong></p>
            </div>

            <div class="endpoint">
                <div class="endpoint-header">
                    <span class="method delete">DELETE</span>
                    <span class="url">/api/v1/private/vehicles/types/:id</span>
                    <span class="auth-badge">ต้อง Login</span>
                </div>
                <p class="desc"><strong>ลบประเภทรถ</strong></p>
            </div>

            <h3>ข้อมูลรถ:</h3>
            <table>
                <tr>
                    <th>Field</th>
                    <th>Type</th>
                    <th>คำอธิบาย</th>
                </tr>
                <tr>
                    <td>id</td>
                    <td>Integer</td>
                    <td>รหัสรถ (Auto)</td>
                </tr>
                <tr>
                    <td>registration</td>
                    <td>String</td>
                    <td>เลขทะเบียนรถ</td>
                </tr>
                <tr>
                    <td>brand</td>
                    <td>String</td>
                    <td>ยี่ห้อ</td>
                </tr>
                <tr>
                    <td>model</td>
                    <td>String</td>
                    <td>รุ่น</td>
                </tr>
                <tr>
                    <td>year</td>
                    <td>String</td>
                    <td>ปี</td>
                </tr>
                <tr>
                    <td>color</td>
                    <td>String</td>
                    <td>สี</td>
                </tr>
                <tr>
                    <td>customerId</td>
                    <td>Integer</td>
                    <td>รหัสลูกค้าเจ้าของรถ</td>
                </tr>
            </table>

            <h3>ข้อมูลยี่ห้อรถ (Vehicle Brand):</h3>
            <table>
                <tr>
                    <th>Field</th>
                    <th>Type</th>
                    <th>คำอธิบาย</th>
                </tr>
                <tr>
                    <td>id</td>
                    <td>Integer</td>
                    <td>รหัสยี่ห้อรถ (Auto)</td>
                </tr>
                <tr>
                    <td>code</td>
                    <td>String</td>
                    <td>รหัสยี่ห้อ (เช่น toyota, honda)</td>
                </tr>
                <tr>
                    <td>name</td>
                    <td>String</td>
                    <td>ชื่อยี่ห้อ (ภาษาไทย)</td>
                </tr>
                <tr>
                    <td>nameEn</td>
                    <td>String</td>
                    <td>ชื่อยี่ห้อ (ภาษาอังกฤษ)</td>
                </tr>
                <tr>
                    <td>country</td>
                    <td>String</td>
                    <td>ประเทศผู้ผลิต</td>
                </tr>
                <tr>
                    <td>logoUrl</td>
                    <td>String</td>
                    <td>URL รูปโลโก้ยี่ห้อรถ (Optional)</td>
                </tr>
            </table>

            <h3>ข้อมูลประเภทรถ (Vehicle Type):</h3>
            <table>
                <tr>
                    <th>Field</th>
                    <th>Type</th>
                    <th>คำอธิบาย</th>
                </tr>
                <tr>
                    <td>id</td>
                    <td>Integer</td>
                    <td>รหัสประเภทรถ (Auto)</td>
                </tr>
                <tr>
                    <td>code</td>
                    <td>String</td>
                    <td>รหัสประเภท (เช่น suv, sedan)</td>
                </tr>
                <tr>
                    <td>name</td>
                    <td>String</td>
                    <td>ชื่อประเภท (ภาษาไทย)</td>
                </tr>
                <tr>
                    <td>nameEn</td>
                    <td>String</td>
                    <td>ชื่อประเภท (ภาษาอังกฤษ)</td>
                </tr>
            </table>
        </div>

        <!-- Insurances Section -->
        <div class="card" id="insurances">
            <h2>Insurance Companies (บริษัทประกัน)</h2>
            <p>จัดการข้อมูลบริษัทประกันภัยที่พ่วงกับงานซ่อม (Claim)</p>

            <div class="endpoint">
                <div class="endpoint-header">
                    <span class="method get">GET</span>
                    <span class="url">/api/v1/private/insurances</span>
                    <span class="auth-badge">ต้อง Login</span>
                </div>
                <p class="desc">
                    <strong>ดึงรายการบริษัทประกันทั้งหมด</strong> - รองรับ Pagination และการค้นหา (?q=ชื่อหรือเบอร์โทร)
                </p>
            </div>

            <div class="endpoint">
                <div class="endpoint-header">
                    <span class="method get">GET</span>
                    <span class="url">/api/v1/private/insurances/:id</span>
                    <span class="auth-badge">ต้อง Login</span>
                </div>
                <p class="desc"><strong>ดึงข้อมูลบริษัทประกันรายบุคคล</strong> - ระบุ ID ของบริษัทประกัน</p>
            </div>

            <div class="endpoint">
                <div class="endpoint-header">
                    <span class="method post">POST</span>
                    <span class="url">/api/v1/private/insurances</span>
                    <span class="auth-badge">ต้อง Login</span>
                </div>
                <p class="desc"><strong>เพิ่มบริษัทประกันใหม่</strong> - ส่งข้อมูล name, contactPhone, logoUrl</p>
            </div>

            <div class="endpoint">
                <div class="endpoint-header">
                    <span class="method put">PUT</span>
                    <span class="url">/api/v1/private/insurances/:id</span>
                    <span class="auth-badge">ต้อง Login</span>
                </div>
                <p class="desc"><strong>แก้ไขข้อมูลบริษัทประกัน</strong></p>
            </div>

            <div class="endpoint">
                <div class="endpoint-header">
                    <span class="method delete">DELETE</span>
                    <span class="url">/api/v1/private/insurances/:id</span>
                    <span class="auth-badge">ต้อง Login</span>
                </div>
                <p class="desc"><strong>ลบบริษัทประกัน</strong></p>
            </div>

            <h3>ข้อมูลบริษัทประกัน:</h3>
            <table>
                <tr>
                    <th>Field</th>
                    <th>Type</th>
                    <th>คำอธิบาย</th>
                </tr>
                <tr>
                    <td>id</td>
                    <td>Integer</td>
                    <td>รหัสบริษัทประกัน (Auto)</td>
                </tr>
                <tr>
                    <td>name</td>
                    <td>String</td>
                    <td>ชื่อบริษัทประกัน</td>
                </tr>
                <tr>
                    <td>contactPhone</td>
                    <td>String</td>
                    <td>เบอร์โทรศัพท์ติดต่อ (เช่น 1557)</td>
                </tr>
                <tr>
                    <td>logoUrl</td>
                    <td>String</td>
                    <td>URL รูปโลโก้บริษัท</td>
                </tr>
                <tr>
                    <td>isActive</td>
                    <td>Boolean</td>
                    <td>สถานะการใช้งาน</td>
                </tr>
            </table>
        </div>

        <!-- Jobs Section -->
        <div class="card" id="jobs">
            <h2>Jobs (งานซ่อม)</h2>
            <p>จัดการข้อมูลงานซ่อมรถ ติดตามสถานะการซ่อม</p>

            <div class="endpoint">
                <div class="endpoint-header">
                    <span class="method get">GET</span>
                    <span class="url">/api/v1/private/jobs</span>
                    <span class="auth-badge">ต้อง Login</span>
                </div>
                <p class="desc"><strong>ดึงรายการงานซ่อมทั้งหมด</strong> - รองรับ Pagination และการกรองข้อมูลหลายแบบ</p>

                <h4 style="margin-top: 1rem; font-size: 0.95rem; color: var(--dark);">พารามิเตอร์การค้นหา (Query
                    Parameters):</h4>
                <table style="font-size: 0.8rem;">
                    <tr>
                        <th>พารามิเตอร์</th>
                        <th>คำอธิบาย</th>
                        <th>ตัวอย่าง</th>
                    </tr>
                    <tr>
                        <td><code>page</code></td>
                        <td>หน้าที่ต้องการดึง (ค่าเริ่มต้น: 1)</td>
                        <td>?page=1</td>
                    </tr>
                    <tr>
                        <td><code>limit</code></td>
                        <td>จำนวนรายการต่อหน้า (ค่าเริ่มต้น: 10)</td>
                        <td>?limit=20</td>
                    </tr>
                    <tr>
                        <td><code>status</code></td>
                        <td>กรองตามสถานะงาน (CLAIM, REPAIR, BILLING, DONE)</td>
                        <td>?status=CLAIM</td>
                    </tr>
                    <tr>
                        <td><code>search</code></td>
                        <td>ค้นหาทั่วไป (ทะเบียนรถ, ชื่อลูกค้า, เลขตัวถัง, VIN, เลขที่งาน)</td>
                        <td>?search=กข-1234</td>
                    </tr>
                    <tr>
                        <td><code>vehicleRegistration</code><br />หรือ <code>registration</code></td>
                        <td>กรองตามทะเบียนรถ</td>
                        <td>?vehicleRegistration=กข-1234</td>
                    </tr>
                    <tr>
                        <td><code>customerName</code><br />หรือ <code>customer</code></td>
                        <td>กรองตามชื่อลูกค้า</td>
                        <td>?customerName=สมชาย</td>
                    </tr>
                    <tr>
                        <td><code>chassisNumber</code><br />หรือ <code>chassis</code></td>
                        <td>กรองตามเลขตัวถัง</td>
                        <td>?chassisNumber=CHASSIS-001</td>
                    </tr>
                    <tr>
                        <td><code>vinNumber</code><br />หรือ <code>vin</code></td>
                        <td>กรองตามหมายเลข VIN</td>
                        <td>?vinNumber=VIN-TEST-001</td>
                    </tr>
                    <tr>
                        <td><code>jobNumber</code></td>
                        <td>กรองตามเลขที่งาน</td>
                        <td>?jobNumber=JOB-001</td>
                    </tr>
                    <tr>
                        <td><code>insuranceCompanyId</code></td>
                        <td>กรองตามบริษัทประกัน (ระบุ ID)</td>
                        <td>?insuranceCompanyId=1</td>
                    </tr>
                    <tr>
                        <td><code>startDateFrom</code></td>
                        <td>กรองงานที่เริ่มตั้งแต่วันที่ (รูปแบบ YYYY-MM-DD)</td>
                        <td>?startDateFrom=2026-01-01</td>
                    </tr>
                    <tr>
                        <td><code>startDateTo</code></td>
                        <td>กรองงานที่เริ่มก่อนหรือในวันที่ (รูปแบบ YYYY-MM-DD)</td>
                        <td>?startDateTo=2026-01-31</td>
                    </tr>
                    <tr>
                        <td><code>sortBy</code></td>
                        <td>เรียงลำดับตามฟิลด์ที่ระบุ (jobNumber, startDate, status, createdAt, updatedAt,
                            estimatedEndDate, actualEndDate)</td>
                        <td>?sortBy=startDate</td>
                    </tr>
                    <tr>
                        <td><code>sortOrder</code></td>
                        <td>ลำดับการเรียง - asc (น้อยไปมาก) หรือ desc (มากไปน้อย) ค่าเริ่มต้น: desc</td>
                        <td>?sortOrder=asc</td>
                    </tr>
                </table>

                <h4 style="margin-top: 1rem; font-size: 0.95rem; color: var(--dark);">ตัวอย่างการใช้งาน:</h4>
                <div class="code-block" style="margin: 0.5rem 0; font-size: 0.75rem;">
                    <span class="comment">// ค้นหาทั่วไปด้วยทะเบียนรถ</span><br />
                    GET /api/v1/private/jobs?search=กข-1234<br /><br />

                    <span class="comment">// กรองตามสถานะและชื่อลูกค้า</span><br />
                    GET /api/v1/private/jobs?status=REPAIR&customerName=สมชาย<br /><br />

                    <span class="comment">// กรองตามช่วงวันที่</span><br />
                    GET /api/v1/private/jobs?startDateFrom=2026-01-01&startDateTo=2026-01-31<br /><br />

                    <span class="comment">// ค้นหาจากเลขตัวถัง + Pagination</span><br />
                    GET /api/v1/private/jobs?chassisNumber=CHASSIS-001&page=1&limit=10<br /><br />

                    <span class="comment">// เรียงลำดับตามวันที่เริ่มงาน (จากเก่าไปใหม่)</span><br />
                    GET /api/v1/private/jobs?sortBy=startDate&sortOrder=asc<br /><br />

                    <span class="comment">// เรียงลำดับตามเลขที่งานจากมากไปน้อย</span><br />
                    GET /api/v1/private/jobs?sortBy=jobNumber&sortOrder=desc
                </div>
            </div>

            <div class="endpoint">
                <div class="endpoint-header">
                    <span class="method get">GET</span>
                    <span class="url">/api/v1/private/jobs/:id</span>
                    <span class="auth-badge">ต้อง Login</span>
                </div>
                <p class="desc"><strong>ดึงรายละเอียดงานซ่อม</strong></p>
            </div>

            <div class="endpoint">
                <div class="endpoint-header">
                    <span class="method post">POST</span>
                    <span class="url">/api/v1/private/jobs</span>
                    <span class="auth-badge">ต้อง Login</span>
                </div>
                <p class="desc"><strong>สร้างงานซ่อมใหม่</strong> - ต้องระบุ vehicleId</p>
            </div>

            <h3>ข้อมูลงานซ่อม:</h3>
            <table>
                <tr>
                    <th>Field</th>
                    <th>Type</th>
                    <th>คำอธิบาย</th>
                </tr>
                <tr>
                    <td>id</td>
                    <td>Integer</td>
                    <td>รหัสงาน (Auto)</td>
                </tr>
                <tr>
                    <td>jobNumber</td>
                    <td>String</td>
                    <td>เลขที่งาน (Auto Generate)</td>
                </tr>
                <tr>
                    <td>vehicleId</td>
                    <td>Integer</td>
                    <td>รหัสรถที่ซ่อม (ต้องระบุ)</td>
                </tr>
                <tr>
                    <td>customerId</td>
                    <td>Integer</td>
                    <td>รหัสลูกค้า</td>
                </tr>
                <tr>
                    <td>insuranceCompanyId</td>
                    <td>Integer</td>
                    <td>รหัสบริษัทประกัน (Optional)</td>
                </tr>
                <tr>
                    <td>paymentType</td>
                    <td>String</td>
                    <td>ประเภทการชำระ (cash, insurance)</td>
                </tr>
                <tr>
                    <td>repairDescription</td>
                    <td>String</td>
                    <td>รายละเอียดการซ่อม</td>
                </tr>
                <tr>
                    <td>excessFee</td>
                    <td>Number</td>
                    <td>ค่าเบิกจ่ายขั้นต่ำ (Optional)</td>
                </tr>
                <tr>
                    <td>notes</td>
                    <td>String</td>
                    <td>หมายเหตุเพิ่มเติม (Optional)</td>
                </tr>
                <tr>
                    <td>status</td>
                    <td>String</td>
                    <td>สถานะ (CLAIM, REPAIR, BILLING, DONE)</td>
                </tr>
                <tr>
                    <td>startDate</td>
                    <td>DateTime</td>
                    <td>วันที่เริ่มงาน</td>
                </tr>
                <tr>
                    <td>estimatedEndDate</td>
                    <td>DateTime</td>
                    <td>วันที่คาดว่าจะเสร็จ</td>
                </tr>
                <tr>
                    <td>actualEndDate</td>
                    <td>DateTime</td>
                    <td>วันที่เสร็จจริง</td>
                </tr>
                <tr>
                    <td>createdAt</td>
                    <td>DateTime</td>
                    <td>วันที่สร้างเอกสาร</td>
                </tr>
                <tr>
                    <td>updatedAt</td>
                    <td>DateTime</td>
                    <td>วันที่แก้ไขล่าสุด</td>
                </tr>
                </tr>
            </table>

            <h3>ข้อมูลขั้นตอนย่อย (Job Steps) - ภายใน Job Stages ที่กำลังดำเนินการ</h3>
            <p>ในแต่ละ Job จะมี <code>jobStages</code> (เช่น CLAIM, REPAIR) และภายในจะมี <code>jobSteps</code>
                เป็นขั้นตอนย่อย</p>
            <table>
                <tr>
                    <th>Field</th>
                    <th>Type</th>
                    <th>คำอธิบาย</th>
                </tr>
                <tr>
                    <td>id</td>
                    <td>Integer</td>
                    <td>รหัสขั้นตอนย่อย</td>
                </tr>
                <tr>
                    <td>status</td>
                    <td>String</td>
                    <td>สถานะ (pending, in_progress, completed)</td>
                </tr>
                <tr>
                    <td>stepTemplate</td>
                    <td>Object</td>
                    <td>ข้อมูลแม่แบบขั้นตอน (ชื่อขั้นตอน)</td>
                </tr>
                <tr>
                    <td>completedAt</td>
                    <td>DateTime?</td>
                    <td>วันที่ทำเสร็จ</td>
                </tr>
            </table>

            <h3>ขั้นตอนงานซ่อม (Workflow)</h3>
            <div class="mermaid-container">
                <div class="mermaid">
                    flowchart LR
                    subgraph S1["1. CLAIM (เคลม)"]
                    direction TB
                    A1["1. ยื่นเคลม"] --> A2["2. เช็ครายการ"]
                    A2 --> A3["3. ขอราคา"]
                    A3 --> A4["4. เสนอราคา"]
                    A4 --> A5["5. ส่งประกัน"]
                    A5 --> A6["6. อนุมัติ"]
                    A6 --> A7["7. หาอะไหล่"]
                    A7 --> A8["8. สั่งอะไหล่"]
                    A8 --> A9["9. อะไหล่ครบ"]
                    A9 --> A10["10. นัดคิวเข้า"]
                    A10 --> A11["11. ลูกค้าเข้าจอด"]
                    A11 --> A12["12. เสนอเพิ่ม"]
                    A12 --> A13["13. รถเสร็จ"]
                    end
                    subgraph S2["2. REPAIR (ซ่อม) - ข้ามได้ยกเว้น ★"]
                    direction TB
                    B1["1. รื้อ/ถอด"] --> B2["2. เคาะ"]
                    B2 --> B3["3. เคาะ เบิกอะไหล่"]
                    B3 --> B4["4. โป้วสี"]
                    B4 --> B5["5. พ่นสีพื้น"]
                    B5 --> B6["6. พ่นสีจริง"]
                    B6 --> B7["7. ประกอบเบิกอะไหล่"]
                    B7 --> B8["8. ขัดสี"]
                    B8 --> B9["9. ล้างรถ"]
                    B9 --> B10["★ 10. QC"]
                    B10 --> B11["★ 11. ลูกค้ารับรถ"]
                    end
                    subgraph S3["3. BILLING (ตั้งเบิก)"]
                    direction TB
                    C1["1. รถเสร็จ"] --> C2["2. เรียงรูป"]
                    C2 --> C3["3. ส่งอนุมัติ"]
                    C3 --> C4["4. อนุมัติเสร็จ"]
                    C4 --> C5["5. ออกใบกำกับภาษี"]
                    C5 --> C6["6. เรียงเรื่อง"]
                    C6 --> C7["7. นำเรื่องตั้งเบิก"]
                    C7 --> C8["8. วันจ่ายเงิน"]
                    end
                    S1 --> S2
                    S2 --> S3
                    S3 --> D["DONE (เสร็จสิ้น)"]
                </div>
            </div>
        </div>

        <!-- Utility Section -->
        <div class="card">
            <h2>Utility Endpoints</h2>

            <div class="endpoint">
                <div class="endpoint-header">
                    <span class="method get">GET</span>
                    <span class="url">/health</span>
                </div>
                <p class="desc"><strong>Health Check</strong> - ตรวจสอบสถานะ Server</p>
            </div>

            <div class="endpoint">
                <div class="endpoint-header">
                    <span class="method get">GET</span>
                    <span class="url">/doc</span>
                </div>
                <p class="desc"><strong>OpenAPI Spec</strong> - ดาวน์โหลด OpenAPI JSON</p>
            </div>

            <div class="endpoint">
                <div class="endpoint-header">
                    <span class="method get">GET</span>
                    <span class="url">/ui</span>
                </div>
                <p class="desc"><strong>Swagger UI</strong> - หน้าทดสอบ API</p>
            </div>
        </div>

        <footer>
            <p>SP Auto Service API Documentation (Thai)</p>
            <p>ระบบจัดการอู่ซ่อมรถ - บริษัท เอส.พี.ออโต้เพ้นท์ เซอร์วิส จำกัด</p>
            <p style="margin-top: 0.5rem; font-size: 0.8rem">Powered by Bun + Hono + Prisma</p>
        </footer>
    </div>
</body>

</html>`;
